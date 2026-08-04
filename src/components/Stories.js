import { useState } from 'react';

const Step = ({ num, text }) => (
  <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
    <span style={{flexShrink:0,width:30,height:30,borderRadius:'50%',background:'#E2F1F1',color:'#1B7274',fontWeight:700,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>{num}</span>
    <p style={{fontSize:16,color:'#33454F',lineHeight:1.55}}>{text}</p>
  </div>
);

const Sidebar = ({ children }) => (
  <div style={{background:'#0E1A24',color:'#fff',borderRadius:20,padding:32,position:'sticky',top:100}}>
    <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:19,lineHeight:1.45}}>{children}</p>
  </div>
);

const tournamentSteps = [
  'You finish a tournament.',
  'You have a handwritten scoresheet.',
  'It usually stays in your bag or gets forgotten.',
  'Open Kibitzz and scan the scoresheet.',
  'Kibitzz digitizes the game and validates every move.',
  'Stockfish analyzes the game and AI explains the critical moments.',
  'Review the insights on your own or discuss them with your coach.',
  'Walk into your next tournament knowing exactly what to improve.',
];

const practiceSteps = [
  'You play practice games with friends, training partners, or at your local chess club.',
  'You record the moves on a scoresheet, just like in a tournament.',
  'Scan the game into Kibitzz in seconds.',
  'Your game is reconstructed move by move and analyzed with Stockfish.',
  'AI highlights recurring mistakes, missed tactics, and key turning points.',
  'Every practice game is saved in your personal library alongside tournament games.',
  'Track recurring patterns, monitor your accuracy, and measure your improvement over time.',
];

const coachSteps = [
  'Students finish weekend tournaments and submit their scoresheets.',
  'Instead of manually entering every move, coaches upload the scoresheets to Kibitzz.',
  'Kibitzz digitizes and validates each game automatically.',
  'Stockfish analyzes every game while AI generates easy-to-understand summaries for each student.',
  'Student games are organized in one place for easy review across tournaments and training.',
  'Coaches gain a clearer picture of recurring strengths and weaknesses across individuals and groups.',
];

const tabs = [
  { key: 'tournament', label: 'Tournament player' },
  { key: 'practice', label: 'Practice player' },
  { key: 'coach', label: 'Coaches & academies' },
];

export default function Stories() {
  const [story, setStory] = useState('tournament');

  return (
    <section id="stories" style={{scrollMarginTop:74,padding:'110px 32px',maxWidth:1320,margin:'0 auto'}}>
      <div style={{textAlign:'center',maxWidth:680,margin:'0 auto 44px'}}>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:48,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:18}}>Every scoresheet has a story</h2>
        <p style={{fontSize:19,color:'#6B7B84'}}>Pick the one that sounds like you.</p>
      </div>

      <div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',marginBottom:40}}>
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${story === t.key ? 'active' : 'inactive'}`} onClick={() => setStory(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {story === 'tournament' && (
        <div className="stories-grid" style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:24,padding:48,display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:48,alignItems:'start'}}>
          <div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,marginBottom:22}}>From tournament to improvement</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {tournamentSteps.map((s, i) => <Step key={i} num={i + 1} text={s} />)}
            </div>
          </div>
          <Sidebar>
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&ldquo;</span>
            Every tournament becomes an<br/>opportunity to learn instead of another<br/>forgotten scoresheet
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&rdquo;</span>
          </Sidebar>
        </div>
      )}

      {story === 'practice' && (
        <div className="stories-grid" style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:24,padding:48,display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:48,alignItems:'start'}}>
          <div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,marginBottom:22}}>From practice games to consistent progress</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {practiceSteps.map((s, i) => <Step key={i} num={i + 1} text={s} />)}
            </div>
          </div>
          <Sidebar>
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&ldquo;</span>
            Improvement doesn't only happen<br/>after tournaments, it happens after<br/>every game you choose to learn from
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&rdquo;</span>
            </Sidebar>
        </div>
      )}

      {story === 'coach' && (
        <div className="stories-grid" style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:24,padding:48,display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:48,alignItems:'start'}}>
          <div>
            <div style={{display:'inline-block',background:'#FFF8EC',border:'1px solid #F5D9A0',color:'#C77F12',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:12,letterSpacing:'.08em',textTransform:'uppercase',padding:'6px 14px',borderRadius:999,marginBottom:18}}>Coming soon</div>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:26,marginBottom:22}}>From manual review to smarter coaching</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:26}}>
              {coachSteps.map((s, i) => <Step key={i} num={i + 1} text={s} />)}
            </div>
          </div>
          <Sidebar>
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&ldquo;</span>
            Spend less time entering moves<br/>and more time discussing strategy and improvement
            <span style={{fontSize:36,fontFamily:'Georgia,serif',lineHeight:0,verticalAlign:-6}}>&rdquo;</span>
            </Sidebar>
        </div>
      )}
    </section>
  );
}
