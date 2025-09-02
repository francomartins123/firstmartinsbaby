# First Martins Baby - Guessing Game Website

A fun, interactive website where family members can submit their predictions for the new baby and see everyone else's guesses displayed as beautiful flowers in a digital garden.

## 🌸 Project Overview

**Due Date:** October 14th, 2025  
**Live Website:** firstmartinsbaby.com  
**Status:** ✅ Fully operational

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Database:** Supabase (PostgreSQL with real-time features)
- **Deployment:** Vercel (auto-deploys from GitHub)
- **Real-time:** Supabase subscriptions for live updates

## 📊 Database Configuration

**Supabase Project Details:**
- URL: `https://nldazeppgrqnzxpiicrw.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE`
- Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0MDU3MSwiZXhwIjoyMDcyMzE2NTcxfQ.1r9ogiANAuXT8o2xBBHD47W6k9CEBOkwV4vCsGJg57Q` (for admin operations)

## 🎯 Features & User Flow

### Page 1: Entry Page (`index.html`)
- Name input with duplicate checking
- Automatic progression to guessing page

### Page 2: Guessing Page (`guessing.html`)
**7 Prediction Categories:**
1. **Due Date** - Date picker (displays exactly as selected)
2. **Weight** - Slider (4.0 - 12.0 lbs)
3. **Middle Name** - Text input
4. **Birth Time** - Time picker with AM/PM
5. **Eye Color** - Radio buttons (Blue, Brown, Green, Hazel)
6. **Hair Color** - Radio buttons (Blonde, Brown, Black, Bald)
7. **Length** - Dropdown (inches)

### Page 3: Results Garden (`results.html`)
- Each participant shown as a unique flower
- Real-time updates when new predictions are submitted
- Flower garden background that repeats seamlessly
- Responsive design for all screen sizes

## 🌺 Current Participants

As of last update: **Julia**, **Elise**, and **Franco** have submitted predictions.

## 🎨 File Structure
```
/
├── index.html          # Entry page (name input)
├── guessing.html       # Prediction submission page
├── results.html        # Flower garden results
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript functionality
├── supabase.js         # Database connection and queries
├── flower garden background.png  # Background image
└── README.md           # This file
```

## ✅ Fully Working Features

- ✅ Name entry with duplicate prevention
- ✅ 7-category prediction form with validation
- ✅ Beautiful flower garden results display
- ✅ Real-time updates as new people submit
- ✅ Date display shows exactly what users selected
- ✅ Flower stems and petals properly layered and visible
- ✅ Seamless repeating background
- ✅ Mobile and desktop responsive
- ✅ Auto-deployment via Vercel + GitHub

## 🔧 For Future Development

**To add/remove participants manually:**
```javascript
// Use service role key for direct database access via REST API
// Example: Delete a participant and all their guesses
```

**GitHub Repository:** https://github.com/francomartins123/firstmartinsbaby
- Push to `main` branch auto-deploys to live website
- All changes immediately reflected on firstmartinsbaby.com

## 🚀 Deployment

The website auto-deploys to Vercel when changes are pushed to the GitHub repository. The live site is fully functional and ready for family use!

🍼✨ **Ready for predictions!** ✨🍼