import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Salad, Activity, FileText, Lock } from 'lucide-react'

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Salad className="h-6 w-6 text-primary" />
            <span>NutriPlan</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Personalized Diet Plans Based on Your Medical Reports
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our AI-powered platform analyzes your medical data to create customized nutrition plans that optimize your health and wellness.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose NutriPlan?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers unique features designed to provide you with the most effective and personalized diet plans.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Medical Report Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Our AI analyzes your medical reports to identify nutritional needs and restrictions specific to your health condition.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Salad className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Personalized Meal Plans</h3>
                <p className="text-center text-muted-foreground">
                  Receive customized meal plans that align with your medical needs, preferences, and lifestyle goals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Monitor your health improvements and nutritional goals with our comprehensive tracking tools.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our simple process makes it easy to get started with your personalized diet plan.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Upload Medical Reports</h3>
                <p className="text-center text-muted-foreground">
                  Securely upload your medical reports through our HIPAA-compliant platform.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Our AI analyzes your reports to identify your specific nutritional needs and health goals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Receive Your Plan</h3>
                <p className="text-center text-muted-foreground">
                  Get your personalized diet plan with meal suggestions, recipes, and shopping lists.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from people who have transformed their health with NutriPlan.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col justify-between rounded-lg border p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    "After struggling with my diabetes for years, NutriPlan created a diet plan that helped me stabilize my blood sugar levels. The personalized approach made all the difference."
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="rounded-full bg-muted">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      width={40}
                      height={40}
                      alt="User"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Type 2 Diabetes Patient</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    "As someone with multiple food allergies, finding a suitable diet was always challenging. NutriPlan analyzed my medical reports and created a safe, nutritious plan that I could actually follow."
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="rounded-full bg-muted">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      width={40}
                      height={40}
                      alt="User"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Food Allergy Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Health?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who have improved their health with personalized nutrition plans.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg">Get Started Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Salad className="h-6 w-6 text-primary" />
            <span>NutriPlan</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} NutriPlan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
