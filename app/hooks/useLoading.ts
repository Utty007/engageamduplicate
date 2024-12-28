import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return {
    showLoader,
    hideLoader,
    isLoading,
  };
};

export default useLoading;
