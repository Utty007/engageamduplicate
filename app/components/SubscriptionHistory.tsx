import React, { useState, useEffect } from 'react';
import DataTable, { PaymentItem } from './DataTable';
import { toast } from 'react-hot-toast';
import { getLocalStorageItem } from '../utils/localStorage';
import LoadingSpinner from './LoadingSpinner';

const SubscriptionHistory = () => {
  const [history, setHistory] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = getLocalStorageItem('token');

  const headers = [
    { key: 'trxid', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'plan', label: 'Plan' },
    { key: 'points', label: 'Points' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' }
  ];

  useEffect(() => {
    const fetchSubHistory = async () => {
      try {
        const response = await fetch(
          `https://engageam.app/dashboard_php/sub/getPointsHistory.php?token=${token}`
        );
        const historyData = await response.json();

        if (historyData.success) {
          // Transform the data to match DataTable expectations
          const formattedHistory = historyData.data.map((item: PaymentItem) => ({
            trxid: item.trxid,
            date: new Date(String(item.date_created)).toLocaleDateString(),
            plan: item.plan_name,
            points: item.point_no,
            amount: item.amount,
            status: item.status === 1 ? 'Completed' : 'Pending',
            details: 'View Details'
          }));
          
          setHistory(formattedHistory);
        } else {
          toast.error('Failed to fetch subscription history');
        }
      } catch (error) {
        console.error('Error fetching subscription history:', error);
        toast.error('Failed to load subscription history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubHistory();
  }, [token]);

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="mt-8">
      <DataTable
        data={history}
        headers={headers}
        itemsPerPage={5}
        title="Subscription History"
      />
    </div>
  );
};

export default SubscriptionHistory;