# Architecture decisions

- Keep `/pw` as the stable, shareable entry point for the first-party PrepPro Physics Wallah experience so its upstream host can change without breaking public links.
- Keep Infinity metadata and card details in a shared catalog, with a dedicated `/PrepInfinity` collection page and immediate iframe viewer at `/PrepInfinity/:appId` (legacy `/infinity` aliases retained), so app availability and presentation stay consistent without duplicate launch animations.