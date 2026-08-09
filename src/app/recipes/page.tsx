"use client";

import { useMemo, useState } from "react";
import type { SuggestedAdjustments } from "@/lib/analysis";
import { PageShell } from "@/components/PageShell";
import { RecipeCoach } from "@/components/RecipeCoach";
import {
  emptyRecipeForm,
  RecipeForm,
  recipeToInput,
  refineFromRecipe,
} from "@/components/RecipeForm";
import { RecipeTable } from "@/components/RecipeTable";
import type { EspressoRecipe } from "@/lib/types";

type FormMode =
  | { type: "new" }
  | { type: "edit"; recipe: EspressoRecipe }
  | { type: "refine"; recipe: EspressoRecipe; tweaks?: SuggestedAdjustments };

export default function RecipesPage() {
  const [mode, setMode] = useState<FormMode>({ type: "new" });
  const [formNonce, setFormNonce] = useState(0);

  const formConfig = useMemo(() => {
    if (mode.type === "edit") {
      return {
        key: `edit-${mode.recipe.id}`,
        mode: "edit" as const,
        initial: recipeToInput(mode.recipe),
        editingId: mode.recipe.id,
        sourceRecipe: null as EspressoRecipe | null,
      };
    }
    if (mode.type === "refine") {
      const base = refineFromRecipe(mode.recipe);
      const tweaks = mode.tweaks;
      return {
        key: `refine-${mode.recipe.id}-${formNonce}`,
        mode: "refine" as const,
        initial: tweaks
          ? {
              ...base,
              grindSetting: tweaks.grindSetting || base.grindSetting,
              doseGrams: tweaks.doseGrams ?? base.doseGrams,
              yieldGrams: tweaks.yieldGrams ?? base.yieldGrams,
              brewTimeSeconds: tweaks.brewTimeSeconds ?? base.brewTimeSeconds,
              brewTempC:
                tweaks.brewTempC !== undefined
                  ? tweaks.brewTempC
                  : base.brewTempC,
              prepNotes: tweaks.reason
                ? `Coach suggestion: ${tweaks.reason}`
                : base.prepNotes,
            }
          : base,
        editingId: null,
        sourceRecipe: mode.recipe,
      };
    }
    return {
      key: `new-${formNonce}`,
      mode: "new" as const,
      initial: emptyRecipeForm(),
      editingId: null,
      sourceRecipe: null as EspressoRecipe | null,
    };
  }, [mode, formNonce]);

  function goToForm() {
    window.setTimeout(() => {
      document
        .getElementById("recipe-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <PageShell
      eyebrow="Brew"
      title="Recipes"
      description="Log the shot, say how it tasted, compare the table, then follow the coach on the next variable."
      actions={
        <a
          href="#recipe-form"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-4 text-sm font-medium text-paper"
        >
          Log a shot
        </a>
      }
    >
      <div className="space-y-8">
        <RecipeCoach
          onApplySuggestion={(base, adjustments) => {
            setFormNonce((value) => value + 1);
            setMode({ type: "refine", recipe: base, tweaks: adjustments });
            goToForm();
          }}
        />

        <RecipeTable
          onEdit={(recipe) => {
            setMode({ type: "edit", recipe });
            goToForm();
          }}
          onRefine={(recipe) => {
            setFormNonce((value) => value + 1);
            setMode({ type: "refine", recipe });
            goToForm();
          }}
        />

        <RecipeForm
          key={formConfig.key}
          mode={formConfig.mode}
          initial={formConfig.initial}
          editingId={formConfig.editingId}
          sourceRecipe={formConfig.sourceRecipe}
          onDone={() => {
            setMode({ type: "new" });
            setFormNonce((value) => value + 1);
          }}
        />
      </div>
    </PageShell>
  );
}
