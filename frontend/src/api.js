const BASE_URL = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // sends the httpOnly cookie on every request
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
    } catch {
      // response wasn't JSON
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const apiGet = (path) => request(path, { method: 'GET' });

export const apiPost = (path, body) =>
  request(path, { method: 'POST', body: JSON.stringify(body ?? {}) });

export const apiPut = (path, body) =>
  request(path, { method: 'PUT', body: JSON.stringify(body ?? {}) });

export const apiPatch = (path, body) =>
  request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) });

export const apiDelete = (path) => request(path, { method: 'DELETE' });