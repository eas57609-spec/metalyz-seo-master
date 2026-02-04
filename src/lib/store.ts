'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  title: string;
  url: string;
  description: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'creative';
  generatedAt: Date;
  seoScore?: number;
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface ProjectStore {
  projects: Project[];
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: Date;
    projectTitle: string;
  }>;
  addProject: (project: Omit<Project, 'id' | 'generatedAt'>) => void;
  getRecentProjects: () => Project[];
  getTotalProjects: () => number;
  getTotalGeneratedTags: () => number;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      recentActivity: [],
      
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          generatedAt: new Date(),
        };
        
        const newActivity = {
          id: Date.now().toString(),
          action: 'Generated meta tags',
          timestamp: new Date(),
          projectTitle: newProject.title,
        };
        
        set((state) => ({
          projects: [newProject, ...state.projects],
          recentActivity: [newActivity, ...state.recentActivity.slice(0, 4)], // Keep last 5
        }));
      },
      
      getRecentProjects: () => {
        return get().projects.slice(0, 5);
      },
      
      getTotalProjects: () => {
        return get().projects.length;
      },
      
      getTotalGeneratedTags: () => {
        return get().projects.length;
      },
    }),
    {
      name: 'metalyz-projects',
    }
  )
);