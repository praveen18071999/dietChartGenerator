"use client"

import { useState } from "react"
import { usePaymentData } from "./hooks/use-payment-data"
import DashboardHeader from "./components/dashboard-header"
import PaymentMethodChart from "./components/payment-method-chart"
import PaymentStatusChart from "./components/payment-status-chart"
import MonthlyPaymentChart from "./components/monthly-payment-chart"
import PaymentHistoryTable from "./components/payment-history-table"

export default function PaymentHistoryPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for demo purposes
  setTimeout(() => {
    setIsLoading(false)
  }, 1500)

  const {
    paymentHistoryData,
    paymentMethodDistribution,
    paymentStatusDistribution,
    monthlyPaymentData,
    selectedPayment,
    handlePaymentSelect,
  } = usePaymentData()
  console.log("Payment History Data:", paymentHistoryData)
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <PaymentMethodChart
          data={paymentMethodDistribution}
          isLoading={isLoading}
          selectedPayment={selectedPayment ? { paymentMethod: selectedPayment.paymentMethod } : undefined}
        />
        <PaymentStatusChart
          data={paymentStatusDistribution}
          isLoading={isLoading}
          selectedPayment={selectedPayment ? { status: selectedPayment.status } : undefined}
        />
      </div>

      <MonthlyPaymentChart data={monthlyPaymentData} isLoading={isLoading} />

      <PaymentHistoryTable
        data={paymentHistoryData}
        isLoading={isLoading}
        selectedPayment={selectedPayment ? { ...selectedPayment, paymentId: selectedPayment.id, amount: "0", date: "" } : null}
        onPaymentSelect={handlePaymentSelect}
      />
    </div>
  )
}
