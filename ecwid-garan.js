(function () {
  'use strict';

  /*
   * Ecopots EU GARAN storefront integration
   * One 10-year label for all Ecopots products.
   * Official EU GARAN SVG files must stay unchanged.
   */

  const GARAN_YEARS = '10';
  const GARAN_BASE =
    (document.currentScript && document.currentScript.src)
      ? document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/') + 1)
      : '';

  const FULL_LABEL_URL = GARAN_BASE + 'GARAN_Ecopots_10_years_full.svg';
  const NESTED_LABEL_URL = GARAN_BASE + 'GARAN_Ecopots_10_years_nested.svg';

  function isProductPage() {
    return !!document.querySelector('.ec-store__product-page');
  }

  function removeExisting() {
    document.querySelectorAll('[data-ecopots-garan-root]').forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll('[data-ecopots-garan-modal]').forEach(function (el) {
      el.remove();
    });
  }

  function createModal() {
    if (document.querySelector('[data-ecopots-garan-modal]')) return;

    const modal = document.createElement('div');
    modal.className = 'ecopots-garan-modal';
    modal.setAttribute('data-ecopots-garan-modal', '');
    modal.hidden = true;
    modal.innerHTML = `
      <div class="ecopots-garan-backdrop" data-ecopots-garan-close></div>
      <div class="ecopots-garan-dialog"
           role="dialog"
           aria-modal="true"
           aria-labelledby="ecopots-garan-title">
        <button type="button"
                class="ecopots-garan-close"
                aria-label="Close"
                data-ecopots-garan-close>&times;</button>
        <h2 id="ecopots-garan-title" class="ecopots-garan-visually-hidden">
          EU GARAN 10-year producer durability guarantee
        </h2>
        <div class="ecopots-garan-full-label">
          <img src="${FULL_LABEL_URL}"
               alt="EU GARAN label: 10-year producer durability guarantee, Ecopots, all Ecopots products"
               loading="eager">
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function (event) {
      if (event.target.closest('[data-ecopots-garan-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  let lastFocused = null;

  function openModal() {
    const modal = document.querySelector('[data-ecopots-garan-modal]');
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('ecopots-garan-modal-open');
    const close = modal.querySelector('.ecopots-garan-close');
    if (close) close.focus();
  }

  function closeModal() {
    const modal = document.querySelector('[data-ecopots-garan-modal]');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('ecopots-garan-modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function createTrigger() {
    if (!isProductPage()) return;

    const price = document.querySelector(
      '.ec-store__product-page .details-product-price__value'
    );

    if (!price) return false;

    if (document.querySelector('[data-ecopots-garan-root]')) return true;

    const root = document.createElement('div');
    root.className = 'ecopots-garan-root';
    root.setAttribute('data-ecopots-garan-root', '');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ecopots-garan-trigger';
    button.setAttribute('aria-label', 'View EU GARAN 10-year durability guarantee');

    const img = document.createElement('img');
    img.src = NESTED_LABEL_URL;
    img.alt = 'EU GARAN 10-year producer durability guarantee';
    img.loading = 'eager';

    const text = document.createElement('span');
    text.className = 'ecopots-garan-trigger-text';
    text.innerHTML = '<strong>10-year guarantee</strong><small>EU GARAN · click for details</small>';

    button.appendChild(img);
    button.appendChild(text);
    button.addEventListener('click', openModal);

    root.appendChild(button);

    /*
     * Ecwid's documented product-page price selector is used here.
     * The badge is placed directly after the price element so it stays
     * close to the purchase information.
     */
    const priceBlock = price.closest('.product-details__product-price') || price.parentElement;
    if (priceBlock && priceBlock.parentElement) {
      priceBlock.parentElement.insertBefore(root, priceBlock.nextSibling);
    } else if (price.parentElement) {
      price.parentElement.appendChild(root);
    } else {
      return false;
    }

    createModal();
    return true;
  }

  function init() {
    if (!isProductPage()) return;

    createTrigger();

    /*
     * Ecwid can update the product-page DOM after navigation.
     * Retry briefly so the badge appears after the price is rendered.
     */
    let tries = 0;
    const timer = setInterval(function () {
      tries += 1;
      if (createTrigger() || tries > 30) clearInterval(timer);
    }, 300);
  }

  function hookEcwid() {
    if (window.Ecwid && Ecwid.OnPageSwitch) {
      Ecwid.OnPageSwitch.add(function (page) {
        removeExisting();
        if (page && page.type === 'PRODUCT') {
          init();
        }
      });
    }

    if (window.Ecwid && Ecwid.OnPageLoaded) {
      Ecwid.OnPageLoaded.add(function () {
        removeExisting();
        init();
      });
    }

    init();
  }

  if (window.Ecwid && Ecwid.OnAPILoaded) {
    Ecwid.OnAPILoaded.add(hookEcwid);
  } else {
    window.addEventListener('load', hookEcwid);
    setTimeout(hookEcwid, 1200);
  }
})();
