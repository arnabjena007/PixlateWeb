"use client";
import * as React from "react";
import { Check, Lock } from "lucide-react";

const pricingData = {
  plans: [
    {
      name: "Free",
      description: "Perfect for quick pixelation and basic sorting",
      price: "0",
      originalPrice: "0",
      buttonText: "Start editing for free",
      isComingSoon: false,
      features: [
        "Standard pixel sorting tools",
        "Basic glitch effects",
        "Export up to 1080p resolution",
        "Community support",
        "No credit card required"
      ]
    },
    {
      name: "Pro Access",
      description: "Advanced tools for creative professionals",
      price: "3",
      originalPrice: "9",
      buttonText: "Get Pro Access",
      isComingSoon: true,
      features: [
        "Advanced multi-directional pixel sorting",
        "Customizable chromatic aberration",
        "High-resolution 4K+ export",
        "Remove all watermarks",
        "Commercial usage rights",
        "Priority email support"
      ]
    }
  ]
};

export default function PricingSection() {
  return (
    <section className="bg-[#09090b]" style={{ padding: '100px 0' }} aria-labelledby="pricing-section-title">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center" style={{ gap: '64px' }}>
          <div className="flex flex-col items-center text-center" style={{ gap: '20px' }}>
            <h2 id="pricing-section-title" className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Simple pricing
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl">
              Start for free today. Upgrade later for advanced professional tools.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 items-stretch max-w-4xl mx-auto" style={{ gap: '32px' }}>
            {pricingData.plans.map((plan, index) => (
              <div 
                key={plan.name}
                className="rounded-[2rem] bg-[#1a1a1a] flex flex-col h-full overflow-hidden border border-white/5 relative"
                style={{ minHeight: '640px' }}
              >
                {/* Top Section */}
                <div className="border-b border-white/5 flex flex-col" style={{ padding: '40px', gap: '24px' }}>
                  <div>
                    <h3 className="text-3xl font-bold text-white" style={{ marginBottom: '8px' }}>{plan.name}</h3>
                    <p className="text-white/60 text-[15px]">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline" style={{ gap: '8px', marginTop: '8px' }}>
                    <span className="text-2xl font-medium text-white/50">$</span>
                    <span className="text-7xl font-bold text-white tracking-tighter">{plan.price}</span>
                    <span className="text-xl font-medium text-white/30 line-through" style={{ marginLeft: '8px' }}>
                      {plan.originalPrice !== "0" ? `$${plan.originalPrice}` : ""}
                    </span>
                    <span className="text-white/40" style={{ marginLeft: '4px' }}>/mo</span>
                  </div>

                  <button 
                    className="w-full rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors text-base flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ height: '56px', marginTop: '16px' }}
                    disabled={plan.isComingSoon}
                  >
                    {plan.buttonText}
                  </button>
                </div>
                
                {/* Bottom Section (Features) */}
                <div className="flex-1 bg-[#151515] relative" style={{ padding: '40px' }}>
                  <ul 
                    className={plan.isComingSoon ? "opacity-30 blur-[2.5px] select-none pointer-events-none" : ""}
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                  >
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-white/80 font-medium text-[15px] leading-relaxed" style={{ gap: '16px' }}>
                        <div className="rounded-full bg-white/10 flex items-center justify-center shrink-0" style={{ width: '24px', height: '24px', marginTop: '2px' }}>
                          <Check className="text-white" strokeWidth={3} style={{ width: '14px', height: '14px' }} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Coming Soon Overlay Badge */}
                  {plan.isComingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 antialiased" style={{ padding: '40px' }}>
                      <div className="flex items-center bg-[#27272a] border border-white/10 rounded-full shadow-2xl transform-gpu" style={{ padding: '10px 24px', gap: '8px' }}>
                        <Lock className="w-4 h-4 text-white/80" />
                        <span className="text-[15px] font-bold text-white/90 tracking-wide uppercase">Coming Soon</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
