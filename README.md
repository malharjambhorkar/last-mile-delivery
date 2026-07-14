# Fleetly - Last Mile Delivery

Fleetly is a delivery app for running last-mile delivery operations. It combines a high-conversion marketing site, interactive route optimization, customer shipment tracking, authentication flows, and an operations dashboard in one responsive application.

## Live deployment

Explore the deployed application: [last-mile-delivery-kappa.vercel.app](https://last-mile-delivery-kappa.vercel.app/)

## Screenshots

### Homepage hero

The light-themed landing experience introduces Fleetly and gives visitors immediate access to the operations console or customer tracking.

<img width="1837" alt="Fleetly homepage hero with delivery app visual" src="https://github.com/user-attachments/assets/3e907685-652b-4976-8226-3f3869393cc4" />

### Live network metrics and platform overview

Live delivery metrics, trusted-operations proof points, and a clear transition into the core platform features.

<img width="1725" alt="Fleetly live network metrics and platform overview" src="https://github.com/user-attachments/assets/6fce7a54-57c5-4763-bf64-3384145c045f" />

### Interactive Routing AI

An interactive route planner accepts pickup and drop-off locations, then presents route timing, distance, stops, and optimization results.

<img width="1477" alt="Fleetly interactive Routing AI demo" src="https://github.com/user-attachments/assets/3e930da2-6eed-4c15-a85a-1f8237d45765" />

### Customer delivery tracking

Customers can search an order, see a live route, check their delivery window, and view driver information without an app download.

<img width="1600" alt="Fleetly customer delivery tracking experience" src="https://github.com/user-attachments/assets/f0853c0f-5dcc-43ff-805a-e23debcc7721" />

### Flexible pricing

Starter, Growth, and Enterprise plans present the product’s delivery-operations value at different fleet scales.

<img width="1347" alt="Fleetly pricing plans" src="https://github.com/user-attachments/assets/d68dcf99-ea56-4820-922c-9d75d02400ea" />

### Demo request

A simple demo request form captures the company and fleet details needed for a sales follow-up.

<img width="1302" alt="Fleetly demo request form" src="https://github.com/user-attachments/assets/7c189cf8-fa81-49bd-bb99-db506483b86c" />

### Operations dashboard

The operations console provides delivery KPIs, revenue analysis, driver availability, fleet insights, and configurable widgets.

<img width="1890" alt="Fleetly operations dashboard" src="https://github.com/user-attachments/assets/932f0f6c-42bc-4139-8d3b-7390c071e145" />

### Delivery analytics

Fuel consumption and delivery heatmaps help operations teams understand demand patterns and route performance.

<img width="1891" alt="Fleetly delivery analytics dashboard" src="https://github.com/user-attachments/assets/abd4baa0-c11f-4364-9f0a-ba57ec07f878" />

## Highlights

- Interactive AI route planner with animated route results and delivery metrics.
- Customer-facing tracking experience with live delivery status, driver detail, ETA, and animated city route map.
- Operations workspace for dashboard, orders, tracking, route optimization, fleet, and dispatch workflows.
- Delivery quote preview with B2B/B2C, prepaid/COD, zone detection, volumetric-weight billing, and configurable rate cards.
- No-login operations-console preview from the homepage, so evaluators can inspect every dashboard feature immediately.
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

Additional delivery-platform implementation notes are in [docs/api.md](docs/api.md) and [docs/system-design.md](docs/system-design.md). Copy [.env.example](.env.example) before connecting a backend.

### Folder guide

- `src/` — React entry point, product UI, mock domain data, pricing logic, and dashboard modules.
- `public/` — Static browser assets such as the delivery hero visual.
- `docs/` — API contract and system-design documentation.
- `.env.example` — Environment variable names needed when a backend and notification providers are connected.
- `dist/` — Generated production output; recreated by `npm run build` and intentionally ignored by Git.

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

Use **Try the full operations console** on the homepage to open the workspace without authentication. It includes dashboard, orders, shipment tracking, AI route optimization, fleet, dispatch, and Zones & Rate Cards. Login remains available as a separate prototype flow.

## Notes for production integration

This project is a frontend prototype. Before production deployment, connect form submissions, authentication, tracking, dispatch events, and dashboard data to your own backend/API. Replace the in-memory sample data in `src/App.jsx` with API queries and add appropriate session handling.

## License

Private project. All rights reserved.
