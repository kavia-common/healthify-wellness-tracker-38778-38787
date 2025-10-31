import { render, screen, within } from '@testing-library/react';
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
    expect(await screen.findByRole('heading', { name: /dashboard/i, level: 2 })).toBeInTheDocument();

    // Quick stats card and labels (scope within the card to avoid matching navigation labels)
    const quickStatsTitle = screen.getByText(/quick stats/i);
    const quickStatsCard = quickStatsTitle.closest('section');
    expect(quickStatsCard).toBeInTheDocument();
    const qs = within(quickStatsCard);
    expect(qs.getByText(/workouts/i)).toBeInTheDocument();
    expect(qs.getByText(/calories/i)).toBeInTheDocument();
    expect(qs.getByText(/habits/i)).toBeInTheDocument();
    expect(qs.getByText(/mindfulness/i)).toBeInTheDocument();

    // Expect four list items for stats
    const statItems = qs.getAllByRole('listitem');
    expect(statItems.length).toBe(4);

    // With mocked empty data, counts should be zeros; allow >=4 to avoid fragility
    const zeros = qs.getAllByText(/^0$/);
    expect(zeros.length).toBeGreaterThanOrEqual(4);

    // Basic placeholder/learn link remains present
    expect(screen.getByText(/placeholder content/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn react/i })).toBeInTheDocument();

    // Ensure the loading and error states are not visible after load completes
    // (Not asserting loading presence to avoid timing flakes)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
