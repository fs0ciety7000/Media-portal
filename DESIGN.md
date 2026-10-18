---
name: Phant0mhex Media Portal
description: A private cinema console for the home's media services.
colors:
  primary: "#d2ff62"
  neutral-ink: "#101312"
  neutral-surface: "#171b19"
  neutral-raised: "#1d2320"
  neutral-line: "#2b322e"
  neutral-paper: "#f3f1e9"
  neutral-muted: "#a3aaa2"
  accent-cinema: "#ff8b4b"
  accent-library: "#7ab8ff"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(56px, 6.4vw, 88px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "29px"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "DM Sans, Avenir Next, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  small: "2px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  section: "34px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#151910"
    typography: "12px / 700"
    rounded: "{rounded.none}"
    padding: "0 17px"
    height: "45px"
  service-row:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-paper}"
    typography: "14px / 400"
    rounded: "{rounded.none}"
    padding: "0 7px 0 0"
    height: "77px"
  search-field:
    backgroundColor: "{colors.neutral-ink}"
    textColor: "{colors.neutral-paper}"
    typography: "14px / 400"
    rounded: "{rounded.none}"
    padding: "8px 0"
---

# Design System: Phant0mhex Media Portal

## Overview

**Creative North Star: "La console de projection privée"**

The interface treats a home media setup as a small cinema control room: a clear route to search, a recognizable list of playback services, and a compact invitation entry point. Its dark equipment-like surfaces frame warm, high-contrast type and a single electric lime control color. The hand-drawn ghost mark is the system's own recognizable signature.

Use the visual language to make service choice immediate on a television-sized screen while staying compact on phones. The illustrative television frame is drawn in CSS and SVG; the portal does not depend on catalog artwork, status APIs, or remote image assets. Both typefaces are self-hosted as WOFF2 files and distributed with their OFL license texts.

**Key Characteristics:**

- Near-black foundation with quiet tonal steps and fine structural borders.
- Condensed display type beside readable sans-serif body copy.
- Lime marks the main action and focus; service identity colors remain localized.
- Square, equipment-like controls; no ornamental blur or floating glass.

## Colors

The palette uses an almost-black chassis, warm off-white text, and Phant0mhex lime as the clear action signal.

### Primary
- **Phant0mhex Lime**: the primary action, keyboard focus, and logo signal.

### Secondary
- **Cinema Amber**: a local identifier for Plex.
- **Library Blue**: a local identifier for Jellyfin.

### Neutral
- **Chassis Ink**: the page and deepest equipment surface.
- **Panel Charcoal**: raised content bands and focused panels.
- **Control Graphite**: the elevated inset surface.
- **Projection Paper**: main text and high-contrast icon strokes.
- **Signal Gray**: secondary explanatory text and non-active navigation.
- **Structural Line**: dividers, control outlines, and service row boundaries.

**The One-Signal Rule.** Use lime for actions and active state. Keep amber and blue attached to their respective service identities.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow and sans-serif fallbacks)
**Body Font:** DM Sans (with Avenir Next and sans-serif fallbacks)
**Label Font:** Barlow Condensed (with sans-serif fallback)

**Character:** Condensed display lettering gives the page the upright proportion of a cinema title panel. DM Sans carries instructions and service descriptions without competing with the larger headings.

### Hierarchy
- **Display** (600, fluid 56–88px, 0.9 line-height): the first-screen statement.
- **Headline** (600, 29px, 1.1 line-height): service section headings.
- **Title** (600, 21–23px, 1 line-height): platform names and invitation heading.
- **Body** (400, 14px, 1.75 line-height): explanatory copy; shorter service descriptions use 12px.
- **Label** (600, 11px, compact tracking): short equipment metadata, never explanatory paragraphs.

**The Readable-Control Rule.** Keep action and instructional text at least 12px; reserve the 11px label size for brief metadata.

## Layout

On wide screens, a fixed 78px navigation rail sits beside a centered content field. The first section pairs copy and action on the left with a television-shaped brand panel on the right. Media destinations form a full-width, three-row list. The invitation panel and identity note share a lower band.

At 1050px, the invitation and identity note stack. A narrower tablet arrangement adjusts the hero between 790px and 721px. At 720px, navigation becomes a top bar and the hero becomes a single column. Service rows collapse from a five-column layout to four columns, keeping each destination's name and description visible. The content has 22px mobile side padding (16px below 390px); the spacing rhythm includes 8px, 12px, 16px, 22px, 28px, and 34px steps.

## Elevation & Depth

The interface is predominantly flat. Depth comes from adjacent charcoal values, one-pixel rules, and a real outline around the illustrated television bezel. Keep shadows out of resting service rows and panels; state changes use color rather than floating elevation.

## Shapes

The interface uses square corners for action controls, service rows, search, and content panels. Small rounded corners appear only on the lock silhouette. Borders are thin and low-contrast except for the lime focus ring and television outline.

## Components

### Buttons
- **Shape:** square corners (0px).
- **Primary:** lime background, dark text, 45px minimum height, and 17px horizontal padding.
- **Hover / Focus:** brighten on hover; use a visible two-pixel lime keyboard outline with offset.

### Cards / Containers
- **Corner Style:** square corners.
- **Background:** panel charcoal or control graphite against chassis ink.
- **Shadow Strategy:** flat tonal layering; no card shadows.
- **Border:** thin graphite lines for grouping.
- **Internal Padding:** at least 16px for text-bearing bordered panels.

### Inputs / Fields
- **Style:** transparent field on chassis ink with a bottom rule; no rounded shell.
- **Focus:** a clear lime outline.
- **Empty:** explain when no service matches the query.

### Navigation
- **Style:** fixed rail on desktop and horizontal rail on mobile. The current destination receives a short lime marker. The invitation link sits at the rail's far end.

### Service Rows
- **Structure:** one distinct service icon, number, service name, concise description, category label, and open affordance.
- **State:** subtle charcoal background on hover and lime open icon; preserve the row's position while hovering.
- **Responsive:** hide the category label on narrow screens but retain name and description.

## Do's and Don'ts

### Do:
- **Do** keep the three media destinations direct, distinct, and keyboard accessible.
- **Do** reserve lime for the main action, focus, and current state.
- **Do** label service status only when a real health check is connected.
- **Do** keep the theater illustration decorative and independent of remote media.

### Don't:
- **Don't** add fake catalog titles, playback progress, health status, or usage metrics.
- **Don't** add external artwork or blur-heavy effects to the portal's default view.
- **Don't** animate row dimensions; keep hover feedback within color and transform.
