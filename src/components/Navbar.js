import { useState } from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/kibitzz_logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{position:'sticky',top:0,zIndex:50,background:'rgba(238,241,240,.82)',backdropFilter:'blur(14px)',borderBottom:'1px solid #E4E8E7'}}>
      <nav style={{maxWidth:1320,margin:'0 auto',padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:28}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
          <img src={appLogo} alt="Kibitzz logo" width="42" height="42" style={{width:42,height:42,borderRadius:12,display:'block',boxShadow:'0 4px 12px rgba(20,89,91,.3)'}} />
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-.02em',color:'#0E1A24'}}>
            Kibit<span style={{color:'#279D9F'}}>zz</span>
          </span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:32}}>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="/#how" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:16}}>How it works</a>
            <a href="/#features" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:16}}>Features</a>
            <a href="/#built-for" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:16}}>Who it's for</a>
            {/* <a href="/#pricing" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:16}}>Pricing</a> */}
            <a href="/#support" className="nav-link" style={{color:'#33454F',fontWeight:500,fontSize:16}}>Support</a>
          </div>
          <a href="/#get" className="cta-dark nav-cta" style={{background:'#0E1A24',color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:'12px 24px',borderRadius:12,boxShadow:'0 4px 14px rgba(14,26,36,.2)'}}>
            Get the app
          </a>
        </div>
      </nav>
    </header>
  );
}
