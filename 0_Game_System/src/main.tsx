import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'virtual:uno.css'
import './fonts.css'  // Import the fonts
import './index.css'

// Test database connection on startup
import { checkDatabaseConnection } from './database/utils/dbConnectionTest';

// Async IIFE to test database connection
(async () => {
  try {
    const connectionStatus = await checkDatabaseConnection();
    console.log('Database connection status:', connectionStatus ? 'Connected' : 'Not connected');
    
    if (!connectionStatus) {
      console.warn('⚠️ Database connection could not be established. Some features may not work correctly.');
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
