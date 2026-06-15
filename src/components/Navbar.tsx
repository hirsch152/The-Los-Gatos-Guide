/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Landmark, Calendar, UtensilsCrossed, Newspaper } from "lucide-react";

interface NavbarProps {
  onNavClick: (section: string) => void;
  onSubscribeClick: () => void;
  cityName: string;
  newsletterName: string;
}

export default function Navbar({ onNavClick, onSubscribeClick, cityName, newsletterName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Eats", id: "eats", icon: UtensilsCrossed },
    { label: "Events", id: "events", icon: Calendar },
    { label: "Local Updates", id: "local-updates", icon: Newspaper },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onNavClick(id);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border/60 transition-all pt-3.5 md:pt-4.5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-[96px] md:h-[128px]">
          
          {/* Logo on Left */}
          <div 
            onClick={() => handleLinkClick("hero")}
            className="flex items-center cursor-pointer group"
            id="brand-logo-container"
          >
            <img 
              src="/lgg-logo.png" 
              alt="The Los Gatos Guide"
              onError={(e) => {
                // If the custom asset is missing, fail over to a beautifully designed mock logo gracefully
                e.currentTarget.style.display = "none";
                const fallbackElement = document.getElementById("logo-fallback-element");
                if (fallbackElement) {
                  fallbackElement.classList.remove("hidden");
                  fallbackElement.classList.add("flex");
                }
              }}
              className="h-[52px] w-auto max-w-[210px] md:h-[76px] md:max-w-[330px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              id="brand-logo-img"
            />
            {/* Elegant text fallback container */}
            <div 
              id="logo-fallback-element" 
              className="hidden items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-dark">
                <Landmark className="w-5.5 h-5.5" id="brand-landmark-icon" />
              </div>
              <span className="block font-serif text-lg sm:text-xl font-extrabold tracking-tight text-brand-dark group-hover:text-brand-primary transition-colors">
                {newsletterName}
              </span>
            </div>
          </div>

          {/* Desktop Navigation & Action Controls Right-Aligned Row */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8" id="desktop-nav-and-cta-group">
            {/* Desktop Navigation Link Cluster */}
            <nav className="flex items-center gap-2" id="desktop-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-primary hover:bg-brand-blush/20 transition duration-200 cursor-pointer"
                    id={`nav-item-${item.id}`}
                  >
                    <Icon className="w-4 h-4 text-brand-primary/60" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Subscribe Call-to-action */}
            <button
              onClick={onSubscribeClick}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-dark active:scale-[0.98] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition duration-200 cursor-pointer"
              id="header-subscribe-btn"
            >
              Subscribe Free
            </button>
          </div>

          {/* Mobile hamburger toggle button */}
          <div className="flex md:hidden" id="mobile-toggle-wrapper">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-border/40 transition focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
              id="mobile-hamburger"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-brand-border/60 bg-brand-bg/95 backdrop-blur shadow-lg overflow-hidden"
            id="mobile-drawer"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-base font-semibold text-brand-text hover:text-brand-primary hover:bg-brand-blush/20 transition cursor-pointer"
                    id={`mobile-nav-${item.id}`}
                  >
                    <Icon className="w-5 h-5 text-brand-primary" />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-brand-border/60">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSubscribeClick();
                  }}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-center font-bold text-sm shadow transition duration-200 cursor-pointer"
                  id="mobile-subscribe-cta"
                >
                  Subscribe Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
