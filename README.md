# First Martins Baby - Guessing Game Website

A fun, interactive website where family members can submit their predictions for the new baby and see everyone else's guesses displayed as beautiful flowers in a digital garden.

## 🌸 Project Overview

**Due Date:** October 14th, 2025  
**Expected Users:** ~40 family members  
**Domain:** firstmartinsbaby.com  

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Database:** Supabase (PostgreSQL with real-time features)
- **Styling:** Fredoka font family with cute/friendly design
- **Deployment:** Vercel
- **Real-time:** Supabase subscriptions for live updates

## 📊 Database Configuration

**Supabase Project Details:**
- URL: `https://nldazeppgrqnzxpiicrw.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE`

**Database Schema:**

### participants table
```sql
- id (uuid, primary key, auto-generated)
- name (text, not null)
- email (text, not null, unique)
- submitted_at (timestamp, auto-generated)
- locked_in (boolean, default false)
```

### guesses table
```sql
- id (uuid, primary key, auto-generated)
- participant_id (uuid, foreign key to participants.id)
- question_type (text, not null) -- 'due_date', 'weight', 'middle_name', etc.
- guess_value (text, not null) -- stores all values as text for flexibility
- created_at (timestamp, auto-generated)
```

## 🎯 Features & User Flow

### Page 1: Entry Page
- Simple, cute design with baby theme
- Input fields: Name and Email
- Validation to prevent duplicates
- Fredoka font with playful styling

### Page 2: Guessing Page
**7 Prediction Categories:**
1. **Due Date** - Date picker (range: Sept 1 - Nov 30, 2025)
2. **Weight** - Slider/dropdown (4.0 - 12.0 lbs, 0.25 lb increments)
3. **Middle Name** - Text input (free form)
4. **Time of Birth** - Time picker with AM/PM
5. **Eye Color** - Radio buttons (Blue, Brown, Green, Hazel)
6. **Hair Color** - Radio buttons (Blonde, Brown, Black, Bald)
7. **Length** - Dropdown (16-24 inches)

### Page 3: Results Garden
- Each participant represented by a unique flower
- Flowers randomly positioned across the screen
- Each flower shows participant's name and key predictions
- Real-time updates as new people submit guesses
- Mobile and desktop responsive
- Static positioning (no animations initially)

## 🌺 Design Specifications

### Typography
- **Primary Font:** Fredoka (Google Fonts)
- **Font Weights:** Light (300), Regular (400), Medium (500), Bold (700)
- **Font Sizes:** Varied for hierarchy and playfulness

### Color Scheme
- Soft pastels with baby-friendly colors
- Pink/blue accents without being overly gendered
- Gentle gradients and soft shadows

### Flower Variations
- Multiple distinct flower designs (tulips, daisies, sunflowers, roses, etc.)
- Each participant gets a randomly assigned flower type
- Flowers have different colors and styles
- Responsive sizing for mobile/desktop

## 🚀 Implementation Plan

### Phase 1: Database Setup
1. Create Supabase tables (participants, guesses)
2. Set up Row Level Security (RLS) policies
3. Configure real-time subscriptions
4. Test database connections

### Phase 2: Frontend Foundation
1. Replace current basic site with new structure
2. Set up Supabase client connection
3. Implement Fredoka font and base styling
4. Create responsive layout system

### Phase 3: Page Development
1. **Entry Page**
   - Name/email form
   - Input validation
   - Cute baby-themed design
   - Navigate to guessing page

2. **Guessing Page**
   - 7 prediction input components
   - Form validation for all fields
   - Submit functionality
   - Lock-in mechanism

3. **Results Page**
   - Query all submitted guesses
   - Generate unique flowers for each participant
   - Random positioning system
   - Real-time updates via Supabase subscriptions

### Phase 4: Polish & Testing
1. Mobile responsiveness testing
2. Cross-browser compatibility
3. Performance optimization
4. Final styling touches
5. User experience testing

### Phase 5: Deployment
1. Push to GitHub repository
2. Deploy to Vercel
3. Configure custom domain
4. Final production testing

## 📝 Notes

- **No editing:** Once guesses are submitted, they're final
- **Real-time updates:** Results page updates live as new people submit
- **Duplicate prevention:** Email addresses must be unique
- **Responsive design:** Works on mobile and desktop
- **Static flowers:** No complex animations, just beautiful positioning

## 🎨 File Structure
```
/
├── index.html          # Entry page (name/email)
├── guessing.html       # Prediction submission page
├── results.html        # Flower garden results
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript functionality
├── supabase.js         # Database connection and queries
└── README.md           # This file
```

## 🚀 Current Status

### ✅ Completed Features
- ✅ Supabase database setup with participants and guesses tables
- ✅ Entry page with name/email form and validation
- ✅ Guessing page with 7 prediction categories
- ✅ Results page with interactive flower garden
- ✅ Fredoka font integration and baby-themed styling
- ✅ Mobile-responsive design
- ✅ GitHub repository and Vercel deployment

### ⚠️ Known Issues
- **Form submission bug**: Entry form clears but doesn't navigate to guessing page
- **Status**: Debugging in progress with console logging added
- **Test button**: Green button added to isolate navigation vs database issues

### 🔧 Next Steps for New Developer
1. **Test navigation**: Try the green "Test Navigation" button on entry page
2. **Check console**: Open browser DevTools (F12) → Console when submitting form
3. **Verify Supabase**: Check dashboard for any test data and delete if present
4. **Debug logs**: Look for detailed console messages during form submission

### 📱 Live Website
- **Domain**: firstmartinsbaby.com
- **GitHub**: https://github.com/francomartins123/firstmartinsbaby
- **Auto-deploys**: Via Vercel when pushing to main branch

Ready to debug and launch! 🍼✨