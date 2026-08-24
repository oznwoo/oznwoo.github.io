# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Component Structure

Split UI by unit of meaning, not just by top-level page. When a component grows to contain several visually/functionally distinct sections (e.g. slides, steps, tabs, cards), extract each into its own file under a `slides/`, `steps/`, or similarly named subdirectory next to the parent component, and have the parent import and compose them. Don't let one file accumulate multiple sections as inline JSX just because it's convenient in the moment — split as you add each new section, not in a single deferred cleanup pass.

- Target 200-400 lines per component file; 800 lines is a hard ceiling that should trigger an immediate split, not a later one.
- When two sections share most of their structure (e.g. two card-grid slides that only differ in image dimensions or copy), extract the shared shape into one parameterized component instead of duplicating it.
- Prefer prop-driven, single-responsibility components over one large component branching on `isMobile`/section index inline — each extracted piece should still take its own `isMobile` (or similar) prop and lay itself out, rather than the parent computing per-section classNames.
- Example: `src/components/project-detail/ProjectDetailView.tsx` orchestrates hooks, the slide track, and navigation; each slide (`OverviewSlide`, `AboutSlide`, `ProblemSlide`, `SolutionSlide`, `OutcomeSlide`, `StackSlide`) lives in `src/components/project-detail/slides/`, with `ProblemSlide`/`SolutionSlide` both wrapping a shared `CardGridSlide`. Follow this pattern for any future multi-section view.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
