# PrepPro Network October Relaunch

## Goal
Rebuild the public-facing homepage as a polished academic discovery experience inspired by the smoothness and clarity of vidyax.site, while preserving every existing resource, destination, account flow, and the exact tagline: **“Prep Like a Pro With PrepPro Network.”**

## Visual direction
- Use the selected **Professional Academic Slate** composition with a focused hero grid.
- Use **Sora** for headings and **Manrope** for body text.
- Light theme: soft pink accents, crisp white surfaces, gentle gray structure.
- Dark theme: near-black canvas, strong navy surfaces, restrained pink highlights.
- Reduce decorative gradients, oversized pills, emojis, and visual clutter; use tighter corners, clear hierarchy, and stable dimensions.

## Build
1. **Foundation and navigation**
   - Refresh semantic theme tokens, typography, shadows, and motion rules.
   - Redesign desktop and mobile navigation without changing its destinations or account controls.
2. **Front-page opening**
   - Build a professional hero with the unchanged tagline, explicit 100% free message, clear calls to action, trust indicators, and visible next content.
   - Place global search prominently in the opening experience.
3. **Promotion area**
   - Rework the rotating promotions into a stable editorial feature area with clear imagery, controls, progress, swipe support, pause-on-hover, and reduced-motion handling.
4. **Resource discovery**
   - Convert the oversized stacked resource cards into a focused responsive grid with ranked primary destinations and compact WhatsApp/Telegram access.
   - Keep every current resource and link intact, including Apps, Tests, PrepChat, Material, PrepBooks, Tracker, and Study Tools.
5. **Supporting sections**
   - Restyle partner marquee, benefits, audience, creator, final action, and footer into one consistent professional system.
   - Remove expired seasonal homepage banners from the current October presentation.
6. **Quality pass**
   - Verify navigation, search, promotions, theme switching, mobile bottom navigation, desktop layout, reduced motion, and visual stability on mobile and desktop.
   - Resolve any new build or browser errors before completion.

## Technical details
- Keep the redesign within existing React components and semantic design tokens.
- Preserve lazy-loaded routes, `/pw`, authentication behavior, resource data, and existing integrations.
- Use transform/opacity animation only for smooth performance and avoid content-driven layout shifts.
- Update the homepage metadata typo while retaining the exact brand tagline.
