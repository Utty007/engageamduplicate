"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { getLocalStorageItem } from '../utils/localStorage';
import SubscriptionCard from './SubscriptionCard';
import PaymentForm from './PaymentForm';
import UsageCard from './UsageCard';
import ActiveSubscription from './ActiveSubscription';
import LoadingSpinner from './LoadingSpinner';
import { UserData } from '@/typings';
import { toast } from 'react-hot-toast';
import SubscriptionHistory from './SubscriptionHistory';
import { useUserStore } from '../stores/useUserStore';

interface Plan {
  id: number;
  name: string;
  paystack_plan_id: string;
  description: string;
  point_no: number;
  bonus: number;
  amount: number;
  duration: string;
  status: number;
}

function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const fetchUser = useUserStore(state => state.fetchUser)

  const token = getLocalStorageItem('token');
  
  // Fetch subscription plans and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await fetch(
          `https://engageam.app/dashboard_php/sub/getPlans.php?token=${token}`
        );
        const plansData = await plansResponse.json();
        
        if (plansData.success) {
          setPlans(plansData.data);
          
          const userData = JSON.parse(getLocalStorageItem('userData') || '{}') as UserData;
          const userPlan = plansData.data.find(
            (plan: Plan) => plan.name === userData.plan
          );
          
          if (userPlan) {
            setCurrentPlan(userPlan);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load subscription plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchSubHistory = async () => {
      const response = await fetch(`https://engageam.app/dashboard_php/sub/getPointsHistory.php?token=${token}`);
      const historyData = await response.json()
      console.log(historyData)
    }

    fetchSubHistory()
  }, [token])

  // Handle plan selection
  const handlePlanSelect = useCallback(async (plan: Plan) => {
    setSelectedPlan(plan);
    
    if (plan.amount > 0) {
      setShowPaymentForm(true);
    } else {
     setCurrentPlan(plan)
    }
  }, []);

  // Handle successful payment
  const handleSuccessfulPayment = useCallback(async () => {
    if (selectedPlan) {
      fetchUser();
      setShowPaymentForm(false);
      setCurrentPlan(selectedPlan);
    }
  }, [selectedPlan]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const subscriptionPlans = plans.map(plan => ({
    id: plan.id,
    title: plan.name,
    about: plan.description,
    amount: plan.amount,
    duration: plan.duration.toLowerCase(),
    btnText: plan.amount === 0 ? "Get Started" : "Subscribe",
    btnStyle: plan.amount === 0 ? "text-dark-300 border border-grey-stroke" : "text-white bg-primary",
    pointNo: plan.point_no,
    bonus: plan.bonus
  }));

  return (
    <div className='px-6'>
      <section>
        <h1 className="text-dark-100 font-semibold text-xl mb-4">
          Subscription
        </h1>
      </section>

      {currentPlan && (
        <>
         <section className='grid grid-cols-1 sm:grid-cols-2'>
          <ActiveSubscription 
            planTitle={currentPlan.name}
            duration={currentPlan.duration.toLowerCase()}
            price={currentPlan.amount}
            onCancelSubscription={() => setCurrentPlan(null)}
          />
          <UsageCard />
        </section>
        <SubscriptionHistory />
        </>
      )}

      {!currentPlan && (
        <>
          {showPaymentForm && selectedPlan ? (
            <PaymentForm 
              selectedPlanTitle={selectedPlan.name}
              selectedPlanDuration={selectedPlan.duration}
              selectedPlanPrice={selectedPlan.amount}
              selectedPlanId={selectedPlan.id}
              onSuccessfulPayment={handleSuccessfulPayment}
              paymentType='Subscription'
            />
          ) : (
            <section className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className='col-span-1'>
                  <SubscriptionCard 
                    {...plan} 
                    onSelect={() => handlePlanSelect(plans.find(p => p.id === plan.id)!)}
                  />
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Subscription;