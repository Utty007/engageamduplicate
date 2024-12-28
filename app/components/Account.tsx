import { CheckIcon } from 'lucide-react';
import React from 'react';
import AppButton from './AppButton';
import AppInput from './AppInput';
// import Trash from '@/app/assets/svgs/trash.svg';
// import Upload from '@/app/assets/svgs/upload.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountSchema } from '../utils/validationSchema';
// import Avatar from './Avatar';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '../utils/localStorage';
import useLoading from '../hooks/useLoading';
import { getUser, updateProfile } from '../api/userApi';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AccountFormValues {
  firstname?: string;
  lastname?: string;
}

const Account = () => {
  const email = getLocalStorageItem('email');
  const firstName = getLocalStorageItem('firstname');
  const lastName = getLocalStorageItem('lastname');
  const { isLoading, hideLoader, showLoader } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AccountFormValues>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      firstname: firstName || '',
      lastname: lastName || '',
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    const userData = {
      firstname: data.firstname || '',
      lastname: data.lastname || '',
    };
    showLoader();
    try {
      const response = await updateProfile(userData);

      if (response.success === true) {
        hideLoader();

        const getUserResponse = await getUser();
        if (getUserResponse.success === true) {
          setLocalStorageItem('firstname', getUserResponse.data.firstname);
          setLocalStorageItem('lastname', getUserResponse.data.lastname);
        }
        toast.success(response.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Updating user failed');
      }
      console.error('Update user error:', error);
    }
  };

  const handleCancel = () => {
    // Reset form to initial values from localStorage
    reset({
      firstname: firstName || '',
      lastname: lastName || '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between gap-4 lg:gap-0 lg:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 font-semibold text-xl">Personal info</p>
          <p className="text-grey-900 text-sm">
            Update your photo and personal details here.
          </p>
        </div>
        <div className="flex gap-3">
          <AppButton
            onClick={handleCancel}
            wrapperClassName="border border-black bg-white !w-[77px]"
            textClassName="!text-dark-400 font-normal text-sm"
            btnText="Cancel"
            type="button"
          />
          <AppButton
            wrapperClassName="!w-[153px]"
            btnText="Save changes"
            textClassName="text-sm font-normal"
            disabled={isLoading || !isValid}
            isLoading={isLoading}
            icon={
              <div className="border rounded-full bg-[#8c65ab] flex items-center p-0.5">
                <CheckIcon color="white" className="w-3 h-3" />
              </div>
            }
          />
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-5">
        {/* <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <p className="font-semibold text-sm text-grey-700">Your photo</p>
            <p className="text-xs text-grey-700">
              This will be displayed on your profile.
            </p>
          </div>
          <div className="flex gap-8 items-center">
            <Avatar initials={`${firstName} ${lastName}`} />
            <label className="">
              <div className=" bg-primary lg:w-[105px] cursor-pointer py-3 px-4 flex items-center gap-2 justify-center rounded-lg h-[43px]">
                <p className="font-semibold text-base text-grey-400">Upload</p>
                <Upload />
              </div>
              <input type="file" name="" className="hidden" id="" />
            </label>
            <div className="flex gap-2 items-center cursor-pointer">
              <Trash />
              <p className="text-xs text-dark-700">Remove</p>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col gap-5">
          <AppInput
            placeholder="John"
            label="First Name"
            id="firstname"
            inputClassName="!w-[512px]"
            register={{ ...register('firstname') }}
            error={errors.firstname}
          />
          <AppInput
            placeholder="Doe"
            label="Last Name"
            id="lastname"
            inputClassName="!w-[512px]"
            register={{ ...register('lastname') }}
            error={errors.lastname}
          />

          <AppInput
            placeholder="olivia@untitledui.com"
            label="Email address"
            id="email"
            inputClassName="!w-[512px]"
            disabled={true}
            value={email}
            // register={{ ...register('email') }}
            // error={errors.email}
          />
        </div>
      </div>
    </form>
  );
};

export default Account;
