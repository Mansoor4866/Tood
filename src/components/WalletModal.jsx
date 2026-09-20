import React from 'react';
import { useWallet, POPULAR_WALLETS } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { X, Wallet, ExternalLink, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

export const WalletModal = () => {
  const {
    showWalletModal,
    setShowWalletModal,
    isConnected,
    isConnecting,
    account,
    fullAddress,
    ethBalance,
    usdgBalance,
    isWrongNetwork,
    connectionError,
    discoveredProviders,
    connectWallet,
    connectDemoMode,
    disconnectWallet,
    claimFaucet,
    switchToRobinhoodChain
  } = useWallet();
  const { playClick } = useSound();

  if (!showWalletModal) return null;

  const hasWindowEthereum = typeof window !== 'undefined' && Boolean(window.ethereum);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={() => !isConnecting && setShowWalletModal(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 z-10 border border-[#e5e7eb] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0d0e11] flex items-center justify-center text-white">
              <Wallet size={18} className="text-[#f243ac]" />
            </div>
            <div>
              <h3 className="display text-[20px] font-bold text-[#0d0e11]">
                {isConnected ? 'Wallet Connected' : 'Connect a Wallet'}
              </h3>
              <div className="mono text-[11px] text-[#0d0e1180] flex items-center gap-1.5 mt-0.5">
                <span>Robinhood Chain (EVM 2340)</span>
                {isWrongNetwork && (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    · Wrong Network
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWalletModal(false)}
            disabled={isConnecting}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f4] text-[#0d0e11] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Network Mismatch Alert */}
        {isConnected && isWrongNetwork && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-red-600">
              <AlertTriangle size={16} />
              <span>Please switch to Robinhood Chain</span>
            </div>
            <button
              onClick={() => { playClick(); switchToRobinhoodChain(); }}
              className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold text-[12px] hover:bg-red-700 transition-colors"
            >
              Switch Chain
            </button>
          </div>
        )}

        {/* Error Feedback */}
        {connectionError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{connectionError}</span>
          </div>
        )}

        {/* Connecting State */}
        {isConnecting && (
          <div className="my-8 py-6 text-center">
            <Loader2 size={36} className="text-[#f243ac] animate-spin mx-auto mb-3" />
            <div className="display text-[18px] text-[#0d0e11] font-bold">
              Waiting for wallet confirmation...
            </div>
            <p className="text-[13px] text-[#0d0e1180] mt-1 max-w-xs mx-auto">
              Please check your browser extension and approve the connection request.
            </p>
          </div>
        )}

        {/* Connected State View */}
        {!isConnecting && isConnected && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d0e1180] font-mono">
                  Connected Address
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#e8f7ee] text-[#008638] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#008638] animate-pulse" />
                  Active
                </span>
              </div>
              <div className="mono text-[14px] text-[#0d0e11] font-bold break-all select-all">
                {fullAddress || account}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0d0e1180] font-mono">
                  ETH Balance
                </div>
                <div className="mono text-[18px] text-[#008638] font-bold mt-1">
                  {ethBalance.toFixed(4)} <span className="text-[12px] text-[#0d0e1180] font-normal">ETH</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0d0e1180] font-mono">
                  USDG Balance
                </div>
                <div className="mono text-[18px] text-[#0d0e11] font-bold mt-1">
                  {usdgBalance.toLocaleString()} <span className="text-[12px] text-[#0d0e1180] font-normal">USDG</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fff5fa] border border-[#f243ac]/20 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-[#0d0e11] flex items-center gap-1">
                  <Sparkles size={14} className="text-[#f243ac]" /> Demo Faucet
                </div>
                <div className="mono text-[11px] text-[#0d0e1180]">
                  Add +2.00 ETH & +5,000 USDG test funds
                </div>
              </div>
              <button
                onClick={() => { playClick(); claimFaucet(); }}
                className="px-3 py-1.5 rounded-lg bg-[#f243ac] text-white font-bold text-[12px] hover:bg-[#e0329a] transition-colors cursor-pointer"
              >
                Claim
              </button>
            </div>

            <button
              onClick={() => { playClick(); disconnectWallet(); setShowWalletModal(false); }}
              className="w-full py-2.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-[13px] font-medium cursor-pointer"
            >
              Disconnect Wallet
            </button>
          </div>
        )}

        {/* Unconnected State: Show Installed Wallets */}
        {!isConnecting && !isConnected && (
          <div className="mt-5 space-y-3">
            <div className="label text-[11px] px-1">
              Select an installed browser wallet
            </div>

            {discoveredProviders.length > 0 && (
              <div className="space-y-2">
                {discoveredProviders.map(({ info, provider }) => (
                  <button
                    key={info.uuid}
                    onClick={() => { playClick(); connectWallet(provider); }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#f8f8f8] hover:bg-gray-100 border border-[#e5e7eb] hover:border-[#f243ac] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={info.icon} alt={info.name} className="h-8 w-8 rounded-lg object-contain bg-white p-1 border border-gray-200" />
                      <div>
                        <div className="font-bold text-[15px] text-[#0d0e11] group-hover:text-[#f243ac]">
                          {info.name}
                        </div>
                        <div className="mono text-[11px] text-[#0d0e1180]">Detected Extension</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#e8f7ee] text-[#008638] font-bold">
                      INSTALLED
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {POPULAR_WALLETS.map((wallet) => {
                const isDiscovered = discoveredProviders.some(
                  p => p.info.name.toLowerCase().includes(wallet.name.toLowerCase())
                );
                if (isDiscovered) return null;

                const isInstalled = hasWindowEthereum && wallet.checkInstalled(window.ethereum);

                return (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f8f8] hover:bg-gray-100 border border-[#e5e7eb] transition-all"
                  >
                    <button
                      onClick={() => { playClick(); connectWallet(window.ethereum); }}
                      className="flex-1 flex items-center gap-3 text-left bg-transparent border-0 cursor-pointer p-0"
                    >
                      <img src={wallet.icon} alt={wallet.name} className="h-8 w-8 rounded-lg object-contain bg-white p-1 border border-gray-200" />
                      <div>
                        <div className="font-bold text-[14px] text-[#0d0e11] hover:text-[#f243ac]">
                          {wallet.name}
                        </div>
                        <div className="mono text-[11px] text-[#0d0e1180]">
                          {isInstalled ? 'Ready to connect' : 'Robinhood Chain EVM'}
                        </div>
                      </div>
                    </button>

                    {isInstalled ? (
                      <button
                        onClick={() => { playClick(); connectWallet(window.ethereum); }}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#e8f7ee] text-[#008638] font-bold cursor-pointer"
                      >
                        CONNECT →
                      </button>
                    ) : (
                      <a
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-[#0d0e1180] hover:text-[#f243ac] flex items-center gap-1 font-medium"
                      >
                        <span>GET</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => { playClick(); connectDemoMode(); }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fff5fa] hover:bg-[#ffeef7] border border-[#f243ac]/30 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#f243ac] text-white flex items-center justify-center font-bold text-[14px]">
                    ⚡
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[#f243ac]">
                      Instant Demo Mode
                    </div>
                    <div className="mono text-[11px] text-[#0d0e1180]">
                      Play immediately with +5.50 ETH & +10,000 USDG
                    </div>
                  </div>
                </div>
                <span className="mono text-[12px] font-bold text-[#f243ac]">PLAY →</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
