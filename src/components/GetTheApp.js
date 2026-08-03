import appLogo from '../assets/app-logo.png';
import homeScreen from '../assets/home-screen.png';

export default function GetTheApp() {
  return (
    <section id="get" style={{scrollMarginTop:74,position:'relative',background:'#0E1A24',color:'#fff',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-140,left:'20%',width:640,height:420,background:'radial-gradient(circle,rgba(39,157,159,.4),transparent 62%)',pointerEvents:'none'}} />
      <div className="get-grid" style={{position:'relative',maxWidth:1180,margin:'0 auto',padding:'96px 24px',display:'grid',gridTemplateColumns:'1fr .7fr',gap:56,alignItems:'center'}}>
        <div>
          <img src={appLogo} alt="Kibitzz app icon" width="64" height="64" style={{width:64,height:64,borderRadius:17,marginBottom:26,boxShadow:'0 12px 30px rgba(20,89,91,.45)'}} />
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:46,letterSpacing:'-.03em',lineHeight:1.06,marginBottom:16}}>
            Your next game deserves<br/>a second look.
          </h2>
          <p style={{fontSize:18,color:'#AEBCC4',maxWidth:480,marginBottom:34}}>
            Available on iOS and Android. Bring your tournament scoresheet, we'll handle the digitization, analysis, and insights.
          </p>
          <div className="get-buttons" style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            <div style={{background:'#0B141A',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:'22px 24px',width:220}}>
              <div style={{fontSize:30,marginBottom:10}}>&#xF8FF;</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16,marginBottom:4}}>iOS</div>
              <div style={{fontSize:13,color:'#8A99A1',marginBottom:16}}>iOS 15 or later</div>
              <a href="#get" style={{display:'block',textAlign:'center',background:'#fff',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,padding:11,borderRadius:11}}>App Store</a>
            </div>
            <div style={{background:'#0B141A',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:'22px 24px',width:220}}>
              <div style={{fontSize:30,marginBottom:10}}>&#9654;</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16,marginBottom:4}}>Android</div>
              <div style={{fontSize:13,color:'#8A99A1',marginBottom:16}}>Android 9 or later</div>
              <a href="#get" style={{display:'block',textAlign:'center',background:'#fff',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,padding:11,borderRadius:11}}>Google Play</a>
            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
          <img src={homeScreen} alt="Kibitzz home screen" style={{width:260,borderRadius:30,boxShadow:'0 30px 70px rgba(0,0,0,.5)'}} />
        </div>
      </div>
    </section>
  );
}
