# Healthify Frontend (React)

This is the web frontend for Healthify, a mobile‑first React application that helps users track workouts, nutrition, and habits, with an Ocean Professional retro theme. The app integrates with REST APIs for authentication, user profile, tracking data, and notifications. It includes a protected routing model, a themed component library, and a small utility layer for environment handling, healthchecks, and API access.

## Quick Start

This project uses Create React App scripts and runs on Node 18+.

- Install dependencies:
  - npm install
- Start the development server:
  - npm start
  - The app runs at http://localhost:3000 by default.
- Run tests (watch mode):
  - npm test
- Run tests in CI mode:
  - npm run test:ci
- Lint and format:
  - npm run lint
  - npm run format
- Build for production:
  - npm run build
  - The build uses REACT_APP_ENABLE_SOURCE_MAPS to control source map generation.

## Environment Configuration

All configuration is provided via REACT_APP_* variables (Create React App). The app normalizes values in src/utils/env.js and exposes them through getEnv().

Supported variables:

- REACT_APP_API_BASE: Base URL for API requests. If not set, the app falls back to REACT_APP_BACKEND_URL, or FRONTEND_URL + /api, or /api as a final default.
- REACT_APP_BACKEND_URL: Alternative way to specify backend root. Used only if API base not provided.
- REACT_APP_FRONTEND_URL: Public URL of the frontend; used for API base fallback resolution.
- REACT_APP_WS_URL: Optional WebSocket base URL. Exposed via WS_ENDPOINTS.BASE.
- REACT_APP_NODE_ENV: Optional explicit node env label; otherwise process.env.NODE_ENV is used.
- REACT_APP_NEXT_TELEMETRY_DISABLED: Boolean. Disables Next telemetry if present (kept for consistency).
- REACT_APP_ENABLE_SOURCE_MAPS: Boolean. Controls source map generation during build (default true).
- REACT_APP_PORT: Number. Development server port hint (default 3000).
- REACT_APP_TRUST_PROXY: Boolean. Passed through to config for environments that need it.
- REACT_APP_LOG_LEVEL: String. One of info, warn, error, debug, etc. Default info.
- REACT_APP_HEALTHCHECK_PATH: Path or absolute URL to hit for connectivity healthcheck (default /healthz). If relative, it is prefixed by API base.
- REACT_APP_FEATURE_FLAGS: JSON string or comma‑separated flags used to toggle features. Example: {"newUI":true,"beta":false} or newUI,beta.
- REACT_APP_EXPERIMENTS_ENABLED: Boolean. Enables the experiments meta‑flag.

How configuration is used:

- src/utils/env.js parses and normalizes variables, including booleans and numeric types, and derives API_BASE when needed.
- src/utils/constants.js uses getEnv() to construct API_ENDPOINTS for all REST calls and WS_ENDPOINTS for optional WebSockets.
- src/utils/featureFlags.js parses REACT_APP_FEATURE_FLAGS and exposes simple helpers.
- src/utils/healthcheck.js uses REACT_APP_HEALTHCHECK_PATH and API_BASE to build the healthcheck URL.
- src/services/httpClient.js uses apiPath() from constants to prefix relative requests with API_BASE.

Example .env.example:

Create a .env file in the repository root of this frontend (same directory as package.json) with the following as a starting point.

REACT_APP_API_BASE=https://api.example.com
REACT_APP_BACKEND_URL=
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_WS_URL=
REACT_APP_NODE_ENV=development
REACT_APP_NEXT_TELEMETRY_DISABLED=true
REACT_APP_ENABLE_SOURCE_MAPS=true
REACT_APP_PORT=3000
REACT_APP_TRUST_PROXY=false
REACT_APP_LOG_LEVEL=info
REACT_APP_HEALTHCHECK_PATH=/healthz
REACT_APP_FEATURE_FLAGS={"newUI":true}
REACT_APP_EXPERIMENTS_ENABLED=false

Note: Only variables prefixed with REACT_APP_ are available at runtime in the React app.

## Routing and Protected Routes

Routing is defined in src/routes/Router.js using react-router-dom v6.

- Public route:
  - /login
- Protected routes:
  - /dashboard, /workouts, /nutrition, /habits, /insights, /profile
- Root handling:
  - / redirects to /dashboard if authenticated, otherwise to /login
- Fallback:
  - Any unknown route redirects to /

Protected routes are wrapped by the PrivateRoute component. PrivateRoute reads isAuthenticated from the AppContext (src/state/AppProvider.js via src/state/useAuth.js). If the user is not authenticated, it redirects to /login and preserves the target location in state.from. This enables Login to navigate back to the intended page after successful authentication.

Navigation components:
- Top bar (src/components/RetroNavbar.js) and bottom navigation (src/components/BottomNav.js) provide app‑wide navigation in a mobile‑first layout.

## API Integration and Healthcheck

All network access goes through src/services/httpClient.js, which provides a thin wrapper over fetch with:

