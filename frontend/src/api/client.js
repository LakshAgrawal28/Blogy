const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getStats: () => request('/api/stats'),
  getBlogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/blogs${query ? `?${query}` : ''}`);
  },
  createBlogRun: (payload) => request('/api/blogs', { method: 'POST', body: JSON.stringify(payload) }),
  getRunStatus: (jobId) => request(`/api/status/${jobId}`),
  getBlog: (blogId) => request(`/api/blogs/${blogId}`),
  updateBlog: (blogId, patch) =>
    request(`/api/blogs/${blogId}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  publishBlog: (blogId, platform) =>
    request(`/api/publish/${blogId}`, { method: 'POST', body: JSON.stringify({ platform }) }),
};
