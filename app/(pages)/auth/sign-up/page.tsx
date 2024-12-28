'use client';

import Google from '@/app/assets/svgs/google.svg';
import AppButton from '@/app/components/AppButton';
import AppInput from '@/app/components/AppInput';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/app/utils/validationSchema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setLocalStorageItem } from '@/app/utils/localStorage';
import { createUser, sendOTP } from '@/app/api/authApi';
import useLoading from '@/app/hooks/useLoading';

interface SignUpFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignUp = () => {
  const router = useRouter();
  const { isLoading, hideLoader, showLoader } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const userData = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
    };
    showLoader();
    try {
      const response = await createUser(userData);

      if (response.success === true) {
        hideLoader();
        // Send OTP after successful signup
        const otpResponse = await sendOTP({
          email: response.data.email,
        });
        if (otpResponse.success === true) {
          toast.success(otpResponse.message);
        }
        setLocalStorageItem('token', response.data.token);
        setLocalStorageItem('email', response.data.email);
        setTimeout(() => {
          router.push('/auth/verify-email');
        }, 500);
        toast.success(response.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Creating user failed');
      }
      console.error('Create user error:', error);
    }
  };

  return (
    <section className="flex flex-col gap-6 items-center px-8">
      <div className="flex flex-col gap-6">
        <p className="text-dark-100 font-bold text-2xl">Sign up to PeerLink</p>
        <div className="flex border-[1.5px] gap-3 cursor-pointer border-grey-100 rounded-md p-4 justify-center w-[350px] lg:w-[476px]">
          <Google />
          <p className="text-dark-200 font-semibold">Sign up with Google</p>
        </div>
      </div>
      <p className="text-grey-200 text-sm text-center">Or</p>
      <div className="flex flex-col gap-6 items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <AppInput
              placeholder="example@abc.com"
              label="First Name"
              inputClassName="lg:!w-[476px] !w-[350px]"
              id="firstName"
              register={{ ...register('firstName') }}
              error={errors.firstName}
            />
            <AppInput
              placeholder="example@abc.com"
              label="Last Name"
              inputClassName="lg:!w-[476px] !w-[350px]"
              id="lastName"
              register={{ ...register('lastName') }}
              error={errors.lastName}
            />
            <AppInput
              placeholder="example@abc.com"
              label="Email"
              id="email"
              inputClassName="lg:!w-[476px] !w-[350px]"
              register={{ ...register('email') }}
              error={errors.email}
            />
            <AppInput
              placeholder="8+ character, please"
              label="Password"
              id="password"
              inputClassName="lg:!w-[476px] !w-[350px]"
              register={{ ...register('password') }}
              error={errors.password}
              hintText={
                <p className="text-grey-500 text-sm mt-1">
                  Password must contain a number, letter and a symbol.
                </p>
              }
            />
          </div>
          <AppButton
            disabled={isLoading || !isValid}
            isLoading={isLoading}
            btnText="Verify"
          />
        </form>
        <div className="flex flex-col gap-4 lg:px-5 md:px-10">
          <p className="text-grey-500 text-base">
            Already have an account?{' '}
            <Link
              href="/"
              className="text-primary text-sm font-semibold cursor-pointer"
            >
              Login
            </Link>
          </p>
          <p className="text-grey-500 text-sm md:w-96 lg:w-full">
            By signing in, you agree to the{' '}
            <span className="text-base text-primary cursor-pointer">
              Terms of Service
            </span>{' '}
            and
            <span className="text-base text-primary cursor-pointer">
              {' '}
              Privacy Policy{' '}
            </span>
            of PeerLink
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
