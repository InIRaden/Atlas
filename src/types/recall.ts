export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type MatchStatus = "Matched" | "Similar" | "Custom";

export type SessionStatus = "draft" | "submitted";

export type PortionMode = "grams" | "visual" | "household" | "unit";

export interface PortionSelection {
  mode: PortionMode;
  grams?: number;
  visualSize?: "S" | "M" | "L";
  household?: {
    tool: "Gelas" | "Mangkok" | "Sendok";
    amount: number;
  };
  unit?: {
    name: "Slice" | "Piece" | "Pack";
    amount: number;
  };
}

export interface NutrientBreakdown {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface RecallItem {
  id: string;
  mealType: MealType;
  occasionKey?: string;
  quickText: string;
  matchedFoodId?: string;
  matchStatus: MatchStatus;
  portion?: PortionSelection;
  nutrients?: NutrientBreakdown;
}

export interface RecallSession {
  id: string;
  date: string;
  context: "weekday" | "weekend";
  status: SessionStatus;
  pass: 1 | 2 | 3 | 4 | 5 | 6;
  items: RecallItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  availability: "Available" | "Not Available";
  defaultNutrients: NutrientBreakdown;
}

export interface PortionModeOption {
  foodId: string;
  modes: {
    grams: { default: number; min: number; max: number; step: number };
    visual: {
      sizes: Array<{ label: "S" | "M" | "L"; grams: number; image: string }>;
    };
    household: Array<{ tool: "Gelas" | "Mangkok" | "Sendok"; amount: number; grams: number }>;
    unit: Array<{ name: "Slice" | "Piece" | "Pack"; amount: number; grams: number }>;
  };
}

export interface SmartPrompt {
  id: string;
  mealType: MealType;
  question: string;
  trigger: {
    requiresMealItem: boolean;
    missingKeywords: string[];
  };
  suggestions: string[];
}

export interface NutrientResult {
  sessionId: string;
  totals: NutrientBreakdown;
  byMeal: Array<{
    mealType: MealType;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }>;
}
