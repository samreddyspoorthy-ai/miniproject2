const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function parseResponse(response) {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const payload = await response.json();
      message = payload.detail || payload.message || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function analyzeWaste(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  return parseResponse(response);
}

export async function fetchOrganizations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.material) params.set('material', filters.material);

  const query = params.toString();
  const response = await fetch(`${API_BASE}/api/organizations${query ? `?${query}` : ''}`);
  return parseResponse(response);
}

export async function askWasteAssistant(message, contextCategory) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context_category: contextCategory || null,
    }),
  });

  return parseResponse(response);
}

export async function schedulePickup(payload) {
  const response = await fetch(`${API_BASE}/api/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function fetchPlatformOverview() {
  const response = await fetch(`${API_BASE}/api/platform-overview`);
  return parseResponse(response);
}

export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  return `${API_BASE}${path}`;
}
