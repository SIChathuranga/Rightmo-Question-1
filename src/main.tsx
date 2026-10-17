import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global Galactic Design System styles
import './index.css';
// Root application orchestrator
import App from './App.tsx';

/**
 * Entry point: Mounts the React application in StrictMode into the DOM root element.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
