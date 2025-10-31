import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppStateProvider } from '../../context/AppStateContext';
import Dashboard from '../Dashboard';

// Mock services to guarantee deterministic empty states (no network)
jest.mock('../../services/workoutsService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../../services/nutritionService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../../services/habitsService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../../services/mindfulnessService', () => ({
  __esModule: true,
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

function renderDashboard() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AppStateProvider>
          <Dashboard />
        </AppStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('Dashboard', () => {
  test('renders key cards and empty states', async () => {
    renderDashboard();

    // Main hero card
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();

    // Quick stats card and labels
    expect(screen.getByText(/quick stats/i)).toBeInTheDocument();
    expect(screen.getByText(/workouts/i)).toBeInTheDocument();
    expect(screen.getByText(/calories/i)).toBeInTheDocument();
    expect(screen.getByText(/habits/i)).toBeInTheDocument();
    expect(screen.getByText(/mindfulness/i)).toBeInTheDocument();

    // Expect four list items for stats
    const statItems = screen.getAllByRole('listitem');
    expect(statItems.length).toBe(4);

    // With mocked empty data, counts should be zeros; allow >=4 to avoid fragility
    const zeros = screen.getAllByText(/^0$/);
    expect(zeros.length).toBeGreaterThanOrEqual(4);

    // Basic placeholder/learn link remains present
    expect(screen.getByText(/placeholder content/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn react/i })).toBeInTheDocument();

    // Ensure the loading and error states are not visible after load completes
    // (Not asserting loading presence to avoid timing flakes)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
