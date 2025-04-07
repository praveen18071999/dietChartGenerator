import DietPlanner from "./components/diet-planner";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-8">
      <div className="w-full h-full max-h-[90vh]">
        <DietPlanner />
      </div>
    </main>
  )
}