'use client';

import AppButton from '@/app/components/AppButton';
import React from 'react';
import { useRouter } from 'next/navigation';

const PasswordSuccess = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 px-14">
      <div className="flex flex-col gap-2">
        <p className="text-dark-100 font-bold text-2xl">Password updated</p>
        <p className="text-sm text-grey-700">
          Your password has been updated, please login
        </p>
      </div>
      <AppButton
        onClick={() => router.push('/')}
        btnText="Go back to login"
      />
    </div>
  );
};

export default PasswordSuccess;
