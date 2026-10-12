import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { Trophy, ArrowRight, ExternalLink, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { requestPayoutTransfer, supabase } from '../lib/supabase';

export const DrawModal = () => {
  const { winnerDetails, winningPlot, roundStatus, resetRound } = useGame();
  const { walletAddress } = useWallet();
  const { playClick, playWin } = useSound();

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState(null);
  const [claimError, setClaimError] = useState(null);

  // Check if winnings for this round are already claimed in database
  useEffect(() => {
    let isMounted = true;
    if (winnerDetails?.round && walletAddress && supabase) {
      supabase
        .from('claims')
        .select('*')
        .eq('round_number', winnerDetails.round)
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle()
        .then(({ data }) => {
          if (isMounted && data && data.status === 'claimed' && data.tx_hash) {
            setClaimTxHash(data.tx_hash);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [winnerDetails?.round, walletAddress]);

  if (roundStatus !== 'settled' || !winnerDetails || !winningPlot) return null;

  const handleClaimPayout = async () => {
    if (!walletAddress) {
      setClaimError('Please connect your wallet first.');
      return;
    }
    playClick();
    setIsClaiming(true);
    setClaimError(null);

    try {
      const res = await requestPayoutTransfer({
        roundNumber: winnerDetails.round,
        walletAddress,
        amountEth: winnerDetails.userPayoutEth
      });
      if (res?.txHash) {
        setClaimTxHash(res.txHash);
        if (playWin) playWin();
      }
    } catch (err) {
      setClaimError(err.message || 'Payout failed. Treasury wallet may be funding or pending setup.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-7 text-center border border-[#e6e6eb] shadow-2xl overflow-hidden">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f755b7] to-[#f243ac]" />

        {/* TOOD Mascot Winner Celebration Badge */}
        <div className="mx-auto relative h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-[#f243ac]/20 shadow-xl mb-4 group">
          <img src="/assets/TOOD PFP.png" alt="TOOD Mascot" className="w-full h-full object-cover" />
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#f243ac] text-white flex items-center justify-center shadow-md border-2 border-white">
            <Trophy size={13} />
          </div>
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

            {claimTxHash ? (
              <div className="mt-3 p-3 rounded-xl bg-white border border-[#008638]/40 text-left">
                <div className="flex items-center gap-1.5 text-[#008638] text-[12px] font-bold">
                  <CheckCircle2 size={15} /> Payout Transferred On-Chain!
                </div>
                <a
                  href={`https://robinhoodchain.blockscout.com/tx/${claimTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-[11px] font-mono text-[#0053ff] hover:underline flex items-center gap-1 break-all"
                >
                  <span>Tx: {claimTxHash.slice(0, 10)}...{claimTxHash.slice(-8)}</span>
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              </div>
            ) : (
              <div className="mt-3">
                <button
                  onClick={handleClaimPayout}
                  disabled={isClaiming}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#008638] hover:bg-[#00702e] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-50"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending On-Chain Payout...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Claim {winnerDetails.userPayoutEth} ETH from Treasury</span>
                    </>
                  )}
                </button>
                {claimError && (
                  <p className="text-[11px] text-red-500 font-mono mt-1.5 text-center">
                    {claimError}
                  </p>
                )}
              </div>
            )}

            {/* Share Win on X (Viral Marketing Flex) */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Just won +${winnerDetails.userPayoutEth > 0 ? `${winnerDetails.userPayoutEth} ETH` : `${winnerDetails.userPayoutUsdg} USDG`} on @ToodProtocol_ on Robinhood Chain! 🎯\n\nSeason 1 is LIVE, grinding for the $TOOD airdrop allocation! 🚀\n\nStake on the 16-plot grid: https://tood-tau.vercel.app`
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={playClick}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-[12px] font-mono font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="font-bold text-[14px]">𝕏</span>
              <span>Flex Win on 𝕏 & Grind $TOOD Airdrop</span>
            </a>
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
