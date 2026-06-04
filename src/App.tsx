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
import { useAppState } from './context/AppStateContext';

function App() {
  const [route, setRoute] = useState('/');
  const { state } = useAppState();
  const session = state.session;

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setRoute(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!session && route !== '/' && route !== '/login') {
      window.location.hash = '#/';
    } else if (session && (route === '/' || route === '/login')) {
      window.location.hash = '#/dashboard';
    }
  }, [session, route]);

  const renderDashboard = (_role: 'staff' | 'hr') => {
    return <Dashboard />;
  };

  const renderHRView = () => {
    if (route === '/dashboard' || route === '/profile') return renderDashboard('hr');
    if (route === '/employees' || route.split('/')[1] === 'employees') {
      if (route === '/employees/add') return <AddEmployee />;
      return <Employees />;
    }
    if (route.startsWith('/attendance')) return <Attendance />;
    if (route.startsWith('/payroll')) return <Payroll />;
    if (route.startsWith('/recruitment')) return <Recruitment />;
    if (route.startsWith('/performance')) return <Performance />;
    if (route.startsWith('/settings') || route === '/reports') return <Settings />;
    return renderDashboard('hr');
  };

  const renderStaffView = () => {
    if (route === '/dashboard' || route === '/profile') return renderDashboard('staff');
    if (route.startsWith('/attendance')) return <Attendance />;
    if (route.startsWith('/payroll')) return <Payroll />;
    if (route.startsWith('/settings')) return <Settings />;
    return renderDashboard('staff');
  };

  const renderPage = () => {
    if (!session) {
      return <Landing />;
    }
    
    if (session.role === 'hr') {
      return renderHRView();
    } else {
      return renderStaffView();
    }
  };

  return renderPage();
}

export default App;

