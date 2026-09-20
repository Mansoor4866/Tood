import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { X, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const PlotDrawer = () => {
  const { selectedPlot, setSelectedPlot, placeStake, userStakes, totalEthPot, totalUsdgPot } = useGame();
  const { ethBalance, usdgBalance, deductBalance, isConnected, setShowWalletModal } = useWallet();
  const { playClick } = useSound();

  const [stakeToken, setStakeToken] = useState('ETH');
  const [amount, setAmount] = useState('0.25');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!selectedPlot) return null;

  const currentStake = userStakes[selectedPlot.id] || { eth: 0, usdg: 0 };
  const userBalance = stakeToken === 'ETH' ? ethBalance : usdgBalance;
  const numAmount = parseFloat(amount) || 0;

  // Projected Return calculation
  const currentPlotStake = stakeToken === 'ETH' ? selectedPlot.ethStake : selectedPlot.usdgStake;
  const currentTotalPot = stakeToken === 'ETH' ? totalEthPot : totalUsdgPot;
  const newPlotStake = currentPlotStake + numAmount;
  const newTotalPot = currentTotalPot + numAmount;
  const stakeShare = newPlotStake > 0 ? (numAmount / newPlotStake) : 0;
  const projectedPayout = +(newTotalPot * 0.90 * stakeShare).toFixed(stakeToken === 'ETH' ? 3 : 1);
  const multiplier = numAmount > 0 ? (projectedPayout / numAmount).toFixed(2) : '0.00';

  const handleQuickPercent = (pct) => {
    playClick();
    if (stakeToken === 'ETH') {
      const val = +(userBalance * pct).toFixed(3);
      setAmount(val > 0 ? String(val) : '0.05');
    } else {
      const val = Math.floor(userBalance * pct);
      setAmount(val > 0 ? String(val) : '50');
    }
    setError('');
  };

  const handleStake = () => {
    playClick();
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    if (numAmount <= 0) {
      setError('Please enter a valid stake amount.');
      return;
    }

    if (numAmount > userBalance) {
      setError(`Insufficient ${stakeToken} balance.`);
      return;
    }

    const deducted = deductBalance(numAmount, stakeToken);
    if (!deducted) {
      setError('Transaction failed: Insufficient balance.');
      return;
    }

    if (stakeToken === 'ETH') {
      placeStake(selectedPlot.id, numAmount, 0);
    } else {
      placeStake(selectedPlot.id, 0, numAmount);
    }

    setSuccessMsg(`Successfully staked ${numAmount} ${stakeToken} on Plot ${selectedPlot.cell}!`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        onClick={() => setSelectedPlot(null)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 z-10 border border-[#e9e9e9] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-facto-dark text-white flex items-center justify-center font-bold text-[18px] mono">
              {selectedPlot.cell}
            </div>
            <div>
              <h3 className="display text-[22px] font-bold text-facto-dark">
                Plot {selectedPlot.cell} · {selectedPlot.name}
              </h3>
              <div className="mono text-[12px] text-facto-muted mt-0.5">
                ${selectedPlot.symbol} · Contract {selectedPlot.address.slice(0, 8)}...
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedPlot(null)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f4f4] text-facto-dark hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Plot Staking Stats */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="p-4 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-facto-muted font-mono">
              Total Plot Stake
            </div>
            <div className="display text-[20px] font-bold text-facto-dark mt-1">
              {selectedPlot.ethStake.toFixed(2)} ETH
            </div>
            <div className="mono text-[12px] text-facto-muted">
              {selectedPlot.usdgStake.toLocaleString()} USDG
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-facto-muted font-mono">
              Your Current Stake
            </div>
            <div className="display text-[20px] font-bold text-facto-pink mt-1">
              {currentStake.eth > 0 ? `${currentStake.eth} ETH` : '0.00 ETH'}
            </div>
            <div className="mono text-[12px] text-facto-muted">
              {currentStake.usdg > 0 ? `${currentStake.usdg} USDG` : '0 USDG'}
            </div>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="mb-4">
          <label className="text-[12px] font-bold uppercase tracking-wider text-facto-muted font-mono block mb-2">
            Select Currency
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#f4f4f4] border border-[#e5e7eb]">
            <button
              onClick={() => { playClick(); setStakeToken('ETH'); setAmount('0.25'); setError(''); }}
              className={`py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                stakeToken === 'ETH'
                  ? 'bg-white text-facto-dark shadow-sm'
                  : 'text-facto-muted hover:text-facto-dark'
              }`}
            >
              Stake with ETH
            </button>
            <button
              onClick={() => { playClick(); setStakeToken('USDG'); setAmount('500'); setError(''); }}
              className={`py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                stakeToken === 'USDG'
                  ? 'bg-white text-facto-dark shadow-sm'
                  : 'text-facto-muted hover:text-facto-dark'
              }`}
            >
              Stake with USDG
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-facto-muted font-mono">
              Stake Amount
            </span>
            <span className="mono text-[12px] text-facto-dark font-medium">
              Balance: {userBalance.toLocaleString()} {stakeToken}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              step={stakeToken === 'ETH' ? '0.05' : '50'}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              className="w-full rounded-xl bg-[#f8f8f8] border border-[#e5e7eb] px-4 py-3 text-[20px] mono text-facto-dark font-semibold focus:outline-none focus:border-facto-pink focus:bg-white transition-all"
              placeholder="0.00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 mono text-[14px] font-bold text-facto-muted">
              {stakeToken}
            </span>
          </div>

          {/* Quick % Chips */}
          <div className="grid grid-cols-4 gap-2 mt-2.5">
            {[
              { label: '25%', val: 0.25 },
              { label: '50%', val: 0.50 },
              { label: '75%', val: 0.75 },
              { label: 'Max', val: 1.0 }
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => handleQuickPercent(btn.val)}
                className="py-1.5 rounded-lg bg-[#f4f4f4] text-[12px] mono font-medium text-facto-dark hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projected Payout Preview Card */}
        <div className="p-4 rounded-xl bg-[#fff5fa] border border-facto-pink/20 mb-5">
          <div className="flex items-center justify-between text-[13px] mono">
            <span className="text-facto-muted">Projected Pot Share (90%):</span>
            <span className="text-facto-pink font-bold text-[15px]">
              ~{projectedPayout} {stakeToken}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mono text-facto-muted mt-1">
            <span>Multiplier if plot wins:</span>
            <span className="text-facto-emerald font-bold">{multiplier}x Return</span>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="flex items-center gap-2 text-[13px] text-red-600 mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 text-[13px] text-facto-emerald mb-4 bg-[#e8f7ee] p-3 rounded-xl border border-facto-emerald/30 font-medium">
            <ShieldCheck size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleStake}
          className="v2-btn v2-btn-pink w-full text-[16px] font-semibold"
        >
          <span>Confirm Stake on Plot {selectedPlot.cell}</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
};
