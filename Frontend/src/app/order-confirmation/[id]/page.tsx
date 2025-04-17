"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Clock, MapPin, ArrowLeft, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DeliveryCountdown } from "@/components/delivery-countdown"
import { format, set } from "date-fns"

type OrderItem = {
  id: string
  name: string
  quantity: string
  calories: number
  price: number
  mealType?: string
  deliveryTime?: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  //const searchParams = useSearchParams()
  const params = useParams();
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [breakfastTime, setBreakfastTime] = useState<string>("");
  const [lunchTime, setLunchTime] = useState<string>("");
  const [dinnerTime, setDinnerTime] = useState<string>("");
  const [snackTime, setSnackTime] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string
    items: OrderItem[]
    customer: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      email: string
      phone: string
    }
    payment: {
      subtotal: number
      tax: number
      deliveryFee: number
      total: number
    }
    deliveryTimes: Record<string, string>
  } | null>(null)

  const orderId = params.id
  console.log("Order ID from params:", orderId);
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/orders/order-confirmation/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Raw date from API:", data.data.cartData.startdate);

        // Parse the date without timezone conversion
        const rawDate = data.data.cartData.startdate;
        const dateParts = rawDate.split('T')[0].split('-');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JS
        const day = parseInt(dateParts[2], 10);

        // Create date with the exact date parts (no time) to avoid timezone issues
        const deliveryDate = new Date(year, month, day);
        console.log("Parsed delivery date:", deliveryDate);

        setStartDate(deliveryDate);

        // Extract delivery times directly from order items without defaults
        const deliveryTimes: Record<string, string> = {};

        // Only use actual times from the data
        for (const item of data.data.cartData.diet) {
          if (item.mealType && item.deliveryTime) {
            // Ensure deliveryTime is properly formatted as "HH:MM"
            const formattedTime = item.deliveryTime.includes(':') ?
              item.deliveryTime :
              `${item.deliveryTime.slice(0, 2)}:${item.deliveryTime.slice(2, 4)}`;

            deliveryTimes[item.mealType] = formattedTime;

            // Also update state for component use
            if (item.mealType === "breakfast") setBreakfastTime(formattedTime);
            if (item.mealType === "lunch") setLunchTime(formattedTime);
            if (item.mealType === "dinner") setDinnerTime(formattedTime);
            if (item.mealType === "snack") setSnackTime(formattedTime);
          }

          // Set price for each item
          item.price = item.calories * 0.05;
        }

        const orderDetails = {
          orderId: 'ORD' + orderId,
          items: data.data.cartData.diet,
          customer: {
            name: data.data.deliveryData.firstname + " " + data.data.deliveryData.lastname,
            address: data.data.deliveryData.address,
            city: data.data.deliveryData.city,
            state: data.data.deliveryData.state,
            zip: data.data.deliveryData.zipcode,
            email: data.data.deliveryData.email,
            phone: data.data.deliveryData.phonenumber,
          },
          payment: {
            subtotal: parseFloat(data.data.transactionData.subtotal),
            tax: parseFloat(data.data.transactionData.tax),
            deliveryFee: parseFloat(data.data.transactionData.deliveryfee),
            total: parseFloat(data.data.transactionData.totalAmount),
          },
          deliveryTimes: deliveryTimes, // Only use actual times from the data
        };

        console.log("Order details fetched successfully:", orderDetails);
        setOrderDetails(orderDetails);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  }, [orderId]);
  // useEffect(() => {

  //   let storedCart = localStorage.getItem("dietPlannerCart");
  //   let storedCustomer = localStorage.getItem("dietPlannerCustomer");
  //   let orderFound = false;
  //   if (storedCart && storedCustomer) {
  //     try {
  //       const cartItems = JSON.parse(storedCart);
  //       const customer = JSON.parse(storedCustomer);

  //       // Group items by meal type to get delivery times
  //       const mealGroups: Record<string, string> = {};
  //       cartItems.forEach((item: any) => {
  //         if (item.mealType && item.deliveryTime) {
  //           mealGroups[item.mealType] = item.deliveryTime;
  //         }
  //       });

  //       // Calculate payment details
  //       const subtotal = cartItems.reduce((total: number, item: any) => total + item.calories * 0.05, 0);
  //       const tax = subtotal * 0.08;
  //       const deliveryFee = 5.99;
  //       const total = subtotal + tax + deliveryFee;

  //       setOrderDetails({
  //         orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000),
  //         items: cartItems.map((item: any) => ({
  //           ...item,
  //           price: item.calories * 0.05,
  //         })),
  //         customer,
  //         payment: {
  //           subtotal,
  //           tax,
  //           deliveryFee,
  //           total,
  //         },
  //         deliveryTimes: mealGroups,
  //       });

  //       orderFound = true;
  //     } catch (error) {
  //       console.error("Error parsing stored data:", error);
  //     }
  //   }

  //   // If no order was found, use dummy data
  //   if (!orderFound) {
  //     // Set dummy data
  //     const dummyOrderDetails = {
  //       orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000),
  //       items: [
  //         {
  //           id: "item1",
  //           name: "Grilled Chicken Salad",
  //           quantity: "1 serving",
  //           calories: 350,
  //           price: 17.50,
  //           mealType: "lunch",
  //           deliveryTime: "12:30"
  //         },
  //         {
  //           id: "item2",
  //           name: "Protein Smoothie",
  //           quantity: "16 oz",
  //           calories: 280,
  //           price: 14.00,
  //           mealType: "breakfast",
  //           deliveryTime: "08:00"
  //         },
  //         {
  //           id: "item3",
  //           name: "Salmon with Vegetables",
  //           quantity: "1 serving",
  //           calories: 450,
  //           price: 22.50,
  //           mealType: "dinner",
  //           deliveryTime: "19:00"
  //         }
  //       ],
  //       customer: {
  //         name: "John Doe",
  //         address: "123 Main Street",
  //         city: "San Francisco",
  //         state: "CA",
  //         zip: "94105",
  //         email: "john.doe@example.com",
  //         phone: "555-123-4567"
  //       },
  //       payment: {
  //         subtotal: 54.00,
  //         tax: 4.32,
  //         deliveryFee: 5.99,
  //         total: 64.31
  //       },
  //       deliveryTimes: {
  //         breakfast: "08:00",
  //         lunch: "12:30",
  //         dinner: "19:00"
  //       }
  //     };

  //     setOrderDetails(dummyOrderDetails);
  //   }

  //   setLoading(false);

  //   // Clear cart after order is placed
  //   localStorage.removeItem("dietPlannerCart");
  // }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-end items-center p-8">
        <div className="text-center">
          <Progress value={80} className="w-60 h-2 mb-4" />
          <p className="text-gray-500">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order details not found</h1>
          <p className="text-gray-500 mb-6">We couldn&apos;t find your order details</p>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-500">
            Return to Diet Planner
          </Button>
        </div>
      </div>
    )
  }

  // Find the next meal to be delivered
  // Find the next meal to be delivered
  const now = new Date(); // Current time
  const deliveryDate = new Date(startDate); // The selected delivery date

  // Only compare times if the delivery is today
  const isSameDay =
    now.getDate() === deliveryDate.getDate() &&
    now.getMonth() === deliveryDate.getMonth() &&
    now.getFullYear() === deliveryDate.getFullYear();

  const currentHour = isSameDay ? now.getHours() : 0;
  const currentMinutes = isSameDay ? now.getMinutes() : 0;
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  // If the delivery is in the future, all meals are "next"
  const isDeliveryInFuture = deliveryDate > now;

  // Find the next meal to be delivered
  let nextDelivery: { mealType: string; time: string; timeInMinutes: number } | null = null as {
    mealType: string;
    time: string;
    timeInMinutes: number;
  } | null;

  Object.entries(orderDetails.deliveryTimes || {}).forEach(([mealType, time]) => {
    if (!time || !time.includes(':')) return; // Skip invalid time formats

    const [hours, minutes] = time.split(":").map(Number)
    if (isNaN(hours) || isNaN(minutes)) return; // Skip if parsing failed

    const timeInMinutes = hours * 60 + minutes

    // If the delivery is later today
    if (timeInMinutes > currentTimeInMinutes) {
      if (!nextDelivery || timeInMinutes < nextDelivery.timeInMinutes) {
        nextDelivery = { mealType, time, timeInMinutes }
      }
    }
  });

  // If no delivery is found for today, find the earliest one for tomorrow
  if (!nextDelivery) {
    Object.entries(orderDetails.deliveryTimes).forEach(([mealType, time]) => {
      const [hours, minutes] = time.split(":").map(Number)
      const timeInMinutes = hours * 60 + minutes

      if (!nextDelivery || timeInMinutes < nextDelivery.timeInMinutes) {
        nextDelivery = { mealType, time, timeInMinutes }
      }
    })
  }

  return (
    <div className="min-h-screen bg-white-50 p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/createDiet")} className="mb-6 flex items-center gap-2 text-lg">
          <ArrowLeft className="h-5 w-5" />
          Return to Diet Plan
        </Button>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
            <p className="text-green-700">
              Your order #{orderDetails.orderId} has been placed successfully. You&apos;ll receive an email confirmation
              shortly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {nextDelivery && (
              <Card className="border-2 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Clock className="h-6 w-6 text-purple-600" />
                    Next Delivery
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your {nextDelivery.mealType} will be delivered at {nextDelivery.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeliveryCountdown
                    deliveryTime={nextDelivery.time}
                    mealType={nextDelivery.mealType}
                    deliveryDate={startDate} // Pass the delivery date
                  />
                </CardContent>
              </Card>
            )}

            <Card className="border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Truck className="h-6 w-6 text-purple-600" />
                  Delivery Schedule
                </CardTitle>
                <CardDescription className="text-base">Your meals will be delivered at these times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(orderDetails.deliveryTimes).map(([mealType, time]) => (
                  <div key={mealType} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-lg capitalize">{mealType}</p>
                      <p className="text-gray-500">
                        {orderDetails.items.filter((item) => item.mealType === mealType).length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{time}</p>
                      <p className="text-gray-500">
                        {startDate ? format(startDate, 'EEE, MMM d') : 'Loading date...'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-purple-600" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-lg">{orderDetails.customer.name}</p>
                  <p className="text-gray-600">{orderDetails.customer.address}</p>
                  <p className="text-gray-600">
                    {orderDetails.customer.city}, {orderDetails.customer.state} {orderDetails.customer.zip}
                  </p>
                  <p className="text-gray-600 mt-2">{orderDetails.customer.phone}</p>
                  <p className="text-gray-600">{orderDetails.customer.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-2 shadow-md sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                <CardDescription className="text-base">Order #{orderDetails.orderId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400 capitalize">{item.mealType}</p>
                          <p className="text-sm text-gray-400">• {item.deliveryTime}</p>
                        </div>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${orderDetails.payment.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${orderDetails.payment.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${orderDetails.payment.deliveryFee.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${orderDetails.payment.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button onClick={() => router.push("/")} className="w-full h-12 text-lg">
                  Order Again
                </Button>
              </CardFooter> */}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
