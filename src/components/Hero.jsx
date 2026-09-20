import React from 'react';
import { useGame } from '../context/GameContext';

export const Hero = () => {
  const { roundNumber, timeLeft, totalEthPot, totalUsdgPot, roundStatus } = useGame();
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 60) * 100));

  return (
    <div className="pt-12 pb-8 text-center max-w-[1240px] mx-auto px-5 sm:px-8">
      
      {/* Hero Title */}
      <h1 className="display text-[clamp(42px,6.5vw,80px)] font-bold text-[#0d0e11] tracking-tight leading-[1.06] max-w-4xl mx-auto">
        Sixteen claims,<br />
        one draw, winner<br />
        <span className="text-[#f243ac]">takes 90%</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 max-w-[620px] mx-auto text-[17px] sm:text-[19px] leading-relaxed text-[#0d0e1180]">
        Stake a plot before the clock runs out. The chain then draws a single plot, and everyone standing on it walks away with ninety percent of the round
      </p>

      {/* Round Stats Bar Card in Facto Style */}
      <div className="mt-10 facto-card p-6 sm:p-7 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* ROUND */}
          <div>
            <div className="label">ROUND</div>
            <div className="display text-[34px] sm:text-[38px] font-bold text-[#0d0e11] mt-0.5">
              #{roundNumber}
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#f4f4f4] text-[#0d0e1180] border border-[#e5e7eb]">
                {roundStatus === 'betting' ? 'Live' : roundStatus === 'drawing' ? 'Drawing...' : 'Settled'}
              </span>
            </div>
          </div>

          {/* CLOCK */}
          <div className="text-left md:text-center">
            <div className="label">CLOCK</div>
            <div className={`mono text-[34px] sm:text-[38px] font-bold mt-0.5 tracking-wider ${
              timeLeft <= 10 && roundStatus === 'betting' ? 'text-[#f243ac]' : 'text-[#0d0e11]'
            }`}>
              {roundStatus === 'betting' ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : '--:--'}
            </div>
            <div className="mono text-[12px] text-[#0d0e1180] mt-1">
              {roundStatus === 'betting' ? 'Open for stakes' : 'Round settled'}
            </div>
          </div>

          {/* POT */}
          <div className="text-left md:text-right">
            <div className="label">POT</div>
            <div className="display text-[34px] sm:text-[38px] font-bold text-[#0d0e11] mt-0.5 flex items-baseline md:justify-end gap-2">
              <span>{totalEthPot > 0 ? totalEthPot.toFixed(2) : '0'}</span>
              <span className="mono text-[16px] font-normal text-[#0d0e1180]">ETH</span>
              <span className="mono text-[14px] text-[#0d0e1180] ml-3">
                {totalUsdgPot > 0 ? totalUsdgPot : '1'} USDG
              </span>
            </div>
          </div>

        </div>

        {/* Progress bar underneath */}
        <div className="mt-6 h-1.5 w-full bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f243ac] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
