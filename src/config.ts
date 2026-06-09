/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, AdPackage, CityConfig } from "./types";

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
// 2. SAMPLE NEWSLETTER POSTS
// ==========================================
// To add, remove, or modify newsletter posts, edit this array.
export const latestPosts: Post[] = [
  {
    id: "weekend-guide-june",
    category: "Weekend Plans",
    title: "This Weekend in Los Gatos: Markets, Music, and Family Fun",
    date: "June 4, 2026",
    readTime: "4 min read",
    featured: true,
    teaser: "From the lively Town Plaza Sunday Farmers' Market to live acoustic runs on N. Santa Cruz Ave, here is your curated roadmap for a perfect, sun-drenched Cupertino foothills weekend.",
    content: `
      <p class="mb-4">With summer warmth finally settling into the foothills of the Santa Cruz Mountains, downtown Los Gatos is absolutely humming with energy. Whether you are a lifelong resident or planning a cozy Saturday day-trip, we've designed your ultimate weekend agenda.</p>
      
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday morning: Trail walk & Bread</h3>
      <p class="mb-4">Begin your morning early with a crisp walk along the <strong>Los Gatos Creek Trail</strong>. Start near the Main Street bridge and work your way up toward Vasona Lake County Park. The morning dew still hangs on the trees, and the temperature is crisp. On your way back, stop by <em>Manresa Bread</em> for their famous freshly laminated kouign-amann and a single-origin pour-over coffee. Pro-tip: the line moves quickly and is well worth the 10-minute wait!</p>

      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday afternoon: Boutique Hunting</h3>
      <p class="mb-4">Spent your midday checking out the beautiful local shops on N. Santa Cruz Ave. Pop into the local independent boutiques for unique home decor, elegant stationery, and curated apparel. You support local business owners and find one-of-a-kind home accents in the process.</p>

      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Sunday: Capital of Fresh Produce</h3>
      <p class="mb-4">The crown jewel of the weekend is the <strong>Los Gatos Farmers' Market on Town Plaza</strong> (9:00 AM – 1:00 PM). Grab some famous organic strawberries from Watsonville growers, locally crafted olive oils, artisanal cheeses, and beautiful fresh-cut flowers. Keep an eye out for local accordionists playing live near the water fountain!</p>
    `,
    image: "🌿",
  },
  {
    id: "five-restaurants",
    category: "Restaurant Finds",
    title: "5 Los Gatos Restaurants to Try This Month",
    date: "June 2, 2026",
    readTime: "5 min read",
    teaser: "From upscale Italian courtyards and dynamic wood-fired pizza joints to cozy neighborhood bistros, these local eateries deserve a spot on your dining rotation.",
    content: `
      <p class="mb-4">Our hillside town boasts one of the richest culinary landscapes in the entire South Bay. This month, we're highlighting five stellar neighborhood venues that bring together delicious food, impeccable service, and that signature warm, classy Los Gatos atmosphere.</p>
      
      <div class="space-y-6 mt-4">
        <div>
          <h4 class="font-serif font-bold text-brand-text">1. The Patio Secret: Campo di Bocce</h4>
          <p class="text-brand-muted text-sm">Perfect for active family gatherings. Grab a plate of freshly made polenta fritta or a Neapolitan pizza, lease a court, and enjoy a breezy game of bocce under the shade trees.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">2. Elegant Comforts: Dio Deka</h4>
          <p class="text-brand-muted text-sm">Fine Hellenic dining at its best. Nestled inside the Hotel Los Gatos, their mesquite-grilled octopus and premium lamb chops offer a transportive Mediterranean evening with beautiful interior design.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">3. Morning Ritual: Los Gatos Cafe</h4>
          <p class="text-brand-muted text-sm">A staple for a reason. Head over for mountain-sized portions of cinnamon roll French toast or their classic California Benedict with fresh avocado and hollandaise.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">4. Woodfired Magic: Oak & Rye</h4>
          <p class="text-brand-muted text-sm">Incredibly creative, seasonal sourdough pizzas paired with a masterclass craft cocktail selection. Order the 'Scotty Pippen' pizza if you love hot honey and spicy salami.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">5. Parisian Corner: Fleur de Cocoa</h4>
          <p class="text-brand-muted text-sm">Need a mid-afternoon escape? Step into this authentic French patisserie for exquisite chocolate mousse cakes, savory crepes, and gorgeous hand-crafted macarons.</p>
        </div>
      </div>
    `,
    image: "🍷",
  },
  {
    id: "free-events",
    category: "Local events",
    title: "Free and Low-Cost Events Around Town",
    date: "May 30, 2026",
    readTime: "3 min read",
    teaser: "Enjoying the best of our beautiful community doesn't have to bust the budget. Discover free museum afternoons, live outdoor music, and historical walks.",
    content: `
      <p class="mb-4">Community shouldn't have a high price tag. We compiled a list of the sweetest, budget-friendly ways to engage with Los Gatos culture, nature, and community this month.</p>
      
      <ul class="list-disc pl-5 space-y-3 text-brand-text mb-4">
        <li><strong>Art in the Park:</strong> Visit NUMU (New Museum Los Gatos) on their free community days first Sunday of the month. Great hands-on activities for children and beautiful historic design galleries.</li>
        <li><strong>History Walk:</strong> Take a self-guided architectural walking tour through the beautiful historic Glenridge and Almond Grove neighborhoods to admire 19th-century Victorian homes.</li>
        <li><strong>Outdoor Library Storytime:</strong> Every Wednesday morning, the Los Gatos Public Library hosts read-aloud sessions on the grass lawn just outside the Civic Center.</li>
        <li><strong>Sunset at Vasona Park:</strong> Fill a thermos with home-brewed tea, pack a picnic blanket, and watch the sailing boats on the reservoir as the sun drops behind the coastal redwoods. Parking is free if you walk or bike in!</li>
      </ul>
    `,
    image: "🎟️",
  },
  {
    id: "shopping-guide",
    category: "Boutiques",
    title: "Downtown Los Gatos Shopping Guide",
    date: "May 27, 2026",
    readTime: "4 min read",
    teaser: "A curated crawl through Santa Cruz Avenue's finest small shops. Find high-quality home goods, premium stationery, artisan gifts, and independent bookstores.",
    content: `
      <p class="mb-4">Online shopping is convenient, but nothing matches the tactile delight of walking into a downtown shop run by a neighbor who hand-selects every beautiful item on the shelves.</p>
      
      <p class="mb-4 font-bold">Must-Visit Boutiques this Season:</p>
      <div class="space-y-4">
        <p><strong>The Village Shop Code:</strong> Wonderful curated tables showing off specialty local pottery, kitchen textiles, and bespoke host gifts. The fragrance inside is always amazing.</p>
        <p><strong>Town & Country Bookshop:</strong> A cozy independent bookstore classic. Friendly staff review cards, deep selections of fiction, and a quiet kid's corner with comfortable armchairs.</p>
        <p><strong>Fitted Foothills:</strong> High-end, sustainable apparel designed for active California living—from soft bamboo activewear to stylish leather weekenders.</p>
      </div>
    `,
    image: "🛍️",
  },
  {
    id: "business-spotlight",
    category: "Local Spotlight",
    title: "Local Spotlight: A Small Business Worth Knowing",
    date: "May 24, 2026",
    readTime: "3 min read",
    teaser: "Meet the husband-and-wife duo behind our favorite local garden boutique, bringing rare native California plants and beautiful terracotta craft to town.",
    content: `
      <p class="mb-4">This week, we sat down with Sarah and David, the creative visionaries behind <em>Foothill Flora</em>, located on the historic edge of Main Street.</p>
      
      <p class="mb-4">Started in 2021 as a backyard propagation project, Foothill Flora has grown into a beloved sanctuary for plant lovers, offering workshops on drought-tolerant gardening, beautiful custom pottery, and California native plant styling.</p>
      
      <blockquote class="border-l-4 border-brand-primary pl-4 italic my-4 text-brand-dark font-medium">
        "We wanted to build a space that feels like step-entering a friendly greenhouse. People don't just buy a fiddle-leaf fig here; they learn how to help it thrive in our coastal-adjacent climate."
      </blockquote>
      
      <p class="mb-4">They also host cozy community workshops on Saturday afternoons covering terrarium building, floral crown mockups, and winter pruning. Stop by, say hi, and pick up a beautiful potted succulent for your windowsill!</p>
    `,
    image: "🪴",
  },
  {
    id: "parent-guide",
    category: "Family Ideas",
    title: "The Family Weekend Guide",
    date: "May 20, 2026",
    readTime: "4 min read",
    teaser: "Keep the children active and inspired! Playgrounds, carousels, steam trains, feed ducks, and the top kid-approved treat stops around Los Gatos.",
    content: `
      <p class="mb-4">Weekend family time is precious, but planning activities that entertain both toddlers and parents can feel like a riddle. This guide outlines the perfect family day in Los Gatos.</p>
      
      <h4 class="font-serif font-bold text-brand-primary mt-4 mb-2">Stage 1: Ride the Billy Jones Wildcat Railroad</h4>
      <p class="mb-4">Head over to Oak Meadow Park and buy tickets for the beloved 10-inch gauge miniature steam train. It has operated in our town since 1970! For just a couple of dollars, riders of all ages can rumble through the park and over the scenic Los Gatos Creek bridge. Follow it up with a spin on the historic 1915 Carousel.</p>
      
      <h4 class="font-serif font-bold text-brand-primary mt-4 mb-2">Stage 2: Play at Oak Meadow Playground</h4>
      <p class="mb-4">Let the kids burn off energy on the massive climbing structures and the decommissioned USAF T-33 jet airplane, which has been a staple centerpiece of childhood memories in Los Gatos for generations.</p>
      
      <h4 class="font-serif font-bold text-brand-primary mt-4 mb-2">Stage 3: Cool Off with Local Ice Cream</h4>
      <p class="mb-4">Finish your family day with a walk to <em>Dolce Spazio Gelato</em> on Santa Cruz Avenue. Grab a scoop of fresh Pistachio or Blackberry Sorbet, take a seat on their warm street-front patio, and plan your next weekend adventure.</p>
    `,
    image: "🚂",
  },
];

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
