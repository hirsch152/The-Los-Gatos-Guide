/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Award, CheckCircle, Mail, Send, X, ArrowUpRight, DollarSign } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebaseConfig";
import { adPackages } from "../config";
import { AdPackage } from "../types";

interface AdvertiseProps {
  cityId: string;
  cityName: string;
  newsletterName: string;
}

export default function Advertise({ cityId, cityName, newsletterName }: AdvertiseProps) {
  const [activePackage, setActivePackage] = useState<AdPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const handleOpenInquire = (pkg: AdPackage) => {
    setActivePackage(pkg);
    setIsDone(false);
    setDbError(null);
    setFormData({
      name: "",
      email: "",
      businessName: "",
      message: `Hi team, we represent our local business and would like to learn more about the ${pkg.title} package for ${cityName}. Thanks!`,
    });
  };

  const handleSubmitInquire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !activePackage) return;

    setIsSubmitting(true);
    setDbError(null);

    // Dynamic unique ID for the inquiry document
    const inquiryId = `${formData.email.replace(/[^a-zA-Z0-9_\-]+/g, "_").toLowerCase()}_${Date.now()}`;

    try {
      // Save directly to Firestore using compliant keys mapped schema
      await setDoc(doc(db, "sponsor_inquiries", inquiryId), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        businessName: formData.businessName.trim() || "Local Business",
        message: formData.message.trim() || "",
        cityId: cityId,
        packageId: activePackage.id,
        packageName: activePackage.title,
        price: activePackage.price,
        createdAt: serverTimestamp()
      });

      setIsDone(true);
      localStorage.setItem(`pulse_ad_inquiry_${cityId}`, JSON.stringify(formData));
    } catch (err: any) {
      console.error("Failed to commit package inquiry to Firestore:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `sponsor_inquiries/${inquiryId}`);
      } catch (fError) {
        // Log compliant errors
      }
      setDbError("Unable to register interest. Please double-check your entries.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="advertise-section" className="py-10 sm:py-16 bg-white border-t border-brand-border/40 relative overflow-hidden">
      
      {/* Absolute design backdrops */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-blush/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute right-0 top-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ad Title Block */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C89B3C]/10 text-[#C89B3C] uppercase tracking-wide">
            🤝 Grow Your Business locally
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-brand-dark tracking-tight">
            Reach locals who actually care about {cityName}.
          </h2>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            {newsletterName} is custom-built for residents, families, realtors, professionals, and weekend visitors looking for the best local events, restaurants, shops, and services. Sponsorship spots will be available in multiple brackets as the newsletter grows.
          </p>
        </div>

        {/* Single-Column Sponsorship Teaser Section */}
        <div className="max-w-3xl mx-auto bg-brand-bg/30 border border-brand-border rounded-2xl p-5 sm:p-8 text-center space-y-4 hover:border-brand-primary/30 transition-all duration-300" id="sponsorship-teaser-container">
          <div className="w-12 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-primary mx-auto shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-brand-dark leading-tight">
              Partner with {newsletterName}
            </h3>
            <p className="text-brand-text/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Reach local residents, families, professionals, and weekend visitors through tasteful newsletter sponsorships, local business spotlights, and community placements.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleOpenInquire({
                id: "pkg-sponsorship",
                title: `Sponsorship & Advertising Options`,
                tagline: "Tasteful partner placements for local brands.",
                price: "Inquire for Rates",
                frequency: "per placement",
                description: "Reach local residents and families through organic product storytelling, sponsored sections, business spotlight articles, or calendar events.",
                bullets: [
                  "Exclusive weekly sponsor placements",
                  "Dedicated local business spotlight articles",
                  "Event calendar highlights & takeovers"
                ],
                iconName: "newsletter"
              })}
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold tracking-wide shadow transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              id="view-advertising-options-btn"
            >
              <span>View Advertising Options</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Ad Inquire Overlay Form Drawer */}
      <AnimatePresence>
        {activePackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4"
            id="ad-form-backdrop"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="bg-white border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5"
              id="ad-form-card"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C89B3C] font-mono leading-none">
                    SPONSORSHIP INQUIRY
                  </span>
                  <h3 className="font-serif font-extrabold text-xl text-brand-dark leading-tight">
                    {activePackage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePackage(null)}
                  className="p-1 rounded-lg hover:bg-brand-bg text-brand-muted hover:text-brand-text transition cursor-pointer"
                  id="close-ad-form-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <hr className="border-brand-border/60" />

              {/* Form Content body */}
              {!isDone ? (
                <form onSubmit={handleSubmitInquire} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-text block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Miller"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-brand-bg/25 border border-brand-border rounded-lg text-brand-text placeholder-brand-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      id="ad-form-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-text block">Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. robert@somedomain.com"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-brand-bg/25 border border-brand-border rounded-lg text-brand-text placeholder-brand-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      id="ad-form-email"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-text block">Business Name / Project</label>
                    <input
                      type="text"
                      placeholder="e.g. Oak Meadow Cafe"
                      value={formData.businessName}
                      onChange={(e) => setFormData(p => ({ ...p, businessName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-brand-bg/25 border border-brand-border rounded-lg text-brand-text placeholder-brand-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      id="ad-form-biz"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-text block">Notes or Campaign Requirements</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-brand-bg/25 border border-brand-border rounded-lg text-brand-text placeholder-brand-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                      id="ad-form-msg"
                    />
                  </div>

                  {dbError && (
                    <p className="text-xs text-red-600 font-bold">{dbError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    id="submit-ad-form-btn"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Partnership Request</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4" id="ad-form-success">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-extrabold text-brand-text text-lg">Inquiry received!</h4>
                    <p className="text-brand-muted text-xs leading-relaxed max-w-sm mx-auto">
                      Thank you, <strong>{formData.name}</strong>. We've compiled your request for the <strong>{activePackage.title}</strong> package ($149 – $399). An editor from {newsletterName} will reach out to <span className="underline">{formData.email}</span> within 24 business hours with our rate kit and available slots!
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePackage(null)}
                    className="px-5 py-2 bg-brand-bg hover:bg-brand-border/40 border border-brand-border text-brand-text font-bold text-xs rounded-xl transition cursor-pointer text-brand-text"
                    id="ad-form-success-close"
                  >
                    Close Window
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
