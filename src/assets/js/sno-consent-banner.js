/**
 * SnoCountry Consent Banner ("We value your privacy")
 *
 * Phase 2 UI for the consent gate (sno-consent.js). Renders a fixed bottom
 * banner when no valid consent decision is stored, with three equal-weight
 * actions — Accept all, Reject all, Manage preferences — and an expandable
 * preferences panel with per-category toggles. Decisions are recorded via
 * window.snoConsent.setConsent(), which persists the evidence record and
 * wakes the gated scripts (GA, ads) live.
 *
 * GPC: when the browser sends Global Privacy Control, the engine hard-denies
 * everything, so the banner shows a passive notice instead of accept options;
 * dismissing it records a reject_all receipt (with gpc: true).
 *
 * Reopen: window.snoConsentBanner.open() re-shows the banner with the
 * preferences panel expanded and toggles prefilled — the footer
 * "Cookie Preferences" link (Phase 2 item 3) calls this.
 *
 * Requires: sno-consent.js loaded first (google.html loads it synchronously).
 * Styles: /assets/css/sno-consent-banner.css
 * Roadmap: docs/cipa-phase-2.md
 */
(function () {
  'use strict';

  if (!window.snoConsent) return;

  var PRIVACY_POLICY_URL = '/privacy-policy-terms/';
  var CATEGORY_TOGGLES = [
    {
      key: 'analytics',
      label: 'Analytics',
      description: 'Google Analytics usage measurement — helps us understand which pages are useful.'
    },
    {
      key: 'embedded_media',
      label: 'Embedded videos',
      description: 'YouTube resort videos (click-to-play, privacy-enhanced mode).'
    },
    {
      key: 'ads',
      label: 'Advertising',
      description: 'Resort and sponsor banners, and measurement of ad views and clicks.'
    }
  ];

  var banner = null;
  var reopened = false;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function button(label, className, onClick) {
    var btn = el('button', 'sno-consent-btn ' + className, label);
    btn.type = 'button';
    btn.addEventListener('click', onClick);
    return btn;
  }

  function decide(categories, action) {
    window.snoConsent.setConsent(categories, { action: action });
    close();
  }

  function close() {
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  function buildPreferencesPanel() {
    var state = window.snoConsent.getState();
    var panel = el('div', 'sno-consent-prefs');
    panel.id = 'sno-consent-prefs';
    panel.hidden = true;

    var necessaryRow = el('div', 'sno-consent-pref-row');
    var necessaryHead = el('div', 'sno-consent-pref-head');
    necessaryHead.appendChild(el('span', 'sno-consent-pref-label', 'Strictly necessary'));
    necessaryHead.appendChild(el('span', 'sno-consent-pref-always', 'Always on'));
    necessaryRow.appendChild(necessaryHead);
    necessaryRow.appendChild(el('p', 'sno-consent-pref-desc',
      'Required for the site to work. Sets no tracking cookies.'));
    panel.appendChild(necessaryRow);

    var inputs = {};
    CATEGORY_TOGGLES.forEach(function (category) {
      var row = el('div', 'sno-consent-pref-row');
      var head = el('label', 'sno-consent-pref-head');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'sno-consent-pref-toggle';
      input.checked = state[category.key] === true;
      inputs[category.key] = input;
      head.appendChild(el('span', 'sno-consent-pref-label', category.label));
      head.appendChild(input);
      row.appendChild(head);
      row.appendChild(el('p', 'sno-consent-pref-desc', category.description));
      panel.appendChild(row);
    });

    var save = button('Save preferences', 'sno-consent-btn-primary', function () {
      var choices = {};
      CATEGORY_TOGGLES.forEach(function (category) {
        choices[category.key] = inputs[category.key].checked;
      });
      decide(choices, 'custom');
    });
    var actions = el('div', 'sno-consent-prefs-actions');
    actions.appendChild(save);
    if (reopened) {
      actions.appendChild(el('p', 'sno-consent-prefs-note',
        'Some changes take effect on your next page view.'));
    }
    panel.appendChild(actions);
    return panel;
  }

  function buildGpcBanner() {
    var box = el('div', 'sno-consent-inner');
    box.appendChild(el('p', 'sno-consent-title', 'Your privacy is protected'));
    var body = el('p', 'sno-consent-body',
      'Your browser sent a Global Privacy Control signal, so analytics, embedded videos, and advertising are turned off automatically. ');
    var link = el('a', 'sno-consent-link', 'Privacy Policy');
    link.href = PRIVACY_POLICY_URL;
    body.appendChild(link);
    box.appendChild(body);
    var actions = el('div', 'sno-consent-actions');
    actions.appendChild(button('OK', 'sno-consent-btn-primary', function () {
      decide({ analytics: false, embedded_media: false, ads: false }, 'reject_all');
    }));
    box.appendChild(actions);
    return box;
  }

  function buildChoiceBanner() {
    var box = el('div', 'sno-consent-inner');
    box.appendChild(el('p', 'sno-consent-title', 'We value your privacy'));
    var body = el('p', 'sno-consent-body',
      'We use Google Analytics to understand how the site is used, YouTube to show resort videos, and sponsor banners to support SnoCountry. None of these load unless you allow them. ');
    var link = el('a', 'sno-consent-link', 'Privacy Policy');
    link.href = PRIVACY_POLICY_URL;
    body.appendChild(link);
    box.appendChild(body);

    var prefsPanel = buildPreferencesPanel();

    var actions = el('div', 'sno-consent-actions');
    // Accept and Reject share identical styling — equal prominence, no dark patterns.
    actions.appendChild(button('Accept all', 'sno-consent-btn-primary', function () {
      decide({ analytics: true, embedded_media: true, ads: true }, 'accept_all');
    }));
    actions.appendChild(button('Reject all', 'sno-consent-btn-primary', function () {
      decide({ analytics: false, embedded_media: false, ads: false }, 'reject_all');
    }));
    var manage = button('Manage preferences', 'sno-consent-btn-text', function () {
      prefsPanel.hidden = !prefsPanel.hidden;
      manage.setAttribute('aria-expanded', String(!prefsPanel.hidden));
    });
    manage.setAttribute('aria-expanded', 'false');
    manage.setAttribute('aria-controls', 'sno-consent-prefs');
    actions.appendChild(manage);
    box.appendChild(actions);
    box.appendChild(prefsPanel);

    if (reopened) {
      prefsPanel.hidden = false;
      manage.setAttribute('aria-expanded', 'true');
      // A returning visitor may dismiss without re-deciding.
      var dismiss = button('Close', 'sno-consent-btn-text', close);
      dismiss.setAttribute('aria-label', 'Close cookie preferences');
      actions.appendChild(dismiss);
      banner.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') close();
      });
    }
    return box;
  }

  function show() {
    if (banner) return;
    banner = el('div', 'sno-consent-banner');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.appendChild(
      window.snoConsent.isGpcOptOut() ? buildGpcBanner() : buildChoiceBanner()
    );
    document.body.appendChild(banner);
  }

  function showIfUndecided() {
    // consentId only exists once setConsent() has run — no id, no decision.
    if (!window.snoConsent.getState().consentId) show();
  }

  // Public API — the footer "Cookie Preferences" link calls open().
  window.snoConsentBanner = {
    open: function () {
      close();
      reopened = true;
      show();
    }
  };

  // Wire up any [data-sno-consent-open] triggers (footer "Cookie Preferences").
  function bindOpeners() {
    var openers = document.querySelectorAll('[data-sno-consent-open]');
    for (var i = 0; i < openers.length; i++) {
      openers[i].addEventListener('click', function () {
        window.snoConsentBanner.open();
      });
    }
  }

  function start() {
    showIfUndecided();
    bindOpeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
