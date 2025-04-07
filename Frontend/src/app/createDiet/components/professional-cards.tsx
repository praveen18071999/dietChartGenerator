"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfessionalCardsProps {
  onStartChat: (professional: string) => void
}

export function ProfessionalCards({ onStartChat }: ProfessionalCardsProps) {
  return (
    <div className="mt-8 p-6 bg-purple-100 rounded-xl border-2">
      <h3 className="text-2xl font-bold mb-4">Connect with a Professional</h3>
      <p className="text-lg text-gray-600 mb-6">
        Get personalized advice on your diet plan from a healthcare professional or fitness trainer.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card
            className="cursor-pointer hover:shadow-xl transition-all border-2"
            onClick={() => onStartChat("doctor")}
          >
            <CardContent className="p-6 flex items-center gap-4 bg-blue-50 border-blue-100">
              <Avatar className="h-16 w-16 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">DR</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-xl font-bold">Consult a Doctor</h4>
                <p className="text-gray-600">Get medical advice on your diet plan</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card
            className="cursor-pointer hover:shadow-xl transition-all border-2"
            onClick={() => onStartChat("trainer")}
          >
            <CardContent className="p-6 flex items-center gap-4 bg-green-50 border-green-100">
              <Avatar className="h-16 w-16 border-2 border-green-200">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-green-100 text-green-700 text-xl font-bold">TR</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-xl font-bold">Talk to a Trainer</h4>
                <p className="text-gray-600">Get fitness advice to complement your diet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

