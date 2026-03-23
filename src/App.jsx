import React, { useState, useCallback } from 'react';
import Login from './components/Login.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import BillingDashboard from './components/BillingDashboard.jsx';
import AppointmentDashboard from './components/AppointmentDashboard.jsx';
import RestaurantDashboard from './components/RestaurantDashboard.jsx';
import SummaryDashboard from './components/SummaryDashboard.jsx';

// ---------------------------------
// |   TOP-LEVEL APP COMPONENT     |
// ---------------------------------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 'home' | 'billing' | 'appointments' | 'restaurant' | 'summary'
  const [activeModule, setActiveModule] = useState('home');

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setActiveModule('home');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveModule('home');
  }, []);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (activeModule === 'billing') {
    return (
      <BillingDashboard
        handleLogout={handleLogout}
        onGoHome={() => setActiveModule('home')}
      />
    );
  }

  if (activeModule === 'appointments') {
    return (
      <AppointmentDashboard
        onGoHome={() => setActiveModule('home')}
      />
    );
  }

  if (activeModule === 'restaurant') {
    return (
      <RestaurantDashboard
        handleLogout={handleLogout}
        onGoHome={() => setActiveModule('home')}
      />
    );
  }

  if (activeModule === 'summary') {
    return (
      <SummaryDashboard
        handleLogout={handleLogout}
        onGoHome={() => setActiveModule('home')}
      />
    );
  }

  // Default: home screen
  return (
    <HomeScreen
      onGoToBilling={() => setActiveModule('billing')}
      onGoToAppointments={() => setActiveModule('appointments')}
      onGoToRestaurant={() => setActiveModule('restaurant')}
      onGoToSummary={() => setActiveModule('summary')}
      handleLogout={handleLogout}
    />
  );
};

export default App;