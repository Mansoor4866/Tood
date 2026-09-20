import React from 'react';
import { HOUSE_RULES } from '../data/mockData';

export const WhereThePotGoesAndHouseRules = () => {
  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-24 space-y-20">
      
      {/* ================= SECTION 1: WHERE THE POT GOES ================= */}
      <section>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <h2 className="display text-[32px] sm:text-[38px] font-bold text-[#0d0e11] tracking-tight">
            Where the pot goes
          </h2>
          <span className="text-[15px] sm:text-[17px] text-[#0d0e1180]">
            Ninety percent leaves with the winners, on chain, every round
          </span>
        </div>

        {/* Facto Segmented Multi-Color Progress Bar */}
        <div className="h-3 w-full bg-[#e9e9e9] rounded-full overflow-hidden flex gap-1 p-0.5 mb-8">
          {/* 90% drawn plot */}
          <div className="h-full bg-[#f243ac] rounded-full" style={{ width: '90%' }} />
          {/* 5% protocol */}
          <div className="h-full bg-[#0d0e11] rounded-full" style={{ width: '5%' }} />
          {/* 3% buyback */}
          <div className="h-full bg-[#008638] rounded-full" style={{ width: '3%' }} />
          {/* 2% treasury */}
          <div className="h-full bg-[#8e9093] rounded-full" style={{ width: '2%' }} />
        </div>

        {/* 4 Legend Columns in Facto Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 90% */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f243ac]" />
              <span className="display text-[16px] font-bold text-[#0d0e11]">90% to the drawn plot</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] mt-2 leading-relaxed pl-4">
              split between everyone holding it, in proportion to their stake
            </p>
          </div>

          {/* 5% */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0d0e11]" />
              <span className="display text-[16px] font-bold text-[#0d0e11]">5% protocol</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] mt-2 leading-relaxed pl-4">
              running the grid
            </p>
          </div>

          {/* 3% */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#008638]" />
              <span className="display text-[16px] font-bold text-[#0d0e11]">3% $TOOD buyback</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] mt-2 leading-relaxed pl-4">
              bought back, paid out as cashback
            </p>
          </div>

          {/* 2% */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8e9093]" />
              <span className="display text-[16px] font-bold text-[#0d0e11]">2% treasury</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] mt-2 leading-relaxed pl-4">
              prize funds and season rewards
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: THE HOUSE RULES ================= */}
      <section>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <h2 className="display text-[32px] sm:text-[38px] font-bold text-[#0d0e11] tracking-tight">
            The house rules
          </h2>
          <span className="text-[15px] sm:text-[17px] text-[#0d0e1180]">
            Four things worth knowing before you stake
          </span>
        </div>

        {/* 2x2 Cards Grid in Facto Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HOUSE_RULES.map((rule) => (
            <div
              key={rule.num}
              className="facto-card p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="display text-[22px] font-bold text-[#0d0e11]">
                  {rule.title}
                </h3>
                <p className="mt-3.5 text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
