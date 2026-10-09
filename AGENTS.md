# Architecture decisions

- Keep `/pw` as the stable, shareable entry point for the first-party PrepPro Physics Wallah experience so its upstream host can change without breaking public links.
- Keep Infinity metadata and card details in a shared catalog, with its independent `/PrepInfinity` collection and `/PrepInfinity/:appId` iframe viewer (legacy `/infinity` aliases retained); reuse the launch overlay while available iframes load behind it so presentation and availability stay consistent.
- Use catalog-controlled opaque first-party header overlays for embedded portals requiring branded header covers; cross-origin iframe contents cannot be edited, so the cover stays outside the iframe.