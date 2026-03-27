import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/blogs', label: 'My Blogs' },
  { to: '/seo-insights', label: 'SEO Insights' },
  { to: '/automation', label: 'Automation Rules' },
  { to: '/settings', label: 'Settings' },
];

export function Layout({ children, onOpenGenerate }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h1>Blogy</h1>
          <p>Editorial Automator</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="plan-card">
            <small>Pro Plan Active</small>
            <button type="button">Upgrade Plan</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <input className="search" placeholder="Search editorial pipeline..." />
          <button type="button" className="primary-btn" onClick={onOpenGenerate}>
            Generate New Blog
          </button>
        </header>

        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}
