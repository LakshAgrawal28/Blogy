# BLOGY AI ENGINE - COMPLETE PRD & TECHNICAL SPEC

**Project:** Blogy - AI-Powered Blog Generation Engine for India  
**Scope:** Hackathon MVP (2-3 week delivery)  
**Delivery:** Fully functional prototype + published blogs + presentation  
**Status:** Ready for vibe coding implementation

---

## EXECUTIVE SUMMARY

Build a scalable AI-powered blog generation engine that converts 2-3 keywords into 2 SEO-optimized, publishable blogs through a structured 5-prompt pipeline. The engine must be live-demable, publish to real platforms, and produce measurable SEO scores.

**Core Value Prop:** Systematic keyword → outline → draft → validation flow ensures repeatability, measurability, and ranking readiness.

---

## PART 1: TECHNICAL ARCHITECTURE

### 1.1 System Overview

```
Input (Keywords) 
  ↓
[Prompt 1: Clustering] 
  ↓
[Prompt 2: SERP Gap Analysis]
  ↓
[Prompt 3: Outline Generation]
  ↓
[Prompt 4: Blog Draft]
  ↓
[Prompt 5: SEO Validation]
  ↓
Output (2 Polished Blogs)
  ↓
Publishing (Medium, Dev.to, etc.)
```

### 1.2 Technology Stack

**Frontend:**
- React (preferred) OR plain HTML + Vanilla JS
- Tailwind CSS for styling
- Form input (keywords, geo-target, tone)
- Progress bar (visual indication of pipeline execution)
- Blog display with publish buttons

**Backend:**
- Node.js (Express) OR Python (Flask/FastAPI)
- Anthropic SDK (`@anthropic-ai/sdk`)
- Claude Sonnet 4 model (`claude-sonnet-4-20250514`)
- Publishing API clients (Medium, Dev.to)

**APIs & Services:**
- Anthropic Claude API (primary)
- Medium API (for publishing)
- Dev.to API (for publishing)
- Optional: Moz API (free tier) or mock SEO scores

**Deployment (Optional):**
- Vercel (frontend) or local for demo
- Node.js/Python server (backend) or cloud function

---

## PART 2: THE 5-PROMPT ARCHITECTURE

### Prompt 1: Keyword Clustering & Analysis

**Purpose:** Group keywords by search intent, identify difficulty, and prioritize for content.

**Input:**
```json
{
  "keywords": ["Best AI blog automation tool", "Cheapest SEO software", "AI content writer India"],
  "target_market": "India",
  "blog_topic": "Blogy - AI Blog Automation"
}
```

**Output:**
```json
{
  "clusters": [
    {
      "cluster_name": "Best Tools & Reviews",
      "keywords": ["Best AI blog automation tool", "AI content writer India"],
      "search_intent": "informational",
      "difficulty": 7,
      "monthly_searches_estimate": 12000
    },
    {
      "cluster_name": "Cost-Focused",
      "keywords": ["Cheapest SEO software"],
      "search_intent": "commercial",
      "difficulty": 5,
      "monthly_searches_estimate": 8000
    }
  ],
  "primary_keyword": "Best AI blog automation tool India",
  "secondary_keywords": ["cheapest SEO software", "AI content writer"],
  "content_angles": [
    "Comparison with competitors (Jasper, Copy.ai, etc.)",
    "Cost savings for Indian startups",
    "Speed & automation benefits"
  ]
}
```

**Prompt Template:**
```
You are an expert SEO strategist and keyword research analyst.

Given the following keywords and target market, perform a comprehensive keyword clustering analysis:

Keywords: {keywords}
Target Market: {target_market}
Topic/Brand: {topic}

Provide:
1. Cluster these keywords by search intent (informational, commercial, transactional, navigational)
2. Estimate difficulty for each cluster (1-10 scale)
3. Identify content angles that aren't covered by competitors
4. Rank clusters by traffic potential
5. Suggest a primary keyword for the main blog

Return ONLY valid JSON matching this structure:
{
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
}

No markdown, no code blocks, pure JSON only.
```

---

### Prompt 2: SERP Gap Analysis

**Purpose:** Analyze top-3 ranking pages and identify gaps (missing sections, angles, pain points).

**Input:**
```json
{
  "keyword": "Best AI blog automation tool India",
  "target_market": "India",
  "content_angle": "Comparison with competitors, cost savings for Indian startups"
}
```

