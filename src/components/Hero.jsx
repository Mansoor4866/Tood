import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Trophy, Flame, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Hero = () => {
  const { roundNumber, timeLeft, totalEthPot, totalUsdgPot, roundStatus } = useGame();
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 60) * 100));
  const canvasRef = useRef(null);

  // Subtle Interactive Floating Particles & Web3 Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = 420;
      }
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#f243ac' : '#008638',
      alpha: Math.random() * 0.35 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(242, 67, 172, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative pt-12 pb-8 text-center max-w-[1240px] mx-auto px-5 sm:px-8 overflow-hidden">
      
      {/* Interactive Background Particle Field Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[420px] pointer-events-none opacity-60 z-0"
      />

      {/* Glowing Ambient Aura Behind Headline */}
      <div className="absolute top-[180px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[220px] bg-gradient-to-r from-[#f243ac]/20 via-[#f755b7]/15 to-[#008638]/15 rounded-full blur-3xl pointer-events-none animate-aura z-0" />

      {/* Floating Animated Web3 Event Pills (Left & Right) */}
      <div className="hidden xl:block absolute left-4 top-24 z-10 animate-float-slow">
        <div className="facto-card px-3.5 py-2 flex items-center gap-2.5 text-[12px] mono border border-[#e6e6eb] bg-white/90 backdrop-blur-md shadow-md">
          <div className="h-6 w-6 rounded-full bg-[#fff5fa] border border-[#f243ac]/30 flex items-center justify-center text-[#f243ac]">
            <Zap size={13} />
          </div>
          <div className="text-left">
            <div className="text-[#0d0e11] font-bold">+1.45 ETH Staked</div>
            <div className="text-[#0d0e1180] text-[10px]">Plot A1 ($PONS)</div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute right-4 top-28 z-10 animate-float-reverse">
        <div className="facto-card px-3.5 py-2 flex items-center gap-2.5 text-[12px] mono border border-[#e6e6eb] bg-white/90 backdrop-blur-md shadow-md">
          <div className="h-6 w-6 rounded-full bg-[#e8f7ee] border border-[#008638]/30 flex items-center justify-center text-[#008638]">
            <ShieldCheck size={13} />
          </div>
          <div className="text-left">
            <div className="text-[#0d0e11] font-bold">90% Payout Split</div>
            <div className="text-[#008638] text-[10px] font-semibold">0% House Edge</div>
          </div>
        </div>
      </div>

      {/* Relative container for content */}
      <div className="relative z-10">
        
        {/* Eyebrow badge with animated glow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#e6e6eb] shadow-sm mb-6 text-[12px] font-mono text-[#0d0e11] hover:border-[#f243ac]/40 transition-colors">
          <span className="h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
          <span className="font-bold text-[#0d0e11]">Robinhood Chain EVM</span>
          <span className="text-[#0d0e114d]">·</span>
          <span className="text-[#f243ac] font-bold flex items-center gap-1">
            <Sparkles size={12} />
            Season 1 Live
          </span>
        </div>

        {/* Hero Title with Shimmer Gradient */}
        <h1 className="display text-[clamp(44px,7vw,86px)] font-bold text-[#0d0e11] tracking-tight leading-[1.04] max-w-4xl mx-auto">
          Sixteen claims,<br />
          one draw, winner<br />
          <span className="bg-gradient-to-r from-[#f243ac] via-[#f755b7] to-[#e0329a] bg-clip-text text-transparent animate-shimmer-text">
            takes 90%
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-[640px] mx-auto text-[17px] sm:text-[19px] leading-relaxed text-[#0d0e1180] font-normal">
          Stake a plot before the clock runs out. The chain draws a single plot, and everyone standing on it walks away with ninety percent of the round.
        </p>

        {/* Round Stats Bar Card in Facto Style */}
        <div className="mt-10 facto-card p-6 sm:p-8 text-left bg-white/95 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* ROUND */}
            <div>
              <div className="flex items-center gap-1.5 label text-[#0d0e1180]">
                <Flame size={12} className="text-[#f243ac]" />
                <span>CURRENT ROUND</span>
              </div>
              <div className="display text-[34px] sm:text-[40px] font-bold text-[#0d0e11] mt-0.5">
                #{roundNumber}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
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
              <div className="mono text-[12px] text-[#008638] font-bold mt-1">
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

    </div>
  );
};
