'use client';

import { Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#09090b]" id="pricing">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            Simple pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Start pixelating for free today. Upgrade later for advanced professional tools.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-[#1c1c1e] flex flex-col h-full min-h-[640px]"
          >
            <div className="p-8 pb-8 border-b border-white/5">
              <h3 className="text-2xl font-semibold mb-2 text-white">Free</h3>
              <p className="text-white/70 text-sm mb-8">Perfect for quick edits and standard pixelation</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-xl font-medium text-white/60">$</span>
                <span className="text-6xl font-bold text-white tracking-tighter">0</span>
                <span className="text-xl font-medium text-white/40 line-through ml-2">$0</span>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors text-sm">
                Get Started for Free
              </button>
            </div>
            
            <div className="p-8 pt-8 flex-1">
              <ul className="space-y-5">
                {[
                  'Standard pixelation tools', 
                  'Basic shapes (square, circle)', 
                  'Standard resolution export', 
                  'Community support',
                  'No credit card required',
                  'Basic documentation'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 font-medium text-sm">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Paid Tier (Coming Soon) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl bg-[#1c1c1e] flex flex-col h-full min-h-[640px] relative overflow-hidden"
          >
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[4px]">
              <Lock className="w-10 h-10 text-white mb-4 opacity-90" />
              <span className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm">
                Pro Coming Soon
              </span>
            </div>

            <div className="flex flex-col h-full opacity-50 select-none">
              <div className="p-8 pb-8 border-b border-white/5">
                <h3 className="text-2xl font-semibold mb-2 text-white">Pro Access</h3>
                <p className="text-white/70 text-sm mb-8">Paid yearly</p>
                
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-xl font-medium text-white/60">$</span>
                  <span className="text-6xl font-bold text-white tracking-tighter">169</span>
                  <span className="text-xl font-medium text-white/40 line-through ml-2">$249</span>
                </div>

                <button disabled className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm">
                  Get Pro Access
                </button>
              </div>

              <div className="p-8 pt-8 flex-1">
                <ul className="space-y-5">
                  {[
                    'Advanced glitch & chromatic effects', 
                    'High-resolution export (4K+)', 
                    'Custom pixelation shapes', 
                    'Priority email support', 
                    'Remove watermarks',
                    'Commercial usage rights',
                    'Early access to new features'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80 font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
