import { useState } from 'react';

const defaultForm = {
  keywords: 'Best AI blog automation tool in India\nHow Blogy is disrupting martech',
  target_market: 'India',
  brand_name: 'Blogy',
  tone: 'Professional, ROI-focused, friendly',
  target_audience: 'Founder/CMO of Indian SaaS startup',
  search_intent: 'Product review, comparison, thought leadership',
};

export function GenerateModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm);

  if (!open) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      keywords: form.keywords
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h3>Generate New Blog Run</h3>

        <label>
          Keywords (one per line)
          <textarea name="keywords" value={form.keywords} onChange={handleChange} rows={4} required />
        </label>

        <div className="grid-two">
          <label>
            Target Market
            <input name="target_market" value={form.target_market} onChange={handleChange} required />
          </label>
          <label>
            Brand
            <input name="brand_name" value={form.brand_name} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Tone
          <input name="tone" value={form.tone} onChange={handleChange} required />
        </label>

        <label>
          Target Audience
          <input name="target_audience" value={form.target_audience} onChange={handleChange} required />
        </label>

        <label>
          Search Intent
          <input name="search_intent" value={form.search_intent} onChange={handleChange} required />
        </label>

        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Generating...' : 'Run Pipeline'}
          </button>
        </div>
      </form>
    </div>
  );
}
