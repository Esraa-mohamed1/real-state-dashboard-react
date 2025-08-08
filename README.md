# Real Estate Financial Management Dashboard (Crystal Power Investments)

A modern, responsive frontend for a Financial Management Dashboard tailored for Crystal Power Investments. Built with React.js (functional components & hooks), Material-UI (MUI), React Router, Axios, and Recharts.

This project simulates the management of real estate and business finances and is intended to evaluate MERN skills, problem solving, git workflow, and deployment familiarity.

## Tech Stack
- Frontend: React.js, React Router, MUI, Recharts, Axios
- Backend: Node.js + Express.js (separate service)
- Database: MongoDB (in backend)
- Version Control: Git + GitHub (mandatory)
- Deployment: Railway, Render, Vercel, etc. (optional, plus)

## Requirements Coverage (Frontend)
- Authentication: Admin login (email/password), JWT-based
- Dashboard Overview: total payments received, outstanding debt, net position + charts
- Payments: create/update/delete, list, summary (total paid)
- Debts: CRUD, breakdown by category, pending vs settled
- Properties (Sultan Kayello): CRUD, rented vs vacant, monthly income, portfolio value
- Non-functional: clean and responsive UI, organized structure, best practices

## API Contract (Backend to integrate with)
Base URL
- Local: `http://localhost:5000`
- Headers: `Content-Type: application/json`, `Authorization: Bearer <JWT>` for protected routes

Auth
- POST `/api/auth/login` → `{ token, user }`

Dashboard
- GET `/api/dashboard/overview` → `{ totalPayments, outstandingDebt, netPosition }`

Payments
- POST `/api/payments`, GET `/api/payments`, GET `/api/payments/summary`, GET `/api/payments/:id`, PUT `/api/payments/:id`, DELETE `/api/payments/:id`

Debts
- POST `/api/debts`, GET `/api/debts`, GET `/api/debts/breakdown`, GET `/api/debts/summary`, GET `/api/debts/:id`, PUT `/api/debts/:id`, DELETE `/api/debts/:id`

Properties
- POST `/api/properties`, GET `/api/properties`, GET `/api/properties/rented-vacant`, GET `/api/properties/income-portfolio`, GET `/api/properties/:id`, PUT `/api/properties/:id`, DELETE `/api/properties/:id`

## Folder Structure
```
real-state-frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ThemeProvider.js
│   ├── hooks/
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Payments.js
│   │   ├── Debts.js
│   │   ├── Properties.js
│   │   ├── Login.js
│   │   └── NotFound.js
│   ├── services/
│   ├── theme/
│   │   └── theme.js
│   ├── utils/
│   ├── App.js
│   └── index.js
├── build/               # created by `npm run build`
├── server.js            # optional: Express production server
├── package.json
└── README.md
```

## Prerequisites
- Node.js 18+ and npm

## Environment Variables
Create a `.env` file in the project root to configure the API base URL and other settings used by the frontend:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```
Use this in Axios (service layer) to call the backend.

## How to Run (Development)
For local development with hot reload:
```
npm install
npm start
```
This starts the React dev server on port 3000.

> If you see the dev server URL prefixed with a repository path (e.g. `/user/repo`), it’s typically due to the `homepage` field. In this project, `homepage` is set to `"."` to avoid such issues in dev and prod.

## How to Build and Serve (Production)
1) Build the optimized static files:
```
npm run build
```
2) Serve the build (choose ONE of the following):

Option A — Static server (no Node code needed):
```
npx serve -s build -l 3001
```
Visit: `http://localhost:3001`

Option B — Using the included Express server (Node):
```
npm run serve
```
This runs `server.js` (Express) on port 3001 and serves the `build/` directory with correct SPA fallback.

### Important: Avoid MIME type errors in production
Errors like:
- "MIME type ('text/html') is not a valid JavaScript MIME type"
- "Uncaught SyntaxError: expected expression, got '<'"

These happen when JavaScript files are requested but the server returns `index.html` (HTML) instead — often due to incorrect asset paths. To fix:
- Ensure `package.json` has `"homepage": "."` so Create React App emits relative asset paths
- Serve the `build/` directory correctly
- Configure SPA fallback so unknown routes return `index.html`

This project already includes these fixes.

## Scripts
- `npm start` → React dev server
- `npm run build` → Build production assets into `build/`
- `npm run serve` → Start Express server to serve `build/` on port 3001

## Git Workflow (recommended)
Push each step/task with clear commits so reviewers can follow your progress:
```
git checkout -b feature/scaffold
# make changes
git add .
git commit -m "chore: scaffold project, theme, router"
git push -u origin feature/scaffold

# open a PR or merge, then continue with next small branch
```

## Deployment (optional but a plus)
- Static hosting: Netlify, Vercel (import repo, set build command `npm run build` and output `build/`)
- Node server hosting: Railway/Render (run `npm run build` then `npm run serve`)
- Ensure environment variables are configured on the hosting platform

## Next Steps (Design & Implementation Plan)
- Implement Axios service with `REACT_APP_API_BASE_URL` and auth interceptor (adds `Authorization: Bearer <token>`) 
- Build Authentication pages and protected routes
- Implement Dashboard cards and charts (Recharts)
- Implement Payments, Debts, Properties modules with forms + validation (MUI)
- Apply responsive layouts and polish

## Contact & Submission
- Push the full source code to a public GitHub repository
- Send the repo (and deployed link if available) to:
  - mmaisara@crystalpowerinvestment.com
  - mustafacrystalpower@gmail.com
- Questions: 0109 856 4683, 0106 650 5665
- Complete within 5 days (deadline as given) 