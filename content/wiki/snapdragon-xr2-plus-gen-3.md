---
title: "Qualcomm Snapdragon XR2+ Gen 3"
slug: snapdragon-xr2-plus-gen-3
date: "2026-04-26"
lastVerified: "2026-04-26"
type: wiki
wikiCategory: technology
tags: [Hardware, Chipset, Qualcomm]
image: android-xr-show-header-web.jpg
description: "The next-generation spatial computing platform from Qualcomm, specifically optimized for Android XR glasses and headsets launching in H2 2026."
lede: "The <strong class=\"text-xr-text-1\">Snapdragon XR2+ Gen 3</strong> is Qualcomm's flagship silicon for the 2026–2027 XR generation. Building on the success of the Gen 2 chip found in the Samsung Galaxy XR, the Gen 3 introduces significant improvements in NPU performance for Gemini AI, power efficiency for lightweight glasses, and support for dual 4K Micro-OLED displays at 120Hz."
searchTags: [Qualcomm, Snapdragon XR2+ Gen 3, chipset, processor, specs]
schemaType: TechArticle
compareWith:
  - text: "Snapdragon XR2+ Gen 2"
    url: "/wiki/samsung-galaxy-xr/"
  - text: "Apple R2 Chip"
    url: "/wiki/compare/"
relatedWikiLinks:
  - text: "Android XR Platform"
    url: "/wiki/android-xr-platform/"
  - text: "Raxium MicroLED"
    url: "/wiki/raxium-microled/"
relatedNews:
  - url: /news/samsung-android-xr-glasses-2026/
    tag: Breaking
    title: "Samsung Confirms H2 2026 Launch with New Silicon"
---

## Overview

The Snapdragon XR2+ Gen 3 (SM8750-XR) was announced by Qualcomm in late 2025 as the dedicated silicon platform for the "Android XR era." It is the first chip from Qualcomm to feature hardware-level acceleration for the specific kernels used in Android XR's spatial compositor.

Compared to its predecessor, the Gen 3 offers a **30% increase in CPU performance** and a **50% boost in AI processing capabilities**, specifically tuned for large language models like Google Gemini.

## Key Specifications

<div class="bg-xr-surface border border-xr-border rounded-xl my-6 overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-xr-bg-2 border-b border-xr-border">
      <tr>
        <th class="px-4 py-2 text-left font-semibold">Feature</th>
        <th class="px-4 py-2 text-left font-semibold">Specification</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-xr-border">
      <tr><td class="px-4 py-2">Process Node</td><td class="px-4 py-2">TSMC 3nm (N3P)</td></tr>
      <tr><td class="px-4 py-2">AI Engine</td><td class="px-4 py-2">Hexagon NPU with 45 TOPS</td></tr>
      <tr><td class="px-4 py-2">GPU</td><td class="px-4 py-2">Adreno 800-series (Ray-tracing enabled)</td></tr>
      <tr><td class="px-4 py-2">Display Support</td><td class="px-4 py-2">Dual 4K per eye @ 120Hz / 10-bit HDR</td></tr>
      <tr><td class="px-4 py-2">Camera Support</td><td class="px-4 py-2">Up to 12 concurrent camera streams</td></tr>
      <tr><td class="px-4 py-2">Connectivity</td><td class="px-4 py-2">Wi-Fi 7, Bluetooth 5.4, Snapdragon Sound</td></tr>
      <tr><td class="px-4 py-2">Latency</td><td class="px-4 py-2">&lt; 10ms for color passthrough</td></tr>
    </tbody>
  </table>
</div>

## Architecture & AI Optimization

The core of the XR2+ Gen 3 is the new Hexagon NPU, which is designed to run "Always-on" visual perception models with minimal power drain. This is critical for Android XR glasses, which must continuously process the 12MP camera feed to provide Gemini-powered overlays without overheating.

**Qualcomm worked directly with Google** to optimize the NPU's scheduler for Gemini Nano, allowing for sub-200ms response times for visual queries.

## Power Efficiency for All-Day Wear

One of the primary goals for the Gen 3 chip was to enable display-equipped AR glasses that weigh under 60 grams. By leveraging the 3nm process and new power-gating techniques, the chip consumes 25% less power than the Gen 2 during standard AR tasks like navigation and notification display.

## Confirmed Devices

The following devices are confirmed or strongly rumored to be utilizing the Snapdragon XR2+ Gen 3:
- **Samsung Android XR Glasses** (Confirmed for H2 2026)
- **Warby Parker "Signature" Series** (Rumored)
- **Google "Aura" Reference Design** (Confirmed)
- **XREAL Project Aura** (TBC)

## Competitive Landscape

The XR2+ Gen 3 is positioned as the direct competitor to Apple's M3/R2 silicon found in the Vision Pro lineup and Meta's rumored custom silicon for their upcoming "Orion" glasses. With its focus on the Android XR ecosystem, Qualcomm has prioritized integration with Google's spatial services over raw compute power.
