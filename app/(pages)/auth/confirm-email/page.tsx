'use client';

import AppButton from '@/app/components/AppButton';
import OTPInput from '@/app/components/OtpInput';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLoading from '@/app/hooks/useLoading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { sendForgottenOTP, verifyForgottenOTP } from '@/app/api/authApi';
import { getLocalStorageItem } from '@/app/utils/localStorage';

const ConfirmEmail = () => {
  const router = useRouter();
  const { isLoading, hideLoader, showLoader } = useLoading();
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
   const [otp, setOtp] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const email = getLocalStorageItem('email');

  const handleResendOTP = async () => {
    const userData = {
      email: email,
    };
    try {
      const response = await sendForgottenOTP(userData);
      if (response.success === true) {
        toast.success(response.message);
        setTimer(10);
        setCanResend(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'OTP fetching failed');
      }
      console.error('OTP error:', error);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    // console.log('Completed OTP:', otp);
      if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
        toast.error('Invalid OTP');
        return;
      }
    const userData = {
      otp: otp,
      email: email,
    };
    showLoader();
    try {
      const response = await verifyForgottenOTP(userData);
      if (response.success === true) {
        hideLoader();
        setTimeout(() => {
          router.push('/auth/create-password');
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
      console.error('verify OTP error:', error);
    }
  };

   const handleVerifyClick = () => {
     if (otp.length === 4) {
       handleOTPComplete(otp);
     } else {
       toast.error('Please enter a valid 4-digit OTP');
     }
   };

  return (
    <div className="flex flex-col gap-6 px-8">
      <div
        onClick={() => router.push('/auth/forgot-password')}
        className="border border-grey-600 p-1 gap-2 w-[77px] rounded-[4px] flex items-center"
      >
        <ArrowLeft size={24} />
        <p className="text-base text-dark-300">Back</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-dark-100 font-bold text-2xl">Verify your email</p>
          <p className="text-sm text-grey-700">
            Input the verification codes sent to your email below.
          </p>
        </div>
        <OTPInput
          onChange={(value) => setOtp(value)}
          onComplete={handleOTPComplete}
        />
        <div>
          {!canResend ? (
            <p className="font-semibold text-sm text-dark-400">
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              className="font-semibold text-sm text-blue-500"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>
          )}
        </div>
        <AppButton
          btnText="Verify OTP"
          onClick={handleVerifyClick}
          isLoading={isLoading}
          disabled={isLoading || otp.length !== 4}
        />
      </div>
    </div>
  );
};

export default ConfirmEmail;
