'use client';

import AppButton from '@/app/components/AppButton';
import AppInput from '@/app/components/AppInput';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPasswordSchema } from '@/app/utils/validationSchema';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createPassword } from '@/app/api/authApi';
import useLoading from '@/app/hooks/useLoading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getLocalStorageItem } from '@/app/utils/localStorage';

interface CreatePasswordFormValues {
  password: string;
  confirmPassword: string;
}

const CreatePassword = () => {
  const { isLoading, hideLoader, showLoader } = useLoading();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePasswordFormValues>({
    resolver: yupResolver(createPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CreatePasswordFormValues) => {
    const email = getLocalStorageItem('email');
    const userData = {
      new_password: data.password,
      confirm_password: data.confirmPassword,
      email: email,
    };
    showLoader();
    try {
      const response = await createPassword(userData);

      if (response.success === true) {
        hideLoader();
        setTimeout(() => {
          router.push('/auth/password-success');
        }, 500);
        toast.success(response?.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Updating password failed',
        );
      }
      console.error('Update passsword error:', error);
    }
  };
  return (
    <div className="flex flex-col gap-6 px-8">
      <div className="flex flex-col gap-2">
        <p className="text-dark-100 font-bold text-2xl">
          Input your new password
        </p>
        <p className="text-sm text-grey-700">Enter your new password</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <AppInput
          placeholder="New password"
          label="Input new password"
          id="password"
          inputClassName="lg:!w-[476px] !w-[350px]"
          register={{ ...register('password') }}
          error={errors.password}
        />
        <AppInput
          placeholder="Confirm New password"
          label="Confirm new password"
          id="confirmPassword"
          inputClassName="lg:!w-[476px] !w-[350px]"
          register={{ ...register('confirmPassword') }}
          error={errors.confirmPassword}
        />
        <AppButton
          disabled={isLoading || !isValid}
          isLoading={isLoading}
          btnText="Confirm"
        />
      </form>
    </div>
  );
};

export default CreatePassword;
