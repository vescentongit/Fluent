// src/services/api.js
let tokenStorage = { access_token: null };

const BASE_URL = 'https://rare-ants-add.loca.lt'; // ← localtunnel URL

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
  const res = await fetch(`${BASE_URL}/api/resilience`, {
    headers: await getHeaders()
  });
  return res.json();
};

// ── DIGITAL TWIN ──────────────────────────────────────────

export const getDigitalTwin = async () => {
  const res = await fetch(`${BASE_URL}/api/digital-twin`, {
    headers: await getHeaders()
  });
  return res.json();
};

// ── NUDGES ────────────────────────────────────────────────

export const getNudges = async () => {
  const res = await fetch(`${BASE_URL}/api/nudge/check`, {
    headers: await getHeaders()
  });
  return res.json();
};

// ── CHATBOT STREAMING ─────────────────────────────────────

export const streamChat = async (message, language = 'en', onChunk, onDone) => {
  const headers = await getHeaders();

  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, language })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.startsWith('data:'));

    for (const line of lines) {
      try {
        const data = JSON.parse(line.replace('data: ', ''));
        if (data.done) { onDone(fullText); return; }
        if (data.text) {
          fullText += data.text;
          onChunk(fullText);
        }
      } catch (e) {}
    }
  }
  onDone(fullText);
};