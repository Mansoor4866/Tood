import React from 'react';
import { Trophy, Zap, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LiveActivityTicker = () => {
  const { history, roundNumber } = useGame();

  const TICKER_ITEMS = [
    { type: 'win', icon: Trophy, color: '#008638', text: '0x71C...8921 won +1.80 ETH', sub: 'Round #41' },
    { type: 'stake', icon: Zap, color: '#0053ff', text: '0x4ed4...9ece staked 0.05 ETH on Plot B1', sub: 'Just now' },
    { type: 'win', icon: Trophy, color: '#008638', text: '0x3Fa...4412 won +0.95 ETH', sub: 'Round #40' },
    { type: 'verified', icon: ShieldCheck, color: '#f243ac', text: '90% Pot Payout Verified on Robinhood Chain', sub: 'EVM 2340' },
    { type: 'win', icon: Trophy, color: '#008638', text: '0x99B...a3F1 won +1.15 ETH', sub: 'Round #39' },
    { type: 'token', icon: Flame, color: '#ff7849', text: 'Plot B1 ($PEPE) Leading Pot Stakes', sub: 'Live' },
    { type: 'win', icon: Trophy, color: '#008638', text: '0x0c58...c219 won +0.55 ETH', sub: 'Round #38' },
    { type: 'rule', icon: Sparkles, color: '#008638', text: 'Guaranteed Winner Drawn Every 15 Mins', sub: 'Fair Play' },
  ];

  // If recent real history exists, prepend it
  const displayItems = [
    ...(history && Array.isArray(history) && history.length > 0
      ? history.slice(0, 3).map(h => ({
          type: 'win',
          icon: Trophy,
          color: '#008638',
          text: `Plot ${h?.cell || 'WIN'} won +${h?.potEth || h?.potUsdg || '0.5'} ${h?.potEth ? 'ETH' : 'USDG'}`,
          sub: `Round #${h?.round || roundNumber || 1}`
        }))
      : []),
    ...TICKER_ITEMS
  ];

  return (
    <div className="w-full bg-[#fcfcfe] border-y border-[#e6e6eb] py-2 overflow-hidden select-none relative z-20">
      <div className="flex items-center">
        {/* Sticky Label on Desktop */}
        <div className="hidden sm:flex items-center gap-1.5 px-4 shrink-0 border-r border-[#e6e6eb] bg-[#fcfcfe] z-10 text-[11px] font-mono font-bold text-[#0d0e11]">
          <span className="h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
          <span>LIVE ACTIVITY</span>
        </div>

        {/* Marquee Track */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee flex items-center gap-8 pl-4">
            {/* First Set */}
            {displayItems.map((item, idx) => {
              const IconComp = item.icon || Trophy;
              return (
                <div key={`a-${idx}`} className="flex items-center gap-2 text-[12px] mono shrink-0 text-[#0d0e11]">
                  <div 
                    className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color || '#008638'}18`, color: item.color || '#008638' }}
                  >
                    <IconComp size={11} />
                  </div>
                  <span className="font-semibold">{item.text}</span>
                  <span className="text-[10px] text-[#0d0e1180] px-1.5 py-0.2 rounded bg-black/5">
                    {item.sub}
                  </span>
                  <span className="text-[#0d0e1126] ml-2">/</span>
                </div>
              );
            })}

            {/* Second Duplicate Set for Continuous Infinite Loop */}
            {displayItems.map((item, idx) => {
              const IconComp = item.icon || Trophy;
              return (
                <div key={`b-${idx}`} className="flex items-center gap-2 text-[12px] mono shrink-0 text-[#0d0e11]">
                  <div 
                    className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color || '#008638'}18`, color: item.color || '#008638' }}
                  >
                    <IconComp size={11} />
                  </div>
                  <span className="font-semibold">{item.text}</span>
                  <span className="text-[10px] text-[#0d0e1180] px-1.5 py-0.2 rounded bg-black/5">
                    {item.sub}
                  </span>
                  <span className="text-[#0d0e1126] ml-2">/</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
