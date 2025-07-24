
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 bg-gray-50  overflow-auto  min-h-screen">
      <div className="max-w-auto mx-auto">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
