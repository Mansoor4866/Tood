import React from 'react';
import { useSound } from '../context/SoundContext';
import { 
  Wallet, 
  Coins, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  DollarSign,
  Flame
} from 'lucide-react';
import { HOUSE_RULES } from '../data/mockData';

export const HowToPlayView = ({ onGoToGrid }) => {
  const { playClick } = useSound();

  const STEPS = [
    {
      step: '01',
      title: 'Connect Wallet & Select Currency',
      desc: 'Connect your MetaMask, Rabby, or Web3 wallet to Robinhood Chain (Chain ID: 2340). Choose whether you want to stake in native ETH or USDG ($1 Stablecoin).',
      icon: Wallet,
      color: '#0053ff',
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'Stake on the 16 Grid Plots',
      desc: 'Pick any character plot (A1 to D4). You can stake on a single plot for a concentrated jackpot or spread across multiple plots to maximize your winning odds.',
      icon: Coins,
      color: '#f243ac',
      badge: 'Step 2'
    },
    {
      step: '03',
      title: '15-Minute Countdown & Fair Play Draw',
      desc: 'Each round lasts exactly 15 minutes. When the timer hits 00:00, all empty plots (0 stakes) are excluded, and a winning plot is selected strictly from active staked plots!',
      icon: Clock,
      color: '#008638',
      badge: 'Step 3'
    },
    {
      step: '04',
      title: 'Win 90% Pot & Instant On-Chain Claim',
      desc: 'Winning stakers share 90% of the entire round pot proportionate to their stake. Click "Claim Winnings" to trigger an automated on-chain transfer directly to your wallet!',
      icon: Trophy,
      color: '#f59e0b',
      badge: 'Step 4'
    }
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-10 pb-6 border-b border-[#e6e6eb]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] text-[12px] font-mono text-[#0d0e11] mb-3 shadow-xs">
            <Sparkles size={13} className="text-[#f243ac]" />
            <span>Official Guide & Protocol Rules</span>
          </div>
          <h1 className="display text-[34px] sm:text-[46px] font-bold text-[#0d0e11] tracking-tight">
            How to Play Tood
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#0d0e1180] mt-1 max-w-2xl">
            Everything you need to know about staking, 15-minute draws, the 90% pot distribution, and instant on-chain payouts.
          </p>
        </div>

        <button
          onClick={() => { playClick(); onGoToGrid?.(); }}
          className="btn-pink text-[14px] font-bold px-6 py-3 flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <span>Play on the Grid</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Steps Grid */}
      <div className="mb-14">
        <h2 className="display text-[24px] font-bold text-[#0d0e11] mb-6">
          The 4-Step Game Loop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => {
            const IconComp = s.icon;
            return (
              <div 
                key={s.step} 
                className="facto-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all border border-[#e6e6eb]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f8f8fa] text-[#0d0e1180] border border-[#e6e6eb]">
                      {s.badge}
                    </span>
                    <div 
                      className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: s.color }}
                    >
                      <IconComp size={18} />
                    </div>
                  </div>

                  <h3 className="display text-[19px] font-bold text-[#0d0e11] mt-2 leading-snug">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-relaxed text-[#0d0e1180]">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#f0f0f3] flex items-center justify-between text-[11px] mono text-[#0d0e1160]">
                  <span>Robinhood Chain</span>
                  <span className="font-bold text-[#0d0e11]">Step {s.step}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Currency Deep Dive (ETH vs USDG) */}
      <div className="mb-14 facto-card p-7 sm:p-9 bg-white border border-[#e6e6eb]">
        <div className="max-w-2xl mb-7">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#008638] mb-2">
            <Coins size={14} />
            <span>Dual Currency Protocol</span>
          </div>
          <h2 className="display text-[28px] sm:text-[34px] font-bold text-[#0d0e11]">
            How ETH & USDG Pots Work on the Same Table
          </h2>
          <p className="text-[15px] text-[#0d0e1180] mt-1">
            Both ETH and USDG stakers compete simultaneously on the exact same 16-plot grid board, but their pots settle independently so no exchange rate volatility affects payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ETH Pool Card */}
          <div className="p-6 rounded-2xl bg-[#f8f8fa] border border-[#e6e6eb]">
            <div className="flex items-center gap-2.5 text-[#0053ff] font-bold text-[16px] mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#0053ff]/10 flex items-center justify-center">
                <Flame size={17} />
              </div>
              <span>Native ETH Pot (High Multiplier)</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] leading-relaxed mb-4">
              All ETH staked by players pools together into the round's ETH pot. If your plot is drawn, you receive <strong>90% of the entire ETH pot</strong> distributed across winning plot ETH stakers.
            </p>
            <div className="px-3 py-2 rounded-xl bg-white border border-[#e6e6eb] text-[12px] mono text-[#0d0e11]">
              <strong>Winner Gets:</strong> 90% of Total ETH Pot
            </div>
          </div>

          {/* USDG Pool Card */}
          <div className="p-6 rounded-2xl bg-[#e8f7ee] border border-[#008638]/20">
            <div className="flex items-center gap-2.5 text-[#008638] font-bold text-[16px] mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#008638]/10 flex items-center justify-center">
                <DollarSign size={17} />
              </div>
              <span>USDG Stablecoin Pot ($1 Pegged)</span>
            </div>
            <p className="text-[14px] text-[#0d0e1180] leading-relaxed mb-4">
              All USDG staked by players pools together into the USDG pot. Ideal for risk-averse players who want pure dollar-based wagering without cryptocurrency market volatility.
            </p>
            <div className="px-3 py-2 rounded-xl bg-white border border-[#008638]/20 text-[12px] mono text-[#008638]">
              <strong>Winner Gets:</strong> 90% of Total USDG Pot
            </div>
          </div>
        </div>
      </div>

      {/* House Rules & Pot Distribution */}
      <div className="mb-14">
        <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-wider text-[#f243ac] mb-2">
          <ShieldCheck size={14} />
          <span>On-Chain Governance</span>
        </div>
        <h2 className="display text-[28px] sm:text-[34px] font-bold text-[#0d0e11] mb-6">
          The 4 House Rules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HOUSE_RULES.map((rule) => (
            <div key={rule.num} className="facto-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="mono text-[12px] text-[#f243ac] font-bold">
                    RULE {rule.num}
                  </span>
                  <CheckCircle2 size={16} className="text-[#008638]" />
                </div>
                <h3 className="display text-[20px] font-bold text-[#0d0e11] mt-1">
                  {rule.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#0d0e1180]">
                  {rule.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0f0f3] flex items-center justify-between text-[11px] mono text-[#0d0e1160]">
                <span>Robinhood Chain Verified</span>
                <span className="text-[#0d0e11] font-semibold">90% Payout / 10% Fee</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fair Play Highlight Banner */}
      <div className="facto-card p-8 bg-[#0d0e11] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono font-bold text-[#f243ac] mb-3">
            <Trophy size={13} />
            <span>FAIR PLAY GUARANTEE</span>
          </div>
          <h3 className="display text-[26px] sm:text-[30px] font-bold text-white">
            Ready to stake your claim?
          </h3>
          <p className="text-[14px] text-gray-400 mt-1 max-w-xl">
            Rounds run every 15 minutes. Empty plots are excluded, and winning players walk away with ninety percent of the round pot.
          </p>
        </div>

        <button
          onClick={() => { playClick(); onGoToGrid?.(); }}
          className="btn-pink px-8 py-4 text-[15px] font-bold whitespace-nowrap shadow-xl"
        >
          Enter Next Round
        </button>
      </div>

    </div>
  );
};
