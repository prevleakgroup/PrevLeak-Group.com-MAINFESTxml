import {
  ArrowRight,
  ChartNoAxesCombined,
  Check,
  createIcons,
  ExternalLink,
  Globe2,
  Menu,
  Route,
  ShieldCheck,
  Truck,
  Waypoints,
  X,
} from 'lucide';
import { gateways, products } from '../../shared/gateways.js';
import './styles.css';

const app = document.querySelector('#app');
const iconSet = { ArrowRight, ChartNoAxesCombined, Check, ExternalLink, Globe2, Menu, Route, ShieldCheck, Truck, Waypoints, X };
const productLogos = {
  SafeRide: '/brand/saferide.jpg',
  PaletteMath: '/brand/palette-math.png',
  'Innovation Fleet': '/brand/prevleak-group.png',
};

if (app) {
  const productMarkup = products.map((product, index) => `
    <article class="product" style="--delay: ${index * 90}ms">
      <div class="product-heading"><span>0${index + 1}</span><i data-lucide="${product.icon}"></i></div>
      <div class="product-logo"><img src="${productLogos[product.name]}" alt="${product.name} logo" /></div>
      <p>${product.label}</p>
      <h3>${product.name}</h3>
      <div class="product-rule"></div>
      <p class="product-copy">${product.description}</p>
      <a href="https://prevleak-admin.web.app" aria-label="Explore ${product.name}">Explore system <i data-lucide="arrow-right"></i></a>
    </article>
  `).join('');

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="PrevLeak Group home"><img src="/brand/prevleak-group.png" alt="PrevLeak Group" /></a>
      <button class="menu-button" aria-label="Open navigation" aria-expanded="false"><i data-lucide="menu"></i></button>
      <nav aria-label="Primary navigation">
        <a href="#systems">Systems</a>
        <a href="#approach">Approach</a>
        <a href="#network">Network</a>
        <a class="console-link" href="https://prevleak-admin.web.app">Open console <i data-lucide="external-link"></i></a>
      </nav>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero-media" role="img" aria-label="Urban mobility network at street level"></div>
        <div class="hero-shade"></div>
        <div class="hero-content">
          <p class="eyebrow">Connected operations / South Africa</p>
          <h1>PrevLeak<br />Group</h1>
          <div class="hero-bottom">
            <p>Infrastructure for safer movement, clearer decisions, and accountable delivery.</p>
            <a href="#systems">Explore our systems <i data-lucide="arrow-right"></i></a>
          </div>
        </div>
        <div class="hero-index"><span>01</span><div></div><span>03</span></div>
      </section>

      <section class="intro" id="systems">
        <div>
          <p class="eyebrow dark">What we build</p>
          <h2>One group.<br />Useful systems.</h2>
        </div>
        <p class="intro-copy">PrevLeak Group connects mobility, fleet operations, and decision intelligence through practical digital products built for the realities of African cities and teams.</p>
      </section>

      <section class="products" aria-label="PrevLeak products">${productMarkup}</section>

      <section class="approach" id="approach">
        <div class="approach-image" role="img" aria-label="Team coordinating operational systems"></div>
        <div class="approach-copy">
          <p class="eyebrow dark">How we operate</p>
          <h2>Built close to the work.</h2>
          <p>Technology earns its place when it makes the next decision clearer. Our systems are designed around live operations, visible accountability, and simple pathways from signal to action.</p>
          <ul>
            <li><i data-lucide="check"></i>Operational data in one view</li>
            <li><i data-lucide="check"></i>Secure cloud and local gateways</li>
            <li><i data-lucide="check"></i>Deployments that teams can own</li>
          </ul>
        </div>
      </section>

      <section class="network" id="network">
        <div>
          <p class="eyebrow">Live network</p>
          <h2>${gateways.length} connected gateways.<br />One operating picture.</h2>
        </div>
        <div class="network-stats">
          <div><strong>${gateways.filter((item) => item.environment === 'Production').length}</strong><span>Public surfaces</span></div>
          <div><strong>${gateways.filter((item) => item.environment === 'Local').length}</strong><span>Local services</span></div>
          <div><strong>${gateways.filter((item) => item.environment === 'Cloud').length}</strong><span>Cloud connection</span></div>
        </div>
        <a href="https://prevleak-admin.web.app">View gateway directory <i data-lucide="arrow-right"></i></a>
      </section>
    </main>

    <footer>
      <a class="brand footer-brand" href="#top"><img src="/brand/prevleak-group.png" alt="PrevLeak Group" /></a>
      <p>Mobility. Intelligence. Delivery.</p>
      <div><a href="https://prevleak-admin.web.app">Operations</a><span>&copy; ${new Date().getFullYear()} PrevLeak Group</span></div>
    </footer>
  `;

  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    createIcons({ icons: iconSet });
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  createIcons({ icons: iconSet });
}
