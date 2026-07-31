import {
  Activity,
  ArrowUpRight,
  Cable,
  Container,
  createIcons,
  Database,
  ExternalLink,
  Globe2,
  LayoutDashboard,
  PackageOpen,
  PanelsTopLeft,
  RefreshCw,
  Search,
  ShieldCheck,
  Waypoints,
} from 'lucide';
import { gateways } from '../../shared/gateways.js';
import './styles.css';

const app = document.querySelector('#app');
const iconSet = { Activity, ArrowUpRight, Cable, Container, Database, ExternalLink, Globe2, LayoutDashboard, PackageOpen, PanelsTopLeft, RefreshCw, Search, ShieldCheck, Waypoints };

const renderRows = (items) => items.map((gateway) => `
  <tr>
    <td>
      <div class="service-cell">
        <span class="service-icon"><i data-lucide="${gateway.icon}"></i></span>
        <span><strong>${gateway.name}</strong><small>${gateway.kind}</small></span>
      </div>
    </td>
    <td><span class="environment environment--${gateway.environment.toLowerCase()}">${gateway.environment}</span></td>
    <td><code>${gateway.port}</code></td>
    <td><span class="status"><span></span>${gateway.status}</span></td>
    <td class="row-action">
      ${gateway.url.startsWith('http') ? `<a href="${gateway.url}" target="_blank" rel="noreferrer" aria-label="Open ${gateway.name}" title="Open gateway"><i data-lucide="arrow-up-right"></i></a>` : '<span class="muted">Internal</span>'}
    </td>
  </tr>
`).join('');

if (app) {
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand" href="/" aria-label="PrevLeak operations home">
          <img src="/brand/prevleak-group.png" alt="PrevLeak Group" />
          <span>Operations</span>
        </a>
        <nav aria-label="Primary navigation">
          <a class="active" href="#overview"><i data-lucide="layout-dashboard"></i>Overview</a>
          <a href="#gateways"><i data-lucide="waypoints"></i>Gateways</a>
          <a href="#registry"><i data-lucide="package-open"></i>Registry</a>
          <a href="#mcp"><i data-lucide="cable"></i>MCP connections</a>
        </nav>
        <div class="sidebar-foot">
          <span class="live-dot"></span>
          <span>Control plane online<small>Firebase + local Docker</small></span>
        </div>
      </aside>

      <main>
        <header class="topbar">
          <div>
            <p class="eyebrow">Infrastructure / Overview</p>
            <h1>Service control</h1>
          </div>
          <div class="topbar-actions">
            <button class="icon-button" id="refresh" title="Refresh status" aria-label="Refresh status"><i data-lucide="refresh-cw"></i></button>
            <a class="primary-button" href="https://console.firebase.google.com/project/prevleak-group/overview" target="_blank" rel="noreferrer"><i data-lucide="external-link"></i>Firebase console</a>
          </div>
        </header>

        <section class="metrics" id="overview" aria-label="Gateway summary">
          <article><span class="metric-icon green"><i data-lucide="activity"></i></span><div><small>Connected gateways</small><strong>${gateways.length}</strong><p>Across 3 environments</p></div></article>
          <article><span class="metric-icon yellow"><i data-lucide="container"></i></span><div><small>Local services</small><strong>${gateways.filter((item) => item.environment === 'Local').length}</strong><p>Ports 3000-27018</p></div></article>
          <article><span class="metric-icon blue"><i data-lucide="globe-2"></i></span><div><small>Public surfaces</small><strong>${gateways.filter((item) => item.environment === 'Production').length}</strong><p>Firebase Hosting</p></div></article>
          <article><span class="metric-icon red"><i data-lucide="shield-check"></i></span><div><small>Security posture</small><strong>Clear</strong><p>0 npm vulnerabilities</p></div></article>
        </section>

        <section class="gateway-panel" id="gateways">
          <div class="panel-header">
            <div><p class="eyebrow">Source registry</p><h2>Gateway directory</h2></div>
            <div class="filters" role="group" aria-label="Filter gateways">
              <button class="filter active" data-filter="All">All</button>
              <button class="filter" data-filter="Production">Production</button>
              <button class="filter" data-filter="Local">Local</button>
              <button class="filter" data-filter="Cloud">Cloud</button>
            </div>
          </div>
          <div class="search-wrap"><i data-lucide="search"></i><input id="search" type="search" placeholder="Search service, type, or port" aria-label="Search gateways" /></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Service</th><th>Environment</th><th>Port</th><th>Status</th><th><span class="sr-only">Open</span></th></tr></thead>
              <tbody id="gateway-rows">${renderRows(gateways)}</tbody>
            </table>
          </div>
          <footer><span id="result-count">${gateways.length} gateways</span><span>Last refreshed <time id="refreshed">just now</time></span></footer>
        </section>

        <section class="brand-family" aria-labelledby="brand-family-heading">
          <div><p class="eyebrow">Brand network</p><h2 id="brand-family-heading">One operating family</h2></div>
          <div class="brand-logos">
            <figure><img src="/brand/prevleak-group.png" alt="PrevLeak Group" /><figcaption>Group</figcaption></figure>
            <figure><img src="/brand/saferide.jpg" alt="SafeRide" /><figcaption>Mobility</figcaption></figure>
            <figure><img src="/brand/palette-math.png" alt="PaletteMath" /><figcaption>Intelligence</figcaption></figure>
          </div>
        </section>
      </main>
    </div>
  `;

  let selectedFilter = 'All';
  const rows = document.querySelector('#gateway-rows');
  const search = document.querySelector('#search');
  const resultCount = document.querySelector('#result-count');

  const updateRows = () => {
    const query = search.value.trim().toLowerCase();
    const filtered = gateways.filter((gateway) => {
      const matchesEnvironment = selectedFilter === 'All' || gateway.environment === selectedFilter;
      const haystack = `${gateway.name} ${gateway.kind} ${gateway.port}`.toLowerCase();
      return matchesEnvironment && haystack.includes(query);
    });
    rows.innerHTML = renderRows(filtered);
    resultCount.textContent = `${filtered.length} gateway${filtered.length === 1 ? '' : 's'}`;
    createIcons({ icons: iconSet });
  };

  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    button.classList.add('active');
    selectedFilter = button.dataset.filter;
    updateRows();
  }));
  search.addEventListener('input', updateRows);
  document.querySelector('#refresh').addEventListener('click', (event) => {
    event.currentTarget.classList.add('spinning');
    document.querySelector('#refreshed').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    window.setTimeout(() => event.currentTarget.classList.remove('spinning'), 550);
  });

  createIcons({ icons: iconSet });
}
