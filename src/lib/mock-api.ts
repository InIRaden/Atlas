import foods from "@/data/mock-foods.json";
import nutrientResults from "@/data/mock-nutrient-results.json";
import portions from "@/data/mock-portions.json";
import recallSessions from "@/data/mock-recall-sessions.json";
import smartPrompts from "@/data/mock-smart-prompts.json";
import type {
  FoodItem,
  NutrientResult,
  PortionModeOption,
  RecallSession,
  SmartPrompt,
} from "@/types/recall";

const catalog = foods as FoodItem[];
const portionCatalog = portions as PortionModeOption[];
const promptCatalog = smartPrompts as SmartPrompt[];
const nutrientCatalog = nutrientResults as NutrientResult[];
const sessionCatalog = recallSessions as RecallSession[];

export const getFoods = async (): Promise<FoodItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return catalog;
};

export const searchFoods = async (query: string): Promise<FoodItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (!query.trim()) {
    return catalog;
  }

  return catalog.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
};

export const getFoodById = (id?: string): FoodItem | undefined => {
  return catalog.find((food) => food.id === id);
};

export const getPortions = async (): Promise<PortionModeOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return portionCatalog;
};

export const getPortionsByFoodId = async (
  foodId: string,
): Promise<PortionModeOption | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return portionCatalog.find((entry) => entry.foodId === foodId);
};

export const getSmartPrompts = async (): Promise<SmartPrompt[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return promptCatalog;
};

export const getNutrientResults = async (): Promise<NutrientResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return nutrientCatalog;
};

export const getNutrientResultBySessionId = async (
  sessionId: string,
): Promise<NutrientResult | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return nutrientCatalog.find((entry) => entry.sessionId === sessionId);
};

export const getRecallSessions = async (): Promise<RecallSession[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return sessionCatalog;
};
