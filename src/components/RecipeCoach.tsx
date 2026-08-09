"use client";

import { useMemo } from "react";
import { analyzeRecipes, type SuggestedAdjustments } from "@/lib/analysis";
import { drinkTypeLabel, formatRatio } from "@/lib/recipes";
import { tasteResultLabel } from "@/lib/taste";
import { useCare } from "@/lib/store";
import type { EspressoRecipe } from "@/lib/types";

type RecipeCoachProps = {
  onApplySuggestion: (
    base: EspressoRecipe,
    adjustments: SuggestedAdjustments,
  ) => void;
};

export function RecipeCoach({ onApplySuggestion }: RecipeCoachProps) {
  const { hydrated, state } = useCare();
  const analysis = useMemo(
    () => analyzeRecipes(state.recipes),
    [state.recipes],
  );

  if (!hydrated) {
    return (
      <section className="rounded-3xl border border-[var(--line)] bg-white p-5">
        <p className="text-sm text-ink-soft">Reading your recipe log…</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-steam">
            Dialling coach
          </p>
          <h2 className="display mt-1 text-3xl text-ink">What to change next</h2>
        </div>
        {analysis.focusBrand ? (
          <p className="text-sm text-steam">
            Focus · {analysis.focusBrand} · {drinkTypeLabel(analysis.focusDrink)}
          </p>
        ) : null}
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
        {analysis.summary}
      </p>

      {analysis.bestRecipe ? (
        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-paper/80 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-steam">
            Best recorded baseline
          </p>
          <p className="mt-2 text-sm font-medium text-ink">
            Grind {analysis.bestRecipe.grindSetting} ·{" "}
            {analysis.bestRecipe.doseGrams}g → {analysis.bestRecipe.yieldGrams}g (
            {formatRatio(
              analysis.bestRecipe.doseGrams,
              analysis.bestRecipe.yieldGrams,
            )}
            ) · {analysis.bestRecipe.brewTimeSeconds}s
            {analysis.bestRecipe.brewTempC != null
              ? ` · ${analysis.bestRecipe.brewTempC}°C`
              : ""}
            {analysis.bestRecipe.tasteResult
              ? ` · ${tasteResultLabel(analysis.bestRecipe.tasteResult)}`
              : ""}
            {analysis.bestRecipe.tasteScore
              ? ` · score ${analysis.bestRecipe.tasteScore}/5`
              : ""}
          </p>
        </div>
      ) : null}

      {analysis.tasteTrend.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.tasteTrend.map((item) => (
            <span
              key={item.taste}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                item.taste === "bitter" || item.taste === "harsh_astringent"
                  ? "bg-[color-mix(in_oklab,var(--danger)_10%,white)] text-danger ring-danger/20"
                  : item.taste === "balanced"
                    ? "bg-[color-mix(in_oklab,var(--ok)_12%,white)] text-ok ring-ok/20"
                    : "bg-paper text-ink-soft ring-[var(--line)]"
              }`}
            >
              {tasteResultLabel(item.taste)} · {item.count}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {analysis.suggestions.map((suggestion) => (
          <article
            key={`${suggestion.title}-${suggestion.variable}`}
            className="rounded-2xl border border-[var(--line)] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">{suggestion.title}</p>
              <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-steam">
                {suggestion.priority} · {suggestion.variable}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {suggestion.detail}
            </p>
            {suggestion.apply && analysis.latestRecipe ? (
              <button
                type="button"
                onClick={() =>
                  onApplySuggestion(analysis.latestRecipe!, suggestion.apply!)
                }
                className="mt-3 min-h-11 rounded-xl bg-ink px-4 text-sm font-medium text-paper"
              >
                Start this experiment
              </button>
            ) : null}
          </article>
        ))}
      </div>

      {analysis.latestRecipe?.tasteResult === "bitter" ||
      analysis.tasteTrend.some((item) => item.taste === "bitter") ? (
        <p className="mt-5 rounded-2xl bg-[color-mix(in_oklab,var(--warn)_12%,white)] px-4 py-3 text-sm text-ink-soft">
          Bitterness tip: change <span className="font-medium text-ink">one</span>{" "}
          thing per shot. First choice is grind coarser. Only shorten yield or
          lower temperature after that if it is still bitter.
        </p>
      ) : null}
    </section>
  );
}
