import { useMemo } from 'react';

export function DashboardPage({ stats, runState }) {
  const cards = useMemo(
    () => [
      { label: 'Total Blogs Generated', value: stats?.total_blogs_generated ?? 0 },
      { label: 'Average SEO Score', value: stats?.avg_seo_score ?? 0 },
      { label: 'Published Blogs', value: stats?.total_blogs_published ?? 0 },
      { label: 'Active Runs', value: stats?.active_runs ?? 0 },
    ],
    [stats],
  );

  return (
    <div className="page-grid">
      <section className="hero">
        <p className="eyebrow">Performance Dashboard</p>
        <h2>Editorial Command Center</h2>
        <p className="muted">Live view of blog generation runs, SEO quality, and publishing velocity.</p>
      </section>

      <section className="kpi-grid">
        {cards.map((card) => (
          <article key={card.label} className="kpi-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Active Pipeline</h3>
          <small>Real-time run tracker</small>
        </div>

        {!runState ? (
          <p className="muted">Start a generation run to see live progress.</p>
        ) : (
          <div className="progress-wrap">
            <div className="progress-meta">
              <strong>{runState.status}</strong>
              <span>{runState.stepName || 'queued'}</span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${runState.progress || 0}%` }} />
            </div>
            <small>{runState.progress || 0}% complete</small>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Top Performing Editorial Assets</h3>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>SEO Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.top_blogs ?? []).map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.seo_score}</td>
                  <td>{blog.status}</td>
                </tr>
              ))}
              {(!stats?.top_blogs || stats.top_blogs.length === 0) && (
                <tr>
                  <td colSpan={3} className="muted">
                    No data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
