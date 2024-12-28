'use client';

import Account from '@/app/components/Account';
import AppTab from '@/app/components/AppTab';
import HelpAndSupport from '@/app/components/HelpAndSupport';
import Integrations from '@/app/components/Integrations';
import Security from '@/app/components/Security';
import SettingsNotifications from '@/app/components/SettingsNotifications';
import React, { useMemo } from 'react';

const Settings = () => {
  const settingsTabItems = useMemo(
    () => [
      {
        key: 'account',
        label: 'Account',
        component: <Account />,
      },
      {
        key: 'notifications',
        label: 'Notifications',
        component: <SettingsNotifications />,
      },
      {
        key: 'security',
        label: 'Security',
        component: <Security />,
      },
      {
        key: 'integration',
        label: 'Integrations',
        component: <Integrations />,
      },
      {
        key: 'help',
        label: 'Help & Support',
        component: <HelpAndSupport />,
      },
    ],
    [],
  );
  return (
    <div className="px-10 pt-5 pb-10">
      <AppTab
        items={settingsTabItems}
        activeClassName="bg-white text-dark-400 rounded-xl"
        notActiveClassName="bg-none"
        width="w-[32.6rem]"
      />
    </div>
  );
};

export default Settings;
