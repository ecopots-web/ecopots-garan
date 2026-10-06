(function () {
  const FULL_LABEL_URL =
    'https://ecopots-web.github.io/ecopots-garan/GARAN_Ecopots_10_years_full.svg';

  const NESTED_LABEL_URL =
    'https://ecopots-web.github.io/ecopots-garan/GARAN_Ecopots_10_years_nested.svg';

  const GARAN_TEXT = 'EU GARAN · 10-year guarantee';

  function moveGaranIntoSubtitle() {
    const subtitle = document.querySelector(
      '.product-details-module.product-details__subtitle .product-details-module__content'
    );

    if (!subtitle) return;

    const currentText = subtitle.textContent.trim();

    if (subtitle.querySelector('.ecopots-garan-link')) return;

    if (currentText !== GARAN_TEXT) return;

    const link = document.createElement('a');
    link.className = 'ecopots-garan-link';
    link.href = FULL_LABEL_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'EU GARAN 10-year guarantee');

    const img = document.createElement('img');
    img.src = NESTED_LABEL_URL;
    img.alt = 'EU GARAN 10-year guarantee';
    img.width = 220;
    img.height = 34;
    img.style.display = 'block';
    img.style.width = '220px';
    img.style.height = 'auto';
    img.style.maxWidth = '100%';

    link.appendChild(img);
    subtitle.replaceChildren(link);
  }

  moveGaranIntoSubtitle();

  const observer = new MutationObserver(function () {
    moveGaranIntoSubtitle();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
