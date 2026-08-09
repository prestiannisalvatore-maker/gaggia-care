"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { formatRatio } from "@/lib/recipes";
import { todayISO } from "@/lib/dates";
import { useCare } from "@/lib/store";
import type { EspressoRecipe, EspressoRecipeInput, TasteScore } from "@/lib/types";

export function emptyRecipeForm(): EspressoRecipeInput {
  return {
    shotDate: todayISO(),
    beanBrand: "",
    beanName: "",
    roastDate: "",
    grindSetting: "",
    doseGrams: 18,
    yieldGrams: 36,
    brewTimeSeconds: 28,
    tasteScore: null,
    tasteNotes: "",
    prepNotes: "",
    basedOnId: null,
    favorite: false,
  };
}

export function recipeToInput(recipe: EspressoRecipe): EspressoRecipeInput {
  return {
    shotDate: recipe.shotDate,
    beanBrand: recipe.beanBrand,
    beanName: recipe.beanName,
    roastDate: recipe.roastDate,
    grindSetting: recipe.grindSetting,
    doseGrams: recipe.doseGrams,
    yieldGrams: recipe.yieldGrams,
    brewTimeSeconds: recipe.brewTimeSeconds,
    tasteScore: recipe.tasteScore,
    tasteNotes: recipe.tasteNotes,
    prepNotes: recipe.prepNotes,
    basedOnId: recipe.basedOnId,
    favorite: recipe.favorite,
  };
}

export function refineFromRecipe(recipe: EspressoRecipe): EspressoRecipeInput {
  return {
    ...recipeToInput(recipe),
    shotDate: todayISO(),
    basedOnId: recipe.id,
    tasteScore: null,
    tasteNotes: "",
    favorite: false,
    prepNotes: recipe.prepNotes
      ? `Refined from prior shot. Previous prep: ${recipe.prepNotes}`
      : "Refined from prior shot — adjust one variable at a time.",
  };
}

type RecipeFormProps = {
  mode: "new" | "edit" | "refine";
  initial: EspressoRecipeInput;
  editingId?: string | null;
  sourceRecipe?: EspressoRecipe | null;
  onDone: () => void;
};