**Output:**
```json
{
  "top_3_competitors": [
    {
      "title": "Best AI Blog Writing Tools 2024",
      "url": "example.com/...",
      "word_count_estimate": 2500,
      "covered_topics": ["Features", "Pricing", "Pros/Cons", "Use Cases"],
      "missing_topics": ["India-specific pricing", "ROI for SMBs", "Free trial comparison", "Integration with WordPress"]
    }
  ],
  "content_gaps": [
    "India-specific pricing & localization",
    "Cost ROI for Indian startups (budget $100-500/month)",
    "Comparison with Blogy specifically",
    "Free trial & onboarding experience"
  ],
  "recommended_sections": [
    "Why Indian startups need AI blog automation",
    "Cost breakdown: Blogy vs. competitors in INR",
    "Case study: How Indian SaaS reduced content costs by 60%",
    "Free trial walkthrough (hands-on)",
    "Integration with popular Indian tools (Razorpay, etc.)"
  ],
  "snippet_opportunity": "Best AI blog automation tool for Indian startups - compare Blogy, Jasper, Copy.ai. Save up to 80% on content creation."
}
```

**Prompt Template:**
```
You are a top-tier SEO content strategist and competitive analyst.

Analyze the search results for the given keyword and identify content gaps that would help Blogy rank and outrank competitors.

Keyword: {keyword}
Target Market: {target_market}
Content Angle: {content_angle}

Assume you have analyzed the top 3 ranking pages for this keyword. Provide:

1. List the covered topics/sections in top-3 results (e.g., Features, Pricing, ROI, etc.)
2. Identify gaps: What are competitors NOT covering?
3. Recommend 5-7 unique sections that would differentiate our content
4. Suggest a strong featured snippet (max 160 chars) for this keyword
5. Identify audience pain points that competitors ignore

Return ONLY valid JSON:
{
  "top_3_covered": ["section1", "section2"],
  "content_gaps": ["gap1", "gap2", "gap3"],
  "recommended_sections": ["section1", "section2", "section3"],
  "unique_angles": ["angle1", "angle2"],
  "featured_snippet_text": "string (max 160 chars)",
  "audience_pain_points": ["pain1", "pain2"],
  "target_word_count": number
}

No markdown, pure JSON only.
```

---

### Prompt 3: Outline Generation

**Purpose:** Create a structured, SEO-optimized outline with H1/H2 hierarchy, CTA placement, and internal links.

**Input:**
```json
{
  "keyword": "Best AI blog automation tool India",
  "secondary_keywords": ["cheapest SEO software", "AI content writer"],
  "content_gaps": ["India-specific pricing", "Cost ROI for SMBs", ...],
  "recommended_sections": ["Why Indian startups need...", "Cost breakdown...", ...],
  "tone": "Professional but friendly, focus on ROI"
}
```

