import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure this line is present to import Tailwind CSS
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
