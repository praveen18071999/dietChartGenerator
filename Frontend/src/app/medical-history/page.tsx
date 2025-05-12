'use client'
import { MedicalHistoryClient } from "./components/medical-history-client"
import { useMedicalHistory } from "./hooks/medical-history"
import Loading from "./components/loading"

// This is a Server Component
export default function MedicalHistoryPage() {
  const { isLoading, medicalHistoryData } = useMedicalHistory()
 if(isLoading) {
    return <Loading />
  }

  return (
    <div className="container p-20 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Medical History</h1>
      <MedicalHistoryClient data={medicalHistoryData}/>
    </div>
  )
}
