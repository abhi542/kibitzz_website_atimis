import { Link } from 'react-router-dom';
import appLogo from '../assets/app-logo.png';

export default function Footer() {
  return (
    <footer style={{background:'#0B141A',color:'#8A99A1',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div className="footer-inner" style={{maxWidth:1320,margin:'0 auto',padding:'48px 32px',display:'flex',flexWrap:'wrap',gap:28,alignItems:'center',justifyContent:'space-between'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none'}}>
          <img src={appLogo} alt="Kibitzz logo" width="36" height="36" style={{width:36,height:36,borderRadius:10}} />
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,color:'#fff'}}>
            Kibit<span style={{color:'#279D9F'}}>zz</span>
          </span>
        </Link>
        <div style={{display:'flex',gap:28,flexWrap:'wrap',fontSize:15}}>
          <a href="/#how" className="footer-link" style={{color:'#8A99A1'}}>How it works</a>
          <a href="/#features" className="footer-link" style={{color:'#8A99A1'}}>Features</a>
          {/* <a href="/#pricing" className="footer-link" style={{color:'#8A99A1'}}>Pricing</a> */}
          <a href="/#support" className="footer-link" style={{color:'#8A99A1'}}>Support</a>
          <a href="mailto:contact@kibitzz.in" className="footer-link" style={{color:'#8A99A1'}}>Contact</a>
        </div>
        <div style={{fontSize:14,color:'#5E6E76',width:'100%',borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:24,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
          <span>&copy; 2026 Kibitzz &middot; Scan &middot; Review &middot; Improve</span>
          <span style={{display:'flex',gap:20}}>
            <Link to="/privacy" className="footer-link" style={{color:'#5E6E76'}}>Privacy</Link>
            <Link to="/terms" className="footer-link" style={{color:'#5E6E76'}}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
