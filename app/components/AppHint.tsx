import React from 'react';

interface AppHintProps {
  type: 'error' | 'info';
  message: string | undefined;
}

const AppHint = ({ type, message }: AppHintProps) => {
  return (
    <p
      className={`text-xs mt-1 ${
        type === 'error' ? 'text-red-500' : 'text-blue-500'
      }`}
    >
      {message}
    </p>
  );
};

export default AppHint;
