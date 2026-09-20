import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Award, Flame } from 'lucide-react';

export const Standings = () => {
  const { leaderboard } = useGame();
  const topThree = leaderboard.slice(0, 3);

  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[32px] sm:text-[40px] font-bold text-[#0d0e11] tracking-tight">
            Leaderboard
          </h2>
          <p className="text-[16px] text-[#0d0e1180] mt-1">
            Rebuilt in real-time from settled rounds on Robinhood Chain
          </p>
        </div>
        <span className="mono text-[12px] text-[#0d0e1180] bg-white px-3.5 py-1.5 rounded-full border border-[#e6e6eb] font-semibold shadow-sm">
          Season 1 Standings
        </span>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {topThree.map((player, idx) => {
          const isFirst = player.rank === 1;
          const isSecond = player.rank === 2;
          const isThird = player.rank === 3;
          const netPnl = +(player.wonEth - player.stakedEth).toFixed(2);

          return (
            <div
              key={player.rank}
              className={`facto-card p-6 flex flex-col justify-between relative overflow-hidden ${
                isFirst ? 'ring-2 ring-[#f243ac] shadow-[0_8px_30px_rgba(242,67,172,0.15)]' : ''
              }`}
            >
              {isFirst && (
                <div className="absolute top-0 right-0 bg-[#f243ac] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Champion
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-[16px] shadow-sm ${
                    isFirst
                      ? 'bg-gradient-to-br from-[#ffd700] to-[#ffa500] text-black'
                      : isSecond
                      ? 'bg-gradient-to-br from-[#e0e0e0] to-[#b0b0b0] text-black'
                      : 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white'
                  }`}>
                    {isFirst ? <Trophy size={18} /> : isSecond ? <Medal size={18} /> : <Award size={18} />}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#0d0e1180] font-bold uppercase tracking-wider">
                      RANK #{player.rank}
                    </div>
                    <div className="text-[16px] font-bold text-[#0d0e11] mono">
                      {player.address}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#f0f0f3] my-2">
                  <div>
                    <div className="label text-[10px]">TOTAL WON</div>
                    <div className="display text-[20px] font-bold text-[#008638] mt-0.5">
                      +{player.wonEth} ETH
                    </div>
                  </div>
                  <div>
                    <div className="label text-[10px]">NET PROFIT</div>
                    <div className="display text-[20px] font-bold text-[#f243ac] mt-0.5">
                      +{netPnl} ETH
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mono text-[12px] text-[#0d0e1180] pt-3">
                <span>Win Rate: <strong className="text-[#0d0e11]">{player.winRate}</strong></span>
                <span>{player.roundsPlayed} Rounds</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standings Table */}
      <div className="facto-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f0f3] bg-[#f8f8fa] text-[11px] label">
                <th className="px-6 py-4 font-bold">Rank</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold text-right">Won ETH</th>
                <th className="px-6 py-4 font-bold text-right">Won USDG</th>
                <th className="px-6 py-4 font-bold text-right">Net PnL</th>
                <th className="px-6 py-4 font-bold text-right">Win Rate</th>
                <th className="px-6 py-4 font-bold text-right">Rounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f3] mono text-[13px]">
              {leaderboard.map((p) => {
                const net = +(p.wonEth - p.stakedEth).toFixed(2);
                return (
                  <tr key={p.rank} className="hover:bg-[#f8f8fa] transition-colors">
                    <td className="px-6 py-4">
                      {p.rank === 1 ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f243ac] text-white font-bold text-[11px]">
                          1
                        </span>
                      ) : (
                        <span className="text-[#0d0e1180] font-semibold">#{p.rank}</span>
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
