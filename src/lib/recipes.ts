import type { EspressoRecipe } from "@/lib/types";

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
