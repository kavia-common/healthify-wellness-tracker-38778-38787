import React from 'react';
import RetroCard from '../components/RetroCard';

/**
 * PUBLIC_INTERFACE
 * Insights
 * Placeholder for AI-driven recommendations and trends; basic empty state.
 */
export default function Insights() {
  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Insights</h1>
        <p className="retro-subtitle">AI-driven recommendations and trends</p>
      </header>

      <RetroCard title="Coming Soon" subtitle="Insights will appear here." elevated>
        <p className="retro-subtitle">
          We are analyzing your data to bring smart tips and patterns. Check back later!
        </p>
      </RetroCard>
    </div>
  );
}
