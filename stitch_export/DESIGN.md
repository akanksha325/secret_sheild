---
name: Obsidian Sentinel
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-precision, technical aesthetic tailored for elite security engineers, DevSecOps practitioners, and software architects. It prioritizes signal-to-noise ratio, extreme legibility of cryptographic artifacts (hashes, commit SHAs, entropy scores, raw credentials), and rapid situational triage.

The aesthetic blends **Modern Technical Minimalism** with **Atmospheric Devtool Ergonomics**:
- Deep, calibrated obsidian and slate surfaces that reduce ocular fatigue during prolonged incident investigations.
- Surgical, restrained accents of violet and indigo indicating scanner state, policy telemetry, and active scopes.
- Strict semantic color orchestration where vivid hues are exclusively reserved for state changes and threat triage: Emerald (Verified Clean / Remediation Complete), Amber (Medium Risk / High Entropy), Crimson (Active Exposure / Critical Breach), and Cyan (Telemetry / Static Analysis Metrics).
- Crisp 1px structural framing, dense data matrices, and strict alignment guidelines inspired by mission-critical developer environments.

## Colors

The palette operates in an absolute dark baseline to amplify contrast on syntax tokens, risk severities, and visual diffs without blooming.

### Core Tonal Scale
- **Canvas Base (`#0a0d14`):** Primary window backdrop and lowest surface tier.
- **Surface Layer 1 (`#0f172a`):** Sidebar shells, toolbars, and grouped navigation tiers.
- **Surface Layer 2 (`#131b2e`):** Interactive card backgrounds, table cell rows, and modal foundations.
- **Surface Hover (`#1e293b`):** State response for hovering interactive tabular rows and lists.
- **Structural Stroke (`#1e293b`):** Default hairline dividers and container bounds.
- **Accentuated Stroke (`#334155`):** Focused states, active tabs, and primary card perimeters.

### Semantic & Severity Scale
- **Critical / High Severity (`#ef4444`):** Unmasked API keys, private certificates, cleartext credentials, active runtime exposures.
- **Medium Risk / Warning (`#f59e0b`):** Suspected credentials, high-entropy tokens, deprecated hashing mechanisms.
- **Safe / Resolved (`#10b981`):** Verified revoked keys, whitelisted secrets, completed remediation tasks.
- **Info / Telemetry (`#06b6d4`):** Commit hashes, scan speeds, parser states, repository branches, and telemetry metrics.
- **Brand / Focus Accent (`#8b5cf6` & `#6366f1`):** Scanner triggers, selection states, active filters, primary calls to action.

## Typography

Typography enforces strict informational hierarchy between structural narrative text and machine data.

- **Proportional UI Typeface (Inter):** Applied across core application scaffolding, navigation labels, contextual metadata, documentation, and modal dialogues. Uses optical kerning with subtle negative tracking on medium-to-large headlines to retain tightness.
- **Monospaced Technical Typeface (JetBrains Mono):** Dedicated to cryptographic signatures, diff views, code snippets, git hashes, file paths, regex match targets, line/column markers, and micro risk tags. Ensures absolute character-width uniformity for tabular scanning.
- **Tabular Figures:** All numeric displays (entropy calculations, finding counters, scan timers) enforce `font-variant-numeric: tabular-nums` to eliminate layout jitter during live scanning streams.

## Layout & Spacing

The layout utilizes a fluid, highly structured desktop-first design with dense, modular control blocks suited for complex security dashboards.

### Grid & Density Rules
- **Desktop (>= 1280px):** 12-column layout or flexible 3-pane configuration (Repository Navigator [260px fixed], Finding Feed [fluid], Secret Context & Remediation Inspector [440px fixed]). Gutters fixed at `1rem` (16px), page edge margins at `1.5rem` (24px).
- **Tablet (768px - 1279px):** Inspector shifts to an off-canvas drawer; repository navigator collapses to an icon sidebar. Gutters adapt to `1rem`.
- **Mobile (< 768px):** Strict single-column stack with persistent bottom triage bar. Grid gutters drop to `0.75rem` (12px), edge margins to `1rem` (16px).
- **Component Spatial Rhythm:** Form fields, list items, and code lines prioritize vertical economy. Code blocks utilize a strict 20px line-height grid; list rows anchor to 36px (compact) or 44px (default) total height.

## Elevation & Depth

