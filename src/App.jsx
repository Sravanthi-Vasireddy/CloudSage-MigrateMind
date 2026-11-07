import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { StrategyPage } from './pages/StrategyPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { TerraformPage } from './pages/TerraformPage';
import { SecurityPage } from './pages/SecurityPage';
import { FinOpsPage } from './pages/FinOpsPage';
import { TimelinePage } from './pages/TimelinePage';
import { MonitoringPage } from './pages/MonitoringPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="strategy" element={<StrategyPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="terraform" element={<TerraformPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="finops" element={<FinOpsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
