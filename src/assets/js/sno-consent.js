/**
 * SnoCountry Consent Gate (stub — no banner UI yet)
 *
 * Central policy engine that gates third-party script execution:
 *  - Google Analytics      → category 'analytics'   (google.html)
 *  - YouTube embeds        → category 'embedded_media' (resort-snowreport.js, pepsi-resort-week.js)
 *  - Resort ads + tracking → category 'ads'         (resort-ads-system.js, pepsi-resort-week.js)
 *
 * All categories default to DENIED and there is no UI to grant them yet,
 * so every gated integration stays off. When the Consent Management
 * Platform (banner + preferences UI) is built, it should call
 * window.snoConsent.setConsent({ analytics: true, ... }) — persistence and
 * the 'sno-consent-change' broadcast are already handled here, and the
 * gated scripts already listen where live re-enable makes sense.
 *
 * Must be loaded synchronously BEFORE any gated script (see google.html).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'sno-consent';
  // Bump this to invalidate previously stored consents when policy changes.
  var CONSENT_VERSION = 1;

  var DEFAULT_STATE = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: false,
    embedded_media: false,
    ads: false
  };

  // Global Privacy Control (CCPA/CPRA): a browser-level opt-out signal.
  // When present it overrides any stored grant — treated as a hard deny.
  var gpcOptOut = navigator.globalPrivacyControl === true;

  function readStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.version === CONSENT_VERSION) return parsed;
    } catch { /* corrupt or unavailable storage → fall back to defaults */ }
    return null;
  }

  var state = Object.assign({}, DEFAULT_STATE, readStored());

  window.snoConsent = {
    /**
     * @param {'necessary'|'analytics'|'embedded_media'|'ads'} category
     * @returns {boolean}
     */
    isGranted: function (category) {
      if (category === 'necessary') return true;
      if (gpcOptOut) return false;
      return state[category] === true;
    },

    /** GPC signal detected — the future CMP UI should reflect this. */
    isGpcOptOut: function () {
      return gpcOptOut;
    },

    getState: function () {
      return Object.assign({}, state);
    },

    /**
     * For the future CMP: persist a consent decision and notify gated
     * scripts via the 'sno-consent-change' document event.
     * @param {Object} updates - e.g. { analytics: true, embedded_media: true }
     */
    setConsent: function (updates) {
      state = Object.assign({}, state, updates, { version: CONSENT_VERSION });
      state.timestamp = new Date().toISOString();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
      document.dispatchEvent(new CustomEvent('sno-consent-change', { detail: this.getState() }));
    }
  };
})();
