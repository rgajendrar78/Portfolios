# Portfolio

A one-page portfolio built with Next.js 16 (App Router), React 19, TypeScript
and Tailwind CSS v4. Every page is static, so it deploys anywhere.

## Edit one file

Everything on the site comes from **`src/config/portfolio.ts`**: name, links,
email, colours, projects, skills, experience, the page title and the social
preview image.

1. Change `person`, `links` and `site` to your own details.
2. Replace the entries marked `SAMPLE` with your own projects and roles
   before you publish.
3. Put your resume at `public/resume.pdf` (or change `person.resumeUrl`).

Every list can grow. Add a project, a skill, a whole skill group, a role, a
principle or an AI step and the layout makes room: grids re-flow, the
experience chart scrolls sideways, the principles loop re-spaces its steps.

Useful fields:

- Section titles: wrap a phrase in `*asterisks*` to set it in italics.
- `hero.intro`: `*phrase*` highlights it; `*one|two|three*` rotates between them.
- `icon` picks an illustration and `tone` a colour; the allowed names are in
  `src/types/portfolio.ts`.
- `hero.trace`: the request diagram under the hero, one entry per project.
- `work.projects[].caseStudy`: the panel that opens when a card is clicked.
- `stack.groups[].side`: `build` sits left of the showcase, `run` right of it.
- `theme`: light and dark colours, and the default mode.

## Structure

```
src/
  app/            routes, metadata, robots, sitemap; globals.css imports the styles
  config/         portfolio.ts, the only file you edit for content
  styles/         the design system
    tokens.css      colours, type sizes, animations, per-theme values
    base.css        element defaults
    utilities.css   shell, card, label, heading, link, hatch, dots
    motion.css      keyframes, entrance and timer utilities, reduced motion
    components.css  card hover, scroll reveal, case-study panel
  components/
    ui/           primitives: icon, pill, section, button, tones
    layout/       header, footer, theme toggle
    motion/       scroll reveal, smooth scrolling
    sections/     one folder per section of the page
  hooks/          shared React hooks
  lib/            pure helpers
  types/          the config's types
```

A new section goes in `components/sections/<name>/` and is added to
`app/page.tsx`. Anything used by two sections moves to `components/ui`,
`hooks` or `lib`.

## Motion

Add `reveal` to an element to fade it in on scroll and `card-hover` to deepen
its shadow under the pointer; set `--d` in `style` to stagger. Self-playing
blocks carry `autoplay`, so they rest while off screen, and use the `clock`
utility as their timer, so they hold while hovered. Everything stops for
visitors who ask their system for reduced motion.

## Run

```bash
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve the build
pnpm lint
```

## Deploy

Push the folder to GitHub and import it in Vercel; no settings are needed. Set
`site.url` to the final address so link previews, `robots.txt` and the sitemap
point to the right place.
