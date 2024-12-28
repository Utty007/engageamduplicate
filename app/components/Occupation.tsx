'use client';

import AppInput from '@/app/components/AppInput';
import React from 'react';
import { FieldError, FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormData } from '@/app/(pages)/auth/media-info/page';

interface OccupationProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors;
}

export const skills = [
  'Content creator',
  'Social Media manager',
  'Digital marketer',
];
const Occupation = ({ register, errors }: OccupationProps) => {
  return (
    <div className="flex flex-col gap-6 px-8">
      <p className="font-bold text-2xl text-dark-100">Occupation</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {skills.map((item, index) => (
            <label
              key={index}
              className="flex justify-between border bg-white border-grey-100 rounded-lg p-4 lg:w-[476px] w-[350px]"
            >
              <p className="font-medium text-sm text-dark-200">{item}</p>
              <input
                value={item}
                type="radio"
                id="occupation"
                {...register('occupation')}
              />
            </label>
          ))}
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.occupation.message as string}
            </p>
          )}
        </div>
        <AppInput
          placeholder="specify yours"
          label="Enter others"
          id="others"
          register={{ ...register('others') }}
          error={errors.others as FieldError | undefined}
        />
      </div>
    </div>
  );
};

export default Occupation;
