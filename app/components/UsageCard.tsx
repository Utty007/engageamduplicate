import React from 'react'

function UsageCard() {
    const totalEngagements = 150;
    const usedEngagements = 35
  return (
      <div className='p-6 border border-grey-stroke mb-6 max-w-[560px] flex flex-col rounded-md'>
        <h2 className='font-semibold text-lg text-dark-300'>Usage Summary</h2>
        <p className='text-sm text-grey-700'>Your engagement activity this billing cycle.</p>
        
        <div className='flex items-center justify-between mt-6'>
            <h2>Engagements Used</h2>
            <h3>{usedEngagements}/{totalEngagements}</h3>
        </div>
        <div className='w-full bg-grey-200 h-2 rounded-full mt-4'>
            <div 
                className='bg-black h-2 rounded-full' 
                style={{ 
                width: `${(usedEngagements / totalEngagements) * 100}%` 
                }}
            ></div>
        </div>
      </ div>
  )
}

export default UsageCard;