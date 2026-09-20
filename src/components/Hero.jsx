import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Trophy, Flame } from 'lucide-react';

export const Hero = () => {
  const { roundNumber, timeLeft, totalEthPot, totalUsdgPot, roundStatus } = useGame();
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 60) * 100));

  return (
    <div className="pt-14 pb-8 text-center max-w-[1240px] mx-auto px-5 sm:px-8">
      
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e6e6eb] shadow-sm mb-6 text-[12px] font-mono text-[#0d0e11]">
        <span className="h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
        <span className="font-semibold text-[#0d0e11]">Robinhood Chain EVM</span>
        <span className="text-[#0d0e1180]">·</span>
        <span className="text-[#f243ac] font-bold">Season 1 Live</span>
      </div>

      {/* Hero Title */}
      <h1 className="display text-[clamp(44px,6.8vw,84px)] font-bold text-[#0d0e11] tracking-tight leading-[1.04] max-w-4xl mx-auto">
        Sixteen claims,<br />
        one draw, winner<br />
        <span className="bg-gradient-to-r from-[#f243ac] via-[#f755b7] to-[#e0329a] bg-clip-text text-transparent">takes 90%</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 max-w-[640px] mx-auto text-[17px] sm:text-[19px] leading-relaxed text-[#0d0e1180] font-normal">
        Stake a plot before the clock runs out. The chain draws a single plot, and everyone standing on it walks away with ninety percent of the round.
      </p>

      {/* Round Stats Bar Card in Facto Style */}
      <div className="mt-10 facto-card p-6 sm:p-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* ROUND */}
          <div>
            <div className="flex items-center gap-1.5 label text-[#0d0e1180]">
              <Flame size={12} className="text-[#f243ac]" />
              <span>ROUND</span>
            </div>
            <div className="display text-[34px] sm:text-[40px] font-bold text-[#0d0e11] mt-0.5">
              #{roundNumber}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                roundStatus === 'betting' 
                  ? 'bg-[#e8f7ee] text-[#008638] border-[#008638]/20' 
                  : roundStatus === 'drawing' 
                  ? 'bg-[#fff5fa] text-[#f243ac] border-[#f243ac]/30 animate-pulse'
                  : 'bg-[#f4f4f4] text-[#0d0e1180] border-[#e6e6eb]'
              }`}>
                {roundStatus === 'betting' ? '● Open for Stakes' : roundStatus === 'drawing' ? '★ Drawing Winner...' : 'Settled'}
              </span>
            </div>
          </div>

          {/* CLOCK */}
          <div className="text-left md:text-center">
            <div className="flex items-center md:justify-center gap-1.5 label text-[#0d0e1180]">
              <Clock size={12} className={timeLeft <= 10 && roundStatus === 'betting' ? 'text-[#f243ac] animate-spin' : ''} />
              <span>ROUND CLOCK</span>
            </div>
            <div className={`mono text-[34px] sm:text-[40px] font-bold mt-0.5 tracking-wider ${
              timeLeft <= 10 && roundStatus === 'betting' ? 'text-[#f243ac] animate-pulse' : 'text-[#0d0e11]'
            }`}>
              {roundStatus === 'betting' ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : '--:--'}
            </div>
            <div className="mono text-[12px] text-[#0d0e1180] mt-1">
              {roundStatus === 'betting' ? `${timeLeft}s left to pick a plot` : 'Round in settlement'}
            </div>
          </div>

          {/* POT */}
          <div className="text-left md:text-right">
            <div className="flex items-center md:justify-end gap-1.5 label text-[#0d0e1180]">
              <Trophy size={12} className="text-[#008638]" />
              <span>TOTAL ROUND POT</span>
            </div>
            <div className="display text-[34px] sm:text-[40px] font-bold text-[#0d0e11] mt-0.5 flex items-baseline md:justify-end gap-2">
              <span>{totalEthPot > 0 ? totalEthPot.toFixed(2) : '0'}</span>
              <span className="mono text-[16px] font-normal text-[#0d0e1180]">ETH</span>
              <span className="mono text-[14px] text-[#0d0e1180] ml-2">
                +{totalUsdgPot > 0 ? totalUsdgPot : '1'} USDG
              </span>
            </div>
            <div className="mono text-[12px] text-[#008638] font-semibold mt-1">
              90% Payout = {+(totalEthPot * 0.9).toFixed(2)} ETH
            </div>
          </div>

        </div>

        {/* Shimmer progress bar underneath */}
        <div className="mt-6 h-2 w-full bg-[#f0f0f3] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#f755b7] to-[#f243ac] transition-all duration-1000 ease-linear rounded-full shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
