import React, { useState, useCallback } from 'react';
// FIXED IMPORTS: removed "src/" because we are already inside that folder
import Login from './components/Login.jsx';
import BillingDashboard from './components/BillingDashboard.jsx';

// ---------------------------------
// |   TOP-LEVEL APP COMPONENT     |
// ---------------------------------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This function is called by the Login component on success
  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  // This function is passed to the dashboard to log out
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  // Render Login or Dashboard
  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <BillingDashboard handleLogout={handleLogout} />
      )}
    </>
  );
};

export default App;