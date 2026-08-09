"use client";

import { useMemo, useState } from "react";
import {
  DRINK_TYPES,
  formatRatio,
  sortRecipesNewestFirst,
  uniqueBeanBrands,
} from "@/lib/recipes";
import {
  shortTasteLabel,
  tasteResultLabel,
  TASTE_RESULTS,
} from "@/lib/taste";
import { useCare } from "@/lib/store";
import type { DrinkType, EspressoRecipe, TasteResult } from "@/lib/types";

type RecipeTableProps = {
  onEdit: (recipe: EspressoRecipe) => void;
  onRefine: (recipe: EspressoRecipe) => void;
};

function tasteTone(result: TasteResult | null) {
  if (result === "balanced") {
    return "bg-[color-mix(in_oklab,var(--ok)_6%,white)]";
  }
  if (result === "bitter" || result === "harsh_astringent") {
    return "bg-[color-mix(in_oklab,var(--danger)_5%,white)]";
  }
  if (result === "sour" || result === "weak_watery" || result === "hollow") {
    return "bg-[color-mix(in_oklab,var(--warn)_5%,white)]";
  }
  return "bg-white";
}

function RowActions({
  recipe,
  onEdit,
  onRefine,
  onFavorite,
  onDelete,
  compact,
}: {
  recipe: EspressoRecipe;
  onEdit: () => void;
  onRefine: () => void;
  onFavorite: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
      <button
        type="button"
        onClick={onRefine}
        className="rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-paper"
      >
        Refine
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-md border border-[var(--line)] px-2 py-1 text-[11px] text-ink-soft"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onFavorite}
        className="rounded-md border border-[var(--line)] px-2 py-1 text-[11px] text-ink-soft"
      >
        {recipe.favorite ? "Unfav" : "Fav"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md border border-danger/25 px-2 py-1 text-[11px] text-danger"
      >
        Delete
      </button>
    </div>
  );
}

export function RecipeTable({ onEdit, onRefine }: RecipeTableProps) {
  const { hydrated, state, deleteRecipe, toggleFavoriteRecipe } = useCare();
  const [brandFilter, setBrandFilter] = useState("all");
  const [drinkFilter, setDrinkFilter] = useState<"all" | DrinkType>("all");
  const [tasteFilter, setTasteFilter] = useState<"all" | TasteResult>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  function confirmDelete(id: string) {
    if (
      window.confirm("Delete this recipe recording? This cannot be undone.")
    ) {
      deleteRecipe(id);
      setExpandedId(null);
    }
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-ink-soft">Loading your recipe recordings…</p>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-steam">
            Shot log
          </p>
          <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
            Recipe table
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Dense log of every shot. On phone, tap a row for refine / edit.
          </p>
        </div>
        <p className="text-sm text-steam">
          {recipes.length} shown · {state.recipes.length} total
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <select
          value={drinkFilter}
          onChange={(event) =>
            setDrinkFilter(event.target.value as "all" | DrinkType)
          }
          className="min-h-10 rounded-xl border border-[var(--line)] bg-paper px-2.5 text-sm"
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
          className="min-h-10 rounded-xl border border-[var(--line)] bg-paper px-2.5 text-sm"
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
          className="min-h-10 rounded-xl border border-[var(--line)] bg-paper px-2.5 text-sm"
        >
          <option value="all">All tastes</option>
          {TASTE_RESULTS.map((taste) => (
            <option key={taste.id} value={taste.id}>
              {taste.label}
            </option>
          ))}
        </select>
        <label className="flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-paper px-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
            className="accent-[var(--ink)]"
          />
          Favorites
        </label>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--line)] px-4 py-6 text-sm text-ink-soft">
          No recordings yet. Tap Log a shot to start the table.
        </div>
      ) : (
        <>
          {/* Mobile: dense tappable rows — no sideways scroll */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] md:hidden">
            <div className="grid grid-cols-[2rem_1fr_auto] gap-x-2 border-b border-[var(--line)] bg-paper px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-steam">
              <span>#</span>
              <span>Grind · In→Out · Ratio · Time</span>
              <span>Taste</span>
            </div>
            <ul>
              {recipes.map((recipe) => {
                const shotNumber = shotNumberById.get(recipe.id) ?? "—";
                const open = expandedId === recipe.id;
                return (
                  <li
                    key={recipe.id}
                    className={`border-b border-[var(--line)] last:border-b-0 ${tasteTone(recipe.tasteResult)}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(open ? null : recipe.id)
                      }
                      className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-2 px-2.5 py-2 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm font-semibold text-ink">
                        {shotNumber}
                        {recipe.favorite ? (
                          <span className="text-copper">★</span>
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium leading-tight text-ink">
                          {recipe.grindSetting || "—"}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-tight text-ink-soft">
                          {recipe.doseGrams}→{recipe.yieldGrams}g ·{" "}
                          {formatRatio(recipe.doseGrams, recipe.yieldGrams)} ·{" "}
                          {recipe.brewTimeSeconds}s
                        </span>
                      </span>
                      <span className="text-right text-[12px] font-medium text-ink">
                        {shortTasteLabel(recipe.tasteResult)}
                        <span className="ml-1 text-steam">{open ? "▴" : "▾"}</span>
                      </span>
                    </button>
                    {open ? (
                      <div className="border-t border-[var(--line)]/70 px-2.5 py-2">
                        <RowActions
                          recipe={recipe}
                          compact
                          onRefine={() => onRefine(recipe)}
                          onEdit={() => onEdit(recipe)}
                          onFavorite={() => toggleFavoriteRecipe(recipe.id)}
                          onDelete={() => confirmDelete(recipe.id)}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop / tablet: compact real table */}
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-[var(--line)] md:block">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--line)] bg-paper">
                  {(
                    ["#", "Grind", "In → Out", "Ratio", "Time", "Taste", ""] as const
                  ).map((label) => (
                    <th
                      key={label || "actions"}
                      className="px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-steam"
                    >
                      {label}
                    </th>
                  ))}
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
                      <td className="px-2.5 py-1.5 font-semibold text-ink">
                        {shotNumber}
                        {recipe.favorite ? (
                          <span className="ml-0.5 text-copper">★</span>
                        ) : null}
                      </td>
                      <td className="px-2.5 py-1.5 font-medium text-ink">
                        {recipe.grindSetting || "—"}
                      </td>
                      <td className="px-2.5 py-1.5 whitespace-nowrap text-ink">
                        {recipe.doseGrams}→{recipe.yieldGrams}g
                      </td>
                      <td className="px-2.5 py-1.5 whitespace-nowrap text-ink">
                        {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                      </td>
                      <td className="px-2.5 py-1.5 whitespace-nowrap text-ink">
                        {recipe.brewTimeSeconds}s
                      </td>
                      <td
                        className="px-2.5 py-1.5 font-medium text-ink"
                        title={tasteResultLabel(recipe.tasteResult)}
                      >
                        {shortTasteLabel(recipe.tasteResult)}
                      </td>
                      <td className="px-2.5 py-1.5">
                        <RowActions
                          recipe={recipe}
                          compact
                          onRefine={() => onRefine(recipe)}
                          onEdit={() => onEdit(recipe)}
                          onFavorite={() => toggleFavoriteRecipe(recipe.id)}
                          onDelete={() => confirmDelete(recipe.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
