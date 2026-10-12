import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { ChevronDown, Send, Sparkles, Radio, Loader2 } from 'lucide-react';
import { INITIAL_SALOON_CHATS } from '../data/mockData';
import { fetchSaloonMessages, sendSaloonMessage, subscribeToSaloon } from '../lib/supabase';

export const MainBoard = () => {
  const { plots, userStakes, selectedPlot, setSelectedPlot, highlightedPlotId, winningPlot, roundStatus, roundNumber, placeStake, totalEthPot, totalUsdgPot } = useGame();
  const { isConnected, account, fullAddress, ethBalance, usdgBalance, deductBalance, setShowWalletModal, sendStakeTransaction } = useWallet();
  const { playClick } = useSound();

  // Selected plot for staking (safe fallback)
  const activePlot = selectedPlot || (plots && plots[0]) || { id: 0, cell: 'A1', symbol: 'PONS', name: 'Pons', ethStake: 0, usdgStake: 0 };

  // Staking Form State
  const [stakeToken, setStakeToken] = useState('ETH'); // 'ETH' | 'USDG'
  const [stakeAmount, setStakeAmount] = useState('0.02');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState('');
  const [stakeError, setStakeError] = useState('');

  // Saloon Live Chat State (Synced with Supabase Realtime)
  const [chats, setChats] = useState(INITIAL_SALOON_CHATS);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Load chat messages on mount & subscribe to Realtime
  useEffect(() => {
    async function loadChat() {
      const msgs = await fetchSaloonMessages();
      if (msgs && msgs.length > 0) {
        setChats(msgs);
      }
    }
    loadChat();

    // Subscribe to incoming Supabase realtime saloon messages
    const unsubscribe = subscribeToSaloon((newMsg) => {
      setChats(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }
    const currentInput = chatInput.trim();
    setChatInput('');

    const userAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (fullAddress || account);
    const sentMsg = await sendSaloonMessage(fullAddress || account, currentInput, userAvatar);

    if (sentMsg) {
      setChats(prev => {
        if (prev.some(m => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });
    }
  };

  const handlePlaceStake = async () => {
    playClick();
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    const num = parseFloat(stakeAmount) || 0;
    const minAmount = stakeToken === 'ETH' ? 0.0005 : 1;

    if (num <= 0) {
      setStakeError('Enter a valid stake amount');
      return;
    }

    if (num < minAmount) {
      setStakeError(`Minimum stake is ${minAmount} ${stakeToken}`);
      return;
    }

    const userBal = stakeToken === 'ETH' ? ethBalance : usdgBalance;
    if (num > userBal) {
      setStakeError(`Insufficient ${stakeToken} balance`);
      return;
    }

    setIsStaking(true);
    setStakeError('');
    setStakeSuccess('');

    try {
      let txHash = null;

      // Real on-chain ETH transfer directly to Company Treasury Wallet!
      if (stakeToken === 'ETH' && sendStakeTransaction) {
        txHash = await sendStakeTransaction(num);
      } else {
        const deducted = deductBalance(num, stakeToken);
        if (!deducted) throw new Error('Transaction failed: Insufficient balance');
      }

      const userAddr = fullAddress || account;
      if (stakeToken === 'ETH') {
        placeStake(activePlot.id, num, 0, userAddr, txHash);
      } else {
        placeStake(activePlot.id, 0, num, userAddr, txHash);
      }

      setStakeSuccess(`Staked ${num} ${stakeToken} on Plot ${activePlot.cell}${txHash ? ` (Tx: ${txHash.slice(0, 8)}...)` : ''}`);
      setTimeout(() => setStakeSuccess(''), 5000);
    } catch (err) {
      console.warn('Stake on-chain error:', err);
      if (err.code === 4001) {
        setStakeError('Transaction cancelled in wallet.');
      } else {
        setStakeError(err.message || 'Transaction failed. Please try again.');
      }
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 items-start">
        
        {/* ================= LEFT COLUMN: THE GRID ================= */}
        <div className="facto-card p-6 sm:p-8">
          
          {/* Header of The Grid */}
          <div className="flex items-center justify-between pb-5 border-b border-[#f0f0f3] mb-6">
            <div className="flex items-center gap-3">
              <h2 className="display text-[24px] font-bold text-[#0d0e11] tracking-tight">
                The grid
              </h2>
              <span className="mono text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f4f4f6] text-[#0d0e1180] border border-[#e6e6eb]">
                16 plots
              </span>
            </div>
            
            {winningPlot ? (
              <div className="flex items-center gap-2">
                <span className="mono text-[12px] text-[#0d0e1180]">DRAWN PLOT</span>
                <span className="mono text-[17px] font-bold text-[#f243ac]">{winningPlot.cell}</span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#fff5fa] text-[#f243ac] border border-[#f243ac]/30 font-semibold shadow-sm">
                  Settled
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mono text-[12px] text-[#0d0e1180]">
                <span className="h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
                <span>Round active</span>
              </div>
            )}
          </div>

          {/* Active Plots Only Fair Play Notice Banner */}
          <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-[#e8f7ee] border border-[#008638]/20 flex items-center justify-between text-[12px] mono text-[#008638]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
              <span className="font-bold">Fair Play Rule:</span>
              <span className="text-[#0d0e11b3] hidden sm:inline">Draw selects strictly from active staked plots. Empty plots are excluded!</span>
              <span className="text-[#0d0e11b3] sm:hidden">Only staked plots can win!</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#008638]/30 shadow-xs">
              Guaranteed Winner
            </span>
          </div>

          {/* 4x4 Grid Matrix */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {plots.map((plot) => {
              const isSelected = activePlot.id === plot.id;
              const isHighlighted = highlightedPlotId === plot.id;
              const isDrawn = winningPlot?.id === plot.id;
              const userStake = userStakes[plot.id];
              const hasUserStake = userStake && (userStake.eth > 0 || userStake.usdg > 0);

              return (
                <div
                  key={plot.id}
                  onClick={() => {
                    playClick();
                    setSelectedPlot(plot);
                  }}
                  className={`relative aspect-square rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer select-none crosshair-bg transition-all duration-200 ${
                    isDrawn
                      ? 'facto-grid-drawn'
                      : isHighlighted
                      ? 'facto-grid-active-shuffle'
                      : isSelected
                      ? 'facto-grid-selected'
                      : 'facto-grid-normal'
                  }`}
                >
                  {/* Coordinate (A1..D4) in top-left */}
                  <div className="flex items-center justify-between z-10">
                    <span className="mono text-[12px] font-bold px-1.5 py-0.5 rounded bg-black/5 text-[#0d0e11]">
                      {plot.cell}
                    </span>
                    
                    {isDrawn ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f243ac] text-white shadow-sm">
                        Drawn
                      </span>
                    ) : hasUserStake ? (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#008638] border border-[#008638]/30">
                        YOU ({userStake.eth || userStake.usdg})
                      </span>
                    ) : (
                      <span className="mono text-[10px] text-[#0d0e114d] font-semibold">
                        ${plot.symbol}
                      </span>
                    )}
                  </div>

                  {/* Central Circular Token Avatar */}
                  <div className="flex items-center justify-center my-auto z-10">
                    <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-white border border-[#e5e7eb] p-1 shadow-xs flex items-center justify-center transform group-hover:scale-105 transition-transform">
                      <img
                        src={plot.avatar}
                        alt={plot.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Stake Status Indicator & Dynamic Multiplier at bottom */}
                  <div className="pt-1 flex items-center justify-between text-[11px] mono text-[#0d0e11] z-10">
                    <div className="flex items-center gap-1 font-bold">
                      <span>{plot.ethStake > 0 ? `${plot.ethStake} ETH` : '0 ETH'}</span>
                      {plot.usdgStake > 0 && <span className="text-[10px] text-[#0d0e1180] font-normal">({plot.usdgStake}U)</span>}
                    </div>

                    {/* Dynamic Odds Multiplier Badge */}
                    <span 
                      title="Estimated payout multiplier if this plot wins"
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        plot.ethStake > 0
                          ? 'bg-[#fff0f8] text-[#f243ac] border border-[#f243ac]/25 shadow-xs'
                          : 'bg-[#e8f7ee] text-[#008638] border border-[#008638]/25'
                      }`}
                    >
                      {plot.ethStake > 0
                        ? `${Math.max(1.1, ((totalEthPot > 0 ? totalEthPot * 0.9 : 0.9) / plot.ethStake)).toFixed(1)}x`
                        : '10x+'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Token Standings footer bar */}
          <div className="mt-7 pt-5 border-t border-[#f0f0f3] flex items-center justify-between text-[12px] mono text-[#0d0e1180]">
            <span className="tracking-wider uppercase font-bold text-[11px]">LEADING TOKENS</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#f6f6f8] px-3 py-1 rounded-full border border-[#e6e6eb]">
                <span className="h-4 w-4 rounded-full bg-white inline-block overflow-hidden p-0.5 border border-gray-200">
                  <img src={plots?.[0]?.avatar || ''} alt="" className="h-full w-full object-cover rounded-full" />
                </span>
                <span className="font-bold text-[#0d0e11]">${plots?.[0]?.symbol || 'PEPE'}</span>
                <span className="text-[#008638] font-bold">#1</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: STAKE A CLAIM & THE SALOON ================= */}
        <div className="space-y-6">
          
          {/* Card 1: Stake a claim */}
          <div className="facto-card p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f3]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#fff0f8] border border-[#f243ac]/25 text-[#f243ac] flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Zap size={18} className="fill-[#f243ac]" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#0d0e11] tracking-tight leading-none">
                    Stake a claim
                  </h3>
                  <p className="text-[11px] font-mono text-[#0d0e1180] mt-1">Pick plot · Win 90% pot</p>
                </div>
              </div>
              <span className="mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#f4f4f6] text-[#0d0e11] border border-[#e6e6eb] shrink-0">
                Round #{roundNumber}
              </span>
            </div>

            {/* Info notice */}
            <div className="my-4 p-3 rounded-xl bg-gradient-to-r from-[#fff5fa] via-[#fdf6fa] to-[#f8f8fa] border border-[#f243ac]/20 flex items-center justify-between text-[12px] text-[#0d0e11]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full bg-[#f243ac] animate-pulse shrink-0" />
                <span className="font-bold text-[#f243ac] shrink-0">Plot {activePlot.cell}</span>
                <span className="text-[#0d0e114d]">·</span>
                <span className="text-[#0d0e11cc] font-medium truncate">
                  {roundStatus === 'betting' ? `Staking with $${activePlot.symbol}` : 'Rolls to next round'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#f243ac]/30 text-[#f243ac] shrink-0 ml-2 shadow-xs">
                90% Pot
              </span>
            </div>

            {/* RIDE WITH (Token Selector Dropdown) */}
            <div className="mb-4 relative">
              <div className="flex items-center justify-between label mb-1.5">
                <span>SELECTED PLOT</span>
                <span>16 tokens</span>
              </div>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#e6e6eb] text-[#0d0e11] hover:border-[#f243ac] hover:shadow-xs transition-all cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full overflow-hidden bg-[#f4f4f6] border border-gray-200 p-0.5 shrink-0">
                    <img src={activePlot.avatar} alt="" className="h-full w-full object-cover rounded-full" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="font-bold text-[#0d0e11] text-[14px]">${activePlot.symbol}</span>
                    <span className="text-[#0d0e1180] text-[12px] block">{activePlot.name} · Plot {activePlot.cell}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-[#0d0e1180] bg-[#f4f4f6] px-2 py-0.5 rounded-md">
                    {activePlot.ethStake > 0 ? `${activePlot.ethStake} ETH` : '0 ETH'}
                  </span>
                  <ChevronDown size={16} className={`text-[#0d0e1180] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto bg-white border border-[#e6e6eb] rounded-xl shadow-2xl p-1 divide-y divide-[#f0f0f3]">
                  {plots.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPlot(p);
                        setDropdownOpen(false);
                      }}
                      className="p-2.5 flex items-center justify-between hover:bg-[#f6f6f8] rounded-lg cursor-pointer text-[13px] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt="" className="h-5 w-5 rounded-full bg-white p-0.5 border border-gray-200" />
                        <span className="font-bold text-[#0d0e11]">${p.symbol}</span>
                        <span className="text-[#0d0e1180]">Plot {p.cell}</span>
                      </div>
                      <span className="mono text-[11px] font-semibold text-[#0d0e1180]">{p.ethStake} ETH</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STAKE Currency Switcher & Amount */}
            <div className="mb-4">
              <div className="flex items-center justify-between label mb-2">
                <span>STAKE AMOUNT</span>
                {isConnected && (
                  <span className="mono text-[11px] text-[#0d0e1180]">
                    Bal: {stakeToken === 'ETH' ? `${ethBalance} ETH` : `${usdgBalance} USDG`}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2.5 mb-3">
                {/* Currency Buttons in Facto style */}
                <div className="flex items-center bg-[#f0f0f3] rounded-xl p-1 border border-[#e6e6eb]">
                  <button
                    onClick={() => { playClick(); setStakeToken('ETH'); setStakeAmount('0.0005'); setStakeError(''); }}
                    className={`px-4 py-1.5 rounded-lg mono text-[13px] font-bold transition-all cursor-pointer ${
                      stakeToken === 'ETH'
                        ? 'bg-white text-[#0d0e11] shadow-sm'
                        : 'text-[#0d0e1180] hover:text-[#0d0e11]'
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => { playClick(); setStakeToken('USDG'); setStakeAmount('1'); setStakeError(''); }}
                    className={`px-4 py-1.5 rounded-lg mono text-[13px] font-bold transition-all cursor-pointer ${
                      stakeToken === 'USDG'
                        ? 'bg-white text-[#0d0e11] shadow-sm'
                        : 'text-[#0d0e1180] hover:text-[#0d0e11]'
                    }`}
                  >
                    USDG
                  </button>
                </div>

                {/* Amount input */}
                <div className="flex-1">
                  <input
                    type="number"
                    step={stakeToken === 'ETH' ? '0.0005' : '1'}
                    min={stakeToken === 'ETH' ? '0.0005' : '1'}
                    value={stakeAmount}
                    onChange={(e) => {
                      setStakeAmount(e.target.value);
                      setStakeError('');
                    }}
                    className={`w-full bg-[#f8f8fa] border rounded-xl px-4 py-2 mono text-[18px] text-right font-bold text-[#0d0e11] focus:outline-none focus:bg-white transition-all shadow-inner ${
                      (parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) < (stakeToken === 'ETH' ? 0.0005 : 1))
                        ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                        : 'border-[#e6e6eb] focus:border-[#f243ac]'
                    }`}
                    placeholder={stakeToken === 'ETH' ? '0.0005' : '1'}
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: stakeToken === 'ETH' ? '+0.0005' : '+1', val: stakeToken === 'ETH' ? '0.0005' : '1' },
                  { label: stakeToken === 'ETH' ? '+0.005' : '+10', val: stakeToken === 'ETH' ? '0.005' : '10' },
                  { label: stakeToken === 'ETH' ? '+0.02' : '+50', val: stakeToken === 'ETH' ? '0.02' : '50' }
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => { playClick(); setStakeAmount(b.val); setStakeError(''); }}
                    className="py-2 rounded-xl bg-white border border-[#e6e6eb] mono text-[12px] font-bold text-[#0d0e11] hover:bg-[#fff0f8] hover:border-[#f243ac]/40 hover:text-[#f243ac] transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Estimated Return & Multiplier Preview */}
            {(() => {
              const currentPlotStake = (stakeToken === 'ETH' ? (activePlot.ethStake || 0) : (activePlot.usdgStake || 0));
              const userVal = parseFloat(stakeAmount) || 0;
              const currentPot = (stakeToken === 'ETH' ? (totalEthPot || 0) : (totalUsdgPot || 0));
              const projectedPot = currentPot + userVal;
              const totalPlotStakeAfter = currentPlotStake + userVal;
              const userShare = totalPlotStakeAfter > 0 ? (userVal / totalPlotStakeAfter) : 1;
              const netPayout = projectedPot * 0.9 * userShare;
              const multiplier = userVal > 0 
                ? (netPayout / userVal).toFixed(1) 
                : (currentPlotStake > 0 ? Math.max(1.1, (currentPot * 0.9) / currentPlotStake).toFixed(1) : '10.0');

              return (
                <div className="mb-4 p-3 rounded-xl bg-[#fcfcfe] border border-[#e6e6eb] flex items-center justify-between text-[12px] mono shadow-xs">
                  <div>
                    <span className="text-[10px] text-[#0d0e1180] font-bold block uppercase tracking-wider">
                      EST. RETURN (90% POT)
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[15px] font-bold text-[#008638]">
                        +{userVal > 0 ? (stakeToken === 'ETH' ? netPayout.toFixed(4) : netPayout.toFixed(1)) : (stakeToken === 'ETH' ? (currentPot * 0.9).toFixed(4) : (currentPot * 0.9).toFixed(0))} {stakeToken}
                      </span>
                      <span className="text-[10px] font-bold text-[#f243ac] bg-[#f243ac]/10 px-1.5 py-0.5 rounded-full border border-[#f243ac]/20">
                        {multiplier}x
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#0d0e1180] font-medium block">Your Plot Share</span>
                    <span className="text-[13px] font-bold text-[#0d0e11]">
                      {userVal > 0 ? `${(userShare * 100).toFixed(0)}%` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Error / Success Feedback */}
            {(stakeError || (parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) < (stakeToken === 'ETH' ? 0.0005 : 1))) && (
              <div className="text-[12px] text-red-600 mb-3 bg-red-50 p-3 rounded-xl border border-red-200 font-semibold flex items-center gap-2 animate-fadeIn">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                <span>
                  {stakeError || `Minimum stake is ${stakeToken === 'ETH' ? '0.0005 ETH' : '1 USDG'}`}
                </span>
              </div>
            )}
            {stakeSuccess && (
              <div className="text-[12px] text-[#008638] mb-3 bg-[#e8f7ee] p-2.5 rounded-lg border border-[#008638]/20 font-medium">
                {stakeSuccess}
              </div>
            )}

            {/* Action Button in Facto Pink */}
            {isConnected ? (
              <button
                onClick={handlePlaceStake}
                disabled={isStaking || (parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) < (stakeToken === 'ETH' ? 0.0005 : 1))}
                className="btn-pink w-full py-3.5 text-[15px] font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isStaking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Confirm in Wallet...</span>
                  </>
                ) : (
                  <span>Stake Plot {activePlot.cell} (${activePlot.symbol})</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="btn-pink w-full py-3.5 text-[15px] font-bold"
              >
                Connect Wallet to Stake
              </button>
            )}

          </div>

          {/* Card 2: The saloon (Live Chat Box) */}
          <div className="facto-card p-6 flex flex-col h-[360px]">
            {/* Saloon Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f3]">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg overflow-hidden bg-black flex items-center justify-center p-0.5 shadow-sm border border-black/20">
                  <img src="/assets/TOOD LOGO-03.jpg" alt="Saloon Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="display text-[19px] font-bold text-[#0d0e11]">
                  The saloon
                </h3>
                <span className="mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#008638]">
                  Live
                </span>
              </div>
              <span className="mono text-[12px] text-[#0d0e1180] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#008638] inline-block animate-pulse" />
                6 on the wire
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-mono text-[12px]">
              {chats.map(chat => (
                <div key={chat.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#f8f8fa] border border-[#f0f0f3]">
                  <img src={chat.avatar} alt="" className="h-6 w-6 rounded-full bg-white border border-gray-200 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0d0e11] font-bold text-[12px]">{chat.user}</span>
                      <span className="text-[#0d0e114d] text-[10px]">{chat.time}</span>
                    </div>
                    <p className="text-[#0d0e11] mt-0.5 break-words font-sans text-[13px] font-normal leading-relaxed">
                      {chat.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Saloon Footer / Input */}
            <div className="pt-3 border-t border-[#f0f0f3]">
              {isConnected ? (
                <form onSubmit={handleSendChat} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Say something in the saloon..."
                    className="flex-1 bg-[#f8f8fa] border border-[#e6e6eb] rounded-xl px-3 py-2 text-[13px] text-[#0d0e11] focus:outline-none focus:border-[#f243ac] focus:bg-white transition-all"
                  />
                  <button type="submit" className="p-2.5 rounded-xl bg-[#0d0e11] text-white font-bold cursor-pointer hover:bg-black transition-colors">
                    <Send size={13} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between text-[12px] mono text-[#0d0e1180]">
                  <span>Connect to take a seat</span>
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="text-[#f243ac] font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
