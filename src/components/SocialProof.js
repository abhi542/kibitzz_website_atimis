const stats = [
  { value: '500+', label: 'Games analyzed' },
  { value: '20+', label: 'Coaches in early access' },
  { value: '98%', label: 'OCR accuracy on tournament sheets' },
  { value: '100+', label: 'Scoresheets digitized' },
];

export default function SocialProof() {
  return (
    <section id="proof" style={{background:'#0E1A24',color:'#fff'}}>
      <div style={{maxWidth:1320,margin:'0 auto',padding:'100px 32px',textAlign:'center'}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#F5A623',marginBottom:16}}>Trusted by tournament players and coaches</div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.02em',lineHeight:1.15,maxWidth:720,margin:'0 auto 48px'}}>Early results from the players and coaches testing Kibitzz</h2>
        <div className="stats-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22,marginBottom:22}}>
          {stats.map((s, i) => (
            <div key={i} style={{background:'#0B141A',border:'1px solid rgba(255,255,255,.08)',borderRadius:18,padding:28}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:40,color:'#7FE0DE',marginBottom:6}}>{s.value}</div>
              <div style={{fontSize:15,color:'#AEBCC4'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
