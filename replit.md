# Overview

This is a professional AI Systems Developer portfolio website built with vanilla HTML, CSS, and JavaScript. The project showcases an AI developer's transformation from operations management to building intelligent automation systems. It features a strategic, role-aligned personal brand focused on AI workflow engineering, Python systems building, and operational intelligence.

## Recent Changes (July 31, 2025)
- ✅ Transformed portfolio from generic developer to AI Systems Developer brand
- ✅ Updated hero section with AI-focused positioning and typewriter animation
- ✅ Restructured skills into capability clusters (AI & LLM Systems, Python Development, Data & Dashboards, Workflow Automation)
- ✅ Added three hero projects: System Pilot, Blueprint Buddy, DMRB
- ✅ Updated experience timeline with actual operational background (MAA, RPM Living, First Choice/FSI/Universal Studios)
- ✅ Added Professional Endorsements section with testimonials
- ✅ Updated contact information and navigation to include new sections
- ✅ **PERSONALIZED CONTENT**: Integrated Miguel A. Gonzalez Almonte's actual information including:
  - Real contact details (sllm75@hotmail.com, 787-367-9843, Plano TX)
  - Authentic professional background and experience timeline
  - Actual projects (System Pilot, Blueprint Buddy, DMRB, Meta Code Sensei, Python Training Board)
  - Real skills and certifications (Google PM, Python for Everybody, EPA Section 608)
  - Current education status (Ana G. Méndez University BBA in Computer Information Systems)
  - Professional headshot photo replacing placeholder icons throughout the site

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static Website**: Pure HTML/CSS/JavaScript approach without any frameworks
- **Single Page Application (SPA)**: All content is contained in a single HTML file with smooth scrolling navigation
- **Responsive Design**: Mobile-first approach with CSS media queries for different screen sizes
- **Component-Based Structure**: Modular JavaScript functions for different features (navigation, animations, forms, etc.)

## File Structure
```
/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styling and responsive design
├── script.js           # JavaScript functionality and interactions
└── assets/             # Images and other static assets
    └── profile-icon.svg
```

# Key Components

## Navigation System
- **Fixed Navigation Bar**: Sticky header that changes appearance on scroll
- **Mobile Menu**: Hamburger menu for mobile devices with toggle functionality
- **Active Link Highlighting**: Uses Intersection Observer API to highlight current section
- **Smooth Scrolling**: CSS scroll-behavior and JavaScript-enhanced navigation

## Interactive Features
- **Typewriter Effect**: Animated text display for hero section
- **Scroll Animations**: Elements animate into view as user scrolls
- **Skill Progress Bars**: Animated skill level indicators
- **Contact Form**: Form validation and submission handling
- **Back to Top Button**: Smooth scroll to top functionality

## Section Layout
- **Hero Section**: Introduction with animated text
- **About Section**: Personal information and background
- **Skills Section**: Technical skills with progress indicators
- **Projects Section**: Portfolio showcase
- **Experience Section**: Work history and achievements
- **Contact Section**: Contact form and information

# Data Flow

## User Interactions
1. **Page Load**: DOM content loaded event initializes all components
2. **Navigation**: Click events trigger smooth scrolling to sections
3. **Scroll Events**: Window scroll triggers navbar effects and section highlighting
4. **Form Submission**: Contact form validation and submission handling
5. **Mobile Menu**: Toggle events for responsive navigation

## Animation Pipeline
1. **Intersection Observer**: Detects when elements enter viewport
2. **CSS Classes**: JavaScript adds/removes classes to trigger CSS animations
3. **Scroll-based Effects**: Navbar transparency and back-to-top button visibility

# External Dependencies

## CDN Resources
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library for UI elements and social media icons

## Browser APIs
- **Intersection Observer API**: For scroll-based animations and navigation highlighting
- **DOM API**: For element manipulation and event handling
- **Form API**: For contact form validation and submission

# Deployment Strategy

## Static Hosting Ready
- **No Build Process**: Direct deployment of source files
- **CDN Compatible**: All external resources loaded via CDN
- **Platform Agnostic**: Can be deployed on any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Performance Considerations
- **Minimal Dependencies**: Only essential external resources
- **CSS/JS Bundling**: Single files for easy caching
- **Image Optimization**: SVG icons for scalability
- **Lazy Loading**: Intersection Observer for performance optimization

## Browser Compatibility
- **Modern Browser Support**: Uses ES6+ features and modern CSS
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Graceful Degradation**: Core functionality works without JavaScript