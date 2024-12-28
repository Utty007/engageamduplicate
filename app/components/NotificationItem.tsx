import React from 'react';

type NotificationItemProps = {
  title: string;
  details: string;
  time: string;
};

function NotificationItem({ title, details, time }: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-grey-100 pb-2">
      <div className="flex flex-col flex-1 max-w-[90%]">
        <h2 className="text-grey-700 text-sms">{title}</h2>
        <p className="text-xs text-grey-200 leading-5">{details}</p>
      </div>
      <h4>{time}hr</h4>
    </div>
  );
}

export default NotificationItem;
