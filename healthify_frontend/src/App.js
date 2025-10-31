import './App.css';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import { Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Habits from './pages/Habits';
import Mindfulness from './pages/Mindfulness';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Root application shell using TopBar and BottomNav with central routed content area.
   * Routes:
   * - /              -> Dashboard
   * - /workouts      -> Workouts
   * - /nutrition     -> Nutrition
   * - /habits        -> Habits
   * - /mindfulness   -> Mindfulness
   * - /profile       -> Profile
   * - *              -> NotFound (404)
   */
  return (
    <div className="App retro-scanline">
      <TopBar />

      <main
        id="main-content"
        role="main"
        className="container"
        style={{ paddingBottom: 76, paddingTop: 16 }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/mindfulness" element={<Mindfulness />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
