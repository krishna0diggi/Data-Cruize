
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 bg-gray-50 p-6 overflow-auto bg-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
