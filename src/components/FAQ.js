const faqs = [
  { q: 'What can Kibitzz read?', a: 'Any standard handwritten scoresheet, plus photo uploads and PGN files. It handles messy tournament notation and validates each move so errors get caught, not carried forward.' },
  { q: 'How long does a scan take?', a: 'A typical 40-move game goes from photo to playable, engine-checked game in about eight seconds. Longer games take a little more.' },
  { q: 'Does it work offline?', a: "You can capture scoresheets offline and they'll queue up. Digitization and engine analysis run once you're back online." },
  { q: 'Is my game data private?', a: "Your games are yours. They're stored securely, synced only to your account, and never sold. Export or delete them whenever you like." },
  { q: 'Can I export to PGN?', a: 'Yes, PGN export is included on Master and Club, so your digitized games drop straight into any engine or database.' },
  { q: 'Do you support coaches and clubs?', a: 'The Club tier adds team dashboards, bulk scanning and per-student progress tracking. Reach out to us at contact.kibitzz.ai@gmail.com and we\'ll set you up.' },
];

export default function FAQ() {
  return (
    <section id="support" style={{scrollMarginTop:74,background:'#fff',borderTop:'1px solid #E4E8E7'}}>
      <div style={{maxWidth:900,margin:'0 auto',padding:'96px 24px'}}>
        <div style={{textAlign:'center',maxWidth:640,margin:'0 auto 48px'}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:14}}>Support</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:42,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:16}}>Frequently Asked Questions</h2>
          <p style={{fontSize:17,color:'#6B7B84'}}>
            Still stuck? Reach the team at{' '}
            <a href="mailto:contact.kibitzz.ai@gmail.com" style={{fontWeight:600}}>contact.kibitzz.ai@gmail.com</a>
            {' '}&mdash; we usually reply within a day.
          </p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {faqs.map((f, i) => (
            <details key={i} style={{background:'#F9FAFA',border:'1px solid #E4E8E7',borderRadius:14,padding:'18px 20px'}}>
              <summary style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:'#0E1A24'}}>
                {f.q}
                <span style={{color:'#279D9F',fontSize:20,fontWeight:400}}>+</span>
              </summary>
              <p style={{marginTop:12,fontSize:15,color:'#6B7B84'}}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
