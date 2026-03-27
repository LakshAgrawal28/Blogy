```markdown
# Design System Specification: The Editorial Automator

## 1. Overview & Creative North Star
This design system is built to transform 'Blogy' from a utility tool into a high-end content command center. Our Creative North Star is **"The Editorial Automator."** 

Unlike standard SaaS platforms that feel like cluttered spreadsheets, this system treats AI-generated content with the prestige of a physical broadsheet magazine. We achieve this by breaking the "template" look through intentional asymmetry—placing high-density data visualization against expansive, breathing white space. We use extreme typographic scale shifts to highlight ROI, ensuring that Indian founders and CMOs feel the immediate value of their investment through a lens of professional sophistication.

---

## 2. Colors & Chromatic Depth
The palette is rooted in a "Deep Professional" ethos, utilizing varying tonal weights to guide the eye without the need for structural clutter.

- **Primary Strategy:** Use `primary` (#003fb1) for authoritative actions and brand presence. Reserve `tertiary` (#005438) and `tertiary_fixed_dim` (#4edea3) exclusively for 'Success' states—specifically SEO scores and ROI growth metrics.
- **The "No-Line" Rule:** We explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a sidebar should be `surface_container_low` (#f2f4f6) sitting against a `surface` (#f7f9fb) main stage.
- **Surface Hierarchy & Nesting:** Treat the UI as a series of stacked, premium materials. 
    - **Base Layer:** `surface` (#f7f9fb)
    - **In-Page Sections:** `surface_container` (#eceef0)
    - **Interactive Cards:** `surface_container_lowest` (#ffffff)
- **The "Glass & Gradient" Rule:** To create a signature feel, floating elements (like hover menus) should use `surface_container_lowest` at 80% opacity with a `backdrop-blur` of 12px. For primary CTAs, apply a subtle linear gradient from `primary` (#003fb1) to `primary_container` (#1a56db) at a 135-degree angle to provide a "lit from within" professional polish.

---

## 3. Typography
We utilize a dual-typeface system to balance editorial authority with functional precision.

- **The Display Layer (Manrope):** Use Manrope for all `display`, `headline`, and `title` tokens. Its geometric yet friendly curves suggest a modern, AI-forward brand.
    - *Example:* Use `display-lg` (3.5rem) for the "Total ROI" figure on the dashboard to create an undeniable focal point.
- **The Functional Layer (Inter):** Use Inter for all `body` and `label` tokens. Its high x-height ensures that complex blog metadata and SEO keywords remain legible at small sizes.
- **Hierarchy via Scale:** Ensure a "High-Contrast" ratio. A `headline-lg` (2rem) should often sit near `body-sm` (0.75rem) metadata to create an upscale, editorial rhythm.

---

## 4. Elevation & Depth
In this design system, depth is a tool for focus, not just decoration.

- **The Layering Principle:** Avoid shadows for static containers. Achieve "lift" by placing a `surface_container_lowest` (#ffffff) card atop a `surface_container_high` (#e6e8ea) background. This creates a soft, natural hierarchy that feels integrated.
- **Ambient Shadows:** For active states or modals, use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(25, 28, 30, 0.06);`. The shadow color is derived from `on_surface` to mimic natural ambient light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#c3c5d7) at **15% opacity**. High-contrast, 100% opaque borders are strictly forbidden.
- **Glassmorphism:** Use semi-transparent layers for navigation bars. This allows content to bleed through as the user scrolls, maintaining a sense of spatial awareness and "modern SaaS" fluidity.

---

## 5. Components

### Buttons & Interaction
- **Primary Action:** Pill-shaped (`rounded-full`) or `md` (0.75rem). Uses the Primary Gradient. Text is `on_primary`.
- **Secondary Action:** `surface_container_highest` (#e0e3e5) background with `on_surface` text. No border.
- **Tertiary/Ghost:** No background. Uses `on_primary_fixed_variant` (#003dab) for text.

### Input Fields
- **Styling:** Use `surface_container_high` (#e6e8ea) for the field background with a `sm` (0.25rem) corner radius.
- **States:** On focus, transition the background to `surface_container_lowest` (#ffffff) and add a 2px `primary` ghost border (20% opacity).

### Cards & Intelligence Modules
- **Rule:** Forbid the use of divider lines.
- **Separation:** Use `spacing-8` (2rem) of vertical white space or shift the background from `surface_container_low` to `surface_container_highest`. 
- **Blogy Specifics:** Include a "Sentiment Chip" using `secondary_container` with `on_secondary_container` text to show AI-detected tone.

### SEO Health Gauges
- **Visual:** Use a circular stroke with `tertiary_fixed_dim` (#4edea3) to represent "Healthy" scores. Pair with `headline-sm` Manrope for the percentage.

---

## 6. Do's and Don'ts

### Do:
- **Prioritize Breathing Room:** Use `spacing-10` and `spacing-12` between major dashboard modules. 
- **Embrace Asymmetry:** Place a large SEO score (`display-md`) on the left and a dense list of "Top Performing Keywords" (`body-sm`) on the right to create an editorial layout.
- **Use Tonal Transitions:** Transition backgrounds from `surface` to `surface_container_low` to guide the user's journey from navigation to content.

### Don't:
- **Don't use 1px Dividers:** Never use a solid line to separate items in a list. Use `spacing-4` and background color blocks instead.
- **Don't use pure Black:** Always use `on_surface` (#191c1e) for text to maintain a professional, soft-contrast look.
- **Don't Over-Round:** Stick to the `md` (0.75rem) or `lg` (1rem) for containers. `xl` (1.5rem) should be reserved for hero cards only. Avoid making the UI look "bubbly" or juvenile.

---
*Director's Note: This design system is not a kit—it is a philosophy of intentionality. Every pixel of white space should feel like it was placed there to let the user's data breathe.*```