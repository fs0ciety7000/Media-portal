# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Lightweight Node.js HTTP server serving HTML/CSS/JS in Docker on Coolify. Jellyfin authenticates portal logins; the server keeps short-lived session tokens in memory and serves the dashboard only to authenticated members.

## Users

Assumption from the brief: the owner and invited household members who need a quick home-screen entry point to the media services.

## Product Purpose

A private home media portal that makes Plex, Jellyfin, Jellyseerr, and related tools easy to reach. Success means a visitor can identify and open the right service in one glance.

## Positioning

A branded entry point for the Phant0mhex media environment, bringing streaming and library discovery services together.

## Operating Context

Used in a browser on household screens, including television-sized displays. The portal links to separately hosted services at `vision.phantomhex.cc`, `jf.phantomhex.cc`, and `scout.phantomhex.cc`.

## Capabilities and Constraints

The portal requires a Jellyfin account before showing the dashboard. Sign-in is checked by Jellyfin's `Users/AuthenticateByName` endpoint; credentials are not stored by the portal, and no admin API key is needed for member authentication. Sessions are in memory and expire after 12 hours. Service links continue to open independently. Jellyfin receives a companion custom CSS theme. Portal deployment is intended for Coolify at `portal.phantomhex.cc`, in Docker. Wizarr is a separate Coolify deployment at `lock.phantomhex.cc`.

## Brand Commitments

The name is “L'antre de Phant0mhex”. The requested identity combines a ghost with hacking motifs. The requested design direction is modern, performant, industrial, and media-oriented, with a living-room television use case.

## Evidence on Hand

Only the service names and hostnames in the brief are confirmed. No media catalog, status API endpoints, or operating statistics have been supplied; any demonstration widget data must be clearly identified as illustrative.

## Product Principles

- Make the main media services immediately recognizable and reachable.
- Keep service availability claims honest until live health checks are configured.
- Preserve legibility on both desktop and television-sized screens.
- Keep the portal lightweight and easy to deploy.
