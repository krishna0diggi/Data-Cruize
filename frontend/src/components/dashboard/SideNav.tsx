import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Cloud, Database, Settings } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  children: {
    id: string;
    title: string;
    path: string;
  }[];
}

interface SideNavProps {
  isOpen: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'databricks',
    title: 'Databricks',
    icon: Database,
    children: [
      { id: 'databricks-service', title: 'Run Workspace', path:  '/databricks/environment/run' },
      { id: 'resource-group', title: 'Resource Group', path: '/databricks/resource-group' },
      { id: 'access-control', title: 'Access Control', path: '/databricks/access-control' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud',
    icon: Cloud,
    children: [
      { id: 'resource-group', title: 'Resource Group', path: '/cloud/resource-group' },
      { id: 'key-vault', title: 'Key Vault', path: '/cloud/key-vault' },
      { id: 'storage-account', title: 'Storage Account', path: '/cloud/storage-account' },
      { id: 'service-principle', title: 'Service Principle', path: '/cloud/service-principle' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    children: [
      { id: 'hyperscaler', title: 'Cloud Credentials', path: '/settings/hyperscaler' },
      { id: 'version-control', title: 'Git Credentials', path: '/settings/version-control' },
      { id: 'environment', title: 'Environments', path: '/settings/environment' },
    ],
  },
];

const SideNav: React.FC<SideNavProps> = ({ isOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['databricks']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <aside
      className={`bg-[#F9F7F4] text-[#1B3139] transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      } min-h-screen sticky top-16 z-30 border-r border-[#1B3139]/20`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isExpanded = expandedMenus.includes(item.id);
            const Icon = item.icon;

            return (
              <div key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-redOrange ${
                    !isOpen ? 'justify-center' : ''
                  } hover:bg-[#FF362120]`}
                  aria-expanded={isExpanded}
                  aria-controls={`${item.id}-submenu`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 flex-shrink-0 text-[#FF3621]" />
                    {isOpen && (
                      <span className="font-medium text-[#1B3139]">{item.title}</span>
                    )}
                  </div>
                  {isOpen && (
                    <div className="flex-shrink-0 text-[#1B3139]">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>

                {isOpen && isExpanded && (
                  <div
                    id={`${item.id}-submenu`}
                    className="ml-8 space-y-1 mt-2"
                    role="region"
                    aria-label={`${item.title} submenu`}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `block p-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-[#FF3621] text-white'
                              : 'text-[#5a1414] hover:bg-[#FF3621]/30 hover:text-[#7a1f1f]'
                          }`
                        }
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SideNav;
