# Comestro Academy — Frontend Architecture & Design System Guidelines

Platform: Modern online coding education SaaS for developers and learners.
Design Philosophy: **Learn → Code → Practice → Build → Track → Improve**

## Core Constraints (STRICT)
1. **Never change the home page** (`http://localhost:8000/` or `resources/js/Pages/Welcome.jsx`).
2. **Admin & Instructor panel remain unified / unchanged in structure.**
3. **Never change application logic**: Treat all props, state, event handlers, route names, API contracts, IDs, permissions, and database models as immutable contracts. Change presentation, not behavior.

---

## 1. Core Design Principles
- Clean, minimal, professional, developer-oriented, enterprise-quality, compact, accessible, responsive, consistent, fast, scalable.
- Avoid unnecessary visual decoration.
- Priority: **Content → Hierarchy → Action → Feedback**.
- Avoid decorative gradients and heavy shadows.

---

## 2. Brand & Semantic Color Tokens
### Light theme (Default)
- `--accent`: `#4F46E5` (Indigo 600)
- `--bg`: `#F8FAFC` (Slate 50)
- `--surface`: `#FFFFFF`
- `--surface-muted`: `#F1F5F9` (Slate 100)
- `--border`: `#E2E8F0` (Slate 200)
- `--text-heading`: `#0F172A` (Slate 900)
- `--text-body`: `#334155` (Slate 700)
- `--text-muted`: `#64748B` (Slate 500)
- `--sidebar-bg`: `#0F172A` (Slate 900)

### Dark surfaces (where appropriate: code editors, terminals, video player overlays)
- `--dark-surface`: `#1E293B` (Slate 800)
- `--dark-bg`: `#0F172A` (Slate 900)
- `--dark-border`: `#334155` (Slate 700)
- `--dark-text`: `#F8FAFC`
- `--dark-muted`: `#94A3B8`

### Semantic Status Colors (strictly contextual, never decorative)
- Success → Emerald (`#10B981` / `text-emerald-600 bg-emerald-50 border-emerald-200`)
- Warning → Amber (`#F59E0B` / `text-amber-600 bg-amber-50 border-amber-200`)
- Danger → Rose (`#F43F5E` / `text-rose-600 bg-rose-50 border-rose-200`)
- Info → Sky (`#0EA5E9` / `text-sky-600 bg-sky-50 border-sky-200`)
- Live → Rose/Red (subtle pulse only when genuinely live)

---

## 3. Shadows & Surface Separation
- **No heavy shadows**: Avoid `shadow-lg`, `shadow-xl`, `shadow-2xl` for standard card surfaces.
- Prefer explicit borders: `border border-slate-200 dark:border-slate-800` with `shadow-2xs` or `shadow-xs`.
- **No heavy gradients**: Avoid `bg-gradient-*` for standard application surfaces. Prefer clean solid surfaces (`bg-white`, `bg-slate-50`, `bg-slate-100`).

---

## 4. Geometry & Border Radius
- **Cards / Modals**: `rounded-lg`
- **Inputs / Buttons / Selects / Badges**: `rounded-md`
- **Avatars / Circular Status**: `rounded-full`
- Avoid excessive radii (`rounded-3xl`, `rounded-[30px]`).
- Outer cards must use `rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800`.
- Avoid unnecessary card-in-card nesting; use background/surface hierarchy instead.

---

## 5. Form Inputs & Controls
- Every input, textarea, and select must have an explicit border:
  `border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition`
- Clear labels, consistent height, accessible focus state.
- Validation errors must appear directly beneath the relevant field (`<InputError message={...} className="mt-1" />`).

---

## 6. Typography
- Primary font: Inter / Roboto / System Sans.
- Major titles: `font-bold text-slate-900 dark:text-white`.
- Section headings: `font-semibold text-slate-800 dark:text-slate-200`.
- Supporting info: `text-sm text-slate-600 dark:text-slate-400`.
- Monospace font (`font-mono`): Strictly for code, terminal, tech tags, and technical metadata. Never for general prose.

---

## 7. Application Shell & Navigation
- Desktop Sidebar: 256px fixed or collapsible to 72px.
- TopBar: `h-16 sticky top-0 z-30 bg-surface border-b border-slate-200 dark:border-slate-800`.
  - Contextual back button only on detail/create/edit/nested learning pages (not everywhere).
- Role-aware navigation:
  - Student, Instructor, and Admin have distinct, tailored navigation matching existing routes.
- Mobile bottom navigation: role-aware, compact, touch-friendly.

---

## 8. Lists, Tables & Cards
- List page structure:
  1. Page title + description/context.
  2. Search + filters toolbar (`SearchBar` component).
  3. Content list/table/grid.
- Tables:
  - Desktop: border, compact rows (`py-2.5` or `py-3`), subtle hover (`hover:bg-slate-50/60 dark:hover:bg-slate-800/50`).
  - Mobile: clean responsive cards or structured horizontal scrolling.
- Course cards:
  - Thumbnail, Title, Instructor, Tech tags, Level, Progress bar, Lesson completion count, Continue action. Keep compact.

---

## 9. Learning & Video UI
- Course Structure: Course → Module → Lesson → Video/Resources.
- Visual lesson states: Completed, Current, Not Started, Locked.
- Video player page layout:
  - Primary video area with adjacent/drawer course content curriculum tree.
  - Clear progress indication (e.g. `12:42 / 18:30`, `% completed`).
  - Never break existing player playback or progress-saving callbacks.

---

## 10. Live Classes & Recordings
- Live Now: `🔴 LIVE NOW` (subtle pulse only for live state).
- Upcoming: Date & Time scheduled.
- Completed: `Recording available` linking to the recording player.

---

## 11. Coding-Specific UI
- Code editor / terminal / tech badges / Git links:
  - High-contrast, clean, dark-mode terminal surfaces (`bg-slate-900 text-slate-100 font-mono`).
  - Keep professional and developer-centric; avoid gaming/hacker neon aesthetics.

---

## 12. Component & DOM Quality
- Clean DOM without redundant wrappers.
- Micro-interactions: `transition-all duration-150 ease-in-out` for hover, focus, tabs.
- Accessibility: visible focus outlines, keyboard navigation, accessible labels, aria tags on icon-only buttons.
- Performance: lightweight, avoid huge images, avoid unnecessary re-renders.