**Output:**
```json
{
  "seo_meta": {
    "h1": "Best AI Blog Automation Tool in India: Blogy vs. Competitors",
    "meta_description": "Compare Blogy with Jasper, Copy.ai & others. Find the cheapest AI blog automation tool for Indian startups. Free trial, ROI calculator inside.",
    "target_keyword": "Best AI blog automation tool India",
    "target_word_count": 2200
  },
  "outline": [
    {
      "level": "H1",
      "text": "Best AI Blog Automation Tool in India: Blogy vs. Competitors",
      "cta_type": "none"
    },
    {
      "level": "intro",
      "text": "Hook: Indian SaaS companies spend $5K-10K/month on content creation. Here's how to cut that by 80%.",
      "cta_type": "none"
    },
    {
      "level": "H2",
      "text": "Why Indian Startups Need AI Blog Automation",
      "cta_type": "none",
      "talking_points": ["Budget constraints", "Talent shortage", "Fast GTM pressure", "Content volume needs"]
    },
    {
      "level": "H2",
      "text": "Blogy vs. Jasper vs. Copy.ai: Feature Comparison",
      "cta_type": "none",
      "include_table": true,
      "comparison_criteria": ["Pricing (INR)", "Word count limit", "AI detection score", "SEO features", "Integration support"]
    },
    {
      "level": "H2",
      "text": "Cost Breakdown: Which Tool Saves You the Most Money?",
      "cta_type": "none",
      "talking_points": ["Per-blog cost calculation", "Team size considerations", "Hidden costs", "ROI timeframe"]
    },
    {
      "level": "H2",
      "text": "Blogy's SEO Optimization Features",
      "cta_type": "soft",
      "cta_text": "Try Blogy free for 7 days",
      "talking_points": ["Keyword clustering", "SERP gap detection", "Internal linking", "Snippet optimization"]
    },
    {
      "level": "H2",
      "text": "Case Study: How [Company] Reduced Content Costs by 65%",
      "cta_type": "none",
      "talking_points": ["Baseline: manual content creation", "Blogy implementation", "Results: time saved, cost saved"]
    },
    {
      "level": "H2",
      "text": "How to Get Started with Blogy: Step-by-Step",
      "cta_type": "hard",
      "cta_text": "Start your free trial",
      "include_image_placeholders": ["Setup screen", "Keyword input", "Blog output"]
    },
    {
      "level": "H2",
      "text": "FAQs: Blogy vs. Other Tools",
      "cta_type": "none",
      "faq_examples": [
        "Is Blogy suitable for non-English content?",
        "Can I integrate Blogy with my WordPress site?",
        "What's the AI detection score for Blogy blogs?"
      ]
    },
    {
      "level": "conclusion",
      "text": "Final CTA: 'Best-in-class AI blog automation for India. Try Blogy free today.'",
      "cta_type": "hard",
      "cta_text": "Get started free"
    }
  ],
  "internal_links": [
    { "text": "Blogy pricing", "anchor": "pricing-page" },
    { "text": "AI content detector", "anchor": "ai-detector-page" },
    { "text": "SEO guide", "anchor": "seo-guide-page" }
  ],
  "keyword_placement_strategy": {
    "h1": "Primary keyword (1x)",
    "h2": "Primary + secondary keywords (2-3x across all H2s)",
    "intro": "Primary keyword in first 100 words",
    "body": "2-3% density target",
    "cta": "Secondary keyword in CTA when possible"
  }
}
```

**Prompt Template:**
```
You are an expert SEO content strategist who designs high-converting, ranking-ready blog outlines.

Design a comprehensive blog outline for the following:

Primary Keyword: {keyword}
Secondary Keywords: {secondary_keywords}
Target Market: {target_market}
Content Gaps: {content_gaps}
Recommended Sections: {recommended_sections}
Tone: {tone}
Target Word Count: {target_word_count}

Requirements:
1. Create an H1 title that includes the primary keyword and is compelling
2. Write a meta description (max 160 chars) that includes primary keyword
3. Structure with H2 sections that cover all gaps and angles
4. Identify 2-3 soft CTAs and 1-2 hard CTAs (for conversion)
5. Map keyword placement: where should primary/secondary keywords appear?
6. Include table opportunity if comparison is relevant
7. Include FAQ section for long-tail keywords
8. Suggest internal link anchors (minimum 3)

Return ONLY valid JSON:
{
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
      "cta_text": "string if cta_type != none"
    }
  ],
  "internal_links": [{"text": "string", "anchor": "string"}],
  "keyword_placement_strategy": {}
}

No markdown, pure JSON only.
```

---

### Prompt 4: Blog Draft Generation

**Purpose:** Write the full blog based on the outline, with natural tone, examples, and conversion focus.

**Input:**
```json
{
  "outline": {...},
  "keyword": "Best AI blog automation tool India",
  "secondary_keywords": ["cheapest SEO software", "AI content writer"],
  "tone": "Professional but friendly, ROI-focused",
  "target_audience": "Founder/CMO of Indian SaaS startup, budget $100-500/month",
  "brand_name": "Blogy"
}
```

