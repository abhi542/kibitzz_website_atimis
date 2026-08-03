import appLogo from '../assets/app-logo.png';

export default function Footer() {
  return (
    <footer style={{background:'#0B141A',color:'#8A99A1',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div className="footer-inner" style={{maxWidth:1180,margin:'0 auto',padding:'44px 24px',display:'flex',flexWrap:'wrap',gap:24,alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:11}}>
          <img src={appLogo} alt="Kibitzz logo" width="32" height="32" style={{width:32,height:32,borderRadius:9}} />
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,color:'#fff'}}>
            Kibit<span style={{color:'#279D9F'}}>zz</span>
          </span>
        </div>
        <div style={{display:'flex',gap:26,flexWrap:'wrap',fontSize:14}}>
          <a href="#how" className="footer-link" style={{color:'#8A99A1'}}>How it works</a>
          <a href="#features" className="footer-link" style={{color:'#8A99A1'}}>Features</a>
          <a href="#pricing" className="footer-link" style={{color:'#8A99A1'}}>Pricing</a>
          <a href="#support" className="footer-link" style={{color:'#8A99A1'}}>Support</a>
          <a href="mailto:contact.kibitzz.ai@gmail.com" className="footer-link" style={{color:'#8A99A1'}}>Contact</a>
        </div>
        <div style={{fontSize:13,color:'#5E6E76',width:'100%',borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:22,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <span>&copy; 2026 Kibitzz &middot; Scan &middot; Review &middot; Improve</span>
          <span style={{display:'flex',gap:18}}>
            <a href="#privacy" className="footer-link" style={{color:'#5E6E76'}}>Privacy</a>
            <a href="#terms" className="footer-link" style={{color:'#5E6E76'}}>Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
