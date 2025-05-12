"use client"

import { useState } from "react"
import { User, Activity, Heart, Ruler, Scale, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define the data type
type MedicalData = {
  user: {
    name: string
    age: number
    gender: string
    email: string
    avatar: string
  }
  vitals: {
    height: number
    weight: number
    bmi: number
    bloodPressure: string
    heartRate: number
    bloodSugar: number
  }
  conditions: Array<{
    name: string
    diagnosed: string
    severity: string
    controlled: boolean
  }>
  weightHistory: Array<{
    date: string
    weight: number
  }>
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: string
  }>
  dietaryRestrictions: string[]
} | null

// Client Component that receives data from the Server Component
export function MedicalHistoryClient({ data }: { data: MedicalData }) {
  const [dialogOpen, setDialogOpen] = useState(data === null)

  // If no data, show the dialog and fallback UI
  if (data === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>No Medical History Found</DialogTitle>
              <DialogDescription>
                We couldn&apos;t find any medical history data for your profile. Please update your profile information to
                view your medical history.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <div className="rounded-full bg-muted p-8">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button asChild>
                <Link href="/profile">Update Profile</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fallback content when dialog is closed */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Medical History Available</h2>
          <p className="text-muted-foreground mb-4">Please update your profile to view your medical history.</p>
          <Button asChild>
            <Link href="/profile">Update Profile</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate ideal weight range based on height (using BMI 18.5-24.9)
  const minIdealWeight = Math.round(18.5 * Math.pow(data.vitals.height / 100, 2) * 10) / 10
  const maxIdealWeight = Math.round(24.9 * Math.pow(data.vitals.height / 100, 2) * 10) / 10

  // Calculate weight progress percentage
  const startWeight = data.weightHistory[0].weight
  const currentWeight = data.weightHistory[data.weightHistory.length - 1].weight
  const weightLoss = startWeight - currentWeight
  const targetLoss = startWeight - maxIdealWeight
  const progressPercentage = Math.min(100, Math.round((weightLoss / targetLoss) * 100))

  // If data exists, show the medical history
  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-muted">
                <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                <AvatarFallback>
                  {data.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{data.user.name}</h3>
                <p className="text-muted-foreground">
                  {data.user.age} years • {data.user.gender}
                </p>
                <p className="text-sm text-muted-foreground">{data.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Current Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Height</span>
                </div>
                <p className="font-medium">{data.vitals.height} cm</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Weight</span>
                </div>
                <p className="font-medium">{data.vitals.weight} kg</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Blood Pressure</span>
                </div>
                <p className="font-medium">{data.vitals.bloodPressure}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Heart Rate</span>
                </div>
                <p className="font-medium">{data.vitals.heartRate} bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
              <CardDescription>A summary of your current health status and metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">BMI Status</h4>
                  <span
                    className={`text-sm font-medium ${
                      data.vitals.bmi < 18.5
                        ? "text-blue-500"
                        : data.vitals.bmi < 25
                          ? "text-emerald-500"
                          : data.vitals.bmi < 30
                            ? "text-amber-500"
                            : "text-red-500"
                    }`}
                  >
                    {data.vitals.bmi < 18.5
                      ? "Underweight"
                      : data.vitals.bmi < 25
                        ? "Healthy"
                        : data.vitals.bmi < 30
                          ? "Overweight"
                          : "Obese"}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      data.vitals.bmi < 18.5
                        ? "bg-blue-500"
                        : data.vitals.bmi < 25
                          ? "bg-emerald-500"
                          : data.vitals.bmi < 30
                            ? "bg-amber-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (data.vitals.bmi / 40) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your BMI is {data.vitals.bmi}, which indicates{" "}
                  {data.vitals.bmi < 18.5
                    ? "you may be underweight."
                    : data.vitals.bmi < 25
                      ? "you're at a healthy weight."
                      : data.vitals.bmi < 30
                        ? "you may be overweight."
                        : "you may be obese."}{" "}
                  Ideal weight range for your height: {minIdealWeight}-{maxIdealWeight} kg.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {data.dietaryRestrictions.map((restriction, i) => (
                    <Badge key={i} variant="secondary">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Active Medical Conditions</h4>
                <div className="space-y-3">
                  {data.conditions.map((condition, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          className={`h-4 w-4 ${
                            condition.severity === "Mild"
                              ? "text-emerald-500"
                              : condition.severity === "Moderate"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        />
                        <span>{condition.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Since{" "}
                          {new Date(condition.diagnosed).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                        <Badge variant={condition.controlled ? "outline" : "destructive"} className="text-xs">
                          {condition.controlled ? "Controlled" : "Uncontrolled"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
              <CardDescription>Detailed information about your diagnosed conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.conditions.map((condition, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{condition.name}</h3>
                      <Badge variant={condition.controlled ? "outline" : "destructive"}>
                        {condition.controlled ? "Controlled" : "Uncontrolled"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Diagnosed</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(condition.diagnosed).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Severity</p>
                        <p
                          className={`font-medium ${
                            condition.severity === "Mild"
                              ? "text-emerald-500"
                              : condition.severity === "Moderate"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {condition.severity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-muted-foreground mb-1">Management</p>
                      <p className="text-sm">
                        {condition.name === "Type 2 Diabetes"
                          ? "Managed through medication (Metformin), diet control, regular exercise, and blood sugar monitoring."
                          : condition.name === "Hypertension"
                            ? "Controlled with medication (Lisinopril), low sodium diet, regular physical activity, and stress management."
                            : "Strict avoidance of peanuts and peanut-containing products. Emergency epinephrine auto-injector available."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
              <CardDescription>Track your weight changes over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">Weight Loss Progress</h4>
                  <span className="text-sm font-medium">{progressPercentage}% complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  You&apos;ve lost {weightLoss} kg from your starting weight of {startWeight} kg.
                  {currentWeight > maxIdealWeight
                    ? ` ${Math.round(currentWeight - maxIdealWeight)} kg more to reach your ideal weight range.`
                    : " You've reached your ideal weight range!"}
                </p>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-4">Weight History</h4>
                <div className="h-[200px] relative">
                  <div className="absolute inset-0 flex items-end">
                    {data.weightHistory.map((entry, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-emerald-500 rounded-t-sm mx-0.5"
                          style={{
                            height: `${((entry.weight - minIdealWeight) / (startWeight - minIdealWeight)) * 150}px`,
                          }}
                        />
                        <p className="text-xs mt-1 text-muted-foreground">{entry.date.split("-")[1]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ideal weight range indicator */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-amber-500 z-10"
                    style={{
                      bottom: `${((startWeight - maxIdealWeight) / (startWeight - minIdealWeight)) * 150}px`,
                    }}
                  >
                    <span className="absolute right-0 -top-5 text-xs text-amber-600">
                      Max ideal: {maxIdealWeight} kg
                    </span>
                  </div>

                  <div
                    className="absolute left-0 right-0 h-0.5 bg-emerald-500 z-10"
                    style={{
                      bottom: `${((startWeight - minIdealWeight) / (startWeight - minIdealWeight)) * 150}px`,
                    }}
                  >
                    <span className="absolute right-0 -bottom-5 text-xs text-emerald-600">
                      Min ideal: {minIdealWeight} kg
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
              <CardDescription>Current medications and treatment plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.medications.map((medication, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{medication.name}</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Dosage</p>
                        <p className="font-medium">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">
                          {new Date(medication.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-muted-foreground mb-1">Instructions</p>
                      <p className="text-sm">
                        {medication.name === "Metformin"
                          ? "Take with meals to reduce stomach upset. Do not crush or chew tablets."
                          : "Take at the same time each day. May be taken with or without food."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
