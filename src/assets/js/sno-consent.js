/**
 * SnoCountry Consent Gate (engine — banner UI lands in Phase 2)
 *
 * Central policy engine that gates third-party script execution:
 *  - Google Analytics      → category 'analytics'   (google.html)
 *  - YouTube embeds        → category 'embedded_media' (resort-snowreport.js, pepsi-resort-week.js)
 *  - Resort ads + tracking → category 'ads'         (resort-ads-system.js, pepsi-resort-week.js)
 *
 * All categories default to DENIED. Until the consent banner ships, nothing
 * can be granted, so every gated integration stays off.
 *
 * The banner/preferences UI (Phase 2) calls:
 *   window.snoConsent.setConsent({ analytics: true, ... }, { action: 'accept_all' })
 * which persists the decision, appends an evidence record to the local receipt
 * log, clears GA cookies on analytics withdrawal, dispatches 'sno-consent-change'
 * (gated scripts already listen), and fires onRecord() callbacks — the seam
 * where Phase 3 attaches a sendBeacon POST to the consent backend.
 *
 * Must be loaded synchronously BEFORE any gated script (see google.html).
 * Roadmap: docs/cipa-phase-2.md · concept: docs/Sno-CIPA-Concept.html
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'sno-consent';
  var LOG_KEY = 'sno-consent-log';
  var MAX_LOG_ENTRIES = 20;
  // Bump this to invalidate previously stored consents when policy changes.
  var CONSENT_VERSION = 1;
  // Identifies which banner UI/copy a consent was collected under.
  // Bump on any wording or default change — audit history for Phase 3.
  var BANNER_VERSION = '2026-07-a';
  // Must match the measurement ID in google.html (cookie name _ga_<id suffix>).
  var GA_COOKIE_NAMES = ['_ga', '_ga_YJ8PTPGTSS'];
  var CATEGORIES = ['analytics', 'embedded_media', 'ads'];

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

  var recordCallbacks = [];

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { /* corrupt or unavailable storage */ }
    return null;
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }

  function readStored() {
    var parsed = readJson(STORAGE_KEY);
    // Stale version → discard: policy changed since this consent was given.
    if (parsed && parsed.version === CONSENT_VERSION) return parsed;
    return null;
  }

  function generateId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // Fallback for older browsers — random hex, not RFC 4122, but unique enough.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.floor(Math.random() * 16);
      return (c === 'x' ? r : (r % 4) + 8).toString(16);
    });
  }

  /**
   * Withdrawal must clear cookies GA already set, not just stop future ones.
   * Expires each GA cookie across host and root-domain variants; GA itself
   * fully unloads on the next page load.
   */
  function clearGaCookies() {
    var host = location.hostname;
    var parts = host.split('.');
    var root = parts.length > 1 ? parts.slice(-2).join('.') : host;
    var domains = ['', host, '.' + host, '.' + root];
    GA_COOKIE_NAMES.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
          (domain ? '; domain=' + domain : '');
      });
    });
  }

  function appendToLog(record) {
    var log = readJson(LOG_KEY);
    if (!Array.isArray(log)) log = [];
    log.push(record);
    if (log.length > MAX_LOG_ENTRIES) log = log.slice(-MAX_LOG_ENTRIES);
    writeJson(LOG_KEY, log);
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

    /** GPC signal detected — the banner UI should reflect this. */
    isGpcOptOut: function () {
      return gpcOptOut;
    },

    getState: function () {
      return Object.assign({}, state);
    },

    /** Local receipt log — first-party evidence until Phase 3 adds a backend. */
    getLog: function () {
      var log = readJson(LOG_KEY);
      return Array.isArray(log) ? log : [];
    },

    /**
     * Register a callback fired with each consent evidence record after it
     * persists. Phase 3 transport seam: attach a navigator.sendBeacon() POST
     * to the consent backend here. Returns an unsubscribe function.
     * @param {function(Object): void} callback
     */
    onRecord: function (callback) {
      recordCallbacks.push(callback);
      return function () {
        var i = recordCallbacks.indexOf(callback);
        if (i !== -1) recordCallbacks.splice(i, 1);
      };
    },

    /**
     * Persist a consent decision. Called by the banner/preferences UI.
     * @param {Object} updates - e.g. { analytics: true, embedded_media: true }
     * @param {Object} [meta] - { action: 'accept_all'|'reject_all'|'custom'|'withdraw' }
     */
    setConsent: function (updates, meta) {
      var previous = state;
      state = Object.assign({}, state, updates, { version: CONSENT_VERSION });

      // consentId survives updates — the anonymous join key for the Phase 3
      // receipt trail (grant → update → withdrawal). No PII, ever.
      state.consentId = previous.consentId || generateId();
      state.timestamp = new Date().toISOString();

      // Infer action when the caller doesn't pass one: revoking any
      // previously-granted category is a withdrawal.
      var withdrew = CATEGORIES.some(function (c) {
        return previous[c] === true && state[c] !== true;
      });
      var action = (meta && meta.action) || (withdrew ? 'withdraw' : 'custom');

      if (previous.analytics === true && state.analytics !== true) {
        clearGaCookies();
      }

      writeJson(STORAGE_KEY, state);

      var record = {
        version: CONSENT_VERSION,
        consentId: state.consentId,
        action: action,
        categories: {
          analytics: state.analytics === true,
          embedded_media: state.embedded_media === true,
          ads: state.ads === true
        },
        gpc: gpcOptOut,
        bannerVersion: BANNER_VERSION,
        timestamp: state.timestamp,
        page: location.pathname
      };
      appendToLog(record);

      document.dispatchEvent(new CustomEvent('sno-consent-change', { detail: this.getState() }));

      recordCallbacks.forEach(function (callback) {
        try { callback(record); } catch (err) { console.error('snoConsent onRecord callback failed:', err); }
      });

      return record;
    }
  };
})();
