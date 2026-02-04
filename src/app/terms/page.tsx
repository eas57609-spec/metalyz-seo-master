import { FileText, Scale, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Please read these terms carefully before using our services.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Last updated: January 28, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Acceptance of Terms</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              By accessing and using Metalyz ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms of Service ("Terms") govern your use of our AI-powered SEO analysis platform and 
              related services provided by Metalyz.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Service Description</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>Metalyz provides:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-powered SEO meta tag generation and optimization</li>
              <li>Website analysis and SEO scoring</li>
              <li>Performance tracking and reporting tools</li>
              <li>Premium features through subscription plans</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the service at any time 
              with reasonable notice to users.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Subscription and Billing</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p><strong>Free Plan:</strong> Limited access to basic features with usage restrictions.</p>
            <p><strong>Paid Plans:</strong> Full access to premium features with the following terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed monthly or annually in advance</li>
              <li>All payments are processed securely through Lemon Squeezy</li>
              <li>Refunds are available within 30 days of purchase</li>
              <li>You may cancel your subscription at any time</li>
              <li>Upon cancellation, access continues until the end of the billing period</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">User Responsibilities</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Use the service only for lawful purposes and in accordance with these Terms</li>
              <li>Not attempt to reverse engineer, hack, or compromise our systems</li>
              <li>Not use the service to analyze websites you don't own without permission</li>
              <li>Respect usage limits and fair use policies</li>
              <li>Keep your account credentials secure and confidential</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Limitation of Liability</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              The service is provided "as is" without warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service will be uninterrupted or error-free</li>
              <li>SEO recommendations will guarantee improved search rankings</li>
              <li>All website analysis will be 100% accurate</li>
            </ul>
            <p>
              Our liability is limited to the amount you paid for the service in the 12 months 
              preceding any claim.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> <a href="mailto:legal@metalyz.ai" className="text-blue-600 hover:text-blue-700">legal@metalyz.ai</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@metalyz.ai" className="text-blue-600 hover:text-blue-700">support@metalyz.ai</a></li>
            </ul>
            <p className="text-sm mt-4">
              These terms are effective as of the last updated date and will remain in effect until modified or terminated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}