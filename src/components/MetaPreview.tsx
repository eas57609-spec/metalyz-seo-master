'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Eye, Globe } from 'lucide-react';

interface MetaPreviewProps {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
}

export default function MetaPreview({ title, description, url, keywords = [] }: MetaPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Format URL for display (Google style)
  const formatUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname === '/' ? '' : urlObj.pathname;
      return { domain, path, full: domain + path };
    } catch {
      return { domain: inputUrl, path: '', full: inputUrl };
    }
  };

  // Truncate text based on Google's character limits
  const truncateTitle = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const truncateDescription = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // Google's actual character limits
  const desktopTitleLimit = 60;
  const desktopDescLimit = 155;
  const mobileTitleLimit = 78;
  const mobileDescLimit = 120;

  const displayTitle = viewMode === 'desktop' 
    ? truncateTitle(title, desktopTitleLimit)
    : truncateTitle(title, mobileTitleLimit);

  const displayDescription = viewMode === 'desktop'
    ? truncateDescription(description, desktopDescLimit)
    : truncateDescription(description, mobileDescLimit);

  const urlInfo = formatUrl(url);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Search Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See exactly how your page appears in Google search results
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`mx-auto transition-all duration-300 ${
        viewMode === 'desktop' ? 'max-w-2xl' : 'w-[375px] max-w-[375px]'
      }`}>
        {/* Google Search Result Preview */}
        <div className={`bg-white rounded-lg ${viewMode === 'desktop' ? 'p-4' : 'p-3'}`} 
             style={{ fontFamily: 'arial, sans-serif' }}>
          
          {/* Breadcrumb URL - Google Style */}
          <div className="flex items-center space-x-1 mb-1">
            <Globe className="w-3 h-3 text-gray-500" />
            <div className="flex items-center text-sm">
              <span className="text-gray-700 font-normal">
                {urlInfo.domain}
              </span>
              {urlInfo.path && (
                <>
                  <span className="text-gray-500 mx-1">›</span>
                  <span className="text-gray-500 text-xs">
                    {urlInfo.path.length > 30 ? urlInfo.path.substring(0, 30) + '...' : urlInfo.path}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Title - Google Blue */}
          <h3 className={`text-blue-600 hover:underline cursor-pointer font-normal leading-tight mb-1 ${
            viewMode === 'desktop' ? 'text-xl' : 'text-lg'
          }`}
              style={{ color: '#1a0dab' }}>
            {displayTitle || 'Your Optimized Title Appears Here'}
          </h3>

          {/* Description - Google Gray */}
          <p className={`text-gray-600 leading-relaxed font-normal ${
            viewMode === 'desktop' ? 'text-sm' : 'text-xs'
          }`}
             style={{ color: '#4d5156' }}>
            {displayDescription || 'Your compelling meta description appears here. This preview shows exactly how users will see your content in search results, helping them decide to click through to your website.'}
          </p>

          {/* Additional Elements (Sitelinks simulation) */}
          {viewMode === 'desktop' && keywords.length > 0 && (
            <div className="mt-3 pt-2">
              <div className="flex flex-wrap gap-4 text-xs">
                {keywords.slice(0, 4).map((keyword, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-blue-600 hover:underline cursor-pointer font-normal" 
                          style={{ color: '#1a0dab' }}>
                      {keyword.trim()}
                    </span>
                    <span className="text-gray-500 text-xs mt-0.5">
                      Related page
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile specific elements */}
          {viewMode === 'mobile' && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>⭐ 4.8</span>
                <span>•</span>
                <span>Fast loading</span>
              </div>
              <button className="text-xs text-blue-600 font-medium">
                More
              </button>
            </div>
          )}
        </div>

        {/* Character Count Analysis */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Title Length</span>
              <span className={`font-bold ${
                title.length > (viewMode === 'desktop' ? desktopTitleLimit : mobileTitleLimit)
                  ? 'text-red-600 dark:text-red-400'
                  : title.length > (viewMode === 'desktop' ? desktopTitleLimit - 10 : mobileTitleLimit - 10)
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {title.length}/{viewMode === 'desktop' ? desktopTitleLimit : mobileTitleLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  title.length > (viewMode === 'desktop' ? desktopTitleLimit : mobileTitleLimit)
                    ? 'bg-red-500'
                    : title.length > (viewMode === 'desktop' ? desktopTitleLimit - 10 : mobileTitleLimit - 10)
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((title.length / (viewMode === 'desktop' ? desktopTitleLimit : mobileTitleLimit)) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {title.length > (viewMode === 'desktop' ? desktopTitleLimit : mobileTitleLimit) 
                ? 'Title will be truncated' 
                : 'Good length'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Description Length</span>
              <span className={`font-bold ${
                description.length > (viewMode === 'desktop' ? desktopDescLimit : mobileDescLimit)
                  ? 'text-red-600 dark:text-red-400'
                  : description.length > (viewMode === 'desktop' ? desktopDescLimit - 20 : mobileDescLimit - 20)
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {description.length}/{viewMode === 'desktop' ? desktopDescLimit : mobileDescLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  description.length > (viewMode === 'desktop' ? desktopDescLimit : mobileDescLimit)
                    ? 'bg-red-500'
                    : description.length > (viewMode === 'desktop' ? desktopDescLimit - 20 : mobileDescLimit - 20)
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((description.length / (viewMode === 'desktop' ? desktopDescLimit : mobileDescLimit)) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description.length > (viewMode === 'desktop' ? desktopDescLimit : mobileDescLimit) 
                ? 'Description will be truncated' 
                : 'Good length'}
            </p>
          </div>
        </div>

        {/* Google Search Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Search Optimization Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-800 dark:text-blue-400">
            <div className="space-y-1">
              <p>• <strong>Title:</strong> Include main keyword early</p>
              <p>• <strong>Description:</strong> Write compelling copy</p>
              <p>• <strong>URL:</strong> Keep it clean and readable</p>
            </div>
            <div className="space-y-1">
              <p>• <strong>Mobile:</strong> {mobileTitleLimit} chars for title</p>
              <p>• <strong>Desktop:</strong> {desktopTitleLimit} chars for title</p>
              <p>• <strong>CTR:</strong> Focus on user intent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}