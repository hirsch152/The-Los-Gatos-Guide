/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Compass, ShieldCheck, MailOpen, Calendar, HelpCircle, Utensils } from "lucide-react";

interface HeroProps {
  onSubscribeClick: () => void;
  onAdvertiseClick: () => void;
  tagline: string;
  subheadline: string;
  subscriberCountOffset: number;
  newsletterName: string;
}

export default function Hero({
  onSubscribeClick,
  onAdvertiseClick,
  tagline,
  subheadline,
  subscriberCountOffset,
  newsletterName
}: HeroProps) {
  // Active demo state for interactive mock newsletter preview card
  const [activeTab, setActiveTab] = useState<"events" | "eats" | "family">("events");
  const isLosGatosTagline = tagline === "Your weekly guide to Los Gatos.";

  const tabs = [
    { id: "events", label: "🎨 Local Weekend", icon: Calendar },
    { id: "eats", label: "🍷 Dining Finds", icon: Utensils },
    { id: "family", label: "🚂 Family Guide", icon: Compass },
  ] as const;

  const mockPreviews = {
    events: {
      date: "This Thursday Issue • Vol. 14",
      title: "Weekly Town Plaza Farmers' Market & Evening Concert Highlights",
      tag: "Weekend Plans",
      content: "Explore gorgeous local heirloom crops, fresh jams, and listen to gorgeous live acoustic sets near the central town plaza fountain. Full schedules inside!",
      badge: "6,000+ Reading",
      time: "9:00 AM – 1:00 PM Sunday",
    },
    eats: {
      date: "This Thursday Issue • Vol. 14",
      title: "Al-Fresco Dining: Top Warm Courtyards & Patio Secrets Revealed",
      tag: "Restaurant Finds",
      content: "Searching for perfect shade-grown lunch spaces? Experience beautiful lemon groves, olive gardens, and brick wood-fired ovens near you.",
      badge: "Local Critic Choice",
      time: "Curated Dining Guide",
    },
    family: {
      date: "This Thursday Issue • Vol. 14",
      title: "Billy Jones Steam Train: Returning Schedule & Ticket Secrets",
      tag: "Family Ideas",
      content: "A quick guide on riding the historic miniature train through beautiful scenic green parks. Best times to avoid long school lines with little children.",
      badge: "Highly Popular",
      time: "10:30 AM – 4:30 PM",
    },
  };

  const preview = mockPreviews[activeTab];

  return (
    <section id="hero-section" className="relative pt-6 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blush/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-12 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Foothill backdrop simulation in SVG */}
      <div className="absolute right-0 bottom-0 w-full opacity-[0.04] -z-10 text-brand-primary pointer-events-none hidden lg:block">
        <svg viewBox="0 0 1440 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 160L80 149.3C160 139 320 117 480 128C640 139 800 181 960 176C1120 171 1280 117 1360 90.7L1440 64V240H1360C1280 240 1120 240 960 240C800 240 640 240 480 240C320 240 160 240 80 240H0V160Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              <Sparkles className="w-3.5 h-3.5" id="hero-sparkle" /> <span>The #1 Local Newsletter Network</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-5xl 2xl:text-6xl font-serif font-extrabold tracking-tight text-brand-dark leading-[1.08]"
              aria-label={tagline}
            >
              {isLosGatosTagline ? (
                <>
                  <span className="block">Your weekly guide to</span>
                  <span className="block">
                    <span className="whitespace-nowrap">Los Gatos.</span>
                  </span>
                </>
              ) : (
                tagline
              )}
            </h1>

            <p className="text-brand-muted text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              {subheadline}
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onSubscribeClick}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-dark hover:scale-[1.01] active:scale-[0.99] text-white rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
                id="hero-primary-cta"
              >
                <span>Subscribe Free</span>
                <ArrowRight className="w-5 h-5 text-brand-blush transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={onAdvertiseClick}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-brand-bg hover:scale-[1.01] active:scale-[0.99] border border-brand-border text-brand-dark rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
                id="hero-secondary-cta"
              >
                Advertise with Us
              </button>
            </div>

            {/* Mini Trust Signals */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-4 text-xs text-brand-muted font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold" id="trusted-sec" /> Spam-free Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <MailOpen className="w-4 h-4 text-brand-primary" id="weekly-inbound" /> One email every Thursday at 6am
              </span>
              <span>Join {subscriberCountOffset.toLocaleString()}+ reader accounts</span>
            </div>
          </div>

          {/* Right Interactive Mockup Newsletter Column */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="relative" id="interactive-card-wrapper">
              
              {/* Highlight backdrop accent */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-primary via-[#C89B3C] to-brand-blush rounded-2xl opacity-10 blur-md" />
              
              {/* Card Container */}
              <div className="relative bg-white border border-brand-border rounded-2xl shadow-md overflow-hidden">
                
                {/* Header Mock Banner */}
                <div className="bg-brand-dark px-4 py-3 flex items-center justify-between border-b border-brand-border/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-[10px] text-white/50 font-mono ml-1.5">Weekly Insider Issue preview</span>
                  </div>
                  <span className="text-[10px] bg-brand-gold/25 text-[#FFF8F3] px-2 py-0.5 rounded-full font-serif font-semibold">
                    {newsletterName}
                  </span>
                </div>

                {/* Simulated Email Body Container */}
                <div className="p-5 sm:p-6 space-y-4 bg-brand-bg/15">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C89B3C] font-semibold bg-brand-bg px-2 py-1 rounded border border-brand-border/40">
                      {preview.tag}
                    </span>
                    <span className="text-[11px] text-brand-muted font-medium">{preview.date}</span>
                  </div>

                  <div className="space-y-2 min-h-[140px] flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-brand-text tracking-tight leading-snug">
                        {preview.title}
                      </h3>
                      <p className="text-brand-muted text-xs leading-relaxed font-sans">
                        {preview.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-border/40 flex items-center justify-between">
                      <span className="text-[10px] font-semibold bg-brand-blush/30 px-2.5 py-0.75 rounded-full text-brand-primary">
                        {preview.badge}
                      </span>
                      <span className="text-[10px] text-brand-muted font-medium italic">
                        {preview.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Tabs Toggles for dynamic newsletter preview */}
                <div className="border-t border-brand-border flex bg-white" id="hero-tab-cluster">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-center border-b-2 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? "border-brand-primary text-brand-primary bg-brand-bg/20" 
                            : "border-transparent text-brand-muted hover:text-brand-text hover:bg-brand-bg/10"
                        }`}
                        id={`hero-tab-${tab.id}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Float badge */}
              <div className="absolute -bottom-5 -right-3 bg-[#C89B3C] text-[#FFF8F3] px-3.5 py-2 rounded-xl text-xs font-bold font-serif shadow-md rotate-3 flex items-center gap-1 select-none pointer-events-none">
                <span>Free forever</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
