import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
// import Demo from './pages/Demo'; // Demo page disabled until it is ready (also re-enable the route below and in scripts/prerender.js)
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { LeaderboardIndex, LeaderboardPage } from './pages/Leaderboards';

// Brilliancy Board organiser console. On under `npm start`; a production build
// only mounts /admin with REACT_APP_ENABLE_ADMIN=true (webpack still emits the
// unused chunk file; the API behind it needs an admin login either way).
const ADMIN_ENABLED = process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENABLE_ADMIN === 'true';
const AdminApp = ADMIN_ENABLED ? lazy(() => import('./admin/AdminApp')) : null;
// Public leaderboards. A production build needs REACT_APP_API_URL so it never
// points at the dev API by accident; `npm start` falls back to dev.
const LEADERBOARDS_ENABLED = process.env.NODE_ENV === 'development' || !!process.env.REACT_APP_API_URL;

// Routes live in their own component so scripts/prerender.js can render them
// inside a StaticRouter at build time.
export function AppRoutes() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        {/* <Route path="/demo" element={<Demo />} /> */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        {LEADERBOARDS_ENABLED && <Route path="/leaderboards" element={<LeaderboardIndex />} />}
        {LEADERBOARDS_ENABLED && <Route path="/leaderboards/:slug" element={<LeaderboardPage />} />}
        {AdminApp && (
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
        )}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
