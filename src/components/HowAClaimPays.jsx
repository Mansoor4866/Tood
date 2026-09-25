import React from 'react';
import { HOW_A_CLAIM_PAYS } from '../data/mockData';
import { Target, Coins, Shuffle, Split } from 'lucide-react';

const ICONS = [Target, Coins, Shuffle, Split];

export const HowAClaimPays = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[32px] sm:text-[40px] font-bold text-[#0d0e11] tracking-tight">
            How a claim pays
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#0d0e1180] mt-1">
            One pot, sixteen plots, and a draw that picks one
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="h-7 w-auto px-2 py-0.5 rounded-lg bg-white border border-[#e6e6eb] shadow-sm flex items-center">
            <img src="/assets/TOOD LOGO-01.jpg" alt="TOOD" className="h-4 w-auto object-contain" />
          </div>
          <span className="mono text-[12px] font-semibold px-3 py-1 rounded-full bg-white border border-[#e6e6eb] text-[#0d0e1180] shadow-sm">
            Protocol Rules
          </span>
        </div>
      </div>

      {/* 4 Cards Grid in Facto Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HOW_A_CLAIM_PAYS.map((card, idx) => {
          const IconComponent = ICONS[idx] || Target;
          return (
            <div
              key={card.num}
              className="facto-card p-7 sm:p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#fff5fa] border border-[#f243ac]/20 text-[#f243ac] mono text-[12px] font-bold">
                    <span>STEP {card.num}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#f8f8fa] flex items-center justify-center text-[#0d0e1180] group-hover:text-[#f243ac] group-hover:bg-[#fff5fa] transition-colors border border-[#e6e6eb]">
                    <IconComponent size={15} />
                  </div>
                </div>

                <h3 className="display text-[22px] sm:text-[24px] font-bold text-[#0d0e11] mt-3">
                  {card.title}
                </h3>
                <p className="mt-3 text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
