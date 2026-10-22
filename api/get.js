// Smart link for the QR code: https://kibitzz.in/get (rewritten here by vercel.json).
// Android goes straight to the Play Store; everyone else (iOS, desktop) lands on
// the "notify me" email waitlist page.

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.chesslens.chess_scan';
const NOTIFY_PATH = '/coming-soon';

function sanitizeSource(value) {
  const clean = String(value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return clean || 'qr';
}

module.exports = function handler(req, res) {
  const userAgent = String(req.headers['user-agent'] || '');
  // ?src=flyer lets different printed QR codes be told apart; defaults to "qr".
  const source = sanitizeSource(req.query && req.query.src);

  let location;
  if (/android/i.test(userAgent)) {
    // Play Store passes `referrer` to the Install Referrer API for attribution.
    const referrer = encodeURIComponent('utm_source=' + source + '&utm_medium=qr');
    location = PLAY_STORE_URL + '&referrer=' + referrer;
  } else {
    location = NOTIFY_PATH;
  }

  // The answer depends on the device, so no shared cache may store it.
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'User-Agent');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.end();
};
