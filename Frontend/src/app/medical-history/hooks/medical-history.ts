'use client'
import { useEffect, useState } from "react"

export function useMedicalHistory() {
    const [isLoading, setIsLoading] = useState(true)
    const [medicalHistoryData, setMedicalHistoryData] = useState(null)
    const [selectedCondition, setSelectedCondition] = useState(null)
    
    // Simulate loading for demo purposes
    useEffect(() => {
       fetch('http://localhost:3001/profile/get-profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
       }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }
        ).then((data) => {
            setMedicalHistoryData(data.data)
            setIsLoading(false)
        }
        ).catch((error) => {
            console.error('Error fetching medical history data:', error)
            setIsLoading(false)
        }
        )
    }, [])
    
    
    return {
        isLoading,
        medicalHistoryData,
    }
}