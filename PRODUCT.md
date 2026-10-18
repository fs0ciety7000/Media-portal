# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS, served by a small Docker image for Coolify. The user selected this stack; the dashboard primarily links to external media services.

## Users

Assumption from the brief: the owner and invited household members who need a quick home-screen entry point to the media services.

## Product Purpose

A private home media portal that makes Plex, Jellyfin, Jellyseerr, and related tools easy to reach. Success means a visitor can identify and open the right service in one glance.

## Positioning

A branded entry point for the Phant0mhex media environment, bringing streaming and library discovery services together.

## Operating Context

Used in a browser on household screens, including television-sized displays. The portal links to separately hosted services at `vision.phantomhex.cc`, `jf.phantomhex.cc`, and `scout.phantomhex.cc`.

## Capabilities and Constraints

The initial surface is a dashboard of service links and useful widgets. Jellyfin receives a companion custom CSS theme. Portal deployment is intended for Coolify at `portal.phantomhex.cc`, in Docker. Wizarr is intended for a separate Coolify deployment at `lock.phantomhex.cc`. Connectivity, service health, and authentication are not confirmed; do not present them as live facts.

## Brand Commitments

The name is “L'antre de Phant0mhex”. The requested identity combines a ghost with hacking motifs. The requested design direction is modern, performant, industrial, and media-oriented, with a living-room television use case.

## Evidence on Hand

Only the service names and hostnames in the brief are confirmed. No media catalog, status API endpoints, or operating statistics have been supplied; any demonstration widget data must be clearly identified as illustrative.

## Product Principles

- Make the main media services immediately recognizable and reachable.
- Keep service availability claims honest until live health checks are configured.
- Preserve legibility on both desktop and television-sized screens.
- Keep the portal lightweight and easy to deploy.
