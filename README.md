# Gaggia Care

A Vercel-ready Next.js companion app for a **Gaggia Classic E24** (purchased August 2026), with care guidance for a **HiBREW 5G** grinder and barista accessories.

## Features

- Machine overview and daily ritual
- Maintenance schedule with calendar
- Descaling guide using Gaggia Descaler (every 2 months per AU manual)
- Bundled official Classic E24 AU manual PDF
- Cleaning habits: portafilter, group head, steam purge, exterior wipe-downs
- HiBREW 5G grinder care
- Accessories section (tamper, WDT, pitcher, and more)
- Local completion tracking in the browser
- Optional browser notification reminders
- Espresso recipe log: bean brand, grind, dose, brew time, yield, taste score, and a refineable recordings table

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

Production: [https://gaggia-care.vercel.app](https://gaggia-care.vercel.app)

GitHub: [prestiannisalvatore-maker/gaggia-care](https://github.com/prestiannisalvatore-maker/gaggia-care)

This repo is connected to the Vercel project `gaggia-care`. Pushes to `main` trigger production deployments.

No environment variables are required for the current local-storage build.

## Notes

- Progress is saved in `localStorage` on each device/browser.
- Reminder notifications require permission and work best while the site is open or recently used on that device.
- Care guidance is aligned with the bundled AU operating instructions (`public/manuals/gaggia-classic-e24-au.pdf`). Always follow the printed Gaggia Descaler bottle and the official manual for safety.
