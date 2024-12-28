import Image from 'next/image';
import React from 'react';
import onboarding from '@/app/assets/imgs/Onboarding.png';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <section className="flex items-center md:justify-center lg:justify-between 2xl:justify-between py-10 lg:py-3 2xl:pt-8">
        <div className="lg:px-30 2xl:px-60 md:px-30 flex items-center">
          {children}
        </div>
        <div className="hidden lg:block">
          <Image src={onboarding} alt="google" width={720} height={768} />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default AuthLayout;
