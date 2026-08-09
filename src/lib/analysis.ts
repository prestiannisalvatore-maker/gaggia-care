import { brewRatio, drinkTypeLabel, formatRatio } from "@/lib/recipes";
import { tasteResultLabel } from "@/lib/taste";
import type { DrinkType, EspressoRecipe, TasteResult } from "@/lib/types";

export type SuggestedAdjustments = {
  grindSetting?: string;
  doseGrams?: number;
  yieldGrams?: number;
  brewTimeSeconds?: number;
  brewTempC?: number | null;
  reason: string;
};

export type DialSuggestion = {
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  variable: "grind" | "yield" | "time" | "temp" | "dose" | "prep";
  apply?: SuggestedAdjustments;
};

export type RecipeAnalysis = {
  summary: string;
  bestRecipe: EspressoRecipe | null;
  latestRecipe: EspressoRecipe | null;
  focusDrink: DrinkType;
  focusBrand: string | null;
  tasteTrend: Array<{ taste: TasteResult; count: number }>;
  suggestions: DialSuggestion[];
  nextExperiment: SuggestedAdjustments | null;
};

function parseGrind(value: string): number | null {
  const match = value.trim().match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  return Number(match[0]);
}

function formatGrindSuggestion(current: string, delta: number): string | undefined {
  const numeric = parseGrind(current);
  if (numeric === null) return undefined;
  const next = Math.round((numeric + delta) * 10) / 10;
  // Preserve non-numeric prefix/suffix if present
  if (current.trim() === String(numeric)) return String(next);
  return current.replace(String(numeric), String(next));
}

function scoreWeight(recipe: EspressoRecipe): number {
  return recipe.tasteScore ?? 0;
}

function isProblemTaste(taste: TasteResult | null): boolean {
  return (
    taste === "bitter" ||
    taste === "sour" ||
    taste === "weak_watery" ||
    taste === "harsh_astringent" ||
    taste === "hollow"
  );
}

