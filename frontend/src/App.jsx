import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { GenerateModal } from './components/GenerateModal';
import { Layout } from './components/Layout';
import { useBlogs } from './hooks/useBlogs';
import { useGenerator } from './hooks/useGenerator';
import { useStats } from './hooks/useStats';
import { DashboardPage } from './pages/DashboardPage';
import { MyBlogsPage } from './pages/MyBlogsPage';

function PlaceholderPage({ title }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <p className="muted">Planned for next phase. Core API is ready to extend here.</p>
    </section>
  );
}

export default function App() {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const { stats, loading: statsLoading, refresh: refreshStats } = useStats();
  const {
    blogs,
    total,
    loading: blogsLoading,
    refresh: refreshBlogs,
    filters,
    setFilters,
  } = useBlogs({ sortBy: 'created_at', order: 'desc' });

  const { start, isRunning, runState, error } = useGenerator({
    onComplete: () => {
      refreshStats();
      refreshBlogs();
    },
  });

  async function handleGenerate(payload) {
    setIsGenerateOpen(false);
    await start(payload);
  }

  return (
    <>
      <Layout onOpenGenerate={() => setIsGenerateOpen(true)}>
        {statsLoading && <p className="muted">Loading dashboard...</p>}
        {error && <p className="error">{error}</p>}

        <Routes>
          <Route path="/" element={<DashboardPage stats={stats} runState={runState} />} />
          <Route
            path="/blogs"
            element={
              <MyBlogsPage
                blogs={blogs}
                total={total}
                loading={blogsLoading}
                refresh={refreshBlogs}
                filters={filters}
                setFilters={setFilters}
              />
            }
          />
          <Route path="/seo-insights" element={<PlaceholderPage title="SEO Insights" />} />
          <Route path="/automation" element={<PlaceholderPage title="Automation Rules" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      <GenerateModal
        open={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onSubmit={handleGenerate}
        loading={isRunning}
      />
    </>
  );
}
