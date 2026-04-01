const DEFAULT_OPENING_WEEKDAY = { opens: '09:00', closes: '16:00' };
const DEFAULT_OPENING_WEEKEND = { opens: '08:00', closes: '16:00' };

function tokenToHHMM(token) {
    const t = token.trim();
    const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
        const h = parseInt(m24[1], 10);
        const min = parseInt(m24[2], 10);
        if (h > 23 || min > 59) return null;
        return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
    }
    const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(a(?:m)?|p(?:m)?)?$/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    const ap = (m[3] || '').toLowerCase();
    if (min > 59 || h > 23) return null;
    if (!m[3]) {
        return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
    }
    if (ap.startsWith('p') && h !== 12) h += 12;
    if (ap.startsWith('a') && h === 12) h = 0;
    if (h > 23) return null;
    return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
}

// e.g. "Mon-Fri: 9a-4p", "Sat/Sun: 9a-4p" → { opens, closes } HH:MM 24h
function parseResortHoursRange(hoursString) {
    if (!hoursString || typeof hoursString !== 'string') return null;
    const s = hoursString.trim();
    if (!s || /not available/i.test(s)) return null;
    const rangeRe = /(\d{1,2}(?::\d{2})?\s*(?:a(?:m)?|p(?:m)?)?)\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:a(?:m)?|p(?:m)?)?)/i;
    const m = s.match(rangeRe);
    if (!m) return null;
    const opens = tokenToHHMM(m[1]);
    const closes = tokenToHHMM(m[2]);
    if (!opens || !closes) return null;
    return { opens, closes };
}

// /snow-report/{state}/{resort}/ → state listing URL, title-cased state label, resort slug
function parseSnowReportPageUrl(pageHref) {
    const href = pageHref != null ? String(pageHref) : window.location.href;
    const urlObj = new URL(href);
    const pathSegments = urlObj.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    let pageURL = href;
    let stateListingName = '';
    let resortSlug = '';
    if (pathSegments[0] === 'snow-report' && pathSegments.length >= 3) {
        resortSlug = pathSegments[pathSegments.length - 1];
        const stateSlug = pathSegments[1];
        stateListingName = stateSlug.split(/-/g).map(function (w) {
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(' ');
        const parentSegments = pathSegments.slice(0, -1);
        urlObj.pathname = '/' + parentSegments.join('/') + '/';
        urlObj.search = '';
        urlObj.hash = '';
        pageURL = urlObj.href;
    }
    return { href, pageURL, stateListingName, resortSlug };
}

// e.g. "305 Ski Run Road, Red Lodge , MT 59068" → US/CA heuristic; returns plain fields (no JSON)
function getPostalAddressForSchema(resortAddress) {
    const empty = { streetAddress: '', addressLocality: '', addressRegion: '', postalCode: '' };
    if (resortAddress == null || typeof resortAddress !== 'string') return empty;
    const raw = String(resortAddress).replace(/^,\s*,\s*/, '').trim();
    if (!raw) return empty;

    const usTail = raw.match(/^(.*),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)\s*$/);
    if (usTail) {
        const left = usTail[1].trim();
        const region = usTail[2].toUpperCase();
        const postal = usTail[3];
        const lastComma = left.lastIndexOf(',');
        let street;
        let locality;
        if (lastComma === -1) {
            street = left;
            locality = '';
        } else {
            street = left.slice(0, lastComma).trim();
            locality = left.slice(lastComma + 1).trim();
        }
        return { streetAddress: street, addressLocality: locality, addressRegion: region, postalCode: postal };
    }

    const caTail = raw.match(/^(.*),\s*([A-Za-z]{2})\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)\s*$/i);
    if (caTail) {
        const left = caTail[1].trim();
        const region = caTail[2].toUpperCase();
        const postal = caTail[3].replace(/\s+/g, ' ').trim().toUpperCase();
        const lastComma = left.lastIndexOf(',');
        let street;
        let locality;
        if (lastComma === -1) {
            street = left;
            locality = '';
        } else {
            street = left.slice(0, lastComma).trim();
            locality = left.slice(lastComma + 1).trim();
        }
        return { streetAddress: street, addressLocality: locality, addressRegion: region, postalCode: postal };
    }

    return { streetAddress: raw, addressLocality: '', addressRegion: '', postalCode: '' };
}

function hasAdditionalPropValue(val) {
    if (val == null) return false;
    if (typeof val === 'number') return !Number.isNaN(val);
    return String(val).trim() !== '';
}

function formatMinMaxRange(min, max) {
    const a = hasAdditionalPropValue(min) ? String(min).trim() : '';
    const b = hasAdditionalPropValue(max) ? String(max).trim() : '';
    if (a && b) return a + ' - ' + b;
    if (a) return a;
    if (b) return b;
    return '';
}

