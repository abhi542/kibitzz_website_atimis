const rows = [
  { feature: 'Scan handwritten scoresheets', kibitzz: true, chess: false, lichess: false },
  { feature: 'OCR digitization',             kibitzz: true, chess: false, lichess: false },
  { feature: 'Move validation',              kibitzz: true, chess: false, lichess: false },
  { feature: 'Stockfish analysis',           kibitzz: true, chess: 'Limited', lichess: false },
  { feature: 'Human-readable insights',      kibitzz: true, chess: 'Limited', lichess: false },
];

const Check = () => <span style={{color:'#3FA05A',fontWeight:700,fontSize:18}}>&#10003;</span>;
const Cross = () => <span style={{color:'#EF0A0A',fontWeight:700,fontSize:18}}>&#10007;</span>;
const Limited = () => <span style={{color:'#ADA29A',fontSize:14}}>Limited</span>;

const Cell = ({ val, highlight }) => {
  const base = { padding:'18px 14px', textAlign:'center', fontWeight:700 };
  if (highlight) base.background = '#F0FAF9';
  return (
    <div style={base}>
      {val === true ? <Check /> : val === false ? <Cross /> : <Limited />}
    </div>
  );
};

export default function Comparison() {
  return (
    <section id="compare" style={{scrollMarginTop:74,padding:'110px 32px',maxWidth:1320,margin:'0 auto'}}>
      <div style={{textAlign:'center',maxWidth:680,margin:'0 auto 52px'}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Why Kibitzz</div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:48,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:18}}>Not another engine review tool</h2>
        <p style={{fontSize:19,color:'#6B7B84',lineHeight:1.6}}>Our competitors are built for digital games. Kibitzz starts a step earlier, at the paper scoresheet...</p>
      </div>

      <div className="compare-grid" style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 14px rgba(14,26,36,.05)'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',background:'#0E1A24',color:'#fff',minWidth:600}}>
          <div style={{padding:'18px 24px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>Feature</div>
          <div style={{padding:'18px 14px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15,textAlign:'center',color:'#7FE0DE'}}>Kibitzz</div>
          <div style={{padding:'18px 14px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,textAlign:'center',color:'#AEBCC4'}}>Chess.com</div>
          <div style={{padding:'18px 14px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,textAlign:'center',color:'#AEBCC4'}}>Lichess</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',borderTop:'1px solid #E4E8E7',minWidth:600}}>
            <div style={{padding:'18px 24px',fontSize:16,color:'#33454F'}}>{r.feature}</div>
            <Cell val={r.kibitzz} highlight />
            <Cell val={r.chess} />
            <Cell val={r.lichess} />
          </div>
        ))}
      </div>
    </section>
  );
}
