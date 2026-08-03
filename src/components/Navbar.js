import { useState } from 'react';
import appLogo from '../assets/app-logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{position:'sticky',top:0,zIndex:50,background:'rgba(238,241,240,.82)',backdropFilter:'blur(14px)',borderBottom:'1px solid #E4E8E7'}}>
      <nav style={{maxWidth:1180,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:24}}>
        <a href="#top" style={{display:'flex',alignItems:'center',gap:11}}>
          <img src={appLogo} alt="Kibitzz logo" width="38" height="38" style={{width:38,height:38,borderRadius:11,display:'block',boxShadow:'0 4px 12px rgba(20,89,91,.3)'}} />
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:25,letterSpacing:'-.02em',color:'#0E1A24'}}>
            Kibit<span style={{color:'#279D9F'}}>zz</span>
          </span>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:30}}>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#how" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:15}}>How it works</a>
            <a href="#features" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:15}}>Features</a>
            <a href="#built-for" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:15}}>Who it's for</a>
            <a href="#pricing" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:15}}>Pricing</a>
            <a href="#support" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:15}}>Support</a>
          </div>
          <a href="#get" className="cta-dark" style={{background:'#0E1A24',color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,padding:'11px 20px',borderRadius:12,boxShadow:'0 4px 14px rgba(14,26,36,.2)'}}>
            Get the app
          </a>
        </div>
      </nav>
    </header>
  );
}
