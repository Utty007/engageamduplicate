import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import * as Tooltip from '@radix-ui/react-tooltip';
import NotificationIcon from '@/app/assets/svgs/notification.svg';

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root open={isOpen} 
          onOpenChange={setIsOpen} delayDuration={0}>
          <Tooltip.Trigger asChild>
            <button onClick={toggleNotifications} className="inline-flex size-[35px] items-center justify-center rounded-full bg-white border border-b-grey-stroke outline-none hover:bg-violet3">
              <NotificationIcon />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="select-none rounded-md bg-white p-4 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
              sideOffset={5}
            >
              <div className="flex flex-col gap-5 min-w-[350px] sm:min-w-[500px]">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-grey-800">Notifications</h2>
                  <h4 className="text-xs text-semibold text-baseColor">
                    Mark all as read
                  </h4>
                </div>
                <NotificationItem
                  title="Purchase Succesful"
                  details="Your Payment for 30 points is successful."
                  time="4"
                />
                <NotificationItem
                  title="Purchase Succesful"
                  details="Your Payment for 30 points is successful."
                  time="4"
                />
                <NotificationItem
                  title="Purchase Succesful"
                  details="Your Payment for 30 points is successful."
                  time="4"
                />
              </div>
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </>
  );
}

export default Notifications;
