'use client';

import React, {
  useRef,
  useState,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
} from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  onChange?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onComplete,
  disabled = false,
  className = '',
  inputClassName = '',
  onChange,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string): void => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

     if (onChange) {
       onChange(newOtp.join(''));
     }

    if (value !== '') {
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      const otpValue = newOtp.join('');
      if (otpValue.length === length && onComplete) {
        onComplete(otpValue);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace') {
      if (index > 0 && otp[index] === '' && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (
      e.key === 'ArrowLeft' &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    } else if (
      e.key === 'ArrowRight' &&
      index < length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.match(/[0-9]/g) || [];

    if (pastedNumbers.length >= length) {
      const newOtp = [...otp];
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedNumbers[i];
      }
      setOtp(newOtp);

      if (onComplete) {
        onComplete(newOtp.join(''));
      }

      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(index, e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(index, e)
          }
          onPaste={handlePaste}
          className={`w-[64px] h-[64px] text-center text-lg font-semibold border rounded-lg 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${inputClassName}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
