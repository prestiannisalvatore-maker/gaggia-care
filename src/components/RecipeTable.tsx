"use client";

import { useMemo, useState } from "react";
import { formatDisplayDate, formatShortDate } from "@/lib/dates";
import {
  DRINK_TYPES,
  drinkTypeLabel,
  formatRatio,
  sortRecipesNewestFirst,
  tasteLabel,
  uniqueBeanBrands,
} from "@/lib/recipes";
import { tasteBodyLabel, tasteResultLabel, TASTE_RESULTS } from "@/lib/taste";
import { useCare } from "@/lib/store";
import type { DrinkType, EspressoRecipe, TasteResult } from "@/lib/types";

type RecipeTableProps = {
  onEdit: (recipe: EspressoRecipe) => void;
  onRefine: (recipe: EspressoRecipe) => void;
};

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
            Comparison table
          </p>
          <h2 className="display mt-1 text-3xl text-ink">Recipe recordings</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Compare grind, dose, yield, time, temperature, and taste side by
            side to see which changes move the cup.
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
          No recordings match these filters. Log a shot and select a taste
          result to start building the comparison table.
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3 md:hidden">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="rounded-2xl border border-[var(--line)] bg-paper/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-steam">
                      #{recipes.length - index} ·{" "}
                      {formatShortDate(recipe.shotDate)}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-ink">
                      {drinkTypeLabel(recipe.drinkType)}
                    </h3>
                    <p className="text-sm text-ink-soft">{recipe.beanBrand}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-ink">
                      {tasteResultLabel(recipe.tasteResult)}
                    </p>
                    <p className="text-steam">
                      {recipe.tasteScore ? `${recipe.tasteScore}/5` : "—"}
                    </p>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-steam">Grind</dt>
                    <dd className="font-medium text-ink">{recipe.grindSetting}</dd>
                  </div>
                  <div>
                    <dt className="text-steam">In→Out</dt>
                    <dd className="font-medium text-ink">
                      {recipe.doseGrams}→{recipe.yieldGrams}g
                    </dd>
                  </div>
                  <div>
                    <dt className="text-steam">Ratio</dt>
                    <dd className="font-medium text-ink">
                      {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-steam">Time</dt>
                    <dd className="font-medium text-ink">
                      {recipe.brewTimeSeconds}s
                    </dd>
                  </div>
                  <div>
                    <dt className="text-steam">Temp</dt>
                    <dd className="font-medium text-ink">
                      {recipe.brewTempC != null ? `${recipe.brewTempC}°C` : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-steam">Body</dt>
                    <dd className="font-medium text-ink">
                      {tasteBodyLabel(recipe.tasteBody)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onRefine(recipe)}
                    className="min-h-11 rounded-xl bg-ink text-sm font-medium text-paper"
                  >
                    Refine
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(recipe)}
                    className="min-h-11 rounded-xl border border-[var(--line)] text-sm text-ink-soft"
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.12em] text-steam">
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Drink</th>
                  <th className="px-3 py-3 font-medium">Beans</th>
                  <th className="px-3 py-3 font-medium">Grind</th>
                  <th className="px-3 py-3 font-medium">Dose</th>
                  <th className="px-3 py-3 font-medium">Yield</th>
                  <th className="px-3 py-3 font-medium">Ratio</th>
                  <th className="px-3 py-3 font-medium">Time</th>
                  <th className="px-3 py-3 font-medium">Temp</th>
                  <th className="px-3 py-3 font-medium">Taste</th>
                  <th className="px-3 py-3 font-medium">Body</th>
                  <th className="px-3 py-3 font-medium">Score</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    className={`border-b border-[var(--line)] align-top ${
                      recipe.tasteResult === "bitter" ||
                      recipe.tasteResult === "harsh_astringent"
                        ? "bg-[color-mix(in_oklab,var(--danger)_4%,white)]"
                        : recipe.tasteResult === "balanced"
                          ? "bg-[color-mix(in_oklab,var(--ok)_5%,white)]"
                          : ""
                    }`}
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-ink-soft">
                      {formatDisplayDate(recipe.shotDate)}
                      {recipe.favorite ? (
                        <div className="text-xs text-copper">Favorite</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 font-medium text-ink">
                      {drinkTypeLabel(recipe.drinkType)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-ink">{recipe.beanBrand}</div>
                      {recipe.beanName ? (
                        <div className="text-xs text-steam">{recipe.beanName}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 font-medium text-ink">
                      {recipe.grindSetting}
                    </td>
                    <td className="px-3 py-3">{recipe.doseGrams}g</td>
                    <td className="px-3 py-3">{recipe.yieldGrams}g</td>
                    <td className="px-3 py-3">
                      {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                    </td>
                    <td className="px-3 py-3">{recipe.brewTimeSeconds}s</td>
                    <td className="px-3 py-3">
                      {recipe.brewTempC != null ? `${recipe.brewTempC}°C` : "—"}
                    </td>
                    <td className="px-3 py-3 font-medium text-ink">
                      {tasteResultLabel(recipe.tasteResult)}
                    </td>
                    <td className="px-3 py-3">
                      {tasteBodyLabel(recipe.tasteBody)}
                    </td>
                    <td className="px-3 py-3">
                      {recipe.tasteScore
                        ? `${recipe.tasteScore} · ${tasteLabel(recipe.tasteScore)}`
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1.5">
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
