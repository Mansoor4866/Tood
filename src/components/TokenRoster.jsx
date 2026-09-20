import React from 'react';
import { GRID_TOKENS } from '../data/mockData';

export const TokenRoster = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
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
