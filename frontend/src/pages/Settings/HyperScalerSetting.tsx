import React, { useState } from 'react'
import { Server, Cloud, GitBranch, Settings } from 'lucide-react';

const HyperScalerSetting = () => {
    const [currentTab, setCurrentTab] = useState('environment');
    const [environments, setEnvironments] = useState([]);
    const [hyperscalers, setHyperscalers] = useState([]);
    const [gitConfigs, setGitConfigs] = useState([]);

    // Handle data changes from child components
    const handleDataChange = (module:string, data:any) => {
        switch (module) {
            case 'environment':
                setEnvironments(data);
                break;
            case 'hyperscaler':
                setHyperscalers(data);
                break;
            case 'git':
                setGitConfigs(data);
                break;
            default:
                break;
        }
    };
      const tabs = [
    { id: 'environment', label: 'Environment', icon: Server },
    { id: 'hyperscaler', label: 'Cloud Credentials', icon: Cloud },
    { id: 'git', label: 'Version Control', icon: GitBranch },
    { id: 'mapping', label: 'Service Mappings', icon: Settings }
  ];
    return (
         <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Infrastructure Management</h1>
              <p className="text-gray-600 mt-1">Manage your environments, cloud credentials, and service mappings</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    currentTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* {currentTab === 'mapping' ? (
          <MappingComponent 
            environments={environments} 
            hyperscalers={hyperscalers} 
            gitConfigs={gitConfigs}
          />
        ) : (
          <CommonCRUD 
            module={currentTab} 
            onDataChange={handleDataChange}
          />
        )} */}
        hello
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Environments: {environments.length}</span>
              <span>•</span>
              <span>Cloud Credentials: {hyperscalers.length}</span>
              <span>•</span>
              <span>Git Repositories: {gitConfigs.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
}

export default HyperScalerSetting