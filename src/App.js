import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ComingSoon from './pages/ComingSoon';
import Demo from './pages/Demo';
import Learn from './pages/Learn';
import LearnArticle from './pages/LearnArticle';

// Routes live in their own component so scripts/prerender.js can render them
// inside a StaticRouter at build time.
export function AppRoutes() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<LearnArticle />} />
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
