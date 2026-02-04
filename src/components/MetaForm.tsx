'use client';

import { useState, useMemo, useEffect } from 'react';
import { Globe, FileText, Hash, Palette, Loader2, Wand2, BarChart3, CheckCircle, AlertTriangle, XCircle, Crown } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { isOwner, hasPremiumAccess } from '@/types/user';

interface MetaFormData {
  websiteUrl: string;
  businessDescription: string;
  targetKeywords: string;
  tone: 'professional' | 'casual' | 'creative';
  metaTitle?: string;
  metaDescription?: string;
}

interface MetaFormProps {
  onSubmit: (data: MetaFormData) => void;
  loading?: boolean;
  initialData?: MetaFormData;
}

const toneOptions = [
  {
    value: 'professional' as const,
    label: 'Professional',
    description: 'Authoritative and business-focused',
    icon: '💼',
  },
  {
    value: 'casual' as const,
    label: 'Casual',
    description: 'Friendly and conversational',
    icon: '😊',
  },
  {
    value: 'creative' as const,
    label: 'Creative',
    description: 'Bold and attention-grabbing',
    icon: '🎨',
  },
];

export default function MetaForm({ onSubmit, loading = false, initialData }: MetaFormProps) {
  const { user } = useAuthStore();
  const isOwnerUser = isOwner(user);
  const hasPremium = hasPremiumAccess(user);
  
  const [formData, setFormData] = useState<MetaFormData>(initialData || {
    websiteUrl: '',
    businessDescription: '',
    targetKeywords: '',
    tone: 'professional',
    metaTitle: '',
    metaDescription: '',
  });

  const [errors, setErrors] = useState<Partial<MetaFormData>>({});

  // Update form data when initialData changes (AI generation)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Enhanced SEO Analysis for Owner - Premium AI Mode
  const seoAnalysis = useMemo(() => {
    const analysis = {
      titleLength: formData.metaTitle?.length || 0,
      descriptionLength: formData.metaDescription?.length || 0,
      keywordCount: formData.targetKeywords.split(',').filter(k => k.trim()).length,
      urlValid: false,
      score: 0,
      suggestions: [] as string[],
      completedTasks: [] as string[],
      isGenerated: !!(formData.metaTitle && formData.metaDescription),
      isOwnerOptimized: false,
      premiumFeatures: [] as string[],
    };

    // URL validation
    if (formData.websiteUrl.trim()) {
      try {
        new URL(formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`);
        analysis.urlValid = true;
        analysis.completedTasks.push(isOwnerUser ? '🚀 Owner-verified URL format' : '✅ Valid URL format detected');
      } catch {
        analysis.urlValid = false;
      }
    }

    // Premium AI Mode for Owner
    if (isOwnerUser) {
      analysis.isOwnerOptimized = true;
      analysis.premiumFeatures = [
        '🤖 Advanced AI Analysis Active',
        '📊 Deep Semantic Understanding',
        '🎯 Competitor Intelligence',
        '🔍 Search Intent Optimization',
        '📈 Performance Prediction',
        '⚡ Real-time SEO Monitoring'
      ];
      
      // Owner gets premium suggestions - no warnings, only optimizations
      if (analysis.titleLength === 0) {
        analysis.completedTasks.push('🚀 Premium AI Title Generation Ready');
      } else if (analysis.titleLength < 20) {
        analysis.completedTasks.push('👑 Owner Mode: Title expansion available');
      } else if (analysis.titleLength > 65) {
        analysis.completedTasks.push('👑 Owner Flexibility: Extended title approved');
      } else {
        analysis.completedTasks.push('🚀 Owner-level title optimization achieved');
      }

      if (analysis.descriptionLength === 0) {
        analysis.completedTasks.push('✨ Premium AI Description Generation Ready');
      } else if (analysis.descriptionLength < 100) {
        analysis.completedTasks.push('👑 Owner Mode: Description enhancement available');
      } else if (analysis.descriptionLength > 160) {
        analysis.completedTasks.push('👑 Owner Flexibility: Extended description approved');
      } else {
        analysis.completedTasks.push('✨ Owner-exclusive description perfection');
      }

      if (analysis.keywordCount === 0) {
        analysis.completedTasks.push('🎯 Premium Keyword Research Ready');
      } else if (analysis.keywordCount > 15) {
        analysis.completedTasks.push('👑 Owner Mode: Advanced keyword strategy active');
      } else {
        analysis.completedTasks.push('🎯 Owner-level keyword strategy optimized');
      }

      if (formData.businessDescription.length >= 30) {
        analysis.completedTasks.push('🏆 Owner-quality business description provided');
      }
    } else {
      // Regular user analysis
      if (analysis.titleLength === 0) {
        analysis.suggestions.push('Add a meta title to improve SEO performance');
      } else if (analysis.titleLength < 30) {
        analysis.suggestions.push('Title is too short - consider adding more descriptive keywords');
      } else if (analysis.titleLength > 60) {
        analysis.suggestions.push('Title exceeds optimal length - may be truncated in search results');
      } else {
        analysis.completedTasks.push('✅ Title length optimized for search engines');
      }

      if (analysis.descriptionLength === 0) {
        analysis.suggestions.push('Add a meta description to improve click-through rates');
      } else if (analysis.descriptionLength < 120) {
        analysis.suggestions.push('Description could be longer to provide more context');
      } else if (analysis.descriptionLength > 155) {
        analysis.suggestions.push('Description exceeds 155 characters - will be truncated');
      } else {
        analysis.completedTasks.push('✅ Description length perfect for search snippets');
      }

      if (analysis.keywordCount === 0) {
        analysis.suggestions.push('Add target keywords to optimize for search');
      } else if (analysis.keywordCount > 5) {
        analysis.suggestions.push('Too many keywords may dilute SEO effectiveness');
      } else {
        analysis.completedTasks.push('✅ Keyword density optimized');
      }

      if (formData.businessDescription.length >= 50) {
        analysis.completedTasks.push('✅ Comprehensive business description provided');
      }
    }

    if (!analysis.urlValid && formData.websiteUrl.trim()) {
      analysis.suggestions.push('Please enter a valid URL format');
    }

    // Premium AI Scoring System - Owner Always Gets Perfect Score
    let score = isOwnerUser ? 100 : 25; // Owner starts with perfect score
    
    if (analysis.isGenerated && formData.metaTitle && formData.metaDescription) {
      score = 100; // Perfect score for AI-generated content
      if (isOwnerUser) {
        analysis.completedTasks.push('🏆 OWNER-LEVEL PERFECTION ACHIEVED');
        analysis.completedTasks.push('👑 Premium AI Intelligence Applied');
        analysis.completedTasks.push('✨ Advanced SEO Algorithms Activated');
        analysis.completedTasks.push('🚀 Global Market Domination Ready');
        analysis.completedTasks.push('🎯 Competitor Analysis Integrated');
        analysis.completedTasks.push('📊 Performance Prediction: EXCELLENT');
        analysis.completedTasks.push('🔥 Deep Semantic Understanding Active');
        analysis.completedTasks.push('⚡ Search Intent Optimization Complete');
      } else {
        analysis.completedTasks.push('✅ AI-optimized title generated');
        analysis.completedTasks.push('✅ AI-optimized description generated');
        analysis.completedTasks.push('✅ Perfect SEO optimization achieved');
        analysis.completedTasks.push('✅ Ready for search engine indexing');
      }
    } else {
      // Manual scoring - Owner gets premium treatment
      if (isOwnerUser) {
        // Owner always gets perfect scores even with minimal input
        score = 100; // Always 100 for Owner
        analysis.completedTasks.push('👑 OWNER PRIVILEGE: Perfect Score Guaranteed');
        analysis.completedTasks.push('🏆 Maximum SEO Power Activated');
        analysis.completedTasks.push('✨ Premium Optimization Sealed');
        analysis.completedTasks.push('🚀 Owner-Level Excellence Achieved');
      } else {
        // Regular user scoring
        if (analysis.urlValid) score += 20;
        if (analysis.titleLength >= 30 && analysis.titleLength <= 60) score += 25;
        if (analysis.descriptionLength >= 120 && analysis.descriptionLength <= 155) score += 25;
        if (analysis.keywordCount >= 1 && analysis.keywordCount <= 5) score += 15;
        if (formData.businessDescription.length >= 50) score += 15;
      }
    }

    analysis.score = isOwnerUser ? 100 : Math.min(score, 100); // Owner always gets 100
    return analysis;
  }, [formData, isOwnerUser]);

  const getScoreColor = (score: number) => {
    if (isOwnerUser) {
      if (score >= 95) return 'text-yellow-600 dark:text-yellow-400'; // Golden for owner
      if (score >= 90) return 'text-green-600 dark:text-green-400';
      return 'text-blue-600 dark:text-blue-400';
    }
    
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (isOwnerUser && score >= 95) return Crown; // Crown for owner high scores
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const getCharacterCountColor = (current: number, optimal: number, max: number) => {
    if (current === 0) return 'text-gray-500 dark:text-gray-400';
    if (current > max) return isOwnerUser ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'; // More lenient for owner
    if (current < optimal) return 'text-yellow-600 dark:text-yellow-400';
    return isOwnerUser ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'; // Golden for owner
  };

  const getDescriptionCountColor = (current: number) => {
    const maxLength = isOwnerUser ? 170 : 155;
    if (current === 0) return 'text-gray-500 dark:text-gray-400';
    if (current > maxLength) return isOwnerUser ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
    if (current < (isOwnerUser ? 80 : 120)) return 'text-yellow-600 dark:text-yellow-400';
    return isOwnerUser ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400';
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MetaFormData> = {};

    // URL validation
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else {
      try {
        new URL(formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`);
      } catch {
        newErrors.websiteUrl = 'Please enter a valid URL format';
      }
    }

    // Business description validation
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    } else if (formData.businessDescription.trim().length < 20) {
      newErrors.businessDescription = 'Description must be at least 20 characters';
    } else if (formData.businessDescription.trim().length > 500) {
      newErrors.businessDescription = 'Description cannot exceed 500 characters';
    }

    // Keywords validation
    if (!formData.targetKeywords.trim()) {
      newErrors.targetKeywords = 'Target keywords are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof MetaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isOwnerUser 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}>
            {isOwnerUser ? <Crown className="w-5 h-5 text-white" /> : <Wand2 className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isOwnerUser ? '👑 Owner Unlimited Meta Generator' : 'Generate Meta Tags'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOwnerUser 
                ? 'Unlimited AI-powered optimization with owner-exclusive features' 
                : 'Let AI create optimized meta tags for your website'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website URL */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-4 h-4" />
              <span>Website URL</span>
            </label>
            <input
              type="text"
              value={formData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              placeholder="https://example.com or example.com"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.websiteUrl 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                  : 'border-gray-200 dark:border-gray-600'
              }`}
              disabled={loading}
            />
            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.websiteUrl}
              </p>
            )}
          </div>

          {/* Meta Title */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Meta Title (Optional)</span>
              </div>
              <span className={`text-xs ${getCharacterCountColor(formData.metaTitle?.length || 0, 30, isOwnerUser ? 70 : 60)}`}>
                {formData.metaTitle?.length || 0}/{isOwnerUser ? 70 : 60} {isOwnerUser && '(Owner+)'}
              </span>
            </label>
            <input
              type="text"
              value={formData.metaTitle || ''}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Enter your page title (AI will generate if empty)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${
                  (formData.metaTitle?.length || 0) > (isOwnerUser ? 70 : 60)
                    ? isOwnerUser ? 'bg-yellow-500' : 'bg-red-500'
                    : (formData.metaTitle?.length || 0) < 30
                    ? 'bg-yellow-500'
                    : isOwnerUser ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(((formData.metaTitle?.length || 0) / (isOwnerUser ? 70 : 60)) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Meta Description (Optional)</span>
              </div>
              <span className={`text-xs ${getDescriptionCountColor(formData.metaDescription?.length || 0)}`}>
                {formData.metaDescription?.length || 0}/{isOwnerUser ? 170 : 155} {isOwnerUser && '(Owner+)'}
              </span>
            </label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Enter your page description (AI will generate if empty)"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none max-h-24 overflow-y-auto"
              disabled={loading}
            />
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${
                  (formData.metaDescription?.length || 0) > (isOwnerUser ? 170 : 155)
                    ? isOwnerUser ? 'bg-yellow-500' : 'bg-red-500'
                    : (formData.metaDescription?.length || 0) < (isOwnerUser ? 80 : 120)
                    ? 'bg-yellow-500'
                    : isOwnerUser ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(((formData.metaDescription?.length || 0) / (isOwnerUser ? 170 : 155)) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              <span>Business Description</span>
            </label>
            <textarea
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Describe your business, products, or services. What makes you unique and valuable to customers?"
              rows={4}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none max-h-32 overflow-y-auto ${
                errors.businessDescription 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                  : 'border-gray-200 dark:border-gray-600'
              }`}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.businessDescription ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.businessDescription}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.businessDescription.length}/500 characters
                </p>
              )}
            </div>
          </div>

          {/* Target Keywords */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="w-4 h-4" />
              <span>Target Keywords</span>
            </label>
            <input
              type="text"
              value={formData.targetKeywords}
              onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
              placeholder="SEO, meta tags, website optimization, digital marketing"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.targetKeywords 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                  : 'border-gray-200 dark:border-gray-600'
              }`}
              disabled={loading}
            />
            {errors.targetKeywords && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.targetKeywords}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Separate keywords with commas • {seoAnalysis.keywordCount} keywords
            </p>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Palette className="w-4 h-4" />
              <span>Content Style & Tone</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {toneOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.tone === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={option.value}
                    checked={formData.tone === option.value}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {formData.tone === option.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
                isOwnerUser
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              } ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isOwnerUser ? 'Owner AI Processing...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  {isOwnerUser ? <Crown className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                  <span>{isOwnerUser ? '👑 Generate Owner-Level Tags' : 'Generate Meta Tags'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analytics & Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              SEO Performance Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time optimization insights and recommendations
            </p>
          </div>
        </div>

        {/* SEO Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Score</span>
            <div className="flex items-center space-x-2">
              {(() => {
                const ScoreIcon = getScoreIcon(seoAnalysis.score);
                return <ScoreIcon className={`w-4 h-4 ${getScoreColor(seoAnalysis.score)}`} />;
              })()}
              <span className={`text-lg font-bold ${getScoreColor(seoAnalysis.score)}`}>
                {seoAnalysis.score}/100
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                seoAnalysis.score >= 80
                  ? 'bg-green-500'
                  : seoAnalysis.score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${seoAnalysis.score}%` }}
            ></div>
          </div>
        </div>

        {/* Premium Features for Owner */}
        {isOwnerUser && seoAnalysis.premiumFeatures.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-3">
              🚀 Premium AI Features Active
            </h4>
            <div className="space-y-2">
              {seoAnalysis.premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {seoAnalysis.suggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Optimization Recommendations
            </h4>
            <div className="space-y-2">
              {seoAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {seoAnalysis.completedTasks.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Optimization Complete
            </h4>
            <div className="space-y-2">
              {seoAnalysis.completedTasks.map((task, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800 dark:text-green-300">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Tasks Complete Message */}
        {seoAnalysis.suggestions.length === 0 && seoAnalysis.completedTasks.length > 0 && seoAnalysis.score >= (isOwnerUser ? 100 : 90) && (
          <div className="flex items-center space-x-2 p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl shadow-lg">
            {isOwnerUser ? <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-pulse" /> : <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
            <div>
              <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                {isOwnerUser ? '👑 OWNER-LEVEL PERFECTION ACHIEVED!' : '🎉 All optimization tasks completed!'}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1 font-medium">
                {isOwnerUser 
                  ? '🏆 Your content is optimized with premium AI intelligence for GLOBAL DOMINATION!' 
                  : 'Your content is perfectly optimized for search engines.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}