function suggestionsForTaste(
  recipe: EspressoRecipe,
  taste: TasteResult,
): DialSuggestion[] {
  const ratio = brewRatio(recipe.doseGrams, recipe.yieldGrams);
  const suggestions: DialSuggestion[] = [];

  if (taste === "bitter" || taste === "harsh_astringent") {
    const coarser = formatGrindSuggestion(recipe.grindSetting, 0.5);
    suggestions.push({
      priority: "high",
      title: "Grind coarser",
      detail:
        "Bitterness usually means over-extraction. Open the HiBREW 5G one small step coarser and keep dose the same.",
      variable: "grind",
      apply: {
        grindSetting: coarser ?? recipe.grindSetting,
        doseGrams: recipe.doseGrams,
        yieldGrams: recipe.yieldGrams,
        brewTimeSeconds: recipe.brewTimeSeconds,
        brewTempC: recipe.brewTempC,
        reason: "Coarser grind to reduce bitterness",
      },
    });

    if (ratio != null && ratio > 2.1) {
      const tighterYield = Math.round(recipe.doseGrams * 2 * 10) / 10;
      suggestions.push({
        priority: "high",
        title: "Shorten the ratio",
        detail: `Your last shot was ${formatRatio(recipe.doseGrams, recipe.yieldGrams)}. Pull closer to 1:2 (about ${tighterYield}g out) so fewer bitter compounds come through.`,
        variable: "yield",
        apply: {
          grindSetting: recipe.grindSetting,
          doseGrams: recipe.doseGrams,
          yieldGrams: tighterYield,
          brewTimeSeconds: Math.min(recipe.brewTimeSeconds, 30),
          brewTempC: recipe.brewTempC,
          reason: "Tighter 1:2 ratio against bitterness",
        },
      });
    }

    if (recipe.brewTimeSeconds >= 32) {
      suggestions.push({
        priority: "medium",
        title: "Stop the shot sooner",
        detail: `Brew time was ${recipe.brewTimeSeconds}s. Aim nearer 25–30s for espresso while you tune grind.`,
        variable: "time",
        apply: {
          grindSetting: recipe.grindSetting,
          doseGrams: recipe.doseGrams,
          yieldGrams: recipe.yieldGrams,
          brewTimeSeconds: 28,
          brewTempC: recipe.brewTempC,
          reason: "Shorter shot window to cut bitterness",
        },
      });
    }

    if (recipe.brewTempC != null && recipe.brewTempC >= 94) {
      suggestions.push({
        priority: "medium",
        title: "Lower brew temperature",
        detail: `PID brew temp was ${recipe.brewTempC}°C. Try about ${(recipe.brewTempC - 1).toFixed(1)}°C — heat amplifies bitterness.`,
        variable: "temp",
        apply: {
          grindSetting: recipe.grindSetting,
          doseGrams: recipe.doseGrams,
          yieldGrams: recipe.yieldGrams,
          brewTimeSeconds: recipe.brewTimeSeconds,
          brewTempC: Math.round((recipe.brewTempC - 1) * 10) / 10,
          reason: "Slightly cooler brew water",
        },
      });
    } else if (recipe.brewTempC == null) {
      suggestions.push({
        priority: "low",
        title: "Heat management without PID yet",
        detail:
          "If bitterness persists after a coarser grind, flush a little water before the shot or shorten the heating pause so the group is less aggressively hot.",
        variable: "temp",
      });
    }

    suggestions.push({
      priority: "low",
      title: "Check puck prep",
      detail:
        "Harsh bitterness with blonding or spurting can be channeling. Use WDT and an even tamp before changing more variables.",
      variable: "prep",
    });
  }

  if (taste === "sour") {
    const finer = formatGrindSuggestion(recipe.grindSetting, -0.5);
    suggestions.push({
      priority: "high",
      title: "Grind finer",
      detail:
        "Sourness usually means under-extraction. Close the grind one small step and keep dose steady.",
      variable: "grind",
      apply: {
        grindSetting: finer ?? recipe.grindSetting,
        doseGrams: recipe.doseGrams,
        yieldGrams: recipe.yieldGrams,
        brewTimeSeconds: recipe.brewTimeSeconds,
        brewTempC: recipe.brewTempC,
        reason: "Finer grind to reduce sourness",
      },
    });
    if (ratio != null && ratio < 1.8) {
      suggestions.push({
        priority: "medium",
        title: "Pull a little longer",
        detail: `Ratio was ${formatRatio(recipe.doseGrams, recipe.yieldGrams)}. Move toward 1:2 to develop sweetness.`,
        variable: "yield",
        apply: {
          grindSetting: recipe.grindSetting,
          doseGrams: recipe.doseGrams,
          yieldGrams: Math.round(recipe.doseGrams * 2 * 10) / 10,
          brewTimeSeconds: recipe.brewTimeSeconds,
          brewTempC: recipe.brewTempC,
          reason: "Longer ratio for sweetness",
        },
      });
    }
  }

  if (taste === "weak_watery") {
    suggestions.push({
      priority: "high",
      title: "Grind finer and watch for channeling",
      detail:
        "Watery cups often need a finer grind, or better distribution so water cannot race through the puck.",
      variable: "grind",
      apply: {
        grindSetting:
          formatGrindSuggestion(recipe.grindSetting, -0.5) ?? recipe.grindSetting,
        doseGrams: recipe.doseGrams,
        yieldGrams: Math.min(recipe.yieldGrams, Math.round(recipe.doseGrams * 2 * 10) / 10),
        brewTimeSeconds: recipe.brewTimeSeconds,
        brewTempC: recipe.brewTempC,
        reason: "Finer grind / tighter yield for body",
      },
    });
  }

  if (taste === "hollow") {
    suggestions.push({
      priority: "high",
      title: "Aim for a classic 1:2 espresso",
      detail:
        "Hollow cups often sit between under- and over-extraction. Set yield to about twice the dose, then nudge grind for sweetness.",
      variable: "yield",
      apply: {
        grindSetting: recipe.grindSetting,
        doseGrams: recipe.doseGrams,
        yieldGrams: Math.round(recipe.doseGrams * 2 * 10) / 10,
        brewTimeSeconds: 28,
        brewTempC: recipe.brewTempC,
        reason: "Reset around 1:2 and 28s",
      },
    });
  }

  return suggestions;
}

