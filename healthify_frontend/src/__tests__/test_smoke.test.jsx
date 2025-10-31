import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AppStateProvider } from '../context/AppStateContext';
import App from '../App';

// Mock services to avoid any network calls and stabilize tests
jest.mock('../services/workoutsService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../services/nutritionService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../services/habitsService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../services/mindfulnessService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

function renderApp() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('App smoke tests', () => {
  test('renders Dashboard by default', async () => {
    renderApp();

    // TopBar and Dashboard content both include "Dashboard" as headings; ensure at least one is present
    const heading = await screen.findByRole('heading', { name: /dashboard/i, level: 2 });
    expect(heading).toBeInTheDocument();

    // Bottom navigation should be present
    const bottomNav = screen.getByRole('navigation', { name: /bottom navigation/i });
    expect(bottomNav).toBeInTheDocument();
  });

  test('bottom nav routes to Workouts', async () => {
    renderApp();

    const workoutsLink = screen.getByRole('link', { name: /workouts/i });
    fireEvent.click(workoutsLink);

    const workoutsHeading = await screen.findByRole('heading', { name: /workouts/i, level: 2 });
    expect(workoutsHeading).toBeInTheDocument();
  });

  test('bottom nav routes to Nutrition', async () => {
    renderApp();

    const nutritionLink = screen.getByRole('link', { name: /nutrition/i });
    fireEvent.click(nutritionLink);

    const nutritionHeading = await screen.findByRole('heading', { name: /nutrition/i, level: 2 });
    expect(nutritionHeading).toBeInTheDocument();
  });
});
