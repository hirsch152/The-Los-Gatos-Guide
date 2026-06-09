/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar, Utensils, Compass, Footprints, Shield, Heart } from "lucide-react";
import { cityConfig } from "../config";

export default function SocialStrip() {
  const values = [
    {
      icon: Calendar,
      title: "Local events",
      desc: "Farmers' markets, outdoor concerts, winery tours, school forums, and art festivals.",
    },
    {
      icon: Utensils,
      title: "Restaurant finds",
      desc: "Delightful warm patio cafés, local small bakeries, and high-quality dining guides.",
    },
    {
      icon: Compass,
      title: "Weekend plans",
      desc: "Outdoor foothills scenic trail maps, historic neighborhood walks, and children's steam trains.",
    },
  ];

  return (
    <section id="positioning-strip" className="border-y border-brand-border/60 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:divide-x md:divide-brand-border/50">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-4 ${idx > 0 ? "md:pl-8" : ""}`}
                id={`social-strip-item-${idx}`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-blush/40 flex items-center justify-center text-brand-primary shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-[#262626] text-base leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-brand-muted text-xs sm:text-sm leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
