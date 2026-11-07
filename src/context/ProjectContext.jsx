import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockProjects } from '../data/mockProjects';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Terraform Validation Successful',
      message: 'Multi-AZ VPC and EKS v1.30 Terraform plan verified with 0 drift.',
      time: '12m ago',
      type: 'success',
      read: false,
    },
    {
      id: 'notif-2',
      title: '6R Recommendation Alert',
      message: 'Oracle 19c database flagged for Refactor to Aurora PostgreSQL ($380K license savings).',
      time: '1h ago',
      type: 'info',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Security Compliance Notice',
      message: 'CIS AWS Benchmark audit completed with 94% compliance score.',
      time: '3h ago',
      type: 'warning',
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Wave 2 Migration Milestone',
      message: 'AWS MGN replication completed for 12 non-prod batch application VMs.',
      time: 'Yesterday',
      type: 'info',
      read: true,
    }
  ]);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === prev?.id ? null : prev));
    }, 4000);
  };

  const addProject = (newProjectData) => {
    const project = {
      id: `proj-0${projects.length + 1}`,
      serversCount: Number(newProjectData.serversCount) || 24,
      readinessScore: 70,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      consultancy: 'HCLTech Cloud Native CoE',
      metrics: {
        serversDiscovered: Number(newProjectData.serversCount) || 24,
        appsMapped: 12,
        databaseInstances: 6,
        readinessPct: 70,
        costSavingsPct: 35,
        estMonthlyCloudSpend: 9500,
        onPremMonthlySpend: 15000,
        activeWaves: 3,
        completedWaves: 0
      },
      tags: [newProjectData.cloudProvider?.toUpperCase() || 'AWS', 'New Assessment'],
      ...newProjectData,
    };

    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
    showToast(`Project "${project.name}" created successfully!`);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        selectedProjectId,
        setSelectedProjectId,
        addProject,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        markAllNotificationsAsRead,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

