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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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

  const [notificationEmail, setNotificationEmail] = useState("");
  const [joinedLaunchList, setJoinedLaunchList] = useState(false);
  const [loadingLaunch, setLoadingLaunch] = useState(false);

  // Initialize city navigation from local configuration. Loading the site should not write to Firebase.
  useEffect(() => {
    const sortedCities = [...DEFAULT_NETWORK_CITIES].sort((a, b) => {
      if (a.id === "los-gatos" && b.id !== "los-gatos") return -1;
      if (b.id === "los-gatos" && a.id !== "los-gatos") return 1;
      return a.name.localeCompare(b.name);
    });
    setCities(sortedCities);
    setSelectedCity(sortedCities.find(c => c.id === "los-gatos") || sortedCities[0]);
    setLoading(false);
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
          const eventsFilterBtn = document.getElementById("category-filter-events");
          if (eventsFilterBtn) eventsFilterBtn.click();
        } else if (sectionId === "eats") {
          const eatsFilterBtn = document.getElementById("category-filter-eats");
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
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-end gap-2.5">
          
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
