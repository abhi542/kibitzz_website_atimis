import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const h2 = {fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:32,letterSpacing:'-.02em',color:'#1B7274',marginTop:48,marginBottom:18};
  const p = {fontSize:16,color:'#33454F',lineHeight:1.7,marginBottom:14};
  const li = {fontSize:16,color:'#33454F',lineHeight:1.7,marginBottom:8};
  const ul = {listStylePosition:'outside',paddingLeft:24,marginBottom:16};
  const bold = {fontWeight:700,color:'#0E1A24'};

  return (
    <>
      <Navbar />
      <main style={{maxWidth:820,margin:'0 auto',padding:'60px 32px 100px'}}>
        <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:44,letterSpacing:'-.03em',lineHeight:1.1,marginBottom:8}}>Terms of Service</h1>
        <p style={{...p,fontSize:15,color:'#6B7B84',marginBottom:6}}><strong>Last updated:</strong> 06 July 2026</p>
        <p style={{...p,fontSize:15,color:'#6B7B84',marginBottom:32}}><strong>Effective date:</strong> 03 August 2026</p>

        <p style={p}>These Terms of Service ("Terms") are a binding agreement between you and <strong style={bold}>Atimis Technologies</strong>, the operator of the <strong style={bold}>Kibitzz</strong> product ("Kibitzz", "we", "us", "our"), governing your use of the Kibitzz mobile application and website (together, the "Service"). Please read them together with our Privacy Policy, which is incorporated into these Terms by reference.</p>
        <p style={p}><strong style={bold}>By creating an account or using the Service, you agree to these Terms.</strong> If you do not agree, do not use the Service. We record the time at which you accept these Terms.</p>

        <h2 style={h2}>1. The Service</h2>
        <p style={p}>Kibitzz is a chess scoresheet digitisation and game-review tool. It lets you photograph or upload a handwritten scoresheet, converts it into a digital game using optical character recognition (OCR), validates the moves, runs chess-engine (Stockfish) analysis, and produces plain-language coaching summaries using artificial intelligence. Kibitzz complements — and is not affiliated with — services such as Chess.com or Lichess.</p>
        <p style={p}>We may add, change, or remove features at any time (see Section 15).</p>

        <h2 style={h2}>2. Eligibility and children</h2>
        <ul style={ul}>
          <li style={li}>You must be able to form a binding contract under applicable law to use the Service.</li>
          <li style={li}>Under Indian law, a <strong style={bold}>child is anyone under 18 years of age</strong>. A child may use the Service <strong style={bold}>only with the verifiable consent of, and under the supervision of, a parent or lawful guardian</strong>, or a coach acting with parental authorisation.</li>
          <li style={li}>If you are a parent, guardian, or coach who creates an account for, or uploads the games of, a child, you confirm that you are <strong style={bold}>authorised</strong> to do so and that you consent, on the child's behalf, to the processing of that child's data as described in our Privacy Policy.</li>
          <li style={li}>You are responsible for all activity under your account, including activity by any child you supervise.</li>
        </ul>

        <h2 style={h2}>3. Accounts</h2>
        <ul style={ul}>
          <li style={li}>You sign in using <strong style={bold}>Google (OAuth 2.0)</strong>. We do not receive or store your Google password.</li>
          <li style={li}>You are responsible for keeping access to your Google account and your Kibitzz account secure, and for all activity under your account.</li>
          <li style={li}>You agree to provide accurate information and to keep it current.</li>
          <li style={li}>Notify us promptly of any unauthorised use of your account.</li>
          <li style={li}>We may suspend or terminate accounts that violate these Terms (see Section 12).</li>
        </ul>

        <h2 style={h2}>4. License to use the Service</h2>
        <p style={p}>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to use the Service for your personal, non-commercial chess-improvement purposes — or, for coaches and academies, to digitise and review the games of your own students. All rights not expressly granted are reserved.</p>

        <h2 style={h2}>5. Your content</h2>
        <ul style={ul}>
          <li style={li}><strong style={bold}>"Your Content"</strong> means the scoresheet images, PGN files, chess moves, player names, game metadata, and any notes you upload, capture, or create through the Service.</li>
          <li style={li}><strong style={bold}>You retain ownership of Your Content.</strong></li>
          <li style={li}>You grant us a worldwide, royalty-free, non-exclusive license to host, store, process, transmit, and display Your Content <strong style={bold}>solely to operate and provide the Service to you</strong> — including sending scoresheet images and moves to our OCR and AI providers, and running engine analysis, as described in the Privacy Policy (Sections 4 and 7).</li>
          <li style={li}>We may use Your Content only in <strong style={bold}>aggregated or anonymised form</strong> to operate, secure, and improve the Service. We do <strong style={bold}>not</strong> sell Your Content, and we do <strong style={bold}>not</strong> reuse identifiable Your Content for marketing without your consent.</li>
          <li style={li}>You represent and warrant that you have the right to upload Your Content and that it does not infringe any third party's rights or violate any law.</li>
          <li style={li}><strong style={bold}>Back-ups.</strong> You are responsible for keeping your own copies of important games. We are not liable for the loss of a saved game (for example, if it is accidentally deleted).</li>
        </ul>

        <h2 style={h2}>6. Accuracy of OCR and AI — please read</h2>
        <ul style={ul}>
          <li style={li}>The Service relies on OCR and AI, which are <strong style={bold}>not perfect</strong>. Digitised moves, engine evaluations, and coaching summaries may contain <strong style={bold}>errors, omissions, or inaccuracies</strong>.</li>
          <li style={li}>Kibitzz flags low-confidence or illegal moves for your review, but <strong style={bold}>you are responsible for checking and correcting the digitised game</strong> before saving or relying on it.</li>
          <li style={li}>AI-generated coaching and analysis are provided on a <strong style={bold}>best-effort basis, for educational and informational purposes only</strong>. They are not professional, authoritative, or guaranteed, and are <strong style={bold}>not</strong> a substitute for a qualified human coach.</li>
          <li style={li}>We make <strong style={bold}>no warranty</strong> that OCR extraction or AI output will be accurate, complete, or useful, or that using the Service will improve your rating or results. You should not rely on the Service's outputs for any serious, critical, or real-world decision.</li>
        </ul>

        <h2 style={h2}>7. Acceptable use and content moderation</h2>
        <p style={p}>You agree to use the camera and upload features <strong style={bold}>strictly to scan chess scoresheets</strong>. You agree <strong style={bold}>not</strong> to:</p>
        <ul style={ul}>
          <li style={li}>upload photographs or files that are not chess scoresheets, or that are unlawful, infringing, obscene, hateful, harassing, or otherwise inappropriate;</li>
          <li style={li}>upload content you do not have the right to upload, or that infringes any intellectual-property or privacy right;</li>
          <li style={li}>reverse-engineer, decompile, scrape, or attempt to extract source code, models, or data from the Service, except to the extent this restriction is prohibited by law;</li>
          <li style={li}>interfere with, overload, or disrupt the Service, or <strong style={bold}>circumvent usage limits, rate limits, quotas, or security measures</strong>;</li>
          <li style={li}>use the Service to build a competing product or service, or resell or commercially exploit it without our written permission;</li>
          <li style={li}>use automated means to access the Service except as we expressly permit; or</li>
          <li style={li}>upload malware, or attempt to gain unauthorised access to any account, server, system, or data.</li>
        </ul>
        <p style={p}>We may review, remove, or restrict access to any content, and issue warnings, suspend, or terminate accounts, where we reasonably consider it necessary to enforce these Terms or protect the Service or its users.</p>

        <h2 style={h2}>8. Subscriptions, billing, and the free tier</h2>
        <p style={p}><strong style={bold}>Free tier.</strong> Kibitzz is offered on a freemium basis. The free tier is subject to <strong style={bold}>daily usage limits</strong> (for example, a number of scans, analyses, or coaching reviews per day). We may change these limits at any time at our discretion.</p>
        <p style={p}><strong style={bold}>Subscriptions.</strong> Some features may require, or will require, a paid subscription that unlocks additional features or higher limits. Where paid plans are offered:</p>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Billing.</strong> Subscriptions are sold and billed through the <strong style={bold}>Apple App Store, Google Play, or a third-party payment processor</strong>, subject to that provider's terms. We do not store your payment-card details.</li>
          <li style={li}><strong style={bold}>Auto-renewal.</strong> Subscriptions <strong style={bold}>automatically renew</strong> at the end of each billing period at the then-current price unless cancelled in accordance with the store's rules (generally at least 24 hours before the period ends).</li>
          <li style={li}><strong style={bold}>Managing and cancelling.</strong> Manage or cancel your subscription through your Apple App Store or Google Play account settings. Deleting the app does not, by itself, cancel a subscription.</li>
          <li style={li}><strong style={bold}>Price changes.</strong> We may change subscription prices; changes apply to future billing periods, with notice as required by the applicable store and law.</li>
          <li style={li}><strong style={bold}>Refunds.</strong> Refunds are handled by the store through which you purchased (Apple or Google) under their respective refund policies, except where non-waivable law requires otherwise. Except as required by law, fees are non-refundable.</li>
        </ul>

        <h2 style={h2}>9. Intellectual property</h2>
        <p style={p}>The Service — including its software, design, logos, the "Kibitzz" name, and all content we create (excluding Your Content) — is owned by us or our licensors and is protected by applicable law. These Terms do not grant you any rights in our trademarks or branding. Third-party components (for example, the <strong style={bold}>Stockfish</strong> engine and the AI models we use) remain subject to their respective licenses.</p>

        <h2 style={h2}>10. Disclaimer of warranties</h2>
        <p style={p}>To the maximum extent permitted by law, the Service is provided <strong style={bold}>"as is" and "as available", without warranties of any kind</strong>, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, secure, or that OCR, engine analysis, or AI output will be accurate or complete.</p>

        <h2 style={h2}>11. Limitation of liability</h2>
        <p style={p}>To the maximum extent permitted by law:</p>
        <ul style={ul}>
          <li style={li}>we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of data, goodwill, profits, or anticipated benefits, arising from or relating to your use of (or inability to use) the Service; and</li>
          <li style={li}>our <strong style={bold}>total aggregate liability</strong> for all claims relating to the Service will not exceed the <strong style={bold}>greater of (a) the amount you paid us in the 12 months before the event giving rise to the claim, or (b) INR 1,000</strong>.</li>
        </ul>
        <p style={p}>Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable Indian law.</p>

        <h2 style={h2}>12. Suspension and termination</h2>
        <ul style={ul}>
          <li style={li}>You may stop using the Service and delete your account at any time.</li>
          <li style={li}>We may suspend or terminate your access if you breach these Terms, misuse the Service or harm other users, create legal risk or exposure for us, abuse API or usage limits, attempt to compromise the backend, upload prohibited content, or where we are required to do so by law — with notice where reasonably practicable.</li>
          <li style={li}>On termination, your license to use the Service ends. Provisions that by their nature should survive — including the content license for already-processed data, disclaimers, limitation of liability, indemnity, intellectual-property, and governing-law clauses — survive termination.</li>
        </ul>

        <h2 style={h2}>13. Indemnity</h2>
        <p style={p}>You agree to indemnify and hold harmless Kibitzz and its operators, officers, and agents from and against any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from Your Content, your use of the Service, or your breach of these Terms or of any applicable law or third-party right.</p>

        <h2 style={h2}>14. Third-party services</h2>
        <p style={p}>The Service depends on third parties — including Google (Sign-In), our AI provider, our hosting and database providers, and the app stores. Your use of those services may be subject to their own terms, and we are not responsible for them. We are not affiliated with Chess.com or Lichess.</p>

        <h2 style={h2}>15. Changes to the Service and these Terms</h2>
        <p style={p}>We may modify, suspend, or discontinue the Service or any of its features at any time. We may also update these Terms from time to time; where changes are material, we will provide notice in the app or by other reasonable means. <strong style={bold}>Continued use of the Service after the changes take effect constitutes acceptance of the updated Terms.</strong> If you do not agree to the updated Terms, you must stop using the Service.</p>

        <h2 style={h2}>16. Governing law and dispute resolution</h2>
        <ul style={ul}>
          <li style={li}>These Terms are governed by the <strong style={bold}>laws of India</strong>.</li>
          <li style={li}>Subject to any mandatory consumer-protection rights available to you, the <strong style={bold}>courts at Bengaluru, Karnataka, India</strong> will have exclusive jurisdiction over any dispute arising out of or relating to these Terms or the Service.</li>
        </ul>

        <h2 style={h2}>17. Grievance redressal and contact</h2>
        <p style={p}>For questions, notices, or complaints — including under the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020 — contact:</p>
        <p style={p}><strong style={bold}>Atimis Technologies</strong> (operator of Kibitzz)<br/>Grievance & Privacy Contact: <a href="mailto:contact@kibitzz.in">contact@kibitzz.in</a><br/>Location: Bengaluru, Karnataka, India</p>
        <p style={p}>We aim to acknowledge complaints within 48 hours and to resolve them within the timelines required by applicable law.</p>

        <h2 style={h2}>18. Miscellaneous</h2>
        <ul style={ul}>
          <li style={li}><strong style={bold}>Entire agreement.</strong> These Terms and the Privacy Policy are the entire agreement between you and us regarding the Service and supersede any prior agreements.</li>
          <li style={li}><strong style={bold}>Severability.</strong> If any provision is found unenforceable, the remaining provisions remain in full effect.</li>
          <li style={li}><strong style={bold}>No waiver.</strong> Our failure to enforce any provision is not a waiver of it.</li>
          <li style={li}><strong style={bold}>Assignment.</strong> You may not assign these Terms; we may assign them in connection with a merger, acquisition, restructuring, or sale of assets.</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
