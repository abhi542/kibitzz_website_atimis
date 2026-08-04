import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const h2 = {fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:32,letterSpacing:'-.02em',color:'#1B7274',marginTop:48,marginBottom:18};
  const h3 = {fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:20,color:'#0E1A24',marginTop:28,marginBottom:10};
  const p = {fontSize:16,color:'#33454F',lineHeight:1.7,marginBottom:14};
  const li = {fontSize:16,color:'#33454F',lineHeight:1.7,marginBottom:8};
  const ul = {listStylePosition:'outside',paddingLeft:24,marginBottom:16};
  const bold = {fontWeight:700,color:'#0E1A24'};

  return (
    <>
      <Navbar />
      <main style={{maxWidth:820,margin:'0 auto',padding:'60px 32px 100px'}}>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.03em',lineHeight:1.1,marginBottom:8}}>Privacy Policy</h1>
        <p style={{...p,fontSize:15,color:'#6B7B84',marginBottom:6}}><strong>Last updated:</strong> 06 July 2026</p>
        <p style={{...p,fontSize:15,color:'#6B7B84',marginBottom:32}}><strong>Effective date:</strong> 03 August 2026</p>

        <p style={p}>This Privacy Policy ("Policy") explains how <strong style={bold}>Atimis Technologies</strong>, the operator of the <strong style={bold}>Kibitzz</strong> product ("Kibitzz", "we", "us", or "our"), collects, uses, shares, retains, and protects your personal data when you use the Kibitzz mobile application and website (together, the "Service").</p>
        <p style={p}>We act as the <strong style={bold}>Data Fiduciary</strong> for personal data processed through the Service. We are committed to processing your data in accordance with India's <strong style={bold}>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong style={bold}>Information Technology Act, 2000</strong> and its rules, and other applicable data-protection laws.</p>
        <p style={p}>By creating an account or using the Service, you confirm that you have read and understood this Policy. If you do not agree with it, please do not use the Service.</p>

        <h2 style={h2}>1. Who we are and how to contact us</h2>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Service:</strong> Kibitzz</li>
          <li style={li}><strong style={bold}>Operated by:</strong> Atimis Technologies</li>
          <li style={li}><strong style={bold}>Location:</strong> Bengaluru, Karnataka, India</li>
          <li style={li}><strong style={bold}>Grievance & Privacy Contact:</strong> <a href="mailto:contact@kibitzz.in">contact@kibitzz.in</a></li>
        </ul>
        <p style={p}>You may use our Grievance & Privacy Contact for any question, request, or complaint about your personal data or this Policy. We aim to acknowledge grievances promptly and to respond within the timelines required by the DPDP Act.</p>

        <h2 style={h2}>2. A quick summary</h2>
        <p style={p}>We collect only what we need to sign you in, digitise your scoresheets, analyse your games, and run your account. In particular:</p>
        <ul style={ul}>
          <li style={li}>We use <strong style={bold}>Google Sign-In</strong>, so we never see or store your password.</li>
          <li style={li}>Scoresheet photos you upload are used <strong style={bold}>only</strong> to extract the moves, and are <strong style={bold}>deleted from our servers immediately</strong> after processing — we do not keep them or use them to train models.</li>
          <li style={li}>When we send chess data to our AI provider for OCR and coaching, we send <strong style={bold}>only the chess moves and game details — not your name, email, or profile picture</strong>.</li>
          <li style={li}>We do <strong style={bold}>not</strong> sell your personal data, and we do <strong style={bold}>not</strong> use third-party advertising or tracking cookies.</li>
        </ul>
        <p style={p}>The rest of this Policy sets out the detail.</p>

        <h2 style={h2}>3. What data we collect</h2>
        <h3 style={h3}>a) Account and identity data (via Google Sign-In)</h3>
        <p style={p}>When you sign in with Google (OAuth 2.0), we receive and store:</p>
        <ul style={ul}>
          <li style={li}>your <strong style={bold}>email address</strong> (used as your primary unique identifier),</li>
          <li style={li}>your <strong style={bold}>full name</strong> (displayed in the app), and</li>
          <li style={li}>your <strong style={bold}>profile-picture URL</strong> (displayed in the app).</li>
        </ul>
        <p style={p}>We do <strong style={bold}>not</strong> collect or store your Google password (Google handles authentication), and we do <strong style={bold}>not</strong> collect your phone number or physical address.</p>

        <h3 style={h3}>b) Chess content you provide</h3>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Scoresheet images</strong> — photographs or image files of handwritten chess scoresheets that you capture or upload for digitisation.</li>
          <li style={li}><strong style={bold}>Game metadata</strong> — the player names (White/Black), event name, date, site, round, and result that you enter, review, or edit before saving a game.</li>
          <li style={li}><strong style={bold}>Chess moves (PGN/FEN)</strong> — the sequence of moves and the corresponding board states, together with their validation status (whether each move was legal or flagged as a possible OCR error).</li>
          <li style={li}><strong style={bold}>PGN files</strong> you upload, paste, or export.</li>
        </ul>

        <h3 style={h3}>c) Data we generate from your content</h3>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Engine analysis</strong> — Stockfish evaluations such as blunder detection, accuracy metrics, and evaluation graphs.</li>
          <li style={li}><strong style={bold}>AI coaching reviews</strong> — plain-language, LLM-generated coaching summaries of your games.</li>
        </ul>

        <h3 style={h3}>d) Usage metrics and telemetry</h3>
        <p style={p}>To operate free-tier limits, prevent abuse, and manage AI/compute costs, we store:</p>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Quota counters</strong> — the number of scans, full game analyses, and coaching summaries you have used.</li>
          <li style={li}><strong style={bold}>Timestamps</strong> — your account creation date, last login/update time, and the time you accepted our Terms.</li>
        </ul>

        <h3 style={h3}>e) Technical and log data</h3>
        <p style={p}>Basic technical information necessary to deliver and secure the Service, such as device/app version information and diagnostic logs generated when you use the Service.</p>

        <h3 style={h3}>f) Subscription and payment data (if and when paid plans are offered)</h3>
        <p style={p}>Where paid features are available, purchases are processed by the <strong style={bold}>Apple App Store, Google Play, or a third-party payment processor</strong>. We may receive confirmation of your subscription status and a transaction identifier. <strong style={bold}>We do not collect or store your full card or bank details</strong> — these are handled entirely by the payment provider.</p>
        <p style={p}>We do <strong style={bold}>not</strong> intentionally collect special-category or sensitive personal data, and we ask that you not include such data in scoresheet images, metadata, or notes.</p>

        <h2 style={h2}>4. How your scoresheet images and games are processed (AI)</h2>
        <p style={p}>Because AI processing is the core of the Service, we want to be explicit about it:</p>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Scoresheet upload and OCR.</strong> When you scan or upload a scoresheet, the image is transmitted securely to our backend and to our AI provider (Groq, which hosts vision and large-language models) to extract the moves via optical character recognition (OCR).</li>
          <li style={li}><strong style={bold}>Immediate image deletion.</strong> Your uploaded image is held only for the few seconds needed to run OCR. <strong style={bold}>As soon as the text is extracted, the image file is immediately and permanently deleted from our servers.</strong> We do not store your scoresheet photos, and we do not use them to train any model.</li>
          <li style={li}><strong style={bold}>Move validation.</strong> Extracted moves are validated for legality. Uncertain or illegal moves are flagged (red-flagged) so you can review and correct them before the game is saved or analysed.</li>
          <li style={li}><strong style={bold}>Engine analysis (Stockfish).</strong> On the <strong style={bold}>mobile app</strong>, in-depth analysis generally runs <strong style={bold}>locally on your device</strong>, and only a small result payload is sent to our servers — reducing data transmission and working even with poor connectivity. On the <strong style={bold}>web app</strong>, analysis runs on our backend server.</li>
          <li style={li}><strong style={bold}>AI coaching summaries.</strong> To generate a coaching summary, we send the relevant game data to our AI provider and return the summary to you.</li>
        </ul>
        <p style={p}><strong style={bold}>Data minimisation with our AI provider.</strong> When chess data is sent to our AI provider, we send <strong style={bold}>only the chess moves and game metadata</strong>. We do <strong style={bold}>not</strong> send your personal identifiers (email, name, or profile picture) to the AI provider.</p>

        <h2 style={h2}>5. Purposes and legal bases for processing</h2>
        <p style={p}>We process your data for the purposes below, relying on the grounds permitted under the DPDP Act — your <strong style={bold}>consent</strong>, the <strong style={bold}>performance of our contract</strong> with you (our Terms), our <strong style={bold}>legitimate uses</strong>, and <strong style={bold}>compliance with law</strong>:</p>
        <ul style={ul}>
          <li style={li}>to create, authenticate, and manage your account;</li>
          <li style={li}>to digitise scoresheets, validate moves, run engine analysis, and produce coaching summaries (core Service, provided under our contract with you);</li>
          <li style={li}>to save your games and history and sync them to your account;</li>
          <li style={li}>to enforce free-tier usage limits and, where applicable, manage subscriptions;</li>
          <li style={li}>to maintain security, detect and prevent fraud, abuse, and misuse, and to debug and improve the Service;</li>
          <li style={li}>to respond to your enquiries and provide customer support; and</li>
          <li style={li}>to comply with legal obligations and to establish, exercise, or defend legal claims.</li>
        </ul>
        <p style={p}>You may withdraw any consent you have given at any time (see Section 10). Withdrawing consent may limit or prevent your use of features that depend on that processing.</p>

        <h2 style={h2}>6. Children's privacy</h2>
        <p style={p}>Kibitzz is used by chess players of many ages, including children, and we take children's data seriously.</p>
        <ul style={ul}>
          <li style={li}>Under the DPDP Act, a <strong style={bold}>"child" is anyone under 18 years of age</strong>.</li>
          <li style={li}>We process a child's personal data only with the <strong style={bold}>verifiable consent of a parent or lawful guardian</strong>. A child should use Kibitzz, or have their games uploaded, only under the supervision and with the consent of a parent, guardian, or a coach acting with parental authorisation.</li>
          <li style={li}>We do <strong style={bold}>not</strong> carry out tracking or behavioural monitoring of children, and we do <strong style={bold}>not</strong> serve targeted or behavioural advertising to children.</li>
          <li style={li}>Where a coach or parent uploads a child's games, that adult confirms that they have the authority and consent to do so.</li>
          <li style={li}>A parent or guardian may review, correct, or request deletion of a child's data, or withdraw consent, by contacting our Grievance & Privacy Contact.</li>
        </ul>
        <p style={p}>If you believe a child's data has been collected without appropriate consent, contact us and we will take prompt steps to verify and, where required, delete it.</p>

        <h2 style={h2}>7. Who we share data with</h2>
        <p style={p}>We do <strong style={bold}>not</strong> sell your personal data. We share it only with the service providers ("Data Processors") that help us run the Service, and only to the extent needed. Each is engaged under terms requiring them to protect your data and process it only on our behalf.</p>
        <div style={{overflowX:'auto',marginBottom:20}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:15,minWidth:540}}>
            <thead>
              <tr style={{background:'#0E1A24',color:'#fff'}}>
                <th style={{padding:'14px 16px',textAlign:'left',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>Provider</th>
                <th style={{padding:'14px 16px',textAlign:'left',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>Purpose</th>
                <th style={{padding:'14px 16px',textAlign:'left',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>Data involved</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom:'1px solid #E4E8E7'}}>
                <td style={{padding:'12px 16px',fontWeight:600}}>Google (Sign-In / OAuth 2.0)</td>
                <td style={{padding:'12px 16px'}}>Authentication</td>
                <td style={{padding:'12px 16px'}}>Name, email, profile-picture URL, Google account identifier</td>
              </tr>
              <tr style={{borderBottom:'1px solid #E4E8E7',background:'#F9FAFA'}}>
                <td style={{padding:'12px 16px',fontWeight:600}}>AI / LLM & vision models</td>
                <td style={{padding:'12px 16px'}}>OCR of scoresheets and AI coaching summaries</td>
                <td style={{padding:'12px 16px'}}>Scoresheet image (transiently, for OCR), chess moves, and game metadata — <strong>no personal identifiers</strong></td>
              </tr>
              <tr style={{borderBottom:'1px solid #E4E8E7'}}>
                <td style={{padding:'12px 16px',fontWeight:600}}>MongoDB Atlas</td>
                <td style={{padding:'12px 16px'}}>Database / cloud storage</td>
                <td style={{padding:'12px 16px'}}>Account data, saved games, cached analysis and reviews, usage metrics</td>
              </tr>
              <tr style={{borderBottom:'1px solid #E4E8E7',background:'#F9FAFA'}}>
                <td style={{padding:'12px 16px',fontWeight:600}}>Hosting provider</td>
                <td style={{padding:'12px 16px'}}>Application hosting</td>
                <td style={{padding:'12px 16px'}}>Service data processed in transit and at rest on our backend</td>
              </tr>
              <tr>
                <td style={{padding:'12px 16px',fontWeight:600}}>Apple App Store / Google Play</td>
                <td style={{padding:'12px 16px'}}>Subscription billing (if paid plans are offered)</td>
                <td style={{padding:'12px 16px'}}>Subscription status, transaction identifier</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={p}>We may also disclose personal data: (a) to comply with applicable law, a court order, or a lawful request from a public authority; (b) to protect the rights, safety, and security of our users, the public, or Kibitzz, and to investigate abuse or fraud; and (c) in connection with a merger, acquisition, restructuring, or sale of assets, subject to this Policy.</p>

        <h2 style={h2}>8. International data transfers</h2>
        <p style={p}>Some of our providers (for example, our AI provider and certain infrastructure) may process data on servers located <strong style={bold}>outside India</strong>. Where we transfer personal data abroad, we do so in accordance with the DPDP Act and any restrictions notified by the Central Government under it, and we take reasonable steps to ensure your data remains protected. By using the Service, you acknowledge such transfers for the purposes described in this Policy.</p>

        <h2 style={h2}>9. Data retention</h2>
        <ul style={ul}>
          <li style={li}>We retain your <strong style={bold}>account data</strong> and <strong style={bold}>saved games, analysis, and reviews</strong> for as long as your account is active, so you can revisit and re-analyse them.</li>
          <li style={li}><strong style={bold}>Scoresheet images are not retained</strong> — as described in Section 4, they are deleted immediately after OCR processing.</li>
          <li style={li}><strong style={bold}>Usage metrics and timestamps</strong> are retained as needed to operate free-tier limits, secure the Service, and improve it.</li>
          <li style={li}>When you <strong style={bold}>delete your account</strong>, we delete or irreversibly anonymise your personal data within a reasonable period, except where we are required or permitted by law to retain certain data (for example, for accounting, tax, or dispute-resolution purposes). We may keep aggregated or anonymised data that can no longer identify you.</li>
        </ul>

        <h2 style={h2}>10. Your rights</h2>
        <p style={p}>Subject to the DPDP Act, you have the right to:</p>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Access</strong> — obtain a summary of the personal data we process about you and how we process it;</li>
          <li style={li}><strong style={bold}>Correction and completion</strong> — have inaccurate or incomplete data corrected, completed, or updated;</li>
          <li style={li}><strong style={bold}>Erasure</strong> — request deletion of your personal data where it is no longer needed for the purpose it was collected;</li>
          <li style={li}><strong style={bold}>Withdraw consent</strong> — withdraw any consent you previously gave, as easily as you gave it;</li>
          <li style={li}><strong style={bold}>Nominate</strong> — nominate another individual to exercise your rights in the event of your death or incapacity; and</li>
          <li style={li}><strong style={bold}>Grievance redressal</strong> — raise a complaint using our Grievance & Privacy Contact and, if unresolved, escalate to the <strong style={bold}>Data Protection Board of India</strong>.</li>
        </ul>
        <p style={p}>To exercise any right, contact us using our Grievance & Privacy Contact (Section 1). We will verify your identity and respond within the timelines required by law. To help you exercise your erasure right directly, the Service provides (or will provide) an in-app account-deletion option and/or the contact route above.</p>

        <h2 style={h2}>11. How we protect your data</h2>
        <p style={p}>We use reasonable security safeguards appropriate to the sensitivity of the data, including:</p>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Encryption in transit</strong> — all data exchanged between the app or website and our servers is encrypted using standard <strong style={bold}>HTTPS/TLS</strong>;</li>
          <li style={li}><strong style={bold}>Authentication</strong> — sign-in is handled via Google OAuth 2.0, and the web app stores your session token (JWT) in the browser's localStorage;</li>
          <li style={li}><strong style={bold}>On-device processing</strong> — on the mobile app, in-depth engine analysis runs locally on your device, reducing the data transmitted to us; and</li>
          <li style={li}><strong style={bold}>Access controls</strong> — internal access to personal data is limited to what is necessary to operate the Service.</li>
        </ul>
        <p style={p}>No method of transmission or storage is completely secure, so we cannot guarantee absolute security. In the event of a personal-data breach, we will notify affected users and the Data Protection Board of India as required by law.</p>

        <h2 style={h2}>12. Cookies and similar technologies</h2>
        <p style={p}>The website uses essential storage — principally the browser's localStorage — to keep you signed in by holding your authentication token, and to remember basic preferences. <strong style={bold}>We do not use third-party advertising or tracking cookies.</strong> You can control browser storage and cookies through your browser settings, but disabling essential storage may break parts of the Service.</p>

        <h2 style={h2}>13. Third-party links and services</h2>
        <p style={p}>The Service may reference or link to third-party sites or services (for example, Chess.com or Lichess). We are not responsible for the privacy practices of those third parties, and we are not affiliated with them. Please review their policies separately.</p>

        <h2 style={h2}>14. Changes to this Policy</h2>
        <p style={p}>We may update this Policy from time to time to reflect changes in our practices, technology, or the law. We will post the updated version with a new "Last updated" date and, for changes that materially affect how we process your data, provide a prominent notice in the app or by email. Continued use of the Service after the changes take effect means you accept the updated Policy.</p>

        <h2 style={h2}>15. Contact</h2>
        <p style={p}>For any question, request, or complaint about this Policy or your personal data:</p>
        <p style={p}><strong style={bold}>Atimis Technologies</strong> (operator of Kibitzz)<br/>Grievance & Privacy Contact: <a href="mailto:contact@kibitzz.in">contact@kibitzz.in</a><br/>Location: Bengaluru, Karnataka, India</p>
        <p style={p}>You may also lodge a complaint with the <strong style={bold}>Data Protection Board of India</strong> if your grievance is not resolved to your satisfaction.</p>
      </main>
      <Footer />
    </>
  );
}