- Base URL prefixing via apiPath() and getEnv().API_BASE
- JSON content negotiation by default
- Authorization header injection from localStorage token (healthify_auth_token)
- Credential inclusion (credentials: 'include') for cookie‑based flows
- Automatic 401 handling that clears the token and redirects to /login?from=<current>
- Network error retry with backoff for TypeError errors

The REST endpoints are centralized in src/utils/constants.js under API_ENDPOINTS. Current endpoints used by the app:

- Auth:
  - POST /auth/login
  - POST /auth/logout
  - GET /me
- Workouts:
  - GET /workouts
  - POST /workouts
- Nutrition:
  - GET /meals
  - POST /meals
- Habits:
  - GET /habits
  - PUT /habits/:id
- Notifications:
  - GET /notifications

Pages use these APIs via small service wrappers located in src/services/api/*.js. For example, Dashboard loads profile, recent workouts, meals, and habits in parallel.

Healthcheck:

At startup, App runs runHealthcheck() from src/utils/healthcheck.js. The function uses REACT_APP_HEALTHCHECK_PATH to determine the URL. If the path is relative (e.g. /healthz), it’s prefixed with API base; if it’s an absolute URL, it’s used as‑is. On failure, a Toast notification is shown indicating connectivity issues.

## Retro Theme Overview

The app ships a lightweight retro theme tuned to the “Ocean Professional” palette.

- Design tokens live in src/theme/tokens.css. They define color palette, elevations, spacing, radius, and font stack, plus semantic tokens such as --bg-primary and --text-primary.
- Theme utilities and components live in src/theme/retro.css. It provides styles for:
  - retro-card and retro-card--elevated
  - retro-button and variants (secondary, danger)
  - retro-input, retro-title, retro-subtitle
  - retro-container, retro-divider, retro-badge, retro-link
- Light/dark mode is toggled by setting data-theme="dark" on the root element. The App component provides a simple theme toggle that switches this attribute and updates tokens accordingly.

Using components and utilities:

- For a primary action, use the RetroButton component, which applies retro-button styles and accepts variant and size.
- For content sections, wrap with RetroCard and optionally pass elevated to increase depth.
- For forms, use the retro-input class on form controls to match theme aesthetics.
- Use retro-container to apply padding and centered content widths across pages.

## Testing

The project includes unit tests for critical infrastructure:

- HTTP client tests (src/__tests__/httpClient.test.js) cover:
  - Status classification helper
  - Base URL joining from environment
  - Authorization header injection
  - 401 handling and redirect behavior
  - Retry logic on network errors
  - Handling of absolute URLs
- Routing tests (src/__tests__/routing.test.js) cover:
  - PrivateRoute behavior for authenticated and unauthenticated states
  - Redirects to /login for protected routes

Run tests with npm test for watch mode or npm run test:ci for CI. The test environment is configured by src/setupTests.js and includes jsdom, a default fetch mock, and small polyfills.

## Project Structure

The following summarizes the directory structure and responsibilities.

- src/index.js and src/App.js: Application entry and shell, including Navbar, BottomNav, Router, theme toggle, and healthcheck toast.
- src/routes/Router.js: React Router routes, lazy loading, and PrivateRoute guard.
- src/state/AppProvider.js and src/state/useAuth.js: Application context providing authentication, user info, and feature flags.
- src/services/httpClient.js: Fetch wrapper with retries, auth, and error formatting.
- src/services/api/*: Small wrappers per resource (auth, user, tracking, notifications).
- src/utils/env.js: Environment variable normalization and access.
- src/utils/constants.js: API endpoint builders and payload shape documentation.
- src/utils/featureFlags.js: Feature flag parsing and helpers.
- src/utils/healthcheck.js: Connectivity healthcheck logic.
- src/components/*: Reusable UI components (Navbar, BottomNav, Card, Button, Loader, Toast).
- src/pages/*: Page components (Dashboard, Workouts, Nutrition, Habits, Insights, Profile).
- src/theme/*: Tokens and retro stylesheet.

## Contribution Notes

When contributing to the frontend:

- Keep documentation and code in sync. If you add a new environment variable or endpoint, update this README and src/utils/env.js and/or src/utils/constants.js.
- Prefer small, focused service wrappers in src/services/api/ rather than calling httpClient directly from pages.
- For new routes, use lazy loading and consider if they should be protected by PrivateRoute.
- Follow the theme tokens and component classes provided in src/theme to maintain consistency. If adding new tokens, extend tokens.css and document their purpose.
- Write tests for routing changes, http client behavior, and any new critical utilities. Use test:ci locally before opening a PR.
- Run npm run lint and npm run format before committing to maintain consistency.

## Healthcheck and Local API Tips

- If your backend runs at a different host/port during development, set REACT_APP_API_BASE to that origin, e.g. http://localhost:8080.
- Ensure CORS is configured accordingly if using cookies or cross‑origin requests (the client sends credentials: 'include').
- You can override the healthcheck path by setting REACT_APP_HEALTHCHECK_PATH; use an absolute URL to bypass API base prefixing.

