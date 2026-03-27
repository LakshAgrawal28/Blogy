# BLOGY ENGINE - MASTER STITCH PROMPT
## Execute entire pipeline in a single Claude API call

This prompt chains all 5 steps together and returns a complete JSON with outlines, blogs, and SEO scores.

---

## USAGE

### In Node.js:
```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 8000,
  messages: [
    {
      role: "user",
      content: `${MASTER_STITCH_PROMPT}

INPUT:
{
  "keywords": ["Best AI blog automation tool in India", "How Blogy is disrupting martech"],
  "target_market": "India",
  "brand_name": "Blogy",
  "tone": "Professional, ROI-focused, friendly",
  "target_audience": "Founder/CMO of Indian SaaS startup, budget $100-500/month",
  "search_intent": "Product review, comparison, thought leadership"
}

Execute the pipeline now. Return ONLY valid JSON.`
    }
  ]
});

const result = JSON.parse(response.content[0].text);
console.log(JSON.stringify(result, null, 2));
```

### In Python:
```python
import anthropic
import json

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=8000,
    messages=[
        {
            "role": "user",
            "content": f"""{MASTER_STITCH_PROMPT}

INPUT:
{{
  "keywords": ["Best AI blog automation tool in India", "How Blogy is disrupting martech"],
  "target_market": "India",
  "brand_name": "Blogy",
  "tone": "Professional, ROI-focused, friendly",
  "target_audience": "Founder/CMO of Indian SaaS startup"
}}

Execute the pipeline now. Return ONLY valid JSON."""
        }
    ]
)

result = json.loads(response.content[0].text)
print(json.dumps(result, indent=2))
```

---

## THE MASTER STITCH PROMPT

