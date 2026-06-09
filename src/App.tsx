/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, Compass, MapPin, Sparkles, Plus, AlertCircle, ArrowRight, Heart } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialStrip from "./components/SocialStrip";
import NewsletterPosts from "./components/NewsletterPosts";
import SignupForm from "./components/SignupForm";
import Advertise from "./components/Advertise";
import Footer from "./components/Footer";
import { latestPosts } from "./config";
import { collection, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebaseConfig";

// Interface for different cities in our newsletter network
interface NetworkCity {
  id: string;
  name: string;
  state: string;
  status: "active" | "coming_soon";
  launchDate?: string;
  tagline: string;
  subheadline: string;
  subscriberCountOffset: number;
  colors?: {
    primary: string;
    bgStyle: string;
    borderStyle: string;
    textComfort: string;
  };
}

const STATIC_CITY_MUTED_TEMPLATES = {
  "los-gatos": "#5B7063",
  "saratoga": "#6B625C",
  "campbell": "#7D6758",
  "monte-sereno": "#52677A"
};

const DEFAULT_NETWORK_CITIES: NetworkCity[] = [
  {
    id: "los-gatos",
    name: "Los Gatos",
    state: "CA",
    status: "active",
    tagline: "Your weekly guide to Los Gatos and the West Valley.",
    subheadline: "Local events, restaurants, weekend ideas, family activities, and community highlights from Los Gatos, Saratoga, Campbell, and Monte Sereno, delivered to your inbox.",
    subscriberCountOffset: 4250,
    colors: {
      primary: "#2C5E43",
      bgStyle: "bg-[#F3F9F5]",
      borderStyle: "border-[#D1E5D8]",
      textComfort: "text-[#1E2E24]"
    }
  },
  {
    id: "saratoga",
    name: "Saratoga",
    state: "CA",
    status: "active",
    launchDate: "July 2026",
    tagline: "Your weekly roadmap to Saratoga wine walks, arts, & luxury dining.",
    subheadline: "Curated weekend guides, local boutique wineries, Hakone gardens event updates, and neighborhood highlights.",
    subscriberCountOffset: 1200,
    colors: {
      primary: "#8B1E3F",
      bgStyle: "bg-[#FFF8F3]",
      borderStyle: "border-[#E7D8D0]",
      textComfort: "text-[#262626]"
    }
  },
  {
    id: "campbell",
    name: "Campbell",
    state: "CA",
    status: "active",
    launchDate: "August 2026",
    tagline: "Get the best of historic downtown Campbell, brews, & local street markets.",
    subheadline: "Every week we highlight top street festivals, local coffee shops, Pruneyard shopping trends, and active family spots.",
    subscriberCountOffset: 850,
    colors: {
      primary: "#C36B27",
      bgStyle: "bg-[#FCF7F2]",
      borderStyle: "border-[#F1DFD0]",
      textComfort: "text-[#2A1D15]"
    }
  },
  {
    id: "monte-sereno",
    name: "Monte Sereno",
    state: "CA",
    status: "active",
    launchDate: "September 2026",
    tagline: "Cozy neighborhood chronicles for Monte Sereno residents.",
    subheadline: "Exclusive hillside community updates, walking events, library gatherings, and historic mountain-side perspectives.",
    subscriberCountOffset: 410,
    colors: {
      primary: "#204060",
      bgStyle: "bg-[#F3F7FA]",
      borderStyle: "border-[#DBE5ED]",
      textComfort: "text-[#142330]"
    }
  }
];

// Complete set of authentic mock articles to seed if the articles collection is empty
const SEED_ARTICLES = [
  // --- Los Gatos ---
  {
    id: "lg-weekend",
    cityId: "los-gatos",
    category: "Weekend Plans",
    title: "This Weekend in Los Gatos: Markets, Music, and Family Fun",
    date: "June 4, 2026",
    readTime: "4 min read",
    featured: true,
    teaser: "From the lively Town Plaza Sunday Farmers' Market to live acoustic runs on N. Santa Cruz Ave, here is your curated roadmap for a perfect, sun-drenched Cupertino foothills weekend.",
    content: `
      <p class="mb-4">With summer warmth finally settling into the foothills of the Santa Cruz Mountains, downtown Los Gatos is absolutely humming with energy. Whether you are a lifelong resident or planning a cozy Saturday day-trip, we've designed your ultimate weekend agenda.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday morning: Trail walk & Bread</h3>
      <p class="mb-4">Begin your morning early with a crisp walk along the <strong>Los Gatos Creek Trail</strong>. Start near the Main Street bridge and work your way up toward Vasona Lake County Park. On your way back, stop by <em>Manresa Bread</em> for their famous freshly laminated kouign-amann and a single-origin pour-over coffee. Pro-tip: the line moves quickly and is well worth the 10-minute wait!</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday afternoon: Boutique Hunting</h3>
      <p class="mb-4">Spent your midday checking out the beautiful local shops on N. Santa Cruz Ave. Pop into the local independent boutiques for unique home decor, elegant stationery, and curated apparel. You support local business owners and find one-of-a-kind home accents in the process.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Sunday: Capital of Fresh Produce</h3>
      <p class="mb-4">The crown jewel of the weekend is the <strong>Los Gatos Farmers' Market on Town Plaza</strong> (9:00 AM – 1:00 PM). Grab some famous organic strawberries from Watsonville growers, locally crafted olive oils, artisanal cheeses, and beautiful fresh-cut flowers.</p>
    `,
    image: "🌿"
  },
  {
    id: "lg-dine",
    cityId: "los-gatos",
    category: "Restaurant Finds",
    title: "5 Los Gatos Restaurants to Try This Month",
    date: "June 2, 2026",
    readTime: "5 min read",
    featured: false,
    teaser: "From upscale Italian courtyards and dynamic wood-fired pizza joints to cozy neighborhood bistros, these local eateries deserve a spot on your dining rotation.",
    content: `
      <p class="mb-4">Our hillside town boasts one of the richest culinary landscapes in the entire South Bay. This month, we're highlighting neighborhood venues that bring together delicious food, impeccable service, and that signature warm, classy Los Gatos atmosphere.</p>
      <div class="space-y-4">
        <div>
          <h4 class="font-serif font-bold text-brand-text">1. The Patio Secret: Campo di Bocce</h4>
          <p class="text-brand-muted text-sm">Perfect for active family gatherings. Grab a plate of freshly made polenta fritta or a Neapolitan pizza, lease a court, and enjoy a breezy game of bocce.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">2. Elegant Comforts: Dio Deka</h4>
          <p class="text-brand-muted text-sm">Fine Hellenic dining at its best. Nestled inside the Hotel Los Gatos, their mesquite-grilled octopus offers a transportive Mediterranean evening.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">3. Woodfired Magic: Oak & Rye</h4>
          <p class="text-brand-muted text-sm">Incredibly creative, seasonal sourdough pizzas paired with a masterclass craft cocktail selection.</p>
        </div>
      </div>
    `,
    image: "🍷"
  },
  {
    id: "lg-events",
    cityId: "los-gatos",
    category: "Local events",
    title: "Free and Low-Cost Events Around Town",
    date: "May 30, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Enjoying the best of our beautiful community doesn't have to bust the budget. Discover free museum afternoons, live outdoor music, and historical walks.",
    content: `
      <p class="mb-4">Community shouldn't have a high price tag. We compiled a list of the sweetest, budget-friendly ways to engage with Los Gatos culture, nature, and community this month.</p>
      <ul class="list-disc pl-5 space-y-3 text-brand-text mb-4">
        <li><strong>Art in the Park:</strong> Visit NUMU (New Museum Los Gatos) on their free community days first Sunday of the month. Great hands-on activities for children.</li>
        <li><strong>History Walk:</strong> Take a self-guided architectural walking tour through the beautiful historic Glenridge and Almond Grove neighborhoods.</li>
        <li><strong>Sunset at Vasona Park:</strong> Fill a thermos with home-brewed tea, pack a picnic blanket, and watch the sailing boats on the reservoir as the sun drops behind the coastal redwoods.</li>
      </ul>
    `,
    image: "🎟️"
  },
  {
    id: "lg-spotlight",
    cityId: "los-gatos",
    category: "Local Spotlight",
    title: "Local Spotlight: A Small Business Worth Knowing",
    date: "May 24, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Meet the husband-and-wife duo behind our favorite local garden boutique, bringing rare native California plants and beautiful terracotta craft to town.",
    content: `
      <p class="mb-4">This week, we sat down with Sarah and David, the creative visionaries behind <em>Foothill Flora</em>, located on the historic edge of Main Street.</p>
      <blockquote class="border-l-4 border-brand-primary pl-4 italic my-4 text-brand-dark font-medium">
        "We wanted to build a space that feels like step-entering a friendly greenhouse. People don't just buy a fiddle-leaf fig here; they learn how to help it thrive."
      </blockquote>
      <p class="mb-4">They also host cozy community workshops on Saturday afternoons covering terrarium building, floral crown mockups, and winter pruning. Stop by, say hi, and pick up a beautiful potted succulent!</p>
    `,
    image: "🪴"
  },

  // --- Saratoga ---
  {
    id: "st-weekend",
    cityId: "saratoga",
    category: "Weekend Plans",
    title: "A Perfect Saratoga Weekend: Hakone Gardens & Historic Wine Tasting",
    date: "June 4, 2026",
    readTime: "4 min read",
    featured: true,
    teaser: "Walk through tranquil Japanese koi ponds, sip old-vine chardonnay in the historic village foothills, and dine under fairy-light canopies.",
    content: `
      <p class="mb-4">Nestled at the base of the Santa Cruz Mountains, Saratoga combines sleepy historic charm, pristine nature, and world-class wine-growing pedigree. Spend this weekend discovering why it's the valley's ultimate relaxing retreat.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday morning: Serenity at Hakone Gardens</h3>
      <p class="mb-4">Arrive at Hakone Estate and Gardens (18 acres of authentic Japanese gardens) right when it opens. Stroll past quiet water basins, watch the iridescent koi fish circle beneath stone bridges, and view beautiful historic tea houses. It’s an unbeatable way to restore mental calm.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Saturday afternoon: Village Wine Walk</h3>
      <p class="mb-4">After a casual lunch along Big Basin Way, walk over to the historic village tasting rooms. Saratoga features prestigious hillside wineries. Indulge in crisp chardonnays and deep cabernets while enjoying live acoustic guitar and warm mountain breezes.</p>
    `,
    image: "🌿"
  },
  {
    id: "st-dine",
    cityId: "saratoga",
    category: "Restaurant Finds",
    title: "The 4 Can't-Miss Saratoga Dining Spots This Season",
    date: "June 2, 2026",
    readTime: "4 min read",
    featured: false,
    teaser: "From premium French bistro classics on Big Basin Way to fresh garden-style Mediterranean courtyards, Saratoga's culinary scene is in full bloom.",
    content: `
      <p class="mb-4">Saratoga Village is a food lover's paradise. If you are planning a special date night or a leisurely family dinner, these local mainstays are guaranteed to impress.</p>
      <div class="space-y-4 mt-4">
        <div>
          <h4 class="font-serif font-bold text-brand-text">1. French Accents: La Fondue</h4>
          <p class="text-brand-muted text-sm">A theatrical dining classic. Indulge in spectacular cheese and dessert fondues in an eclectic setting perfect for celebrating milestones.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">2. Fireside Comforts: The Plumed Horse</h4>
          <p class="text-brand-muted text-sm">Michelin-starred elegance. Experience contemporary Californian cuisine with an legendary multi-story wine cellar and impeccable fine service.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">3. Mediterranean Oasis: Scent of Basil</h4>
          <p class="text-brand-muted text-sm">A cozy local gem focusing on wood-fired lamb chops, direct Greek herbs, and generous pasta plates on an outdoor patio.</p>
        </div>
      </div>
    `,
    image: "🍷"
  },
  {
    id: "st-events",
    cityId: "saratoga",
    category: "Local events",
    title: "Summer Concerts and Arts Around Saratoga Village",
    date: "May 30, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Saratoga holds rich artistic traditions. Check out community outdoor theater, live jazz, and the legendary courtyard concert lineups.",
    content: `
      <p class="mb-4">Culture thrives in Saratoga! We have collected the most exciting, accessible ways to appreciate Saratoga's arts, theater, and history this season.</p>
      <ul class="list-disc pl-5 space-y-3 text-brand-text mb-4">
        <li><strong>Montalvo Arts Center:</strong> Hike of the beautiful Redwood trails and explore the historic Italianate Villa. Pack a small picnic and read books on the sprawling front lawn for a free, gorgeous afternoon.</li>
        <li><strong>Village Jazz Nights:</strong> Local musicians play sweet tunes on Big Basin Way street-corners every Friday night starting at 6:00 PM.</li>
        <li><strong>Historic Adobe Tour:</strong> Check out the Saratoga Historical Museum's free walking guides to explore the old pioneer schoolhouse.</li>
      </ul>
    `,
    image: "🎟️"
  },
  {
    id: "st-spotlight",
    cityId: "saratoga",
    category: "Local Spotlight",
    title: "Saratoga Boutique Spotlight: Bella Rosa Flowers",
    date: "May 25, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Meet the floral artists designing custom, luxurious, European-style bouquets inside the historic Saratoga Village plaza.",
    content: `
      <p class="mb-4">This week we sat down with Elena, the founder of Bella Rosa Flowers, who has been importing and arranging rare heirloom roses for Saratoga residents for over fifteen years.</p>
      <blockquote class="border-l-4 border-brand-primary pl-4 italic my-4 text-brand-dark font-medium">
        "Our business is about translating human feelings into gorgeous visual displays. Whether it is an intimate garden party or a simple thank-you bouquet, every stem counts."
      </blockquote>
      <p class="mb-4">Bella Rosa also hosts monthly floral design classes with local champagne poured. Drop in next month to learn how to create your own gorgeous summer table centers!</p>
    `,
    image: "🌹"
  },

  // --- Campbell ---
  {
    id: "cb-weekend",
    cityId: "campbell",
    category: "Weekend Plans",
    title: "Saturdays in Downtown Campbell: Markets, Vintage Shops, and Brews",
    date: "June 4, 2026",
    readTime: "4 min read",
    featured: true,
    teaser: "Explore historic East Campbell avenue, dive into treasures at local vintage markets, and sample the finest craft double IPAs.",
    content: `
      <p class="mb-4">With its vibrant downtown historical district and historic water tower landmark, Campbell is one of the most energetic communities in the West Valley. This is your guide to Campbell's perfect Saturday.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Morning: Sourdough and Historic Coffee</h3>
      <p class="mb-4">Start your day on Orchard City Drive at the local coffee collective. Grab a pastry and hot double espresso, and admire the beautiful historic Campbell High School brick architectural design.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Afternoon: Collectibles and Vinyl Records</h3>
      <p class="mb-4">Downtown Campbell is packed with cozy antique stores and historic boutiques. Spend hours flipping through vintage vinyl, retro toys, and handmade leather bags. Pick up a unique nostalgic keepsake today!</p>
    `,
    image: "🌿"
  },
  {
    id: "cb-dine",
    cityId: "campbell",
    category: "Restaurant Finds",
    title: "Campbell's Top 4 Gastropubs and Brunch Spots",
    date: "June 2, 2026",
    readTime: "5 min read",
    featured: false,
    teaser: "Downtown Campbell is famous for its dynamic dining and craft brews. Here are our favorite places for brunch or late night woodfired bites.",
    content: `
      <p class="mb-4">From early morning mimosa brunches to cozy candlelit gastropub booths, Campbell boasts an incredibly social food and beer culture.</p>
      <div class="space-y-4 mt-4">
        <div>
          <h4 class="font-serif font-bold text-brand-text">1. Tapas Heaven: Orchard City Kitchen</h4>
          <p class="text-brand-muted text-sm">Michelin Bib Gourmand selection. Try their legendary triple-cooked bacon or garlic shoestring fries alongside a refreshing draft cocktail.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">2. Craft Sips: Campbell Brewing Company</h4>
          <p class="text-brand-muted text-sm">A downtown staple with active outdoor beer gardens. Enjoy house-brewed blonde ales, soft warm pretzels, and live weekend bands.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">3. Brunch Classic: Stack's</h4>
          <p class="text-brand-muted text-sm">Slightly retro, incredibly friendly breakfast hotspot. Known for giant platters of fresh berry pancakes and fluffy four-egg omelets.</p>
        </div>
      </div>
    `,
    image: "🍷"
  },
  {
    id: "cb-events",
    cityId: "campbell",
    category: "Local events",
    title: "Campbell Farmers Market & Downtown Festivals",
    date: "May 30, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "The legendary Campbell Sunday Farmers Market is the ultimate local gathering. Plus, prepare for the upcoming historic street festivals!",
    content: `
      <p class="mb-4">Campbell holds some of the largest active street events in the Silicon Valley area. Here is how to plan your visits.</p>
      <ul class="list-disc pl-5 space-y-3 text-brand-text mb-4">
        <li><strong>Sunday Farmers Market:</strong> Voted one of the best in the South Bay. Spanned across East Campbell Ave every Sunday (9:00 AM - 1:00 PM) featuring great live bands, local honey, and fresh roasted almonds.</li>
        <li><strong>Mid-Week Music Series:</strong> Free acoustic bands play on the Pruneyard shopping center lawn on warm Thursday evenings. Good family picnic option!</li>
      </ul>
    `,
    image: "🎟️"
  },
  {
    id: "cb-spotlight",
    cityId: "campbell",
    category: "Local Spotlight",
    title: "Campbell Spotlight: The Retro Collectibles Shop",
    date: "May 22, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Step into an incredible treasure trove of nostalgia, comic books, vintage record players, and 80s arcade gaming.",
    content: `
      <p class="mb-4">We stopped by <em>Retro Roots</em> on basic Campbell Ave to interview Mike, who has been archiving and curating historical physical toys and electronics for over twenty-five years.</p>
      <blockquote class="border-l-4 border-brand-primary pl-4 italic my-4 text-brand-dark font-medium">
        "People come in to buy classic nostalgic memories. Seeing a grown adult light up when they find the exact original action figure they had at eight years old is our favorite thing."
      </blockquote>
      <p class="mb-4">Swing by on Sunday afternoons to play classic pinball machines for free or browse their extensive vintage rock and pop collection!</p>
    `,
    image: "🕹️"
  },

  // --- Monte Sereno ---
  {
    id: "ms-weekend",
    cityId: "monte-sereno",
    category: "Weekend Plans",
    title: "A Quiet Weekend in Monte Sereno: Mountain Hikes and Forest Strolls",
    date: "June 4, 2026",
    readTime: "3 min read",
    featured: true,
    teaser: "Monte Sereno offers a peaceful escape with winding wooded lanes, beautiful hillside parks, and breathtaking views of the Cupertino foothills.",
    content: `
      <p class="mb-4">Monte Sereno is a peaceful residential gem, nestled gracefully against the foothills. Enjoy a quiet, nature-focused weekend away from the city bustle.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Morning: Hillside Walk & Forest Bathing</h3>
      <p class="mb-4">Plan a walk winding up through the tranquil, tree-lined residential estates. Witness the beautiful heritage oak trees and enjoy vistas overlooking the entire bay. Follow the paths bordering El Sereno Open Space for active foothill climbs.</p>
      <h3 class="text-lg font-serif font-semibold text-brand-primary mt-6 mb-2">Afternoon: Cozy reading on the lawn</h3>
      <p class="mb-4">Head over to the serene local parks or coordinate with neighbors for a stroll down to the quiet mountain creeks. Take a book, grab a thermal cup of hot chai, and breathe deep.</p>
    `,
    image: "🌿"
  },
  {
    id: "ms-dine",
    cityId: "monte-sereno",
    category: "Restaurant Finds",
    title: "Cozy Local Hangouts and Mountain Escapes",
    date: "June 2, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "While Monte Sereno is strictly residential, its direct proximity to boutique foothill retreats means cozy coffee runs and quiet mountain outlooks.",
    content: `
      <p class="mb-4">Enjoy the quiet mountain luxury of Monte Sereno with these direct-access coffee runs and dining alcoves located right at the edge of the city border.</p>
      <div class="space-y-4 mt-4">
        <div>
          <h4 class="font-serif font-bold text-brand-text">1. Scenic Sips: The Foothill Espresso Corner</h4>
          <p class="text-brand-muted text-sm">Quiet bistro table setting on the mountain pass. Stop by for artisan matcha lattes or organic muffins after a long morning hike.</p>
        </div>
        <div>
          <h4 class="font-serif font-bold text-brand-text">2. Fireside Dining: The Mountain Inn</h4>
          <p class="text-brand-muted text-sm">A legendary hillside dining room serving woodfired trout and cocktails flanking a giant stone hearth.</p>
        </div>
      </div>
    `,
    image: "🍷"
  },
  {
    id: "ms-events",
    cityId: "monte-sereno",
    category: "Local events",
    title: "Exploring the Hiking Trails of El Sereno Open Space",
    date: "May 30, 2026",
    readTime: "4 min read",
    featured: false,
    teaser: "Discover the spectacular trails winding through El Sereno Open Space, offering sweeping views of Lexington Reservoir and the Santa Clara Valley.",
    content: `
      <p class="mb-4">Breathe the fresh pine-scented air of the coastal ranges right in Monte Sereno's backyard. These hiking routes offer spectacular vistas and clean hillside trails.</p>
      <ul class="list-disc pl-5 space-y-3 text-brand-text mb-4">
        <li><strong>Overlook Trail:</strong> A moderate 3.4-mile climb that rewards hikers with spectacular 180-degree panoramic views of Saratoga and Cupertino.</li>
        <li><strong>Wildflower Walks:</strong> In late spring, the hillsides are covered with gorgeous golden poppies and native lupines. Perfect for quiet photography!</li>
      </ul>
    `,
    image: "🎟️"
  },
  {
    id: "ms-spotlight",
    cityId: "monte-sereno",
    category: "Local Spotlight",
    title: "Monte Sereno Heritage: Winding Lanes and Redwoods",
    date: "May 20, 2026",
    readTime: "3 min read",
    featured: false,
    teaser: "Deep dive into the unique architectural history and preservation efforts of Monte Sereno's signature mid-century hillside retreats.",
    content: `
      <p class="mb-4">Monte Sereno is home to several landmark homes designed by famous mid-century modern architects who sought to blend indoor living with spectacular forest surroundings.</p>
      <blockquote class="border-l-4 border-brand-primary pl-4 italic my-4 text-brand-dark font-medium">
        "We wanted to construct spaces that feel like an organic extension of the redwoods and stone ridges surrounding them."
      </blockquote>
      <p class="mb-4 font-sans">Today, local volunteer initiatives continue working to catalog and protect our native oak woodlands and ensure trails remain accessible.</p>
    `,
    image: "🌲"
  }
];

// Local colors assigner
const getAccentColorsForCity = (cityId: string) => {
  switch (cityId) {
    case "saratoga":
      return {
        primary: "#8B1E3F",
        bgStyle: "bg-[#FFF8F3]",
        borderStyle: "border-[#E7D8D0]",
        textComfort: "text-[#262626]"
      };
    case "campbell":
      return {
        primary: "#C36B27",
        bgStyle: "bg-[#FCF7F2]",
        borderStyle: "border-[#F1DFD0]",
        textComfort: "text-[#2A1D15]"
      };
    case "monte-sereno":
      return {
        primary: "#204060",
        bgStyle: "bg-[#F3F7FA]",
        borderStyle: "border-[#DBE5ED]",
        textComfort: "text-[#142330]"
      };
    case "los-gatos":
    default:
      return {
        primary: "#2C5E43",
        bgStyle: "bg-[#F3F9F5]",
        borderStyle: "border-[#D1E5D8]",
        textComfort: "text-[#1E2E24]"
      };
  }
};

export default function App() {
  const [cities, setCities] = useState<NetworkCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NetworkCity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [notificationEmail, setNotificationEmail] = useState("");
  const [joinedLaunchList, setJoinedLaunchList] = useState(false);
  const [loadingLaunch, setLoadingLaunch] = useState(false);

  // Synchronize layout & initialize dynamic list
  useEffect(() => {
    const bootstrapNetwork = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current cities
        const querySnapshot = await getDocs(collection(db, "cities"));
        let fetchedCities: NetworkCity[] = [];

        if (querySnapshot.empty) {
          console.log("No cities in Firestore. Auto-seeding default 4-city network roadmap...");
          
          for (const rawCity of DEFAULT_NETWORK_CITIES) {
            await setDoc(doc(db, "cities", rawCity.id), {
              id: rawCity.id,
              name: rawCity.name,
              state: rawCity.state,
              status: rawCity.status,
              launchDate: rawCity.launchDate || "",
              tagline: rawCity.tagline,
              subheadline: rawCity.subheadline,
              subscriberCountOffset: rawCity.subscriberCountOffset,
              colors: rawCity.colors || null
            });
            fetchedCities.push(rawCity);
          }
        } else {
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const localCopyDef = DEFAULT_NETWORK_CITIES.find(c => c.id === docSnap.id);
            fetchedCities.push({
              id: docSnap.id,
              name: data.name || "",
              state: data.state || "",
              status: data.status || "coming_soon",
              launchDate: data.launchDate || "",
              tagline: localCopyDef ? localCopyDef.tagline : (data.tagline || ""),
              subheadline: localCopyDef ? localCopyDef.subheadline : (data.subheadline || ""),
              subscriberCountOffset: data.subscriberCountOffset || 0,
              colors: data.colors || undefined
            });
          });

          // Async updates to Firestore to synchronize the remote DB values with code changes
          for (const rawCity of DEFAULT_NETWORK_CITIES) {
            setDoc(doc(db, "cities", rawCity.id), {
              tagline: rawCity.tagline,
              subheadline: rawCity.subheadline
            }, { merge: true }).catch(err => {
              console.error("Non-blocking DB sync warn:", err);
            });
          }
        }

        // Parallel or sequential check of articles
        const articlesSnapshot = await getDocs(collection(db, "articles"));
        if (articlesSnapshot.empty) {
          console.log("Seeding authentic articles for all 4 cities...");
          for (const article of SEED_ARTICLES) {
            await setDoc(doc(db, "articles", article.id), {
              cityId: article.cityId,
              category: article.category,
              title: article.title,
              date: article.date,
              readTime: article.readTime,
              teaser: article.teaser,
              content: article.content,
              image: article.image,
              featured: article.featured || false,
              createdAt: serverTimestamp()
            });
          }
          console.log("Articles successfully seeded!");
        }

        // Keep standard order so Los Gatos features first
        fetchedCities.sort((a, b) => {
          if (a.id === "los-gatos" && b.id !== "los-gatos") return -1;
          if (b.id === "los-gatos" && a.id !== "los-gatos") return 1;
          return a.name.localeCompare(b.name);
        });

        setCities(fetchedCities);
        
        // Load default starting selected item (first tries to resolve "los-gatos")
        const defaultCity = fetchedCities.find(c => c.id === "los-gatos") || fetchedCities[0];
        setSelectedCity(defaultCity);
      } catch (err: any) {
        console.error("Firestore bootstrap error:", err);
        try {
          handleFirestoreError(err, OperationType.GET, "cities");
        } catch (fError) {}
        setError("Unable to connect to the California Local Guide Network. Displaying clean offline fallback.");
        setCities(DEFAULT_NETWORK_CITIES);
        setSelectedCity(DEFAULT_NETWORK_CITIES[0]);
      } finally {
        setLoading(false);
      }
    };

    bootstrapNetwork();
  }, []);

  // Sync theme configurations dynamically based on the current active city
  useEffect(() => {
    if (!selectedCity) return;

    const root = document.documentElement;
    const colors = getAccentColorsForCity(selectedCity.id);
    const mutedColor = (STATIC_CITY_MUTED_TEMPLATES as any)[selectedCity.id] || "#6B625C";

    root.style.setProperty("--color-brand-bg", selectedCity.id === "los-gatos" ? "#F3F9F5" : selectedCity.id === "saratoga" ? "#FFF8F3" : selectedCity.id === "campbell" ? "#FCF7F2" : "#F3F7FA");
    root.style.setProperty("--color-brand-primary", colors.primary);
    root.style.setProperty("--color-brand-dark", selectedCity.id === "los-gatos" ? "#153020" : selectedCity.id === "saratoga" ? "#4A1026" : selectedCity.id === "campbell" ? "#6B350C" : "#0F2030");
    root.style.setProperty("--color-brand-blush", selectedCity.id === "los-gatos" ? "#C1E4CE" : selectedCity.id === "saratoga" ? "#F4C7D7" : selectedCity.id === "campbell" ? "#F8D7BE" : "#C7DBEB");
    root.style.setProperty("--color-brand-text", colors.textComfort);
    root.style.setProperty("--color-brand-muted", mutedColor);
    root.style.setProperty("--color-brand-card", "#FFFFFF");
    root.style.setProperty("--color-brand-border", selectedCity.id === "los-gatos" ? "#D1E5D8" : selectedCity.id === "saratoga" ? "#E7D8D0" : selectedCity.id === "campbell" ? "#F1DFD0" : "#DBE5ED");

    // Clean coming soon notify forms when changing towns
    setJoinedLaunchList(false);
    setNotificationEmail("");
  }, [selectedCity]);

  // Smooth scroll handler targeting component blocks
  const handleScrollToSegment = (sectionId: string) => {
    if (sectionId === "latest" || sectionId === "events" || sectionId === "eats") {
      const postsSegment = document.getElementById("posts-section");
      if (postsSegment) {
        postsSegment.scrollIntoView({ behavior: "smooth", block: "start" });
        
        if (sectionId === "events") {
          const eventsFilterBtn = document.getElementById("category-filter-local-events");
          if (eventsFilterBtn) eventsFilterBtn.click();
        } else if (sectionId === "eats") {
          const eatsFilterBtn = document.getElementById("category-filter-restaurant-find-all") || document.getElementById("category-filter-restaurant-finds");
          if (eatsFilterBtn) eatsFilterBtn.click();
        } else {
          const allFilterBtn = document.getElementById("category-filter-all");
          if (allFilterBtn) allFilterBtn.click();
        }
      }
    } else if (sectionId === "advertise") {
      const adSegment = document.getElementById("advertise-section");
      if (adSegment) {
        adSegment.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (sectionId === "hero") {
      const heroSegment = document.getElementById("hero-section");
      if (heroSegment) {
        heroSegment.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSubscribeFormScroll = () => {
    const signupBlock = document.getElementById("newsletter-signup-box");
    if (signupBlock) {
      signupBlock.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleLaunchListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail || !notificationEmail.includes("@") || !selectedCity) return;

    setLoadingLaunch(true);
    const subscriberId = notificationEmail.replace(/[^a-zA-Z0-9_\-]+/g, "_").toLowerCase();

    try {
      await setDoc(doc(db, "subscribers", subscriberId), {
        email: notificationEmail.trim(),
        cityId: selectedCity.id,
        createdAt: serverTimestamp(),
        interests: {
          events: true,
          eats: true,
          weekend: true,
          family: true,
          spotlight: true
        }
      });
      setJoinedLaunchList(true);
      localStorage.setItem(`network_launch_${selectedCity.id}`, notificationEmail);
    } catch (err: any) {
      console.error("Failed to commit launch notify request to Firestore:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `subscribers/${subscriberId}`);
      } catch (fError) {}
    } finally {
      setLoadingLaunch(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F9F5] flex items-center justify-center p-4" id="applet-bootstrap-loader">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#2C5E43]/20 border-t-[#2C5E43] rounded-full animate-spin mx-auto" />
          <h3 className="font-serif font-black text-xl text-[#153020]">California Local Guide Network</h3>
          <p className="text-xs text-[#5B7063] font-medium tracking-wide">Initializing database structures & styles...</p>
        </div>
      </div>
    );
  }

  // Active custom selected city configuration maps
  const activeCity = selectedCity || DEFAULT_NETWORK_CITIES[0];
  const newsletterName = `The ${activeCity.name} Guide`;

  return (
    <div className="min-h-screen bg-brand-bg transition-colors duration-500 font-sans" id="applet-master">
      
      {/* 1. NETWORK CONTROLLER HUB (TOP BAR BANNER) */}
      <div className="bg-[#0f0408] text-white py-2.5 px-4 border-b border-[#250a15]" id="network-bar-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2 text-slate-100">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse animate-none" />
            <span className="font-extrabold tracking-wider uppercase text-[11px] sm:text-xs text-white">California Local Guide Network</span>
          </div>

          {/* City Choice Switchers */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full">
            <span className="text-slate-200 font-bold text-[11px] shrink-0 hidden md:inline">Select local roadmaps:</span>
            {cities.map((city) => {
              const isActiveChoice = activeCity.id === city.id;
              const cityColors = getAccentColorsForCity(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  style={isActiveChoice ? { backgroundColor: cityColors.primary } : undefined}
                  className={`px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-extrabold tracking-wide transition-all duration-200 shrink-0 cursor-pointer shadow-sm ${
                    isActiveChoice
                      ? "text-white ring-2 ring-white/10"
                      : "bg-white/10 text-white/95 border border-white/20 hover:bg-white/25 hover:text-white"
                  }`}
                  id={`network-city-selector-${city.id}`}
                >
                  {city.name} <span className="ml-1 opacity-90">{city.status === "coming_soon" ? "⏱️" : "✓"}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <Navbar 
        onNavClick={handleScrollToSegment} 
        onSubscribeClick={handleSubscribeFormScroll} 
        cityName={activeCity.name}
        newsletterName={newsletterName}
      />

      {/* CONDITIONAL BODY CONTENT: ACTIVE CITY VS. COMING SOON CITIES */}
      <AnimatePresence mode="wait">
        {activeCity.status === "active" ? (
          
          <motion.div
            key="active-city-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3. HERO SECTION */}
            <Hero 
              onSubscribeClick={handleSubscribeFormScroll} 
              onAdvertiseClick={() => handleScrollToSegment("advertise")}
              tagline={activeCity.tagline}
              subheadline={activeCity.subheadline}
              subscriberCountOffset={activeCity.subscriberCountOffset}
              newsletterName={newsletterName}
            />

            {/* 4. KEY POSITIONING STRIP */}
            <SocialStrip />

            {/* 5. LATEST WEEKLY ARTICLES / PREVIEWS */}
            <NewsletterPosts 
              onSubscribeClick={handleSubscribeFormScroll} 
              selectedCityId={activeCity.id}
              newsletterName={newsletterName}
            />

            {/* 6. PRIMARY SIGNUP CALLOUT */}
            <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-none" id="primary-cta-group">
              <SignupForm 
                cityId={activeCity.id}
                cityName={activeCity.name}
                newsletterName={newsletterName}
                subscriberCountOffset={activeCity.subscriberCountOffset}
              />
            </section>

            {/* 7. ADVERTISE FOR MORE OPPORTUNITIES */}
            <Advertise 
              cityId={activeCity.id}
              cityName={activeCity.name}
              newsletterName={newsletterName}
            />
          </motion.div>

        ) : (
          
          /* COMING SOON LAYOUT FOR NETWORK EXPANSION */
          <motion.div
            key="coming-soon-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-16 sm:py-28 max-w-3xl mx-auto px-4 text-center space-y-8"
            id="coming-soon-segment"
          >
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary animate-pulse animate-none">
              <AlertCircle className="w-4 h-4" />
              <span>Launching in {activeCity.launchDate}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-brand-dark tracking-tight leading-tight">
                The {activeCity.name} Guide
              </h1>
              
              <h3 className="text-lg sm:text-xl font-serif italic text-brand-text/90 font-medium max-w-xl mx-auto">
                “{activeCity.tagline}”
              </h3>
              
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
                We are currently designing our native repeatable layout and curating the opening issues for <strong>{activeCity.name}, {activeCity.state}</strong>. Be among the very first to get local family activities, winery spotlights, and boutique guides as we hire our on-the-ground writing force.
              </p>
            </div>

            {/* Special Launch form */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-10 shadow-sm max-w-lg mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blush/20 rounded-full blur-2xl -z-10" />
              
              {!joinedLaunchList ? (
                <form onSubmit={handleLaunchListSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-brand-text">Early subscriber list for The {activeCity.name} Guide</p>
                    <p className="text-[11px] text-brand-muted">Submit your email address to lock in early VIP subscriber status and receive founding discount sponsor kits.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-brand-bg/50 border border-brand-border rounded-xl text-xs focus:outline-none"
                      id="launch-email-input"
                    />
                    
                    <button
                      type="submit"
                      disabled={loadingLaunch}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                    >
                      {loadingLaunch ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Notify Me At Launch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-black text-brand-dark text-base">You are officially on the early roster!</h4>
                  <p className="text-brand-muted text-xs max-w-sm mx-auto leading-relaxed">
                    Thank you for pledging your support for The {activeCity.name} Guide. We have logged your subscription (<span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{notificationEmail}</span>) and will send you our official grand-opening issue in {activeCity.launchDate}!
                  </p>
                </div>
              )}
            </div>

            {/* Reset / back home toggle */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setSelectedCity(cities[0]);
                }}
                className="text-xs text-brand-primary hover:text-brand-dark font-bold inline-flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <span>← Return to active The {cities[0].name} Guide Homepage</span>
              </button>
            </div>

          </motion.div>
          
        )}
      </AnimatePresence>

      {/* 8. FOOTER MAP SEGMENT */}
      <Footer 
        onNavClick={handleScrollToSegment} 
        onSubscribeClick={handleSubscribeFormScroll} 
        cityName={activeCity.name}
        newsletterName={newsletterName}
      />

    </div>
  );
}
