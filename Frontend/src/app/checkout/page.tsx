"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

type CartItem = {
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

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Default delivery times for each meal type
  const defaultDeliveryTimes = {
    breakfast: "08:00",
    lunch: "12:30",
    dinner: "19:00",
    snacks: "16:00",
  }

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCart = localStorage.getItem("dietPlannerCart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error("Error parsing cart data:", error)
      }
    }
    setLoading(false)
  }, [])

  const updateDeliveryTime = (mealType: string, time: string) => {
    setCartItems(cartItems.map((item) => (item.mealType === mealType ? { ...item, deliveryTime: time } : item)))
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.calories * 0.05, 0).toFixed(2)
  }

  const handlePlaceOrder = () => {
    alert("Order placed successfully!")
    localStorage.removeItem("dietPlannerCart")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Progress value={80} className="w-60 h-2" />
        <p className="mt-4 text-gray-500">Loading your cart...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add items from your diet plan to get started</p>
        <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-500">
          Return to Diet Planner
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6 flex items-center gap-2 text-lg">
          <ArrowLeft className="h-5 w-5" />
          Return to Diet Plan
        </Button>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Select Delivery Times</CardTitle>
                <CardDescription className="text-base">
                  Choose when you&apos;d like each meal to be delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
                  const mealItems = cartItems.filter((item) => item.mealType === mealType)
                  if (mealItems.length === 0) return null

                  return (
                    <div key={mealType} className="border rounded-lg p-4">
                      <h3 className="text-xl font-bold capitalize mb-4">{mealType}</h3>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-base font-medium">Delivery Time:</span>
                        <Select
                          defaultValue={defaultDeliveryTimes[mealType as keyof typeof defaultDeliveryTimes]}
                          onValueChange={(value) => updateDeliveryTime(mealType, value)}
                        >
                          <SelectTrigger className="w-40 h-10">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {mealType === "breakfast" && (
                              <>
                                <SelectItem value="07:00">7:00 AM</SelectItem>
                                <SelectItem value="07:30">7:30 AM</SelectItem>
                                <SelectItem value="08:00">8:00 AM</SelectItem>
                                <SelectItem value="08:30">8:30 AM</SelectItem>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                              </>
                            )}
                            {mealType === "lunch" && (
                              <>
                                <SelectItem value="11:30">11:30 AM</SelectItem>
                                <SelectItem value="12:00">12:00 PM</SelectItem>
                                <SelectItem value="12:30">12:30 PM</SelectItem>
                                <SelectItem value="13:00">1:00 PM</SelectItem>
                                <SelectItem value="13:30">1:30 PM</SelectItem>
                              </>
                            )}
                            {mealType === "dinner" && (
                              <>
                                <SelectItem value="18:00">6:00 PM</SelectItem>
                                <SelectItem value="18:30">6:30 PM</SelectItem>
                                <SelectItem value="19:00">7:00 PM</SelectItem>
                                <SelectItem value="19:30">7:30 PM</SelectItem>
                                <SelectItem value="20:00">8:00 PM</SelectItem>
                              </>
                            )}
                            {mealType === "snacks" && (
                              <>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="15:30">3:30 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                                <SelectItem value="16:30">4:30 PM</SelectItem>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        {mealItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-t">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.calories * 0.05).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="shadow-md border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input className="h-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input className="h-10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input className="h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                    <Input className="h-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input className="h-10" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input className="h-10" type="email" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-md border-2 sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(Number.parseFloat(getSubtotal()) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">$5.99</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${(Number.parseFloat(getSubtotal()) + Number.parseFloat(getSubtotal()) * 0.08 + 5.99).toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

