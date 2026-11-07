// Brilliancy Board admin API client. The server and token live in the browser
// so the console can be pointed at the dev deployment or a local backend.

export const SERVERS = [
  { label: 'Dev (kibitzz-dev.onrender.com)', url: 'https://kibitzz-dev.onrender.com' },
  { label: 'Local (localhost:8000)', url: 'http://localhost:8000' },
];

const DEFAULT_SERVER = process.env.REACT_APP_BRILLIANCY_API_URL || SERVERS[0].url;
const SERVER_KEY = 'bb_admin_server';
const TOKEN_KEY = 'bb_admin_token';

function read(store, key) {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
}

function write(store, key, value) {
  try {
    if (value == null) window[store].removeItem(key);
    else window[store].setItem(key, value);
  } catch {
    // Storage blocked (private window): the session just won't survive a reload
  }
}

let server = read('localStorage', SERVER_KEY) || DEFAULT_SERVER;
let token = read('sessionStorage', TOKEN_KEY);
let onUnauthorized = () => {};

export const getServer = () => server;
export const setServer = (url) => {
  server = url.replace(/\/+$/, '');
  write('localStorage', SERVER_KEY, server);
};
export const getToken = () => token;
export const setToken = (t) => {
  token = t;
  write('sessionStorage', TOKEN_KEY, t);
};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(method, path, { body, file, auth = true } = {}) {
  const headers = {};
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (file) {
    payload = new FormData();
    payload.append('file', file);
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(server + path, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, 'NETWORK', `Can't reach ${server}. Render's free tier can take ~1 minute to wake up; try again.`);
  }

  const type = res.headers.get('content-type') || '';
  if (!res.ok) {
    const data = type.includes('json') ? await res.json().catch(() => ({})) : {};
    // Brilliancy routes use {error:{code,message}}; the older app routes use {detail}
    const err = data.error || {};
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg).join('; ') : data.detail;
    if (res.status === 401 && auth) onUnauthorized();
    throw new ApiError(res.status, err.code || `HTTP_${res.status}`, err.message || detail || res.statusText, err.details);
  }
  if (type.includes('json')) return res.json();
  return res.blob();
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body = {}) => request('POST', path, { body }),
  del: (path) => request('DELETE', path),
  upload: (path, file) => request('POST', path, { file }),
  login: (body) => request('POST', '/api/admin/auth/login', { body, auth: false }),
};

// Raw Excel files are behind auth, so they can't be plain links
export async function downloadFile(fileId, filename = 'import.xlsx') {
  const blob = await request('GET', `/api/admin/files/${fileId}`);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