```
You are an expert SEO architect, content strategist, and blog generation engine.

Your task: Execute a complete, 5-step AI blog generation pipeline. Take raw keywords and produce 2 fully SEO-optimized, publishable blogs.

INPUT SPECIFICATION:
- keywords: List of 2-3 blog topics/keywords
- target_market: Geographic target (e.g., "India")
- brand_name: Company/product name (e.g., "Blogy")
- tone: Writing style (e.g., "Professional, ROI-focused")
- target_audience: Who is reading this? (e.g., "Founder of Indian SaaS startup")
- search_intent: What is the reader looking for? (e.g., "Product review, comparison")

EXECUTION PIPELINE:

### STEP 1: KEYWORD CLUSTERING & ANALYSIS
For the first keyword provided:
- Group it with related keywords by search intent
- Identify content angles competitors are missing
- Estimate search difficulty (1-10)
- Recommend primary and secondary keywords
Return JSON with: clusters[], primary_keyword, secondary_keywords, content_angles[]

### STEP 2: SERP GAP ANALYSIS
For the primary keyword from Step 1:
- Identify what the top-3 ranking pages cover
- Find gaps in content (what competitors DON'T cover)
- Recommend unique sections that will differentiate the blog
- Suggest a featured snippet (max 160 chars)
Return JSON with: top_3_covered[], content_gaps[], recommended_sections[], featured_snippet

### STEP 3: OUTLINE GENERATION
For the primary keyword and gaps identified in Steps 1-2:
- Create an H1 title that includes the primary keyword
- Write a meta description (max 160 chars) with primary keyword
- Structure with H2s that cover all gaps and recommended sections
- Place 2-3 soft CTAs and 1-2 hard CTAs throughout
- Map where primary/secondary keywords should appear
- Suggest 3-4 internal link opportunities
Return JSON with: seo_meta{h1, meta_description}, outline[{level, text, cta_type, cta_text}], internal_links[], keyword_placement_strategy

### STEP 4: BLOG DRAFT GENERATION
For the outline from Step 3:
- Write a complete, natural blog post (not robotic)
- Follow the outline structure exactly
- Include 2-3 data points, examples, or case studies
- Hit target keyword 1x in H1, 2-3x in body (density ~2%), 0-1x in conclusion
- Include comparison table if relevant
- Include FAQ section with 3-4 questions
- Place CTAs naturally (soft and hard as specified)
- Target word count: 2200 words
- Return as plain text (no markdown)
Return: Full blog text as plain text

### STEP 5: SEO VALIDATION & SCORING
For the blog from Step 4:
- Calculate keyword density (primary and secondary)
- Check keyword placement (H1, H2s, intro, body, conclusion)
- Assess readability (grade level 6-8)
- Evaluate structure (number of paragraphs, sentence length)
- Check CTA placement (3-4 total, minimum 2 hard CTAs)
- Evaluate featured snippet readiness
- Estimate ranking potential (difficulty, likely position 1-20, backlinks needed, time to rank)
- Identify any issues (severity: high/medium/low) and suggest revisions
- Generate overall SEO score (0-100)
Return JSON with: seo_score, score_breakdown{}, metrics{}, issues[], snippet_readiness{}, ranking_potential{}, revision_suggestions[]

---

MULTI-BLOG WORKFLOW:

1. Execute Steps 1-5 for the FIRST keyword
2. Execute Steps 1-5 for the SECOND keyword (independent pipeline)
3. Return both results in a combined JSON structure

---

OUTPUT SPECIFICATION:

Return ONLY valid JSON matching this structure:

{
  "execution_timestamp": "ISO-8601 timestamp",
  "input_summary": {
    "keywords": ["keyword1", "keyword2"],
    "target_market": "string",
    "brand_name": "string",
    "tone": "string"
  },
  "blogs": [
    {
      "blog_index": 1,
      "keyword": "keyword1",
      "step1_clustering": {
        "clusters": [
          {
            "cluster_name": "string",
            "keywords": ["string"],
            "search_intent": "string",
            "difficulty": number,
            "monthly_searches_estimate": number,
            "content_angle": "string"
          }
        ],
        "primary_keyword": "string",
        "secondary_keywords": ["string"],
        "recommended_angles": ["string"]
      },
      "step2_serp_gap": {
        "top_3_covered": ["section1", "section2"],
        "content_gaps": ["gap1", "gap2"],
        "recommended_sections": ["section1", "section2"],
        "unique_angles": ["angle1", "angle2"],
        "featured_snippet_text": "string (max 160 chars)",
        "target_word_count": number
      },
      "step3_outline": {
        "seo_meta": {
          "h1": "string",
          "meta_description": "string (max 160 chars)",
          "target_keyword": "string",
          "target_word_count": number
        },
        "outline": [
          {
            "level": "H1|H2|intro|conclusion",
            "text": "string",
            "cta_type": "none|soft|hard",
            "cta_text": "string (optional)"
          }
        ],
        "internal_links": [
          {"text": "string", "anchor": "string"}
        ],
        "keyword_placement_strategy": {
          "h1": "description",
          "h2": "description",
          "body": "description"
        }
      },
      "step4_blog_draft": {
        "blog_text": "string (full blog, plain text, no markdown)",
        "word_count": number,
        "estimated_reading_time_minutes": number
      },
      "step5_seo_validation": {
        "seo_score": number,
        "score_breakdown": {
          "keyword_density": number,
          "keyword_placement": number,
          "readability": number,
          "structure": number,
          "internal_links": number,
          "cta_placement": number,
          "word_count": number
        },
        "metrics": {
          "actual_word_count": number,
          "primary_keyword_count": number,
          "primary_keyword_density": number,
          "secondary_keyword_count": number,
          "readability_grade": number,
          "sentences_per_paragraph": number,
          "average_word_length": number
        },
        "issues": [
          {
            "severity": "high|medium|low",
            "issue": "string",
            "suggestion": "string"
          }
        ],
        "snippet_readiness": {
          "featured_snippet_eligible": boolean,
          "suggested_snippet": "string (max 160 chars)",
          "snippet_length_chars": number
        },
        "ranking_potential": {
          "difficulty": number,
          "potential_ranking_position": "string",
          "required_backlinks_estimate": number,
          "time_to_rank_estimate_days": number
        },
        "revision_suggestions": ["string"]
      }
    },
    {
      "blog_index": 2,
      "keyword": "keyword2",
      "step1_clustering": {...},
      "step2_serp_gap": {...},
      "step3_outline": {...},
      "step4_blog_draft": {...},
      "step5_seo_validation": {...}
    }
  ],
  "summary": {
    "total_blogs_generated": 2,
    "average_seo_score": number,
    "total_word_count": number,
    "highest_ranking_potential": "blog_index: X",
    "execution_notes": "string"
  }
}

---

CRITICAL REQUIREMENTS:

1. RETURN ONLY VALID JSON - No markdown, no code blocks, no explanatory text outside the JSON
2. Each step must complete before moving to the next
3. For Step 4, write PLAIN TEXT, not markdown (no # symbols, no **bold**, no lists with dashes)
4. Keyword placement: Primary keyword MUST appear 1x in H1, 2-3x in body, 0-1x in conclusion
5. Blog tone: Natural and conversational, NOT robotic or AI-like
6. All JSON keys must be present (do not omit optional fields, use null or empty string instead)
7. For "issues" array: If no issues, return empty array []
8. For metrics: Calculate based on actual blog text (word count, keyword counts, etc.)
9. Estimate reasonable numbers for search difficulty, backlinks needed, time to rank based on keyword competitiveness

---

TONE & VOICE GUIDELINES:

For Step 4 (Blog Draft):
- Use short paragraphs (2-3 sentences each)
- Use analogies and real examples
- Include 1-2 India-specific data points (realistic and plausible)
- Address pain points directly (e.g., "Your content writers are expensive")
- Balance professionalism with friendliness (e.g., "That's a game-changer")
- Use active voice, avoid jargon
- Include social proof (e.g., "500+ Indian SaaS companies use Blogy")

---

NOW EXECUTE THE PIPELINE:

Use the INPUT provided by the user to execute Steps 1-5 for all keywords.
Generate 2 complete, publishable blogs with full validation.
Return the complete JSON output.
```

