import React from 'react';
import { HOUSE_RULES } from '../data/mockData';
import { ShieldCheck } from 'lucide-react';

export const WhereThePotGoesAndHouseRules = () => {
  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-24 space-y-24">
      
      {/* ================= SECTION 1: WHERE THE POT GOES ================= */}
      <section>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#e6e6eb] shadow-sm p-1.5 flex items-center justify-center shrink-0">
              <img src="/assets/TOOD LOGO-04.jpg" alt="TOOD Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="display text-[32px] sm:text-[40px] font-bold text-[#0d0e11] tracking-tight">
                Where the pot goes
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#0d0e1180] mt-0.5">
                Ninety percent leaves with the winners, on chain, every round
              </p>
            </div>
          </div>
          <span className="mono text-[12px] font-semibold px-3 py-1 rounded-full bg-white border border-[#e6e6eb] text-[#0d0e1180] self-start md:self-auto shadow-sm">
            100% On-Chain Verifiable
          </span>
        </div>

        {/* Facto Segmented Multi-Color Progress Bar */}
        <div className="h-3.5 w-full bg-[#e6e6eb] rounded-full overflow-hidden flex gap-1 p-0.5 mb-8 shadow-inner">
          {/* 90% drawn plot */}
          <div className="h-full bg-gradient-to-r from-[#f755b7] to-[#f243ac] rounded-full shadow-sm" style={{ width: '90%' }} />
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
          <div className="p-5 rounded-2xl bg-white border border-[#e6e6eb] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f243ac]" />
              <span className="display text-[17px] font-bold text-[#0d0e11]">90% Drawn Plot</span>
            </div>
            <p className="text-[13.5px] text-[#0d0e1180] mt-2 leading-relaxed">
              Split between everyone holding the drawn plot, proportionate to their stake.
            </p>
          </div>

          {/* 5% */}
          <div className="p-5 rounded-2xl bg-white border border-[#e6e6eb] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0d0e11]" />
              <span className="display text-[17px] font-bold text-[#0d0e11]">5% Protocol</span>
            </div>
            <p className="text-[13.5px] text-[#0d0e1180] mt-2 leading-relaxed">
              Maintains the grid infrastructure, autonomous smart contract keepers, and RPCs.
            </p>
          </div>

          {/* 3% */}
          <div className="p-5 rounded-2xl bg-white border border-[#e6e6eb] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#008638]" />
              <span className="display text-[17px] font-bold text-[#0d0e11]">3% $TOOD Buyback</span>
            </div>
            <p className="text-[13.5px] text-[#0d0e1180] mt-2 leading-relaxed">
              Continuous automatic token market buyback, redistributed as cashback rewards.
            </p>
          </div>

          {/* 2% */}
          <div className="p-5 rounded-2xl bg-white border border-[#e6e6eb] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8e9093]" />
              <span className="display text-[17px] font-bold text-[#0d0e11]">2% Treasury</span>
            </div>
            <p className="text-[13.5px] text-[#0d0e1180] mt-2 leading-relaxed">
              Allocated for tournament prize funds, season rewards, and liquidity reserves.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: THE HOUSE RULES ================= */}
      <section>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
          <div>
            <h2 className="display text-[32px] sm:text-[40px] font-bold text-[#0d0e11] tracking-tight">
              The house rules
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#0d0e1180] mt-1">
              Four things worth knowing before you stake
            </p>
          </div>
          <span className="mono text-[12px] font-semibold px-3 py-1 rounded-full bg-white border border-[#e6e6eb] text-[#0d0e1180] self-start md:self-auto shadow-sm">
            Code Is Law
          </span>
        </div>

        {/* 2x2 Cards Grid in Facto Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HOUSE_RULES.map((rule) => (
            <div
              key={rule.num}
              className="facto-card p-7 sm:p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <div className="mono text-[12px] text-[#f243ac] font-bold px-2.5 py-0.5 rounded-full bg-[#fff5fa] border border-[#f243ac]/20 inline-block">
                    RULE {rule.num}
                  </div>
                  <ShieldCheck size={16} className="text-[#008638]" />
                </div>
                <h3 className="display text-[22px] font-bold text-[#0d0e11] mt-2">
                  {rule.title}
                </h3>
                <p className="mt-3 text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
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
