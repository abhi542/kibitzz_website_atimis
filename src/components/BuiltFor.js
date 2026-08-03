const audiences = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7FE0DE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a2.5 2.5 0 0 1 1.5 4.5c.9.7 1.3 1.7 1 2.8l-.6 2.2h-3.8l-.6-2.2c-.3-1.1.1-2.1 1-2.8A2.5 2.5 0 0 1 12 3z"/><path d="M9 18.5h6l1 2.5H8l1-2.5z"/><path d="M9.3 12.5h5.4l.8 3.5H8.5l.8-3.5z"/></svg>,
    bg: 'rgba(39,157,159,.2)',
    title: 'Tournament Players',
    desc: 'Improve faster by reviewing every tournament game instead of letting the scoresheet sit in your bag.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8l10-4 10 4-10 4-10-4z"/><path d="M6 10.5v4.5c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 8v6"/></svg>,
    bg: 'rgba(245,166,35,.2)',
    title: 'Coaches & Academies',
    desc: 'Spend less time re-entering student games move by move, more time coaching what actually happened.',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7FCB92" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="8" r="2.2"/><circle cx="16" cy="8.5" r="1.8"/><path d="M4 19v-1.5c0-2 2-3.5 4.5-3.5S13 15.5 13 17.5V19"/><path d="M14.5 14.2c1.9.2 3.5 1.5 3.5 3.3V19"/></svg>,
    bg: 'rgba(63,160,90,.2)',
    title: 'Parents of Junior Players',
    desc: "Understand how tournaments actually went and stay aligned with your child's coach.",
  },
];

export default function BuiltFor() {
  return (
    <section id="built-for" style={{scrollMarginTop:74,position:'relative',background:'#0E1A24',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-180,left:'50%',transform:'translateX(-50%)',width:700,height:460,background:'radial-gradient(circle,rgba(39,157,159,.35),transparent 65%)',pointerEvents:'none'}} />
      <div style={{position:'relative',maxWidth:1180,margin:'0 auto',padding:'96px 24px'}}>
        <div style={{textAlign:'center',maxWidth:640,margin:'0 auto 52px'}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',color:'#F5A623',marginBottom:14}}>Built for</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:16,color:'#fff'}}>Where Kibitzz fits in</h2>
        </div>
        <div className="built-for-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:22}}>
          {audiences.map((a, i) => (
            <div key={i} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:30}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:a.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
                {a.icon}
              </div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:19,marginBottom:9,color:'#fff'}}>{a.title}</h3>
              <p style={{fontSize:14.5,color:'#AEBCC4'}}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
