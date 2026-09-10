import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

function renderApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderApp, { once: true });
    }
    return;
  }

  // Clear fallback loader if present
  const loader = document.getElementById('iois-app-loader');
  if (loader && loader.parentElement === rootElement) {
    rootElement.removeChild(loader);
  }

  try {
    (window as any).__IOIS_LOADED__ = true;
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err) {
    console.error("Critical mount error:", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp, { once: true });
} else {
  renderApp();
}
