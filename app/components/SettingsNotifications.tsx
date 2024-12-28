'use client';

import React, { useState, useEffect } from 'react';
import { updateProfile, getUser } from '@/app/api/userApi';
import useLoading from '../hooks/useLoading';

const notificationList = [
  {
    id: '1',
    key: 'account_notification',
    title: 'Account Notifications',
    text: "We'll notify you via email about important updates regarding your account, such as password changes, or account status changes.",
  },
  {
    id: '2',
    key: 'product_update_notification',
    title: 'Product Updates and New Features',
    text: "We'll keep you informed about the latest updates, enhancements, and new features.",
  },
  {
    id: '3',
    key: 'promotional_email_notification',
    title: 'Promotional Emails',
    text: "You'll receive emails featuring special offers, discounts, or promotions for additional services, upgrades, or related products.",
  },
  {
    id: '4',
    key: 'tips_notification',
    title: 'Tips and Tutorials',
    text: "We'll send you educational emails providing tips, tutorials, and best practices.",
  },
  {
    id: '5',
    key: 'survey_notification',
    title: 'Surveys and Feedback Requests',
    text: 'We may ask you to provide feedback, participate in surveys, or share your experiences, helping us gather insights for further improvements.',
  },
];

const SettingsNotifications = () => {
  const { isLoading, hideLoader, showLoader } = useLoading();
  const [switchStates, setSwitchStates] = useState(
    notificationList.reduce(
      (acc, item) => {
        acc[item.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        const userData = response.data;

        // Converting API's 0/1 values to booleans for switches
        setSwitchStates({
          '1': Boolean(userData.account_notification),
          '2': Boolean(userData.product_update_notification),
          '3': Boolean(userData.promotional_email_notification),
          '4': Boolean(userData.tips_notification),
          '5': Boolean(userData.survey_notification),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSwitch = async (id: string) => {
    showLoader();
    const newState = !switchStates[id];

    // updating UI
    setSwitchStates((prev) => ({
      ...prev,
      [id]: newState,
    }));

    // Finding the notification item to get its API key
    const notificationItem = notificationList.find((item) => item.id === id);
    if (!notificationItem?.key) return;

    try {
      // Converting boolean to 0/1 for API
      await updateProfile({
        [notificationItem.key]: newState ? 1 : 0,
      });
    } catch (error) {
      console.error('Error updating notification setting:', error);
      // Reverting state on error
      setSwitchStates((prev) => ({
        ...prev,
        [id]: !newState,
      }));
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-dark-100 font-semibold text-xl">Notification</p>
        <p className="text-grey-900 text-sm w-72 md:w-full lg:w-full">
          We can still send high priority notifications outside these settings
        </p>
      </div>
      <hr />
      <div className="flex flex-col gap-6 pt-6">
        {notificationList.map((item, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex gap-6">
              <div className="flex flex-col gap-2.5">
                <p className="text-sm text-dark-300">{item.title}</p>
                <p className="text-xs text-grey-700 w-72 md:w-[30rem] lg:w-[30rem]">
                  {item.text}
                </p>
              </div>
              <div
                className={`w-10 h-6 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
                  isLoading ? 'opacity-50' : ''
                } ${switchStates[item.id] ? 'bg-primary' : 'bg-gray-300'}`}
                onClick={() => !isLoading && toggleSwitch(item.id)}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    switchStates[item.id] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
            <hr className="border border-[#E6ECF4]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsNotifications;
