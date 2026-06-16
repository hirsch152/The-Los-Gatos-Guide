/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, Star, Shield } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

  useEffect(() => {
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

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email.trim(),
        cityId: cityId,
        createdAt: serverTimestamp(),
        interests: {
          events: true,
          eats: true,
          weekend: true,
          family: true,
          spotlight: true
        }
      });

      setIsSubscribed(true);
      localStorage.setItem(`pulse_subscribed_${cityId}`, "true");
      localStorage.setItem(`pulse_email_${cityId}`, email);
    } catch (err: any) {
      console.error("Subscription submission failed in Firestore:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, "subscribers");
      } catch (innerErr) {
        // Handle gracefully, logging the exception details
      }
      setDbError("We could not complete your signup just now. Please try again.");
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
                  <Star className="w-3 h-3 fill-current" id="star-icon-p" /> Curated Weekly Guide
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-text tracking-tight">
                  Don’t miss what’s happening in {cityName}.
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed max-w-xl">
                  Get one friendly weekly email with local events, restaurant finds, weekend ideas, and community updates from Los Gatos.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" id="mail-input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
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

                {dbError && (
                  <p className="text-xs text-red-600 font-bold">{dbError}</p>
                )}
              </form>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 border-t border-brand-border/60 text-[11px] text-brand-muted">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-brand-gold" id="shield-icon" /> No spam. One email a week. Unsubscribe anytime.
                </span>
              </div>
            </div>

            {/* Weekly Guide Summary Column */}
            <div className="w-full md:w-64 bg-brand-bg/40 rounded-xl p-5 border border-brand-border/50 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-brand-primary font-medium text-xs">
                  <Star className="w-4 h-4 fill-current" id="guide-includes-icon" />
                  <span>WEEKLY LOCAL ROUNDUP</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-serif font-black text-brand-text tracking-tight">
                    Weekly Guide Includes
                  </h4>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Built for locals who want the good stuff without hunting for it.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3.5 border border-brand-border/60 shadow-sm">
                <ul className="space-y-2.5 text-xs text-brand-text">
                  {[
                    "Events worth knowing about",
                    "Restaurant and coffee finds",
                    "Weekend ideas",
                    "Community updates",
                    "New openings and local notes"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-brand-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
