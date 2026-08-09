import type { MaintenanceTask } from "@/lib/types";

/**
 * Trackable care tasks. Machine items map to the Classic E24 AU manual
 * chapter "Cleaning and maintenance" (and related caution notes).
 */
export const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: "descale",
    title: "Descaling",
    description:
      "Limescale builds up with use. Perform descaling every 2 months using the Gaggia descaling product only — never vinegar or other agents.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 2,
    frequencyUnit: "months",
    frequencyLabel: "Every 2 months",
    priority: "critical",
    guideHref: "/descaling",
    manualSection: "Cleaning and maintenance · Descaling",
    tips: [
      "Never drink the descaling solution or anything dispensed until the cycle is finished.",
      "Complete all four fresh-water rinse tanks before brewing again.",
      "See the full manual procedure on the Descaling page.",
    ],
  },
  {
    id: "portafilter-clean",
    title: "Cleaning the filter holder and the filters",
    description:
      "Every day, remove the filter from the filter holder and wash it with warm water. Keep filters clean to guarantee perfect results.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "days",
    frequencyLabel: "Every day",
    priority: "high",
    guideHref: "/maintenance#manual-cleaning",
    manualSection: "Cleaning and maintenance · Filter holder and filters",
    tips: [
      "Replace filters only when the filter holder has cooled completely to avoid burns.",
      "If brewing misbehaves, immerse filters in boiling water for 10 minutes, then rinse.",
      "For a thorough clean, use Gaggia cleaning tablets.",
    ],
  },
  {
    id: "group-head",
    title: "Cleaning the coffee brew group",
    description:
      "Monthly: clean the brew group with Gaggia Coffee Oil Remover tablets and a blind filter to remove oily coffee residues.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "months",
    frequencyLabel: "Monthly",
    priority: "high",
    guideHref: "/maintenance#brew-group",
    manualSection: "Cleaning and maintenance · Coffee brew group",
    tips: [
      "Divide one Gaggia cleaning tablet into 4 parts; use one quarter in the blind filter.",
      "Ensure the drain pipe is inserted before cleaning.",
      "Brush the screen and rinse after the cleaning cycles.",
    ],
  },
  {
    id: "steam-purge",
    title: "Cleaning the steam wand",
    description:
      "After each milk frothing: clean the wand with a damp cloth, then open the steam knob for one or two seconds to clear the nozzle hole. For a deeper clean, unscrew the nozzle and wash it under running water.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "per_use",
    frequencyLabel: "After each milk frothing",
    priority: "critical",
    guideHref: "/maintenance#steam-wand",
    manualSection: "Cleaning and maintenance · Steam wand",
    tips: [
      "Handle the wand by the rubber tip — metal parts get very hot.",
      "Also purge a little steam before frothing to clear condensation.",
    ],
  },
  {
    id: "drip-tray",
    title: "Cleaning the grill and drip tray",
    description:
      "Remove the drip tray and grill and wash them with water. Do not use abrasive cleaning tools.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "as_needed",
    frequencyLabel: "As needed",
    priority: "routine",
    guideHref: "/maintenance#drip-tray",
    manualSection: "Cleaning and maintenance · Grill and drip tray",
  },
  {
    id: "water-tank",
    title: "Cleaning the water tank",
    description:
      "Clean only with the machine turned off. Remove the drip tray and drain pipe, wash the tank with fresh water, and reinsert so silicone tubes sit inside untwisted.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "as_needed",
    frequencyLabel: "As needed (machine off)",
    priority: "routine",
    guideHref: "/maintenance#water-tank",
    manualSection: "Cleaning and maintenance · Water tank",
    tips: [
      "Never fill with warm, hot, or sparkling water — cold water only.",
      "Do not leave water in the tank during long unused periods; use fresh water each session.",
    ],
  },
  {
    id: "screen",
    title: "Cleaning the screen",
    description:
      "Regularly remove residual coffee grounds from the screen with a brush and wash with hot water (see “How to lower the boiler temperature”).",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "as_needed",
    frequencyLabel: "Regularly",
    priority: "high",
    guideHref: "/maintenance#screen",
    manualSection: "Cleaning and maintenance · Screen",
  },
  {
    id: "inactivity-rinse",
    title: "Cleaning after a long period of inactivity",
    description:
      "If the machine is unused for more than two weeks, run the full first-use / return-from-inactivity rinse before brewing again. Discard all rinse water.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "as_needed",
    frequencyLabel: "After >2 weeks unused",
    priority: "high",
    guideHref: "/maintenance#inactivity",
    manualSection: "Cleaning and maintenance · Long period of inactivity",
    tips: [
      "Flush a full tank through the steam wand, then a full tank through the filter holder.",
      "Rinse the water tank with fresh drinking water first.",
    ],
  },
  {
    id: "exterior",
    title: "Wipe exterior with damp cloth",
    description:
      "Never clean with scrubbing powders or harsh cleaners. Simply use a soft cloth dampened with water.",
    equipment: "machine",
    equipmentLabel: "Gaggia Classic E24",
    frequencyValue: 1,
    frequencyUnit: "as_needed",
    frequencyLabel: "As needed",
    priority: "routine",
    manualSection: "Caution · Exterior cleaning",
  },
  {
    id: "grinder-brush",
    title: "Brush grinder burrs & chute",
    description:
      "With the HiBREW 5G unplugged, brush residual grounds from the burrs, chute, and dosing area.",
    equipment: "grinder",
    equipmentLabel: "HiBREW 5G",
    frequencyValue: 1,
    frequencyUnit: "weeks",
    frequencyLabel: "Weekly",
    priority: "high",
    guideHref: "/grinder",
    manualSection: "HiBREW 5G care (not in Gaggia manual)",
  },
  {
    id: "grinder-deep",
    title: "Deep-clean grinder",
    description:
      "Purge with a grinder-safe cleaner per HiBREW guidance, then recalibrate grind if needed.",
    equipment: "grinder",
    equipmentLabel: "HiBREW 5G",
    frequencyValue: 1,
    frequencyUnit: "months",
    frequencyLabel: "Monthly",
    priority: "high",
    guideHref: "/grinder",
    manualSection: "HiBREW 5G care (not in Gaggia manual)",
  },
  {
    id: "accessory-tools",
    title: "Clean barista tools",
    description:
      "Wash tamper base, WDT tool, dosing cup, and distribution tools. Dry thoroughly before storage.",
    equipment: "accessory",
    equipmentLabel: "Accessories",
    frequencyValue: 1,
    frequencyUnit: "weeks",
    frequencyLabel: "Weekly",
    priority: "routine",
    guideHref: "/accessories",
    manualSection: "Bar kit care (not in Gaggia manual)",
  },
];

export function getTaskById(id: string): MaintenanceTask | undefined {
  return MAINTENANCE_TASKS.find((task) => task.id === id);
}
