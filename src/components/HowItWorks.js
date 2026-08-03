const steps = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.3" />
      </svg>
    ),
    title: 'Scan',
    desc: 'Capture your tournament scoresheet with your phone. Good lighting and a flat page are all you need.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a2.5 2.5 0 0 1 1.5 4.5c.9.7 1.3 1.7 1 2.8l-.6 2.2h-3.8l-.6-2.2c-.3-1.1.1-2.1 1-2.8A2.5 2.5 0 0 1 12 3z" />
        <path d="M9 18.5h6l1 2.5H8l1-2.5z" /><path d="M9.3 12.5h5.4l.8 3.5H8.5l.8-3.5z" />
      </svg>
    ),
    title: 'Digitize',
    desc: 'Handwritten notation becomes a validated, playable game. Every move checked against the rules.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6" /><path d="M8.3 11.3l1.4 1.4 2.6-3.4" /><path d="M15 15l5 5" />
      </svg>
    ),
    title: 'Analyze',
    desc: 'Stockfish analyzes every move, highlights critical moments, and calculates player accuracy.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{scrollMarginTop:74,padding:'96px 24px',maxWidth:1180,margin:'0 auto'}}>
      <div style={{textAlign:'center',maxWidth:640,margin:'0 auto 56px'}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:14}}>How it works</div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:16}}>
          From pen and paper to a coached game — in four steps
        </h2>
        <p style={{fontSize:19.5,color:'#6B7B84',textAlign:'center'}}>
          Forty handwritten moves become a playable, engine-checked game in about <b style={{color:'#F6890C'}}>8 seconds.</b>
        </p>
      </div>

      <div style={{position:'relative',paddingTop:8}}>
        <div style={{position:'absolute',top:36,left:'12.5%',right:'12.5%',height:0,borderTop:'3px dashed #C9E4E4',zIndex:0}} />
        <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,position:'relative',zIndex:1}}>
          {steps.map((s, i) => (
            <div key={i} style={{textAlign:'center'}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'#279D9F',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24,margin:'0 auto 20px',boxShadow:'0 10px 26px rgba(39,157,159,.4)'}}>
                {i + 1}
              </div>
              <div style={{marginBottom:10,display:'flex',justifyContent:'center'}}>{s.icon}</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:21,marginBottom:8}}>{s.title}</h3>
              <p style={{fontSize:14.5,color:'#6B7B84'}}>{s.desc}</p>
            </div>
          ))}

          {/* Step 4 — highlighted */}
          <div style={{textAlign:'center',background:'#0E1A24',borderRadius:22,padding:'28px 20px 26px',marginTop:-16,boxShadow:'0 18px 38px rgba(14,26,36,.28)'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'#F5A623',color:'#3A2A05',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24,margin:'0 auto 20px',boxShadow:'0 10px 26px rgba(245,166,35,.4)'}}>4</div>
            <div style={{marginBottom:10,display:'flex',justifyContent:'center'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3a3.5 3.5 0 0 0-3.4 4.3A3 3 0 0 0 4 10c0 1.1.6 2 1.5 2.5A3 3 0 0 0 8 17h1v3" />
                <path d="M15 3a3.5 3.5 0 0 1 3.4 4.3A3 3 0 0 1 20 10c0 1.1-.6 2-1.5 2.5A3 3 0 0 1 16 17h-1v3" />
                <path d="M9 3v17M15 3v17M9 8.5h2M13 8.5h2M9 13h2M13 13h2" />
              </svg>
            </div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:21,marginBottom:8,color:'#fff'}}>Insights</h3>
            <p style={{fontSize:14.5,color:'#AEBCC4'}}>An easy-to-understand summary explaining where the game changed, what was missed, and how to improve.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
