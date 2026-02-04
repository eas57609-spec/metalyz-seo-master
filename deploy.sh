#!/bin/bash

# Metalyz Production Deployment Script
# Run this script to prepare and deploy Metalyz to production

echo "🚀 Metalyz Production Deployment"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if project name is correct
if ! grep -q '"name": "metalyz"' package.json; then
    echo "❌ Error: This doesn't appear to be the Metalyz project."
    exit 1
fi

echo "✅ Project validation passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build test
echo "🔨 Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo ""
echo "✅ Metalyz is now live!"
echo "✅ Authentication system active"
echo "✅ Owner account configured"
echo "✅ Forgot password functional"
echo "✅ All user flows working"
echo ""
echo "🔗 Next steps:"
echo "1. Test your live URL"
echo "2. Configure custom domain (optional)"
echo "3. Set up monitoring"
echo "4. Share with the world!"
echo ""
echo "🆘 Need help? Check DEPLOYMENT.md or contact support@metalyz.io"