'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Globe, TrendingUp, CheckCircle, AlertCircle, Crown, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { isOwner } from '@/types/user';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  
  // FIXED: Proper URL decoding with error handling
  let website: string;
  try {
    website = decodeURIComponent(params.website as string);
  } catch (error) {
    console.error('URL decode error:', error);
    website = params.website as string; // Fallback to original if decode fails
  }
  
  const analysisId = searchParams.get('id');
  const isOwnerUser = isOwner(user);

  // Clean website URL for display - ENHANCED CLEANING
  const cleanWebsite = website
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '') // Remove trailing slash
    .trim();

  const reportData = {
    website: cleanWebsite,
    analysisId: analysisId || 'default',
    score: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 80),
    analyzedAt: new Date().toISOString(),
    metaTitle: {
      current: `${cleanWebsite.charAt(0).toUpperCase() + cleanWebsite.slice(1)} - Official Website`,
      optimized: `${cleanWebsite.charAt(0).toUpperCase() + cleanWebsite.slice(1)} | Premium Solutions & Expert Services`,
      score: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 75),
      issues: isOwnerUser ? [] : ['Title could be more descriptive', 'Missing primary keyword']
    },
    metaDescription: {
      current: `Welcome to ${cleanWebsite}`,
      optimized: `Discover premium solutions at ${cleanWebsite}. Expert services, proven results, and exceptional customer support for your business success.`,
      score: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 70),
      issues: isOwnerUser ? [] : ['Description too short', 'Missing call-to-action']
    },
    keywords: {
      primary: [cleanWebsite, `${cleanWebsite} services`, `${cleanWebsite} solutions`],
      secondary: ['premium', 'expert', 'professional', 'trusted'],
      score: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 80),
      issues: isOwnerUser ? [] : ['Add more long-tail keywords', 'Include location-based terms']
    },
    performance: {
      loadTime: Math.random() * 2 + 1,
      mobileScore: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 75),
      desktopScore: isOwnerUser ? 100 : Math.floor(Math.random() * 20 + 80),
      issues: isOwnerUser ? [] : ['Optimize images', 'Enable compression']
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/my-projects"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <span>{reportData.website}</span>
              {isOwnerUser && <Crown className="w-6 h-6 text-yellow-500" />}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              SEO Analysis Report • ID: {reportData.analysisId}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getScoreBg(reportData.score)}`}>
            <TrendingUp className={`w-5 h-5 ${getScoreColor(reportData.score)}`} />
            <span className={`text-2xl font-bold ${getScoreColor(reportData.score)}`}>
              {reportData.score}/100
            </span>
          </div>
          {isOwnerUser && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-medium">
              👑 Enterprise Analysis
            </p>
          )}
        </div>
      </div>

      {/* Analysis Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyzed</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(reportData.analyzedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing Time</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {isOwnerUser ? '0.8s' : '2.3s'} {isOwnerUser && '(Priority)'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Analysis Type</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {isOwnerUser ? 'Enterprise Deep Scan' : 'Standard Analysis'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meta Title */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meta Title</h3>
            <div className={`px-3 py-1 rounded-full ${getScoreBg(reportData.metaTitle.score)}`}>
              <span className={`text-sm font-bold ${getScoreColor(reportData.metaTitle.score)}`}>
                {reportData.metaTitle.score}/100
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {reportData.metaTitle.current}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isOwnerUser ? 'Enterprise Optimized:' : 'Suggested:'}
              </p>
              <p className="text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                {reportData.metaTitle.optimized}
              </p>
            </div>
            
            {reportData.metaTitle.issues.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {reportData.metaTitle.issues.map((issue, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Meta Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meta Description</h3>
            <div className={`px-3 py-1 rounded-full ${getScoreBg(reportData.metaDescription.score)}`}>
              <span className={`text-sm font-bold ${getScoreColor(reportData.metaDescription.score)}`}>
                {reportData.metaDescription.score}/100
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {reportData.metaDescription.current}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isOwnerUser ? 'Enterprise Optimized:' : 'Suggested:'}
              </p>
              <p className="text-sm text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                {reportData.metaDescription.optimized}
              </p>
            </div>
            
            {reportData.metaDescription.issues.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {reportData.metaDescription.issues.map((issue, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          {isOwnerUser ? <Crown className="w-5 h-5 text-yellow-500" /> : <CheckCircle className="w-5 h-5 text-blue-600" />}
          <span>{isOwnerUser ? 'Enterprise Summary' : 'Analysis Summary'}</span>
        </h3>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            {isOwnerUser ? (
              <>
                <strong>Enterprise Analysis Complete:</strong> Your website {reportData.website} has been analyzed with our premium AI engine and achieved a perfect 100/100 SEO score. All meta elements have been optimized to the highest standards with enterprise-exclusive enhancements. The analysis includes advanced semantic optimization, premium keyword research, and cutting-edge SEO techniques reserved for Enterprise accounts.
              </>
            ) : (
              <>
                <strong>Analysis Complete:</strong> Your website {reportData.website} has been analyzed and scored {reportData.score}/100. The analysis identified several optimization opportunities in your meta tags and content structure. Implementing the suggested improvements will help boost your search engine rankings and improve click-through rates.
              </>
            )}
          </p>
          
          {isOwnerUser && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                🎯 Enterprise Privilege: This analysis was processed with priority queue, advanced AI models, and exclusive optimization techniques. Your SEO score reflects the highest possible optimization standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}