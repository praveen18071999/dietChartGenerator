import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function CtaSection() {
  return (
    <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary">
          {/* Background pattern */}
          <div className="absolute inset-0 w-full h-full opacity-10">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center p-8 md:p-12 lg:p-16">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground">
                Start Your Health Transformation Today
              </h2>
              <p className="max-w-[700px] text-primary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who have improved their health with personalized AI nutrition plans
              </p>
            </div>
            <Button size="lg" variant="secondary" className="mt-4 rounded-full text-primary hover:text-primary">
              Create Your Account <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

