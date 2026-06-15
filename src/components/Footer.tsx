/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Landmark, X, Heart } from "lucide-react";

interface FooterProps {
  onNavClick: (id: string) => void;
  onSubscribeClick: () => void;
  cityName: string;
  newsletterName: string;
}

export default function Footer({ onNavClick, onSubscribeClick, cityName, newsletterName }: FooterProps) {
  const [modalType, setModalType] = useState<"privacy" | "contact" | null>(null);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSuccess(true);
    }, 1000);
  };

  return (
    <footer id="main-footer" className="bg-[#12372A] text-[#F7F3E8] border-t border-[rgba(247,243,232,0.12)] pt-12 pb-8 animate-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8 border-b border-[rgba(247,243,232,0.12)]">
          
          {/* Col 1: Brand details footer */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="inline-flex bg-[#F7F3E8] rounded-lg px-2.5 py-2 shadow-sm">
                <img
                  src="/lgg-logo.png"
                  alt="The Los Gatos Guide"
                  className="h-11 w-auto max-w-[220px] object-contain"
                  id="footer-logo-img"
                />
              </div>
              <div>
                <span className="block font-serif text-lg font-extrabold tracking-tight text-[#F7F3E8] leading-none">
                  {newsletterName}
                </span>
                <span className="block text-[9px] tracking-widest text-[#C8D6C3] font-semibold uppercase mt-0.5">
                  {cityName} Guide
                </span>
              </div>
            </div>
            
            <p className="text-[#C8D6C3] text-xs sm:text-sm leading-relaxed max-w-sm">
              A weekly local guide to the best of {cityName} and the West Valley, featuring events, restaurants, weekend ideas, family activities, and community highlights.
            </p>
          </div>

          {/* Col 2: Navigation link cluster */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-[#F7F3E8] font-semibold text-sm">Explore</h4>
            <ul className="space-y-2 text-xs text-[#C8D6C3]">
              <li>
                <button
                  onClick={() => onNavClick("hero")}
                  className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left block"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("eats")}
                  className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left block"
                >
                  Eats
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("events")}
                  className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left block"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick("local-updates")}
                  className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left block"
                >
                  Local Updates
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect & Newsletter Support */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-[#F7F3E8] font-semibold text-sm">Connect</h4>
            <p className="text-[#C8D6C3] text-xs max-w-xs leading-relaxed">
              Have something local to share? Send us an event, restaurant opening, community update, or local business tip.
            </p>
            <div>
              <button
                onClick={() => setModalType("contact")}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#2F6B4F] hover:bg-[#3B7D5C] text-[#FFFFFF] border border-transparent text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm text-center"
                id="footer-contact-button"
              >
                Submit a Local Tip
              </button>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[11px] text-[#C8D6C3]">
              <button
                onClick={() => setModalType("contact")}
                className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left"
              >
                Suggest an Event
              </button>
              <span className="text-[rgba(247,243,232,0.12)]">•</span>
              <button
                onClick={() => onNavClick("advertise")}
                className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left"
              >
                Advertise With Us
              </button>
              <span className="text-[rgba(247,243,232,0.12)]">•</span>
              <button
                onClick={() => setModalType("contact")}
                className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left"
              >
                Contact
              </button>
              <span className="text-[rgba(247,243,232,0.12)]">•</span>
              <button
                onClick={() => setModalType("privacy")}
                className="hover:text-[#F7F3E8] hover:underline transition duration-200 cursor-pointer text-left"
              >
                Privacy & Terms
              </button>
            </div>
          </div>

        </div>

        {/* Closing details and copy */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#C8D6C3]/60" id="copyright-bar">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {newsletterName}. All rights reserved. Registered trademark.
          </div>
          
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#2F6B4F] fill-current inline animate-none" />
            <span>in {cityName}, California</span>
          </div>
        </div>

      </div>

      {/* Legals / Privacy Modal */}
      {modalType === "privacy" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-brand-text border border-brand-border rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-1 rounded-lg border border-brand-border hover:bg-brand-bg text-brand-muted hover:text-brand-text transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-extrabold text-brand-dark">Privacy & Safety Policy</h3>
            <div className="space-y-3 text-xs leading-relaxed text-brand-muted">
              <p className="font-semibold text-brand-text">We take community trust extremely seriously.</p>
              <p>Your email address is used solely to deliver {newsletterName} on Thursday mornings. We never buy, sell, lease, or distribute our list with outer third-party brokers, digital target agencies, or national advertising platforms.</p>
              <p><strong>Anti-Spam Pledge:</strong> No affiliate marketing deals, no robotic generic newsletters, and no bloated emails. If our guide isn't adding value to your weekends, you can unsubscribe instantly in 1-click using the link at the bottom of any email we dispatch.</p>
              <p><strong>Metrics & Analytics:</strong> To ensure layout formatting sits well on mobile and older emails, we analyze high-level open rates and button interaction indices. No specific device fingerprinting or location metadata is logged.</p>
            </div>
            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact / Submit Tip Modal */}
      {modalType === "contact" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-brand-text border border-brand-border rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setModalType(null);
                setContactSuccess(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg border border-brand-border hover:bg-brand-bg text-brand-muted hover:text-brand-text transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-serif font-extrabold text-brand-dark">Send a Local Tip or Suggestion</h3>
            <p className="text-xs text-brand-muted">
              Are you a local business celebrating a grand opening, an event planner, or a resident with a great weekend idea? Drop our writing team a line!
            </p>

            {!contactSuccess ? (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-brand-text">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Peterson"
                    className="w-full px-3 py-2 text-xs bg-brand-bg/30 border border-brand-border rounded-lg text-brand-text focus:outline-none"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-brand-text">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maria.g@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-brand-bg/30 border border-brand-border rounded-lg text-brand-text focus:outline-none"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold text-brand-text">Tip or Story Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details, restaurant name, event hours, or anything we should inspect..."
                    className="w-full px-3 py-2 text-xs bg-brand-bg/30 border border-brand-border rounded-lg text-brand-text resize-none focus:outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition cursor-pointer disabled:opacity-50"
                >
                  {submittingContact ? "Sending Tip..." : "Submit Material to Editors"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <Landmark className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-brand-dark">Tip Submitted Successfully!</h4>
                <p className="text-xs text-brand-muted">
                  Thank you! Our editorial review board inspects daily. We will reach out if we can feature your suggestion in our upcoming Thursday issue!
                </p>
                <button
                  onClick={() => {
                    setModalType(null);
                    setContactSuccess(false);
                  }}
                  className="px-5 py-2 bg-brand-bg text-brand-text font-bold text-xs rounded-lg border border-brand-border"
                >
                  Close Tip Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </footer>
  );
}
