import { Link } from 'react-router-dom';
import appLogo from '../assets/app-logo.png';
import homeScreen from '../assets/home-screen.png';

export default function GetTheApp() {
  return (
    <section id="get" style={{scrollMarginTop:74,position:'relative',background:'#0E1A24',color:'#fff',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-140,left:'20%',width:640,height:420,background:'radial-gradient(circle,rgba(39,157,159,.4),transparent 62%)',pointerEvents:'none'}} />
      <div className="get-grid" style={{position:'relative',maxWidth:1320,margin:'0 auto',padding:'110px 32px',display:'grid',gridTemplateColumns:'1fr .7fr',gap:64,alignItems:'center'}}>
        <div>
          <img src={appLogo} alt="Kibitzz app icon" width="72" height="72" style={{width:72,height:72,borderRadius:18,marginBottom:28,boxShadow:'0 12px 30px rgba(20,89,91,.45)'}} />
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:52,letterSpacing:'-.03em',lineHeight:1.06,marginBottom:18}}>
            Your next game deserves<br/>a second look.
          </h2>
          <p style={{fontSize:20,color:'#AEBCC4',maxWidth:500,marginBottom:38,lineHeight:1.6}}>
            Available on iOS and Android. Bring your tournament scoresheet, we'll handle the digitization, analysis, and insights.
          </p>
          <div className="get-buttons" style={{display:'flex',gap:18,flexWrap:'wrap'}}>
            <div style={{background:'#0B141A',border:'1px solid rgba(255,255,255,.1)',borderRadius:20,padding:'24px 28px',width:240}}>
              <div style={{fontSize:34,marginBottom:12}}>&#xF8FF;</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>iOS</div>
              <div style={{fontSize:14,color:'#8A99A1',marginBottom:18}}>iOS 15 or later</div>
              <Link to="/coming-soon" style={{display:'block',textAlign:'center',background:'#fff',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:13,borderRadius:12,textDecoration:'none'}}>App Store</Link>
            </div>
            <div style={{background:'#0B141A',border:'1px solid rgba(255,255,255,.1)',borderRadius:20,padding:'24px 28px',width:240}}>
              <div style={{marginBottom:12}}><svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M3.61 1.814A1.82 1.82 0 003 3.293v17.414a1.82 1.82 0 00.61 1.479l.078.066 9.767-9.767v-.23L3.688 1.749l-.078.065z" fill="#4285F4"/><path d="M16.711 15.74l-3.256-3.255v-.23l3.256-3.256.073.042 3.86 2.193c1.102.626 1.102 1.65 0 2.276l-3.86 2.193-.073.037z" fill="#FBBC04"/><path d="M16.784 15.703L13.455 12.37 3.61 22.186c.363.385.964.432 1.636.048l11.538-6.531z" fill="#EA4335"/><path d="M16.784 8.999L5.246 2.466C4.574 2.082 3.973 2.13 3.61 2.514L13.455 12.37l3.329-3.371z" fill="#34A853"/></svg></div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>Android</div>
              <div style={{fontSize:14,color:'#8A99A1',marginBottom:18}}>Android 9 or later</div>
              <a href="https://play.google.com/store/apps/details?id=com.chesslens.chess_scan&hl=en" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',background:'#fff',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:13,borderRadius:12}}>Google Play</a>
            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
          <img src={homeScreen} alt="Kibitzz home screen" style={{width:320,borderRadius:34,boxShadow:'0 30px 70px rgba(0,0,0,.5)'}} />
        </div>
      </div>
    </section>
  );
}
