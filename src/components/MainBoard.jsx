import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { ChevronDown, Send, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { INITIAL_SALOON_CHATS } from '../data/mockData';
import { fetchSaloonMessages, sendSaloonMessage, subscribeToSaloon } from '../lib/supabase';

export const MainBoard = () => {
  const { plots, userStakes, selectedPlot, setSelectedPlot, highlightedPlotId, winningPlot, roundStatus, roundNumber, placeStake } = useGame();
  const { isConnected, account, fullAddress, ethBalance, usdgBalance, deductBalance, setShowWalletModal } = useWallet();
  const { playClick } = useSound();

  // Selected plot for staking
  const activePlot = selectedPlot || plots[0];

  // Staking Form State
  const [stakeToken, setStakeToken] = useState('ETH'); // 'ETH' | 'USDG'
  const [stakeAmount, setStakeAmount] = useState('0.02');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState('');
  const [stakeError, setStakeError] = useState('');

  // Saloon Live Chat State (Synced with Supabase Realtime)
  const [chats, setChats] = useState(INITIAL_SALOON_CHATS);
  const [chatInput, setChatInput] = useState('');

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

  const handlePlaceStake = () => {
    playClick();
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    const num = parseFloat(stakeAmount) || 0;
    if (num <= 0) {
      setStakeError('Enter a valid stake amount');
      return;
    }

    const userBal = stakeToken === 'ETH' ? ethBalance : usdgBalance;
    if (num > userBal) {
      setStakeError(`Insufficient ${stakeToken} balance`);
      return;
    }

    const deducted = deductBalance(num, stakeToken);
    if (!deducted) {
      setStakeError('Transaction failed: Insufficient balance');
      return;
    }

    const userAddr = fullAddress || account;
    if (stakeToken === 'ETH') {
      placeStake(activePlot.id, num, 0, userAddr);
    } else {
      placeStake(activePlot.id, 0, num, userAddr);
    }

    setStakeSuccess(`Staked ${num} ${stakeToken} on Plot ${activePlot.cell}`);
    setStakeError('');
    setTimeout(() => setStakeSuccess(''), 3500);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        
        {/* ================= LEFT COLUMN: THE GRID ================= */}
        <div className="facto-card p-6 sm:p-7">
          
          {/* Header of The Grid */}
          <div className="flex items-center justify-between pb-5 border-b border-[#f0f0f0] mb-5">
            <h2 className="display text-[22px] font-bold text-[#0d0e11]">
              The grid
            </h2>
            
            {winningPlot && (
              <div className="flex items-center gap-2">
                <span className="mono text-[12px] text-[#0d0e1180]">DRAWN PLOT</span>
                <span className="mono text-[16px] font-bold text-[#f243ac]">{winningPlot.cell}</span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#fff5fa] text-[#f243ac] border border-[#f243ac]/30 font-semibold">
                  Settled
                </span>
              </div>
            )}
          </div>

          {/* 4x4 Grid Matrix */}
          <div className="grid grid-cols-4 gap-3 sm:gap-3.5">
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
                  className={`relative aspect-square rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer select-none crosshair-bg transition-all duration-200 ${
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
                  <div className="flex items-center justify-between">
                    <span className="mono text-[12px] font-bold text-[#0d0e1180]">
                      {plot.cell}
                    </span>
                    
                    {isDrawn ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f243ac] text-white">
                        Drawn
                      </span>
                    ) : hasUserStake ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#e8f7ee] text-[#008638]">
                        STAKED
                      </span>
                    ) : null}
                  </div>

                  {/* Central Circular Token Avatar */}
                  <div className="flex items-center justify-center my-auto">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-white border border-[#e5e7eb] p-1 shadow-sm flex items-center justify-center">
                      <img
                        src={plot.avatar}
                        alt={plot.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Stake Status Indicator at bottom */}
                  <div className="pt-1 flex items-center justify-between text-[11px] mono text-[#0d0e1180]">
                    <span className="font-semibold">{plot.ethStake > 0 ? `${plot.ethStake} ETH` : '0 ETH'}</span>
                    {plot.usdgStake > 0 && <span className="text-[10px]">{plot.usdgStake}U</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Token Standings footer bar */}
          <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex items-center justify-between text-[12px] mono text-[#0d0e1180]">
            <span className="tracking-wider uppercase font-semibold">TOKEN STANDINGS</span>
            <div className="flex items-center gap-1.5 bg-[#f4f4f4] px-2.5 py-1 rounded-full border border-[#e5e7eb]">
              <span className="h-4 w-4 rounded-full bg-white inline-block overflow-hidden p-0.5 border border-gray-200">
                <img src={plots[0].avatar} alt="" className="h-full w-full object-cover rounded-full" />
              </span>
              <span className="font-bold text-[#0d0e11]">1</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: STAKE A CLAIM & THE SALOON ================= */}
        <div className="space-y-6">
          
          {/* Card 1: Stake a claim */}
          <div className="facto-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f0]">
              <h3 className="display text-[20px] font-bold text-[#0d0e11]">
                Stake a claim
              </h3>
              <span className="mono text-[13px] text-[#0d0e1180]">
                Round #{roundNumber}
              </span>
            </div>

            {/* Info notice */}
            <div className="my-4 p-3 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0] flex items-start gap-2.5 text-[13px] text-[#0d0e1180]">
              <div className="h-4 w-4 rounded-sm border border-dashed border-[#0d0e1180] shrink-0 mt-0.5" />
              <span>
                {roundStatus === 'betting'
                  ? `Staking on Plot ${activePlot.cell} ($${activePlot.symbol}). Pot pays 90% to winners.`
                  : 'No round is running. Pick a plot and your stake starts the next one'}
              </span>
            </div>

            {/* RIDE WITH (Token Selector Dropdown) */}
            <div className="mb-4 relative">
              <div className="flex items-center justify-between label mb-1.5">
                <span>RIDE WITH</span>
                <span>16 tokens</span>
              </div>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8f8f8] border border-[#e5e7eb] text-[#0d0e11] hover:border-[#f243ac] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <img src={activePlot.avatar} alt="" className="h-6 w-6 rounded-full bg-white p-0.5 border border-gray-200" />
                  <span className="font-bold">${activePlot.symbol}</span>
                  <span className="text-[#0d0e1180] text-[13px]">{activePlot.name} (Plot {activePlot.cell})</span>
                </div>
                <ChevronDown size={16} className="text-[#0d0e1180]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-56 overflow-y-auto bg-white border border-[#e5e7eb] rounded-xl shadow-2xl p-1 divide-y divide-[#f0f0f0]">
                  {plots.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPlot(p);
                        setDropdownOpen(false);
                      }}
                      className="p-2.5 flex items-center justify-between hover:bg-[#f4f4f4] rounded-lg cursor-pointer text-[13px]"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt="" className="h-5 w-5 rounded-full bg-white p-0.5 border border-gray-200" />
                        <span className="font-bold text-[#0d0e11]">${p.symbol}</span>
                        <span className="text-[#0d0e1180]">Plot {p.cell}</span>
                      </div>
                      <span className="mono text-[11px] text-[#0d0e1180]">{p.ethStake} ETH</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STAKE Currency Switcher & Amount */}
            <div className="mb-4">
              <div className="label mb-2">STAKE</div>
              
              <div className="flex items-center gap-3 mb-3">
                {/* Currency Buttons in Facto style */}
                <div className="flex items-center bg-[#f4f4f4] rounded-xl p-1 border border-[#e5e7eb]">
                  <button
                    onClick={() => { playClick(); setStakeToken('ETH'); setStakeAmount('0.02'); }}
                    className={`px-4 py-1.5 rounded-lg mono text-[13px] font-bold transition-all cursor-pointer ${
                      stakeToken === 'ETH'
                        ? 'bg-white text-[#0d0e11] shadow-sm'
                        : 'text-[#0d0e1180]'
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => { playClick(); setStakeToken('USDG'); setStakeAmount('50'); }}
                    className={`px-4 py-1.5 rounded-lg mono text-[13px] font-bold transition-all cursor-pointer ${
                      stakeToken === 'USDG'
                        ? 'bg-white text-[#0d0e11] shadow-sm'
                        : 'text-[#0d0e1180]'
                    }`}
                  >
                    USDG
                  </button>
                </div>

                {/* Amount input */}
                <div className="flex-1">
                  <input
                    type="number"
                    step={stakeToken === 'ETH' ? '0.005' : '10'}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-[#f8f8f8] border border-[#e5e7eb] rounded-xl px-4 py-2 mono text-[18px] text-right font-semibold text-[#0d0e11] focus:outline-none focus:border-[#f243ac] focus:bg-white transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: stakeToken === 'ETH' ? '0.005' : '10', val: stakeToken === 'ETH' ? '0.005' : '10' },
                  { label: stakeToken === 'ETH' ? '0.02' : '50', val: stakeToken === 'ETH' ? '0.02' : '50' },
                  { label: stakeToken === 'ETH' ? '0.1' : '200', val: stakeToken === 'ETH' ? '0.1' : '200' }
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => { playClick(); setStakeAmount(b.val); }}
                    className="py-1.5 rounded-xl bg-[#f8f8f8] border border-[#e5e7eb] mono text-[13px] font-medium text-[#0d0e11] hover:bg-[#ececec] transition-colors cursor-pointer"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error / Success Feedback */}
            {stakeError && (
              <div className="text-[12px] text-red-600 mb-3 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {stakeError}
              </div>
            )}
            {stakeSuccess && (
              <div className="text-[12px] text-[#008638] mb-3 bg-[#e8f7ee] p-2.5 rounded-lg border border-[#008638]/20 font-medium">
                {stakeSuccess}
              </div>
            )}

            {/* Action Button in Facto Pink / Dark */}
            {isConnected ? (
              <button
                onClick={handlePlaceStake}
                className="btn-pink w-full py-3.5 text-[15px] font-bold"
              >
                Stake Plot {activePlot.cell}
              </button>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="btn-pink w-full py-3.5 text-[15px] font-bold"
              >
                Connect wallet
              </button>
            )}

          </div>

          {/* Card 2: The saloon (Live Chat Box) */}
          <div className="facto-card p-6 flex flex-col h-[340px]">
            {/* Saloon Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
              <h3 className="display text-[18px] font-bold text-[#0d0e11]">
                The saloon
              </h3>
              <span className="mono text-[12px] text-[#0d0e1180] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#008638] inline-block animate-pulse" />
                6 on the wire
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-mono text-[12px]">
              {chats.map(chat => (
                <div key={chat.id} className="flex items-start gap-2.5">
                  <img src={chat.avatar} alt="" className="h-6 w-6 rounded-full bg-[#f4f4f4] border border-gray-200 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0d0e11] font-bold">{chat.user}</span>
                      <span className="text-[#0d0e114d] text-[10px]">{chat.time}</span>
                    </div>
                    <p className="text-[#0d0e1180] mt-0.5 break-words font-sans text-[13px]">
                      {chat.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Saloon Footer / Input */}
            <div className="pt-3 border-t border-[#f0f0f0]">
              {isConnected ? (
                <form onSubmit={handleSendChat} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Say something in the saloon..."
                    className="flex-1 bg-[#f8f8f8] border border-[#e5e7eb] rounded-xl px-3 py-2 text-[13px] text-[#0d0e11] focus:outline-none focus:border-[#f243ac] focus:bg-white"
                  />
                  <button type="submit" className="p-2.5 rounded-xl bg-[#0d0e11] text-white font-bold cursor-pointer hover:bg-black">
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
