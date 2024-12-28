import React from 'react';
import Link from 'next/link';
import PointsIcon from '@/app/assets/svgs/coin.svg';
import QuestionMark from '@/app/assets/svgs/help.svg';
import Logout from '@/app/assets/svgs/logout.svg';
import { removeLocalStorageItem } from '../utils/localStorage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Avatar from './Avatar';

type UserProfileProps = {
  name: string | null;
  username: string | null;
};
function UserProfile({ username, name }: UserProfileProps) {
  const router = useRouter();

  const handleLogout = () => {
    toast.success('User logged out successfully');
    removeLocalStorageItem('token');
    removeLocalStorageItem('email');
    removeLocalStorageItem('firstname');
    removeLocalStorageItem('lastname');
    removeLocalStorageItem('username');
    removeLocalStorageItem('balance');
    removeLocalStorageItem('userData');
    removeLocalStorageItem('selectedPlan');

    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="flex flex-col gap-5 min-w-[300px]">
      <div className="flex items-center gap-2">
        <Avatar initials={name} />
        <div className="flex flex-col">
          <span className="text-grey-base font-semibold">{name}</span>
          <span className="text-grey-200 text-sm">@{username}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <Link
          href="/points"
          className="flex items-center gap-1 px-3 py-2 hover:bg-primary/10 hover:text-primary"
        >
          <PointsIcon /> Buy Points
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-1 px-3 py-2 hover:bg-primary/10 hover:text-primary"
        >
          <QuestionMark /> Support
        </Link>
        <div
          onPointerDown={handleLogout}
          className="flex items-center gap-1 px-3 py-2 hover:bg-primary/10 hover:text-primary"
        >
          <Logout /> Logout
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
