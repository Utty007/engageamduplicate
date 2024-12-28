import React from 'react';
import AppButton from './AppButton';

const accounts = [
  {
    name: 'Instagram',
    text: 'Connect your Instagram account',
  },
  {
    name: 'TikTok',
    text: 'Connect your TikTok account',
  },
  {
    name: 'X',
    text: 'Connect your X account',
  },
];

const Integrations = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-dark-100 font-semibold text-xl">
          Socials Integrations
        </p>
        <p className="text-grey-900 text-sm">
          Connect your social media accounts
        </p>
      </div>
      <hr />
      <div className="flex flex-col gap-4 pt-6">
        {accounts.map((item, index) => (
          <div key={index} className='flex flex-col gap-4'>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col gap-[10px] w-[463px]">
                <p className="font-semibold text-sm text-dark-100">
                  {item.name}
                </p>
                <p className="text-sm text-grey-700">{item.text}</p>
              </div>
              <AppButton
                wrapperClassName="border border-[#353438] bg-white !w-[88px]"
                textClassName="!text-dark-400 font-normal text-sm"
                btnText="Cancel"
              />
            </div>
            <hr className="border border-[#E9EAEB]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
