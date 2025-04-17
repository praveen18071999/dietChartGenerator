"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

interface DeliveryCountdownProps {
  deliveryTime: string
  mealType: string
  deliveryDate: Date
}

export function DeliveryCountdown({ deliveryTime, mealType, deliveryDate }: DeliveryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isToday: boolean
    isTomorrow: boolean
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isTomorrow: false })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const [deliveryHours, deliveryMinutes] = deliveryTime.split(":").map(Number)
      
      // Create a new date using the provided delivery date
      const targetDeliveryDate = new Date(deliveryDate)
      // Set the time for that specific date
      targetDeliveryDate.setHours(deliveryHours, deliveryMinutes, 0, 0)
      
      // If the delivery time has already passed
      if (targetDeliveryDate < now) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: false,
          isTomorrow: false
        }
      }
      
      // Calculate milliseconds difference
      const diffMs = targetDeliveryDate.getTime() - now.getTime()
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      
      // Check if it's today or tomorrow
      const isToday = now.getDate() === targetDeliveryDate.getDate() &&
                       now.getMonth() === targetDeliveryDate.getMonth() &&
                       now.getFullYear() === targetDeliveryDate.getFullYear()
      
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const isTomorrow = tomorrow.getDate() === targetDeliveryDate.getDate() &&
                         tomorrow.getMonth() === targetDeliveryDate.getMonth() &&
                         tomorrow.getFullYear() === targetDeliveryDate.getFullYear()

      return {
        days,
        hours,
        minutes,
        seconds,
        isToday,
        isTomorrow
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [deliveryTime, deliveryDate])

  // Format the delivery date message based on when it's coming
  const getDeliveryMessage = () => {
    if (timeLeft.isToday) {
      return "today";
    } else if (timeLeft.isTomorrow) {
      return "tomorrow";
    } else {
      return `on ${format(deliveryDate, 'EEE, MMM d')}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {timeLeft.days > 0 && (
          <div className="bg-white p-4 rounded-lg border-2 text-center">
            <p className="text-4xl font-bold text-purple-600">{timeLeft.days.toString().padStart(2, "0")}</p>
            <p className="text-gray-500 text-sm">Days</p>
          </div>
        )}
        <div className="bg-white p-4 rounded-lg border-2 text-center">
          <p className="text-4xl font-bold text-purple-600">{timeLeft.hours.toString().padStart(2, "0")}</p>
          <p className="text-gray-500 text-sm">Hours</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 text-center">
          <p className="text-4xl font-bold text-purple-600">{timeLeft.minutes.toString().padStart(2, "0")}</p>
          <p className="text-gray-500 text-sm">Minutes</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 text-center">
          <p className="text-4xl font-bold text-purple-600">{timeLeft.seconds.toString().padStart(2, "0")}</p>
          <p className="text-gray-500 text-sm">Seconds</p>
        </div>
      </div>

      <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
        <p className="text-purple-800 font-medium">
          Your {mealType} will be delivered {getDeliveryMessage()} at {deliveryTime}.
        </p>
      </div>
    </div>
  )
}