import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <BrowserRouter>
      <div style={{ overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
