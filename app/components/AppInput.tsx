import React from 'react';

import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import AppHint from './AppHint';

type ToggleState = 'On' | 'Off';

interface AppInputProps<T extends FieldValues> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  withLabel?: boolean;
  placeholder?: string;
  text?: string;
  hintText?: React.ReactNode;
  optional?: ToggleState;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  register?: ReturnType<UseFormRegister<T>>;
  id?: Path<T>;
  error?: FieldError;
  disabled?: boolean;
  countryCode?: boolean;
  socialLinks?: boolean;
  value?: string | null ;
}

const AppInput = <T extends FieldValues>({
  leftIcon,
  rightIcon,
  hintText = '',
  withLabel = true,
  placeholder,
  optional = 'Off',
  label = '',
  inputClassName,
  register,
  id,
  error,
  disabled,
  countryCode = false,
  socialLinks = false,
  value,
}: AppInputProps<T>) => {
  return (
    <div className="flex flex-col gap-[6px]">
      {withLabel && (
        <label htmlFor={id} className="font-medium text-sm text-dark-200">
          {label}
          {optional === 'On' && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="flex relative">
        {leftIcon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        {countryCode && (
          <select
            className="border border-gray-300 rounded-l-lg p-2 w-20 text-sm focus:ring-primary focus:border-primary"
            defaultValue="+234"
          >
            <option value="+234">+234</option>
          </select>
        )}
        {socialLinks && (
          <span className="border-grey-100 bg-white border rounded-l-lg px-2 pb-2 pt-2.5 text-grey-300">
            http://
          </span>
        )}
        <input
          id={id}
          {...register}
          type="text"
          name={id}
          defaultValue={value ?? ''}
          className={`${inputClassName} ${
            socialLinks || countryCode ? 'rounded-r-lg' : 'rounded-lg'
          } border w-full placeholder:text-grey-300 placeholder:text-base focus:border-primary focus:outline-none focus:ring-0 border-grey-100 shadow shadow-[#1018280D] py-[10px] px-[14px] h-[44px] ${
            error ? 'focus:border-red-500' : ''
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {rightIcon && <div>{rightIcon}</div>}
      </div>

      {hintText && <div>{hintText}</div>}

      {error && <AppHint type="error" message={error.message} />}
    </div>
  );
};

export default AppInput;
