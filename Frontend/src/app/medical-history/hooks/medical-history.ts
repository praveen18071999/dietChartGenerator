'use client'
import { useEffect, useState } from "react"
import API from "@/utils/api"

export function useMedicalHistory() {
    const [isLoading, setIsLoading] = useState(true)
    const [medicalHistoryData, setMedicalHistoryData] = useState(null)
    const [selectedCondition, setSelectedCondition] = useState(null)
    
    // Simulate loading for demo purposes
    useEffect(() => {
       fetch(API.PROFILE_GETPROFILE,{
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