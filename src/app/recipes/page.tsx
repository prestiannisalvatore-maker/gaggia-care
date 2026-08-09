"use client";

import { useMemo, useState } from "react";
import { PageIntro } from "@/components/PageIntro";
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
  | { type: "refine"; recipe: EspressoRecipe };

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
        sourceRecipe: null,
      };
    }
    if (mode.type === "refine") {
      return {
        key: `refine-${mode.recipe.id}-${formNonce}`,
        mode: "refine" as const,
        initial: refineFromRecipe(mode.recipe),
        editingId: null,
        sourceRecipe: mode.recipe,
      };
    }
    return {
      key: `new-${formNonce}`,
      mode: "new" as const,
      initial: emptyRecipeForm(),
      editingId: null,
      sourceRecipe: null,
    };
  }, [mode, formNonce]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <PageIntro
        eyebrow="Dialling-in"
        title="Espresso recipes"
        description="Capture each shot’s bean brand, grind setting, dose, brew time, and yield. Build a table of recordings, then refine promising baselines until the espresso tastes superb."
      />

      <div className="fade-up-delay mt-10">
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

      <section className="mt-16">
        <RecipeTable
          onEdit={(recipe) => {
            setMode({ type: "edit", recipe });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onRefine={(recipe) => {
            setFormNonce((value) => value + 1);
            setMode({ type: "refine", recipe });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </div>
  );
}
