import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ComingSoon from './pages/ComingSoon';
// import Demo from './pages/Demo'; // Demo page disabled until it is ready (also re-enable the route below and in scripts/prerender.js)
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

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
