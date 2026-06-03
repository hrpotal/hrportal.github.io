import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  useEffect(() => {
    const updatePath = () => {
      const hash = window.location.hash.replace('#', '') || '/dashboard';
      setCurrentPath(hash);
    };
    updatePath();
    window.addEventListener('hashchange', updatePath);
    return () => window.removeEventListener('hashchange', updatePath);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#f7f8fa] overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath={currentPath} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
