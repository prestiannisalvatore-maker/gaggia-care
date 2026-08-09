export type EquipmentId = "machine" | "grinder" | "accessory";

export type FrequencyUnit = "days" | "weeks" | "months" | "per_use" | "as_needed";

export type MaintenanceTask = {
  id: string;
  title: string;
  description: string;
  equipment: EquipmentId;
  equipmentLabel: string;
  frequencyValue: number;
  frequencyUnit: FrequencyUnit;
  frequencyLabel: string;
  priority: "critical" | "high" | "routine";
  guideHref?: string;
  tips?: string[];
  /** Manual chapter / section this requirement comes from */
  manualSection?: string;
};

export type CompletionRecord = {
  taskId: string;
  completedAt: string; // ISO date YYYY-MM-DD
  note?: string;
};

export type ReminderSettings = {
  enabled: boolean;
  daysBefore: number;
  lastNotifiedKey?: string;
};

export type TasteScore = 1 | 2 | 3 | 4 | 5;

export type TasteResult =
  | "balanced"
  | "bitter"
  | "sour"
  | "weak_watery"
  | "harsh_astringent"
  | "hollow";

export type TasteBody = "thin" | "medium" | "syrupy";

export type DrinkType =
  | "espresso"
  | "ristretto"
  | "lungo"
  | "doppio"
  | "americano"
  | "cappuccino"
  | "latte"
  | "flat_white"
  | "macchiato"
  | "cortado"
  | "mocha"
  | "other";

export type EspressoRecipe = {
  id: string;
  createdAt: string;
  shotDate: string;
  drinkType: DrinkType;
  beanBrand: string;
  beanName: string;
  roastDate: string;
  grindSetting: string;
  doseGrams: number;
  yieldGrams: number;
  brewTimeSeconds: number;
  /** Brew water / boiler brew temperature from PID (°C). Optional until PID is installed. */
  brewTempC: number | null;
  /** Steam temperature from PID (°C), if tracked. */
  steamTempC: number | null;
  /** PID offset or probe notes, e.g. “+1.5 °C offset”. */
  pidNotes: string;
  tasteScore: TasteScore | null;
  /** Structured cup result used for dialling analysis */
  tasteResult: TasteResult | null;
  tasteBody: TasteBody | null;
  /** @deprecated Kept for older local recordings; prefer tasteResult */
  tasteNotes: string;
  prepNotes: string;
  /** Set when this shot was refined from an earlier recording */
  basedOnId: string | null;
  favorite: boolean;
};

export type EspressoRecipeInput = Omit<
  EspressoRecipe,
  "id" | "createdAt"
>;

export type AppState = {
  purchaseDate: string;
  completions: CompletionRecord[];
  reminders: ReminderSettings;
  customNotes: string;
  recipes: EspressoRecipe[];
};

export type TaskStatus = "overdue" | "due_soon" | "ok" | "per_use" | "as_needed";

export type ComputedTask = MaintenanceTask & {
  lastCompleted: string | null;
  nextDue: string | null;
  status: TaskStatus;
  daysUntilDue: number | null;
};
