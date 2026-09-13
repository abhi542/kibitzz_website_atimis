const faqs = [
  { q: 'What can Kibitzz read?', a: 'Any standard handwritten scoresheet, plus photo uploads and PGN files. It handles messy tournament notation and validates each move so errors get caught, not carried forward.' },
  { q: 'How long does a scan take?', a: 'A typical 40-move game goes from photo to playable, engine-checked game in about 8 seconds.' },
  { q: 'Does it work offline?', a: "You can capture scoresheets offline and they'll queue up. Digitization and engine analysis run once you're back online." },
  { q: 'Is my game data private?', a: "Your games are yours. They're stored securely, synced only to your account, and never sold. Export or delete them whenever you like." },
  { q: 'Can I export to PGN?', a: 'Yes, PGN export is included on Master and Club, so your digitized games drop straight into any engine or database.' },
  { q: 'Do you support coaches and clubs?', a: 'The Club tier adds team dashboards, bulk scanning and per-student progress tracking. Reach out to us at contact@kibitzz.in and we\'ll set you up.' },
];

export default function FAQ() {
  return (
    <section id="support" style={{ scrollMarginTop: 74, background: '#fff', borderTop: '1px solid #E4E8E7' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '110px 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1B7274', marginBottom: 16 }}>Support</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 48, letterSpacing: '-.025em', lineHeight: 1.08, marginBottom: 18 }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: 19, color: '#6B7B84', lineHeight: 1.6 }}>
            Still stuck? Reach the team at{' '}
            <a href="mailto:contact@kibitzz.in" style={{ fontWeight: 600 }}>contact@kibitzz.in</a>
            {' '}&mdash; we usually reply within a day.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ background: '#F9FAFA', border: '1px solid #E4E8E7', borderRadius: 16, padding: '20px 24px' }}>
              <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 18, color: '#0E1A24' }}>
                {f.q}
                <span style={{ color: '#279D9F', fontSize: 22, fontWeight: 400 }}>+</span>
              </summary>
              <p style={{ marginTop: 14, fontSize: 16, color: '#6B7B84', lineHeight: 1.6 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
