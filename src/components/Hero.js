import { Link } from 'react-router-dom';
import homeScreen from '../assets/home-screen.png';

export default function Hero() {
  return (
    <section id="top" style={{position:'relative',background:'#0E1A24',color:'#fff',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-160,right:-120,width:620,height:620,borderRadius:'50%',background:'radial-gradient(circle,rgba(39,157,159,.45),transparent 62%)',animation:'glow 7s ease-in-out infinite',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:-220,left:-140,width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(20,89,91,.5),transparent 65%)',pointerEvents:'none'}} />

      <div className="hero-grid" style={{position:'relative',maxWidth:1320,margin:'0 auto',padding:'100px 32px 110px',display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:64,alignItems:'center'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:9,background:'rgba(39,157,159,.16)',border:'1px solid rgba(39,157,159,.35)',color:'#7FE0DE',fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',padding:'8px 16px',borderRadius:999,marginBottom:28}}>
            Scan · Review · Improve
          </div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:72,lineHeight:1.03,letterSpacing:'-.03em',marginBottom:26}}>
            Turn handwritten<br/>games into <span style={{color:'#F5A623'}}>meaningful</span><br/>learning.
          </h1>
          <p style={{fontSize:21,color:'#AEBCC4',maxWidth:560,marginBottom:38,lineHeight:1.6}}>
            Kibitzz scans your handwritten scoresheet, reconstructs the game move by move, analyzes it with Stockfish, and explains the critical moments in plain English.
          </p>
          <div className="hero-buttons" style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:24}}>
            <Link to="/coming-soon" className="store-btn" style={{display:'flex',alignItems:'center',gap:12,background:'#fff',color:'#0E1A24',padding:'16px 26px',borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,textDecoration:'none'}}>
              <span style={{fontSize:20}}>&#xF8FF;</span>
              <span style={{display:'flex',flexDirection:'column',lineHeight:1.1,textAlign:'left'}}>
                <small style={{fontSize:12,fontWeight:600,color:'#6B7B84',letterSpacing:'.04em'}}>Download on the</small>App Store
              </span>
            </Link>
            <a href="https://play.google.com/store/apps/details?id=com.chesslens.chess_scan&hl=en" target="_blank" rel="noopener noreferrer" className="store-btn" style={{display:'flex',alignItems:'center',gap:12,background:'#fff',color:'#0E1A24',padding:'16px 26px',borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3.61 1.814A1.82 1.82 0 003 3.293v17.414a1.82 1.82 0 00.61 1.479l.078.066 9.767-9.767v-.23L3.688 1.749l-.078.065z" fill="#4285F4"/><path d="M16.711 15.74l-3.256-3.255v-.23l3.256-3.256.073.042 3.86 2.193c1.102.626 1.102 1.65 0 2.276l-3.86 2.193-.073.037z" fill="#FBBC04"/><path d="M16.784 15.703L13.455 12.37 3.61 22.186c.363.385.964.432 1.636.048l11.538-6.531z" fill="#EA4335"/><path d="M16.784 8.999L5.246 2.466C4.574 2.082 3.973 2.13 3.61 2.514L13.455 12.37l3.329-3.371z" fill="#34A853"/></svg>
              <span style={{display:'flex',flexDirection:'column',lineHeight:1.1,textAlign:'left'}}>
                <small style={{fontSize:12,fontWeight:600,color:'#6B7B84',letterSpacing:'.04em'}}>Get it on</small>Google Play
              </span>
            </a>
          </div>
        </div>
        <div className="hero-phone" style={{display:'flex',justifyContent:'center',animation:'floaty 6s ease-in-out infinite'}}>
          <img src={homeScreen} alt="Kibitzz home screen" style={{width:320,borderRadius:34,boxShadow:'0 30px 70px rgba(0,0,0,.5)'}} />
        </div>
      </div>
    </section>
  );
}