Visual depth is achieved through **Tonal Layering** and **Subtle Structural Strokes** rather than heavy blurred shadows.

- **Zero-Shadow Philosophy:** Primary cards, sidebars, and data rows sit directly on background layers differentiated strictly by fill tone (`#0a0d14` vs `#0f172a` vs `#131b2e`) and framed by 1px hairline strokes (`#1e293b`).
- **Floating Overlays (Dropdowns, Command Palette, Modals):**
  - **Surface:** Solid `#0f172a` with hairline border in `#334155`.
  - **Shadow:** Highly diffused, dark ambient shadow: `0 16px 36px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(51, 65, 85, 0.4)`.
- **Active Incident Highlighting:** High-severity findings employ an inner lateral edge highlight: `inset 2px 0 0 0 #ef4444`.
- **Backdrop Blurs:** Used exclusively for sticky control ribbons and scanning headers: `backdrop-filter: blur(12px)` over `rgba(10, 13, 20, 0.85)`.

## Shapes

The design system maintains a **Soft-Chiseled Industrial Profile** (`roundedness: 1`), conveying engineering rigor, density, and precision.

- **Standard Elements (0.25rem / 4px):** Buttons, text input fields, code chips, inline diff markers, dropdown items, micro status badges.
- **Containers & Panels (0.5rem / 8px):** Data tables, finding panels, commit inspectors, terminal blocks, modal sheets.
- **Pill Shapes (Full Rounding):** Strictly limited to numeric counter tags (e.g., `+12`, `99+`) and scanner running indicators.
- **Internal Nesting Formula:** Inner child radius equals outer container radius minus border/padding offset (typically 4px inside 8px panels) to eliminate corner dissonance.

## Components

### Buttons
- **Primary Action (Violent/Indigo):** Solid `#8b5cf6` fill, white medium text, `0.25rem` radius. Hover shifts to `#7c3aed`. Focus uses a 2px outer ring with `#8b5cf6` at 50% opacity and 2px offset.
- **Secondary / Ghost:** Fill transparent, hairline border in `#1e293b`, text in `#e2e8f0`. Hover switches background to `#131b2e` and border to `#334155`.
- **Destructive / Revoke:** Subtle crimson wash background (`rgba(239, 68, 68, 0.1)`), text in `#ef4444`, border `rgba(239, 68, 68, 0.25)`. Hover enhances background to `rgba(239, 68, 68, 0.2)`.

### Secret Finding Cards & Table Rows
- Framed in `#1e293b`, background `#131b2e`.
- Left-side indicator strip: 3px solid border tinted according to finding severity (Crimson, Amber, Cyan, Emerald).
- Header row hosts the exposed secret signature (JetBrains Mono, `#f87171` for redacted hashes like `ghp_••••••••••••x7Qa`), repository link, commit timestamp, and validation status.

### Status Badges & Micro-Pills
- Rendered using `label-sm` (10px uppercase JetBrains Mono).
- Semi-transparent background fills:
  - **Critical:** `rgba(239, 68, 68, 0.12)` fill, `#ef4444` border/text.
  - **Medium:** `rgba(245, 158, 11, 0.12)` fill, `#f59e0b` border/text.
  - **Safe / Validated:** `rgba(16, 185, 129, 0.12)` fill, `#10b981` border/text.
  - **Telemetry / Scan Info:** `rgba(6, 182, 212, 0.12)` fill, `#06b6d4` border/text.

### Code Diff & Git Blame Inspector
- Monospace block set to `#0a0d14` background with line numbers right-aligned in `#475569`.
- Added / Exposed lines: Soft red wash (`rgba(239, 68, 68, 0.08)`) with high-intensity text highlights around the matched regex capture.
- Remediated lines: Soft green wash (`rgba(16, 185, 129, 0.08)`).
- Blame author and commit SHA rendered at terminal end with copyable micro-action icons.

### Inputs & Search Filters
- Background `#0a0d14`, border `#1e293b`, text `#f8fafc`.
- Focused state transitions border to `#8b5cf6` without layout shift.
- Query inputs feature built-in shortcut glyphs (`⌘K`, `/`) styled with `label-sm` in `#64748b` on `#131b2e` pill mounts.

### Checkboxes & Radios
- Square 16px footprint with `0.125rem` (2px) radius.
- Background `#0a0d14`, border `#334155`.
- Selected state turns fill to `#8b5cf6` with crisp white checkmark icon.