import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The production build is prerendered (scripts/prerender.js). If the HTML we
// were served was rendered for this exact path, hydrate it; otherwise (dev
// server, or an unknown URL that fell back to the home page HTML) render fresh.
const normalizePath = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
if (container.getAttribute('data-prerendered-path') === normalizePath(window.location.pathname)) {
  ReactDOM.hydrateRoot(container, app);
} else {
  container.textContent = '';
  ReactDOM.createRoot(container).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
