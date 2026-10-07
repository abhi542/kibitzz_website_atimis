import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { articles, formatDate, readingMinutes } from '../content/blog';

const heading = "'Plus Jakarta Sans',sans-serif";

export default function Blog() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />
      <main style={{maxWidth:780,margin:'0 auto',padding:'64px 32px 110px'}}>
        <div style={{fontFamily:heading,fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Blog</div>
        <h1 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(34px,5vw,52px)',letterSpacing:'-.03em',lineHeight:1.08,marginBottom:18}}>
          Chess scoresheets, PGN and game analysis
        </h1>
        <p style={{fontSize:20,color:'#6B7B84',lineHeight:1.6,marginBottom:48}}>
          Practical articles on turning handwritten scoresheets into digital games and learning from every game you play.
        </p>

        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {articles.map((a) => (
            <li key={a.slug} style={{borderTop:'1px solid #E4E8E7'}}>
              <Link to={'/blog/' + a.slug} className="blog-row" style={{display:'block',padding:'30px 0',textDecoration:'none',color:'inherit'}}>
                <div style={{fontSize:14,color:'#6B7B84',marginBottom:10}}>
                  <time dateTime={a.published}>{formatDate(a.published)}</time>
                  {' · '}{readingMinutes(a)} min read
                </div>
                <h2 className="blog-row-title" style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(22px,3vw,28px)',letterSpacing:'-.02em',lineHeight:1.2,color:'#0E1A24',marginBottom:10}}>{a.title}</h2>
                <p style={{fontSize:17,color:'#6B7B84',lineHeight:1.6,marginBottom:12}}>{a.blurb}</p>
                <span style={{fontFamily:heading,fontWeight:700,fontSize:15,color:'#1B7274'}}>Read the article &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>

        <div style={{marginTop:56,background:'#0E1A24',color:'#fff',borderRadius:24,padding:'36px 32px',display:'flex',flexWrap:'wrap',gap:20,alignItems:'center',justifyContent:'space-between'}}>
          <div style={{maxWidth:520}}>
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
