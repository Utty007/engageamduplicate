'use client';

import AppInput from '@/app/components/AppInput';
import React from 'react';
import { FieldError, FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormData } from '@/app/(pages)/auth/media-info/page';

interface SocialLinksProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors;
}
const SocialLinks = ({ register, errors }: SocialLinksProps) => {
  return (
    <div className="flex flex-col gap-6 px-8">
      <div className="flex flex-col gap-2">
        <p className="text-dark-100 font-bold text-2xl">
          Almost there, add social media usernames
        </p>
        <p className="text-sm text-grey-700">
          Add your social media usernames
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AppInput
            placeholder="iamcheeh"
            label="Twitter"
            id="twitter"
            register={{ ...register('twitter') }}
            error={errors.twitter as FieldError | undefined}
          />
          <AppInput
            placeholder="iamcheeh"
            label="Tiktok"
            id="tiktok"
            register={{ ...register('tiktok') }}
            error={errors.tiktok as FieldError | undefined}
          />
          <AppInput
            placeholder="divinecheeh5"
            label="Instagram"
            id="instagram"
            inputClassName=""
            register={{ ...register('instagram') }}
            error={errors.instagram as FieldError | undefined}
          />
        </div>
      </div>
    </div>
  );
};
export default SocialLinks;
