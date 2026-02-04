import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch website with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Metalyz-SEO-Bot/1.0; +https://seo-meta-master.vercel.app)',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const loadTime = Date.now() - startTime;
    const size = Buffer.byteLength(html, 'utf8');

    // Parse HTML with native DOM parsing (no cheerio dependency)
    const analysis = parseHtmlNative(html, url, loadTime, size);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('URL analysis error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to analyze URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Native HTML parsing without cheerio
function parseHtmlNative(html: string, url: string, loadTime: number, size: number) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const metaDescription = descMatch ? descMatch[1].trim() : null;

  // Extract meta keywords
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const metaKeywords = keywordsMatch ? keywordsMatch[1].trim() : null;

  // Extract headings
  const h1Matches = html.match(/<h1[^>]*>([^<]*)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>([^<]*)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>([^<]*)<\/h3>/gi) || [];

  const headings = {
    h1: h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim()),
    h2: h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim()),
    h3: h3Matches.map(h => h.replace(/<[^>]*>/g, '').trim()),
  };

  // Analyze images
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const totalImages = imgMatches.length;
  let imagesWithAlt = 0;
  
  imgMatches.forEach(img => {
    if (img.match(/alt=["'][^"']*["']/i)) {
      imagesWithAlt++;
    }
  });
  
  const imagesWithoutAlt = totalImages - imagesWithAlt;

  // Analyze links
  const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  let internalLinks = 0;
  
  linkMatches.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.startsWith('/') || href.includes(new URL(url).hostname)) {
        internalLinks++;
      }
    }
  });
  
  const externalLinks = linkMatches.length - internalLinks;

  // Calculate DETERMINISTIC SEO score
  const seoScore = calculateDeterministicSeoScore({
    title,
    metaDescription,
    metaKeywords,
    headings,
    images: { total: totalImages, withAlt: imagesWithAlt, withoutAlt: imagesWithoutAlt },
    loadTime,
  });

  // Generate issues and recommendations
  const { issues, recommendations } = generateAnalysisResults({
    title,
    metaDescription,
    metaKeywords,
    headings,
    images: { total: totalImages, withAlt: imagesWithAlt, withoutAlt: imagesWithoutAlt },
    loadTime,
    seoScore,
  });

  return {
    url,
    title,
    metaDescription,
    metaKeywords,
    headings,
    images: {
      total: totalImages,
      withAlt: imagesWithAlt,
      withoutAlt: imagesWithoutAlt,
    },
    links: {
      internal: internalLinks,
      external: externalLinks,
    },
    performance: {
      loadTime,
      size,
    },
    seoScore,
    issues,
    recommendations,
  };
}

