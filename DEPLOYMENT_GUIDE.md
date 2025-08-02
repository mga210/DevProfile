# GitHub Pages Deployment Guide

## Current Issue
Your GitHub Pages site at https://mga210.github.io/DevProfile/ is serving an older version that doesn't include the Counter.dev analytics script.

## Solution Steps

### Option 1: Push from Replit (Recommended)
1. Open the **Git** tab in Replit sidebar
2. Stage all changes (click the + button next to modified files)
3. Write a commit message: "Add Counter.dev analytics tracking"
4. Click **Commit** 
5. Click **Push** to send changes to GitHub
6. Wait 2-3 minutes for GitHub Pages to rebuild

### Option 2: Update directly on GitHub
1. Go to your repository: https://github.com/mga210/DevProfile
2. Navigate to `index.html`
3. Click the pencil icon to edit
4. Find line around 1196 and ensure it contains:
   ```html
   <!-- Counter.dev Analytics -->
   <script src="https://cdn.counter.dev/script.js" data-id="19dfa4e3-c717-41a3-845e-548fdd6d50e5" data-utcoffset="-5"></script>
   ```
5. Commit the changes

## Verification
After deployment:
1. Visit https://mga210.github.io/DevProfile/
2. Open browser developer tools (F12)
3. Check Network tab for `script.js` from `cdn.counter.dev`
4. Visit https://counter.dev/ to see if analytics are tracking

## Analytics Setup
- **Service**: Counter.dev
- **ID**: 19dfa4e3-c717-41a3-845e-548fdd6d50e5
- **Timezone**: UTC-5 (Central Time)
- **Dashboard**: https://counter.dev/

Once deployed, Counter.dev will track:
- Page views
- Unique visitors  
- Geographic data
- Referrer sources
- Real-time statistics

## Troubleshooting
If analytics still don't work after deployment:
1. Check browser console for errors
2. Verify the script loads in Network tab
3. Ensure ad blockers aren't blocking Counter.dev
4. Wait up to 10 minutes for first data to appear