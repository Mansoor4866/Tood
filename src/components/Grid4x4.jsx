import React from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Trophy, ShieldCheck, ArrowUpRight, Plus } from 'lucide-react';

export const Grid4x4 = () => {
  const { plots, userStakes, selectedPlot, setSelectedPlot, highlightedPlotId, winningPlot } = useGame();
  const { playClick } = useSound();

  return (
    <section className="max-w-[1376px] mx-auto px-4 sm:px-8 mb-16">
      
      {/* Section Sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="display text-[26px] font-bold text-facto-dark">
            The 16-Plot Matrix
          </h2>
          <p className="text-[14px] text-facto-muted mt-0.5">
            Select a plot to deploy your stake. Proportional 90% payout is guaranteed on draw.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] mono text-facto-muted bg-white px-3.5 py-1.5 rounded-full border border-facto-border">
          <span className="h-2 w-2 rounded-full bg-facto-emerald" />
          <span>Real-time On-Chain Ledger</span>
        </div>
      </div>

      {/* 4x4 Grid Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {plots.map((plot) => {
          const userStake = userStakes[plot.id];
          const hasUserStake = userStake && (userStake.eth > 0 || userStake.usdg > 0);
          const isHighlighted = highlightedPlotId === plot.id;
          const isWinner = winningPlot?.id === plot.id;
          const isSelected = selectedPlot?.id === plot.id;

          return (
            <div
              key={plot.id}
              onClick={() => {
                playClick();
                setSelectedPlot(plot);
              }}
              className={`v2-card p-5 sm:p-6 flex flex-col justify-between cursor-pointer select-none relative overflow-hidden transition-all duration-200 ${
                isWinner
                  ? 'winner-cell scale-[1.03]'
                  : isHighlighted
                  ? 'draw-active scale-[1.02]'
                  : isSelected
                  ? 'border-2 border-facto-pink shadow-lg'
                  : 'hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {/* Card Top: Coordinate + Token Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="mono text-[13px] font-bold px-2 py-0.5 rounded-md bg-[#f4f4f4] text-facto-dark border border-black/5">
                    {plot.cell}
                  </span>
                  <span className="text-[14px] font-bold text-facto-dark">
                    ${plot.symbol}
                  </span>
                </div>

                {isWinner ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-facto-pink text-white flex items-center gap-1 shadow-sm">
                    <Trophy size={11} /> WINNER
                  </span>
                ) : hasUserStake ? (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#e8f7ee] text-facto-emerald flex items-center gap-1 border border-facto-emerald/20">
                    <ShieldCheck size={11} /> STAKED
                  </span>
                ) : (
                  <span className="mono text-[11px] text-facto-muted font-medium">
                    #{plot.id + 1}
                  </span>
                )}
              </div>

              {/* Plot Token Details & Current Stakes */}
              <div className="my-5">
                <div className="text-[13px] text-facto-muted truncate font-medium">
                  {plot.name}
                </div>
                <div className="display text-[26px] font-bold text-facto-dark tracking-tight mt-1">
                  {plot.ethStake.toFixed(2)} <span className="text-[14px] font-mono font-normal text-facto-muted">ETH</span>
                </div>
                <div className="mono text-[12px] text-facto-muted mt-0.5">
                  {plot.usdgStake.toLocaleString()} USDG
                </div>
              </div>

              {/* Card Bottom: Stakers & Stake Action */}
              <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[12px] mono">
                <span className="text-facto-muted">
                  {plot.stakersCount} {plot.stakersCount === 1 ? 'staker' : 'stakers'}
                </span>

                {hasUserStake ? (
                  <span className="text-facto-pink font-bold">
                    You: {userStake.eth > 0 ? `${userStake.eth} ETH` : `${userStake.usdg} USDG`}
                  </span>
                ) : (
                  <span className="text-facto-dark font-medium group-hover:text-facto-pink flex items-center gap-0.5">
                    Stake <ArrowUpRight size={13} />
                  </span>
                )}
              </div>

              {/* Accent Color Indicator Bar at Top */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: isWinner || isHighlighted ? '#f243ac' : (plot.color || '#0d0e11') }}
              />
            </div>
          );
        })}
      </div>

    </section>
  );
};
