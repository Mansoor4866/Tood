import React from 'react';
import { useGame } from '../context/GameContext';
import { GRID_TOKENS } from '../data/mockData';
import { BarChart3, Database } from 'lucide-react';

export const HistoryLog = () => {
  const { history } = useGame();

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-20">
      
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <div>
          <h1 className="display text-[36px] sm:text-[44px] font-bold text-[#0d0e11] tracking-tight">
            The record
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#0d0e1180] mt-1">
            Every round that ever settled, read straight out of the contract log
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e6e6eb] mono text-[12px] text-[#0d0e1180] shadow-sm">
          <Database size={13} className="text-[#008638]" />
          <span>Synced with Supabase</span>
        </div>
      </div>

      {/* ================= POT PER ROUND BAR CHART CARD ================= */}
      <div className="facto-card p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between text-[13px] mono text-[#0d0e1180] mb-6">
          <div className="flex items-center gap-2 font-sans font-bold text-[17px] text-[#0d0e11]">
            <BarChart3 size={18} className="text-[#f243ac]" />
            <span>Pot Volume Distribution</span>
          </div>
          <span className="font-semibold px-2.5 py-0.5 rounded-full bg-[#f4f4f6] text-[#0d0e11]">ETH / Round</span>
        </div>

        {/* Minimalist Bar Chart in Facto Style */}
        <div className="h-32 flex items-end gap-3 px-2 border-b border-[#f0f0f3] pb-3">
          {history.map((row, idx) => {
            const maxPot = Math.max(...history.map(h => h.potEth), 2);
            const heightPct = Math.max(18, Math.min(100, (row.potEth / maxPot) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative" title={`Round #${row.round}: ${row.potEth} ETH`}>
                <div
                  className="w-full max-w-[40px] rounded-lg bg-[#0d0e11] group-hover:bg-[#f243ac] transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(242,67,172,0.4)]"
                  style={{ height: `${heightPct}px` }}
                />
                <span className="mono text-[10px] text-[#0d0e1180] font-semibold">#{row.round}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SETTLED ROUNDS TABLE ================= */}
      <div className="facto-card p-6 sm:p-8 mb-10 overflow-hidden">
        
        {/* Table Title */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#f0f0f3]">
          <div className="text-[17px] font-bold text-[#0d0e11]">
            {history.length} Settled Rounds on the Books
          </div>
          <span className="mono text-[11px] text-[#0d0e1180]">
            Block range: #1984159 → latest
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f0f3] bg-[#f8f8fa] text-[11px] mono text-[#0d0e1180] tracking-wider uppercase font-bold">
                <th className="py-3.5 px-4 font-bold">ROUND</th>
                <th className="py-3.5 px-4 font-bold">DRAWN</th>
                <th className="py-3.5 px-4 font-bold">CREW HOLDING IT</th>
                <th className="py-3.5 px-4 font-bold text-right">POT ETH</th>
                <th className="py-3.5 px-4 font-bold text-right">POT USDG</th>
                <th className="py-3.5 px-4 font-bold text-right">OUTCOME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f3] mono text-[14px]">
              {history.map((row) => (
                <tr key={row.round} className="hover:bg-[#f8f8fa] transition-colors">
                  {/* ROUND */}
                  <td className="py-4 px-4 text-[#0d0e1180] font-medium">
                    #{row.round}
                  </td>

                  {/* DRAWN */}
                  <td className="py-4 px-4 text-[18px] font-bold text-[#f243ac]">
                    {row.cell}
                  </td>

                  {/* CREW HOLDING IT */}
                  <td className="py-4 px-4 text-[#0d0e1180]">
                    {row.crew || '—'}
                  </td>

                  {/* POT ETH */}
                  <td className="py-4 px-4 text-right font-bold text-[#0d0e11]">
                    {row.potEth > 0 ? row.potEth : '0'} ETH
                  </td>

                  {/* POT USDG */}
                  <td className="py-4 px-4 text-right text-[#0d0e11]">
                    {row.potUsdg || '0'} USDG
                  </td>

                  {/* OUTCOME pill */}
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-[12px] mono font-semibold border ${
                      row.refunded || row.potEth === 0
                        ? 'text-[#0d0e1180] border-[#e6e6eb] bg-[#f8f8fa]'
                        : 'text-[#008638] border-[#008638]/30 bg-[#e8f7ee]'
                    }`}>
                      {row.refunded || row.potEth === 0 ? 'Returned' : 'Paid 90%'}
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

      {/* ================= GIANT BANNER & FOOTER SECTION ================= */}
      <div className="pt-10 border-t border-[#e6e6eb]">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-[#e6e6eb]">
          
          {/* Big Brand Title in Facto Style */}
          <div>
            <h2 className="display text-[clamp(48px,7.5vw,88px)] font-bold text-[#0d0e11] leading-[0.95] tracking-tight">
              To<br />
              <span className="text-[#f243ac]">od</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] sm:text-[16px] text-[#0d0e1180] leading-relaxed">
              Sixteen plots, one draw, and a pot that splits itself on chain, round after round, with nobody holding the pen.
            </p>
          </div>

          {/* 16 Token Avatars in a Row */}
          <div className="flex items-center gap-2 flex-wrap max-w-md lg:justify-end">
            {GRID_TOKENS.map(token => (
              <div
                key={token.id}
                className="h-8 w-8 rounded-full overflow-hidden bg-white p-0.5 border border-[#e6e6eb] shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title={token.name}
              >
                <img src={token.avatar} alt={token.name} className="h-full w-full object-cover rounded-full" />
              </div>
            ))}
          </div>

        </div>

        {/* Telemetry Links & Season Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 mono text-[13px] text-[#0d0e1180] border-b border-[#e6e6eb]">
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
