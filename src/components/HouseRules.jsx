import React from 'react';
import { HOUSE_RULES } from '../data/mockData';
import { Shield, CheckCircle2 } from 'lucide-react';

export const HouseRules = () => {
  return (
    <section className="max-w-[1376px] mx-auto px-4 sm:px-8 py-12">
      
      {/* Section Header */}
      <div className="max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] text-[12px] font-mono text-facto-dark mb-3">
          <Shield size={13} className="text-facto-pink" />
          <span>Verifiable On-Chain Protocol</span>
        </div>
        <h2 className="display text-[clamp(28px,3.8vw,44px)] font-bold text-facto-dark tracking-tight">
          Four things worth knowing before you stake
        </h2>
        <p className="mt-3 text-[17px] text-facto-muted leading-relaxed">
          The house rules are carved directly into Robinhood Chain smart contract bytecode with no administrative control.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {HOUSE_RULES.map((rule) => (
          <div
            key={rule.num}
            className="v2-card p-6 sm:p-7 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="mono text-[13px] text-facto-pink font-bold">
                  RULE {rule.num}
                </span>
                <CheckCircle2 size={16} className="text-facto-emerald" />
              </div>
              <h3 className="display text-[22px] font-bold text-facto-dark mt-1">
                {rule.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-facto-muted">
                {rule.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex items-center justify-between text-[12px] mono text-facto-muted">
              <span>On-Chain Verified</span>
              <span className="text-facto-dark font-medium">90% Payout / 10% Protocol</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pot Distribution Breakdown */}
      <div className="mt-6 v2-card p-6 sm:p-8 bg-facto-dark text-white border-0 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wider text-facto-pink font-mono">
              Where the Pot Goes
            </div>
            <div className="display text-[28px] font-bold text-white mt-1">
              90% Leaves with Winners
            </div>
            <p className="text-[14px] text-gray-400 mt-2">
              Every round, ninety percent of the entire ETH & USDG staked is distributed instantly on chain.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="display text-[28px] font-bold text-facto-pink">90%</div>
              <div className="text-[13px] font-bold text-white mt-1">Winning Plot</div>
              <div className="mono text-[11px] text-gray-400 mt-1">Shared out by stake size</div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="display text-[28px] font-bold text-facto-emeraldLight">6%</div>
              <div className="text-[13px] font-bold text-white mt-1">$TOOD Buyback</div>
              <div className="mono text-[11px] text-gray-400 mt-1">Paid as user cashback</div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="display text-[28px] font-bold text-gray-300">4%</div>
              <div className="text-[13px] font-bold text-white mt-1">Season Rewards</div>
              <div className="mono text-[11px] text-gray-400 mt-1">Leaderboard & prizes</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
