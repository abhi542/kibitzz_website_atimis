import cleanImg from '../assets/clean-handwriting.jpeg';
import messyImg from '../assets/messy-handwriting.jpeg';
import stylesImg from '../assets/different-scoresheet-style.png';
import penImg from '../assets/different-pen-color.jpeg';

const sheets = [
  { label: 'Clean handwriting', img: cleanImg },
  { label: 'Messy handwriting', img: messyImg },
  { label: 'Different scoresheet styles', img: stylesImg },
  { label: 'Different pen colours', img: penImg },
];

export default function Scoresheets() {
  return (
    <section id="scoresheets" style={{scrollMarginTop:74,background:'#fff',borderTop:'1px solid #E4E8E7',borderBottom:'1px solid #E4E8E7'}}>
      <div style={{maxWidth:1320,margin:'0 auto',padding:'110px 32px'}}>
        <div style={{textAlign:'center',maxWidth:680,margin:'0 auto 52px'}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Supported scoresheets</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:48,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:18}}>Will it read your handwriting?</h2>
          <p style={{fontSize:19,color:'#6B7B84',lineHeight:1.6}}>Kibitzz is built for real tournament scoresheets, not clean samples.<br/></p>
        </div>
        <div className="scoresheet-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22}}>
          {sheets.map((s, i) => (
            <div key={i}>
              <div style={{width:'100%',aspectRatio:'3/4',borderRadius:16,overflow:'hidden',border:'1px solid #E4E8E7',marginBottom:14,background:'#F4F6F5'}}>
                <img src={s.img} alt={s.label} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
              </div>
              <div style={{textAlign:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