export function RecipeForm({
  mode,
  initial,
  editingId = null,
  sourceRecipe = null,
  onDone,
}: RecipeFormProps) {
  const { addRecipe, updateRecipe, state } = useCare();
  const [form, setForm] = useState<EspressoRecipeInput>(initial);
  const [error, setError] = useState<string | null>(null);

  const brandSuggestions = useMemo(() => {
    const brands = new Set(
      state.recipes.map((recipe) => recipe.beanBrand.trim()).filter(Boolean),
    );
    return [...brands].sort((a, b) => a.localeCompare(b));
  }, [state.recipes]);

  const ratio = formatRatio(form.doseGrams, form.yieldGrams);
  const modeLabel =
    mode === "edit"
      ? "Edit recording"
      : mode === "refine"
        ? "Refine experiment"
        : "New espresso recording";

  function update<K extends keyof EspressoRecipeInput>(
    key: K,
    value: EspressoRecipeInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.beanBrand.trim()) {
      setError("Add the coffee bean brand so you can compare later.");
      return;
    }
    if (!form.grindSetting.trim()) {
      setError("Add the HiBREW 5G grind setting used for this shot.");
      return;
    }
    if (form.doseGrams <= 0 || form.yieldGrams <= 0 || form.brewTimeSeconds <= 0) {
      setError("Dose, yield, and brew time must be greater than zero.");
      return;
    }

    const payload: EspressoRecipeInput = {
      ...form,
      beanBrand: form.beanBrand.trim(),
      beanName: form.beanName.trim(),
      grindSetting: form.grindSetting.trim(),
      tasteNotes: form.tasteNotes.trim(),
      prepNotes: form.prepNotes.trim(),
    };

    if (mode === "edit" && editingId) {
      updateRecipe(editingId, payload);
    } else {
      addRecipe(payload);
    }
    onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-steam">
            Dialling log
          </p>
          <h2 className="display mt-2 text-3xl text-espresso">{modeLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Record grind, dose, brew time, and yield. Change one variable at a
            time when refining toward a superb cup.
          </p>
        </div>
        <p className="text-sm text-steam">
          Ratio <span className="font-medium text-espresso">{ratio}</span>
        </p>
      </div>

      {mode === "refine" && sourceRecipe ? (
        <p className="mt-4 rounded-2xl bg-[color-mix(in_oklab,var(--copper)_12%,white)] px-4 py-3 text-sm text-ink-soft">
          Starting from {sourceRecipe.beanBrand}
          {sourceRecipe.beanName ? ` · ${sourceRecipe.beanName}` : ""} · grind{" "}
          {sourceRecipe.grindSetting} · {sourceRecipe.doseGrams}g in /{" "}
          {sourceRecipe.yieldGrams}g out · {sourceRecipe.brewTimeSeconds}s
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="Shot date" htmlFor="shotDate">
          <input
            id="shotDate"
            type="date"
            required
            value={form.shotDate}
            onChange={(event) => update("shotDate", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Bean brand" htmlFor="beanBrand">
          <input
            id="beanBrand"
            list="bean-brands"
            required
            placeholder="e.g. Market Lane, Ona, local roaster"
            value={form.beanBrand}
            onChange={(event) => update("beanBrand", event.target.value)}
            className={inputClass}
          />
          <datalist id="bean-brands">
            {brandSuggestions.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </Field>

        <Field label="Coffee / lot name" htmlFor="beanName">
          <input
            id="beanName"
            placeholder="Optional — blend or single origin name"
            value={form.beanName}
            onChange={(event) => update("beanName", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Roast date" htmlFor="roastDate">
          <input
            id="roastDate"
            type="date"
            value={form.roastDate}
            onChange={(event) => update("roastDate", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="HiBREW 5G grind setting" htmlFor="grindSetting">
          <input
            id="grindSetting"
            required
            placeholder="e.g. 12, 3.5, or your dial mark"
            value={form.grindSetting}
            onChange={(event) => update("grindSetting", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Taste score" htmlFor="tasteScore">
          <select
            id="tasteScore"
            value={form.tasteScore ?? ""}
            onChange={(event) =>
              update(
                "tasteScore",
                event.target.value
                  ? (Number(event.target.value) as TasteScore)
                  : null,
              )
            }
            className={inputClass}
          >
            <option value="">Not rated yet</option>
            <option value="1">1 · Poor</option>
            <option value="2">2 · OK</option>
            <option value="3">3 · Good</option>
            <option value="4">4 · Great</option>
            <option value="5">5 · Superb</option>
          </select>
        </Field>

        <Field label="Dose (bean weight, g)" htmlFor="doseGrams">
          <input
            id="doseGrams"
            type="number"
            required
            min={0.1}
            step={0.1}
            value={form.doseGrams}
            onChange={(event) =>
              update("doseGrams", Number(event.target.value))
            }
            className={inputClass}
          />
        </Field>

        <Field label="Yield (espresso weight, g)" htmlFor="yieldGrams">
          <input
            id="yieldGrams"
            type="number"
            required
            min={0.1}
            step={0.1}
            value={form.yieldGrams}
            onChange={(event) =>
              update("yieldGrams", Number(event.target.value))
            }
            className={inputClass}
          />
        </Field>

        <Field label="Brew time (seconds)" htmlFor="brewTimeSeconds">
          <input
            id="brewTimeSeconds"
            type="number"
            required
            min={1}
            step={0.5}
            value={form.brewTimeSeconds}
            onChange={(event) =>
              update("brewTimeSeconds", Number(event.target.value))
            }
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-3 self-end pb-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(event) => update("favorite", event.target.checked)}
            className="h-4 w-4 accent-[var(--espresso)]"
          />
          Mark as a keeper / favorite
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Taste notes" htmlFor="tasteNotes">
          <textarea
            id="tasteNotes"
            rows={3}
            placeholder="Sour, bitter, sweet, thin, syrupy, chocolate, citrus…"
            value={form.tasteNotes}
            onChange={(event) => update("tasteNotes", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Prep & experiment notes" htmlFor="prepNotes">
          <textarea
            id="prepNotes"
            rows={3}
            placeholder="WDT, distribution, tamp, what you changed from the last shot…"
            value={form.prepNotes}
            onChange={(event) => update("prepNotes", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          className="min-h-12 rounded-full bg-espresso px-5 py-3 text-sm font-medium text-paper transition hover:bg-copper-deep"
        >
          {mode === "edit"
            ? "Save changes"
            : mode === "refine"
              ? "Save refined shot"
              : "Save recording"}
        </button>
        {mode !== "new" ? (
          <button
            type="button"
            onClick={onDone}
            className="min-h-12 rounded-full border border-[var(--line)] px-5 py-3 text-sm text-ink-soft transition hover:bg-mist/60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm" htmlFor={htmlFor}>
      <span className="font-medium text-espresso">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--line)] bg-paper px-4 py-3 text-ink outline-none transition focus:border-copper";
