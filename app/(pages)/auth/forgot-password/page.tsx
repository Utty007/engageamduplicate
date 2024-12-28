'use client';

import AppButton from '@/app/components/AppButton';
import AppInput from '@/app/components/AppInput';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@/app/utils/validationSchema';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import useLoading from '@/app/hooks/useLoading';
import { sendForgottenOTP } from '@/app/api/authApi';
import { setLocalStorageItem } from '@/app/utils/localStorage';

interface forgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const { isLoading, hideLoader, showLoader } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<forgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: forgotPasswordFormValues) => {
    const userData = {
      email: data.email,
    };
    showLoader();
    try {
      const response = await sendForgottenOTP(userData);
      if (response.success === true) {
        hideLoader();
        setLocalStorageItem("email", response.data.email)
        setTimeout(() => {
          router.push('/auth/confirm-email');
        }, 500);
        toast.success(response?.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Email verification failed',
        );
      }
      console.error('Email verification error:', error);
    }
  };
  return (
    <div className="flex flex-col gap-6 items-start px-8">
      <div
        onClick={() => router.push('/')}
        className="border cursor-pointer border-grey-600 p-1 gap-2 w-[77px] rounded-[4px] flex items-center"
      >
        <ArrowLeft size={24} />
        <p className="text-base text-dark-300">Back</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-dark-100 font-bold text-2xl">
            Forgot your password
          </p>
          <p className="text-sm text-grey-700">
            Enter your email to receive a reset link
          </p>
        </div>
        <AppInput
          placeholder="example@gmail.com"
          label="Email"
          id="email"
          inputClassName="lg:!w-[476px] !w-[350px]"
          register={{ ...register('email') }}
          error={errors.email}
        />
        <AppButton
          disabled={isLoading || !isValid}
          isLoading={isLoading}
          btnText="Reset Password"
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
