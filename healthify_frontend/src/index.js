import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Router will be added in subsequent steps (react-router-dom v6)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
