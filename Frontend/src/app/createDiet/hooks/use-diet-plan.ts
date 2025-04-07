/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"

export type MealItem = {
  id: string
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fats: number
  mealType?: string
  deliveryTime?: string
}

export type UserProfile = {
  height: string
  weight: string
  gender: string
  goal: string
  activityLevel: string
  diseases: string[]
  otherDisease?: string
}

export const mealColors = {
  breakfast: {
    bg: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-800",
    accent: "bg-amber-500",
  },
  lunch: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-800",
    accent: "bg-emerald-500",
  },
  dinner: {
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-800",
    accent: "bg-indigo-500",
  },
  snacks: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-800",
    accent: "bg-rose-500",
  },
}

export function useDietPlan() {
  const profileRef = useRef<UserProfile>({
    height: "",
    weight: "",
    gender: "male",
    goal: "lean muscle",
    activityLevel: "none",
    diseases: [],
    otherDisease: "",
  })

  const [dietPlan, setDietPlan] = useState<{ [key: string]: MealItem[] }>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  })
  const [showDietPlan, setShowDietPlan] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [dietDuration, setDietDuration] = useState(7)
  const [deliveryTimes, setDeliveryTimes] = useState({
    breakfast: "08:00",
    lunch: "12:30",
    dinner: "19:00",
    snacks: "16:00",
  })

  const updateDeliveryTime = (mealType: string, time: string) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [mealType]: time,
    }))
  }

  const addMealItem = (mealType: string) => {
    const newItem: MealItem = {
      id: Math.random().toString(36).substring(7),
      name: "",
      quantity: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: mealType,
    }
    setDietPlan({
      ...dietPlan,
      [mealType]: [...dietPlan[mealType], newItem],
    })
  }

  const removeMealItem = (mealType: string, itemId: string) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].filter((item) => item.id !== itemId),
    })
  }

  const updateMealItem = (mealType: string, itemId: string, field: keyof MealItem, value: any) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    })
  }

  const calculateTotals = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fats: acc.fats + item.fats,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )
  }

  const calculateDailyTotals = () => {
    const allItems = [...dietPlan.breakfast, ...dietPlan.lunch, ...dietPlan.dinner, ...dietPlan.snacks]
    return calculateTotals(allItems)
  }

  const generateDietPlan = (profile: UserProfile) => {
    profileRef.current = profile
    console.log("Generating diet plan for profile:", profile)

    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // In a real app, you would call an API to generate the diet plan
    setTimeout(() => {
      setDietPlan({
        breakfast: [
          {
            id: "1",
            name: "Oatmeal with berries",
            quantity: "1 bowl",
            calories: 350,
            protein: 12,
            carbs: 60,
            fats: 7,
            mealType: "breakfast",
          },
          {
            id: "2",
            name: "Greek yogurt",
            quantity: "1 cup",
            calories: 150,
            protein: 20,
            carbs: 8,
            fats: 4,
            mealType: "breakfast",
          },
        ],
        lunch: [
          {
            id: "3",
            name: "Grilled chicken salad",
            quantity: "1 plate",
            calories: 450,
            protein: 40,
            carbs: 20,
            fats: 15,
            mealType: "lunch",
          },
        ],
        dinner: [
          {
            id: "4",
            name: "Salmon with vegetables",
            quantity: "200g",
            calories: 500,
            protein: 45,
            carbs: 15,
            fats: 25,
            mealType: "dinner",
          },
          {
            id: "5",
            name: "Brown rice",
            quantity: "1/2 cup",
            calories: 150,
            protein: 3,
            carbs: 30,
            fats: 1,
            mealType: "dinner",
          },
        ],
        snacks: [
          {
            id: "6",
            name: "Protein shake",
            quantity: "1 serving",
            calories: 200,
            protein: 30,
            carbs: 10,
            fats: 3,
            mealType: "snacks",
          },
          {
            id: "7",
            name: "Almonds",
            quantity: "30g",
            calories: 180,
            protein: 6,
            carbs: 5,
            fats: 15,
            mealType: "snacks",
          },
        ],
      })

      setIsGenerating(false)
      setShowDietPlan(true)
      clearInterval(interval)
    }, 2000)
  }

  return {
    profileRef,
    dietPlan,
    showDietPlan,
    isGenerating,
    generationProgress,
    dietDuration,
    deliveryTimes,
    setDietDuration,
    updateDeliveryTime,
    addMealItem,
    removeMealItem,
    updateMealItem,
    calculateTotals,
    calculateDailyTotals,
    generateDietPlan,
  }
}

