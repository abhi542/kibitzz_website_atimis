import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import BuiltFor from './components/BuiltFor';
import Stories from './components/Stories';
import Scoresheets from './components/Scoresheets';
import Comparison from './components/Comparison';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import GetTheApp from './components/GetTheApp';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <BuiltFor />
      <Stories />
      <Scoresheets />
      <Comparison />
      <SocialProof />
      <Pricing />
      <FAQ />
      <GetTheApp />
      <Footer />
    </div>
  );
}

export default App;