**Output:**
```
# Best AI Blog Automation Tool in India: Blogy vs. Competitors

Indian SaaS companies spend $5,000–10,000 per month on content creation. That's often 20-30% of a startup's budget. But what if you could cut that by 80% and actually improve your blog quality?

That's what AI blog automation tools like Blogy promise. And for many Indian startups, it's a game-changer.

In this guide, we'll compare Blogy with industry leaders like Jasper and Copy.ai—specifically for the Indian market. You'll see exact pricing in INR, ROI calculations, and real data on which tool saves you the most money.

## Why Indian Startups Need AI Blog Automation

Indian SaaS teams face a unique challenge: you need to rank globally, but your budget is local.

**Budget Constraints:** A full-time content writer in India costs ₹40,000–80,000/month. A tool like Blogy costs ₹5,000–15,000. That's a 5-10x cost difference.

**Talent Shortage:** Finding skilled SEO writers is hard. Most quality writers are already booked or charge premium rates (₹100+/article).

**Fast GTM Pressure:** You need to publish 2-3 blogs/week to rank. Manual writing simply can't keep up.

**Content Volume Needs:** To rank for 20+ keywords, you need 50+ blogs. That's 6+ months of manual work. AI cuts it to 4-6 weeks.

...

[Rest of the blog content here, following the outline structure]

## How to Get Started with Blogy: Step-by-Step

1. **Sign up** – Go to blogy.in and create an account (free 7-day trial)
2. **Add your keywords** – Input 2-3 target keywords, select your industry
3. **Review the outline** – Blogy generates an SEO-optimized outline in 30 seconds
4. **Generate the blog** – Hit "Generate Blog," and Blogy writes the full draft in 2-3 minutes
5. **Customize & publish** – Edit the blog, optimize images, and hit publish to Medium or WordPress

That's it. You go from keyword to published blog in under 10 minutes.

[CTA: Start your free trial]

## FAQs

**Q: Is Blogy suitable for non-English content?**
A: Yes. Blogy supports 20+ languages, including Hindi. However, SEO optimization is strongest for English currently.

**Q: Can I integrate Blogy with my WordPress site?**
A: Yes. Blogy has direct WordPress integration. Generate a blog, one-click publish to your site.

**Q: What's the AI detection score for Blogy blogs?**
A: Average AI detection score is 25-35% (very low risk). With Blogy's humanization feature, it drops to 10-15%.

---

## Final Verdict: Which Tool is Right for You?

- **Best for startups on a tight budget:** Blogy (₹5K/month, best ROI)
- **Best for professional agencies:** Jasper (more customization, higher cost)
- **Best for social media focus:** Copy.ai (quick short-form content)

**Bottom line:** If you're an Indian SaaS startup looking to cut content costs by 60-80% without sacrificing quality, Blogy is your answer.

[CTA: Get started free]
```

**Prompt Template:**
```
You are a world-class tech blog writer. Your blogs rank in Google's top 3, convert readers into customers, and read naturally (not AI-generated).

Write a complete blog post based on the outline provided. Requirements:

1. Follow the outline structure exactly (all H2s in order)
2. Write naturally—no robotic language, use analogies and examples
3. Target audience: {target_audience}
4. Brand voice: {tone}
5. Include 1-2 real data points or statistics (make them believable and India-specific)
6. Include 1-2 examples or case studies (can be hypothetical but realistic)
7. Include comparison table (if outlined)
8. Include FAQ section (if outlined)
9. Include 3-4 CTAs (soft and hard, as specified in outline)
10. Target word count: {target_word_count}
11. Keyword placement: Hit the primary keyword {primary_keyword} exactly 1x in H1, 2-3x in body (density ~2-3%), 0-1x in conclusion
12. Do NOT use markdown formatting—return plain text with clear section breaks

Outline: {outline_json}

Write the complete blog now. Plain text only, no markdown.
```

---

### Prompt 5: SEO Validation & Optimization

**Purpose:** Analyze the draft for SEO issues, keyword density, snippet readiness, and provide revision suggestions.

**Input:**
```json
{
  "blog_text": "...",
  "primary_keyword": "Best AI blog automation tool India",
  "secondary_keywords": ["cheapest SEO software", "AI content writer"],
  "target_word_count": 2200
}
```

**Output:**
```json
{
  "seo_score": 78,
  "score_breakdown": {
    "keyword_density": 85,
    "keyword_placement": 80,
    "readability": 75,
    "structure": 85,
    "internal_links": 70,
    "cta_placement": 90,
    "word_count": 95
  },
  "metrics": {
    "actual_word_count": 2180,
    "primary_keyword_count": 4,
    "primary_keyword_density": 0.18,
    "secondary_keyword_count": 6,
    "readability_grade": 7,
    "sentences_per_paragraph": 3.2,
    "average_word_length": 5.1
  },
  "issues": [
    {
      "severity": "medium",
      "issue": "Primary keyword only appears 4x (ideal: 5-6x)",
      "suggestion": "Add primary keyword to section about 'Why Indian Startups...'"
    },
    {
      "severity": "low",
      "issue": "Some paragraphs are 4+ sentences (ideal: 2-3)",
      "suggestion": "Break up paragraph about budget constraints"
    }
  ],
  "snippet_readiness": {
    "featured_snippet_eligible": true,
    "suggested_snippet": "Best AI blog automation tool for Indian startups - Blogy offers the cheapest pricing (₹5K/month) and highest ROI. Outranks Jasper and Copy.ai on cost-effectiveness.",
    "snippet_length_chars": 158
  },
  "ranking_potential": {
    "difficulty": 6,
    "potential_ranking_position": "2-5",
    "required_backlinks_estimate": 5,
    "time_to_rank_estimate_days": 30
  },
  "revision_suggestions": [
    "Add primary keyword to H2 about 'Why Indian Startups...'",
    "Break up paragraph about budget constraints (split into 2 paragraphs)",
    "Expand FAQ section with 1-2 more questions"
  ]
}
```

