// BLOGY ENGINE - COMPLETE NODE.JS IMPLEMENTATION
// Run: node blogy-engine.js

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// ============================================================================
// CONFIG
// ============================================================================

const client = new Anthropic();

// Use your API key from environment variable
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error(
    "ERROR: ANTHROPIC_API_KEY not set. Export it: export ANTHROPIC_API_KEY=your-key"
  );
  process.exit(1);
}

// Master stitch prompt (condensed version - use full version from MASTER_STITCH_PROMPT.md)
const MASTER_STITCH_PROMPT = `You are an expert SEO architect and blog generation engine.

Execute a complete, 5-step AI blog generation pipeline. Take raw keywords and produce 2 fully SEO-optimized, publishable blogs.

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, pure JSON only.

INPUT provided below will have: keywords[], target_market, brand_name, tone, target_audience

EXECUTION STEPS:

1. KEYWORD CLUSTERING: Group keywords by intent, identify gaps, estimate difficulty
2. SERP GAP ANALYSIS: What do competitors cover? What are they missing?
3. OUTLINE GENERATION: Create H1, meta description, H2 structure, place CTAs, map keywords
4. BLOG DRAFT: Write complete, natural 2200-word blog following outline (plain text, no markdown)
5. SEO VALIDATION: Score blog (0-100), identify issues, suggest revisions, estimate ranking potential

OUTPUT: Return ONLY JSON with this structure:
{
  "execution_timestamp": "ISO string",
  "input_summary": { keywords, target_market, brand_name, tone },
  "blogs": [
    {
      "blog_index": 1,
      "keyword": "string",
      "step1_clustering": { clusters[], primary_keyword, secondary_keywords, recommended_angles[] },
      "step2_serp_gap": { top_3_covered[], content_gaps[], recommended_sections[], featured_snippet_text },
      "step3_outline": { 
        seo_meta: { h1, meta_description, target_keyword, target_word_count },
        outline: [{ level, text, cta_type, cta_text }],
        internal_links: [{ text, anchor }]
      },
      "step4_blog_draft": { 
        blog_text: "FULL BLOG TEXT (plain text, no markdown)",
        word_count: number,
        estimated_reading_time_minutes: number
      },
      "step5_seo_validation": {
        seo_score: number,
        score_breakdown: { keyword_density, keyword_placement, readability, structure, internal_links, cta_placement, word_count },
        metrics: { actual_word_count, primary_keyword_count, primary_keyword_density, secondary_keyword_count, readability_grade },
        issues: [{ severity, issue, suggestion }],
        snippet_readiness: { featured_snippet_eligible, suggested_snippet },
        ranking_potential: { difficulty, potential_ranking_position, required_backlinks_estimate, time_to_rank_estimate_days },
        revision_suggestions: []
      }
    },
    { blog_index: 2, keyword: "...", ... same structure ... }
  ],
  "summary": { total_blogs_generated, average_seo_score, total_word_count, highest_ranking_potential, execution_notes }
}

TONE GUIDELINES:
- Use short paragraphs (2-3 sentences)
- Natural, conversational, NOT robotic
- Include 1-2 India-specific data points
- Balance professional + friendly
- Address pain points directly
- Active voice

CRITICAL RULES:
- Blog tone: Natural, not AI-like
- Keyword placement: H1 (1x), body (2-3x, ~2% density), conclusion (0-1x)
- Step 4 output: Plain text only, no markdown formatting
- Return only valid JSON`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function callClaude(prompt, userInput) {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nINPUT:\n${JSON.stringify(userInput)}\n\nExecute now. Return ONLY valid JSON.`
        }
      ]
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0];
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0];
    }
    
    const parsed = JSON.parse(jsonStr.trim());
    return parsed;
  } catch (error) {
    console.error("Claude API error:", error.message);
    throw error;
  }
}

async function generateBlogPipeline(input) {
  console.log("\n🚀 BLOGY ENGINE INITIALIZED");
  console.log(`📝 Processing keywords: ${input.keywords.join(", ")}`);
  console.log(`🎯 Target market: ${input.target_market}`);
  console.log(`🏢 Brand: ${input.brand_name}`);
  console.log("\n⏳ Executing 5-step pipeline...");
  console.log(
    "(This will take 60-120 seconds. API calls are in progress...)\n"
  );

  try {
    const result = await callClaude(MASTER_STITCH_PROMPT, input);
    return result;
  } catch (error) {
    console.error("Pipeline execution failed:", error);
    throw error;
  }
}

function saveResults(result, outputDir = "./blogy-output") {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save full JSON
  fs.writeFileSync(
    path.join(outputDir, "blogy-complete-result.json"),
    JSON.stringify(result, null, 2)
  );

  // Save individual blogs
  result.blogs.forEach((blog, index) => {
    const blogIndex = index + 1;
    const blogText = blog.step4_blog_draft.blog_text;
    const filename = `blog-${blogIndex}-${blog.keyword.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`;
    fs.writeFileSync(path.join(outputDir, filename), blogText);

    // Save SEO validation
    const seoFilename = `blog-${blogIndex}-seo-validation.json`;
    fs.writeFileSync(
      path.join(outputDir, seoFilename),
      JSON.stringify(blog.step5_seo_validation, null, 2)
    );

    // Save outline
    const outlineFilename = `blog-${blogIndex}-outline.json`;
    fs.writeFileSync(
      path.join(outputDir, outlineFilename),
      JSON.stringify(blog.step3_outline, null, 2)
    );
  });

  // Save summary
  const summary = `
# BLOGY ENGINE EXECUTION SUMMARY

Generated: ${result.execution_timestamp}
Total Blogs: ${result.summary.total_blogs_generated}
Average SEO Score: ${result.summary.average_seo_score}/100
Total Word Count: ${result.summary.total_word_count}
Best Ranking Potential: ${result.summary.highest_ranking_potential}

## Blog Details

${result.blogs
  .map(
    (blog, i) => `
### Blog ${i + 1}: "${blog.keyword}"
- Difficulty: ${blog.step5_seo_validation.ranking_potential.difficulty}/10
- SEO Score: ${blog.step5_seo_validation.seo_score}/100
- Word Count: ${blog.step4_blog_draft.word_count}
- Est. Reading Time: ${blog.step4_blog_draft.estimated_reading_time_minutes} min
- Featured Snippet Eligible: ${blog.step5_seo_validation.snippet_readiness.featured_snippet_eligible}
- Issues Found: ${blog.step5_seo_validation.issues.length}
`
  )
  .join("")}

## Output Files
- blogy-complete-result.json (full JSON)
- blog-1-*.txt (Blog 1 text)
- blog-1-seo-validation.json (Blog 1 SEO scores)
- blog-1-outline.json (Blog 1 outline)
- blog-2-*.txt (Blog 2 text)
- blog-2-seo-validation.json (Blog 2 SEO scores)
- blog-2-outline.json (Blog 2 outline)

## Next Steps
1. Review blog texts in blog-1 and blog-2 files
2. Check SEO validation scores and issues in *-seo-validation.json
3. Publish blogs to Medium, Dev.to, or other platforms
4. Track SEO performance in Google Search Console
`;

  fs.writeFileSync(path.join(outputDir, "SUMMARY.md"), summary);
  console.log(`\n✅ All files saved to ${outputDir}/`);
}

function displayResults(result) {
  console.log("\n" + "=".repeat(80));
  console.log("BLOGY ENGINE RESULTS");
  console.log("=".repeat(80));

  result.blogs.forEach((blog, index) => {
    const blogNum = index + 1;
    const seoScore = blog.step5_seo_validation.seo_score;
    const wordCount = blog.step4_blog_draft.word_count;
    const keyword = blog.keyword;
    const issues = blog.step5_seo_validation.issues.length;

    console.log(`\n📰 BLOG ${blogNum}: "${keyword}"`);
    console.log("-".repeat(80));
    console.log(`  SEO Score: ${seoScore}/100`);
    console.log(`  Word Count: ${wordCount}`);
    console.log(`  Reading Time: ${blog.step4_blog_draft.estimated_reading_time_minutes} min`);
    console.log(`  Issues Found: ${issues}`);
    console.log(`  Featured Snippet Eligible: ${blog.step5_seo_validation.snippet_readiness.featured_snippet_eligible}`);

    if (issues > 0) {
      console.log("\n  ⚠️  Issues:");
      blog.step5_seo_validation.issues.slice(0, 3).forEach((issue) => {
        console.log(`    - [${issue.severity.toUpperCase()}] ${issue.issue}`);
      });
    }

    console.log(`\n  H1: ${blog.step3_outline.seo_meta.h1}`);
    console.log(`  Meta: ${blog.step3_outline.seo_meta.meta_description}`);

    // Show first 500 chars of blog
    const preview = blog.step4_blog_draft.blog_text.substring(0, 500);
    console.log(`\n  Preview:\n  ${preview}...\n`);
  });

  console.log("=".repeat(80));
  console.log(`\n✅ EXECUTION COMPLETE`);
  console.log(`Total Blogs: ${result.summary.total_blogs_generated}`);
  console.log(`Average SEO Score: ${result.summary.average_seo_score}/100`);
  console.log(`Total Words: ${result.summary.total_word_count}`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  // Example input - customize this for your hackathon
  const input = {
    keywords: [
      "Best AI blog automation tool in India",
      "How Blogy is disrupting martech"
    ],
    target_market: "India",
    brand_name: "Blogy",
    tone: "Professional, ROI-focused, friendly",
    target_audience:
      "Founder/CMO of Indian SaaS startup, budget $100-500/month",
    search_intent: "Product review, comparison, thought leadership"
  };

  try {
    // Generate blogs
    const result = await generateBlogPipeline(input);

    // Display results
    displayResults(result);

    // Save to files
    saveResults(result);

    // Return result for further processing
    return result;
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

// Run
main();
