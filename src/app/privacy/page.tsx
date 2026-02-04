import { Shield, Lock, Eye, Database, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your privacy is our priority. Learn how we protect your data.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Last updated: January 28, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account and use our SEO analysis services</li>
              <li>Subscribe to our paid plans through our payment processor</li>
              <li>Contact us for customer support</li>
              <li>Participate in surveys or promotional activities</li>
            </ul>
            <p>This may include your name, email address, payment information, and website URLs you analyze.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">How We Use Your Information</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our SEO analysis services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage patterns</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Data Security</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>We implement appropriate security measures to protect your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All data transmission is encrypted using SSL/TLS protocols</li>
              <li>Payment processing is handled by secure third-party processors</li>
              <li>Access to personal data is restricted to authorized personnel only</li>
              <li>Regular security audits and updates are performed</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Third-Party Services</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>We work with trusted third-party services to provide our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment Processing:</strong> Lemon Squeezy handles all payment transactions securely</li>
              <li><strong>Analytics:</strong> We may use analytics services to understand usage patterns</li>
              <li><strong>Cloud Infrastructure:</strong> Our services are hosted on secure cloud platforms</li>
            </ul>
            <p>These services have their own privacy policies and we encourage you to review them.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
            <p className="mt-4">
              <strong>Contact us:</strong> For any privacy-related questions or requests, please contact us at{' '}
              <a href="mailto:privacy@metalyz.ai" className="text-blue-600 hover:text-blue-700">
                privacy@metalyz.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}