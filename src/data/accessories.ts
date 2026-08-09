export type Accessory = {
  id: string;
  name: string;
  role: string;
  care: string;
  frequency: string;
};

export const ACCESSORIES: Accessory[] = [
  {
    id: "tamper",
    name: "Tamper (included)",
    role: "Supplied with the Classic E24. Press coffee evenly for a level, flat surface before locking in the filter holder.",
    care: "Wipe the base after each session. Wash with mild soap if oils build up; dry fully to protect the finish.",
    frequency: "Wipe daily · wash weekly",
  },
  {
    id: "crema-filter",
    name: "Crema Perfetta filter + frothing jet",
    role: "Starter filter for crema on first use. Must be used only with the frothing jet device.",
    care: "Wash daily with warm water. Never use the Crema Perfetta filter without the frothing jet — coffee can squirt and burn.",
    frequency: "Wash daily",
  },
  {
    id: "traditional-filters",
    name: "Traditional 1-cup / 2-cup filters",
    role: "Professional-style baskets for ground coffee or single-dose pods (1-cup). Do not use with the frothing jet device.",
    care: "Wash daily. If brewing misbehaves, soak in boiling water for 10 minutes, then rinse.",
    frequency: "Wash daily",
  },
  {
    id: "wdt",
    name: "WDT tool",
    role: "Breaks up clumps and distributes grounds before tamping.",
    care: "Brush or rinse needles carefully. Store so fine tips are protected.",
    frequency: "Clean weekly",
  },
  {
    id: "dosing-cup",
    name: "Dosing cup",
    role: "Catches grounds from the HiBREW 5G for transfer to the portafilter.",
    care: "Rinse after use; avoid leaving old grounds that scent the next dose.",
    frequency: "Rinse each session",
  },
  {
    id: "distributor",
    name: "Distribution / leveling tool",
    role: "Levels the bed before or instead of heavy WDT depending on your workflow.",
    care: "Wipe coffee oils from the contact surface; check for grit that could scratch the basket.",
    frequency: "Wipe daily",
  },
  {
    id: "knock-box",
    name: "Knock box",
    role: "Disposes of spent pucks cleanly.",
    care: "Empty daily. Wash the bar and bin regularly to prevent odours.",
    frequency: "Empty daily · wash weekly",
  },
  {
    id: "milk-pitcher",
    name: "Milk pitcher",
    role: "Steaming and pouring for milk drinks.",
    care: "Rinse immediately after use. Wash with hot soapy water; never leave dried milk.",
    frequency: "Wash after every use",
  },
  {
    id: "cloths",
    name: "Bar cloths",
    role: "One for steam wand, one for general wipe-downs.",
    care: "Use a dedicated steam-wand cloth. Launder frequently; replace when stained or sour.",
    frequency: "Swap / launder often",
  },
  {
    id: "descaler",
    name: "Gaggia Descaler",
    role: "Manufacturer solution for the quarterly descale cycle.",
    care: "Store sealed and upright. Check expiry on the bottle.",
    frequency: "Use every 2 months",
  },
  {
    id: "scale",
    name: "Brew scale",
    role: "Measures dose and yield for repeatable recipes.",
    care: "Keep dry. Wipe spills immediately; never submerge unless rated waterproof.",
    frequency: "Wipe as needed",
  },
];
