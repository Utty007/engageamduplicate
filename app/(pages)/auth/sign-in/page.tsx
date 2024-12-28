'use client';

import Google from '@/app/assets/svgs/google.svg';
import AppButton from '@/app/components/AppButton';
import AppInput from '@/app/components/AppInput';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from '@/app/utils/validationSchema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { loginUser, sendOTP } from '@/app/api/authApi';
import axios from 'axios';
import useLoading from '@/app/hooks/useLoading';
import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/app/utils/localStorage';

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn = () => {
  const router = useRouter();
  const { isLoading, hideLoader, showLoader } = useLoading();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    const userData = {
      email: data.email,
      password: data.password,
    };
    showLoader();
    try {
      const response = await loginUser(userData);

      if (response.success === true) {
        hideLoader();
        setLocalStorageItem('token', response.data.token);
        setLocalStorageItem('email', response.data.email);
        setLocalStorageItem('firstname', response.data.firstname);
        setLocalStorageItem('lastname', response.data.lastname);
        setLocalStorageItem('username', response.data.login);

        if (
          response.data.status === 0 ||
          response.message === 'Account not activated.'
        ) {
          // Send OTP before redirecting
          const otpResponse = await sendOTP({
            email: response.data.email,
          });
          if (otpResponse.success === true) {
            toast.success(otpResponse.message);
          }
          toast.error(`${response.message} Please check your email.`);
          router.push('/auth/verify-email');
        } else if (
          response.data.status === 2 ||
          response.message === 'Account has been banned.'
        ) {
          toast.error(response.message);
          removeLocalStorageItem('token');
          removeLocalStorageItem('email');
          removeLocalStorageItem('firstname');
          removeLocalStorageItem('lastname');
          removeLocalStorageItem('username');
          removeLocalStorageItem('userData');
          reset({
            email: '',
            password: '',
          });
          router.push('/');
        } else {
          setTimeout(() => {
            router.push('/dashboard');
          }, 500);
          toast.success(response?.message);
        }
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <section className="flex flex-col gap-6 items-center px-8">
      <div className="flex flex-col gap-6">
        <p className="text-dark-100 font-bold text-2xl">Login</p>
        <div className="flex border-[1.5px] cursor-pointer gap-3 border-grey-100 rounded-md p-4 justify-center lg:w-[476px] w-[350px]">
          <Google />
          <p className="text-dark-200 font-semibold">Sign up with Google</p>
        </div>
      </div>
      <p className="text-grey-200 text-sm text-center">Or</p>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
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
                  Forgot Password?{' '}
                  <Link
                    href="/auth/forgot-password"
                    className="text-primary cursor-pointer"
                  >
                    Recover
                  </Link>
                </p>
              }
            />
          </div>
          <AppButton
            disabled={isLoading}
            isLoading={isLoading}
            btnText="Verify"
          />
        </form>
        <div className="">
          <p className="text-grey-500 text-base">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-primary text-sm font-semibold cursor-pointer"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
