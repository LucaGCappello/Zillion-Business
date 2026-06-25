/* =========================================================
   ZILLION BUSINESS — Cookie Consent (RGPD / ePrivacy)
   cookie-consent.js
   ========================================================= */
(function () {
  const CONSENT_KEY = 'zb_cookie_consent';
  const CONSENT_TTL = 365 * 24 * 60 * 60 * 1000; // 365 days

  const STRINGS = {
    pt: {
      title: 'Este site utiliza cookies',
      desc: 'Utilizamos armazenamento local essencial (tema, idioma, sessão) e, com o seu consentimento, recursos funcionais como tipografia Google Fonts. Não usamos cookies de análise ou publicidade.',
      accept_all: 'Aceitar todos',
      essential_only: 'Só essenciais',
      manage: 'Gerir preferências',
      essential_label: 'Essenciais (sempre ativos)',
      functional_label: 'Funcionais (Google Fonts)',
      save: 'Guardar preferências',
      privacy_link: 'Política de Privacidade',
      cookies_link: 'Política de Cookies',
    },
    en: {
      title: 'This site uses cookies',
      desc: 'We use essential local storage (theme, language, session) and, with your consent, functional resources like Google Fonts. We do not use analytics or advertising cookies.',
      accept_all: 'Accept all',
      essential_only: 'Essential only',
      manage: 'Manage preferences',
      essential_label: 'Essential (always active)',
      functional_label: 'Functional (Google Fonts)',
      save: 'Save preferences',
      privacy_link: 'Privacy Policy',
      cookies_link: 'Cookie Policy',
    },
    it: {
      title: 'Questo sito usa i cookie',
      desc: 'Utilizziamo archiviazione locale essenziale (tema, lingua, sessione) e, con il tuo consenso, risorse funzionali come Google Fonts. Non utilizziamo cookie analitici o pubblicitari.',
      accept_all: 'Accetta tutti',
      essential_only: 'Solo essenziali',
      manage: 'Gestisci preferenze',
      essential_label: 'Essenziali (sempre attivi)',
      functional_label: 'Funzionali (Google Fonts)',
      save: 'Salva preferenze',
      privacy_link: 'Informativa sulla Privacy',
      cookies_link: 'Politica dei Cookie',
    }
  };

  function getLang() {
    return localStorage.getItem('zb_lang') || 'pt';
  }

  function t(key) {
    const lang = getLang();
    return (STRINGS[lang] || STRINGS.pt)[key] || STRINGS.pt[key];
  }

  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.ts > CONSENT_TTL) {
        localStorage.removeItem(CONSENT_KEY);
        return null;
      }
      return data;
    } catch (_) {
      return null;
    }
  }

  function saveConsent(essential, functional) {
    const data = { essential, functional, ts: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent(functional ? 'zb:consentGranted' : 'zb:consentDenied', { detail: data }));
  }

  function hideBanner() {
    const banner = document.getElementById('zbCookieBanner');
    if (banner) {
      banner.setAttribute('aria-hidden', 'true');
      banner.style.transform = 'translateY(calc(100% + 20px))';
      setTimeout(() => banner.remove(), 400);
    }
  }

  function buildBanner() {
    const lang = getLang();
    const banner = document.createElement('div');
    banner.id = 'zbCookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', t('title'));

    banner.innerHTML = `
      <div class="zb-cb-inner">
        <div class="zb-cb-text">
          <strong class="zb-cb-title">${t('title')}</strong>
          <p class="zb-cb-desc">${t('desc')} <a href="politica-cookies.html">${t('cookies_link')}</a> · <a href="politica-privacidade.html">${t('privacy_link')}</a></p>
        </div>
        <div class="zb-cb-actions">
          <button class="zb-cb-btn zb-cb-essential" id="zbCbEssential">${t('essential_only')}</button>
          <button class="zb-cb-btn zb-cb-accept" id="zbCbAccept">${t('accept_all')}</button>
          <button class="zb-cb-link" id="zbCbManage">${t('manage')}</button>
        </div>
      </div>
      <div class="zb-cb-manage" id="zbCbManagePanel" hidden>
        <div class="zb-cb-toggle-row">
          <label class="zb-cb-toggle-label">
            <span>${t('essential_label')}</span>
            <span class="zb-cb-always-on">✓</span>
          </label>
        </div>
        <div class="zb-cb-toggle-row">
          <label class="zb-cb-toggle-label" for="zbFunctionalToggle">
            <span>${t('functional_label')}</span>
            <input type="checkbox" id="zbFunctionalToggle" checked>
          </label>
        </div>
        <button class="zb-cb-btn zb-cb-accept" id="zbCbSave">${t('save')}</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.style.transform = 'translateY(0)';
      });
    });

    document.getElementById('zbCbAccept').addEventListener('click', () => {
      saveConsent(true, true);
      hideBanner();
    });

    document.getElementById('zbCbEssential').addEventListener('click', () => {
      saveConsent(true, false);
      hideBanner();
    });

    document.getElementById('zbCbManage').addEventListener('click', () => {
      const panel = document.getElementById('zbCbManagePanel');
      panel.hidden = !panel.hidden;
    });

    document.getElementById('zbCbSave').addEventListener('click', () => {
      const functional = document.getElementById('zbFunctionalToggle').checked;
      saveConsent(true, functional);
      hideBanner();
    });

    // Re-apply strings if language changes
    document.addEventListener('zb:langchange', () => {
      const existing = document.getElementById('zbCookieBanner');
      if (existing) {
        existing.remove();
        buildBanner();
      }
    });
  }

  function init() {
    const consent = getConsent();
    if (consent) {
      // Consent already given — fire event so other scripts can react
      if (consent.functional) {
        document.dispatchEvent(new CustomEvent('zb:consentGranted', { detail: consent }));
      }
      return;
    }
    // No consent yet — show banner after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }

  init();
})();
