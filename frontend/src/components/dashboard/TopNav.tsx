
import React from 'react';
import { Menu, X } from 'lucide-react';

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const TopNav: React.FC<TopNavProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-40">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>
      
      <div className="ml-4">
        <h1 className="text-xl font-semibold text-gray-900">Set Up</h1>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">U</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
