"use client"

import type React from "react"

import { useState } from "react"

export function useChat() {
  const [showChatBot, setShowChatBot] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [messageInput, setMessageInput] = useState("")

  const startChat = (professional: string) => {
    setSelectedProfessional(professional)
    setShowChatBot(true)
    setChatMessages([
      {
        role: "assistant",
        content:
          professional === "doctor"
            ? "Hello! I'm Dr. Smith, a nutrition specialist. How can I help you with your diet plan today?"
            : "Hi there! I'm Alex, a certified fitness trainer. How can I assist you with your fitness and nutrition goals?",
      },
    ])
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    setChatMessages([...chatMessages, { role: "user", content: messageInput }])
    setMessageInput("")

    // Simulate response
    setTimeout(() => {
      let response = ""
      if (selectedProfessional === "doctor") {
        response =
          "Thank you for sharing your diet plan. Based on your health profile, I recommend adjusting your protein intake. Would you like to schedule a consultation for a more detailed assessment?"
      } else {
        response =
          "Thanks for sharing your diet plan. For your lean muscle goal, I suggest increasing protein intake post-workout. Would you like me to create a complementary workout plan?"
      }
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)
  }

  const shareDietPlan = (dietDuration: number, calories: number, protein: number, carbs: number, fats: number) => {
    if (selectedProfessional) {
      const dietSummary = `Diet Plan Summary:
  - Duration: ${dietDuration} days
    - Total Calories: ${calories}
    - Protein: ${protein}g
    - Carbs: ${carbs}g
    - Fats: ${fats}g`

      setChatMessages([
        ...chatMessages,
        { role: "user", content: `I'd like to share my diet plan with you.` },
        { role: "user", content: dietSummary },
      ])

      // Simulate response
      setTimeout(() => {
        let response = ""
        if (selectedProfessional === "doctor") {
          response =
            "Thank you for sharing your diet plan. I've reviewed it and would like to discuss some adjustments based on your health profile. When would be a good time for a consultation?"
        } else {
          response =
            "Thanks for sharing your diet plan. It looks good overall, but I'd suggest some modifications to better support your fitness goals. Would you like me to provide specific recommendations?"
        }
        setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
      }, 1000)
    }
  }

  return {
    showChatBot,
    setShowChatBot,
    selectedProfessional,
    chatMessages,
    messageInput,
    setMessageInput,
    startChat,
    handleChatSubmit,
    shareDietPlan,
  }
}