**Prompt Template:**
```
You are an expert SEO auditor and ranking strategist. Analyze this blog for SEO strength and provide a ranking score and actionable revision suggestions.

Blog Text:
{blog_text}

Primary Keyword: {primary_keyword}
Secondary Keywords: {secondary_keywords}
Target Word Count: {target_word_count}

Analyze and return ONLY valid JSON with:
1. Overall SEO score (0-100)
2. Score breakdown by metric (keyword density, placement, readability, structure, CTAs, word count)
3. Primary/secondary keyword counts and density
4. Issues found with severity (high/medium/low) and specific suggestions
5. Featured snippet readiness (is this eligible? what's the suggested snippet?)
6. Ranking potential: estimated difficulty (1-10), likely ranking position (1-20), backlinks needed, time to rank
7. Top 3-5 revision suggestions

{
  "seo_score": number,
  "score_breakdown": {},
  "metrics": {},
  "issues": [{"severity": "high|medium|low", "issue": "string", "suggestion": "string"}],
  "snippet_readiness": {"featured_snippet_eligible": bool, "suggested_snippet": "string"},
  "ranking_potential": {},
  "revision_suggestions": ["string"]
}

Pure JSON only, no markdown.
```

---

## PART 3: EXECUTION FLOW

### 3.1 Input Specification

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
  "content_type": "Product positioning + comparison",
  "publish_to": ["Medium", "Dev.to", "Substack"],
  "publish_as": {
    "Medium": "tech-entrepreneur",
    "Dev.to": "username-here",
    "Substack": "newsletter-name"
  }
}
```

### 3.2 Execution Steps

1. **Input Validation** - Ensure keywords, market, brand are provided
2. **Prompt 1 Execution** - Cluster keywords, identify angles
3. **Prompt 2 Execution** - Analyze SERP gaps, recommend sections
4. **Prompt 3 Execution** - Generate structured outline
5. **Prompt 4 Execution** - Write full blog draft
6. **Prompt 5 Execution** - Validate SEO, generate score
7. **Optional: Revision Loop** - If score < 70, regenerate section and re-validate
8. **Publishing** - Send to Medium, Dev.to, and other platforms
9. **Output** - Return blog text, links, SEO scores

### 3.3 API Call Pattern (Pseudocode)

```javascript
// Simplified pattern for vibe coding
async function generateBlog(keyword, market, brand) {
  const step1 = await callClaude(PROMPT_1, { keywords: [keyword], target_market: market });
  const step2 = await callClaude(PROMPT_2, { keyword, ...step1 });
  const step3 = await callClaude(PROMPT_3, { keyword, ...step2, tone: "professional", target_word_count: 2200 });
  const step4 = await callClaude(PROMPT_4, { outline: step3, keyword, tone: "professional" });
  const step5 = await callClaude(PROMPT_5, { blog_text: step4, primary_keyword: keyword });
  
  // Optional: If score < 70, revise and re-validate
  if (step5.seo_score < 70) {
    const revised = await reviseAndRegenerate(step4, step5.issues);
    const revalidated = await callClaude(PROMPT_5, { blog_text: revised, primary_keyword: keyword });
    return revalidated;
  }
  
  return step5;
}
```

---

## PART 4: DELIVERABLES

### Blog 1: "Best AI Blog Automation Tool in India"
- **Primary Keyword:** Best AI blog automation tool India
- **Angle:** Product review + comparison with Jasper, Copy.ai
- **Focus:** Cost savings for Indian SaaS startups
- **Length:** 2000-2500 words
- **Publish to:** Medium, Dev.to, Substack

### Blog 2: "How Blogy is Disrupting Martech – Organic Traffic on Autopilot, Cheapest SEO"
- **Primary Keyword:** How Blogy is disrupting martech
- **Angle:** Industry positioning, thought leadership, automation ROI
- **Focus:** Blogy's innovation in martech space, cost advantage
- **Length:** 2000-2500 words
- **Publish to:** Medium, LinkedIn, Hashnode

### Presentation (5 slides)
1. Problem & Opportunity (Blogy's market)
2. 5-Prompt Architecture (the engine)
3. Live Demo (keywords → blogs in real-time)
4. Results & Validation (SEO scores, publish links)
5. Scalability & Future (roadmap)

### Code Deliverables
- Full pipeline code (Node.js or Python)
- React/HTML UI
- Publishing API integration
- SEO scoring logic
- README with setup instructions

---

## PART 5: SUCCESS METRICS

| Metric | Target | Notes |
|--------|--------|-------|
| **SEO Score (Blog 1)** | 75+ | Validated by Prompt 5 |
| **SEO Score (Blog 2)** | 75+ | Validated by Prompt 5 |
| **Readability Grade** | 6-8 | 6th-8th grade reading level |
| **AI Detection** | <30% | Use turnitin.com or similar |
| **Word Count** | 2000-2500 | Per blog |
| **Keyword Density** | 1.5-2.5% | Primary keyword |
| **CTAs Placed** | 3-4 | Minimum 2 hard CTAs |
| **Published Links** | 2+ | Live, clickable URLs |
| **Pipeline Execution Time** | <5 min per blog | From keyword to output |
| **Demo Reliability** | 100% | Must work live 5+ times |

---

## PART 6: RISK MITIGATION

| Risk | Mitigation |
|------|-----------|
| **API Costs (Claude)** | Use Sonnet 4 (cheaper), cache results, estimate ~$5-10 per blog |
| **API Rate Limits** | Implement retry logic, queue requests, space out demo runs |
| **Demo Failure** | Record video backup, test 5+ times before presentation |
| **Poor Blog Quality** | Iterate on prompts, use revision loop (Prompt 5 → re-generate) |
| **Publishing API Issues** | Have manual copy-paste backup, test APIs early |
| **Keyword Research Accuracy** | Use real SERP analysis, don't rely purely on AI's guesses |
| **AI Detection High** | Add humanization pass (Prompt 6 optional), manual editing |

---

## PART 7: TEAM TASKS

### Task 1: Prompt Engineering (8 hours)
- Write all 5 prompts (provided above)
- Test each prompt in isolation
- Refine outputs, handle edge cases
- **Owner:** Prompt Engineer

### Task 2: Backend Development (12 hours)
- Set up Node.js/Python + Anthropic SDK
- Implement pipeline logic (call prompts in sequence)
- Add publishing APIs (Medium, Dev.to)
- Add SEO scoring logic
- Add error handling & retry logic
- **Owner:** Backend Dev

### Task 3: Frontend Development (10 hours)
- Build React/HTML form (keywords input, tone, target audience)
- Build progress bar / status indicator
- Build blog display (rendered HTML)
- Build publish buttons (direct to Medium, Dev.to, etc.)
- Add link to published blogs
- **Owner:** Frontend Dev

### Task 4: SEO & Content (6 hours)
- Validate prompts with real SEO knowledge
- Select 2 keywords with optimal difficulty
- Create backup content/examples
- Validate published blogs in real tools (SEMrush, Moz)
- **Owner:** SEO Lead

### Task 5: Presentation (4 hours)
- Create 5-slide deck
- Practice live demo (5+ dry runs)
- Record video backup
- Prepare talking points
- **Owner:** Presenter

**Total: 40 hours (1 week full-time, 2 weeks part-time)**

---

## FINAL NOTES

- **Use Claude Sonnet 4** (`claude-sonnet-4-20250514`) for best speed/cost balance
- **Cache results heavily** – Don't re-run prompts unnecessarily
- **Test the demo flow locally first** – Before presenting, run it 5+ times
- **Have a manual backup** – If publishing APIs fail, be ready to copy-paste
- **Iterate on keywords** – If first two don't work, swap them out and try again
- **Keep it simple** – Don't over-engineer. Vibe coding is about speed and pragmatism.

**This PRD is your North Star. Follow it, and you'll have a working engine by end of day.**

Good luck. Ship it. 🚀
