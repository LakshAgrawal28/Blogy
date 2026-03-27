import { useState } from 'react';
import { api } from '../api/client';

export function MyBlogsPage({ blogs, total, loading, refresh, setFilters, filters }) {
  const [publishingId, setPublishingId] = useState('');

  async function handlePublish(blogId, platform) {
    try {
      setPublishingId(blogId);
      await api.publishBlog(blogId, platform);
      await refresh();
    } finally {
      setPublishingId('');
    }
  }

  return (
    <div className="page-grid">
      <section className="hero hero-inline">
        <div>
          <p className="eyebrow">Library</p>
          <h2>My Blogs</h2>
          <p className="muted">Manage generated content and publishing status.</p>
        </div>
        <div className="filters-inline">
          <select
            value={filters.status || ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select
            value={filters.order || 'desc'}
            onChange={(event) => setFilters((prev) => ({ ...prev, order: event.target.value }))}
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>All Blogs ({total})</h3>
        </div>

        {loading && <p className="muted">Loading blogs...</p>}

        {!loading && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>SEO</th>
                  <th>Status</th>
                  <th>Published URLs</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <strong>{blog.title}</strong>
                      <small className="muted">{blog.target_market}</small>
                    </td>
                    <td>{blog.seo_score}</td>
                    <td>
                      <span className={`chip ${blog.status === 'published' ? 'chip-live' : 'chip-draft'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td>
                      {Object.keys(blog.published_urls || {}).length === 0 ? (
                        <span className="muted">-</span>
                      ) : (
                        Object.entries(blog.published_urls).map(([platform, url]) => (
                          <a key={platform} href={url} target="_blank" rel="noreferrer" className="link-chip">
                            {platform}
                          </a>
                        ))
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="mini-btn"
                        disabled={publishingId === blog.id}
                        onClick={() => handlePublish(blog.id, 'devto')}
                      >
                        {publishingId === blog.id ? 'Publishing...' : 'Publish Dev.to'}
                      </button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted">
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
