# Dustin Christlieb | Sr. Cloud Architect

## Portfolio Website

Personal portfolio and professional website at `https://dchristlieb.github.io/dustinchristlieb.com`.

## Overview

This is a static, vanilla HTML/CSS/JavaScript portfolio website hosted on GitHub Pages. Built without any frameworks, it showcases:

- **Professional profile** as a Senior Cloud Architect
- **Featured projects** including DoiT AdminPulse for Workspace and E350 Travel Hub
- **Certifications** wall with 19 industry certifications across 7 vendors
- **Education** history (WGU & Glendale Community College)
- **Connect section** with social links (GitHub, Medium, Google Developer, Instagram, Steam)
- **Command palette** (Ctrl+K or Cmd+K) for quick navigation

## Features

### Navigation
- Sticky navbar with theme toggle
- Mobile-responsive menu (hamburger → close button)
- Smooth scrolling for internal links
- Skip links for accessibility

### Command Palette (Ctrl+K / Cmd+K)
- Quick navigation to sections, profiles, and theme toggling
- Accessible dialog with `aria-modal="true"`
- **Fixed**: Overlay now properly respects the `hidden` attribute (see Fix section below)

### Certifications
- Dynamic grid layout with responsive columns
- Vendor filtering (All, CompTIA, Google, ISC2, Jamf, JumpCloud, Rippling, AWS)
- Live verification links to Credly badges
- 19 certifications across 7 vendors

### Projects
- Horizontal scrollable track with card peek effect
- Two featured projects: DoiT AdminPulse and E350 Travel Hub
- Tech stack badges and external links

### Connect
- Social media links: GitHub, Medium, Google Developer, Instagram, Steam
- LinkedIn profile link
- Kopimi animation gif

### Theme Toggle
- Light/dark mode switch using `prefers-color-scheme`
- Persists in localStorage

## Technical Stack

- **HTML5** with Schema.org Person markup
- **CSS3** with CSS variables (custom properties)
- **Vanilla JavaScript** (no frameworks)
- **Font Awesome 6.5.1** for icons
- **Google Fonts**: Poppins
- **GitHub Pages** deployment
- **Google Tag Manager**: `G-CNMKY87H40`

## Fix: Palette Overlay Hidden Attribute

### Issue
The command palette (opened with Ctrl+K or Cmd+K) would pop up when the website opens and could not be closed. The root cause was that `.palette-overlay` sets `display: flex`, which overrides the browser's native `display: none` that the `hidden` attribute triggers.

### Solution
Added CSS rule to ensure the palette overlay respects the `hidden` attribute:

```css
/* Ensure palette overlay respects the hidden attribute */
.palette-overlay[hidden] {
    display: none !important;
}
```

This fix was already partially in place from a previous commit (dbd796a) which added a global `[hidden] { display: none !important; }` rule. The more specific `.palette-overlay[hidden]` rule provides targeted handling for the command palette overlay.

### Commit
- `4431ea6` - Fix: Ensure palette overlay respects the hidden attribute

## Local Development

```bash
# Clone the repository
git clone https://github.com/dchristlieb/dustinchristlieb.com.git

# Navigate to the project
cd dustinchristlieb.com

# No build step - just open index.html in a browser
# Or start local development
npm start  # (if camofox is set up)
```

## Deployment

This site is automatically deployed to GitHub Pages on every push to the `main` branch via the GitHub Actions workflow.

## License

Personal portfolio - all rights reserved. © 2026 Dustin Christlieb.