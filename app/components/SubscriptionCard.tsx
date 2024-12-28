import React from 'react';

export type SubCardProps = {
    title: string;
    about: string;
    amount: number;
    duration: string;
    btnText: string;
    btnStyle: string;
    onSelect?: () => void;
}

function SubscriptionCard({title, about, amount, duration, btnText, btnStyle, onSelect}: SubCardProps) {
  return (
    <div className='p-6 border border-grey-stroke max-w-[560px] flex flex-col rounded-md'>
        <h2 className='font-semibold text-lg text-dark-300'>{title}</h2>
        <p className='text-sm text-grey-700'>{about}</p>
        
        <div className='flex items-center border-b py-4 border-grey-stroke'>
            <span className='text-dark-300 font-bold text-3xl'>{amount.toFixed(2)} naira</span> <span className='text-sm text-grey-700'>/ {duration}</span>
        </div>
        
        <button onClick={onSelect} className={`${btnStyle} w-full py-3 rounded-md text-xs`}>{btnText}</button>
    </div>
  )
}

export default SubscriptionCard