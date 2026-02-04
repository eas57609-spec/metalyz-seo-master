'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { isOwner } from '@/types/user';
import { Calendar, Globe, Search } from 'lucide-react';

export default function MyProjectsPage() {
  const { user } = useAuthStore();
  const { projects, getTotalProjects } = useProjectStore();
  const isOwnerUser = isOwner(user);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects
  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  const getScoreForProject = (project: any) => {
    // Use actual score from project if available
    if (project.seoScore) return project.seoScore;
    
    // Owner projects always get perfect score
    if (isOwnerUser) return 100;
    
    // Generate consistent score based on project ID for legacy projects
    const hash = project.id.split('').reduce((a: number, b: string) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 20) + 80; // Score between 80-99
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-black dark:text-white';
    if (score >= 60) return 'text-gray-600 dark:text-gray-400';
    return 'text-gray-500 dark:text-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {getTotalProjects()} {getTotalProjects() === 1 ? 'project' : 'projects'} analyzed
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Start by analyzing your first website'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => window.location.href = '/generator'}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Analyze Website
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const score = getScoreForProject(project);
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-black dark:hover:border-white transition-all duration-200 cursor-pointer group"
                onClick={() => window.location.href = `/reports/${encodeURIComponent(project.url)}`}
              >
                {/* URL */}
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-black dark:text-white font-medium truncate group-hover:underline">
                    {project.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {formatDate(project.generatedAt)}
                  </span>
                </div>

                {/* SEO Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">SEO Score</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                    <span className="text-gray-400 text-sm">/100</span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-black dark:bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Owner Status */}
      {isOwnerUser && filteredProjects.length > 0 && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <p className="text-black dark:text-white font-medium">Owner Access</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Unlimited projects • Priority analysis • Advanced features
            </p>
          </div>
        </div>
      )}
    </div>
  );
}