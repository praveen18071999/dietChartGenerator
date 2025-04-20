"use client"

import { useState } from "react"
import { useDietData } from "./hooks/use-diet-data"
import DashboardHeader from "./components/dashboard-header"
import DietDistributionChart from "./components/diet-distribution-chart"
import StatusDistributionChart from "./components/status-distribution-chart"
import MonthlyTrendChart from "./components/monthly-trend-chart"
import DietHistoryTable from "./components/diet-history-table"
import NutritionBreakdown from "./components/nutrition-breakdown"

export default function DietHistoryDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for demo purposes
  setTimeout(() => {
    setIsLoading(false)
  }, 1500)

  const { dietHistoryData, dietDistribution, statusDistribution, monthlyTrendData, selectedRow, handleRowSelect } =
    useDietData()

  return (
    <div className="container flex flex-col w-full mx-auto p-20">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <DietDistributionChart data={dietDistribution} isLoading={isLoading} selectedRow={selectedRow} />

        <StatusDistributionChart data={statusDistribution} isLoading={isLoading} selectedRow={selectedRow} />
      </div>

      <MonthlyTrendChart data={monthlyTrendData} isLoading={isLoading} />

      <DietHistoryTable
        data={dietHistoryData}
        isLoading={isLoading}
        selectedRow={selectedRow}
        onRowSelect={handleRowSelect}
      />

      {selectedRow && <NutritionBreakdown selectedRow={selectedRow} isLoading={isLoading} />}
    </div>
  )
}
