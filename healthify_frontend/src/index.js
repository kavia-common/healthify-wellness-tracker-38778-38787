import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Router integrated into App; this file remains the entry point.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
