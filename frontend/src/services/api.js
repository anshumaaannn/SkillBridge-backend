const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data?.message
      ? data.message
      : typeof data === 'string' && data
      ? data
      : `HTTP error ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
    login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  },
  profile: {
    getMine: () => request('/users/me/profile'),
    updateMine: (payload) => request('/users/me/profile', { method: 'PUT', body: payload }),
    getByUserId: (userId) => request(`/users/${userId}/profile`),
  },
  skills: {
    getAll: () => request('/skills'),
    getMine: () => request('/users/me/skills'),
    add: (skillId) => request('/users/me/skills', { method: 'POST', body: { skillId } }),
    remove: (skillId) => request(`/users/me/skills/${skillId}`, { method: 'DELETE' }),
  },
  projects: {
    getAll: () => request('/projects'),
    getMine: () => request('/projects/my'),
    getById: (id) => request(`/projects/${id}`),
    create: (payload) => request('/projects', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: payload }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    apply: (projectId, payload) => request(`/projects/${projectId}/apply`, { method: 'POST', body: payload }),
    getApplications: (projectId) => request(`/projects/${projectId}/applications`),
  },
  applications: {
    getMine: () => request('/applications/me'),
    updateStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PATCH', body: { status } }),
  },
};
