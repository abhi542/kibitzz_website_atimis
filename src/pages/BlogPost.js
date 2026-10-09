import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getArticle, formatDate, readingMinutes } from '../content/blog';

const heading = "'Plus Jakarta Sans',sans-serif";
const p = {fontSize:18,color:'#33454F',lineHeight:1.75,marginBottom:18};
const li = {fontSize:18,color:'#33454F',lineHeight:1.7,marginBottom:10};
const list = {listStylePosition:'outside',paddingLeft:26,marginBottom:20};

// [[word]] -> teal, bold, brand-font highlight. Everything else stays plain text.
const highlight = {fontFamily:heading,fontWeight:800,color:'#1B7274'};
function Inline({ text }) {
  return text.split(/\[\[(.+?)\]\]/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={highlight}>{part}</strong> : part
  );
}

function Block({ item }) {
  if (typeof item === 'string') return <p style={p}><Inline text={item} /></p>;
  if (Array.isArray(item)) {
    return <ul style={list}>{item.map((t, i) => <li key={i} style={li}><Inline text={t} /></li>)}</ul>;
  }
  if (item.ol) {
    return <ol style={list}>{item.ol.map((t, i) => <li key={i} style={li}><Inline text={t} /></li>)}</ol>;
  }
  if (item.code) {
    return (
      <pre style={{background:'#0E1A24',color:'#DDE7EB',borderRadius:14,padding:'20px 22px',overflowX:'auto',fontSize:15,lineHeight:1.65,marginBottom:22}}>
        <code>{item.code}</code>
      </pre>
    );
  }
  return null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const article = getArticle(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!article) {
    return (
      <>
        <Navbar />
        <main style={{maxWidth:720,margin:'0 auto',padding:'96px 32px 140px',textAlign:'center'}}>
          <meta name="robots" content="noindex" />
          <h1 style={{fontFamily:heading,fontWeight:800,fontSize:40,marginBottom:16}}>Article not found</h1>
          <p style={p}>We could not find that article. <Link to="/blog" style={{color:'#1B7274',fontWeight:600}}>Browse the blog</Link>.</p>
        </main>
        <Footer />
      </>
    );
  }

  const related = article.related.map(getArticle).filter(Boolean);

  return (
    <>
      <Navbar />
      <main style={{maxWidth:780,margin:'0 auto',padding:'48px 32px 110px'}}>
        <nav aria-label="Breadcrumb" style={{fontSize:15,color:'#6B7B84',marginBottom:26}}>
          <Link to="/" style={{color:'#6B7B84'}}>Home</Link>{' / '}
          <Link to="/blog" style={{color:'#6B7B84'}}>Blog</Link>{' / '}
          <span>{article.title}</span>
        </nav>

        <article>
          <h1 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(32px,5vw,48px)',letterSpacing:'-.03em',lineHeight:1.1,marginBottom:14}}>{article.title}</h1>
          <p style={{fontSize:15,color:'#6B7B84',marginBottom:28}}>
            By the Kibitzz team &middot; <time dateTime={article.published}>{formatDate(article.published)}</time>
            {article.updated && article.updated !== article.published && (
              <> &middot; Updated <time dateTime={article.updated}>{formatDate(article.updated)}</time></>
            )}
            {' \u00b7 '}{readingMinutes(article)} min read
          </p>

          <div style={{background:'#E8F5F5',border:'1px solid #C9E4E4',borderRadius:16,padding:'20px 24px',marginBottom:36}}>
            <div style={{fontFamily:heading,fontWeight:700,fontSize:13,letterSpacing:'.14em',textTransform:'uppercase',color:'#1B7274',marginBottom:8}}>The short answer</div>
            <p style={{...p,marginBottom:0,color:'#0E1A24'}}>{article.answer}</p>
          </div>

          {article.sections.map((s) => (
            <section key={s.h}>
              <h2 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(24px,3.4vw,30px)',letterSpacing:'-.02em',lineHeight:1.2,color:'#1B7274',marginTop:44,marginBottom:16}}>{s.h}</h2>
              {s.body.map((item, i) => <Block key={i} item={item} />)}
            </section>
          ))}
        </article>

        {/* CTA box (Demo + Google Play buttons) hidden until the /demo page is ready. Restore by removing this comment wrapper.
        <div style={{marginTop:56,background:'#0E1A24',color:'#fff',borderRadius:24,padding:'34px 30px'}}>
          <div style={{fontFamily:heading,fontWeight:800,fontSize:24,letterSpacing:'-.02em',marginBottom:8}}>Scan a scoresheet with Kibitzz</div>
          <p style={{fontSize:17,color:'#AEBCC4',lineHeight:1.6,marginBottom:22}}>Photograph a handwritten chess scoresheet and get a playable, engine-checked game with a plain-English summary of the critical moments.</p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <Link to="/demo" style={{background:'#fff',color:'#0E1A24',fontFamily:heading,fontWeight:700,fontSize:16,padding:'13px 24px',borderRadius:12,textDecoration:'none'}}>See the demo</Link>
            <a href="https://play.google.com/store/apps/details?id=com.chesslens.chess_scan&hl=en" target="_blank" rel="noopener noreferrer" style={{border:'1px solid rgba(255,255,255,.3)',color:'#fff',fontFamily:heading,fontWeight:700,fontSize:16,padding:'13px 24px',borderRadius:12,textDecoration:'none'}}>Get it on Google Play</a>
          </div>
        </div>
        */}

        <h2 style={{fontFamily:heading,fontWeight:800,fontSize:26,letterSpacing:'-.02em',marginTop:56,marginBottom:20}}>Keep reading</h2>
        <ul style={{listStyle:'none',padding:0,display:'grid',gap:14}}>
          {related.map((r) => (
            <li key={r.slug}>
              <Link to={'/blog/' + r.slug} style={{display:'block',background:'#fff',border:'1px solid #E4E8E7',borderRadius:16,padding:'18px 22px',textDecoration:'none'}}>
                <div style={{fontFamily:heading,fontWeight:700,fontSize:19,color:'#0E1A24',marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:15,color:'#6B7B84',lineHeight:1.5}}>{formatDate(r.published)} &middot; {r.blurb}</div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
