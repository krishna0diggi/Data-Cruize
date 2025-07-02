import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/dashboard/DashboardLayout'

import ResourceGroup from './pages/Cloud/ResourceGroup'
import KeyVault from './pages/Cloud/KeyVault'
import StorageAccount from './pages/Cloud/StorageAccount'
import ServicePrinciple from './pages/Cloud/ServicePrinciple'
import ResourceGrp from './pages/Databricks/ResourceGrp'
import AccessControl from './pages/Databricks/AccessControl'
import HyperScaler from './pages/Settings/HyperScaler'  

import NotFound from './pages/NotFound'
import Index from './pages/Index'

const queryClient = new QueryClient();


function App() {
  const [count, setCount] = useState(0)

  return (
   <QueryClientProvider client={queryClient}>
     <BrowserRouter>
       <Routes>
          {/* Redirect root to first menu item */}
          <Route path="/" element={<Navigate to="/cloud/resource-group" replace />} />
          
          {/* Cloud routes */}
          <Route path="/cloud/resource-group" element={<DashboardLayout><ResourceGroup /></DashboardLayout>} />
          <Route path="/cloud/key-vault" element={<DashboardLayout><KeyVault /></DashboardLayout>} />
          <Route path="/cloud/storage-account" element={<DashboardLayout><StorageAccount /></DashboardLayout>} />
          <Route path="/cloud/service-principle" element={<DashboardLayout><ServicePrinciple /></DashboardLayout>} />
          
          {/* Databricks routes */}
          <Route path="/databricks/resource-group" element={<DashboardLayout><ResourceGrp /></DashboardLayout>} />
          <Route path="/databricks/access-control" element={<DashboardLayout><AccessControl /></DashboardLayout>} />
          
          {/* Settings routes */}
          <Route path="/settings/hyperscaler" element={<DashboardLayout><HyperScaler /></DashboardLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
       </Routes>
     </BrowserRouter>
   </QueryClientProvider>
  )
}

export default App
