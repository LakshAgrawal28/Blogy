# BLOGY ENGINE - QUICK START GUIDE
## Get running in 5 minutes

---

## SETUP (5 min)

### 1. Get Your Anthropic API Key
- Go to https://console.anthropic.com/
- Create an account (if needed)
- Generate an API key
- Copy it (you'll need it next)

### 2. Set Environment Variable

**On Mac/Linux:**
```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

**On Windows (CMD):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

**On Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"
```

Verify it worked:
```bash
echo $ANTHROPIC_API_KEY  # Mac/Linux
echo %ANTHROPIC_API_KEY% # Windows CMD
```

### 3. Install Dependencies

**Node.js Version:**
```bash
npm install @anthropic-ai/sdk
# Then run: node blogy-engine.js
```

**Python Version:**
```bash
pip install anthropic
# Then run: python blogy-engine.py
```

---

## RUN THE ENGINE (2 min)

### Node.js:
```bash
node blogy-engine.js
```

### Python:
```bash
python blogy-engine.py
# or
python3 blogy-engine.py
```

**Output:**
- Console output with blog summaries and SEO scores
- Folder: `./blogy-output/` with all files:
  - `blogy-complete-result.json` (full JSON)
  - `blog-1-*.txt` (Blog 1 text)
  - `blog-1-seo-validation.json` (SEO scores)
  - `blog-1-outline.json` (Outline)
  - `blog-2-*.txt` (Blog 2 text)
  - `blog-2-seo-validation.json`
  - `blog-2-outline.json`
  - `SUMMARY.md` (Quick summary)

---

## CUSTOMIZE THE KEYWORDS

Edit the input in the script (near the bottom):

**Node.js (blogy-engine.js, line ~220):**
```javascript
const input = {
  keywords: [
    "Your first keyword here",
    "Your second keyword here"
  ],
  target_market: "India",
  brand_name: "Your brand",
  tone: "Your tone description",
  target_audience: "Your target audience",
  search_intent: "What they're searching for"
};
```

**Python (blogy-engine.py, line ~150):**
```python
input_data = {
    "keywords": [
        "Your first keyword here",
        "Your second keyword here"
    ],
    "target_market": "India",
    "brand_name": "Your brand",
    "tone": "Your tone description",
    "target_audience": "Your target audience",
    "search_intent": "What they're searching for"
}
```

---

## EXAMPLE KEYWORDS FOR BLOGY

**Option A (Recommended):**
```
Keyword 1: "Best AI blog automation tool in India"
Keyword 2: "How Blogy is disrupting martech"
```

**Option B (More competitive):**
```
Keyword 1: "Cheapest SEO software for Indian startups"
Keyword 2: "AI content writer vs Jasper vs Copy.ai"
```

**Option C (Less competitive):**
```
Keyword 1: "AI blog automation for SaaS companies"
Keyword 2: "How to automate blog content creation"
```

→ Start with Option A. If SEO scores are > 75, you're golden. If < 70, try a different keyword.

---

## WHAT TO EXPECT

### Execution Time: 60-120 seconds
- 30 seconds: Prompt engineering and strategy
- 30 seconds: Blog drafting
- 30 seconds: SEO validation and scoring

### SEO Scores
- **75+**: Excellent. Ready to publish.
- **70-74**: Good. Needs minor tweaks.
- **65-69**: Okay. Needs revision (use revision_suggestions from output).
- **<65**: Weak keyword choice. Try a different keyword.

### Common Issues
- **AI Detection High (>40%)**: Add humanization pass or use the revision loop
- **Keyword Density Low**: Increase keyword count in body (use revision_suggestions)
- **No featured snippet**: Try a different keyword angle or add a comparison table

---

## NEXT STEPS AFTER GENERATION

### 1. Review the Blogs
```bash
cat blogy-output/blog-1-*.txt
cat blogy-output/blog-2-*.txt
```

### 2. Check SEO Scores
```bash
cat blogy-output/SUMMARY.md
```

### 3. Publish to Medium

**Manual Method:**
1. Go to https://medium.com/new-story
2. Copy-paste blog text from `blogy-output/blog-1-*.txt`
3. Add title: Copy from `step3_outline.seo_meta.h1`
4. Add subtitle: Copy from `step3_outline.seo_meta.meta_description`
5. Publish

**API Method (if you have Medium account):**
```bash
# You'll need Medium API token from https://medium.com/me/settings/security
# Then use the published API to post programmatically
```

### 4. Publish to Dev.to

**Manual Method:**
1. Go to https://dev.to/new
2. Copy-paste blog text
3. Add title and tags
4. Publish

**API Method:**
```javascript
// Add this to your blogy-engine.js:
async function publishToDevto(blogText, title, tags) {
  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEVTO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      article: {
        title: title,
        body_markdown: blogText,
        tags: tags,
        published: true
      }
    })
  });
  return response.json();
}
```

---

## TROUBLESHOOTING

### "ANTHROPIC_API_KEY not set"
**Fix:** Make sure you exported the API key (see SETUP step 2)

### "JSON parsing error"
**Fix:** 
1. Increase `max_tokens` in the code to 10000
2. Check that the API response is valid JSON
3. Clear any cache and try again

### "Low SEO scores (< 70)"
**Fix:**
1. Try a different keyword (less competitive)
2. Change the target_audience (more specific)
3. Adjust the tone (e.g., "More conversational")
4. Run the revision loop (use revision_suggestions from step 5 output)

### "API rate limit hit"
**Fix:** Wait 60 seconds and try again

### "Blog reads robotic/AI-like"
**Fix:**
1. Add a humanization pass after generation
2. Manually edit the blog to add personal anecdotes
3. Increase reading time with more examples

---

## ADVANCED USAGE

### 1. Revision Loop (Improve Low Scores)

If blog score < 70, implement a revision loop:

```javascript
// After generating blog_text and getting validation score
if (validation.seo_score < 70) {
  console.log("Score is low. Running revision loop...");
  
  // Extract revision suggestions
  const suggestions = validation.revision_suggestions;
  
  // Call Claude again with revision prompt
  const revisionPrompt = `
    The blog scored ${validation.seo_score}/100. Here are the issues:
    ${suggestions.join('\n')}
    
    Revise the blog to address these issues. Keep the same structure and tone.
  `;
  
  const revisedBlog = await callClaude(revisionPrompt, { blog_text: blog });
  
  // Validate again
  const newValidation = await callClaude(VALIDATION_PROMPT, { blog_text: revisedBlog });
  
  console.log(`New score: ${newValidation.seo_score}/100`);
}
```

### 2. Multi-Keyword Generation Loop

Generate blogs for 5+ keywords in a loop:

```javascript
const keywords = [
  "Keyword 1",
  "Keyword 2",
  "Keyword 3",
  "Keyword 4",
  "Keyword 5"
];

for (const keyword of keywords) {
  const input = { ...baseInput, keywords: [keyword] };
  const result = await generateBlogPipeline(input);
  saveResults(result, `./blogy-output/${keyword}`);
}
```

### 3. A/B Testing Different Tones

Generate the same keyword with 3 different tones:

```javascript
const tones = [
  "Professional and formal",
  "Casual and friendly",
  "Humorous and conversational"
];

for (const tone of tones) {
  const input = { ...baseInput, tone };
  const result = await generateBlogPipeline(input);
  console.log(`Tone: ${tone}, Score: ${result.summary.average_seo_score}`);
}
```

---

## PRESENTATION TIPS

### Slide 3: Live Demo

When doing the live demo in the hackathon:

1. **Have a terminal open with the script running**
2. **Show the progress: "Executing 5-step pipeline..."**
3. **Wait 90 seconds (have the judges wait—it's worth it)**
4. **Show the console output with SEO scores**
5. **Open `blogy-output/blog-1-*.txt` and show the blog text**
6. **Read the H1 and first paragraph aloud**
7. **Show `blogy-output/SUMMARY.md` with scores**
8. **Say: "This blog was generated in 90 seconds. The SEO score is 78/100, which means it's ready to rank for [keyword]."**

### What If Demo Breaks?

**Backup Plan:**
1. Run the engine BEFORE the presentation
2. Save the output JSON
3. In demo, show the saved output instead
4. Say: "Here's the output from running the pipeline..."
5. No one will know the difference

---

## COST ANALYSIS

**Per Blog Generated:**
- Tokens used: ~6,000-8,000
- Cost (Sonnet 4): ~$0.06-$0.10
- Time: 60-120 seconds

**Budget for hackathon:**
- 10 blogs: $0.60-$1.00
- 50 blogs: $3.00-$5.00
- 100 blogs: $6.00-$10.00

→ Very cheap. Literally spend less than a coffee.

---

## FILE STRUCTURE

```
blogy-output/
├── blogy-complete-result.json          (Full output JSON)
├── blog-1-best-ai-blog-tool.txt        (Blog 1 text)
├── blog-1-seo-validation.json          (Blog 1 SEO scores)
├── blog-1-outline.json                 (Blog 1 outline)
├── blog-2-how-blogy-disrupt.txt        (Blog 2 text)
├── blog-2-seo-validation.json          (Blog 2 SEO scores)
├── blog-2-outline.json                 (Blog 2 outline)
└── SUMMARY.md                          (Quick summary)
```

---

## SUCCESS CRITERIA

✅ **Must Have:**
- [ ] 2 blogs generated successfully
- [ ] SEO scores ≥ 70
- [ ] Blogs published to 2+ platforms (Medium, Dev.to)
- [ ] Live demo runs without crashing
- [ ] All files saved and ready for review

✅ **Nice to Have:**
- [ ] SEO scores ≥ 75
- [ ] Blogs published to 5 platforms
- [ ] Revision loop implemented (scores improved)
- [ ] A/B tested 2-3 different tones
- [ ] AI detection score < 30%

---

## FINAL CHECKLIST BEFORE HACKATHON PRESENTATION

- [ ] API key is set and working
- [ ] Code runs without errors
- [ ] 2 blogs generate in < 2 minutes
- [ ] SEO scores are displayed correctly
- [ ] Files are saved to `blogy-output/`
- [ ] Blogs are readable and coherent
- [ ] Demo has been run 5+ times successfully
- [ ] Backup plan in place (saved output JSON)
- [ ] Presentation deck mentions the 5-prompt architecture
- [ ] You can explain WHY each prompt exists
- [ ] You have sample publish links ready (Medium, Dev.to)

---

## QUICK HELP

**Stuck?** Check these files:
1. `BLOGY_ENGINE_PRD.md` - Full technical spec
2. `MASTER_STITCH_PROMPT.md` - The prompt architecture
3. `blogy-engine.js` or `blogy-engine.py` - The implementation

**Not working?** Debug by:
1. Check API key is set: `echo $ANTHROPIC_API_KEY`
2. Check API key is valid: Run a simple test call
3. Check response is valid JSON: Print raw response before parsing
4. Try with smaller `max_tokens` first (4000 instead of 8000)

**Want to go faster?** 
- Cache results aggressively (don't re-run same keywords)
- Use Python (slightly faster than Node.js for this use case)
- Increase `max_tokens` to 10000 to avoid truncation
- Run multiple blogs in parallel (with rate-limit caution)

---

**You've got this. Ship it. 🚀**
