import React from 'react';
import AppButton from './AppButton';
import AppInput from './AppInput';
import { CheckIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { securitySchema } from '../utils/validationSchema';
import useLoading from '../hooks/useLoading';
import { updatePassword } from '../api/userApi';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SecurityFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Security = () => {
  const { isLoading, hideLoader, showLoader } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SecurityFormValues>({
    resolver: yupResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SecurityFormValues) => {
    const userData = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };
    showLoader();
    try {
      const response = await updatePassword(userData);

      if (response.success === true) {
        hideLoader();
        reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success(response.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Updating password failed',
        );
      }
      console.error('Update password error:', error);
    }
  };

  const handleCancel = () => {
    // Reset form to empty fields
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center lg:flex-row justify-between gap-4 lg:gap-0 lg:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 font-semibold text-xl">Security</p>
          <p className="text-grey-900 text-sm">Update your password</p>
        </div>
        <div className="flex gap-3">
          <AppButton
            wrapperClassName="border border-black bg-white !w-[77px]"
            textClassName="!text-dark-400 font-normal text-sm"
            btnText="Cancel"
            type="button"
            onClick={handleCancel}
          />
          <AppButton
            wrapperClassName="!w-[153px]"
            btnText="Save changes"
            textClassName="text-sm font-normal"
            disabled={isLoading || !isValid}
            isLoading={isLoading}
            icon={
              <div className="border rounded-full bg-[#8c65ab] p-0.5">
                <CheckIcon color="white" className="w-3 h-3" />
              </div>
            }
          />
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-5 pt-6">
        <AppInput
          placeholder="********"
          label="Current Password"
          id="currentPassword"
          inputClassName="!w-[512px]"
          register={{ ...register('currentPassword') }}
          error={errors.currentPassword}
        />
        <AppInput
          placeholder="********"
          label="New Password"
          id="newPassword"
          inputClassName="!w-[512px]"
          register={{ ...register('newPassword') }}
          error={errors.newPassword}
        />
        <AppInput
          placeholder="*******"
          label="Confirm Password"
          id="confirmPassword"
          inputClassName="!w-[512px]"
          register={{ ...register('confirmPassword') }}
          error={errors.confirmPassword}
        />
      </div>
    </form>
  );
};

export default Security;
