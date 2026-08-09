import type { DrinkType, EspressoRecipe } from "@/lib/types";

export const DRINK_TYPES: Array<{ id: DrinkType; label: string }> = [
  { id: "espresso", label: "Espresso" },
  { id: "ristretto", label: "Ristretto" },
  { id: "lungo", label: "Lungo" },
  { id: "doppio", label: "Doppio" },
  { id: "americano", label: "Americano" },
  { id: "cappuccino", label: "Cappuccino" },
  { id: "latte", label: "Caffè latte" },
  { id: "flat_white", label: "Flat white" },
  { id: "macchiato", label: "Macchiato" },
  { id: "cortado", label: "Cortado" },
  { id: "mocha", label: "Mocha" },
  { id: "other", label: "Other" },
];

const DRINK_LABELS = Object.fromEntries(
  DRINK_TYPES.map((drink) => [drink.id, drink.label]),
) as Record<DrinkType, string>;

export function isDrinkType(value: unknown): value is DrinkType {
  return typeof value === "string" && value in DRINK_LABELS;
}

export function drinkTypeLabel(type: DrinkType | null | undefined): string {
  if (!type) return "Espresso";
  return DRINK_LABELS[type] ?? "Espresso";
}

export function brewRatio(doseGrams: number, yieldGrams: number): number | null {
  if (!doseGrams || doseGrams <= 0 || !yieldGrams || yieldGrams <= 0) return null;
  return yieldGrams / doseGrams;
}

export function formatRatio(doseGrams: number, yieldGrams: number): string {
  const ratio = brewRatio(doseGrams, yieldGrams);
  if (ratio === null) return "—";
  return `1:${ratio.toFixed(2)}`;
}

export function createRecipeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sortRecipesNewestFirst(recipes: EspressoRecipe[]): EspressoRecipe[] {
  return [...recipes].sort((a, b) => {
    const byDate = b.shotDate.localeCompare(a.shotDate);
    if (byDate !== 0) return byDate;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function uniqueBeanBrands(recipes: EspressoRecipe[]): string[] {
  return [...new Set(recipes.map((recipe) => recipe.beanBrand.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

export function tasteLabel(score: number | null): string {
  if (!score) return "—";
  const labels: Record<number, string> = {
    1: "Poor",
    2: "OK",
    3: "Good",
    4: "Great",
    5: "Superb",
  };
  return labels[score] ?? String(score);
}
