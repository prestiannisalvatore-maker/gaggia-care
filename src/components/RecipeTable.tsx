"use client";

import { useMemo, useState } from "react";
import {
  DRINK_TYPES,
  formatRatio,
  sortRecipesNewestFirst,
  uniqueBeanBrands,
} from "@/lib/recipes";
import { tasteResultLabel, TASTE_RESULTS } from "@/lib/taste";
import { useCare } from "@/lib/store";
import type { DrinkType, EspressoRecipe, TasteResult } from "@/lib/types";

type RecipeTableProps = {
  onEdit: (recipe: EspressoRecipe) => void;
  onRefine: (recipe: EspressoRecipe) => void;
};

function tasteTone(result: TasteResult | null) {
  if (result === "balanced") {
    return "bg-[color-mix(in_oklab,var(--ok)_7%,white)]";
  }
  if (result === "bitter" || result === "harsh_astringent") {
    return "bg-[color-mix(in_oklab,var(--danger)_6%,white)]";
  }
  if (result === "sour" || result === "weak_watery" || result === "hollow") {
    return "bg-[color-mix(in_oklab,var(--warn)_6%,white)]";
  }
  return "";
}

export function RecipeTable({ onEdit, onRefine }: RecipeTableProps) {
  const { hydrated, state, deleteRecipe, toggleFavoriteRecipe } = useCare();
  const [brandFilter, setBrandFilter] = useState("all");
  const [drinkFilter, setDrinkFilter] = useState<"all" | DrinkType>("all");
  const [tasteFilter, setTasteFilter] = useState<"all" | TasteResult>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const brands = useMemo(
    () => uniqueBeanBrands(state.recipes),
    [state.recipes],
  );

  const shotNumberById = useMemo(() => {
    const chronological = [...state.recipes].sort((a, b) => {
      const byDate = a.shotDate.localeCompare(b.shotDate);
      if (byDate !== 0) return byDate;
      return a.createdAt.localeCompare(b.createdAt);
    });
    return new Map(chronological.map((recipe, index) => [recipe.id, index + 1]));
  }, [state.recipes]);

  const recipes = useMemo(() => {
    return sortRecipesNewestFirst(state.recipes).filter((recipe) => {
      if (brandFilter !== "all" && recipe.beanBrand !== brandFilter) return false;
      if (drinkFilter !== "all" && recipe.drinkType !== drinkFilter) return false;
      if (tasteFilter !== "all" && recipe.tasteResult !== tasteFilter) {
        return false;
      }
      if (favoritesOnly && !recipe.favorite) return false;
      return true;
    });
  }, [state.recipes, brandFilter, drinkFilter, tasteFilter, favoritesOnly]);

  if (!hydrated) {
    return (
      <p className="text-sm text-ink-soft">Loading your recipe recordings…</p>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-steam">
            Shot log
          </p>
          <h2 className="display mt-1 text-3xl text-ink">Recipe table</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Each row is one shot — compare grind, dose in/out, ratio, time, and
            taste at a glance.
          </p>
        </div>
        <p className="text-sm text-steam">
          {recipes.length} shown · {state.recipes.length} total
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={drinkFilter}
          onChange={(event) =>
            setDrinkFilter(event.target.value as "all" | DrinkType)
          }
          className="min-h-11 rounded-xl border border-[var(--line)] bg-paper px-3"
        >
          <option value="all">All drinks</option>
          {DRINK_TYPES.map((drink) => (
            <option key={drink.id} value={drink.id}>
              {drink.label}
            </option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={(event) => setBrandFilter(event.target.value)}
          className="min-h-11 rounded-xl border border-[var(--line)] bg-paper px-3"
        >
          <option value="all">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <select
          value={tasteFilter}
          onChange={(event) =>
            setTasteFilter(event.target.value as "all" | TasteResult)
          }
          className="min-h-11 rounded-xl border border-[var(--line)] bg-paper px-3"
        >
          <option value="all">All tastes</option>
          {TASTE_RESULTS.map((taste) => (
            <option key={taste.id} value={taste.id}>
              {taste.label}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-paper px-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
            className="accent-[var(--ink)]"
          />
          Favorites only
        </label>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--line)] px-4 py-8 text-sm text-ink-soft">
          No recordings yet. Tap Log a shot, pull a cup, and pick a taste result
          to fill this table.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--line)]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_80%,white)]">
                <th className="sticky left-0 z-10 bg-[color-mix(in_oklab,var(--paper)_80%,white)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  #
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  Grind
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  In → Out
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  Ratio
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  Time
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  Taste
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-steam">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => {
                const shotNumber = shotNumberById.get(recipe.id) ?? "—";
                return (
                  <tr
                    key={recipe.id}
                    className={`border-b border-[var(--line)] last:border-b-0 ${tasteTone(recipe.tasteResult)}`}
                  >
                    <td className="sticky left-0 z-10 bg-white px-3 py-3.5 font-semibold text-ink">
                      {shotNumber}
                      {recipe.favorite ? (
                        <span className="ml-1 text-copper" title="Favorite">
                          ★
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-ink">
                      {recipe.grindSetting || "—"}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-ink">
                      {recipe.doseGrams}g → {recipe.yieldGrams}g
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-ink">
                      {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-ink">
                      {recipe.brewTimeSeconds}s
                    </td>
                    <td className="px-3 py-3.5 font-medium text-ink">
                      {tasteResultLabel(recipe.tasteResult)}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRefine(recipe)}
                          className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-paper"
                        >
                          Refine
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(recipe)}
                          className="rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs text-ink-soft"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteRecipe(recipe.id)}
                          className="rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs text-ink-soft"
                        >
                          {recipe.favorite ? "Unfavorite" : "Favorite"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Delete this recipe recording? This cannot be undone.",
                              )
                            ) {
                              deleteRecipe(recipe.id);
                            }
                          }}
                          className="rounded-lg border border-danger/25 px-2.5 py-1.5 text-xs text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
