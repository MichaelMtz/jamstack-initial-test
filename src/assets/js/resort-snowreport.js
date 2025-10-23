/**
 * Resort Data Manager - Class-based Approach
 * Fetches and populates resort data from API endpoint
 * Similar structure to responsive-layout.js for consistency
 */

class ResortDataManager {
  constructor() {
    // API configuration
    this.apiBaseUrl = "https://good-cormorant-17.convex.site/api/resort-data";
    this.resortId = null;
    this.resortData = null;

    // DOM elements cache
    this.elements = new Map();

    // Data mapping configuration
    this.dataMappings = {
      // Header elements
      "resort-header-title": "resortName",
      "resort-blurb-title": "resortName",
      "resort-header-logo": "logo",

      // Basic info
      "resort-blurb": "blurb", // Using this as blurb since there's no specific blurb field
      //"resort-comments": "snowComments",
      "resort-reportDateTime": "reportDateTime",

      // Snow conditions
      "resort-snowfall-past24Hours": "newSnowMin",
      "resort-snowfall-past48Hours": "snowLast48Hours",
      "resort-snowfall-past72Hours": "snowLast48Hours", // Using 48h as proxy for 72h
      "resort-snowfall-past7Days": "snowLast48Hours", // Using 48h as proxy for 7 days
      "resort-primarySurface": "primarySurfaceCondition",
      "resort-baseDepth": "avgBaseDepthMin",
      "resort-seasonTotal": "avgBaseDepthMax", // Using as proxy for season total

      // Operating status
      "resort-operatingStatus": "operatingStatus",
      "resort-weekendHours": "weekendHours",
      "resort-weekdayHours": "weekdayHours",

      // Resort stats
      "resort-averageSnowfall": "avgBaseDepthMin", // Using as proxy
      "resort-liftElevation": "liftElevation",
      "resort-baseElevation": "baseElevation",
      "resort-verticalDrop": "maxDistance", // Using as proxy for vertical drop
      "resort-maxOpenDownHillAcres": "maxOpenDownHillAcres",
      "resort-maxOpenDownHillTrails": "maxOpenDownHillTrails",
      "resort-maxOpenDownHillLifts": "maxOpenDownHillLifts",

      // Contact info
      // "resort-webSiteLinksite": "webSiteLink", // Using tickets link as website
      // "resort-address": "resortAddress",
      // "resort-phone": "reservationPhone", // Using golf phone as general phone
      // "resort-email": "generalEmail", // No email field, using address as placeholder

    };

    this.init();
  }

  /**
   * Initialize the resort data manager
   */
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup DOM elements and fetch data
   */
  async setup() {
    this.extractResortId();
    this.cacheElements();

    if (this.resortId) {
      try {
        await this.fetchResortData();
        this.populateElements();
        this.setupEventListeners();
      } catch (error) {
        console.error("ResortDataManager: Failed to load resort data:", error);
        this.showErrorState();
      }
    } else {
      console.error(
        "ResortDataManager: No resort ID found in data-snowreport attribute"
      );
    }
  }

