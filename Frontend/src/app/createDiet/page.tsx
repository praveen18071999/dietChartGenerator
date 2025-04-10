import DietPlanner from "./components/diet-planner"

export default function Home() {
  return (
    <main className="w-screen min-h-screen flex flex-col bg-gray-50 overflow-y-hidden">
        <DietPlanner />
    </main>
  )
}