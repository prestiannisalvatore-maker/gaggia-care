import type { TasteBody, TasteResult } from "@/lib/types";

export const TASTE_RESULTS: Array<{
  id: TasteResult;
  label: string;
  hint: string;
}> = [
  {
    id: "balanced",
    label: "Balanced / sweet",
    hint: "Good extraction — keep and fine-tune lightly",
  },
  {
    id: "bitter",
    label: "Bitter / over-extracted",
    hint: "Often too fine, too long, too much yield, or too hot",
  },
  {
    id: "sour",
    label: "Sour / under-extracted",
    hint: "Often too coarse, too short, or too cool",
  },
  {
    id: "weak_watery",
    label: "Weak / watery",
    hint: "Channeling, coarse grind, or too much yield",
  },
  {
    id: "harsh_astringent",
    label: "Harsh / drying",
    hint: "Over-extraction or uneven puck prep",
  },
  {
    id: "hollow",
    label: "Hollow / flat",
    hint: "Missing sweetness — grind or ratio usually needs work",
  },
];

export const TASTE_BODIES: Array<{ id: TasteBody; label: string }> = [
  { id: "thin", label: "Thin" },
  { id: "medium", label: "Medium" },
  { id: "syrupy", label: "Syrupy / full" },
];

export function tasteResultLabel(value: TasteResult | null | undefined): string {
  if (!value) return "—";
  return TASTE_RESULTS.find((item) => item.id === value)?.label ?? value;
}

export function tasteBodyLabel(value: TasteBody | null | undefined): string {
  if (!value) return "—";
  return TASTE_BODIES.find((item) => item.id === value)?.label ?? value;
}

export function isTasteResult(value: unknown): value is TasteResult {
  return typeof value === "string" && TASTE_RESULTS.some((item) => item.id === value);
}

export function isTasteBody(value: unknown): value is TasteBody {
  return typeof value === "string" && TASTE_BODIES.some((item) => item.id === value);
}

/** Map legacy free-text taste notes into a structured result when possible. */
export function inferTasteResultFromNotes(notes: string): TasteResult | null {
  const text = notes.toLowerCase();
  if (!text.trim()) return null;
  if (text.includes("bitter") || text.includes("burnt") || text.includes("ash")) {
    return "bitter";
  }
  if (text.includes("sour") || text.includes("acid") || text.includes("sharp")) {
    return "sour";
  }
  if (text.includes("watery") || text.includes("weak") || text.includes("thin")) {
    return "weak_watery";
  }
  if (text.includes("harsh") || text.includes("astring") || text.includes("dry")) {
    return "harsh_astringent";
  }
  if (text.includes("hollow") || text.includes("flat") || text.includes("dull")) {
    return "hollow";
  }
  if (
    text.includes("balanced") ||
    text.includes("sweet") ||
    text.includes("superb") ||
    text.includes("great")
  ) {
    return "balanced";
  }
  return null;
}