  /**
   * Extract resort ID from body data attribute
   */
  extractResortId() {
    const body = document.body;
    this.resortId = body.getAttribute("data-snowreport");

    if (!this.resortId) {
      console.warn(
        "ResortDataManager: No data-snowreport attribute found on body tag"
      );
    }
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    // Cache all elements that need to be populated
    Object.keys(this.dataMappings).forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        this.elements.set(elementId, element);
      } else {
        console.warn(
          `ResortDataManager: Element with id '${elementId}' not found`
        );
      }
    });

    console.log(`ResortDataManager: Cached ${this.elements.size} elements`);
  }

  /**
   * Fetch resort data from API
   */
  async fetchResortData() {
    if (!this.resortId) {
      throw new Error("No resort ID available");
    }

    const url = `${this.apiBaseUrl}?resortId=${this.resortId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.resortData = await response.json();
      console.log(
        "ResortDataManager: Successfully fetched resort data",
        this.resortData
      );
    } catch (error) {
      console.error("ResortDataManager: API fetch failed:", error);
      throw error;
    }
  }

  /**
   * Populate DOM elements with resort data
   */
  populateElements() {
    if (!this.resortData) {
      console.error(
        "ResortDataManager: No resort data available for population"
      );
      return;
    }

    // Populate each mapped element
    Object.entries(this.dataMappings).forEach(([elementId, dataKey]) => {
      const element = this.elements.get(elementId);
      if (element) {
        this.populateElement(element, dataKey, elementId);
      }
    });

    // Special handling for elements that need custom logic
    this.handleSpecialElements();

    console.log("ResortDataManager: Successfully populated all elements");
  }

  /**
   * Populate a single element with data
   */
  populateElement(element, dataKey, elementId) {
    const value = this.getNestedValue(this.resortData, dataKey);

    if (value === null || value === undefined || value === "") {
      this.setPlaceholder(element, elementId);
      return;
    }

    // Handle different element types
    if (element.tagName === "IMG") {
      element.src = value;
      element.alt = this.resortData.resortName || "Resort Image";
    } else if (element.tagName === "A") {
      element.href = value;
      element.textContent = this.formatValue(value, elementId);
    } else {
      if (elementId === "resort-blurb-title") {
        element.innerHTML = this.formatValue(value, elementId);
      } else {
        element.textContent = this.formatValue(value, elementId);
      }
      //element.textContent = this.formatValue(value, elementId);
      element.innerHTML = this.formatValue(value, elementId);
    }
  }

  /**
   * Handle special elements that need custom logic
   */
  handleSpecialElements() {
    // Handle resort header title
    const titleElement = this.elements.get("resort-header-title");
    if (titleElement && this.resortData.resortName) {
      titleElement.textContent = this.resortData.resortName;
    }

    // Handle resort logo
    const logoElement = this.elements.get("resort-header-logo");
    if (logoElement && this.resortData.logo) {
      const img =
        logoElement.querySelector("img") || document.createElement("img");
      img.src = this.resortData.logo;
      img.alt = `${this.resortData.resortName} Logo`;
      img.className = "w-32 h-16 rounded mb-2 object-contain hidden sm:block ";
      if (!logoElement.querySelector("img")) {
        logoElement.innerHTML = "";
        logoElement.appendChild(img);
      }
    }

    // Handle resort blurb format is in base64 encoded html
    const blurbElement = this.elements.get("resort-blurb");
    if (blurbElement && this.resortData.blurb) {
      const decodedHtml = atob(this.resortData.blurb);
      blurbElement.innerHTML = decodedHtml;
      //blurbElement.innerHTML = this.resortData.blurb;
    }
    
    // Handle member resorts 
    if (this.resortData.nesacMember === '1') {
      document.getElementById('member-resort').classList.remove('hidden');
    }
    // Handle donuts
    this.createDonut("donutTrails", this.resortData.openDownHillTrails, this.resortData.maxOpenDownHillTrails, "Trails Open");
    this.createDonut("donutLifts", this.resortData.openDownHillLifts, this.resortData.maxOpenDownHillLifts, "Lifts Open");

    // Handle resort charts
    this.createResortCharts();

    // Handle weather forecast (placeholder data since API doesn't have detailed weather)
    this.populateWeatherForecast();

    // Handle snowfall data with calculations
    this.populateSnowfallData();

    // Handle vertical drop calculation
    this.calculateVerticalDrop();

    // Handle trail map
    this.populateTrailMap();

    // Handle contact information fields
    this.populateContactInfo();

    // Handle news feed
    this.populateNewsFeed();

    // Handle resort comments
    this.populateResortComments();
    
   
  }

  /**
   * Populate resort comments from API data
   */
  populateResortComments() {
    const resortCommentsContainer = document.getElementById("resort-comments");
    if (!resortCommentsContainer || !this.resortData) {
      return;
    }

    // Collect all items (comments, deals, events) with their types
    const allItems = [];

    // Process comments
    if (this.resortData.comments && typeof this.resortData.comments === 'object') {
      Object.values(this.resortData.comments).forEach(comment => {
        if (comment.message && comment.endDate) {
          allItems.push({
            type: 'comment',
            message: comment.message,
            endDate: comment.endDate,
            date: new Date(comment.endDate)
          });
        }
      });
    }

    // Process deals
    if (this.resortData.deals && typeof this.resortData.deals === 'object') {
      Object.values(this.resortData.deals).forEach(deal => {
        if (deal.message && deal.endDate) {
          allItems.push({
            type: 'deal',
            message: deal.message,
            endDate: deal.endDate,
            date: new Date(deal.endDate)
          });
        }
      });
    }

    // Process events
    if (this.resortData.events && typeof this.resortData.events === 'object') {
      Object.values(this.resortData.events).forEach(event => {
        if (event.message && event.endDate) {
          allItems.push({
            type: 'event',
            message: event.message,
            endDate: event.endDate,
            date: new Date(event.endDate)
          });
        }
      });
    }

    // Sort by endDate ascending and limit to 5 items
    allItems.sort((a, b) => a.date - b.date);
    const limitedItems = allItems.slice(0, 5);

    // Generate HTML based on item type
    let html = '';
    limitedItems.forEach((item, index) => {
      const formattedDate = item.date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (item.type === 'deal') {
        html += `
          <div class="deal ${index > 0 ? 'mt-4 border-b py-2' : 'border-b'}">
            <div class="deal-header flex gap-4">
              <span class="inline-flex items-center gap-1.5 rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-600 font-bold ring-1 ring-emerald-400/20">Deal</span>
              <div class="date">${formattedDate}</div>
            </div>
            <p class="deal-copy mt-2">
              ${item.message}
            </p>
          </div>
        `;
      } else if (item.type === 'event') {
        html += `
          <div class="event ${index > 0 ? 'mt-4 border-b py-2' : 'border-b py-2'}">
            <div class="event-header flex gap-4">
              <span class="inline-flex items-center gap-1.5 rounded-md bg-red-400/10 ring-red-400/20 text-red-500 px-2 py-1 text-xs font-bold ring-1">Event</span>
              <div class="date">${formattedDate}</div>
            </div>
            <p class="event-copy mt-2">
              ${item.message}
            </p>
          </div>
        `;
      } else if (item.type === 'comment') {
        html += `
          <div class="news ${index > 0 ? 'mt-4 border-b py-2' : 'border-b py-2'}">
            <div class="news-header flex gap-4">
              <span class="inline-flex items-center gap-1.5 rounded-md bg-cyan-400/10 px-2 py-1 text-xs text-cyan-600 font-bold ring-1 ring-cyan-400/20">News</span>
              <div class="date">${formattedDate}</div>
            </div>
            <p class="news-copy mt-2">
              ${item.message}
            </p>
          </div>
        `;
      }
    });

    // If no items found, show placeholder message
    if (html === '') {
      html = `
        <div class="text-center text-gray-500 py-4">
          <p>No recent comments, deals, or events available</p>
        </div>
      `;
    }

    resortCommentsContainer.innerHTML = html;
  }

  /**
   * Populate trail map
   */
  populateTrailMap() {
    const trailMapContainer = document.getElementById("resort-trailmap");
    if (trailMapContainer) {
      const trailMapHeader = document.getElementById('trailmap-header');
      if (trailMapHeader) {
        trailMapHeader.textContent = `${this.resortData.resortName} Trail Map`;
        trailMapHeader.classList.remove("hidden");
      }
      const trailMapDesktopImage = document.getElementById('trailMapDesktop');
      if (trailMapDesktopImage) {
        trailMapDesktopImage.src = `http://snocountry.com/assets/images/resorts/trail-maps/${this.resortData.id}.jpg`;
        trailMapDesktopImage.alt = `${this.resortData.resortName} Trail Map`;
        trailMapDesktopImage.className = "w-full h-full object-cover shadow-lg cursor-pointer";
        document.getElementById('trailmap-container').classList.remove("hidden");
      }

      // Update modal trail map image
      const modalTrailMapImage = document.getElementById('modalTrailMapImage');
      if (modalTrailMapImage) {
        modalTrailMapImage.src = `http://snocountry.com/assets/images/resorts/trail-maps/${this.resortData.id}.jpg`;
        modalTrailMapImage.alt = `${this.resortData.resortName} Trail Map`;
      }

      const deleteMeElement = document.querySelector('.delete-me');
      if (deleteMeElement) {
        deleteMeElement.classList.add("hidden");
      }
    }
  }

  /**
   * Populate contact information fields with anchor elements
   */
  populateContactInfo() {
    // Website
    const websiteElement = document.getElementById("resort-webSiteLinksite");
    //console.log('populateContactInfo: websiteElement', websiteElement);
    if (websiteElement && this.resortData.webSiteLink) {
      websiteElement.querySelector(".remove-me").remove();
      const anchor = websiteElement.querySelector("a");
      if (anchor) {
        anchor.href = this.resortData.webSiteLink;
        // Extract domain name for display
        try {
          const url = new URL(this.resortData.webSiteLink);
          anchor.innerHTML = url.hostname.replace('www.', '');
        } catch (e) {
          anchor.innerHTML = this.resortData.webSiteLink;
        }
        anchor.target = "_blank";
      }
    }

    // Address - link to Google Maps
    const addressElement = document.getElementById("resort-address");
    if (addressElement && this.resortData.resortAddress) {
      const anchor = addressElement.querySelector("a");
      if (anchor) {
        // Clean up the address (remove leading commas)
        const cleanAddress = this.resortData.resortAddress.replace(/^,\s*,\s*/, '');
        anchor.textContent = cleanAddress;
        
        // Create Google Maps link
        const encodedAddress = encodeURIComponent(cleanAddress);
        anchor.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        anchor.target = "_blank";
      }
    }

    // Phone
    const phoneElement = document.getElementById("resort-phone");
    if (phoneElement && this.resortData.reservationPhone) {
      const anchor = phoneElement.querySelector("a");
      if (anchor) {
        anchor.textContent = this.resortData.reservationPhone;
        // Create tel: link (remove any non-numeric characters except + and -)
        const phoneNumber = this.resortData.reservationPhone.replace(/[^\d+\-]/g, '');
        anchor.href = `tel:${phoneNumber}`;
      }
    }

    // Email
    const emailElement = document.getElementById("resort-email");
    if (emailElement && this.resortData.generalEmail) {
      const anchor = emailElement.querySelector("a");
      if (anchor) {
        anchor.textContent = this.resortData.generalEmail;
        anchor.href = `mailto:${this.resortData.generalEmail}`;
      }
    }
  }

  /**
   * Populate news feed from API data
   */ 
  populateNewsFeed() {
    const apiNewsFeedUrl = "https://www.snow-country.com/resorts/api-easy-blog-list.php?action=news-home";
    const newsFeedContainer = document.getElementById("sno-news-container");
    if (newsFeedContainer) {
      fetch(apiNewsFeedUrl)
        .then(response => response.json())
        .then(data => {
          // Limit to 8 news stories
          newsFeedContainer.innerHTML = data.stories.slice(0, 8).map(story => `
              <div class="h-[240px] border border-gray-200 duration-500 group hover:-translate-y-1 hover:scale-[1.01] p-3 rounded">
                <a href="news-post/${story.eventTitle}/?postID=${story.id}" target="_blank">
                  <img class="news-image  rounded mb-2" src="${story.image}" alt="Recent SnoNews">
                  <div class="space-y-1">
                    <p class="duration-300 group-hover:text-sky-700 text-sm transition-colors">${story.title}</p>
                  </div>
                </a>
              </div>
          `).join('');
        });
    }
  }

  /**
   * Create resort charts for base depth and trails
   */
  createResortCharts() {
    // Parse JSON strings from API response
    const baseDepthData = this.resortData.jsonBaseDepth 
      ? JSON.parse(this.resortData.jsonBaseDepth) 
      : null;
    const trailsData = this.resortData.jsonOpenTrails 
      ? JSON.parse(this.resortData.jsonOpenTrails) 
      : null;

    // _log('baseDepth:',baseDepthData);
    // _log('trailsData:',trailsData);
    // Create Base Depth chart if data exists
    if (baseDepthData && document.getElementById('baseDepthRace')) {
      const baseDepthChart = new ResortChart(
        'baseDepthRace',
        baseDepthData,
        this.resortData.resortName + ' Base Depth past 7 seasons',
        'Base Depth (inches)',
        200,
        'BaseDepth'
      );
      baseDepthChart.init();
    }

    // Create Trails chart if data exists
    if (trailsData && document.getElementById('trailsRace')) {
      const trailsChart = new ResortChart(
        'trailsRace',
        trailsData,
        this.resortData.resortName + ' Open Trails past 7 seasons',
        'Number of Trails',
        200,
        'Trails'
      );
      trailsChart.init();
    }
  }
  /**
   * Populate weather forecast from API data
   */
  populateWeatherForecast() {
    const weatherContainer = document.getElementById("resort-weather-forecast");
    if (!weatherContainer) return;

    // Weather data configuration for 5 days
    const weatherDays = [
      { prefix: 'weatherToday', label: 'Today' },
      { prefix: 'weatherTomorrow', label: this.getDayName(1) },
      { prefix: 'weatherDayAfterTomorrow', label: this.getDayName(2) },
      { prefix: 'weatherDay4', label: this.getDayName(3) },
      { prefix: 'weatherDay5', label: this.getDayName(4) }
    ];

    // Build weather cards HTML
    let weatherHTML = '';
    let hasWeatherData = false;

    weatherDays.forEach(day => {
      const tempHigh = this.resortData[`${day.prefix}_Temperature_High`];
      const tempLow = this.resortData[`${day.prefix}_Temperature_Low`];
      const condition = this.resortData[`${day.prefix}_Condition`];

      // Check if we have at least some weather data
      if (tempHigh || tempLow || condition) {
        hasWeatherData = true;
      }

      const emoji = this.getWeatherEmoji(condition);
      const conditionText = condition || 'N/A';
      const highTemp = tempHigh || '--';
      const lowTemp = tempLow || '--';

      weatherHTML += `
        <div class="text-center">
          <h3 class="font-semibold text-sm">${day.label}</h3>
          <div class="my-2">${emoji}</div>
          <p class="text-xs">${conditionText}</p>
          <p class="text-xs text-red-500">High: ${highTemp}°</p>
          <p class="text-xs text-blue-500">Low: ${lowTemp}°</p>
        </div>
      `;
    });

    // Display weather data or fallback message
    if (hasWeatherData) {
      weatherContainer.innerHTML = weatherHTML;
    } else {
      weatherContainer.innerHTML = `
        <div class="col-span-full text-center text-gray-500">
          <p>Weather data not available</p>
          <p class="text-sm">Check resort website for current conditions</p>
        </div>
      `;
    }
  }

  /**
   * Get day name for offset from today
   */
  getDayName(offset) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);
    return days[targetDate.getDay()];
  }

  /**
   * Map weather condition to emoji
   */
  getWeatherEmoji(condition) {
    if (!condition) return '❓';
    
    const conditionLower = condition.toLowerCase();
    
    // Clear/Sunny conditions
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return '☀️';
    }
    
    // Partly cloudy/Partly sunny
    if (conditionLower.includes('partly cloudy') || conditionLower.includes('partly sunny')) {
      return '⛅';
    }
    
    // Cloudy/Overcast
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return '☁️';
    }
    
    // Snow
    if (conditionLower.includes('snow') || conditionLower.includes('flurries')) {
      return '❄️';
    }
    
    // Rain
    if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
      return '🌧️';
    }
    
    // Thunderstorm
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return '⛈️';
    }
    
    // Fog/Mist
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return '🌫️';
    }
    
    // Wind
    if (conditionLower.includes('wind')) {
      return '💨';
    }
    
    // Default
    return '🌤️';
  }

  /**
   * Populate snowfall data with calculations from snowarchive
   */
  populateSnowfallData() {
    if (
      !this.resortData.snowarchive ||
      !Array.isArray(this.resortData.snowarchive)
    ) {
      return;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate snowfall totals
    const past24Hours = this.calculateSnowfallTotal(
      this.resortData.snowarchive,
      oneDayAgo
    );
    const past48Hours = this.calculateSnowfallTotal(
      this.resortData.snowarchive,
      twoDaysAgo
    );
    const past7Days = this.calculateSnowfallTotal(
      this.resortData.snowarchive,
      sevenDaysAgo
    );

    // Update elements
    this.updateElementText("resort-snowfall-past24Hours", `${past24Hours}"`);
    this.updateElementText("resort-snowfall-past48Hours", `${past48Hours}"`);
    this.updateElementText("resort-snowfall-past72Hours", `${past48Hours}"`); // Using 48h as proxy
    this.updateElementText("resort-snowfall-past7Days", `${past7Days}"`);
  }

  /**
   * Calculate snowfall total from archive data
   */
  calculateSnowfallTotal(archive, sinceDate) {
    return archive
      .filter((entry) => new Date(entry.date_of_new_snow) >= sinceDate)
      .reduce((total, entry) => total + (parseInt(entry.snowMin) || 0), 0);
  }

  /**
   * Calculate vertical drop from elevation data
   */
  calculateVerticalDrop() {
    const liftElevation = this.resortData.liftElevation;
    const baseElevation = this.resortData.baseElevation;

    if (liftElevation && baseElevation) {
      // Extract numbers from strings like "2006 ft/611 m"
      const liftMatch = liftElevation.match(/(\d+)/);
      const baseMatch = baseElevation.match(/(\d+)/);

      if (liftMatch && baseMatch) {
        const lift = parseInt(liftMatch[1]);
        const base = parseInt(baseMatch[1]);
        const verticalDrop = lift - base;

        this.updateElementText("resort-verticalDrop", `${verticalDrop} ft`);
      }
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Format value based on element type
   */
  formatValue(value, elementId) {
    if (typeof value !== "string") {
      return String(value);
    }

    // Special formatting for specific elements
    switch (elementId) {
      case "resort-reportDateTime":
        return this.formatDateTime(value);
      case "resort-address":
        return value.replace(/^,\s*,\s*/, ""); // Remove leading commas
      default:
        return value;
    }
  }

  /**
   * Format date time string
   */
  formatDateTime(dateTimeString) {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeString;
    }
  }

  /**
   * Set placeholder content for empty elements
   */
  setPlaceholder(element, elementId) {
    const placeholders = {
      "resort-blurb": "Resort information not available",
      "resort-comments": "No recent news or comments",
      "resort-snowfall-past24Hours": '0"',
      "resort-snowfall-past48Hours": '0"',
      "resort-snowfall-past72Hours": '0"',
      "resort-snowfall-past7Days": '0"',
      "resort-primarySurface": "Not reported",
      "resort-baseDepth": "Not reported",
      "resort-seasonTotal": "Not reported",
      "resort-operatingStatus": "Status not available",
      "resort-weekendHours": "Not available",
      "resort-weekdayHours": "Not available",
      "resort-averageSnowfall": "Not available",
      "resort-liftElevation": "Not available",
      "resort-baseElevation": "Not available",
      "resort-verticalDrop": "Not available",
      "resort-maxOpenDownHillAcres": "Not available",
      "resort-maxOpenDownHillTrails": "Not available",
      "resort-maxOpenDownHillLifts": "Not available",
      "resort-webSiteLinksite": "Website not available",
      "resort-address": "Address not available",
      "resort-phone": "Phone not available",
      "resort-email": "Email not available",
    };

    const placeholder = placeholders[elementId] || "Not available";

    if (element.tagName === "A") {
      element.textContent = placeholder;
      element.href = "#";
    } else {
      element.textContent = placeholder;
    }
  }

  /**
   * Update element text content
   */
  updateElementText(elementId, text) {
    const element = this.elements.get(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Setup event listeners for dynamic updates
   */
  setupEventListeners() {
    // Add any event listeners for dynamic updates here
    // For example, refresh data on user interaction
  }

  /**
   * Show error state when data loading fails
   */
  showErrorState() {
    // Update key elements to show error state
    const errorMessage = "Unable to load resort data";

    this.updateElementText("resort-header-title", errorMessage);
    this.updateElementText("resort-operatingStatus", "Data unavailable");

    // Add error styling
    document.body.classList.add("data-error");
  }

  /**
   * Refresh resort data
   */
  async refreshData() {
    try {
      await this.fetchResortData();
      this.populateElements();
      console.log("ResortDataManager: Data refreshed successfully");
    } catch (error) {
      console.error("ResortDataManager: Failed to refresh data:", error);
    }
  }

  /**
   * 
   * @param {string} containerId - The ID of the container element
   * @param {number} x - The number of open trails
   * @param {number} y - The total number of trails
   * @param {string} label - The label for the donut
   */
  createDonut(containerId, x, y, label) {
    const container = document.getElementById(containerId);
    const percentage = Math.round((x / y) * 100);

    // SVG circle parameters
    const size = 203;
    const strokeWidth = 30;
    const radius = (size / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const svg = `
    <svg class="donut-chart h-[155px]" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background circle  -->
        <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="#082f49"
            stroke-width="${strokeWidth}"
        />

        <!-- Progress circle (blue) -->
        <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="#0369a1"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="butt"
            transform="rotate(-90 ${size / 2} ${size / 2})"
            class="donut-progress"
            style="--circumference: ${circumference}; --offset: ${offset};"
        />

        <!-- Label at top -->

        <!-- Center text - fraction -->
        <text id="donutFraction-${containerId}" x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" class="text-4xl font-bold">0/${y}</text>

        <!-- Center text - percentage -->
        <text id="donutPercentage-${containerId}" x="${size / 2}" y="${size / 2 + 28}" text-anchor="middle" class="text-xl ">0%</text>
    </svg>
`;

    container.innerHTML = svg;

    // Animate percentage and fraction count up
    const percentageElement = container.querySelector(`#donutPercentage-${containerId}`);
    const fractionElement = container.querySelector(`#donutFraction-${containerId}`);
    let currentPercentage = 0;
    let currentX = 0;
    const duration = 1250;
    const percentageIncrement = percentage / (duration / 16);
    const xIncrement = x / (duration / 16);

    const counter = setInterval(() => {
        currentPercentage += percentageIncrement;
        currentX += xIncrement;

        if (currentPercentage >= percentage) {
            currentPercentage = percentage;
            currentX = x;
            clearInterval(counter);
        }

        percentageElement.textContent = Math.round(currentPercentage) + '%';
        fractionElement.textContent = Math.round(currentX) + '/' + y;
    }, 16);
  }

  /**
   * Get current resort data
   */
  getResortData() {
    return this.resortData;
  }

  /**
   * Get current resort ID
   */
  getResortId() {
    return this.resortId;
  }
}

// Initialize the resort data manager when the script loads
const resortDataManager = new ResortDataManager();

// Expose to global scope for debugging and external access
window.ResortDataManager = resortDataManager;