// DETERMINISTIC scoring function
function calculateDeterministicSeoScore(data: any): number {
  let score = 0;

  // Title analysis (30 points max)
  if (data.title) {
    const titleLength = data.title.length;
    const title = data.title.toLowerCase();
    
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
    
    let keywordScore = 0;
    const hasBusinessKeywords = title.includes('business') || title.includes('company') || title.includes('service');
    const hasSeoKeywords = title.includes('seo') || title.includes('optimization') || title.includes('marketing');
    const hasTechKeywords = title.includes('web') || title.includes('digital') || title.includes('online');
    
    if (hasSeoKeywords) keywordScore += 5;
    if (hasBusinessKeywords) keywordScore += 3;
    if (hasTechKeywords) keywordScore += 2;
    
    score += lengthScore + keywordScore;
  }

  // Meta description analysis (25 points max)
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    const desc = data.metaDescription.toLowerCase();
    
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
    
    let ctaScore = 0;
    const ctaWords = ['click', 'visit', 'learn', 'discover', 'get', 'try', 'buy', 'download', 'start', 'join'];
    const foundCtas = ctaWords.filter(word => desc.includes(word));
    ctaScore = Math.min(foundCtas.length * 2, 10);
    
    score += lengthScore + ctaScore;
  }

  // Keywords analysis (10 points max)
  if (data.metaKeywords && data.metaKeywords.trim().length > 0) {
    const keywords = data.metaKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
    const keywordCount = keywords.length;
    
    if (keywordCount >= 3 && keywordCount <= 8) {
      score += 10;
    } else if (keywordCount >= 1 && keywordCount <= 12) {
      score += 6;
    } else if (keywordCount > 0) {
      score += 3;
    }
  }

  // Heading structure analysis (20 points max)
  if (data.headings) {
    const { h1, h2, h3 } = data.headings;
    
    if (h1.length === 1) {
      const h1Text = h1[0];
      if (h1Text.length >= 20 && h1Text.length <= 70) {
        score += 12;
      } else if (h1Text.length >= 10) {
        score += 8;
      } else {
        score += 4;
      }
    } else if (h1.length === 0) {
      score += 0;
    } else {
      score += 2;
    }
    
    if (h2.length >= 2 && h2.length <= 6) {
      score += 5;
    } else if (h2.length === 1) {
      score += 3;
    } else if (h2.length > 6) {
      score += 2;
    }
    
    if (h3.length > 0 && h3.length <= 10) {
      score += 3;
    }
  }

  // Image optimization analysis (10 points max)
  if (data.images) {
    const { total, withAlt } = data.images;
    if (total === 0) {
      score += 8;
    } else {
      const altRatio = withAlt / total;
      if (altRatio >= 0.95) {
        score += 10;
      } else if (altRatio >= 0.8) {
        score += 7;
      } else if (altRatio >= 0.6) {
        score += 4;
      } else if (altRatio >= 0.3) {
        score += 2;
      } else {
        score += 0;
      }
    }
  }

  // Performance analysis (5 points max)
  if (data.loadTime) {
    if (data.loadTime <= 800) {
      score += 5;
    } else if (data.loadTime <= 1500) {
      score += 4;
    } else if (data.loadTime <= 2500) {
      score += 3;
    } else if (data.loadTime <= 4000) {
      score += 2;
    } else if (data.loadTime <= 6000) {
      score += 1;
    } else {
      score += 0;
    }
  }

  return Math.min(score, 100);
}

function generateAnalysisResults(data: any) {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Title issues
  if (!data.title) {
    issues.push('Missing title tag');
    recommendations.push('Add a descriptive title tag (30-60 characters)');
  } else if (data.title.length < 30) {
    issues.push('Title too short');
    recommendations.push('Expand title to 30-60 characters for better SEO');
  } else if (data.title.length > 60) {
    issues.push('Title too long');
    recommendations.push('Shorten title to under 60 characters to prevent truncation');
  }

  // Meta description issues
  if (!data.metaDescription) {
    issues.push('Missing meta description');
    recommendations.push('Add a compelling meta description (120-155 characters)');
  } else if (data.metaDescription.length < 120) {
    issues.push('Meta description too short');
    recommendations.push('Expand meta description to 120-155 characters');
  } else if (data.metaDescription.length > 155) {
    issues.push('Meta description too long');
    recommendations.push('Shorten meta description to under 155 characters');
  }

  // Keywords issues
  if (!data.metaKeywords) {
    recommendations.push('Consider adding meta keywords for better content targeting');
  }

  // Heading issues
  if (data.headings.h1.length === 0) {
    issues.push('Missing H1 heading');
    recommendations.push('Add a single H1 heading to define page topic');
  } else if (data.headings.h1.length > 1) {
    issues.push('Multiple H1 headings found');
    recommendations.push('Use only one H1 heading per page');
  }

  if (data.headings.h2.length === 0) {
    recommendations.push('Add H2 headings to structure your content');
  }

  // Image issues
  if (data.images.total > 0 && data.images.withoutAlt > 0) {
    issues.push(`${data.images.withoutAlt} images missing alt text`);
    recommendations.push('Add descriptive alt text to all images for accessibility');
  }

  // Performance issues
  if (data.loadTime > 3000) {
    issues.push('Slow page loading speed');
    recommendations.push('Optimize images and reduce file sizes to improve loading speed');
  }

  return { issues, recommendations };
}