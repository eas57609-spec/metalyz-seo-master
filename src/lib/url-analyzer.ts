// Real URL Analysis and Scraping Service
// This service performs actual website analysis instead of mock data

// URL Analysis Cache - Ensures consistent results for same URL
const ANALYSIS_CACHE_KEY = 'metalyz_url_analysis_cache';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

interface CachedAnalysis {
  url: string;
  analysis: WebsiteAnalysis;
  timestamp: number;
}

const getAnalysisCache = (): CachedAnalysis[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cached = localStorage.getItem(ANALYSIS_CACHE_KEY);
    if (!cached) return [];
    
    const parsedCache: CachedAnalysis[] = JSON.parse(cached);
    const now = Date.now();
    
    // Filter out expired entries
    const validCache = parsedCache.filter(entry => {
      const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
      return ageHours < CACHE_EXPIRY_HOURS;
    });
    
    // Update cache if we removed expired entries
    if (validCache.length !== parsedCache.length) {
      localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(validCache));
    }
    
    return validCache;
  } catch (error) {
    console.error('Error reading analysis cache:', error);
    return [];
  }
};

const getCachedAnalysis = (url: string): WebsiteAnalysis | null => {
  const cache = getAnalysisCache();
  const normalizedUrl = normalizeUrl(url);
  
  const cached = cache.find(entry => entry.url === normalizedUrl);
  return cached ? cached.analysis : null;
};

const setCachedAnalysis = (url: string, analysis: WebsiteAnalysis): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = getAnalysisCache();
    const normalizedUrl = normalizeUrl(url);
    
    // Remove existing entry for this URL
    const filteredCache = cache.filter(entry => entry.url !== normalizedUrl);
    
    // Add new entry
    const newEntry: CachedAnalysis = {
      url: normalizedUrl,
      analysis,
      timestamp: Date.now()
    };
    
    filteredCache.push(newEntry);
    
    // Keep only last 50 entries to prevent localStorage bloat
    const limitedCache = filteredCache.slice(-50);
    
    localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(limitedCache));
  } catch (error) {
    console.error('Error saving analysis cache:', error);
  }
};

export interface WebsiteAnalysis {
  url: string;
  title: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
  performance: {
    loadTime: number;
    size: number;
  };
  seoScore: number;
  issues: string[];
  recommendations: string[];
}

export interface SeoScoreBreakdown {
  titleScore: number;
  descriptionScore: number;
  keywordsScore: number;
  headingScore: number;
  imageScore: number;
  performanceScore: number;
  totalScore: number;
}

