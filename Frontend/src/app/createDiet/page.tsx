import DietPlanner from "./components/diet-planner"

export default function Home() {
  return (
    <main className="min-h-screen w-full flex p-0 md:p-4 bg-gradient-to-b from-white to-gray-50">
          <div className="flex-1 overflow-auto">
            <DietPlanner dietId={""}/>
          </div>
        </main>
  )
}