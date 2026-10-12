import React from 'react';
import { GRID_TOKENS } from '../data/mockData';
import { Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export const TokenRoster = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 animate-fadeIn">
      
      {/* Official $TOOD Memecoin Teaser Card */}
      <div className="mb-10 facto-card p-6 sm:p-8 bg-gradient-to-r from-[#0d0e11] via-[#1c0816] to-[#0d0e11] text-white border border-[#f243ac]/30 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f243ac]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f243ac]/20 border border-[#f243ac]/40 text-[#f243ac] text-[11px] font-mono font-bold mb-3">
              <Sparkles size={12} className="animate-pulse" />
              <span>OFFICIAL PROTOCOL TOKEN TEASER</span>
            </div>
            <h3 className="display text-[26px] sm:text-[34px] font-bold text-white tracking-tight">
              The $TOOD Token is Coming to Robinhood Chain
            </h3>
            <p className="text-[14px] sm:text-[15px] text-gray-300 mt-2 leading-relaxed">
              Every round you stake on the grid builds your on-chain Season 1 reputation. Active participants and top Leaderboard stakers will be eligible for community airdrop allocations and revenue share!
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="https://x.com/ToodProtocol_"
              target="_blank"
              rel="noreferrer"
              className="btn-pink px-6 py-3.5 text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Follow Official 𝕏 Handle</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[32px] sm:text-[38px] font-bold text-[#0d0e11] tracking-tight">
            Season 1 Map
          </h2>
          <p className="text-[16px] text-[#0d0e1180] mt-1">
            The 16 Robinhood Chain tokens riding this map until the season ends, one to a plot
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GRID_TOKENS.map((token) => (
          <div key={token.id} className="facto-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-white border border-[#e5e7eb] p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img src={token.avatar} alt={token.name} className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-[#0d0e1180] font-semibold">Plot {token.cell}</span>
                <span className="mono text-[11px] text-[#008638] font-bold">{token.volume}</span>
              </div>
              <div className="text-[16px] font-bold text-[#0d0e11] truncate mt-0.5">${token.symbol}</div>
              <div className="text-[13px] text-[#0d0e1180] truncate font-medium">{token.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