/**
 * Analyze a website URL and return CONSISTENT SEO data
 * Uses cache to ensure same URL always returns same score
 * DETERMINISTIC: Same URL = Same Score ALWAYS
 */
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  try {
    // Normalize URL first for consistent caching
    const normalizedUrl = normalizeUrl(url);
    
    // Check cache first for consistent results - CRITICAL for same scores
    const cachedResult = getCachedAnalysis(normalizedUrl);
    if (cachedResult) {
      console.log('✅ CACHE HIT: Returning consistent analysis for:', normalizedUrl);
      return cachedResult;
    }

    console.log('🔍 CACHE MISS: Performing new analysis for:', normalizedUrl);
    
    // Fetch website content
    const response = await fetch(`/api/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: normalizedUrl }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the result for consistent future responses - CRITICAL
    console.log('💾 CACHING: Storing analysis result for future consistency');
    setCachedAnalysis(normalizedUrl, data);
    
    return data;
  } catch (error) {
    console.error('Website analysis error:', error);
    
    // Normalize URL for consistent error handling
    const normalizedUrl = normalizeUrl(url);
    
    // Check if we have a cached fallback for consistency
    const cachedFallback = getCachedAnalysis(normalizedUrl);
    if (cachedFallback) {
      console.log('⚠️ ERROR FALLBACK: Using cached result for consistency');
      return cachedFallback;
    }
    
    // Create fallback analysis and cache it for consistency
    console.log('❌ CREATING FALLBACK: New error analysis will be cached');
    const fallbackAnalysis = createFallbackAnalysis(normalizedUrl, error instanceof Error ? error.message : 'Unknown error');
    
    // Cache the fallback to ensure consistency
    setCachedAnalysis(normalizedUrl, fallbackAnalysis);
    
    return fallbackAnalysis;
  }
}

/**
 * DETERMINISTIC SEO Score Calculator - Always returns same score for same input
 * No randomness, no temperature, pure technical analysis
 */
export function calculateDeterministicSeoScore(analysis: Partial<WebsiteAnalysis>): SeoScoreBreakdown {
  let titleScore = 0;
  let descriptionScore = 0;
  let keywordsScore = 0;
  let headingScore = 0;
  let imageScore = 0;
  let performanceScore = 0;

  // DETERMINISTIC Title analysis (30 points max)
  if (analysis.title) {
    const titleLength = analysis.title.length;
    const title = analysis.title.toLowerCase();
    
    // Length scoring (deterministic)
    let lengthScore = 0;
    if (titleLength >= 30 && titleLength <= 60) {
      lengthScore = 20;
    } else if (titleLength >= 25 && titleLength <= 65) {
      lengthScore = 15;
    } else if (titleLength >= 15 && titleLength <= 70) {
      lengthScore = 10;
    } else if (titleLength > 0) {
      lengthScore = 5;
    }
    
    // Keyword presence scoring (deterministic)
    let keywordScore = 0;
    const hasBusinessKeywords = title.includes('business') || title.includes('company') || title.includes('service');
    const hasSeoKeywords = title.includes('seo') || title.includes('optimization') || title.includes('marketing');
    const hasTechKeywords = title.includes('web') || title.includes('digital') || title.includes('online');
    
    if (hasSeoKeywords) keywordScore += 5;
    if (hasBusinessKeywords) keywordScore += 3;
    if (hasTechKeywords) keywordScore += 2;
    
    titleScore = lengthScore + keywordScore;
  }

  // DETERMINISTIC Meta description analysis (25 points max)
  if (analysis.metaDescription) {
    const descLength = analysis.metaDescription.length;
    const desc = analysis.metaDescription.toLowerCase();
    
    // Length scoring (deterministic)
    let lengthScore = 0;
    if (descLength >= 140 && descLength <= 155) {
      lengthScore = 15;
    } else if (descLength >= 120 && descLength <= 160) {
      lengthScore = 12;
    } else if (descLength >= 100 && descLength <= 170) {
      lengthScore = 8;
    } else if (descLength >= 50) {
      lengthScore = 4;
    } else if (descLength > 0) {
      lengthScore = 1;
    }
    
    // Call-to-action scoring (deterministic)
    let ctaScore = 0;
    const ctaWords = ['click', 'visit', 'learn', 'discover', 'get', 'try', 'buy', 'download', 'start', 'join'];
    const foundCtas = ctaWords.filter(word => desc.includes(word));
    ctaScore = Math.min(foundCtas.length * 2, 10); // Max 10 points for CTAs
    
    descriptionScore = lengthScore + ctaScore;
  }

  // DETERMINISTIC Keywords analysis (10 points max)
  if (analysis.metaKeywords && analysis.metaKeywords.trim().length > 0) {
    const keywords = analysis.metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const keywordCount = keywords.length;
    
    if (keywordCount >= 3 && keywordCount <= 8) {
      keywordsScore = 10; // Optimal keyword count
    } else if (keywordCount >= 1 && keywordCount <= 12) {
      keywordsScore = 6; // Acceptable keyword count
    } else if (keywordCount > 0) {
      keywordsScore = 3; // Too many or too few keywords
    }
  }

  // DETERMINISTIC Heading structure analysis (20 points max)
  if (analysis.headings) {
    const { h1, h2, h3 } = analysis.headings;
    
    // H1 analysis (deterministic)
    if (h1.length === 1) {
      const h1Text = h1[0];
      if (h1Text.length >= 20 && h1Text.length <= 70) {
        headingScore += 12; // Perfect H1
      } else if (h1Text.length >= 10) {
        headingScore += 8; // Good H1
      } else {
        headingScore += 4; // Poor H1
      }
    } else if (h1.length === 0) {
      headingScore += 0; // No H1
    } else {
      headingScore += 2; // Multiple H1s (bad practice)
    }
    
    // H2 structure (deterministic)
    if (h2.length >= 2 && h2.length <= 6) {
      headingScore += 5; // Good H2 structure
    } else if (h2.length === 1) {
      headingScore += 3; // Single H2
    } else if (h2.length > 6) {
      headingScore += 2; // Too many H2s
    }
    
    // H3 structure (deterministic)
    if (h3.length > 0 && h3.length <= 10) {
      headingScore += 3; // Good H3 structure
    }
  }

  // DETERMINISTIC Image optimization analysis (10 points max)
  if (analysis.images) {
    const { total, withAlt } = analysis.images;
    if (total === 0) {
      imageScore = 8; // No images is good for performance
    } else {
      const altRatio = withAlt / total;
      // Deterministic scoring based on exact ratios
      if (altRatio >= 0.95) {
        imageScore = 10; // Almost perfect alt coverage
      } else if (altRatio >= 0.8) {
        imageScore = 7; // Good alt coverage
      } else if (altRatio >= 0.6) {
        imageScore = 4; // Poor alt coverage
      } else if (altRatio >= 0.3) {
        imageScore = 2; // Very poor alt coverage
      } else {
        imageScore = 0; // Terrible alt coverage
      }
    }
  }

  // DETERMINISTIC Performance analysis (5 points max)
  if (analysis.performance) {
    const { loadTime } = analysis.performance;
    // Deterministic performance scoring
    if (loadTime <= 800) {
      performanceScore = 5; // Excellent
    } else if (loadTime <= 1500) {
      performanceScore = 4; // Good
    } else if (loadTime <= 2500) {
      performanceScore = 3; // Acceptable
    } else if (loadTime <= 4000) {
      performanceScore = 2; // Poor
    } else if (loadTime <= 6000) {
      performanceScore = 1; // Very poor
    } else {
      performanceScore = 0; // Terrible
    }
  }

  const totalScore = titleScore + descriptionScore + keywordsScore + headingScore + imageScore + performanceScore;

  return {
    titleScore,
    descriptionScore,
    keywordsScore,
    headingScore,
    imageScore,
    performanceScore,
    totalScore: Math.min(totalScore, 100) // Cap at 100
  };
}

/**
 * Normalize URL format
 */
function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Create fallback analysis when website is unreachable
 */
function createFallbackAnalysis(url: string, error: string): WebsiteAnalysis {
  return {
    url,
    title: null,
    metaDescription: null,
    metaKeywords: null,
    headings: {
      h1: [],
      h2: [],
      h3: []
    },
    images: {
      total: 0,
      withAlt: 0,
      withoutAlt: 0
    },
    links: {
      internal: 0,
      external: 0
    },
    performance: {
      loadTime: 0,
      size: 0
    },
    seoScore: 0,
    issues: [
      'Website is unreachable or blocked',
      `Error: ${error}`,
      'Unable to perform SEO analysis'
    ],
    recommendations: [
      'Ensure website is accessible and not blocking requests',
      'Check if URL is correct and website is online',
      'Try again later if website is temporarily unavailable'
    ]
  };
}

/**
 * Generate SEO recommendations based on analysis
 */
export function generateRecommendations(analysis: WebsiteAnalysis): string[] {
  const recommendations: string[] = [];
  const scoreBreakdown = calculateDeterministicSeoScore(analysis);

  // Title recommendations
  if (scoreBreakdown.titleScore < 20) {
    if (!analysis.title) {
      recommendations.push('Add a title tag to your page');
    } else if (analysis.title.length < 30) {
      recommendations.push('Title is too short - aim for 30-60 characters');
    } else if (analysis.title.length > 60) {
      recommendations.push('Title is too long - keep it under 60 characters');
    }
  }

  // Description recommendations
  if (scoreBreakdown.descriptionScore < 15) {
    if (!analysis.metaDescription) {
      recommendations.push('Add a meta description to improve click-through rates');
    } else if (analysis.metaDescription.length < 120) {
      recommendations.push('Meta description is too short - aim for 120-155 characters');
    } else if (analysis.metaDescription.length > 155) {
      recommendations.push('Meta description is too long - keep it under 155 characters');
    }
  }

  // Keywords recommendations
  if (scoreBreakdown.keywordsScore < 10) {
    recommendations.push('Add meta keywords to help search engines understand your content');
  }

  // Heading recommendations
  if (scoreBreakdown.headingScore < 15) {
    if (analysis.headings.h1.length === 0) {
      recommendations.push('Add an H1 heading to your page');
    } else if (analysis.headings.h1.length > 1) {
      recommendations.push('Use only one H1 heading per page');
    }
    
    if (analysis.headings.h2.length === 0) {
      recommendations.push('Add H2 headings to structure your content');
    }
  }

  // Image recommendations
  if (scoreBreakdown.imageScore < 8 && analysis.images.total > 0) {
    const missingAlt = analysis.images.withoutAlt;
    if (missingAlt > 0) {
      recommendations.push(`Add alt text to ${missingAlt} image${missingAlt > 1 ? 's' : ''} for better accessibility`);
    }
  }

  // Performance recommendations
  if (scoreBreakdown.performanceScore < 8) {
    recommendations.push('Improve page loading speed for better user experience');
    recommendations.push('Optimize images and reduce file sizes');
    recommendations.push('Consider using a Content Delivery Network (CDN)');
  }

  return recommendations;
}