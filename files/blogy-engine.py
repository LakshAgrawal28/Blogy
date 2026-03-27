#!/usr/bin/env python3
"""
BLOGY ENGINE - COMPLETE PYTHON IMPLEMENTATION
Run: python blogy-engine.py
"""

import json
import os
import sys
from datetime import datetime
import anthropic

# ============================================================================
# CONFIG
# ============================================================================

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("ERROR: ANTHROPIC_API_KEY not set.")
    print("Set it: export ANTHROPIC_API_KEY=your-key")
    sys.exit(1)

client = anthropic.Anthropic(api_key=API_KEY)

# Master stitch prompt
MASTER_STITCH_PROMPT = """You are an expert SEO architect and blog generation engine.

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
- Return only valid JSON"""


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def call_claude(prompt: str, user_input: dict) -> dict:
    """Call Claude API with the given prompt and input."""
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}\n\nINPUT:\n{json.dumps(user_input)}\n\nExecute now. Return ONLY valid JSON."
                }
            ]
        )

        text = response.content[0].text

        # Extract JSON from response (handle markdown code blocks)
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0]
        else:
            json_str = text

        parsed = json.loads(json_str.strip())
        return parsed

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response:\n{text[:500]}")
        raise
    except Exception as e:
        print(f"Claude API error: {e}")
        raise


def generate_blog_pipeline(input_data: dict) -> dict:
    """Execute the full 5-step pipeline."""
    print("\n🚀 BLOGY ENGINE INITIALIZED")
    print(f"📝 Processing keywords: {', '.join(input_data['keywords'])}")
    print(f"🎯 Target market: {input_data['target_market']}")
    print(f"🏢 Brand: {input_data['brand_name']}")
    print("\n⏳ Executing 5-step pipeline...")
    print("(This will take 60-120 seconds. API calls are in progress...)\n")

    try:
        result = call_claude(MASTER_STITCH_PROMPT, input_data)
        return result
    except Exception as e:
        print(f"Pipeline execution failed: {e}")
        raise


def save_results(result: dict, output_dir: str = "./blogy-output"):
    """Save results to files."""
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Save full JSON
    with open(os.path.join(output_dir, "blogy-complete-result.json"), "w") as f:
        json.dump(result, f, indent=2)

    # Save individual blogs
    for index, blog in enumerate(result["blogs"]):
        blog_index = index + 1
        blog_text = blog["step4_blog_draft"]["blog_text"]
        
        # Sanitize filename
        filename = f"blog-{blog_index}-{blog['keyword'].replace(' ', '-').lower()[:40]}.txt"
        with open(os.path.join(output_dir, filename), "w") as f:
            f.write(blog_text)

        # Save SEO validation
        seo_filename = f"blog-{blog_index}-seo-validation.json"
        with open(os.path.join(output_dir, seo_filename), "w") as f:
            json.dump(blog["step5_seo_validation"], f, indent=2)

        # Save outline
        outline_filename = f"blog-{blog_index}-outline.json"
        with open(os.path.join(output_dir, outline_filename), "w") as f:
            json.dump(blog["step3_outline"], f, indent=2)

    # Save summary
    summary = f"""# BLOGY ENGINE EXECUTION SUMMARY

Generated: {result['execution_timestamp']}
Total Blogs: {result['summary']['total_blogs_generated']}
Average SEO Score: {result['summary']['average_seo_score']}/100
Total Word Count: {result['summary']['total_word_count']}
Best Ranking Potential: {result['summary']['highest_ranking_potential']}

## Blog Details
"""
    for i, blog in enumerate(result["blogs"]):
        summary += f"""
### Blog {i + 1}: "{blog['keyword']}"
- Difficulty: {blog['step5_seo_validation']['ranking_potential']['difficulty']}/10
- SEO Score: {blog['step5_seo_validation']['seo_score']}/100
- Word Count: {blog['step4_blog_draft']['word_count']}
- Est. Reading Time: {blog['step4_blog_draft']['estimated_reading_time_minutes']} min
- Featured Snippet Eligible: {blog['step5_seo_validation']['snippet_readiness']['featured_snippet_eligible']}
- Issues Found: {len(blog['step5_seo_validation']['issues'])}
"""

    summary += """
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
"""

    with open(os.path.join(output_dir, "SUMMARY.md"), "w") as f:
        f.write(summary)

    print(f"\n✅ All files saved to {output_dir}/")


def display_results(result: dict):
    """Display results in the console."""
    print("\n" + "=" * 80)
    print("BLOGY ENGINE RESULTS")
    print("=" * 80)

    for index, blog in enumerate(result["blogs"]):
        blog_num = index + 1
        seo_score = blog["step5_seo_validation"]["seo_score"]
        word_count = blog["step4_blog_draft"]["word_count"]
        keyword = blog["keyword"]
        issues = len(blog["step5_seo_validation"]["issues"])

        print(f"\n📰 BLOG {blog_num}: \"{keyword}\"")
        print("-" * 80)
        print(f"  SEO Score: {seo_score}/100")
        print(f"  Word Count: {word_count}")
        print(f"  Reading Time: {blog['step4_blog_draft']['estimated_reading_time_minutes']} min")
        print(f"  Issues Found: {issues}")
        print(f"  Featured Snippet Eligible: {blog['step5_seo_validation']['snippet_readiness']['featured_snippet_eligible']}")

        if issues > 0:
            print("\n  ⚠️  Issues:")
            for issue in blog["step5_seo_validation"]["issues"][:3]:
                print(f"    - [{issue['severity'].upper()}] {issue['issue']}")

        print(f"\n  H1: {blog['step3_outline']['seo_meta']['h1']}")
        print(f"  Meta: {blog['step3_outline']['seo_meta']['meta_description']}")

        # Show first 500 chars of blog
        preview = blog["step4_blog_draft"]["blog_text"][:500]
        print(f"\n  Preview:\n  {preview}...\n")

    print("=" * 80)
    print(f"\n✅ EXECUTION COMPLETE")
    print(f"Total Blogs: {result['summary']['total_blogs_generated']}")
    print(f"Average SEO Score: {result['summary']['average_seo_score']}/100")
    print(f"Total Words: {result['summary']['total_word_count']}")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    # Example input - customize this for your hackathon
    input_data = {
        "keywords": [
            "Best AI blog automation tool in India",
            "How Blogy is disrupting martech"
        ],
        "target_market": "India",
        "brand_name": "Blogy",
        "tone": "Professional, ROI-focused, friendly",
        "target_audience": "Founder/CMO of Indian SaaS startup, budget $100-500/month",
        "search_intent": "Product review, comparison, thought leadership"
    }

    try:
        # Generate blogs
        result = generate_blog_pipeline(input_data)

        # Display results
        display_results(result)

        # Save to files
        save_results(result)

        return result

    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
