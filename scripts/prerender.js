#!/usr/bin/env node
/**
 * Post-build prerender (runs after `react-scripts build`).
 *
 * The site is a Create React App single-page app, so the HTML a crawler first
 * receives is an empty <div id="root">. Most AI crawlers (and Google's first
 * pass) do not run JavaScript, so they never see the content. This script
 * renders each public route to static HTML with react-dom/server and writes it
 * into build/, so the first response already contains the real page. In the
 * browser, src/index.js hydrates that markup instead of rebuilding it.
 *
 * No extra dependencies: it reuses Babel and React from node_modules.
 * Any problem fails the build loudly rather than silently shipping empty HTML.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BUILD = path.join(ROOT, 'build');
const SITE = 'https://kibitzz.in';

// 'test' makes babel-preset-react-app emit CommonJS that Node can load.
// React then uses its development build, which is fine for server rendering.
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

function fail(message) {
  console.error('\nprerender: ' + message);
  process.exit(1);
}

if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
  fail('build/index.html not found. Run "react-scripts build" first.');
}

// ---------------------------------------------------------------------------
// Module hooks so src/ can be loaded in plain Node
// ---------------------------------------------------------------------------
const assetManifest = JSON.parse(
  fs.readFileSync(path.join(BUILD, 'asset-manifest.json'), 'utf8')
).files;

// Images/video resolve to the exact hashed URLs webpack emitted, so the
// prerendered <img>/<video> tags match what the browser hydrates.
['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.svg', '.ico', '.mp4'].forEach((ext) => {
  Module._extensions[ext] = (mod, filename) => {
    const url = assetManifest['static/media/' + path.basename(filename)];
    if (!url) {
      fail('no built URL for ' + path.relative(ROOT, filename) + ' in build/asset-manifest.json');
    }
    mod.exports = url;
  };
});

// CSS is already linked from build/index.html; nothing to render here.
Module._extensions['.css'] = (mod) => { mod.exports = {}; };

// Compile src/*.js (JSX + ESM) with the same Babel preset CRA uses.
const babel = require('@babel/core');
const originalJs = Module._extensions['.js'];
Module._extensions['.js'] = function (mod, filename) {
  if (filename.startsWith(SRC + path.sep)) {
    const { code } = babel.transformFileSync(filename, {
      babelrc: false,
      configFile: false,
      presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]],
    });
    return mod._compile(code, filename);
  }
  return originalJs(mod, filename);
};

const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router');
const { AppRoutes } = require(path.join(SRC, 'App.js'));
const { faqs } = require(path.join(SRC, 'components', 'FAQ.js'));
const { articles } = require(path.join(SRC, 'content', 'blog.js'));

// ---------------------------------------------------------------------------
// Per-route head data
// ---------------------------------------------------------------------------
const HOME_TITLE = 'Kibitzz — Chess Scoresheet Scanner & Game Coach App';
const HOME_DESCRIPTION =
  'Kibitzz turns a handwritten chess scoresheet into a playable, engine-checked game in about 8 seconds — then explains, in plain English, exactly where the game slipped away.';

const ROUTES = [
  { path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION, home: true },
  {
    path: '/privacy',
    title: 'Privacy Policy — Kibitzz',
    description:
      'How Kibitzz collects, uses and protects your data, including scanned chess scoresheets and game analysis.',
  },
  {
    path: '/terms',
    title: 'Terms of Service — Kibitzz',
    description: 'The terms that apply when you use the Kibitzz chess scoresheet scanner app and website.',
  },
  {
    // Prerendered so the client can hydrate it, but kept out of search results.
    path: '/coming-soon',
    title: 'Coming soon — Kibitzz',
    description: 'The Kibitzz iOS app is coming soon. Join the waitlist to be notified at launch.',
    noindex: true,
  },
];

// Content pages: /demo, the /blog index and one page per post in src/content/blog.js.
const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: SITE + c.path,
  })),
});

const publisher = { '@type': 'Organization', name: 'Kibitzz', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/logo512.png' } };

ROUTES.push(
  {
    path: '/demo',
    title: 'Kibitzz Demo — See a Chess Scoresheet Scan and Analysis',
    description:
      'See how Kibitzz turns a photo of a handwritten chess scoresheet into a validated, playable game with Stockfish analysis and a plain-English explanation of the critical moments.',
    jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Demo', path: '/demo' }])],
  },
  {
    path: '/blog',
    title: 'Blog — Chess Scoresheet, PGN and Game Analysis | Kibitzz',
    description:
      'Practical articles on digitizing handwritten chess scoresheets, converting them to PGN, chess OCR and analyzing your games to improve.',
    jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])],
  }
);

articles.forEach((a) => {
  const articlePath = '/blog/' + a.slug;
  ROUTES.push({
    path: articlePath,
    title: a.metaTitle,
    description: a.description,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.updated || a.published,
        author: { '@type': 'Organization', name: 'Kibitzz', url: SITE + '/' },
        publisher,
        image: SITE + '/og-image.png',
        mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + articlePath },
      },
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: a.title, path: articlePath },
      ]),
    ],
  });
});

// Every indexable page must be listed in public/sitemap.xml, so none gets forgotten.
const sitemapXml = fs.readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
ROUTES.filter((r) => !r.noindex).forEach((r) => {
  const loc = SITE + (r.path === '/' ? '/' : r.path);
  if (!sitemapXml.includes('<loc>' + loc + '</loc>')) fail('public/sitemap.xml is missing ' + loc);
});

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function replaceOnce(html, re, replacement, label) {
  if (!re.test(html)) fail('build/index.html is missing ' + label + ' (template changed?)');
  return html.replace(re, () => replacement);
}

function setMeta(html, attr, key, value) {
  const re = new RegExp('<meta\\b[^>]*\\b' + attr + '=["\']?' + escRe(key) + '["\']?[^>]*>');
  return replaceOnce(html, re, '<meta ' + attr + '="' + key + '" content="' + escAttr(value) + '"/>', attr + '="' + key + '"');
}

function faqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  // "<" is escaped so the JSON can never close the <script> tag early.
  return '<script type="application/ld+json">' + JSON.stringify(data).replace(/</g, '\\u003c') + '</script>';
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) {
  fail('build/index.html has no empty <div id="root"></div> (already prerendered?)');
}

const renderWarnings = [];
const originalConsoleError = console.error;
console.error = (...args) => { renderWarnings.push(args.map(String).join(' ')); };

const outputs = [];
for (const route of ROUTES) {
  let markup;
  try {
    markup = renderToString(
      React.createElement(StaticRouter, { location: route.path }, React.createElement(AppRoutes))
    );
  } catch (err) {
    console.error = originalConsoleError;
    fail('rendering ' + route.path + ' threw: ' + (err && err.stack ? err.stack : err));
  }
  // An unmatched route renders (almost) nothing; an indexable page must have a heading.
  if (markup.length < 200 || (!route.noindex && !/<h1[\s>]/.test(markup))) {
    console.error = originalConsoleError;
    fail('rendering ' + route.path + ' produced no real content; the route probably did not match.');
  }

  const url = SITE + (route.path === '/' ? '/' : route.path);
  let html = template;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, '<title>' + escText(route.title) + '</title>', '<title>');
  html = setMeta(html, 'name', 'description', route.description);
  html = setMeta(html, 'property', 'og:title', route.home ? 'Kibitzz — Turn handwritten chess scoresheets into meaningful learning' : route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', route.home ? 'Kibitzz — Turn handwritten chess scoresheets into meaningful learning' : route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = replaceOnce(html, /<link\b[^>]*rel=["']?canonical["']?[^>]*>/, '<link rel="canonical" href="' + url + '"/>', 'canonical link');

  // Organization / WebSite / MobileApplication data belongs on the home page only.
  const ldBlock = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  html = route.home ? html : html.replace(ldBlock, '');
  const jsonLdTags = (route.jsonLd || [])
    .map((d) => '<script type="application/ld+json">' + JSON.stringify(d).replace(/</g, '\\u003c') + '</script>')
    .join('');
  const extraHead = (route.home ? faqJsonLd() : '') + jsonLdTags + (route.noindex ? '<meta name="robots" content="noindex,follow"/>' : '');
  if (extraHead) html = html.replace('</head>', () => extraHead + '</head>');

  // The page is real HTML now, so the "enable JavaScript" fallback would just duplicate it.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '');

  html = html.replace(
    '<div id="root"></div>',
    () => '<div id="root" data-prerendered-path="' + route.path + '">' + markup + '</div>'
  );

  const outFile = route.path === '/' ? path.join(BUILD, 'index.html') : path.join(BUILD, route.path, 'index.html');
  outputs.push({ route: route.path, outFile, html, file: path.relative(ROOT, outFile), bytes: Buffer.byteLength(html) });
}

console.error = originalConsoleError;

// Write only after every route rendered, so a failure never leaves build/ half-converted.
outputs.forEach((o) => {
  fs.mkdirSync(path.dirname(o.outFile), { recursive: true });
  fs.writeFileSync(o.outFile, o.html);
});
console.log('\nprerender: wrote ' + outputs.length + ' pages');
outputs.forEach((o) => console.log('  ' + o.route.padEnd(14) + o.file.padEnd(34) + (o.bytes / 1024).toFixed(1) + ' KB'));
if (renderWarnings.length) {
  console.log('\nprerender: React reported ' + renderWarnings.length + ' warning(s) while rendering:');
  renderWarnings.slice(0, 10).forEach((w) => console.log('  - ' + w.split('\n')[0]));
}
