# 🚀 Metalyz Deployment Guide

## Vercel Deployment (Recommended)

### Method 1: One-Click Deploy
1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: metalyz
# - Directory: ./
# - Override settings? N
```

## Environment Variables Setup

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```env
NEXT_PUBLIC_APP_NAME=Metalyz
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

## Custom Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain (e.g., metalyz.com)
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Production Checklist

### Before Deployment
- [ ] Run `npm run build` locally to test
- [ ] Check all environment variables are set
- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Test forgot password functionality
- [ ] Verify mobile responsiveness

### After Deployment
- [ ] Test live URL
- [ ] Verify SSL certificate
- [ ] Test all authentication flows
- [ ] Check performance with Lighthouse
- [ ] Test on different devices/browsers
- [ ] Set up monitoring/analytics

## Performance Optimization

The app is already optimized with:
- ✅ Next.js 16 with Turbopack
- ✅ Static generation where possible
- ✅ Optimized images and fonts
- ✅ Code splitting
- ✅ Compressed assets

## Security Features

- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure authentication

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Automatically enabled for performance monitoring
- Real-time visitor analytics
- Core Web Vitals tracking

### Optional: Google Analytics
Add to environment variables:
```env
NEXT_PUBLIC_GA_ID=your_ga_id_here
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check Vercel dashboard for typos

### Authentication Issues
- Verify all auth-related environment variables
- Check browser console for errors
- Test in incognito mode

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Test locally with `npm run build && npm start`
4. Contact support: support@metalyz.io

---

**🎉 Congratulations! Metalyz is now live and ready to help users optimize their SEO!**