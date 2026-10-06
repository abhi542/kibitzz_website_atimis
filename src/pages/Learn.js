import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { articles } from '../content/learn';

const heading = "'Plus Jakarta Sans',sans-serif";

export default function Learn() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />
      <main style={{maxWidth:980,margin:'0 auto',padding:'64px 32px 110px'}}>
        <div style={{fontFamily:heading,fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Learn</div>
        <h1 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(34px,5vw,52px)',letterSpacing:'-.03em',lineHeight:1.08,marginBottom:18}}>
          Chess scoresheets, PGN and game analysis
        </h1>
        <p style={{fontSize:20,color:'#6B7B84',lineHeight:1.6,maxWidth:720,marginBottom:48}}>
          Practical guides on turning handwritten scoresheets into digital games and learning from every game you play.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
          {articles.map((a) => (
            <Link key={a.slug} to={'/learn/' + a.slug} className="learn-card" style={{display:'block',background:'#fff',border:'1px solid #E4E8E7',borderRadius:20,padding:'28px 26px',textDecoration:'none',color:'inherit',boxShadow:'0 6px 22px rgba(14,26,36,.05)'}}>
              <h2 style={{fontFamily:heading,fontWeight:800,fontSize:22,letterSpacing:'-.02em',lineHeight:1.2,color:'#0E1A24',marginBottom:12}}>{a.title}</h2>
              <p style={{fontSize:16,color:'#6B7B84',lineHeight:1.6,marginBottom:16}}>{a.blurb}</p>
              <span style={{fontFamily:heading,fontWeight:700,fontSize:15,color:'#1B7274'}}>Read the guide &rarr;</span>
            </Link>
          ))}
        </div>

        <div style={{marginTop:64,background:'#0E1A24',color:'#fff',borderRadius:24,padding:'36px 32px',display:'flex',flexWrap:'wrap',gap:20,alignItems:'center',justifyContent:'space-between'}}>
          <div style={{maxWidth:560}}>
            <div style={{fontFamily:heading,fontWeight:800,fontSize:24,letterSpacing:'-.02em',marginBottom:8}}>See it on a real game</div>
            <div style={{fontSize:17,color:'#AEBCC4',lineHeight:1.6}}>Watch how Kibitzz turns a handwritten scoresheet into an engine-checked game.</div>
          </div>
          <Link to="/demo" style={{background:'#fff',color:'#0E1A24',fontFamily:heading,fontWeight:700,fontSize:16,padding:'14px 26px',borderRadius:12,textDecoration:'none'}}>View the demo</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
