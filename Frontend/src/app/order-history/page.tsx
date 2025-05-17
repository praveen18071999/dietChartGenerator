/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useDietData } from "./hooks/use-diet-data"
import DashboardHeader from "./components/dashboard-header"
import DietDistributionChart from "./components/diet-distribution-chart"
import StatusDistributionChart from "./components/status-distribution-chart"
import MonthlyTrendChart from "./components/monthly-trend-chart"
import DietHistoryTable, { DietHistoryRow } from "./components/diet-history-table"
import NutritionBreakdown from "./components/nutrition-breakdown"

export default function DietHistoryDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for demo purposes
  setTimeout(() => {
    setIsLoading(false)
  }, 1500)

  const { dietHistoryData, dietDistribution, statusDistribution, monthlyTrendData, selectedRow, handleRowSelect } =
    useDietData()

  const handleRowSelectAdapter = (row: DietHistoryRow) => {
    // Assume the row has all the properties we need, even if TypeScript doesn't know it
    handleRowSelect(row as any);
  }

  return (
    <div className="container flex flex-col w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
      <DashboardHeader />

      {/* Distribution charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="relative w-full min-h-[300px] p-2 sm:p-4 bg-white rounded-lg shadow-sm">
          <DietDistributionChart
            data={dietDistribution}
            isLoading={isLoading}
            selectedRow={selectedRow ? { diet: selectedRow.diet } : undefined}
          />
        </div>

        <div className="relative w-full min-h-[300px] p-2 sm:p-4 bg-white rounded-lg shadow-sm">
          <StatusDistributionChart
            data={statusDistribution}
            isLoading={isLoading}
            selectedRow={selectedRow ? { diet: selectedRow.diet } : undefined}
          />
        </div>
      </div>

      {/* Monthly trend chart */}
      <div className="relative w-full min-h-[350px] p-2 sm:p-4 bg-white rounded-lg shadow-sm mb-6 md:mb-8">
        <MonthlyTrendChart data={monthlyTrendData} isLoading={isLoading} />
      </div>

      {/* History table */}
      <div className="w-full max-w-full overflow-x-auto bg-white rounded-lg shadow-sm mb-6 md:mb-8">
        <DietHistoryTable
          data={dietHistoryData}
          isLoading={isLoading}
          selectedRow={selectedRow}
          onRowSelect={handleRowSelectAdapter}
        />
      </div>

      {/* Nutrition breakdown */}
      {selectedRow && (
        <div className="w-full mt-4 md:mt-6 p-2 sm:p-4 bg-white rounded-lg shadow-sm">
          <NutritionBreakdown selectedRow={selectedRow} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}