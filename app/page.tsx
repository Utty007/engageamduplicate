'use client';

import Image from 'next/image';
import SignIn from '@/app/(pages)/auth/sign-in/page';
import onboarding from '@/app/assets/imgs/Onboarding.png';
import ProtectedRoute from './components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <section className="flex justify-between pt-3">
        <div className="lg:px-30 2xl:px-60 px-10 flex items-center">
          <SignIn />
        </div>
        <div className="hidden lg:block">
          <Image
            src={onboarding}
            alt="google"
            className=""
            width={720}
            height={768}
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}
