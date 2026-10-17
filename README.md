# Star Wars Planet Explorer — Question 01

An interactive, high-fidelity galactic exploration application built for the **Software Engineer Assessment (Question 01)** using **React 19, TypeScript, Vanilla CSS (Custom Design System), and Framer Motion**.

---

## 🌟 Live Features & Requirements Coverage

### 1. Planet List Page
- **Mandatory Attributes Displayed:**
  - **Name:** Prominent, formatted title with sector ID badge.
  - **Diameter:** Formatted with commas and units (e.g., `10,465 km`, or "Unknown").
  - **Terrain:** Biome badges/chips (e.g., `desert`, `mountains`, `grasslands`).
  - **Population:** Formatted with standard comma notation and compact summary (e.g., `200,000` / `200K`, or "Uninhabited").
- **Mini Celestial Circle Preview:** Real-time proportional visualizer on every card reflecting relative planet diameter and biome surface color.

### 2. Required Core Capabilities
- **Pagination without full-page reload:** Fluid client-side pagination with numbered buttons, next/previous controls, first/last jumps, and active page glow.
- **Search by Planet Name:** Live search with 350ms debouncing, automatic page reset to page 1, clear button (`X`), and keyboard shortcut (`/` or `Ctrl+K`).
- **Planet Details Page / Dossier:** Interactive dossier displaying:
  - **Name**
  - **Diameter**
  - **Terrain**
  - **Climate**
  - **Population**
  - **Gravity**
  - *Extended context:* Rotational cycle (day length), Orbital cycle (year length), Surface water percentage, Films appearances count, and Cataloged resident figures.
  - *Navigation:* "Back to Planet Archive" button with keyboard `Escape` support that returns to the list while preserving page, search, and sort state.
- **Clear Application States:**
  - **Loading State:** Holographic shimmering skeleton grid matching card dimensions.
  - **No-Results State:** Themed empty state hologram with suggested prominent star systems (`Tatooine`, `Hoth`, `Dagobah`, `Endor`, `Coruscant`, `Naboo`) and a 1-click filter reset.
  - **Error State:** "Subspace Transmission Failure" diagnostic banner with error explanation and a **"Re-establish Uplink & Retry"** button.

### 3. Bonus Optional Features (Fully Implemented)
- **Diameter Sorting:**
  - Ascending (`Low → High ↑`)
  - Descending (`High → Low ↓`)
  - Default Galactic Archive order
  - Intelligent handling for unknown/unmeasured diameters (placed at the bottom).
- **Interactive Scalable Planet Size Visualizer:**
  - Dynamic SVG / Canvas circle scaling dynamically with true astrophysics proportionality.
  - **Celestial Reference Comparison Mode:** Side-by-side comparative scale against standard astronomical bodies:
    - **Earth** (`12,742 km`)
    - **Jupiter** (`139,820 km`)
    - **The Moon** (`3,474 km`)
    - **Death Star I** (`120 km`)
  - **Scale Multiplier Slider:** Real-time zoom slider (0.5x to 1.5x) to examine celestial detail.
  - **Biome Atmospheric Glow:** Radial shaders and atmospheric halos dynamically adapting to terrain and climate (Arid amber, Glacial cyan, Gas Giant violet, Molten crimson, Forest emerald, Aquatic azure).

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript (Strict types, no `any`)
- **Build Tool:** Vite 8
- **Motion & Physics:** `framer-motion`
- **Iconography:** `lucide-react`
- **Styling:** Custom Vanilla CSS Design System (`src/index.css`) featuring:
  - Star Wars Holonet HUD dark theme (`#060913`, `#0b1120`)
  - Neon Hyperdrive accents (`#00e5ff`, `#f59e0b`, `#ef4444`)
  - Frosted glassmorphism (`backdrop-filter: blur(16px)`)
  - Google Fonts (`Space Grotesk`, `Outfit`, `JetBrains Mono`)
- **Data Layer:** `fetch` with in-memory LRU caching, request deduplication, and automatic mirror fallback.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development
```bash
# Navigate to the project directory
cd "Rightmo Question 1"

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```

The application will be accessible at:
```
http://localhost:5173/
```

### Production Build & Type Check
```bash
# Verify TypeScript types and compile production bundle
npm run build
```

---

## 📂 Project Architecture

```
Rightmo Question 1/
├── src/
│   ├── components/
│   │   ├── Header.tsx             # Galactic HUD header with status beacon
│   │   ├── SearchBar.tsx          # Debounced search input with hotkey "/"
│   │   ├── SortBar.tsx            # Diameter sorting controls
│   │   ├── PlanetCard.tsx         # Planet card with telemetry & mini visualizer
│   │   ├── Pagination.tsx         # Accessible client-side paginator
│   │   ├── PlanetDetailModal.tsx  # Planet details dossier with back action
│   │   ├── PlanetVisualizer.tsx   # Scalable circle & celestial comparison engine
│   │   ├── LoadingSkeleton.tsx    # Holographic shimmer loading cards
│   │   ├── EmptyState.tsx         # Unmatched search state with suggestions
│   │   └── ErrorState.tsx         # Network error banner with retry
│   ├── hooks/
│   │   ├── useDebounce.ts         # Input debouncing hook
│   │   └── usePlanets.ts          # SWAPI fetch, pagination, sorting & caching
│   ├── services/
│   │   └── swapiService.ts        # SWAPI API client, normalization & memory cache
│   ├── types/
│   │   └── planet.ts              # Strongly-typed SWAPI & Planet interfaces
│   ├── utils/
│   │   ├── formatters.ts          # Number, diameter, population formatters
│   │   └── planetTheme.ts         # Biome gradients, themes & reference bodies
│   ├── index.css                  # Custom Vanilla CSS Design System
│   ├── App.tsx                    # Root orchestrator & URL state sync
│   └── main.tsx                   # React entry point
├── index.html                     # HTML5 shell with Google Fonts & SEO meta
├── package.json                   # Dependencies & scripts
└── tsconfig.json                  # TypeScript configuration
```
