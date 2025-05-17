"use client"

import { useState, useEffect } from "react"
import { usePaymentData } from "./hooks/use-payment-data"
import DashboardHeader from "./components/dashboard-header"
import PaymentMethodChart from "./components/payment-method-chart"
import PaymentStatusChart from "./components/payment-status-chart"
import MonthlyPaymentChart from "./components/monthly-payment-chart"
import PaymentHistoryTable from "./components/payment-history-table"

export default function PaymentHistoryPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for demo purposes using useEffect to avoid infinite loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const {
    paymentHistoryData,
    paymentMethodDistribution,
    paymentStatusDistribution,
    monthlyPaymentData,
    selectedPayment,
    handlePaymentSelect,
  } = usePaymentData()
  
  return (
    <div className="container flex flex-col w-full mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
      <DashboardHeader />

      {/* Payment distribution charts - responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 overflow-hidden">
        {/* Payment Method Chart */}
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <PaymentMethodChart
            data={paymentMethodDistribution}
            isLoading={isLoading}
            selectedPayment={selectedPayment ? { paymentMethod: selectedPayment.paymentMethod } : undefined}
          />
        </div>
        
        {/* Payment Status Chart */}
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <PaymentStatusChart
            data={paymentStatusDistribution}
            isLoading={isLoading}
            selectedPayment={selectedPayment ? { status: selectedPayment.status } : undefined}
          />
        </div>
      </div>

      {/* Monthly payment chart - full width */}
      <div className="relative w-full min-h-[350px] overflow-x-auto bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-6 md:mb-8">
        <MonthlyPaymentChart data={monthlyPaymentData} isLoading={isLoading} />
      </div>

      {/* Payment history table - full width */}
      <div className="w-full max-w-full overflow-x-auto bg-white rounded-lg shadow-sm mb-6 md:mb-8">
        <PaymentHistoryTable
          data={paymentHistoryData}
          isLoading={isLoading}
          selectedPayment={selectedPayment ? { 
            ...selectedPayment, 
            paymentId: selectedPayment.id, 
            amount: "0", 
            date: "" 
          } : null}
          onPaymentSelect={handlePaymentSelect}
        />
      </div>
    </div>
  )
}