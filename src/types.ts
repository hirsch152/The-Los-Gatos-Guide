/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PostContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export interface Post {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  teaser: string;
  contentBlocks: PostContentBlock[];
  content: string; // Plain-text fallback for posts without valid content blocks
  image: string; // URL mock or abstract icon identifier
  featured?: boolean;
  startTime?: string;
  endTime?: string;
  venue?: string;
  sourceUrl?: string;
}

export interface AdPackage {
  id: string;
  title: string;
  tagline: string;
  price: string;
  frequency: string;
  description: string;
  bullets: string[];
  iconName: "business" | "event" | "newsletter"; // Lucide icon lookup identifier
}

export interface CityConfig {
  cityName: string;
  stateName: string;
  newsletterName: string;
  tagline: string;
  subheadline: string;
  subscriberCountOffset: number; // For social proof (e.g., Join 2,450+ locals)
  accentColors: {
    bg: string;
    primary: string;
    dark: string;
    blush: string;
    text: string;
    muted: string;
    card: string;
    border: string;
    gold: string;
  };
}
