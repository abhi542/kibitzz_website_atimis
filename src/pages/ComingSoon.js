import { useState } from 'react';
import { Link } from 'react-router-dom';
import kibitzLogo from '../assets/kibitzz_logo-removebg.png';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setSuccessMsg(data.message || "You're on the list");
      } else {
        setErrorMsg(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setErrorMsg('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',background:'#1a3a3a'}}>
      <style>{`
        .cs-checks {
          position: absolute; inset: 0;
          background-color: #1f4040;
          background-image:
            linear-gradient(45deg, rgba(0,0,0,.12) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.12) 75%),
            linear-gradient(45deg, rgba(0,0,0,.12) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.12) 75%);
          background-size: 80px 80px;
          background-position: 0 0, 40px 40px;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: .6; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes glow-ring {
          0%, 100% { opacity: .3; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: .6; transform: translate(-50%,-50%) scale(1.05); }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .cs-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 300;
          font-size: 38px;
          letter-spacing: .35em;
          text-transform: uppercase;
          color: rgba(255,255,255,.85);
          animation: fade-in .8s ease-out .2s both;
        }
        .cs-notify-input {
          background: transparent;
          border: 1px solid rgba(127,224,222,.3);
          padding: 15px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #fff;
          outline: none;
          width: 280px;
          letter-spacing: .04em;
          transition: border-color .3s;
        }
        .cs-notify-input::placeholder { color: rgba(255,255,255,.35); letter-spacing: .04em; }
        .cs-notify-input:focus { border-color: #7FE0DE; }
        .cs-submit-btn {
          background: transparent;
          border: 1px solid rgba(127,224,222,.5);
          padding: 15px 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #7FE0DE;
          cursor: pointer;
          transition: all .3s;
          white-space: nowrap;
        }
        .cs-submit-btn:hover:not(:disabled) { background: rgba(127,224,222,.1); border-color: #7FE0DE; }
        .cs-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .back-link {
          color: rgba(127,224,222,.4);
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: .1em;
          text-transform: uppercase;
          transition: color .3s;
        }
        .back-link:hover { color: #7FE0DE; }
        @media(max-width:600px) {
          .cs-title { font-size: 22px !important; letter-spacing: .2em !important; }
          .cs-logo-img { width: 200px !important; }
          .cs-notify-input { width: 100% !important; border-radius: 8px !important; padding: 13px 16px !important; font-size: 13px !important; text-align: center !important; }
          .cs-form { flex-direction: column !important; gap: 10px !important; width: 100% !important; max-width: 280px !important; margin: 0 auto !important; }
          .cs-submit-btn { width: 100% !important; border-radius: 8px !important; padding: 13px 20px !important; font-size: 12px !important; }
          .cs-get-notified { font-size: 12px !important; letter-spacing: .15em !important; margin-bottom: 14px !important; }
          .cs-checks { background-size: 50px 50px !important; background-position: 0 0, 25px 25px !important; }
        }
      `}</style>

      <div className="cs-checks" />

      {/* Background glow behind logo */}
      <div style={{position:'absolute',top:'42%',left:'50%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle, rgba(39,157,159,.5) 0%, rgba(39,157,159,.15) 40%, transparent 70%)',transform:'translate(-50%,-50%)',animation:'glow-pulse 4s ease-in-out infinite',pointerEvents:'none'}} />
      <div style={{position:'absolute',top:'42%',left:'50%',width:360,height:360,borderRadius:'50%',border:'1px solid rgba(127,224,222,.15)',transform:'translate(-50%,-50%)',animation:'glow-ring 4s ease-in-out infinite',pointerEvents:'none'}} />
      <div style={{position:'absolute',top:'42%',left:'50%',width:440,height:440,borderRadius:'50%',border:'1px solid rgba(127,224,222,.08)',transform:'translate(-50%,-50%)',animation:'glow-ring 4s ease-in-out infinite .5s',pointerEvents:'none'}} />

      {/* Subtle ambient glow */}
      <div style={{position:'absolute',bottom:'-10%',left:'50%',width:'100%',height:200,background:'radial-gradient(ellipse at center, rgba(39,157,159,.15) 0%, transparent 70%)',transform:'translateX(-50%)',pointerEvents:'none'}} />

      {/* Content */}
      <div style={{position:'relative',textAlign:'center',padding:'40px 32px',display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>

        {/* COMING SOON title */}
        <div style={{marginBottom:48}}>
          <span className="cs-title">Coming Soon</span>
        </div>

        {/* Floating logo with glow */}
        <div style={{animation:'float-logo 5s ease-in-out infinite, fade-in .8s ease-out both',marginBottom:80}}>
          <img src={kibitzLogo} alt="Kibitzz" className="cs-logo-img" style={{width:260,maxWidth:'65vw',filter:'drop-shadow(0 0 60px rgba(39,157,159,.5)) drop-shadow(0 0 120px rgba(39,157,159,.25))'}} />
        </div>

        {/* GET NOTIFIED + form */}
        <div style={{animation:'fade-in .8s ease-out .5s both',marginBottom:40}}>
          <div className="cs-get-notified" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(127,224,222,.6)',marginBottom:20}}>
            Get Notified
          </div>

          {!submitted ? (
            <div>
              <form onSubmit={handleNotify} className="cs-form" style={{display:'flex',gap:0,justifyContent:'center'}}>
                <input
                  type="email"
                  className="cs-notify-input"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <button type="submit" className="cs-submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Email'}
                </button>
              </form>
              {errorMsg && (
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:'#FF6B6B',marginTop:12}}>
                  {errorMsg}
                </div>
              )}
            </div>
          ) : (
            <div style={{animation:'fade-in .5s ease-out both',textAlign:'center'}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:15,color:'#7FE0DE',letterSpacing:'.15em',textTransform:'uppercase'}}>
                {successMsg || "You're on the list"}
              </div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:400,fontSize:13,color:'rgba(127,224,222,.5)',letterSpacing:'.06em',marginTop:8}}>
                We'll notify you when it's live on the App Store
              </div>
            </div>
          )}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,animation:'fade-in .8s ease-out .7s both'}}>
          <Link to="/" className="back-link">Back to Home</Link>
          <span style={{color:'rgba(127,224,222,.25)'}}>·</span>
          <a href="https://play.google.com/store/apps/details?id=com.chesslens.chess_scan&hl=en" target="_blank" rel="noopener noreferrer" className="back-link">Get it on Google Play</a>
        </div>
      </div>
    </div>
  );
}
