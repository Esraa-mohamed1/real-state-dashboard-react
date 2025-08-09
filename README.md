# Real Estate Financial Management Dashboard

A modern, responsive frontend for a Financial Management Dashboard tailored for Crystal Power Investments and similar real estate contexts. Built with React (functional components), Material-UI (MUI), React Router, Axios, Recharts, React Hook Form, Yup, MUI X DataGrid, Notistack, SweetAlert2, and Day.js.

## Features
- JWT-based admin authentication (login, protected routes, logout)
- Dashboard with financial summaries and charts
- Payments module: CRUD, total paid, validations
- Debts module: CRUD, category pie chart, summary cards
- Properties module: CRUD, KPIs (rented/vacant, income, portfolio)
- Global theme with light/dark mode and real-estate palette (navy/teal/gold)
- Responsive layout (top bar + sidebar)
- Notifications (Notistack) + modal validations (SweetAlert2)

## Tech Stack (Libraries)
- React 18
- React Router DOM 6 (routing, navigation, protected routes)
- MUI (Material-UI) + MUI X DataGrid (UI components and tables)
- Recharts (Area/Pie charts)
- Axios (HTTP client) with interceptors (attach JWT, handle 401)
- React Hook Form + Yup (forms & validation)
- @mui/x-date-pickers + Day.js (datepicker)
- Notistack (snackbars) and SweetAlert2 (validation/error modals)

## Project Structure (key folders)
```
src/
  components/
    cards/SummaryCard.js            # Summary KPI card styling
    charts/AreaChartCard.js         # Area chart styling
    charts/PieChartCard.js          # Pie chart styling
    forms/*                         # RHF + MUI field wrappers
    ConfirmDialog.js
    Layout.js                       # Topbar + Drawer (sidebar) styles
    ProtectedRoute.js
  context/ThemeContext.js           # Light/Dark provider & toggle
  pages/
    Dashboard.js                    # Overview cards + payments chart
    Payments/
      List.jsx                      # DataGrid table + dialogs + styles
      Form.jsx                      # Form + RHF validation
    Debts/
      List.jsx                      # DataGrid + summary + pie chart
      Form.jsx
    Properties/
      List.jsx, Form.jsx, UnitsEditor.jsx
  services/                         # API clients (Axios)
  utils/formatters.js               # currency/date formatting
  theme.js                          # MUI theme (colors, typography, shape)
```

## API Base URL
Create `.env` in the project root:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## How to Run (Development)
```
npm install
npm start
```
- App runs at `http://localhost:3000`.
- Backend base URL is read from `REACT_APP_API_BASE_URL`.

## How to Build & Serve (Production)
```
npm run build
# Option A: quick static serve
npx serve -s build -l 3001
# Option B: Node/Express (SPA fallback)
npm run serve
```

## Authentication Flow
- POST `/api/auth/login` with `{ email, password }` → `{ token, user }`
- Token saved in `localStorage` (`auth`)
- Axios interceptor attaches `Authorization: Bearer <token>`
- 401 responses clear auth and redirect to `/login`

## Dashboard Functions
- Fetch summary: GET `/api/dashboard/overview` → `{ totalPayments, outstandingDebt, netPosition }`
- Build monthly payments area chart from GET `/api/payments` (aggregate amounts by month)

## Payments Module
- Endpoints:
  - GET `/api/payments`, GET `/api/payments/summary`, POST/PUT/DELETE `/api/payments/:id`
- UI:
  - `src/pages/Payments/List.jsx` DataGrid shows `payer`, `amount`, `date`, `description`
  - `src/pages/Payments/Form.jsx` Add/Edit with validation
- Data handling:
  - Before create/update, amount is cast to `Number`, date normalized to ISO
- Styling touch points:
  - Table container and DataGrid `sx` in `List.jsx`
  - Dialog Paper styling in `List.jsx`
  - Field look & feel in `Form.jsx` and `components/forms/*`

## Debts Module
- Endpoints:
  - GET `/api/debts`, `/api/debts/breakdown`, `/api/debts/summary`, POST/PUT/DELETE `/api/debts/:id`
- UI:
  - `src/pages/Debts/List.jsx` DataGrid, summary cards, breakdown pie chart (now on full-width row)
  - `src/pages/Debts/Form.jsx` Add/Edit with validation
- Data handling:
  - Before create/update, amount is cast to `Number`, date normalized to ISO
- Styling touch points:
  - DataGrid `sx` in `List.jsx`
  - Pie chart look in `components/charts/PieChartCard.js`
  - Dialog Paper styling in `List.jsx`

## Properties Module
- Endpoints:
  - GET `/api/properties`, `/api/properties/rented-vacant`, `/api/properties/income-portfolio`, CRUD
- UI:
  - `src/pages/Properties/List.jsx` table with computed columns (units, rented, monthly income)
  - KPI cards via `SummaryCard.js`

## Styling & Theming
- Global theme colors/typography: `src/theme.js`
- Theme provider and dark-mode toggle: `src/context/ThemeContext.js`
- Layout (AppBar/Drawer/Sidebar): `src/components/Layout.js`
- Cards and charts visuals:
  - `src/components/cards/SummaryCard.js`
  - `src/components/charts/AreaChartCard.js`
  - `src/components/charts/PieChartCard.js`
- Forms: `src/components/forms/*` wrappers

### Where to Edit Styles for Payments & Debts
- Payments
  - `src/pages/Payments/List.jsx` → DataGrid `sx`, Paper container, header button styles
  - `src/pages/Payments/Form.jsx` → input components, spacing, dialog padding
- Debts
  - `src/pages/Debts/List.jsx` → DataGrid `sx`, Summary cards, chart placement
  - `src/components/charts/PieChartCard.js` → pie chart size/colors/tooltip
- Shared
  - `src/components/cards/SummaryCard.js` → KPI card gradients, radius, shadows
  - `src/components/charts/AreaChartCard.js` → area chart height, axes, tooltip
  - `src/components/Layout.js` → sidebar scroll, logo header, nav highlights
  - `src/theme.js` → global palette, typography, component overrides

## Validations & UX
- React Hook Form + Yup for validation schemas per form
- SweetAlert2 surfaces validation errors (modal list) and auth failures
- Notistack snackbars for CRUD success/error messages

## Testing / QA (manual)
- Auth: attempt protected route without login → redirected to `/login`
- Payments:
  - Create with valid amount/date → appears in table with formatted amount/date; total updates
  - Edit and delete → snackbar confirms; table refreshes
- Debts:
  - Create/update/delete; verify pie chart and summary cards update after reload
- Dashboard:
  - Overview numbers load; area chart shows monthly sums (based on `/api/payments`)
- Responsiveness:
  - Resize to mobile width; drawer toggles; list scrolls within sidebar

## Common Issues
- MIME errors in production:
  - `package.json` has `"homepage": "."`
  - Use provided `server.js` for SPA fallback or `serve -s build`
- DataGrid id:
  - We use `getRowId={(row) => row.id || row._id}` for MongoDB `_id`
- Amount shows `-`:
  - Ensure backend sends numeric `amount`; client coerces numeric strings

## Scripts
- `npm start` – development server
- `npm run build` – produce production build
- `npm run serve` – serve `build` using Express with SPA fallback

## License
MIT (or your preferred license) 