import { createContext, useContext, useState } from "react";

// 1. Membuat brankas kosong
const AtlasContext = createContext();

// 2. Membuat komponen Provider (penjaga brankas)
export function AtlasProvider({ children }) {
  // --- DATA FASE 0 ---
  const [entryMode, setEntryMode] = useState("login");
  const [sessionDate, setSessionDate] = useState("2026-04-10");
  const [dayType, setDayType] = useState("weekday");

  // --- DATA FASE 1 ---
  const [mealSlots, setMealSlots] = useState([
    { name: "Breakfast", time: "08:00" },
    { name: "Lunch", time: "12:30" }
  ]);
  const [newMealName, setNewMealName] = useState("");

  // --- DATA FASE 2 ---
  const [foodNotes, setFoodNotes] = useState("");
  const [drinkNotes, setDrinkNotes] = useState("");

  // --- DATA FASE 3 ---
  const [matchStatus, setMatchStatus] = useState("matched");
  const [missingType, setMissingType] = useState("unknown");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeComposition, setRecipeComposition] = useState("");
  const [missingFoodName, setMissingFoodName] = useState("");
  const [missingBrand, setMissingBrand] = useState("");
  const [missingDescription, setMissingDescription] = useState("");
  const [missingPortionNotes, setMissingPortionNotes] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  // --- DATA FASE 6 ---
  const [portionMode, setPortionMode] = useState("visual");
  const [portionScale, setPortionScale] = useState("same");
  const [portionGram, setPortionGram] = useState("");

  // Mengumpulkan semua data agar bisa diakses
  const value = {
    entryMode, setEntryMode, sessionDate, setSessionDate, dayType, setDayType,
    mealSlots, setMealSlots, newMealName, setNewMealName,
    foodNotes, setFoodNotes, drinkNotes, setDrinkNotes,
    matchStatus, setMatchStatus, missingType, setMissingType,
    recipeIngredients, setRecipeIngredients, recipeComposition, setRecipeComposition,
    missingFoodName, setMissingFoodName, missingBrand, setMissingBrand,
    missingDescription, setMissingDescription, missingPortionNotes, setMissingPortionNotes,
    selectedFood, setSelectedFood,
    portionMode, setPortionMode, portionScale, setPortionScale, portionGram, setPortionGram
  };

  return (
    <AtlasContext.Provider value={value}>
      {children}
    </AtlasContext.Provider>
  );
}

// 3. Membuat hook khusus untuk membuka brankas
export function useAtlas() {
  return useContext(AtlasContext);
}