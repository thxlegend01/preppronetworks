# Architecture decisions

- Keep `/pw` as the stable, shareable entry point for the first-party PrepPro Physics Wallah experience so its upstream host can change without breaking public links.
- Keep Infinity metadata and card details in a shared catalog, with its independent `/PrepInfinity` collection and `/PrepInfinity/:appId` iframe viewer (legacy `/infinity` aliases retained); reuse the launch overlay while available iframes load behind it so presentation and availability stay consistent.