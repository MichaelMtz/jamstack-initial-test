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

## API Endpoints

### Public HTTP Endpoints

#### GET /api/ads
Retrieve active ads for a specific region or resort.

**Query Parameters:**
- `region` (optional): Target region (e.g., "colorado", "utah")
  - If (document.body.dataset.source is not "resort")  then use document.body.dataset.snowreport as the "region" value
- `resortId` (optional): Specific resort ID (e.g., "303001")
  - If (document.body.dataset.source is "resort")  then use document.body.dataset.snowreport as the "resortId" value

**Example Request:**
```bash
curl "https://affable-hummingbird-827.convex.site/api/ads?region=colorado"
curl "https://affable-hummingbird-827.convex.site/api/ads?resortId=303023"
```

**Example Response:**
```json
{
  "ads": [
    {
      "_id": "ad123",
      "name": "Winter Gear Sale",
      "imageUrl": "https://storage.url/image.jpg",
      "linkUrl": "https://ad.doubleclick.net/ddm/trackclk/N5320.1214838SNOCOUNTRY.COM/B33862223.426546645;dc_trk_aid=619042053;dc_trk_cid=238863989;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ltd=;dc_tdv=1",

      "trackingPixelUrl": "https://ad.doubleclick.net/ddm/trackimp/N5320.1214838SNOCOUNTRY.COM/B33862223.426546645;dc_trk_aid=619042053;dc_trk_cid=238863989;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ltd=;dc_tdv=1?",
      "regions": ["colorado", "utah"],
      "startDate": "2024-01-01",
      "endDate": "2024-03-31"
    }
  ]
}
```

#### POST /api/track/page-impression
Track a web page impression.

#### POST /api/track/ad-impression  
Track an ad impression.

#### POST /api/track/ad-click
Track an ad click.