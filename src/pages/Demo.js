import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import motionGraphic from '../assets/kibitzz-motion-graphic.mp4';
import heroPoster from '../assets/hero-poster.webp';
import appPreview from '../assets/app-preview.webp';
import cleanImg from '../assets/clean-handwriting.jpeg';
import messyImg from '../assets/messy-handwriting.jpeg';

const heading = "'Plus Jakarta Sans',sans-serif";

const steps = [
  {
    n: '1',
    title: 'Scan the scoresheet',
    text: 'Photograph the handwritten sheet with your phone. A flat page and even light are all you need. Scoresheets can also be captured offline and queued until your device is back online.',
  },
  {
    n: '2',
    title: 'Kibitzz rebuilds the game',
    text: 'The handwriting is read move by move and every move is validated against the rules of chess, so a smudged or ambiguous move is resolved to a legal one. For a typical 40-move game this takes about 8 seconds.',
  },
  {
    n: '3',
    title: 'Stockfish analyzes every move',
    text: 'The game is analyzed with the Stockfish engine. Critical moments are highlighted and each player gets an accuracy score.',
  },
  {
    n: '4',
    title: 'Learn what changed',
    text: 'Kibitzz explains in plain English where the game turned, what was missed and what to improve. You can step through the playable game and export it as PGN.',
  },
];

export default function Demo() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />
      <main>
        <section style={{maxWidth:1240,margin:'0 auto',padding:'64px 32px 40px',display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:56,alignItems:'center'}} className="hero-grid">
          <div>
            <div style={{fontFamily:heading,fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Demo</div>
            <h1 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(34px,5vw,54px)',letterSpacing:'-.03em',lineHeight:1.08,marginBottom:20}}>
              See Kibitzz turn a handwritten chess scoresheet into a coached game
            </h1>
            <p style={{fontSize:20,color:'#6B7B84',lineHeight:1.6,marginBottom:30,maxWidth:560}}>
              This is the whole flow: photograph the sheet, get a validated playable game, then read a plain-English explanation of the critical moments.
            </p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'inherit'}}>
              <a href="https://play.google.com/store/apps/details?id=com.chesslens.chess_scan&hl=en" target="_blank" rel="noopener noreferrer" style={{background:'#0E1A24',color:'#fff',fontFamily:heading,fontWeight:700,fontSize:16,padding:'15px 26px',borderRadius:12,textDecoration:'none'}}>Get it on Google Play</a>
              <Link to="/coming-soon" style={{border:'1px solid #C9D3D6',color:'#0E1A24',fontFamily:heading,fontWeight:700,fontSize:16,padding:'15px 26px',borderRadius:12,textDecoration:'none'}}>iOS: join the waitlist</Link>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <video src={motionGraphic} poster={heroPoster} autoPlay loop muted playsInline preload="metadata" aria-label="Kibitzz app in motion, scanning a scoresheet and showing the analysis" role="img" style={{aspectRatio:'976 / 2120',width:300,maxWidth:'100%',borderRadius:34,boxShadow:'0 30px 70px rgba(14,26,36,.28)'}} />
          </div>
        </section>

        <section style={{maxWidth:980,margin:'0 auto',padding:'56px 32px 20px'}}>
          <h2 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(28px,4vw,40px)',letterSpacing:'-.025em',lineHeight:1.12,marginBottom:12}}>How the demo flow works</h2>
          <p style={{fontSize:18,color:'#6B7B84',lineHeight:1.6,marginBottom:34}}>Four steps from pen and paper to a game you can learn from.</p>
          <ol style={{listStyle:'none',padding:0,display:'grid',gap:18}}>
            {steps.map((s) => (
              <li key={s.n} style={{display:'flex',gap:20,alignItems:'flex-start',background:'#fff',border:'1px solid #E4E8E7',borderRadius:18,padding:'22px 24px'}}>
                <span style={{flex:'none',width:44,height:44,borderRadius:'50%',background:'#279D9F',color:'#fff',fontFamily:heading,fontWeight:800,fontSize:20,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.n}</span>
                <div>
                  <h3 style={{fontFamily:heading,fontWeight:800,fontSize:21,letterSpacing:'-.01em',marginBottom:6}}>{s.title}</h3>
                  <p style={{fontSize:17,color:'#33454F',lineHeight:1.65}}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section style={{maxWidth:1100,margin:'0 auto',padding:'64px 32px 20px'}}>
          <h2 style={{fontFamily:heading,fontWeight:800,fontSize:'clamp(28px,4vw,40px)',letterSpacing:'-.025em',lineHeight:1.12,marginBottom:12}}>From real scoresheets to the app</h2>
          <p style={{fontSize:18,color:'#6B7B84',lineHeight:1.6,marginBottom:34,maxWidth:720}}>Kibitzz reads clean handwriting and messy tournament notation alike. Here are two sheets it can start from, and the app home screen where your digitized games appear.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:22,alignItems:'start'}}>
            <figure style={{margin:0}}>
              <img src={cleanImg} alt="A chess scoresheet with clean handwriting" width="800" height="797" loading="lazy" decoding="async" style={{width:'100%',height:'auto',borderRadius:18,border:'1px solid #E4E8E7',display:'block'}} />
              <figcaption style={{fontSize:15,color:'#6B7B84',marginTop:10}}>Clean handwriting</figcaption>
            </figure>
            <figure style={{margin:0}}>
              <img src={messyImg} alt="A chess scoresheet with messy handwriting" width="800" height="1095" loading="lazy" decoding="async" style={{width:'100%',height:'auto',borderRadius:18,border:'1px solid #E4E8E7',display:'block'}} />
              <figcaption style={{fontSize:15,color:'#6B7B84',marginTop:10}}>Messy handwriting</figcaption>
            </figure>
            <figure style={{margin:0}}>
              <img src={appPreview} alt="Kibitzz app home screen with weekly games, average accuracy and a Scan new game button" width="640" height="1390" loading="lazy" decoding="async" style={{width:'100%',maxWidth:300,height:'auto',borderRadius:26,boxShadow:'0 20px 50px rgba(14,26,36,.22)',display:'block'}} />
              <figcaption style={{fontSize:15,color:'#6B7B84',marginTop:10}}>The Kibitzz app</figcaption>
            </figure>
          </div>
        </section>

        <section style={{maxWidth:980,margin:'0 auto',padding:'64px 32px 110px'}}>
          <div style={{background:'#0E1A24',color:'#fff',borderRadius:24,padding:'38px 32px'}}>
            <h2 style={{fontFamily:heading,fontWeight:800,fontSize:28,letterSpacing:'-.02em',marginBottom:10}}>Want to know how it works under the hood?</h2>
            <p style={{fontSize:18,color:'#AEBCC4',lineHeight:1.6,marginBottom:22}}>Read our articles on chess scoresheet OCR, converting scoresheets to PGN, and analyzing your games.</p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <Link to="/blog/what-is-chess-ocr" style={{background:'#fff',color:'#0E1A24',fontFamily:heading,fontWeight:700,fontSize:16,padding:'13px 24px',borderRadius:12,textDecoration:'none'}}>What is chess OCR?</Link>
              <Link to="/blog" style={{border:'1px solid rgba(255,255,255,.3)',color:'#fff',fontFamily:heading,fontWeight:700,fontSize:16,padding:'13px 24px',borderRadius:12,textDecoration:'none'}}>Browse the blog</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