export function analyzeRecipes(recipes: EspressoRecipe[]): RecipeAnalysis {
  const espressoLike = recipes.filter((recipe) =>
    ["espresso", "ristretto", "lungo", "doppio"].includes(recipe.drinkType),
  );
  const pool = espressoLike.length > 0 ? espressoLike : recipes;

  if (pool.length === 0) {
    return {
      summary:
        "Log a few shots with a taste result selected. The coach will compare variables and tell you what to change next.",
      bestRecipe: null,
      latestRecipe: null,
      focusDrink: "espresso",
      focusBrand: null,
      tasteTrend: [],
      suggestions: [
        {
          priority: "high",
          title: "Start a baseline espresso",
          detail:
            "Use ~18g in / ~36g out in about 25–30 seconds, then pick a taste result so the app can coach the next change.",
          variable: "dose",
        },
      ],
      nextExperiment: {
        grindSetting: "",
        doseGrams: 18,
        yieldGrams: 36,
        brewTimeSeconds: 28,
        brewTempC: null,
        reason: "Classic starting baseline",
      },
    };
  }

  const latestRecipe = [...pool].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];

  const focusBrand = latestRecipe.beanBrand;
  const focusDrink = latestRecipe.drinkType;
  const scoped = pool.filter(
    (recipe) =>
      recipe.beanBrand === focusBrand && recipe.drinkType === focusDrink,
  );
  const series = scoped.length >= 2 ? scoped : pool;

  const bestRecipe = [...series].sort((a, b) => {
    const scoreDiff = scoreWeight(b) - scoreWeight(a);
    if (scoreDiff !== 0) return scoreDiff;
    const aBalanced = a.tasteResult === "balanced" ? 1 : 0;
    const bBalanced = b.tasteResult === "balanced" ? 1 : 0;
    return bBalanced - aBalanced || b.createdAt.localeCompare(a.createdAt);
  })[0];

  const tasteCounts = new Map<TasteResult, number>();
  for (const recipe of series) {
    if (!recipe.tasteResult) continue;
    tasteCounts.set(
      recipe.tasteResult,
      (tasteCounts.get(recipe.tasteResult) ?? 0) + 1,
    );
  }
  const tasteTrend = [...tasteCounts.entries()]
    .map(([taste, count]) => ({ taste, count }))
    .sort((a, b) => b.count - a.count);

  const dominantTaste = latestRecipe.tasteResult ?? tasteTrend[0]?.taste ?? null;
  const suggestions =
    dominantTaste && isProblemTaste(dominantTaste)
      ? suggestionsForTaste(latestRecipe, dominantTaste)
      : dominantTaste === "balanced"
        ? [
            {
              priority: "medium" as const,
              title: "Lock in the winner",
              detail: `Your best recent ${drinkTypeLabel(focusDrink)} is grind ${bestRecipe.grindSetting}, ${bestRecipe.doseGrams}g → ${bestRecipe.yieldGrams}g in ${bestRecipe.brewTimeSeconds}s${bestRecipe.brewTempC != null ? ` at ${bestRecipe.brewTempC}°C` : ""}. Change only one variable if you keep experimenting.`,
              variable: "grind" as const,
              apply: {
                grindSetting: bestRecipe.grindSetting,
                doseGrams: bestRecipe.doseGrams,
                yieldGrams: bestRecipe.yieldGrams,
                brewTimeSeconds: bestRecipe.brewTimeSeconds,
                brewTempC: bestRecipe.brewTempC,
                reason: "Repeat best known recipe",
              },
            },
          ]
        : [
            {
              priority: "high" as const,
              title: "Select a taste result",
              detail:
                "Choose bitter, sour, weak, or balanced on each shot. Without that dropdown, the coach cannot recommend the next change.",
              variable: "prep" as const,
            },
          ];

  const bitterCount = tasteTrend.find((item) => item.taste === "bitter")?.count ?? 0;
  const summary =
    dominantTaste === "bitter" || bitterCount > 0
      ? `Recent ${drinkTypeLabel(focusDrink)} shots for ${focusBrand} skew bitter. Start with a coarser grind, then tighten toward 1:2 if needed — one change at a time.`
      : dominantTaste
        ? `Latest taste: ${tasteResultLabel(dominantTaste)}. Focus on ${focusBrand} · ${drinkTypeLabel(focusDrink)} across ${series.length} recording${series.length === 1 ? "" : "s"}.`
        : `You have ${series.length} recordings. Add taste results so suggestions can get specific.`;

  const nextExperiment =
    suggestions.find((item) => item.apply)?.apply ??
    (bestRecipe
      ? {
          grindSetting: bestRecipe.grindSetting,
          doseGrams: bestRecipe.doseGrams,
          yieldGrams: bestRecipe.yieldGrams,
          brewTimeSeconds: bestRecipe.brewTimeSeconds,
          brewTempC: bestRecipe.brewTempC,
          reason: "Best recorded baseline",
        }
      : null);

  return {
    summary,
    bestRecipe,
    latestRecipe,
    focusDrink,
    focusBrand,
    tasteTrend,
    suggestions: suggestions.slice(0, 4),
    nextExperiment,
  };
}
