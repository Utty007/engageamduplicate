"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable from "./DataTable";
import PaymentForm from "./PaymentForm";
import { getAllPlans } from "../api/pointsApi";
import { pointsProps } from "@/typings";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";
import { useUserStore } from "../stores/useUserStore";
import { getLocalStorageItem } from "../utils/localStorage";

interface PointsHistory {
  id: number;
  trxid: string;
  userid: number;
  point_no: number;
  amount: number;
  type: string;
  description: string;
  prev: number;
  curr: number;
  date_created: string;
  status: number;
}

function Points() {
  const headers = useMemo(
    () => [
      { key: "date_created", label: "Date" },
      { key: "type", label: "Type" },
      { key: "point_no", label: "Points" },
      { key: "amount", label: "Amount (₦)" },
      { key: "description", label: "Description" },
    ],
    []
  );

  const [plans, setPlans] = useState<pointsProps[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<pointsProps | null>(null); // Manage selected plan
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useUserStore((state) => state.user);  
  const fetchUser = useUserStore((state) => state.fetchUser);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const transformedHistory = useMemo(() => {
    return pointsHistory.map((history) => ({
      ...history,
      date_created: formatDate(history.date_created),
      amount: history.amount.toLocaleString(),
    }));
  }, [pointsHistory]);

  useEffect(() => {
    const token = getLocalStorageItem("token");
    if (!token) {
      setError("Authentication token not found");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [plansData, historyResponse] = await Promise.all([
          getAllPlans(token),
          fetch(
            `https://engageam.app/dashboard_php/points/getPointsHistory.php?token=${token}`
          ),
        ]);

        const historyData = await historyResponse.json();

        if (historyData.success) {
          setPointsHistory(historyData.data);
          setPlans(plansData);
        } else {
          setError(historyData.message || "Failed to fetch points history");
        }
      } catch (err) {
        console.error(err);
        setError("An error has occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-dark-100 font-semibold text-xl mb-4">
        Points Management
      </h1>

      <div className="grid grid-cols md:grid-cols-2 gap-6">
        <div
        id="pointsCard"
        className="p-6 border border-grey-stroke mb-6 max-w-[560px] flex flex-col rounded-md col-span-1"
      >
        <h2 className="font-semibold text-lg text-dark-300">Your points</h2>
        <p className="text-sm text-grey-700">
          Buy more points or view your current balance
        </p>

        <p className="mt-3 text-sm text-grey-700">Current balance</p>
        <div className="flex items-center my-6 gap-2 cursor-pointer">
          <Avatar
            initials={`${userData?.firstname} ${userData?.lastname}`}
          />
          <div className="flex flex-col">
            <span className="text-grey-base font-semibold">
              {`${userData?.firstname ?? ""} ${userData?.lastname ?? ""}`}
            </span>
            <span className="text-grey-200 text-sm">{userData?.nicename}</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-grey-700 mb-3">Buy Points</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className="text-grey-base font-semibold border border-grey-stroke col-span-1 p-2 rounded-md"
              onClick={() =>
                setSelectedPlan({
                  id: plan.id,
                  amount: plan.amount,
                  point_no: plan.point_no,
                })
              }
            >
              {plan.point_no} for {plan.amount} naira
            </button>
          ))}
        </div>
        </div>
        {selectedPlan && (
        <PaymentForm
          paymentType="Points"
          onSuccessfulPayment={() => {
            setSelectedPlan(null); 
              fetchUser();
          }}
          pointsCount={selectedPlan.point_no}
          selectedPlanPrice={selectedPlan.amount}
          selectedPlanTitle="Points Purchase"
        />
      )}
      </div>

      

      <div className="overflow-x-scroll no-scrollbar">
        <DataTable
          title="Points History"
          data={transformedHistory}
          headers={headers}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
}

export default Points;
