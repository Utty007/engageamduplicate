import React from 'react';
import { getLocalStorageItem } from '../utils/localStorage';
import { UserData } from '@/typings';
import Avatar from './Avatar';

type activeSubProps = {
    planTitle: string;
    price: number;
    duration: string;
    onCancelSubscription: () => void;
}

function ActiveSubscription({ planTitle, price, duration, onCancelSubscription }: activeSubProps) {
    const userData = JSON.parse(getLocalStorageItem('userData') || '{}') as UserData;
  return (
     <div className='p-6 border border-grey-stroke mb-6 max-w-[560px] flex flex-col rounded-md'>
        <h2 className='font-semibold text-lg text-dark-300'>Current subscription</h2>
        <p className='text-sm text-grey-700'>Your plan and billing details</p>
        <div className="flex items-center my-6 gap-2 cursor-pointer">
            <Avatar initials={`${userData.firstname} ${userData.lastname}`} />
            <div className="flex flex-col">
                <span className="text-grey-base font-semibold">{userData.firstname + userData.lastname}</span>
                <span className="text-grey-200 text-sm">{userData.nicename}</span>
            </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
            <div className='flex items-center justify-between text-dark-300'>
                <span>Current Plan:</span><span className='text-sm'>{planTitle}</span>
            </div>
            <div className='flex items-center justify-between'>
                <span>Price:</span><span className='text-sm'>{price} naira/{duration}</span>
            </div>
        </div>
        <button onClick={onCancelSubscription} className='text-dark-300 border inline-block mt-5 border-grey-stroke py-3 rounded-md text-sm float-right'>Cancel Subscription</button>
    </div>
  )
}

export default ActiveSubscription