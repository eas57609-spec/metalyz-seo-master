'use client';

import { useState } from 'react';
import MetaForm from '@/components/MetaForm';
import MetaPreview from '@/components/MetaPreview';
import { generateMetaTags, type MetaGenerationRequest, type GeneratedMetaTags } from '@/lib/ai-service';
import { useProjectStore } from '@/lib/store';

export default function GeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<GeneratedMetaTags | null>(null);
  const [formData, setFormData] = useState<MetaGenerationRequest>({
    websiteUrl: '',
    businessDescription: '',
    targetKeywords: '',
    tone: 'professional',
    metaTitle: '',
    metaDescription: '',
  });
  const [previewData, setPreviewData] = useState({
    title: 'Your Page Title Will Appear Here',
    description: 'Your meta description will appear here. This is what users will see in search results to understand what your page is about.',
    url: 'https://example.com',
    keywords: [] as string[]
  });
  
  const addProject = useProjectStore((state) => state.addProject);

  const handleFormSubmit = async (submittedData: MetaGenerationRequest) => {
    setIsLoading(true);
    
    // Update preview immediately with form data
    setPreviewData({
      title: submittedData.metaTitle || 'Generating...',
      description: submittedData.metaDescription || 'AI is generating your meta description...',
      url: submittedData.websiteUrl,
      keywords: submittedData.targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    });
    
    try {
      const response = await generateMetaTags(submittedData);
      
      if (response.success && response.data) {
        setGeneratedTags(response.data);
        
        // Update form data with AI generated content
        const updatedFormData = {
          ...submittedData,
          metaTitle: response.data.title,
          metaDescription: response.data.description,
        };
        setFormData(updatedFormData);
        
        // Update preview with AI generated data
        setPreviewData({
          title: response.data.title,
          description: response.data.description,
          url: submittedData.websiteUrl,
          keywords: response.data.keywords
        });
        
        // Save to store
        addProject({
          title: response.data.title,
          url: submittedData.websiteUrl,
          description: submittedData.businessDescription,
          keywords: response.data.keywords,
          tone: submittedData.tone,
          seoScore: response.data.seoScore,
          metaTags: {
            title: response.data.title,
            description: response.data.description,
            keywords: response.data.keywords,
          }
        });
        
        // Show success notification
        alert('🎉 Analysis Complete! Your meta tags are ready. Check Dashboard for updated stats.');
        
      } else {
        console.error('Failed to generate meta tags:', response.error);
        alert('⚠️ Generation failed. Please check your inputs and try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Something went wrong. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Meta Tag Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create high-converting meta tags that boost your search rankings
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <MetaForm 
            onSubmit={handleFormSubmit} 
            loading={isLoading}
            initialData={formData}
          />
        </div>

        {/* Right Column - Preview */}
        <div>
          <MetaPreview
            title={previewData.title}
            description={previewData.description}
            url={previewData.url}
            keywords={previewData.keywords}
          />
        </div>
      </div>

      {/* Generated Results */}
      {generatedTags && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              🚀 Tags Generated Successfully - Ready to Deploy!
            </h3>
            <button
              onClick={() => {
                const htmlCode = `<title>${generatedTags.title}</title>
<meta name="description" content="${generatedTags.description}" />
<meta name="keywords" content="${generatedTags.keywords.join(', ')}" />

<!-- Open Graph / Facebook -->
<meta property="og:title" content="${generatedTags.ogTitle || generatedTags.title}" />
<meta property="og:description" content="${generatedTags.ogDescription || generatedTags.description}" />

<!-- Twitter -->
<meta name="twitter:title" content="${generatedTags.twitterTitle || generatedTags.title}" />
<meta name="twitter:description" content="${generatedTags.twitterDescription || generatedTags.description}" />`;
                navigator.clipboard.writeText(htmlCode);
                alert('📋 HTML code copied! Ready to paste into your website.');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              📋 Copy HTML
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
{`<title>${generatedTags.title}</title>
<meta name="description" content="${generatedTags.description}" />
<meta name="keywords" content="${generatedTags.keywords.join(', ')}" />

<!-- Open Graph / Facebook -->
<meta property="og:title" content="${generatedTags.ogTitle || generatedTags.title}" />
<meta property="og:description" content="${generatedTags.ogDescription || generatedTags.description}" />

<!-- Twitter -->
<meta name="twitter:title" content="${generatedTags.twitterTitle || generatedTags.title}" />
<meta name="twitter:description" content="${generatedTags.twitterDescription || generatedTags.description}" />`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}