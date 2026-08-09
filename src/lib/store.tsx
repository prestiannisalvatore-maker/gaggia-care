"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createRecipeId, isDrinkType } from "@/lib/recipes";
import { computeTasks } from "@/lib/schedule";
import { todayISO } from "@/lib/dates";
import {
  inferTasteResultFromNotes,
  isTasteBody,
  isTasteResult,
} from "@/lib/taste";
import type {
  AppState,
  CompletionRecord,
  ComputedTask,
  EspressoRecipe,
  EspressoRecipeInput,
} from "@/lib/types";
import { maybeNotifyDueTasks } from "@/lib/reminders";

const STORAGE_KEY = "gaggia-e24-care-v1";

const DEFAULT_STATE: AppState = {
  purchaseDate: "2026-08-01",
  completions: [],
  reminders: {
    enabled: true,
    daysBefore: 7,
  },
  customNotes: "",
  recipes: [],
};

type StoreContextValue = {
  hydrated: boolean;
  state: AppState;
  tasks: ComputedTask[];
  completeTask: (taskId: string, date?: string, note?: string) => void;
  undoLastCompletion: (taskId: string) => void;
  updatePurchaseDate: (date: string) => void;
  updateReminders: (reminders: Partial<AppState["reminders"]>) => void;
  updateNotes: (notes: string) => void;
  addRecipe: (input: EspressoRecipeInput) => EspressoRecipe;
  updateRecipe: (id: string, input: EspressoRecipeInput) => void;
  deleteRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  resetAll: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      reminders: {
        ...DEFAULT_STATE.reminders,
        ...parsed.reminders,
      },
      completions: parsed.completions ?? [],
      recipes: (parsed.recipes ?? []).map((recipe) => {
        const tasteResult = isTasteResult(recipe.tasteResult)
          ? recipe.tasteResult
          : inferTasteResultFromNotes(recipe.tasteNotes ?? "");
        return {
          ...recipe,
          drinkType: isDrinkType(recipe.drinkType)
            ? recipe.drinkType
            : "espresso",
          brewTempC:
            typeof recipe.brewTempC === "number" ? recipe.brewTempC : null,
          steamTempC:
            typeof recipe.steamTempC === "number" ? recipe.steamTempC : null,
          pidNotes: recipe.pidNotes ?? "",
          tasteResult,
          tasteBody: isTasteBody(recipe.tasteBody) ? recipe.tasteBody : null,
          tasteNotes: recipe.tasteNotes ?? "",
        };
      }),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeStorage(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let memoryState = DEFAULT_STATE;
let storageLoaded = false;
const listeners = new Set<() => void>();

function ensureStorageLoaded() {
  if (storageLoaded || typeof window === "undefined") return;
  memoryState = readStorage();
  storageLoaded = true;
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  ensureStorageLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureStorageLoaded();
  return memoryState;
}

function getServerSnapshot() {
  return DEFAULT_STATE;
}

function setState(updater: (prev: AppState) => AppState) {
  ensureStorageLoaded();
  memoryState = updater(memoryState);
  writeStorage(memoryState);
  emit();
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CareProvider({ children }: { children: ReactNode }) {
  const hydrated = useIsClient();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const notifiedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const tasks = computeTasks(state);
    void maybeNotifyDueTasks(state, tasks, (key) => {
      if (notifiedFor.current === key) return;
      notifiedFor.current = key;
      setState((prev) => ({
        ...prev,
        reminders: { ...prev.reminders, lastNotifiedKey: key },
      }));
    });
  }, [hydrated, state]);

  const tasks = useMemo(() => computeTasks(state), [state]);

  const value = useMemo<StoreContextValue>(
    () => ({
      hydrated,
      state,
      tasks,
      completeTask: (taskId, date = todayISO(), note) => {
        const entry: CompletionRecord = {
          taskId,
          completedAt: date,
          note,
        };
        setState((prev) => ({
          ...prev,
          completions: [...prev.completions, entry],
        }));
      },
      undoLastCompletion: (taskId) => {
        setState((prev) => {
          const index = [...prev.completions]
            .map((item, i) => ({ item, i }))
            .reverse()
            .find(({ item }) => item.taskId === taskId)?.i;
          if (index === undefined) return prev;
          return {
            ...prev,
            completions: prev.completions.filter((_, i) => i !== index),
          };
        });
      },
      updatePurchaseDate: (date) => {
        setState((prev) => ({ ...prev, purchaseDate: date }));
      },
      updateReminders: (reminders) => {
        setState((prev) => ({
          ...prev,
          reminders: { ...prev.reminders, ...reminders },
        }));
      },
      updateNotes: (customNotes) => {
        setState((prev) => ({ ...prev, customNotes }));
      },
      addRecipe: (input) => {
        const recipe: EspressoRecipe = {
          ...input,
          id: createRecipeId(),
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({
          ...prev,
          recipes: [recipe, ...prev.recipes],
        }));
        return recipe;
      },
      updateRecipe: (id, input) => {
        setState((prev) => ({
          ...prev,
          recipes: prev.recipes.map((recipe) =>
            recipe.id === id ? { ...recipe, ...input } : recipe,
          ),
        }));
      },
      deleteRecipe: (id) => {
        setState((prev) => ({
          ...prev,
          recipes: prev.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      toggleFavoriteRecipe: (id) => {
        setState((prev) => ({
          ...prev,
          recipes: prev.recipes.map((recipe) =>
            recipe.id === id
              ? { ...recipe, favorite: !recipe.favorite }
              : recipe,
          ),
        }));
      },
      resetAll: () => {
        memoryState = DEFAULT_STATE;
        writeStorage(DEFAULT_STATE);
        emit();
      },
    }),
    [hydrated, state, tasks],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useCare() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useCare must be used within CareProvider");
  }
  return ctx;
}
