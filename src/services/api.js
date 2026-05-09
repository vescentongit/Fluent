// src/services/api.js
let tokenStorage = { access_token: null };

const BASE_URL = 'https://open-sites-open.loca.lt'; // ← localtunnel URL

const getHeaders = async (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  };
  if (includeAuth && tokenStorage.access_token) {
    headers['Authorization'] = `Bearer ${tokenStorage.access_token}`;
  }
  return headers;
};

// ── AUTH ──────────────────────────────────────────────────

export const signup = async (userData) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: await getHeaders(false),
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'bypass-tunnel-reminder': 'true',
    },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  });
  const data = await res.json();
  if (data.access_token) {
    tokenStorage.access_token = data.access_token; // ← simpan di memory
  }
  return data;
};

export const logout = async () => {
  tokenStorage.access_token = null;
};

// ── RESILIENCE SCORE ──────────────────────────────────────

export const getResilienceScore = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/resilience`, {
      headers: await getHeaders()
    });
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// ── DIGITAL TWIN ──────────────────────────────────────────

export const getDigitalTwin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/digital-twin`, {
      headers: await getHeaders()
    });
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// ── NUDGES ────────────────────────────────────────────────

export const getNudges = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/nudge/check`, {
      headers: await getHeaders()
    });
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// ── CHATBOT STREAMING ─────────────────────────────────────

export const streamChat = async (message, language = 'en', onChunk, onDone) => {
  const headers = await getHeaders();

  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, language })
  });

  const text = await response.text();
  const lines = text.split('\n').filter(l => l.startsWith('data:'));
  let fullText = '';

  for (const line of lines) {
    try {
      const data = JSON.parse(line.replace('data: ', ''));
      if (data.text) fullText += data.text;
    } catch (e) { }
  }

  onChunk(fullText);
  onDone(fullText);
};

// ── USER PROFILE UPDATE ─────────────────────────────────────
export const updateUserProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/user/update`, {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};