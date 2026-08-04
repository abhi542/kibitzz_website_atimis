// import { useState } from 'react';

// const CheckGreen = () => <span style={{color:'#3FA05A',fontWeight:700}}>&#10003;</span>;
// const CheckTeal = () => <span style={{color:'#16B3A6',fontWeight:700}}>&#10003;</span>;

// export default function Pricing() {
//   const [annual, setAnnual] = useState(true);

//   return (
//     <section id="pricing" style={{scrollMarginTop:74,padding:'110px 32px',maxWidth:1320,margin:'0 auto'}}>
//       <div style={{textAlign:'center',maxWidth:680,margin:'0 auto 44px'}}>
//         <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'.16em',textTransform:'uppercase',color:'#1B7274',marginBottom:16}}>Pricing</div>
//         <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:48,letterSpacing:'-.025em',lineHeight:1.08,marginBottom:18}}>Start free. Upgrade when you're hooked.</h2>
//         <p style={{fontSize:19,color:'#6B7B84',lineHeight:1.6}}>Scan and digitize on us. Pay only when you want the coaching, the history and the deep analysis.</p>
//       </div>

//       <div style={{display:'flex',justifyContent:'center',marginBottom:48}}>
//         <div style={{display:'inline-flex',alignItems:'center',gap:4,background:'#fff',border:'1px solid #E4E8E7',borderRadius:999,padding:5,boxShadow:'0 4px 14px rgba(14,26,36,.05)'}}>
//           <button className={`seg-btn ${!annual ? 'active' : 'inactive'}`} onClick={() => setAnnual(false)}>Monthly</button>
//           <button className={`seg-btn ${annual ? 'active' : 'inactive'}`} onClick={() => setAnnual(true)}>
//             Annual <span style={{color:'#F5A623',fontSize:13}}>&middot; save 2 months</span>
//           </button>
//         </div>
//       </div>

//       <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,alignItems:'stretch'}}>
//         {/* Free */}
//         <div style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:22,padding:'32px 28px',display:'flex',flexDirection:'column'}}>
//           <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,marginBottom:5}}>Free</div>
//           <div style={{fontSize:14,color:'#9AA7AD',marginBottom:20}}>For the curious</div>
//           <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:22}}>
//             <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.02em'}}>$0</span>
//             <span style={{color:'#9AA7AD',fontSize:15}}>forever</span>
//           </div>
//           <a href="#get" className="cta-outline" style={{textAlign:'center',border:'1.5px solid #0E1A24',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:14,borderRadius:12,marginBottom:24,display:'block'}}>Get started</a>
//           <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:13,fontSize:15,color:'#33454F'}}>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Scan &amp; digitize scoresheets</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />3 game reviews / month</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Board replay</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Basic accuracy score</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Import PGN games</li>
//           </ul>
//         </div>

//         {/* Pro */}
//         <div className="pro-card" style={{background:'#0E1A24',color:'#fff',borderRadius:22,padding:'32px 28px',display:'flex',flexDirection:'column',position:'relative',boxShadow:'0 20px 44px rgba(14,26,36,.28)',transform:'translateY(-8px)'}}>
//           <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#F5A623',color:'#3A2A05',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:12,letterSpacing:'.08em',padding:'6px 14px',borderRadius:999}}>MOST POPULAR</div>
//           <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,marginBottom:5,color:'#7FE0DE'}}>Pro</div>
//           <div style={{fontSize:14,color:'#8A99A1',marginBottom:20}}>For the regular player</div>
//           <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:5}}>
//             <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.02em'}}>{annual ? '$59' : '$7.99'}</span>
//             <span style={{color:'#8A99A1',fontSize:15}}>{annual ? '/year' : '/month'}</span>
//           </div>
//           <div style={{fontSize:13,color:'#5E6E76',marginBottom:20}}>
//             {annual ? '≈ $4.92/mo · billed yearly · 7-day free trial' : 'billed monthly · 7-day free trial'}
//           </div>
//           <a href="#get" className="cta-teal" style={{textAlign:'center',background:'#279D9F',color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:14,borderRadius:12,marginBottom:24,display:'block'}}>Start free trial</a>
//           <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:13,fontSize:15,color:'#DCE4E7'}}>
//             <li style={{display:'flex',gap:10}}><CheckTeal />Everything in Free</li>
//             <li style={{display:'flex',gap:10}}><CheckTeal /><b style={{color:'#fff',fontWeight:600}}>Unlimited</b>&nbsp;game reviews</li>
//             <li style={{display:'flex',gap:10}}><CheckTeal />Plain-English coach's read</li>
//             <li style={{display:'flex',gap:10}}><CheckTeal />Full move-quality breakdown</li>
//             <li style={{display:'flex',gap:10}}><CheckTeal />Cloud game library &amp; sync</li>
//           </ul>
//         </div>

//         {/* Master */}
//         <div style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:22,padding:'32px 28px',display:'flex',flexDirection:'column'}}>
//           <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,marginBottom:5}}>Master</div>
//           <div style={{fontSize:14,color:'#9AA7AD',marginBottom:20}}>For the improver</div>
//           <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:5}}>
//             <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.02em'}}>{annual ? '$119' : '$14.99'}</span>
//             <span style={{color:'#9AA7AD',fontSize:15}}>{annual ? '/year' : '/month'}</span>
//           </div>
//           <div style={{fontSize:13,color:'#9AA7AD',marginBottom:20}}>
//             {annual ? '≈ $9.92/mo · billed yearly' : 'billed monthly'}
//           </div>
//           <a href="#get" className="cta-outline" style={{textAlign:'center',border:'1.5px solid #0E1A24',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:14,borderRadius:12,marginBottom:24,display:'block'}}>Go Master</a>
//           <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:13,fontSize:15,color:'#33454F'}}>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Everything in Pro</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Deep engine lines &amp; variations</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Opening &amp; endgame trainers</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />PGN export</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Priority scanning</li>
//           </ul>
//         </div>

//         {/* Club */}
//         <div style={{background:'#fff',border:'1px solid #E4E8E7',borderRadius:22,padding:'32px 28px',display:'flex',flexDirection:'column'}}>
//           <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,marginBottom:5}}>Club</div>
//           <div style={{fontSize:14,color:'#9AA7AD',marginBottom:20}}>For coaches &amp; clubs</div>
//           <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:5}}>
//             <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.02em'}}>Custom</span>
//           </div>
//           <div style={{fontSize:13,color:'#9AA7AD',marginBottom:20}}>billed per seat</div>
//           <a href="#support" className="cta-outline" style={{textAlign:'center',border:'1.5px solid #0E1A24',color:'#0E1A24',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,padding:14,borderRadius:12,marginBottom:24,display:'block'}}>Talk to us</a>
//           <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:13,fontSize:15,color:'#33454F'}}>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Everything in Master</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Team &amp; student dashboards</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Bulk scoresheet scanning</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Student progress tracking</li>
//             <li style={{display:'flex',gap:10}}><CheckGreen />Priority support</li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }
