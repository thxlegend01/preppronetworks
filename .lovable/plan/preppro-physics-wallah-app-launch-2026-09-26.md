# PrepPro Physics Wallah app launch

## What will be added
- Add a large featured “PrepPro Network — Physics Wallah” experience at the top of Study Apps, with the PW logo, useful overview, key learning areas, and a clear launch action.
- Give it a dedicated shareable route: `https://preppronetworks.lovable.app/pw`.
- Open the supplied PW website fully inside PrepPro Network with no visible wrapper, header, border, or external-link controls.
- Show a polished 3–4 second PW-branded launch sequence while the embedded site begins loading behind it.
- When someone selects another Physics Wallah portal, show a recommendation offering “Use PrepPro PW App” first and “Use Other Portal” second.
- Keep every existing app and resource available.

## Technical details
- Register the new PW app as the first featured Study App and allowlist `preppronetworks.pearlspark.xyz` for safe embedding.
- Add `/pw` as an app-specific route that launches the seamless viewer directly and remains refresh-safe through the existing site routing setup.
- Reuse the existing PW logo and design tokens; extend the launch animation with a configurable 3.5-second duration rather than changing launch timing for every app.
- Route old PW choices through one shared recommendation dialog so the behavior is consistent across Physics Wallah, Physics Wallah 2, and Physics Wallah 3.
- Verify the Study Apps screen, recommendation choices, direct `/pw` link, iframe visibility, and mobile layout.
