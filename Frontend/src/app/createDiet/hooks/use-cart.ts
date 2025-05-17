"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { MealItem } from "./use-diet-plan"

export function useCart() {
  const [cartItems, setCartItems] = useState<MealItem[]>([])
  const [showCartDialog, setShowCartDialog] = useState(false)

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("dietPlannerCart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dietPlannerCart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: MealItem, deliveryTime: string) => {
    // Make sure the item has a mealType and deliveryTime
    const itemWithDetails = {
      ...item,
      //id: Math.random().toString(36).substring(7),
      mealType: item.mealType || "snacks", // Default to snacks if no meal type
      deliveryTime: deliveryTime,
    }

    setCartItems([...cartItems, itemWithDetails])

    // Show a toast notification
   
    toast.success(`${item.name} has been added to your cart!`, {
      duration: 3000,
      action: {
        label: "View Cart",
        onClick: () => setShowCartDialog(true),
      },
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }

  const getTotalCartPrice = () => {
    // In a real app, each item would have a price
    // For this demo, we'll use a simple calculation based on calories
    return cartItems.reduce((total, item) => total + item.calories * 0.05, 0).toFixed(2)
  }

  return {
    cartItems,
    showCartDialog,
    setShowCartDialog,
    addToCart,
    removeFromCart,
    getTotalCartPrice,
    setCartItems,
  }
}

