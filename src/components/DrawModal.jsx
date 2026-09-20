import React from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Trophy, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

export const DrawModal = () => {
  const { winnerDetails, winningPlot, roundStatus, resetRound } = useGame();
  const { playClick } = useSound();

  if (roundStatus !== 'settled' || !winnerDetails || !winningPlot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-7 text-center border border-[#e6e6eb] shadow-2xl overflow-hidden">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f755b7] to-[#f243ac]" />

        {/* Trophy Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff5fa] border border-[#f243ac]/30 text-[#f243ac] mb-4 shadow-sm">
          <Trophy size={32} />
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wider text-[#f243ac] font-mono">
          Round #{winnerDetails.round} Settled
        </div>

        <h2 className="display text-[32px] font-bold text-[#0d0e11] mt-1">
          Plot {winningPlot.cell} Wins the Pot!
        </h2>

        <p className="mono text-[13px] text-[#0d0e1180] mt-1">
          ${winningPlot.symbol} ({winningPlot.name})
        </p>

        {/* User Victory Announcement if won */}
        {winnerDetails.userWon ? (
          <div className="my-5 p-4 rounded-2xl bg-[#e8f7ee] border border-[#008638]/30 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#008638] font-bold text-[15px]">
              <Sparkles size={16} /> YOU WON THE DRAW! <Sparkles size={16} />
            </div>
            <div className="display text-[26px] font-bold text-[#0d0e11] mt-1">
              +{winnerDetails.userPayoutEth > 0 ? `${winnerDetails.userPayoutEth} ETH` : ''}
              {winnerDetails.userPayoutUsdg > 0 ? ` +${winnerDetails.userPayoutUsdg} USDG` : ''}
            </div>
            <div className="mono text-[11px] text-[#008638] font-semibold mt-0.5">
              Credited directly to your wallet balance
            </div>
          </div>
        ) : (
          <div className="my-5 p-4 rounded-2xl bg-[#f8f8fa] border border-[#e6e6eb]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0d0e1180] font-mono">
              Total 90% Pot Distributed
            </div>
            <div className="display text-[24px] font-bold text-[#0d0e11] mt-1">
              {winnerDetails.potEth} ETH <span className="text-[16px] text-[#0d0e1180]">&</span> {winnerDetails.potUsdg} USDG
            </div>
            <div className="mono text-[12px] text-[#0d0e1180] mt-1">
              Shared between {winnerDetails.winnerCount} plot stakers
            </div>
          </div>
        )}

        {/* Explorer Verification */}
        <div className="flex items-center justify-between text-[12px] mono text-[#0d0e1180] border-t border-[#f0f0f3] pt-4 mb-5">
          <span>Block #{winnerDetails.block}</span>
          <a
            href="https://robinhoodchain.blockscout.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#0053ff] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Tx: {winnerDetails.txHash}</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Next Round Button */}
        <button
          onClick={() => { playClick(); resetRound(); }}
          className="btn-pink w-full text-[15px] font-bold py-3.5 flex items-center justify-center gap-2"
        >
          <span>Start Next Round #{winnerDetails.round + 1}</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
};
