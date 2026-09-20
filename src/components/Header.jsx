import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useSound } from '../context/SoundContext';
import { Volume2, VolumeX } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab }) => {
  const { isConnected, account, ethBalance, usdgBalance, setShowWalletModal } = useWallet();
  const { muted, setMuted, playClick } = useSound();

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-8 max-w-[1240px] mx-auto w-full">
      <div className="facto-nav rounded-2xl px-4 py-3 sm:px-6 flex items-center justify-between transition-all">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => { playClick(); setActiveTab('grid'); }}
            className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 text-left"
          >
            {/* Tood Brand Icon Mark */}
            <div className="h-8 w-8 rounded-lg bg-[#0d0e11] flex items-center justify-center text-white shadow-sm font-bold">
              <span className="text-[#f243ac]">T</span>
            </div>
            <span className="display text-[21px] font-bold text-[#0d0e11] tracking-tight">
              Tood
            </span>
          </button>

          {/* Nav Pills in Facto Style */}
          <nav className="hidden md:flex items-center gap-1 ml-2 bg-[#e9e9e9] p-1 rounded-full">
            {[
              { id: 'grid', label: 'Grid' },
              { id: 'history', label: 'Rounds' },
              { id: 'standings', label: 'Leaderboard' },
              { id: 'tokens', label: 'Season' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id); }}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-[#0d0e11] shadow-sm font-semibold'
                    : 'text-[#0d0e1180] hover:text-[#0d0e11]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Sound Toggle, Twitter X, Connect Button */}
        <div className="flex items-center gap-3">
          
          {/* Sound Toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#e5e7eb] text-[#0d0e11] hover:bg-gray-50 transition-colors cursor-pointer"
            title={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Twitter / X circular button */}
          <a
            href="https://x.com/outlawgridrh"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#e5e7eb] text-[#0d0e11] hover:bg-gray-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Connect Button (Facto Dark Pill / Connected Pill) */}
          {isConnected ? (
            <button
              onClick={() => { playClick(); setShowWalletModal(true); }}
              className="btn-connect"
            >
              <span className="h-2 w-2 rounded-full bg-[#008638] animate-pulse" />
              <span className="mono text-[13px]">{account}</span>
            </button>
          ) : (
            <button
              onClick={() => { playClick(); setShowWalletModal(true); }}
              className="btn-connect"
            >
              Connect
            </button>
          )}

        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto gap-2 px-1 pt-2 pb-1">
        {[
          { id: 'grid', label: 'Grid' },
          { id: 'history', label: 'Rounds' },
          { id: 'standings', label: 'Leaderboard' },
          { id: 'tokens', label: 'Season' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { playClick(); setActiveTab(tab.id); }}
            className={`px-3.5 py-1 rounded-full text-[12px] whitespace-nowrap font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#0d0e11] text-white font-semibold'
                : 'bg-white text-[#0d0e1180] border border-[#e5e7eb]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
