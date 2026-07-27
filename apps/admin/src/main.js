import { BRAND_NAME, BRAND_TAGLINE } from '../../shared/brand.js';

const app = document.querySelector('#app');
if (app) {
  const appLabel = 'Admin Panel';
  document.title = `${BRAND_NAME} · ${appLabel}`;
  app.innerHTML = `<h1>${BRAND_NAME}</h1><p>${BRAND_TAGLINE}</p><p>${appLabel}</p>`;
}
