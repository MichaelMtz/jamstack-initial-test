# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` or `npx @11ty/eleventy` - Builds the site using Eleventy
- **Development server**: `npm start` - Starts Eleventy development server with live reload
- **Lint**: `npx eslint .` - Runs ESLint on JavaScript files

## Project Architecture

This is a JAMstack site built with Eleventy (11ty) static site generator for SnoCountry, a ski resort information website.

### Core Structure

- **Static Site Generator**: Eleventy v0.12.1
- **Deployment**: Netlify (configured via `netlify.toml`)
- **Output**: Files built to `dist/` directory
- **Source**: All source files in `src/` directory

### Key Directories

- `src/_data/` - Eleventy data files including resort information and helper functions
- `src/_functions/` - Netlify Functions for API endpoints (e.g., resort data, news feeds)
- `src/_includes/` - Eleventy template partials and layouts (.njk files)
- `src/assets/` - Static assets (CSS, JS, images, fonts) passed through to output

### Data Architecture

The site centers around ski resort data:

- `src/_data/resorts.js` - Main data processing for resort information
- `src/_data/resorts.json` - Raw resort data 
- `src/_data/breadcrumbs.json` - Navigation breadcrumb structure
- Resort pages generated dynamically with state/region organization

### Netlify Functions

API endpoints in `src/_functions/` handle:
- Home page open resorts data
- Recent stories and news
- Snow report data and archives
- Region-specific resort information

### Templates

Uses Nunjucks (.njk) templating with layouts for:
- Resort pages with snow reports
- News articles and listings
- State/region listing pages
- Homepage with dynamic resort data

### Styling

CSS organized by component:
- `sno-core.scss` - Base styles
- Component-specific SCSS files (home-page, resort-page, etc.)
- Compiled CSS in `assets/css/`

The codebase follows a content-first architecture where resort and weather data drives page generation, with Netlify Functions providing dynamic API capabilities for real-time information.