function getAdditionalProperties(data) {
    if (!data) return [];
    const props = [];

    if (data.resortStatus !== '1') {
      props.push({
        '@type': 'PropertyValue',
        name: 'Operating Status',
        value: data.operatingStatus
      });
      return props;
    }
    const fields = [
        { kind: 'range', name: 'New Snow 24h', minKey: 'newSnowMin', maxKey: 'newSnowMax', unitCode: 'INH' },
        { kind: 'range', name: 'Base Depth', minKey: 'baseDepthMin', maxKey: 'baseDepthMax', unitCode: 'INH' },
        { kind: 'scalar', name: 'Snow Surface', key: 'primarySurfaceCondition' },
        { kind: 'scalar', name: 'Current Weather', key: 'forecastWeather' },
        { kind: 'scalar', name: 'Temperature', key: 'forecastTopTemp', unitCode: 'FAH' },
        { kind: 'count', name: 'Trails Open', valueKey: 'openDownHillTrails', maxKey: 'maxOpenDownHillTrails' },
        { kind: 'count', name: 'Lifts Open', valueKey: 'openDownHillLifts', maxKey: 'maxOpenDownHillLifts' },
        { kind: 'number', name: 'Vertical Drop', key: 'verticalDrop', unitText: 'ft' }
    ];
    fields.forEach(function (f) {
        if (f.kind === 'range') {
            const value = formatMinMaxRange(data[f.minKey], data[f.maxKey]);
            if (!value) return;
            props.push({
                '@type': 'PropertyValue',
                name: f.name,
                value: value,
                unitCode: f.unitCode
            });
            return;
        }
        if (f.kind === 'scalar') {
            if (!hasAdditionalPropValue(data[f.key])) return;
            const entry = {
                '@type': 'PropertyValue',
                name: f.name,
                value: String(data[f.key]).trim()
            };
            if (f.unitCode) entry.unitCode = f.unitCode;
            props.push(entry);
            return;
        }
        if (f.kind === 'count') {
            const openVal = data[f.valueKey];
            const maxVal = data[f.maxKey];
            if (!hasAdditionalPropValue(openVal) && !hasAdditionalPropValue(maxVal)) return;
            const entry = {
                '@type': 'PropertyValue',
                name: f.name,
                value: hasAdditionalPropValue(openVal) ? String(openVal).trim() : String(maxVal).trim()
            };
            if (hasAdditionalPropValue(openVal) && hasAdditionalPropValue(maxVal)) {
                entry.maxValue = String(maxVal).trim();
            }
            props.push(entry);
            return;
        }
        if (f.kind === 'number') {
            const raw = data[f.key];
            if (!hasAdditionalPropValue(raw)) return;
            const num = Number(raw);
            if (Number.isNaN(num)) return;
            const entry = {
                '@type': 'PropertyValue',
                name: f.name,
                value: num
            };
            if (f.unitText) entry.unitText = f.unitText;
            props.push(entry);
        }
    });
    return props;
}

document.addEventListener('DOMContentLoaded', function () {
    function openTrailMapModal() {
        document.getElementById('trailMapModal').classList.remove('hidden');
        document.getElementById('trailMapModal').classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    document.getElementById('trailMapDesktop').addEventListener('click', openTrailMapModal);

    function closeTrailMapModal() {
        document.getElementById('trailMapModal').classList.add('hidden');
        document.getElementById('trailMapModal').classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    document.querySelector('.closeTrailMapModal').addEventListener('click', closeTrailMapModal);
    
    
    
    const createResortGeoSDL = () => {
        const data = window.snoResortData;
        if (!data) {
          return;
        }
        const { href, pageURL, stateListingName, resortSlug } = parseSnowReportPageUrl();
        console.log('*** sdl:', data, 'resortSlug:', resortSlug, 'stateListing:', pageURL);

        const weekdayOH = parseResortHoursRange(data.weekdayHours) || DEFAULT_OPENING_WEEKDAY;
        const weekendOH = parseResortHoursRange(data.weekendHours) || DEFAULT_OPENING_WEEKEND;
        const additionalPropertyJson = JSON.stringify(getAdditionalProperties(data));
        let { streetAddress, addressLocality, addressRegion, postalCode } = getPostalAddressForSchema(data.resortAddress);
        const sdl = `
        <script type="application/ld+json">        
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "${window.location.href}#webpage",
              "url": "${window.location.href}",
              "name": "${data.resortName} Snow Report and Weather Conditions",
              "description": "Daily snow conditions, weather updates, open trails, and lift status for ${data.resortName} in ${stateListingName}.",
              "isPartOf": { "@id": "https://snocountry.com/#website" },
              "breadcrumb": { "@id": "${window.location.href}#breadcrumb" },
              "mainEntity": { "@id": "${window.location.href}#resort" }
            },
            {
              "@type": "SkiResort",
              "@id": "${window.location.href}#resort",
              "name": "${data.resortName}",
              "url": "${window.location.href}",
              "image": "https://snocountry.com/assets/images/resorts/trail-maps/${data.id}.jpg",
              "telephone": "${data.snowPhone}",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "${streetAddress}",
                "addressLocality": "${addressLocality}",
                "addressRegion": "${addressRegion}",
                "postalCode": "${postalCode}",
                "addressCountry": "${data.country}"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "${data.latitude}",
                "longitude": "${data.longitude}"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "${weekdayOH.opens}",
                  "closes": "${weekdayOH.closes}"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "${weekendOH.opens}",
                  "closes": "${weekendOH.closes}"
                }
              ],
              "additionalProperty": ${additionalPropertyJson}
            },
            {
              "@type": "BreadcrumbList",
              "@id": "${href}#breadcrumb",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://snocountry.com/" },
                { "@type": "ListItem", "position": 2, "name": "${stateListingName}", "item": "${pageURL}" },
                { "@type": "ListItem", "position": 3, "name": "${data.resortName} Snow Conditions", "item": "${href}" }
              ]
            }
          ]
        }
        
        
        </script>
        `;
        document.querySelector('head').insertAdjacentHTML('beforeend',sdl);
    };

    function runResortGeoSDLWhenDataReady() {
      if (!document.body.dataset.snowreport) {
        return;
      }
      if (window.snoResortData) {
        createResortGeoSDL();
        return;
      }
      window.addEventListener(
        'snocountry:resort-data-ready',
        function () {
          createResortGeoSDL();
        },
        { once: true }
      );
    }

    runResortGeoSDLWhenDataReady();
});