/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, Star, Shield, Users } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebaseConfig";

interface SignupFormProps {
  compact?: boolean;
  cityId: string;
  cityName: string;
  newsletterName: string;
  subscriberCountOffset: number;
}

export default function SignupForm({
  compact = false,
  cityId,
  cityName,
  newsletterName,
  subscriberCountOffset
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(subscriberCountOffset);
  const [interests, setInterests] = useState({
    events: true,
    eats: true,
    weekend: true,
    family: false,
    spotlight: true,
  });

  useEffect(() => {
    // Sync subscriber baseline count when selected town changes
    setSubscriberCount(subscriberCountOffset);
    setDbError(null);
  }, [subscriberCountOffset, cityId]);

  useEffect(() => {
    // Check if subscriber exists locally for this town
    const savedSubStr = localStorage.getItem(`pulse_subscribed_${cityId}`);
    if (savedSubStr === "true") {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }, [cityId]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    setDbError(null);
    
    // Normalize clean subscriber identifier
    const subscriberId = email.replace(/[^a-zA-Z0-9_\-]+/g, "_").toLowerCase();

    try {
      // Write the payload using standard setDoc to comply with exact key blueprints
      await setDoc(doc(db, "subscribers", subscriberId), {
        email: email.trim(),
        cityId: cityId,
        createdAt: serverTimestamp(),
        interests: interests
      });

      setIsSubscribed(true);
      setSubscriberCount(prev => prev + 1);
      localStorage.setItem(`pulse_subscribed_${cityId}`, "true");
      localStorage.setItem(`pulse_email_${cityId}`, email);
    } catch (err: any) {
      console.error("Subscription submission failed in Firestore:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `subscribers/${subscriberId}`);
      } catch (innerErr) {
        // Handle gracefully, logging the exception details
      }
      setDbError("Slight error updating subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubscribed(false);
    setEmail("");
    localStorage.removeItem(`pulse_subscribed_${cityId}`);
  };

  if (compact) {
    return (
      <div id="compact-signup" className="w-full max-w-sm">
        {isSubscribed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white mb-2">
              <Check className="w-5 h-5" id="compact-check-icon" />
            </div>
            <h4 className="font-serif font-bold text-emerald-950 text-sm">You are on the list!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Welcome to the {cityName} insider community. Watch your inbox this Thursday!
            </p>
            <button 
              onClick={handleReset}
              className="mt-2 text-[10px] text-emerald-600 underline hover:text-emerald-800 transition cursor-pointer"
              id="compact-reset-btn"
            >
              Reset Email
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" id="compact-mail-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-brand-border rounded-lg text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                  id="compact-email-input"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow duration-200 disabled:opacity-75 flex items-center gap-1 cursor-pointer shrink-0"
                id="compact-submit-btn"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {dbError && (
              <p className="text-[10px] text-red-600 font-semibold">{dbError}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <div id="newsletter-signup-box" className="bg-white border border-brand-border rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blush/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row items-stretch gap-8 lg:gap-12"
          >
            {/* Form Column */}
            <div className="flex-1 space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-blush/30 text-brand-primary">
                  <Star className="w-3 h-3 fill-current" id="star-icon-p" /> Curated Community Guide
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-text tracking-tight">
                  Don’t miss what’s happening in {cityName}.
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed max-w-xl">
                  Get the best of {cityName} delivered once a week on Thursday mornings. Free, outstandingly written, and actually useful.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" id="mail-input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-brand-bg/50 border border-brand-border rounded-xl text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                      id="signup-email-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow-md duration-200 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
                    id="signup-submit-btn"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Subscribe Free"
                    )}
                  </button>
                </div>

                {/* Checklist of options */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-brand-text/80 mb-2.5">Customize your weekly interests:</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={interests.events} 
                        onChange={() => setInterests(p => ({ ...p, events: !p.events }))}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 text-brand-primary bg-white" 
                      />
                      <span>Local Events</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={interests.eats} 
                        onChange={() => setInterests(p => ({ ...p, eats: !p.eats }))}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 text-brand-primary bg-white" 
                      />
                      <span>Eats & Drinks</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={interests.weekend} 
                        onChange={() => setInterests(p => ({ ...p, weekend: !p.weekend }))}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 text-brand-primary bg-white" 
                      />
                      <span>Weekend Plans</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={interests.family} 
                        onChange={() => setInterests(p => ({ ...p, family: !p.family }))}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 text-brand-primary bg-white" 
                      />
                      <span>Family Ideas</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={interests.spotlight} 
                        onChange={() => setInterests(p => ({ ...p, spotlight: !p.spotlight }))}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-3.5 h-3.5 text-brand-primary bg-white" 
                      />
                      <span>Business Spotlight</span>
                    </label>
                  </div>
                </div>

                {dbError && (
                  <p className="text-xs text-red-600 font-bold">{dbError}</p>
                )}
              </form>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 border-t border-brand-border/60 text-[11px] text-brand-muted">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-brand-gold" id="shield-icon" /> No spam. Just pure local gems.
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted invisible" />
                  <Users className="w-3.5 h-3.5 text-brand-gold" /> Delivered every Thursday.
                </span>
                <span>Unsubscribe in 1-click anytime.</span>
              </div>
            </div>

            {/* Social Proof Column */}
            <div className="w-full md:w-64 bg-brand-bg/40 rounded-xl p-5 border border-brand-border/50 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-brand-primary font-medium text-xs">
                  <Users className="w-4 h-4" id="users-icon" />
                  <span>COMMUNITY INSIDER</span>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-serif font-black text-brand-text tracking-tight">
                    {subscriberCount.toLocaleString()}+
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Locals who reside, shop, and volunteer in {cityName} are already reading.
                  </p>
                </div>
              </div>

              {/* Realistic quote card */}
              <div className="bg-white rounded-lg p-3.5 border border-brand-border/60 shadow-sm space-y-2">
                <p className="text-[11px] italic text-brand-text leading-relaxed">
                  "The only newsletter I look forward to opening. It single-handedly saved our weekend plans."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-blush/40 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                    JD
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-brand-text">Jennifer D.</h5>
                    <p className="text-[9px] text-brand-muted">Almond Grove Resident</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <Check className="w-8 h-8" id="success-check" strokeWidth={2.5} />
            </div>
            
            <div className="space-y-2 max-w-lg">
              <h3 className="text-3xl font-serif font-black text-brand-dark">You’re officially registered!</h3>
              <p className="text-brand-muted text-sm">
                Thank you for subscribing to <strong className="text-brand-primary">{newsletterName}</strong>. 
                We have verified your registration details (<span className="font-mono text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">{email || "your email"}</span>).
              </p>
              <p className="text-brand-muted text-xs leading-relaxed max-w-md mx-auto">
                Our guide arrives in your inbox every Thursday morning at 6:00 AM PST. Be sure to drag us to your primary inbox if you use Gmail or iCloud Mail!
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-brand-bg hover:bg-brand-border/50 border border-brand-border text-brand-text rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer animate-none"
                id="unsub-test-btn"
              >
                Subscribe Another Email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
