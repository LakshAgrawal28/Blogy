function buildMockBlog(keyword, index, brandName) {
  const now = new Date().toISOString();
  const h1 = `${keyword} - A Practical Guide for Fast-Growing Teams`;
  const body = [
    h1,
    '',
    `If you are trying to scale content without scaling cost, ${brandName} gives you a structured way to do it.`,
    'This draft is a fallback mock blog generated when ANTHROPIC_API_KEY is not available.',
    '',
    'Why this matters:',
    '- predictable pipeline',
    '- measurable SEO score',
    '- faster publishing workflow',
    '',
    'Conclusion:',
    `Start with one keyword cluster, validate scores, and iterate weekly.`,
  ].join('\n');

  return {
    blog_index: index,
    keyword,
    step1_clustering: {
      clusters: [
        {
          cluster_name: 'Core Intent',
          keywords: [keyword],
          search_intent: 'informational',
          difficulty: 5,
          monthly_searches_estimate: 5000,
          content_angle: 'Practical implementation',
        },
      ],
      primary_keyword: keyword,
      secondary_keywords: [`${keyword} tips`, `${keyword} guide`],
      recommended_angles: ['Comparison', 'Cost ROI', 'Execution steps'],
    },
    step2_serp_gap: {
      top_3_covered: ['overview', 'features', 'pricing'],
      content_gaps: ['local market context', 'cost model examples'],
      recommended_sections: ['Implementation workflow', 'Score improvement checklist'],
      unique_angles: ['India-first GTM lens'],
      featured_snippet_text: `${keyword} helps teams publish SEO-ready blogs quickly with measurable scoring.`,
      target_word_count: 1800,
    },
    step3_outline: {
      seo_meta: {
        h1,
        meta_description: `A practical ${keyword} guide with process, scoring, and publishing workflow.`,
        target_keyword: keyword,
        target_word_count: 1800,
      },
      outline: [
        { level: 'H1', text: h1, cta_type: 'none', cta_text: '' },
        { level: 'H2', text: 'What most teams miss', cta_type: 'none', cta_text: '' },
        { level: 'H2', text: 'A repeatable pipeline', cta_type: 'soft', cta_text: 'Try a pilot run this week' },
        { level: 'conclusion', text: 'Next steps', cta_type: 'hard', cta_text: 'Generate your first pipeline run' },
      ],
      internal_links: [
        { text: 'Pricing', anchor: 'pricing' },
        { text: 'SEO guide', anchor: 'seo-guide' },
        { text: 'Templates', anchor: 'templates' },
      ],
      keyword_placement_strategy: {
        h1: '1x in H1',
        h2: '1-2x across H2s',
        body: 'Natural mentions in examples',
      },
    },
    step4_blog_draft: {
      blog_text: body,
      word_count: 180,
      estimated_reading_time_minutes: 2,
    },
    step5_seo_validation: {
      seo_score: 76 + index,
      score_breakdown: {
        keyword_density: 80,
        keyword_placement: 78,
        readability: 82,
        structure: 79,
        internal_links: 72,
        cta_placement: 81,
        word_count: 60,
      },
      metrics: {
        actual_word_count: 180,
        primary_keyword_count: 3,
        primary_keyword_density: 1.7,
        secondary_keyword_count: 2,
        readability_grade: 7,
        sentences_per_paragraph: 2.5,
        average_word_length: 4.8,
      },
      issues: [
        {
          severity: 'low',
          issue: 'Short draft used in fallback mode',
          suggestion: 'Run with ANTHROPIC_API_KEY to generate full-length output',
        },
      ],
      snippet_readiness: {
        featured_snippet_eligible: true,
        suggested_snippet: `${keyword} can be deployed as a 5-step pipeline with measurable output quality.`,
        snippet_length_chars: 96,
      },
      ranking_potential: {
        difficulty: 5,
        potential_ranking_position: '6-12',
        required_backlinks_estimate: 3,
        time_to_rank_estimate_days: 45,
      },
      revision_suggestions: ['Expand sections with case examples', 'Increase word count to 1800+'],
    },
    generated_at: now,
  };
}

export function buildMockResult(input) {
  const keywords = Array.isArray(input.keywords) && input.keywords.length > 0
    ? input.keywords.slice(0, 2)
    : ['AI blog automation', 'SEO pipeline strategy'];

  const blogs = keywords.map((keyword, idx) => buildMockBlog(keyword, idx + 1, input.brand_name || 'Blogy'));
  const totalWordCount = blogs.reduce((sum, blog) => sum + blog.step4_blog_draft.word_count, 0);
  const averageSeo = Math.round(blogs.reduce((sum, blog) => sum + blog.step5_seo_validation.seo_score, 0) / blogs.length);

  return {
    execution_timestamp: new Date().toISOString(),
    input_summary: {
      keywords,
      target_market: input.target_market || 'India',
      brand_name: input.brand_name || 'Blogy',
      tone: input.tone || 'Professional and friendly',
    },
    blogs,
    summary: {
      total_blogs_generated: blogs.length,
      average_seo_score: averageSeo,
      total_word_count: totalWordCount,
      highest_ranking_potential: `blog_index: ${blogs[0]?.blog_index ?? 1}`,
      execution_notes: 'Fallback mock mode used.',
    },
  };
}
