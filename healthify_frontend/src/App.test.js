import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Healthify header', () => {
  render(<App />);
  expect(screen.getByText(/Healthify/i)).toBeInTheDocument();
});
