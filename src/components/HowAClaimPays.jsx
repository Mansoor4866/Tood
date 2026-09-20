import React from 'react';
import { HOW_A_CLAIM_PAYS } from '../data/mockData';

export const HowAClaimPays = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <h2 className="display text-[32px] sm:text-[38px] font-bold text-[#0d0e11] tracking-tight">
          How a claim pays
        </h2>
        <span className="text-[15px] sm:text-[17px] text-[#0d0e1180]">
          One pot, sixteen plots, and a draw that picks one
        </span>
      </div>

      {/* 4 Cards Grid in Facto Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HOW_A_CLAIM_PAYS.map((card) => (
          <div
            key={card.num}
            className="facto-card p-7 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="mono text-[13px] text-[#f243ac] font-bold">
                {card.num}
              </div>
              <h3 className="display text-[22px] sm:text-[24px] font-bold text-[#0d0e11] mt-2.5">
                {card.title}
              </h3>
              <p className="mt-3.5 text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
