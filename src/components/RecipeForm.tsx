"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { DRINK_TYPES, drinkTypeLabel, formatRatio } from "@/lib/recipes";
import { TASTE_BODIES, TASTE_RESULTS } from "@/lib/taste";
import { todayISO } from "@/lib/dates";
import { useCare } from "@/lib/store";
import type {
  DrinkType,
  EspressoRecipe,
  EspressoRecipeInput,
  TasteBody,
  TasteResult,
  TasteScore,
} from "@/lib/types";

export function emptyRecipeForm(): EspressoRecipeInput {
  return {
    shotDate: todayISO(),
    drinkType: "espresso",
    beanBrand: "",
    beanName: "",
    roastDate: "",
    grindSetting: "",
    doseGrams: 18,
    yieldGrams: 36,
    brewTimeSeconds: 28,
    brewTempC: null,
    steamTempC: null,
    pidNotes: "",
    tasteScore: null,
    tasteResult: null,
    tasteBody: null,
    tasteNotes: "",
    prepNotes: "",
    basedOnId: null,
    favorite: false,
  };
}

export function recipeToInput(recipe: EspressoRecipe): EspressoRecipeInput {
  return {
    shotDate: recipe.shotDate,
    drinkType: recipe.drinkType ?? "espresso",
    beanBrand: recipe.beanBrand,
    beanName: recipe.beanName,
    roastDate: recipe.roastDate,
    grindSetting: recipe.grindSetting,
    doseGrams: recipe.doseGrams,
    yieldGrams: recipe.yieldGrams,
    brewTimeSeconds: recipe.brewTimeSeconds,
    brewTempC: recipe.brewTempC ?? null,
    steamTempC: recipe.steamTempC ?? null,
    pidNotes: recipe.pidNotes ?? "",
    tasteScore: recipe.tasteScore,
    tasteResult: recipe.tasteResult ?? null,
    tasteBody: recipe.tasteBody ?? null,
    tasteNotes: recipe.tasteNotes ?? "",
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
    tasteResult: null,
    tasteBody: null,
    tasteNotes: "",
    favorite: false,
    prepNotes: `Refined from prior ${drinkTypeLabel(recipe.drinkType)} shot. Change one variable, then pick the taste result.`,
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
        : "Log a shot";

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
      setError("Add the coffee bean brand so analysis can compare like-for-like.");
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
    if (!form.tasteResult) {
      setError("Select how the coffee tasted — that drives the dialling coach.");
      return;
    }
    if (form.brewTempC != null && (form.brewTempC < 70 || form.brewTempC > 130)) {
      setError("Brew water temperature should be between 70°C and 130°C.");
      return;
    }
    if (
      form.steamTempC != null &&
      (form.steamTempC < 100 || form.steamTempC > 160)
    ) {
      setError("Steam temperature should be between 100°C and 160°C.");
      return;
    }

    const payload: EspressoRecipeInput = {
      ...form,
      beanBrand: form.beanBrand.trim(),
      beanName: form.beanName.trim(),
      grindSetting: form.grindSetting.trim(),
      pidNotes: form.pidNotes.trim(),
      tasteNotes: "",
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
      id="recipe-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-steam">
            New recording
          </p>
          <h2 className="display mt-1 text-3xl text-ink">{modeLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Log variables, then choose the taste result. The coach uses that to
            suggest the next change.
          </p>
        </div>
        <p className="text-sm text-steam">
          Ratio <span className="font-medium text-ink">{ratio}</span>
        </p>
      </div>

      {mode === "refine" && sourceRecipe ? (
        <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm text-ink-soft">
          Starting from {drinkTypeLabel(sourceRecipe.drinkType)} · grind{" "}
          {sourceRecipe.grindSetting} · {sourceRecipe.doseGrams}g →{" "}
          {sourceRecipe.yieldGrams}g · {sourceRecipe.brewTimeSeconds}s
          {sourceRecipe.tasteResult
            ? ` · was ${TASTE_RESULTS.find((item) => item.id === sourceRecipe.tasteResult)?.label}`
            : ""}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Drink type" htmlFor="drinkType">
          <select
            id="drinkType"
            required
            value={form.drinkType}
            onChange={(event) =>
              update("drinkType", event.target.value as DrinkType)
            }
            className={inputClass}
          >
            {DRINK_TYPES.map((drink) => (
              <option key={drink.id} value={drink.id}>
                {drink.label}
              </option>
            ))}
          </select>
        </Field>

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
            placeholder="e.g. Market Lane, Ona"
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
            placeholder="Optional"
            value={form.beanName}
            onChange={(event) => update("beanName", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="HiBREW 5G grind setting" htmlFor="grindSetting">
          <input
            id="grindSetting"
            required
            placeholder="e.g. 12 or 3.5"
            value={form.grindSetting}
            onChange={(event) => update("grindSetting", event.target.value)}
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

        <Field label="Dose (g in)" htmlFor="doseGrams">
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

        <Field label="Yield (g out)" htmlFor="yieldGrams">
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

        <Field label="Overall score" htmlFor="tasteScore">
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
            <option value="">Not scored</option>
            <option value="1">1 · Poor</option>
            <option value="2">2 · OK</option>
            <option value="3">3 · Good</option>
            <option value="4">4 · Great</option>
            <option value="5">5 · Superb</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-paper/70 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-steam">
          Taste result
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Pick the clearest description of the cup. This is what powers
          suggestions.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="How did it taste?" htmlFor="tasteResult">
            <select
              id="tasteResult"
              required
              value={form.tasteResult ?? ""}
              onChange={(event) =>
                update(
                  "tasteResult",
                  event.target.value
                    ? (event.target.value as TasteResult)
                    : null,
                )
              }
              className={inputClass}
            >
              <option value="">Select taste result</option>
              {TASTE_RESULTS.map((taste) => (
                <option key={taste.id} value={taste.id}>
                  {taste.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Body" htmlFor="tasteBody">
            <select
              id="tasteBody"
              value={form.tasteBody ?? ""}
              onChange={(event) =>
                update(
                  "tasteBody",
                  event.target.value ? (event.target.value as TasteBody) : null,
                )
              }
              className={inputClass}
            >
              <option value="">Optional</option>
              {TASTE_BODIES.map((body) => (
                <option key={body.id} value={body.id}>
                  {body.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {form.tasteResult ? (
          <p className="mt-3 text-sm text-ink-soft">
            {TASTE_RESULTS.find((item) => item.id === form.tasteResult)?.hint}
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-paper/70 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-steam">
          PID temperatures
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Brew water temp (°C)" htmlFor="brewTempC">
            <input
              id="brewTempC"
              type="number"
              min={70}
              max={130}
              step={0.1}
              placeholder="Optional until PID"
              value={form.brewTempC ?? ""}
              onChange={(event) =>
                update(
                  "brewTempC",
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
                )
              }
              className={inputClass}
            />
          </Field>
          <Field label="Steam temp (°C)" htmlFor="steamTempC">
            <input
              id="steamTempC"
              type="number"
              min={100}
              max={160}
              step={0.1}
              placeholder="Optional"
              value={form.steamTempC ?? ""}
              onChange={(event) =>
                update(
                  "steamTempC",
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
                )
              }
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="What you changed (optional)" htmlFor="prepNotes">
          <input
            id="prepNotes"
            placeholder="e.g. Coarser by 0.5 from last shot"
            value={form.prepNotes}
            onChange={(event) => update("prepNotes", event.target.value)}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-3 self-end pb-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(event) => update("favorite", event.target.checked)}
            className="h-4 w-4 accent-[var(--ink)]"
          />
          Mark as a keeper
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-ink px-5 text-sm font-medium text-paper"
        >
          {mode === "edit"
            ? "Save changes"
            : mode === "refine"
              ? "Save experiment"
              : "Save recording"}
        </button>
        {mode !== "new" ? (
          <button
            type="button"
            onClick={onDone}
            className="min-h-12 rounded-xl border border-[var(--line)] px-5 text-sm text-ink-soft"
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
      <span className="font-medium text-ink">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-ink outline-none transition focus:border-copper";
