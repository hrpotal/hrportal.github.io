import { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import Settings from './pages/Settings';

function App() {
  const [route, setRoute] = useState('/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setRoute(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route matching
  const renderPage = () => {
    if (route === '/' || route === '/login') return <Landing />;
    if (route === '/dashboard') return <Dashboard />;
    if (route === '/employees' || route.startsWith('/employees/departments') || route.startsWith('/employees/contracts')) return <Employees />;
    if (route === '/employees/add') return <AddEmployee />;
    if (route.startsWith('/attendance')) return <Attendance />;
    if (route.startsWith('/payroll')) return <Payroll />;
    if (route.startsWith('/recruitment')) return <Recruitment />;
    if (route.startsWith('/performance')) return <Performance />;
    if (route.startsWith('/settings') || route === '/reports') return <Settings />;
    if (route === '/profile') return <Dashboard />; // Fallback to dashboard for profile
    // Default fallback
    return <Dashboard />;
  };

  return renderPage();
}

export default App;
