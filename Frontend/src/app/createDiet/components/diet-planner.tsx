/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter } from "next/navigation"
import { Apple, Share2, Activity, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDietPlan } from "../hooks/use-diet-plan"
import { useCart } from "../hooks/use-cart"
import { useChat } from "../hooks/use-chat"
import { MealSection } from "../components/meal-section"
import { NutritionSummary } from "../components/nutition-summary"
import { DurationSelector } from "../components/duration-selector"
import { ProfessionalCards } from "../components/professional-cards"
import { CartDialog } from "../components/cart-dialog"
import { ChatDialog } from "../components/chat-dialog"
import { ProfileForm } from "../components/profile-form"
import { ProfileSummary } from "../components/profile-summary"


const diseases = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "kidney-disease", label: "Kidney Disease" },
  { id: "celiac", label: "Celiac Disease" },
  { id: "lactose", label: "Lactose Intolerance" },
]

export default function DietPlanner(dietId: any) {
  const router = useRouter()
  //console.log("Diet ID:", dietId)
  //console.log(dietId.length)

  const {
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
    saveDietPlan,
    updateDietPlan,
    hasDietChanged,
    setHasDietChanged, // Add this line
    originalDietPlan, // Add this line
    setOriginalDietPlan, // Add this line
    loading,
  } = useDietPlan(dietId)

  const { cartItems, showCartDialog, setShowCartDialog, addToCart, removeFromCart, getTotalCartPrice } = useCart()

  const {
    showChatBot,
    setShowChatBot,
    selectedProfessional,
    chatMessages,
    messageInput,
    setMessageInput,
    startChat,
    handleChatSubmit,
    shareDietPlan,
  } = useChat()
  console.log("Diet ID:", dietId.dietId)
  const proceedToCheckout = () => {
    setShowCartDialog(false)
    router.push("/checkout?dietid=" + dietId.dietId)
  }

  const handleAddToCart = (item: any) => {
    const mealType = item.mealType || "snacks"
    addToCart(item, deliveryTimes[mealType as keyof typeof deliveryTimes])
  }

  const handleShareDietPlan = () => {
    const totals = calculateDailyTotals()
    shareDietPlan(dietDuration, totals.calories, totals.protein, totals.carbs, totals.fats)
  }
  if(loading) { 
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Apple className="h-6 w-6 text-purple-800" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Loading Your Diet Plan</h2>
            <p className="text-muted-foreground max-w-md">
              We&apos;re retrieving your personalized diet plan. This will just take a moment...
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col flex-grow w-full h-full min-h-screen bg-white overflow-hidden px-4 py-6">
      <div className="max-w-full mx-auto w-full space-y-10">
      <Card className="border-2 shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <Apple className="h-7 w-7 text-white" />
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Personalized Diet Planner</CardTitle>
              <CardDescription className="text-lg">
                Enter your details to generate a customized diet plan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm
            onSubmit={generateDietPlan}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            initialProfile={profileRef.current}
          />
        </CardContent>
      </Card>

      {showDietPlan && (
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Your Personalized Diet Plan</CardTitle>
            <CardDescription className="text-lg mb-6">
              This plan is customized based on your details. You can edit it as needed.
            </CardDescription>

            <ProfileSummary profile={profileRef.current} diseases={diseases} />
          </CardHeader>
          <CardContent className="space-y-10">
            {Object.entries(dietPlan).map(([mealType, items]) => (
              <MealSection
                key={mealType}
                mealType={mealType}
                items={items}
                deliveryTime={deliveryTimes[mealType as keyof typeof deliveryTimes]}
                onUpdateDeliveryTime={(time) => updateDeliveryTime(mealType, time)}
                onAddItem={() => addMealItem(mealType)}
                onRemoveItem={(itemId) => removeMealItem(mealType, itemId)}
                onUpdateItem={(itemId, field, value) => updateMealItem(mealType, itemId, field, value)}
                onAddToCart={handleAddToCart}
                calculateTotals={calculateTotals}
              />
            ))}

            <NutritionSummary
              calories={calculateDailyTotals().calories}
              protein={calculateDailyTotals().protein}
              carbs={calculateDailyTotals().carbs}
              fats={calculateDailyTotals().fats}
            />

            <DurationSelector
              duration={dietDuration}
              onDurationChange={setDietDuration}
              goal={profileRef.current.goal}
            />

            <ProfessionalCards onStartChat={startChat} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 text-lg"
              onClick={handleShareDietPlan}
            >
              <Share2 className="h-5 w-5" />
              Share Diet Plan
            </Button>
            {dietId.dietId ? (
              <Button
                className="bg-purple-600 hover:bg-purple-500 text-white h-12 text-lg"
                onClick={() => updateDietPlan()}
                disabled={!hasDietChanged}
              >
                Update Diet Plan
              </Button>
            ) : (
              <Button
                className="bg-purple-600 hover:bg-purple-500 text-white h-12 text-lg"
                onClick={() => saveDietPlan(dietDuration)}
                disabled={isGenerating || !hasDietChanged}
              >
                Save Diet Plan
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      <CartDialog
        cartItems={cartItems}
        showCartDialog={showCartDialog}
        setShowCartDialog={setShowCartDialog}
        removeFromCart={removeFromCart}
        getTotalCartPrice={getTotalCartPrice}
        proceedToCheckout={proceedToCheckout}
      />

      <ChatDialog
        showChatBot={showChatBot}
        setShowChatBot={setShowChatBot}
        selectedProfessional={selectedProfessional}
        chatMessages={chatMessages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleChatSubmit={handleChatSubmit}
        shareDietPlan={handleShareDietPlan}
      />
    </div>
    </div>
  )
}

