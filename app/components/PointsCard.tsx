import React, { ReactNode } from 'react';

type PointsCard = {
  Title: string;
  Points: string | number | undefined;
  Icon: ReactNode;
};

const PointsCard = ({ Title, Points, Icon }: PointsCard) => {
  return (
    <div className="w-full col-span-1 p-4 sm:p-6 rounded-md border border-grey-stroke flex items-center">
      <div>
        {Icon}
      </div>
      <div className='ml-4'>
        <h2 className="text-dark-100 font-bold text-xl sm:text-2xl">{Points}</h2>
        <p className="text-gray-400 text-sm sm:text-base">{Title}</p>
      </div>
    </div>
  );
};

export default PointsCard;
