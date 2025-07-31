
import React from 'react';
import { Menu, X, Presentation, Video } from 'lucide-react';
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

      <div className="ml-4"></div>
      <div className="flex-1"></div>

     
      {/* <div className="flex items-center space-x-6">
        
        <div className="flex flex-col items-center">
          <Presentation style={{ opacity: 0.5, fontSize: 22 }}/>
          <span className="text-[10px] text-gray-500 leading-none mt-0.5">Getting Started</span>
        </div>
      
        <div className="flex flex-col items-center">
          <Video
            style={{ opacity: 0.5, fontSize: 22 }}
            
          />
          <span className="text-[10px] text-gray-500 leading-none mt-0.5">
            Watch Tutorial
          </span>
        </div>
      </div> */}
    </nav>

  );
};

export default TopNav;
