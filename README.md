<div align="center">


# Global Air Quality Tracker

**Real-time air quality monitoring for anywhere in the world.**

[Live Demo](https://ahossain.github.io/global-air-quality-tracker) &nbsp;·&nbsp; [Report a Bug](https://github.com/ahossain/global-air-quality-tracker/issues)

</div>

---

## What is this?

Global Air Quality Tracker is an interactive web app that shows real-time air quality data for any location on Earth. Click anywhere on the map, search for a city, or use your current location to instantly see:

- **AQI (Air Quality Index)** — US EPA scale with color-coded categories (Good → Hazardous)
- **Pollutant breakdown** — PM2.5, PM10, Ozone (O3), Nitrogen Dioxide (NO2)
- **24-hour AQI trend chart** — See how air quality has changed over the past day
- **Weather conditions** — Temperature, humidity, and wind speed (toggle °F/°C and mph/km/h)
- **Light & dark mode** — Automatically matches your system preference

No account, no API key, no cost — all data comes from free public sources.

---

## Data Sources

All data is fetched live with no API keys required.

| Source | Used For |
|--------|----------|
| [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) | PM2.5, PM10, O3, NO2, hourly AQI data |
| [Open-Meteo Weather API](https://open-meteo.com/en/docs) | Temperature, humidity, wind speed |
| [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org) | City search and reverse geocoding |
| [CARTO](https://carto.com/basemaps) | Map tiles (light and dark themes) |

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Maps:** Leaflet + react-leaflet
- **Charts:** Recharts
- **Animation:** Motion (Framer Motion)
- **Icons:** Lucide React

---

## Running Locally

**Prerequisites:** [Node.js](https://nodejs.org) (v18 or later)

```bash
# 1. Clone the repo
git clone https://github.com/ahossain/global-air-quality-tracker.git
cd global-air-quality-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. No environment variables or API keys are needed.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build static export to `./out` |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clear Next.js cache |

---

## Project Structure

```
global-air-quality-tracker/
├── app/
│   ├── globals.css          # Global styles, Tailwind, CSS variables
│   ├── layout.tsx           # Root layout and metadata
│   └── page.tsx             # App entry point
├── components/
│   ├── AirQualityApp.tsx    # Main app shell (state, layout)
│   ├── AQICard.tsx          # AQI score and pollutant grid
│   ├── Map.tsx              # Interactive Leaflet map
│   ├── MetricCards.tsx      # Weather metric cards
│   ├── SearchBar.tsx        # Debounced city search
│   └── TrendChart.tsx       # 24-hour AQI area chart
├── lib/
│   ├── api.ts               # All data fetching logic
│   └── utils.ts             # Class name utility
├── hooks/
│   └── use-mobile.ts        # Mobile breakpoint detection
└── next.config.ts           # Next.js config (static export, basePath)
```

The core data-fetching logic lives in `lib/api.ts`. AQI is calculated from PM2.5 using US EPA breakpoints. To modify what data is shown or how AQI is computed, that's the place to start.

---

## Deploying to GitHub Pages

The app is pre-configured for GitHub Pages via a GitHub Actions workflow (`.github/workflows/nextjs.yml`). Pushing to `main` will automatically build and deploy the static site.

See [`GITHUB_PAGES_DEPLOYMENT.md`](./GITHUB_PAGES_DEPLOYMENT.md) for step-by-step setup instructions.

---

## License

MIT
