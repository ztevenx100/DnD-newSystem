import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'virtual:uno.css'
import './fonts.css'  // Import the fonts
import './index.css'
import './shared/styles/text-truncate.css'  // Utilidades para truncado de texto

// Lazy database connection testing - only when needed
import { lazyDbTester } from './database/utils/lazyDbConnectionTest';

// First, render the app immediately for optimal startup performance
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Optionally test database connection in the background after app loads
// This won't block the UI and the test will only run once when first needed
if (import.meta.env.DEV) {
  // Only in development mode, test connection after a longer delay
  setTimeout(() => {
    lazyDbTester.getConnectionStatus().then((status) => {
      console.log('🔗 Background DB check:', status ? 'Connected' : 'Disconnected');
    }).catch((error) => {
      console.error('🔗 Background DB check failed:', error);
    });
  }, 2000); // 2 second delay to ensure smooth startup
}
