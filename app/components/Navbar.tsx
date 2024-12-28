'use client';

import React, { useEffect, useState } from 'react';
import ArrowDown from '@/app/assets/svgs/direction-down01.svg';
import * as Tooltip from '@radix-ui/react-tooltip';
import Notifications from './Notifications';
import UserProfile from './UserProfile';
import Avatar from './Avatar';
import { getLocalStorageItem } from '../utils/localStorage';
import { useUserStore } from '../stores/useUserStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Separate the selectors to avoid creating new arrays
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const firstName = getLocalStorageItem("firstname");
  const lastName = getLocalStorageItem("lastname");
  const userName = getLocalStorageItem("username");

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full border border-b-grey-stroke">
      <div className="flex float-end items-center gap-4 py-3 px-6">
        <div>
          <Notifications />
        </div>
        <Tooltip.Provider>
          <Tooltip.Root 
            open={isOpen} 
            onOpenChange={setIsOpen} 
            delayDuration={0}
          >
            <Tooltip.Trigger asChild>
              <button onClick={toggleNotifications}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar initials={`${firstName} ${lastName}`} />
                  <div className="flex flex-col">
                    <span className="text-grey-base font-semibold">{user?.balance}</span>
                    <span className="text-grey-200 text-sm">Points</span>
                  </div>
                  <ArrowDown />
                </div>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="select-none rounded-md bg-white p-4 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                sideOffset={5}
              >
                <UserProfile 
                  name={`${firstName} ${lastName}`} 
                  username={userName} 
                />
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};

export default Navbar;