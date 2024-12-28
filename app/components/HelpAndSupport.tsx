import React from 'react';
import AppButton from './AppButton';
import Facebook from "@/app/assets/svgs/facebook.svg";
import Twitter from "@/app/assets/svgs/twitter.svg";
import Linkedln from "@/app/assets/svgs/linkedln.svg";
import Instagram from "@/app/assets/svgs/instagramLogo.svg";

const HelpAndSupport = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-dark-100 font-semibold text-xl">Help & Support</p>
        <p className="text-grey-900 text-sm">Get help</p>
      </div>
      <hr />
      <div className="flex flex-col md:flex-row lg:flex-row gap-6">
        <div className="flex flex-col gap-5  p-6 border border-[#E9EAEB] rounded-lg">
          <div className="flex flex-col gap-4">
            <p className="text-dark-300 font-semibold text-base">FAQ & Help Center</p>
            <p className="text-sm text-grey-700">
              The help center contains a wealth of valuable resources and
              information to address frequently encountered problems.
            </p>
          </div>
          <AppButton
            wrapperClassName="border border-[#353438] bg-white !px-0 !w-[144px]"
            textClassName="!text-dark-400 !font-normal text-sm "
            btnText="Open help canter"
          />
        </div>
        <div className="flex flex-col justify-between gap-6 p-6 border border-[#E9EAEB] rounded-lg">
          <div className="flex flex-col gap-4">
            <p className="text-dark-300 font-semibold text-base">Follow Us</p>
            <p className="text-sm text-grey-700">
              Stay connected with us! Follow for the latest updates, exclusive
              content, and exciting news. Join the conversation on social media!
            </p>
          </div>
         <div className='flex gap-[10px] items-center'>
            <Facebook />
            <Twitter />
            <Instagram />
            <Linkedln />
         </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
