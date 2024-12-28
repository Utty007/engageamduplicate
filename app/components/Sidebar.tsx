'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft, X, Menu } from 'lucide-react';

// Import SVG icons
import EngageAmLogo from '@/app/assets/svgs/logo-engam.svg';
import DashboardIcon from '@/app/assets/svgs/home01.svg';
import PostsIcon from '@/app/assets/svgs/postadd.svg';
import FlagIcon from '@/app/assets/svgs/flag.svg';
import DisputesIcon from '@/app/assets/svgs/connection.svg';
import PointsIcon from '@/app/assets/svgs/coin.svg';
import AnalyticsIcon from '@/app/assets/svgs/chart-pie.svg';
import SubIcon from '@/app/assets/svgs/diamond.svg';
import SettingsIcon from '@/app/assets/svgs/setting.svg';

const SideBarItem = [
  { nav: 'Dashboard', link: '/dashboard', icon: <DashboardIcon /> },
  { nav: 'Posts', link: '/posts', icon: <PostsIcon /> },
  { nav: 'Flagged Posts', link: '/flaggedposts', icon: <FlagIcon /> },
  { nav: 'Disputes', link: '/disputes', icon: <DisputesIcon /> },
  { nav: 'Points', link: '/points', icon: <PointsIcon /> },
  { nav: 'Analytics', link: '/analytics', icon: <AnalyticsIcon /> },
  { nav: 'Subscription', link: '/subscription', icon: <SubIcon /> },
  { nav: 'Settings', link: '/settings', icon: <SettingsIcon /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile and Desktop Sidebar */}
      <section 
        className={`
          fixed z-40 top-0 left-0 h-full 
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:block
          ${isCollapsed 
            ? 'w-[80px] md:w-[80px]' 
            : 'w-[220px] md:w-[220px]'
          }
          bg-white border-r border-r-grey-stroke 
          md:sticky
        `}
      >
        {/* Sidebar Toggle Button for Desktop */}
        <button 
          onClick={toggleSidebar}
          className={`
            hidden md:block absolute top-4 -right-4 z-50 
            bg-white border border-grey-stroke rounded-full 
            p-1 shadow-md transition-transform duration-300
            ${isCollapsed ? 'rotate-180' : ''}
          `}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Logo Container */}
        <div className="flex justify-between items-center p-4">
          <div className={isCollapsed && !isMobileOpen ? 'mx-auto' : ''}>
            <EngageAmLogo />
          </div>
          
          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button 
              onClick={toggleMobileSidebar} 
              className="md:hidden"
            >
              <X />
            </button>
          )}
        </div>

        {/* Sidebar Items */}
        <ul className={`px-2 pt-4 ${isCollapsed && !isMobileOpen ? 'text-center' : ''}`}>
          {SideBarItem.map((item, i) => (
            <div key={i} className="flex items-center">
              <Link
                href={item.link}
                className={`
                  w-full
                  flex items-center 
                  ${isCollapsed && !isMobileOpen ? 'justify-center' : 'gap-3'}
                  px-2 sm:px-4
                  py-3 mb-1
                  rounded-md
                  transition-colors
                  duration-200
                  ${
                    pathname.startsWith(item.link)
                      ? 'bg-primary/20 text-primary'
                      : 'text-[#344054] hover:bg-primary/10'
                  }
                `}
                onClick={isMobileOpen ? toggleMobileSidebar : undefined}
              >
                {item.icon}
                {(!isCollapsed || isMobileOpen) && (
                  <h2 className="font-medium w-full">{item.nav}</h2>
                )}
              </Link>
            </div>
          ))}
        </ul>
      </section>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          onClick={toggleMobileSidebar}
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Mobile Toggle Button */}
      {!isMobileOpen && <button 
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
      >
        <Menu />
      </button>}
    </>
  );
};

export default Sidebar;