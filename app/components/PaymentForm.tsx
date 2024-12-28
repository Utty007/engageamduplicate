'use client';

import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import AppButton from './AppButton';
import { getLocalStorageItem } from '../utils/localStorage';
import { UserData } from '@/typings';
import toast from 'react-hot-toast';

interface PaystackReference {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

interface PaymentFormProps {
  onSuccessfulPayment: () => void;
  selectedPlanId?: number;
  selectedPlanPrice: number;
  selectedPlanTitle: string;
  selectedPlanDuration?: string;
  paymentType: "Points" | "Subscription";
  pointsCount?: number;
}

const token = getLocalStorageItem("token")

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccessfulPayment, selectedPlanId, selectedPlanPrice, selectedPlanTitle, selectedPlanDuration, paymentType, pointsCount }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user ID from wherever you store it (localStorage, context, etc.)
  const userData: UserData = JSON.parse(getLocalStorageItem('userData') || '{}') as UserData;
  const userEmail = getLocalStorageItem('email');
  console.log(getLocalStorageItem("email"))

  // Get selected plan from localStorage
  const config = {
  reference: new Date().getTime().toString(),
  email: userEmail || "",
  amount: selectedPlanPrice * 100, // Convert to kobo (Paystack expects kobo)
  // amount: selectedPlan.price * 100 * 100, // Convert to kobo (Paystack expects kobo)
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  metadata: {
    custom_fields: [
      {
        display_name: "Plan ID",
        variable_name: "plan_id",
        value: selectedPlanId
      },
      {
        display_name: "User ID",
        variable_name: "user_id",
        value: userData.id
      }
    ]
  }
};

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = async (reference: PaystackReference) => {
    setIsProcessing(true);
    const loadingToast = toast.loading('Processing your subscription...');

    if (paymentType === "Subscription") {
      try {
      // Prepare the data for backend
      const updateData = {
        userid: userData.id.toString(),
        trxid: reference.reference,
        plan_id: selectedPlanId?.toString(),
        amount: selectedPlanPrice.toString()
      };

      // Send update to backend
      const response = await fetch(
        `https://engageam.app/dashboard_php/sub/updateUserPoints.php?token=${token}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update subscription');
      }

      toast.success('Subscription updated successfully!', {
        id: loadingToast,
        duration: 5000
      });

      // Call the success callback to update UI
      onSuccessfulPayment();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update subscription. Please contact support.', {
        id: loadingToast,
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
    } else if (paymentType === "Points") {
      try {
      // Prepare the data for backend
      const updateData = {
        userid: userData.id.toString(),
        trxid: reference.reference,
        points: pointsCount?? 0,
        amount: selectedPlanPrice.toString()
      };

      // Send update to backend
      const response = await fetch(
        `https://engageam.app/dashboard_php/points/updateUserPoints.php?token=${token}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update subscription');
      }

      toast.success('Subscription updated successfully!', {
        id: loadingToast,
        duration: 5000
      });

      // Call the success callback to update UI
      onSuccessfulPayment();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update subscription. Please contact support.', {
        id: loadingToast,
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
    }
  };

  const handlePaymentClose = () => {
    // Handle payment modal close
    toast.success('Payment cancelled');
  };

  return (
    <div className="p-6 space-y-4 w-fit">
      <h2 className="text-xl font-semibold">Complete Payment</h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={userEmail ?? ''}
            placeholder="Enter your email"
            className="mt-1 w-full"
            required
            disabled={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Plan Details:</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">{selectedPlanTitle}</p>
            <p className="text-sm text-gray-600">
              {selectedPlanPrice} naira{`${selectedPlanDuration ? `/${selectedPlanDuration}` : ''}`}
            </p>
          </div>
        </div>

        <AppButton
          wrapperClassName="w-full"
          onClick={() => {
            initializePayment({
              onSuccess: (response: PaystackReference) => {
                handlePaymentSuccess(response);
              },
              onClose: handlePaymentClose
            });
          }}
          disabled={isProcessing}
          btnText={isProcessing ? 'Processing...' : 'Pay Now'}
        ></AppButton>
      </div>
    </div>
  );
};

export default PaymentForm;