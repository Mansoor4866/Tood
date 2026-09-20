import React from 'react';
import { useGame } from '../context/GameContext';
import { GRID_TOKENS } from '../data/mockData';

export const HistoryLog = () => {
  const { history } = useGame();

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-20">
      
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <h1 className="display text-[36px] sm:text-[44px] font-bold text-[#0d0e11] tracking-tight">
          The record
        </h1>
        <span className="text-[15px] sm:text-[16px] text-[#0d0e1180]">
          Every round that ever settled, read straight out of the contract log
        </span>
      </div>

      {/* ================= POT PER ROUND BAR CHART CARD ================= */}
      <div className="facto-card p-6 sm:p-7 mb-6">
        <div className="flex items-center justify-between text-[13px] mono text-[#0d0e1180] mb-6">
          <span className="font-sans font-bold text-[16px] text-[#0d0e11]">Pot per round</span>
          <span className="font-semibold">ETH</span>
        </div>

        {/* Minimalist Bar Chart in Facto Style */}
        <div className="h-28 flex items-end gap-3 px-2 border-b border-[#f0f0f0] pb-2">
          {history.map((row, idx) => {
            const maxPot = Math.max(...history.map(h => h.potEth), 2);
            const heightPct = Math.max(16, Math.min(100, (row.potEth / maxPot) * 100));

            return (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div
                  className="w-8 rounded-md bg-[#0d0e11] group-hover:bg-[#f243ac] transition-all shadow-sm"
                  style={{ height: `${heightPct}px` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SETTLED ROUNDS TABLE ================= */}
      <div className="facto-card p-6 sm:p-7 mb-10">
        
        {/* Table Title */}
        <div className="text-[16px] font-bold text-[#0d0e11] mb-6">
          {history.length} rounds on the books
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f0f0] text-[11px] mono text-[#0d0e1180] tracking-wider uppercase font-bold">
                <th className="pb-4 font-bold">ROUND</th>
                <th className="pb-4 font-bold">DRAWN</th>
                <th className="pb-4 font-bold">CREW HOLDING IT</th>
                <th className="pb-4 font-bold text-right">POT ETH</th>
                <th className="pb-4 font-bold text-right">POT USDG</th>
                <th className="pb-4 font-bold text-right">OUTCOME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] mono text-[14px]">
              {history.map((row) => (
                <tr key={row.round} className="hover:bg-[#f9f9f9] transition-colors">
                  {/* ROUND */}
                  <td className="py-5 text-[#0d0e1180] font-medium">
                    #{row.round}
                  </td>

                  {/* DRAWN (Bold Facto Pink/Emerald) */}
                  <td className="py-5 text-[18px] font-bold text-[#f243ac]">
                    {row.cell}
                  </td>

                  {/* CREW HOLDING IT */}
                  <td className="py-5 text-[#0d0e1180]">
                    {row.crew || '—'}
                  </td>

                  {/* POT ETH */}
                  <td className="py-5 text-right font-bold text-[#0d0e11]">
                    {row.potEth > 0 ? row.potEth : '0'}
                  </td>

                  {/* POT USDG */}
                  <td className="py-5 text-right text-[#0d0e11]">
                    {row.potUsdg || '0'}
                  </td>

                  {/* OUTCOME pill */}
                  <td className="py-5 text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[12px] mono text-[#0d0e1180] border border-[#e5e7eb] bg-[#f8f8f8] font-medium">
                      {row.refunded || row.potEth === 0 ? 'Returned' : 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* History read from block info */}
      <div className="mono text-[13px] text-[#0d0e1180] mb-14">
        history read from block 57019652 onward
      </div>

      {/* ================= GIANT BANNER & FOOTER SECTION (Screenshot 2) ================= */}
      <div className="pt-10 border-t border-[#e5e7eb]">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-[#e5e7eb]">
          
          {/* Big Brand Title in Facto Style */}
          <div>
            <h2 className="display text-[clamp(44px,7vw,80px)] font-bold text-[#0d0e11] leading-[0.95] tracking-tight">
              To<br />
              <span className="text-[#f243ac]">od</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
              Sixteen plots, one draw, and a pot that splits itself on chain, round after round, with nobody holding the pen
            </p>
          </div>

          {/* 16 Token Avatars in a Row */}
          <div className="flex items-center gap-2 flex-wrap max-w-md lg:justify-end">
            {GRID_TOKENS.map(token => (
              <div
                key={token.id}
                className="h-7 w-7 rounded-full overflow-hidden bg-white p-0.5 border border-[#e5e7eb] shadow-sm"
                title={token.name}
              >
                <img src={token.avatar} alt={token.name} className="h-full w-full object-cover rounded-full" />
              </div>
            ))}
          </div>

        </div>

        {/* Telemetry Links & Season Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 mono text-[13px] text-[#0d0e1180] border-b border-[#e5e7eb]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Chain <strong className="text-[#0d0e11] font-semibold">Robinhood 4663</strong></span>
            <span>Registry <strong className="text-[#0d0e11] font-semibold">0x8443...a963</strong></span>
            <span>Token <strong className="text-[#0d0e11] font-semibold">0x062e...4381</strong></span>
          </div>
          <div>
            Season one · 16 plots · 16 tokens
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 mono text-[13px] text-[#0d0e1180]">
          Tood is a game of chance · stake only what you can lose · nothing here is investment advice
        </div>
      </div>

    </div>
  );
};
