# Architecture decisions

- Keep `/pw` as the stable, shareable entry point for the first-party PrepPro Physics Wallah experience so its upstream host can change without breaking public links.
- Keep Infinity app metadata in a shared catalog and launch `/infinity/:appId` through one seamless viewer so branding, availability and launch timing remain consistent.