/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";

export type MealItem = {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType?: string;
  deliveryTime?: string;
};

export type UserProfile = {
  height: string;
  weight: string;
  age?: string;
  gender: string;
  goal: string;
  activityLevel: string;
  diseases: string[];
  otherDisease?: string;
};

export const mealColors = {
  breakfast: {
    bg: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-800",
    accent: "bg-amber-500",
  },
  lunch: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-800",
    accent: "bg-emerald-500",
  },
  dinner: {
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-800",
    accent: "bg-indigo-500",
  },
  snacks: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-800",
    accent: "bg-rose-500",
  },
};

export function useDietPlan(dietId: { dietId: string }) {
  console.log("Diet ID:", dietId);
  const profileRef = useRef<UserProfile>({
    height: "",
    weight: "",
    gender: "male",
    goal: "lean muscle",
    activityLevel: "none",
    diseases: [],
    otherDisease: "",
  });

  const [dietPlan, setDietPlan] = useState<{ [key: string]: MealItem[] }>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  // Add this after the other state variables
  const [hasDietChanged, setHasDietChanged] = useState(false);
  const [originalDietPlan, setOriginalDietPlan] = useState<any>(null);
  const [showDietPlan, setShowDietPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [dietDuration, setDietDuration] = useState(7);
  const [originalDietDuration, setOriginalDietDuration] = useState<number>(7);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [profileVersion, setProfileVersion] = useState(0);

  const [deliveryTimes, setDeliveryTimes] = useState({
    breakfast: "08:00",
    lunch: "12:30",
    dinner: "19:00",
    snacks: "16:00",
  });

  const router = useRouter();
  const updateDeliveryTime = (mealType: string, time: string) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [mealType]: time,
    }));
  };

  const addMealItem = (mealType: string) => {
    const newItem: MealItem = {
      id: Math.random().toString(36).substring(7),
      name: "",
      quantity: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: mealType,
    };
    setDietPlan({
      ...dietPlan,
      [mealType]: [...dietPlan[mealType], newItem],
    });
  };

  const removeMealItem = (mealType: string, itemId: string) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].filter((item) => item.id !== itemId),
    });
  };

  const updateMealItem = (
    mealType: string,
    itemId: string,
    field: keyof MealItem,
    value: any
  ) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const calculateTotals = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fats: acc.fats + item.fats,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const calculateDailyTotals = () => {
    const allItems = [
      ...dietPlan.breakfast,
      ...dietPlan.lunch,
      ...dietPlan.dinner,
      ...dietPlan.snacks,
    ];
    return calculateTotals(allItems);
  };

  const generateDietPlan = async (profile: UserProfile) => {
    try {
      // Initialize state for generation
      profileRef.current = profile;
      setProfileVersion((prev) => prev + 1);
      setIsGenerating(true);
      setGenerationProgress(0);
      console.log("Generating diet plan for profile:", profile);

      // Setup progress animation
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 95) {
            // Cap at 95% until API returns
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Prepare API request data
      const apiData = {
        age: parseInt(profile.age || "0", 10),
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        goal: profile.goal,
        activity_level: profile.activityLevel,
        diseases: profile.diseases,
        restrictions: "",
        otherDisease: profile.otherDisease,
      };

      // Make API call
      const response = await fetch("http://localhost:8080/generate-diet-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      //console.log("API response status:", response)
      const apiResponse = await response.json();
      //console.log("Raw API response:", apiResponse)

      // Transform API response to our app format
      const transformedDietPlan = transformApiResponse(
        JSON.parse(
          apiResponse.diet_plan
            .replace("json", "")
            .replace("```", "")
            .replace("```", "")
        )
      );

      console.log("Transformed diet plan:", transformedDietPlan);

      // Update app state with the transformed data
      setDietPlan(transformedDietPlan);
      setShowDietPlan(true);
      setIsGenerating(false);
      setGenerationProgress(100);
      clearInterval(interval);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setIsGenerating(false);
      // Optionally show an error message to the user
      // You could use a toast notification here
    }
  };

  // Helper function to transform API response to app format
  const transformApiResponse = (apiResponse: any) => {
    // Initialize empty meal categories
    const transformedPlan = {
      breakfast: [] as MealItem[],
      lunch: [] as MealItem[],
      dinner: [] as MealItem[],
      snacks: [] as MealItem[],
    };

    try {
      console.log("Transforming API response:", apiResponse);
      // Extract daily targets for reference (could be used elsewhere in the app)
      const dailyTargets = apiResponse.daily_targets;

      // Process the first day's meal plan (can be expanded to handle multiple days)
      if (apiResponse.meal_plan && apiResponse.meal_plan.length > 0) {
        const day1 = apiResponse.meal_plan[0];

        day1.meals.forEach((meal: any) => {
          const mealType = meal.meal_type.toLowerCase();

          // Map API meal types to our app meal types
          let appMealType: keyof typeof transformedPlan = "snacks"; // Default
          if (mealType.includes("breakfast")) appMealType = "breakfast";
          else if (mealType.includes("lunch")) appMealType = "lunch";
          else if (mealType.includes("dinner")) appMealType = "dinner";
          else if (mealType.includes("dessert") || mealType.includes("snack"))
            appMealType = "snacks";

          // Process foods in this meal
          let idCounter = 0;
          meal.foods.forEach((food: any, index: number) => {
            idCounter++;
            const mealItem: MealItem = {
              id: `${appMealType}-${Date.now()}-${idCounter}-${index}`, // Generate unique ID
              name: food.name,
              quantity: food.portion || "1 serving",
              calories: food.calories || 0,
              protein: food.protein || 0,
              carbs: food.carbs || 0,
              fats: food.fats || 0,
              mealType: appMealType,
              deliveryTime:
                deliveryTimes[appMealType as keyof typeof deliveryTimes],
            };

            // Add to the appropriate meal category
            if (transformedPlan[appMealType as keyof typeof transformedPlan]) {
              transformedPlan[appMealType].push(mealItem);
            }
          });
        });
      }
      console.log("Transformed diet plan:", transformedPlan);
      return transformedPlan;
    } catch (error) {
      console.error("Error transforming API response:", error);
      // Return default structure if transformation fails
      return transformedPlan;
    }
  };

  const createUserSpecification = async (id: string) => {
    const apiData = profileRef.current;

    const response = await fetch(
      `http://localhost:3001/userspec/createUserSpecification/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmEzOTA3NC0wMWIzLTQ0MzctOTVjZi01MWRkNzE1NWNkOTEiLCJlbWFpbCI6ImExQGdtYWlsLmNvbSIsImlhdCI6MTc0NDIxODQxNSwiZXhwIjoxNzQ0MzA0ODE1fQ.LoqJWMlw1mnw4kITT9BhlaPQ4e7wRFGh0PD9QjF5AsY`,
        },
        body: JSON.stringify(apiData),
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log("Diet plan saved successfully:", data);
    //createUserSpecification();
  };
  const createdDiet = async(id:string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/diet/getDietChartById/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmEzOTA3NC0wMWIzLTQ0MzctOTVjZi01MWRkNzE1NWNkOTEiLCJlbWFpbCI6ImExQGdtYWlsLmNvbSIsImlhdCI6MTc0NDIxODQxNSwiZXhwIjoxNzQ0MzA0ODE1fQ.LoqJWMlw1mnw4kITT9BhlaPQ4e7wRFGh0PD9QjF5AsY`,
          }
        }
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded diet data:", data);
      
      // Properly map the user specifications to the profile format
      if (data.data[0]["User Specifications"] && data.data[0]["User Specifications"].length > 0) {
        const userSpec = data.data[0]["User Specifications"][0];
        
        if (userSpec) {
          const profile: UserProfile = {
            height: userSpec.height || "",
            weight: userSpec.weight || "",
            age: userSpec.age?.toString() || "",
            gender: userSpec.gender || "male",
            goal: userSpec.goal || "lean muscle",
            activityLevel: userSpec.activityLevel || "none",
            diseases: userSpec.diseases || [],
            otherDisease: userSpec.otherDisease || "",
          };
          
          profileRef.current = profile;
          setOriginalProfile(JSON.parse(JSON.stringify(profile))); // Store deep copy
        }
      }
      
      // Set the diet plan data
      if (data.data[0].diet) {
        const parsedDiet = JSON.parse(data.data[0].diet);
        setDietPlan(parsedDiet);
        // Store original plan for change detection
        setOriginalDietPlan(JSON.parse(JSON.stringify(parsedDiet)));
        setHasDietChanged(false);
      }
      
      setShowDietPlan(true);
      setIsGenerating(false);
      setGenerationProgress(100);
      setDietDuration(data.data[0].days || 7);
      setOriginalDietDuration(data.data[0].days || 7);
    } catch (error) {
      console.error("Error loading diet plan:", error);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (dietId.dietId)
    {
      console.log("Diet ID from useEffect:", dietId);
      createdDiet(dietId.dietId);
    }
  }, [dietId]);
  const saveDietPlan = async (days: number) => {
    try {
      const apiData = {
        diet: dietPlan,
        days: days,
      };
      const response = await fetch(
        "http://localhost:3001/diet/createDietPlan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmEzOTA3NC0wMWIzLTQ0MzctOTVjZi01MWRkNzE1NWNkOTEiLCJlbWFpbCI6ImExQGdtYWlsLmNvbSIsImlhdCI6MTc0NDIxODQxNSwiZXhwIjoxNzQ0MzA0ODE1fQ.LoqJWMlw1mnw4kITT9BhlaPQ4e7wRFGh0PD9QjF5AsY`,
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      await createUserSpecification(data.data[0].id);
      router.push(`/createDiet/${data.data[0].id}`);
      //createdDiet(data.data[0].id);
    } catch (error) {
      console.error("Error saving diet plan:", error);
    }
  };

  const updateDietPlan = async () => {
    
    try {
      console.log("Updating diet plan with ID:", dietId.dietId);
      const apiData = {
        diet: JSON.stringify(dietPlan),
        days: dietDuration,
        profile: profileRef.current,
      };
      console.log("API Data:", apiData);
      const response = await fetch(
        `http://localhost:3001/diet/updateDietChartById/${dietId.dietId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmEzOTA3NC0wMWIzLTQ0MzctOTVjZi01MWRkNzE1NWNkOTEiLCJlbWFpbCI6ImExQGdtYWlsLmNvbSIsImlhdCI6MTc0NDIxODQxNSwiZXhwIjoxNzQ0MzA0ODE1fQ.LoqJWMlw1mnw4kITT9BhlaPQ4e7wRFGh0PD9QjF5AsY`,
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log("Diet plan updated successfully:", data);

      setOriginalDietPlan(JSON.parse(JSON.stringify(dietPlan)));
      setOriginalDietDuration(dietDuration);
      setHasDietChanged(false);
    } catch (error) {
      console.error("Error updating diet plan:", error);
    }
  };

  // Add this right after getting the hook values
  const trackChanges = useCallback(() => {
    if (originalDietPlan && dietPlan) {
      const planChanged = JSON.stringify(originalDietPlan) !== JSON.stringify(dietPlan);
      const durationChanged = originalDietDuration !== dietDuration;
      
      // Properly check for profile changes
      let profileChanged = false;
      if (originalProfile && profileRef.current) {
        profileChanged = JSON.stringify(originalProfile) !== JSON.stringify(profileRef.current);
      }
      
      console.log("Change detection:", { planChanged, durationChanged, profileChanged });
      
      // Update hasDietChanged based on any change
      setHasDietChanged(planChanged || durationChanged || profileChanged);
    }
  }, [dietPlan, originalDietPlan, dietDuration, originalDietDuration, originalProfile, profileRef, profileVersion]);
  

  // Add useEffect to store the original plan when it's first loaded
  useEffect(() => {
    if (dietPlan && !originalDietPlan) {
      setOriginalDietPlan(JSON.parse(JSON.stringify(dietPlan)));
    }
  }, [dietPlan, originalDietPlan]);

  // Add useEffect to track changes whenever dietPlan or dietDuration changes
  useEffect(() => {
    trackChanges();
  }, [dietPlan, dietDuration, trackChanges, profileVersion]);

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    if (profileRef.current) {
      profileRef.current = {
        ...profileRef.current,
        [field]: value
      };
      setProfileVersion(prev => prev + 1); // Trigger change detection
    }
  };

  return {
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
    hasDietChanged, // Add this line
    setHasDietChanged, // Add this line
    originalDietPlan, // Add this line
    setOriginalDietPlan, // Add this line
    updateProfileField,
    profileVersion,
  };
}
