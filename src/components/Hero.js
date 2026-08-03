import homeScreen from '../assets/home-screen.png';

export default function Hero() {
  return (
    <section id="top" style={{position:'relative',background:'#0E1A24',color:'#fff',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-160,right:-120,width:620,height:620,borderRadius:'50%',background:'radial-gradient(circle,rgba(39,157,159,.45),transparent 62%)',animation:'glow 7s ease-in-out infinite',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:-220,left:-140,width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(20,89,91,.5),transparent 65%)',pointerEvents:'none'}} />

      <div className="hero-grid" style={{position:'relative',maxWidth:1180,margin:'0 auto',padding:'88px 24px 96px',display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:56,alignItems:'center'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(39,157,159,.16)',border:'1px solid rgba(39,157,159,.35)',color:'#7FE0DE',fontWeight:700,fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',padding:'7px 14px',borderRadius:999,marginBottom:26}}>
            Scan · Review · Improve
          </div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:64,lineHeight:1.03,letterSpacing:'-.03em',marginBottom:22}}>
            Turn handwritten<br/>games into <span style={{color:'#F5A623'}}>meaningful</span><br/>learning.
          </h1>
          <p style={{fontSize:19,color:'#AEBCC4',maxWidth:540,marginBottom:34}}>
            Kibitzz scans your handwritten scoresheet, reconstructs the game move by move, analyzes it with Stockfish, and explains the critical moments in plain English.
          </p>
          <div className="hero-buttons" style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:22}}>
            <a href="#get" className="store-btn" style={{display:'flex',alignItems:'center',gap:11,background:'#fff',color:'#0E1A24',padding:'14px 22px',borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>
              <span style={{fontSize:22}}>&#xF8FF;</span>
              <span style={{display:'flex',flexDirection:'column',lineHeight:1.1,textAlign:'left'}}>
                <small style={{fontSize:10,fontWeight:600,color:'#6B7B84',letterSpacing:'.04em'}}>Download on the</small>App Store
              </span>
            </a>
            <a href="#get" className="store-btn" style={{display:'flex',alignItems:'center',gap:11,background:'#fff',color:'#0E1A24',padding:'14px 22px',borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>
              <span style={{fontSize:20}}>&#9654;</span>
              <span style={{display:'flex',flexDirection:'column',lineHeight:1.1,textAlign:'left'}}>
                <small style={{fontSize:10,fontWeight:600,color:'#6B7B84',letterSpacing:'.04em'}}>Get it on</small>Google Play
              </span>
            </a>
          </div>
        </div>
        <div className="hero-phone" style={{display:'flex',justifyContent:'center',animation:'floaty 6s ease-in-out infinite'}}>
          <img src={homeScreen} alt="Kibitzz home screen" style={{width:260,borderRadius:30,boxShadow:'0 30px 70px rgba(0,0,0,.5)'}} />
        </div>
      </div>
    </section>
  );
}
