import React from 'react';
import { useGame } from '../context/GameContext';

export const Standings = () => {
  const { leaderboard } = useGame();

  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[32px] sm:text-[38px] font-bold text-[#0d0e11] tracking-tight">
            Leaderboard
          </h2>
          <p className="text-[16px] text-[#0d0e1180] mt-1">
            Rebuilt from settled rounds on Robinhood Chain
          </p>
        </div>
        <span className="mono text-[13px] text-[#0d0e1180] bg-white px-3.5 py-1.5 rounded-full border border-[#e5e7eb] font-medium">
          Season 1 Standings
        </span>
      </div>

      <div className="facto-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f0f0] bg-[#f8f8f8] text-[12px] label">
                <th className="px-6 py-4 font-bold">Rank</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold text-right">Won ETH</th>
                <th className="px-6 py-4 font-bold text-right">Won USDG</th>
                <th className="px-6 py-4 font-bold text-right">Net PnL</th>
                <th className="px-6 py-4 font-bold text-right">Win Rate</th>
                <th className="px-6 py-4 font-bold text-right">Rounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] mono text-[13px]">
              {leaderboard.map((p) => {
                const net = +(p.wonEth - p.stakedEth).toFixed(2);
                return (
                  <tr key={p.rank} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-6 py-4">
                      {p.rank === 1 ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f243ac] text-white font-bold text-[11px]">
                          1
                        </span>
                      ) : (
                        <span className="text-[#0d0e1180] font-medium">#{p.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#0d0e11] font-bold">{p.address}</td>
                    <td className="px-6 py-4 text-right text-[#008638] font-bold">+{p.wonEth} ETH</td>
                    <td className="px-6 py-4 text-right text-[#0d0e11]">+{p.wonUsdg} USDG</td>
                    <td className="px-6 py-4 text-right text-[#f243ac] font-bold">+{net} ETH</td>
                    <td className="px-6 py-4 text-right text-[#0d0e1180]">{p.winRate}</td>
                    <td className="px-6 py-4 text-right text-[#0d0e1180]">{p.roundsPlayed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
