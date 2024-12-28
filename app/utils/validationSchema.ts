import * as yup from 'yup';
import { skills } from '@/app/components/Occupation';

export const signUpSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one symbol'),
  firstName: yup.string().required('FirstName is required'),
  lastName: yup.string().required('LastName is required'),
});
export const signInSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  password: yup.string().required('Password is required'),
});
export const createPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one symbol'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
});
export const phoneNumberSchema = yup.object({
  number: yup
    .string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 11 didgits')
    .required('Phone number is required'),
});

export const mediaInfoSchema = yup.object({
  twitter: yup.string().required('Twitter link is required'),
  tiktok: yup
    .string()
    .required('TikTok link is required'),
  instagram: yup
    .string()
    .required('Instagram link is required'),
  occupation: yup
    .string()
    .test(
      'occupation-or-others',
      'Please select either an occupation or specify your own',
      function (value) {
        const others = this.parent.others;
        // Valid if either occupation is selected or others is filled
        return (
          (value && skills.includes(value) && !others) ||
          (!value && others) ||
          (value && !others)
        );
      },
    ),
  others: yup
    .string()
    .test(
      'others-or-occupation',
      'Please select either an occupation or specify your own',
      function (value) {
        const occupation = this.parent.occupation;
        // Valid if either others is filled or occupation is selected
        return (
          (value && !occupation) ||
          (!value && skills.includes(occupation)) ||
          (occupation && !value)
        );
      },
    ),
});
export const securitySchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one symbol'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});
export const accountSchema = yup.object({
  firstname: yup.string(),
  lastname: yup.string(),
});
