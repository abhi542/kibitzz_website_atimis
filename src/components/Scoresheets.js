const sheets = ['Clean handwriting', 'Messy handwriting', 'Different scoresheet styles', 'Different pen colours'];

export default function Scoresheets() {
  return (
    <section id="scoresheets" style={{scrollMarginTop:74,background:'#fff',borderTop:'1px solid #E4E8E7',borderBottom:'1px solid #E4E8E7'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'96px 24px'}}>
        <div style={{textAlign:'center',maxWidth:640,margin:'0 auto 48px'}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:14}}>Supported scoresheets</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:16}}>Will it read your handwriting?</h2>
          <p style={{fontSize:17,color:'#6B7B84'}}>Kibitzz is built for real tournament scoresheets, not clean samples.<br/>Drop in some examples below.</p>
        </div>
        <div className="scoresheet-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
          {sheets.map((s, i) => (
            <div key={i}>
              <div style={{width:'100%',aspectRatio:'3/4',borderRadius:14,overflow:'hidden',border:'1px solid #E4E8E7',marginBottom:12,background:'#F4F6F5',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:'#9AA7AD',fontSize:14,padding:20,textAlign:'center'}}>{s} sample</span>
              </div>
              <div style={{textAlign:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
