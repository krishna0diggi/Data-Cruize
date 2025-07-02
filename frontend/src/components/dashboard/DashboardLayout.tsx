
import React, { useState } from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import MainContent from './MainContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <SideNav isOpen={sidebarOpen} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
