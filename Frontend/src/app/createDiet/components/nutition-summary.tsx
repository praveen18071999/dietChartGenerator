interface NutritionSummaryProps {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
  
  export function NutritionSummary({ calories, protein, carbs, fats }: NutritionSummaryProps) {
    return (
      <div className="rounded-xl border-2 bg-white p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Daily Nutrition Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-amber-100 p-6 rounded-xl shadow-md border-2 border-amber-200">
            <div className="text-base text-amber-700 font-medium">Total Calories</div>
            <div className="text-3xl font-bold text-amber-800">{calories}</div>
          </div>
          <div className="bg-emerald-100 p-6 rounded-xl shadow-md border-2 border-emerald-200">
            <div className="text-base text-emerald-700 font-medium">Protein</div>
            <div className="text-3xl font-bold text-emerald-800">{protein}g</div>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow-md border-2 border-indigo-200">
            <div className="text-base text-indigo-700 font-medium">Carbohydrates</div>
            <div className="text-3xl font-bold text-indigo-800">{carbs}g</div>
          </div>
          <div className="bg-rose-100 p-6 rounded-xl shadow-md border-2 border-rose-200">
            <div className="text-base text-rose-700 font-medium">Fats</div>
            <div className="text-3xl font-bold text-rose-800">{fats}g</div>
          </div>
        </div>
      </div>
    )
  }
  
  