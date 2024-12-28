'use client';

import AppButton from '@/app/components/AppButton';
import Occupation from '@/app/components/Occupation';
import SocialLinks from '@/app/components/SocialLinks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { mediaInfoSchema } from '@/app/utils/validationSchema';
import useLoading from '@/app/hooks/useLoading';
import { registerUserDetails } from '@/app/api/authApi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { removeLocalStorageItem } from '@/app/utils/localStorage';

export interface FormData {
  occupation?: string;
  others?: string;
  twitter: string;
  tiktok: string;
  instagram: string;
}

const MediaInfo = () => {
  const { isLoading, hideLoader, showLoader } = useLoading();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(mediaInfoSchema),
    defaultValues: {
      occupation: '',
      others: '',
      twitter: '',
      tiktok: '',
      instagram: '',
    },
  });

  const validateStep = async () => {
    if (activeStep === 0) {
      // Validate occupation fields
      const isValid = await trigger(['occupation', 'others']);
      return isValid;
    }
    // Validate social links fields
    return await trigger(['twitter', 'tiktok', 'instagram']);
  };

  const onSubmit = async (data: FormData) => {
    const userData = {
      occupation: data.occupation || data.others || '',
      instagram: data.instagram,
      tiktok: data.tiktok,
      twitter: data.twitter,
    };
    showLoader();
    try {
      const response = await registerUserDetails(userData);
      if (response.success === true) {
        hideLoader();
        removeLocalStorageItem('token');
        removeLocalStorageItem('email');
        setTimeout(() => {
          router.push('/');
        }, 500);
        toast.success(response.message);
      }
    } catch (error) {
      hideLoader();
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
      console.error('Create register error:', error);
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();

    if (!isStepValid) {
      return;
    }

    if (activeStep == contents.length - 1) {
      handleSubmit(onSubmit)();
    } else {
      setActiveStep((prevStep) => {
        if (prevStep < contents.length - 1) {
          return prevStep + 1;
        }
        return prevStep;
      });
    }
  };

  const contents = [
    {
      title: 'occupation',
      body: <Occupation register={register} errors={errors} />,
    },
    {
      title: 'sociallinks',
      body: <SocialLinks register={register} errors={errors} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="">{contents[activeStep].body}</div>
      <div className="flex justify-center px-8">
        <AppButton
          onClick={handleNext}
          disabled={isLoading}
          isLoading={isLoading}
          btnText={activeStep !== contents.length - 1 ? 'Next' : 'Finish'}
        />
      </div>
    </div>
  );
};

export default MediaInfo;
