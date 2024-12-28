import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps {
  btnText: string;
  wrapperClassName?: string;
  textClassName?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const AppButton: React.FC<ButtonProps> = ({
  btnText,
  wrapperClassName = '',
  textClassName,
  onClick,
  icon,
  iconLeft,
  disabled,
  isLoading,
  type = 'submit',
}) => {
  return (
    <button
      className={`${wrapperClassName} bg-primary w-full lg:w-[476px] py-3 px-4 flex items-center gap-2 justify-center rounded-lg h-[43px]`}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin text-white" size={24} />
        </div>
      ) : (
        <div className="flex gap-2">
          {iconLeft}
          <p
            className={`${textClassName} font-semibold text-base text-grey-400 `}
          >
            {btnText}
          </p>
          {icon}
        </div>
      )}
    </button>
  );
};

export default AppButton;
