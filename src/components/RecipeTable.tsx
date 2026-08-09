"use client";

import { useMemo, useState } from "react";
import { formatDisplayDate } from "@/lib/dates";
import {
  formatRatio,
  sortRecipesNewestFirst,
  tasteLabel,
  uniqueBeanBrands,
} from "@/lib/recipes";
import { useCare } from "@/lib/store";
import type { EspressoRecipe } from "@/lib/types";

type RecipeTableProps = {
  onEdit: (recipe: EspressoRecipe) => void;
  onRefine: (recipe: EspressoRecipe) => void;
};

export function RecipeTable({ onEdit, onRefine }: RecipeTableProps) {
  const { hydrated, state, deleteRecipe, toggleFavoriteRecipe } = useCare();
  const [brandFilter, setBrandFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [query, setQuery] = useState("");

  const brands = useMemo(
    () => uniqueBeanBrands(state.recipes),
    [state.recipes],
  );

  const recipes = useMemo(() => {
    return sortRecipesNewestFirst(state.recipes).filter((recipe) => {
      if (brandFilter !== "all" && recipe.beanBrand !== brandFilter) return false;
      if (favoritesOnly && !recipe.favorite) return false;
      if (!query.trim()) return true;
      const haystack = [
        recipe.beanBrand,
        recipe.beanName,
        recipe.grindSetting,
        recipe.tasteNotes,
        recipe.prepNotes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [state.recipes, brandFilter, favoritesOnly, query]);

  const byId = useMemo(() => {
    return new Map(state.recipes.map((recipe) => [recipe.id, recipe]));
  }, [state.recipes]);

  if (!hydrated) {
    return (
      <p className="text-sm text-ink-soft">Loading your recipe recordings…</p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display text-2xl text-espresso sm:text-3xl">
            Recipe recordings
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Your experiment table — compare grind, dose, time, and yield, then
            refine a promising row toward a superb espresso.
          </p>
        </div>
        <p className="text-sm text-steam">
          {recipes.length} shown · {state.recipes.length} total
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <input
          type="search"
          placeholder="Search brand, coffee, grind, notes…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
            className="min-h-12 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
          >
            <option value="all">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(event) => setFavoritesOnly(event.target.checked)}
              className="h-4 w-4 accent-[var(--espresso)]"
            />
            Favorites only
          </label>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-[var(--line)] bg-white/50 px-6 py-10 text-sm text-ink-soft">
          No recordings yet. Log your first shot above — that row becomes the
          baseline for the next experiment.
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-3 md:hidden">
            {recipes.map((recipe) => {
              const parent = recipe.basedOnId
                ? byId.get(recipe.basedOnId)
                : null;
              return (
                <article
                  key={recipe.id}
                  className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4 shadow-[var(--shadow)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-steam">
                        {formatDisplayDate(recipe.shotDate)}
                        {recipe.favorite ? " · Favorite" : ""}
                      </p>
                      <h3 className="display mt-1 text-2xl text-espresso">
                        {recipe.beanBrand}
                      </h3>
                      {recipe.beanName ? (
                        <p className="text-sm text-ink-soft">{recipe.beanName}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm font-medium text-espresso">
                      {recipe.tasteScore
                        ? `${recipe.tasteScore} · ${tasteLabel(recipe.tasteScore)}`
                        : "Unrated"}
                    </p>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-steam">Grind</dt>
                      <dd className="font-medium text-espresso">
                        {recipe.grindSetting}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steam">Ratio</dt>
                      <dd className="font-medium text-espresso">
                        {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steam">Dose</dt>
                      <dd className="font-medium text-espresso">
                        {recipe.doseGrams}g
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steam">Yield</dt>
                      <dd className="font-medium text-espresso">
                        {recipe.yieldGrams}g
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steam">Time</dt>
                      <dd className="font-medium text-espresso">
                        {recipe.brewTimeSeconds}s
                      </dd>
                    </div>
                    {recipe.roastDate ? (
                      <div>
                        <dt className="text-steam">Roast</dt>
                        <dd className="font-medium text-espresso">
                          {formatDisplayDate(recipe.roastDate)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {recipe.tasteNotes || recipe.prepNotes || parent ? (
                    <div className="mt-3 space-y-1 text-sm text-ink-soft">
                      {recipe.tasteNotes ? <p>{recipe.tasteNotes}</p> : null}
                      {recipe.prepNotes ? (
                        <p className="text-xs text-steam">{recipe.prepNotes}</p>
                      ) : null}
                      {parent ? (
                        <p className="text-xs text-steam">
                          From {parent.grindSetting} / {parent.doseGrams}g
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onRefine(recipe)}
                      className="min-h-11 rounded-full bg-espresso px-3 py-2 text-sm font-medium text-paper"
                    >
                      Refine
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(recipe)}
                      className="min-h-11 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-ink-soft"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavoriteRecipe(recipe.id)}
                      className="min-h-11 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-ink-soft"
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
                      className="min-h-11 rounded-full border border-danger/25 px-3 py-2 text-sm text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 hidden overflow-x-auto rounded-[28px] border border-[var(--line)] bg-white/80 shadow-[var(--shadow)] md:block">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <thead className="bg-[color-mix(in_oklab,var(--paper-deep)_80%,white)] text-xs uppercase tracking-[0.14em] text-steam">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Beans</th>
                  <th className="px-4 py-3 font-medium">Grind</th>
                  <th className="px-4 py-3 font-medium">Dose</th>
                  <th className="px-4 py-3 font-medium">Yield</th>
                  <th className="px-4 py-3 font-medium">Ratio</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Taste</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => {
                  const parent = recipe.basedOnId
                    ? byId.get(recipe.basedOnId)
                    : null;
                  return (
                    <tr
                      key={recipe.id}
                      className="border-t border-[var(--line)] align-top transition hover:bg-[color-mix(in_oklab,var(--copper)_6%,white)]"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-ink-soft">
                        <div>{formatDisplayDate(recipe.shotDate)}</div>
                        {recipe.favorite ? (
                          <div className="mt-1 text-xs text-copper">Favorite</div>
                        ) : null}
                        {parent ? (
                          <div className="mt-1 text-xs text-steam">
                            From {parent.grindSetting} / {parent.doseGrams}g
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-espresso">
                          {recipe.beanBrand}
                        </div>
                        {recipe.beanName ? (
                          <div className="text-ink-soft">{recipe.beanName}</div>
                        ) : null}
                        {recipe.roastDate ? (
                          <div className="mt-1 text-xs text-steam">
                            Roast {formatDisplayDate(recipe.roastDate)}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 font-medium text-espresso">
                        {recipe.grindSetting}
                      </td>
                      <td className="px-4 py-4">{recipe.doseGrams}g</td>
                      <td className="px-4 py-4">{recipe.yieldGrams}g</td>
                      <td className="px-4 py-4">
                        {formatRatio(recipe.doseGrams, recipe.yieldGrams)}
                      </td>
                      <td className="px-4 py-4">{recipe.brewTimeSeconds}s</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-espresso">
                          {recipe.tasteScore
                            ? `${recipe.tasteScore} · ${tasteLabel(recipe.tasteScore)}`
                            : "—"}
                        </div>
                      </td>
                      <td className="max-w-[220px] px-4 py-4 text-ink-soft">
                        {recipe.tasteNotes || recipe.prepNotes ? (
                          <div className="space-y-1">
                            {recipe.tasteNotes ? <p>{recipe.tasteNotes}</p> : null}
                            {recipe.prepNotes ? (
                              <p className="text-xs text-steam">
                                {recipe.prepNotes}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex min-w-[140px] flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => onRefine(recipe)}
                            className="rounded-full bg-espresso px-3 py-1.5 text-xs font-medium text-paper transition hover:bg-copper-deep"
                          >
                            Refine
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(recipe)}
                            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-ink-soft transition hover:bg-mist/60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteRecipe(recipe.id)}
                            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-ink-soft transition hover:bg-mist/60"
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
                            className="rounded-full border border-danger/25 px-3 py-1.5 text-xs text-danger transition hover:bg-danger/5"
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
        </>
      )}
    </div>
  );
}
