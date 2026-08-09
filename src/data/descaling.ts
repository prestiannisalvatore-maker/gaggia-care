export const DESCALING_GUIDE = {
  title: "Descaling with Gaggia Descaler",
  source: "Gaggia Classic E24 AU operating instructions (Rev 00)",
  intro:
    "Limescale builds up with normal use. The Classic E24 manual specifies descaling every 2 months using Gaggia descaling product only — never vinegar or other agents. Correct descaling protects performance for the life of the machine.",
  intervalNote:
    "Official schedule: every 2 months. An earlier caution in the same manual also mentions every 2–3 months when using purified or bottled water — when in doubt, follow the dedicated descaling chapter (every 2 months).",
  supplies: [
    "Gaggia descaling product only",
    "Fresh cold drinking water",
    "Heat-safe containers for steam-wand and brew-unit flushes",
    "Access to empty and rinse the water tank and drip tray",
  ],
  warnings: [
    "Never drink the descaling solution or anything dispensed until the full cycle is finished.",
    "Never use vinegar or non-Gaggia descaling agents.",
    "Remove the filter holder before starting the descaling solution phase.",
    "Always finish every rinse tank — incomplete rinsing leaves solution in the circuit.",
  ],
  steps: [
    {
      title: "Prepare the machine",
      detail:
        "Remove the filter holder by turning it from right to left. Remove and empty the water tank (clean it as described in Cleaning the water tank).",
    },
    {
      title: "Mix the descaler",
      detail:
        "Pour HALF the content of the Gaggia descaling solution into the water tank, then fill with fresh water up to the MAX level.",
    },
    {
      title: "First dispense cycle",
      detail:
        "Turn the machine on. Dispense 2 cups of water (about 150 ml each) from the steam wand (hot-water dispensing), then another 2 cups (about 150 ml each) from the coffee brew unit using the coffee button. Turn the machine off.",
    },
    {
      title: "Soak",
      detail:
        "Leave the descaling solution to take effect for approximately 20 minutes with the machine turned off.",
    },
    {
      title: "Second dispense cycle",
      detail:
        "Turn the machine on. Dispense 2 cups (~150 ml each) from the steam wand, then 2 cups from the brew unit. Turn off and leave off for 3 minutes.",
    },
    {
      title: "Empty the tank with solution",
      detail:
        "Repeat the steam-wand + brew-unit dispensing pattern until the water tank is completely empty.",
    },
    {
      title: "Rinse tank #1 through the steam wand",
      detail:
        "Rinse the water tank and fill with fresh drinking water. Empty the drip tray. Place a container under the steam wand, open the steam/hot water knob, press brew + steam buttons, and dispense the whole tank through the steam wand. Stop dispensing and close the knob.",
    },
    {
      title: "Rinse tank through the filter holder",
      detail:
        "Fill the tank with fresh water. Insert the filter holder into the brew unit and lock it. Place a container under the filter holder, press the coffee button, and dispense the whole tank. Remove and rinse the filter holder.",
    },
    {
      title: "Complete four rinse tanks total",
      detail:
        "Repeat the fresh-water rinse sequence (steam-wand tank + brew-unit tank) until you have run a total of 4 tanks of fresh water. The descaling cycle is then complete.",
    },
    {
      title: "Ready for coffee",
      detail:
        "Refill the water tank with fresh water. If needed, load the circuit as described in Loading the Circuit. Mark descaling complete in this app so the next 2-month reminder is set.",
    },
  ],
  aftercare: [
    "Do not brew for drinking until all rinse tanks are finished.",
    "If taste seems off, run one extra clean-water flush through group and wand.",
    "Keep using purified or bottled water for better flavour — descaling is still required.",
  ],
};
