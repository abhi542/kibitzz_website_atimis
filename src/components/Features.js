const smallCards = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h2v2h2V4h2v2h2V4h2v4l-1.5 2v7h-9V10L6 8V4z"/><path d="M6 21h12M7.5 17.5h9"/></svg>,
    title: 'Real board replay',
    desc: 'See through the whole game on a chess board, move by move, with every critical moment flagged.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="#33454F"/></svg>,
    title: 'Accuracy & blunders',
    desc: 'Per-player accuracy and colour-coded move quality at a glance.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5c1.8-1 4.3-1 7 .4v13c-2.7-1.4-5.2-1.4-7-.4z"/><path d="M20 5.5c-1.8-1-4.3-1-7 .4v13c2.7-1.4 5.2-1.4 7-.4z"/></svg>,
    title: 'Your game library',
    desc: 'Every game stored, searchable & synced across Android & iOS.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33454F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l5-5 4 3 6-7"/><path d="M15 8h4v4"/></svg>,
    title: 'Progress over time',
    desc: 'Identify recurring mistakes and measure progress across every tournament.',
  },
];

export default function Features() {
  return (
    <section id="features" style={{scrollMarginTop:74,background:'#fff',borderTop:'1px solid #E4E8E7',borderBottom:'1px solid #E4E8E7'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'96px 24px'}}>
        <div style={{maxWidth:680,marginBottom:52}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:14}}>Features</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:16}}>Everything after the last move is played.</h2>
          <p style={{fontSize:17,color:'#6B7B84'}}>The scan is just the start. What sets Kibitzz apart is what happens next.</p>
        </div>

        <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gridAutoRows:'auto',gap:20}}>
          {/* AI Insights — wide dark */}
          <div className="span-2" style={{gridColumn:'span 2',background:'#0E1A24',borderRadius:20,padding:32,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-60,right:-60,width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,166,35,.22),transparent 70%)'}} />
            <div style={{width:52,height:52,borderRadius:14,background:'rgba(245,166,35,.18)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,position:'relative'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3a3.5 3.5 0 0 0-3.4 4.3A3 3 0 0 0 4 10c0 1.1.6 2 1.5 2.5A3 3 0 0 0 8 17h1v3"/>
                <path d="M15 3a3.5 3.5 0 0 1 3.4 4.3A3 3 0 0 1 20 10c0 1.1-.6 2-1.5 2.5A3 3 0 0 1 16 17h-1v3"/>
                <path d="M9 3v17M15 3v17M9 8.5h2M13 8.5h2M9 13h2M13 13h2"/>
              </svg>
            </div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24,marginBottom:10,color:'#fff',position:'relative'}}>AI-powered game insights</h3>
            <p style={{fontSize:15,color:'#AEBCC4',maxWidth:420,position:'relative'}}>Understand the turning points in your game with simple, in-depth explanations instead of raw engine evaluations.</p>
          </div>

          {/* OCR — wide teal */}
          <div className="span-2" style={{gridColumn:'span 2',background:'#E2F1F1',border:'1px solid #C9E4E4',borderRadius:20,padding:32}}>
            <div style={{width:52,height:52,borderRadius:14,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B7274" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h7M9 15.5h7M9 8.5h3"/>
              </svg>
            </div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24,marginBottom:10,color:'#0E1A24'}}>Handwriting OCR</h3>
            <p style={{fontSize:15,color:'#33454F',maxWidth:420}}>Reads handwritten tournament scoresheets and validates every move against the rules, so unclear ink never breaks the game.</p>
          </div>

          {/* Small cards */}
          {smallCards.map((c, i) => (
            <div key={i} style={{border:'1px solid #E4E8E7',borderRadius:18,padding:24,background:'#F9FAFA'}}>
              <div style={{marginBottom:12}}>{c.icon}</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16.5,marginBottom:7}}>{c.title}</h3>
              <p style={{fontSize:13.5,color:'#6B7B84'}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
