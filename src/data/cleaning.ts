/**
 * Cleaning and maintenance requirements taken from the
 * Gaggia Classic E24 AU Operating Instructions, Rev 00
 * (document 6420-010-43397), chapter "Cleaning and maintenance".
 */
export const MANUAL_CLEANING = {
  chapter: "Cleaning and maintenance",
  pages: "21–23",
  intro:
    "Regular cleaning and maintenance keep the machine in perfect condition and ensure perfect coffee flavour, a constant coffee flow, and excellent milk froth for a long period of time.",
  sections: [
    {
      id: "steam-wand",
      title: "Cleaning the steam wand",
      frequency: "After each milk frothing",
      taskId: "steam-purge",
      steps: [
        "Clean the steam wand with a damp cloth. To clean it more thoroughly, unscrew the nozzle (Fig.13) and wash it with running water.",
        "Open the steam knob, allowing the steam to escape for one or two seconds to clear the nozzle hole (Fig.1-23).",
      ],
    },
    {
      id: "filter-holder",
      title: "Cleaning the filter holder and the filters",
      frequency: "Every day",
      taskId: "portafilter-clean",
      steps: [
        "The filters should be kept clean to guarantee perfect results.",
        "Warning: the filter must only be replaced when the filter holder cup has cooled down completely to avoid burns.",
        "Every day, remove the filter from the filter holder (Fig.14) and wash it with warm water.",
        "If you notice a malfunction when brewing coffee, immerse the filters in boiling water for 10 minutes and then rinse them with running water.",
        "To clean the filters more thoroughly, use Gaggia cleaning tablets specifically designed to keep the machine in perfect working order.",
      ],
    },
    {
      id: "brew-group",
      title: "Cleaning the coffee brew group",
      frequency: "Monthly",
      taskId: "group-head",
      steps: [
        "Clean the brew group using Gaggia “Coffee Oil Remover” cleaning tablets and the blind filter, to remove any oily coffee residues. Both can be purchased separately.",
        "Make sure the drain pipe is inserted (Fig.1-9).",
        "Insert the blind filter into the filter holder. Divide a Gaggia cleaning tablet into 4 parts and insert one part into the blind filter.",
        "Insert the filter holder into the coffee brew group.",
        "Press the coffee button to activate the pump and create the necessary pressure. Wait 5 seconds before pressing the coffee button again to disable the pump.",
        "The water with the detergent will flow into the drip tray through the drain pipe. Wait about 30 seconds.",
        "Repeat the pump cycles at least 10 times until clean water flows into the drip tray from the drain pipe.",
        "Remove the filter holder with the blind filter and wash them thoroughly with hot water.",
        "Reinsert the filter holder with the blind filter and repeat short pump cycles at least 10 times to complete the rinsing phase.",
        "Remove the filter holder and blind filter and clean the screen (Fig.16) with a brush.",
        "Press the coffee button and let about 150 ml of hot water out of the coffee brew group.",
        "Remove and wash the drip tray with running water. The machine is now ready for use.",
      ],
    },
    {
      id: "drip-tray",
      title: "Cleaning the grill and drip tray",
      frequency: "As needed",
      taskId: "drip-tray",
      steps: [
        "Remove the drip tray and the grill (Fig.1-10, 1-11) and wash them with water.",
        "Do not use abrasive cleaning tools.",
      ],
    },
    {
      id: "water-tank",
      title: "Cleaning the water tank",
      frequency: "As needed (machine must be off)",
      taskId: "water-tank",
      steps: [
        "Warning: to avoid burns, the tank should be cleaned only when the machine is turned off. The drain hose (Fig.11) may reach high temperatures during operation.",
        "To remove the water tank, first remove the drip tray (Fig.1-11), then remove the drain pipe (Fig.11) by pulling it downwards.",
        "Remove the water tank (Fig.1-13) and wash it with fresh water.",
        "When reinserting the tank, make sure the silicone tubes are inside the tank and that they are neither twisted nor blocked (Fig.12).",
      ],
    },
    {
      id: "screen",
      title: "Cleaning the screen",
      frequency: "Regularly",
      taskId: "screen",
      steps: [
        "Regularly remove any residual coffee grounds from the screen (Fig.16) using a brush and wash with hot water, following the instructions in “How to lower the boiler temperature”.",
      ],
    },
    {
      id: "inactivity",
      title: "Cleaning after a long period of inactivity",
      frequency: "After more than 2 weeks unused",
      taskId: "inactivity-rinse",
      steps: [
        "When the machine is not used for a long time (more than two weeks), follow the instructions in “When using for the first time or after a period of inactivity of more than 2 weeks”.",
        "Rinse the water tank, flush a full tank through the steam wand (brew + steam buttons), refill, then flush a full tank through the filter holder before brewing coffee again. Discard all rinse water.",
      ],
    },
    {
      id: "descaling",
      title: "Descaling",
      frequency: "Every 2 months",
      taskId: "descale",
      steps: [
        "Limescale normally builds up with the use of the appliance.",
        "Use the Gaggia descaling product only. Never use vinegar or other descaling agents.",
        "Descaling should be performed every 2 months.",
        "Never drink the descaling solution or any products dispensed until the cycle has been carried out to the end.",
        "Follow the full step-by-step descaling procedure in this app (taken from the manual descaling chapter).",
      ],
    },
  ],
  generalCare: [
    {
      title: "Exterior wipe-down",
      source: "Important safeguards / Caution",
      body: "Never clean with scrubbing powders or harsh cleaners. Simply use a soft cloth dampened with water.",
      taskId: "exterior",
    },
    {
      title: "Water quality",
      source: "Caution",
      body: "For optimal taste, use purified or bottled water. Periodic descaling is still recommended every 2–3 months (the dedicated descaling chapter specifies every 2 months).",
      taskId: "descale",
    },
    {
      title: "Tank water",
      source: "Important safety information",
      body: "Never fill the water tank with warm, hot, or sparkling water. Do not leave water in the tank when unused for a long time — use fresh water every time you use the machine.",
      taskId: "water-tank",
    },
  ],
} as const;