---

## EXAMPLE INPUT

```json
{
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
```

---

## EXAMPLE OUTPUT (Structure Only)

```json
{
  "execution_timestamp": "2024-03-27T10:30:00Z",
  "input_summary": {...},
  "blogs": [
    {
      "blog_index": 1,
      "keyword": "Best AI blog automation tool in India",
      "step1_clustering": {...},
      "step2_serp_gap": {...},
      "step3_outline": {...},
      "step4_blog_draft": {
        "blog_text": "# Best AI Blog Automation Tool in India...\n\nIndian SaaS companies spend...",
        "word_count": 2240,
        "estimated_reading_time_minutes": 8
      },
      "step5_seo_validation": {
        "seo_score": 78,
        "score_breakdown": {...},
        "metrics": {...},
        "issues": [],
        "snippet_readiness": {...},
        "ranking_potential": {...},
        "revision_suggestions": []
      }
    },
    {
      "blog_index": 2,
      "keyword": "How Blogy is disrupting martech",
      ...
    }
  ],
  "summary": {
    "total_blogs_generated": 2,
    "average_seo_score": 76,
    "total_word_count": 4480,
    "highest_ranking_potential": "blog_index: 1",
    "execution_notes": "Both blogs generated successfully with high SEO scores."
  }
}
```

---

## IMPLEMENTATION TIPS FOR VIBE CODING

1. **Copy the master prompt** – Use the prompt text in a Claude API call
2. **Pass the input JSON** – Include the user's keywords, market, tone
3. **Parse the output** – The response will be pure JSON, easy to parse
4. **Extract the blogs** – Access `response.blogs[0].step4_blog_draft.blog_text` and `response.blogs[1].step4_blog_draft.blog_text`
5. **Display results** – Show blogs in the UI, display SEO scores, link to publish endpoints
6. **Cache aggressively** – Don't re-run this prompt for the same keywords

---

## PERFORMANCE EXPECTATIONS

- **Token usage:** ~6,000-8,000 tokens per execution
- **Cost:** ~$0.06-0.10 per execution (using Sonnet 4)
- **Time:** 60-120 seconds per execution
- **Quality:** SEO score 70-85 on first pass

---

## DEBUGGING

If JSON parsing fails:
1. Check that the response starts with `{` and ends with `}`
2. Look for unescaped quotes in blog_text (should be `\"`)
3. Trim whitespace from the response before parsing
4. If the model cuts off, increase max_tokens to 10000

If blog quality is low (SEO score < 70):
1. Check keyword selection (maybe too competitive)
2. Refine the target_audience prompt
3. Run the revision loop: use step5_seo_validation.revision_suggestions to regenerate and re-validate
4. Swap keywords and try again

---

## NEXT STEPS AFTER GENERATION

1. **Extract blogs** → Save step4_blog_draft.blog_text to separate files
2. **Publish** → Use Medium API, Dev.to API, or manual copy-paste
3. **Validate** → Check published links in SEMrush, Moz, or Turnitin
4. **Iterate** → If scores are low, regenerate and re-run validation
5. **Collect metrics** → Track SEO scores, publish links, AI detection scores for presentation

Good luck. This prompt will make your MVP. 🚀
