# Fleetly - Last Mile Delivery

Fleetly is a delivery app for running last-mile delivery operations. It combines a high-conversion marketing site, interactive route optimization, customer shipment tracking, authentication flows, and an operations dashboard in one responsive application.

## Highlights

- Interactive AI route planner with animated route results and delivery metrics.
- Customer-facing tracking experience with live delivery status, driver detail, ETA, and animated city route map.
- Operations workspace for dashboard, orders, tracking, route optimization, fleet, and dispatch workflows.
- Light-first visual system with glass surfaces, responsive layouts, motion-safe scroll reveals, and accessible focus states.
- Fully client-side prototype data and interactions; no backend is required to explore the experience.

## Tech stack

- React
- Vite
- Recharts
- Lucide React
- CSS-in-JS within the application plus global reset styles

## Project structure

```text
fleetly-last-mile-delivery/
├── public/
│   └── delivery-hero.svg       # Homepage delivery-app visual
├── src/
│   ├── App.jsx                 # Product experience, UI flows, mock data, and styles
│   ├── main.jsx                # React application entry point
│   └── styles.css              # Global browser/reset styles
├── index.html                  # Vite document shell and page metadata
├── package.json                # Scripts and dependencies
└── README.md                   # Project guide
```

## Getting started

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal, normally `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Creates an optimized production build in `dist/`. |
| `npm run preview` | Serves the production build locally. |

## Product flows

### Marketing and conversion

- Navigation links scroll to Product, Routing AI, Customer Tracking, Pricing, and FAQ sections.
- Pricing actions open the sign-up flow or take visitors to the demo request form.
- The footer CTA opens the sign-up flow.

### Authentication

- Login, registration, password reset, OTP verification, and biometric-login UI are available.
- Every authentication screen includes **Back to home**.

### Operations console

After completing an authentication action, the app opens an operations workspace with dashboard, orders, shipment tracking, AI route optimization, fleet, and dispatch modules.

## Notes for production integration

This project is a frontend prototype. Before production deployment, connect form submissions, authentication, tracking, dispatch events, and dashboard data to your own backend/API. Replace the in-memory sample data in `src/App.jsx` with API queries and add appropriate session handling.

## License

Private project. All rights reserved.
