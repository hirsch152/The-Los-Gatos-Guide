/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdPackage, CityConfig } from "./types";

// ==========================================
// 1. CITY & NEWSLETTER CONFIGURATION
// ==========================================
// To change the city or newsletter naming, update these values.
export const cityConfig: CityConfig = {
  cityName: "Los Gatos",
  stateName: "California",
  newsletterName: "The Los Gatos Guide",
  tagline: "Your weekly guide to what’s happening in Los Gatos.",
  subheadline: "Local events, restaurants, weekend ideas, family activities, and community highlights, delivered to your inbox.",
  subscriberCountOffset: 2450, // Displayed as "Join 2,450+ local subscribers"
  accentColors: {
    // Note: These colors are also configured in /src/index.css under the Tailwind @theme.
    // If you modify these, also update /src/index.css to keep class utilities and custom icons consistent!
    bg: "#F3F9F5",
    primary: "#2C5E43",
    dark: "#153020",
    blush: "#C1E4CE",
    text: "#1E2E24",
    muted: "#5B7063",
    card: "#FFFFFF",
    border: "#D1E5D8",
    gold: "#C89B3C",
  },
};

// ==========================================
// 3. ADVERTISING & SPONSORSHIP PACKAGES
// ==========================================
// To change pricing or options, update this array.
export const adPackages: AdPackage[] = [
  {
    id: "pkg-local-business",
    title: "Featured Local Business",
    tagline: "Perfect for local shops, cafes, and boutiques.",
    price: "$149",
    frequency: "per week",
    description: "Get highlighted in our dedicated 'Local Spotlight' section blocks in a weekly newsletter.",
    bullets: [
      "Custom business overview (100 words)",
      "High-contrast link to your website/social",
      "Featured photo or logo branding",
      "Included in 1 post on our active Instagram",
    ],
    iconName: "business",
  },
  {
    id: "pkg-sponsored-event",
    title: "Sponsored Event Placement",
    tagline: "Perfect for wineries, schools, realtors, and promoters.",
    price: "$199",
    frequency: "per event",
    description: "Feature your upcoming event at the very top of our popular weekly Weekend Guide.",
    bullets: [
      "Top-tier placement in our 'Weekend Plans'",
      "Direct 'Buy Tickets/RSVP' call-to-action button",
      "Shared with over 2,450+ active local inboxes",
      "Inclusion in weekly local calendar summaries",
    ],
    iconName: "event",
  },
  {
    id: "pkg-weekly-sponsor",
    title: "Weekly Newsletter Sponsor",
    tagline: "Ultimate reach for realtors, clinics, and brands.",
    price: "$399",
    frequency: "per issue",
    description: "Own the entire issue of The Los Gatos Guide. Includes premium co-branding in email header space.",
    bullets: [
      "Exclusive 'Presented By' header with your slogan",
      "Premium text block + logo at center top",
      "Dedicated paragraph explaining your services",
      "Sole sponsor rights - no other ads in that issue",
    ],
    iconName: "newsletter",
  },
];
