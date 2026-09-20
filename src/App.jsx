import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { WalletProvider } from './context/WalletContext';
import { SoundProvider } from './context/SoundContext';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MainBoard } from './components/MainBoard';
import { HowAClaimPays } from './components/HowAClaimPays';
import { WhereThePotGoesAndHouseRules } from './components/WhereThePotGoes';
import { HistoryLog } from './components/HistoryLog';
import { Standings } from './components/Standings';
import { TokenRoster } from './components/TokenRoster';
import { DrawModal } from './components/DrawModal';
import { WalletModal } from './components/WalletModal';
import { Footer } from './components/Footer';

function MainContent() {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'history' | 'standings' | 'tokens'

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4] text-[#0d0e11] relative selection:bg-[#f243ac] selection:text-white">
      {/* Facto Style Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'grid' && (
          <div className="animate-fadeIn">
            {/* 1. Hero Title & Round Stats Bar */}
            <Hero />

            {/* 2. 4x4 Grid + Stake a Claim + The Saloon Live Chat */}
            <MainBoard />

            {/* 3. How a Claim Pays 4 Cards */}
            <HowAClaimPays />

            {/* 4. Where the Pot Goes Bar + The House Rules */}
            <WhereThePotGoesAndHouseRules />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <HistoryLog />
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="animate-fadeIn">
            <Standings />
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="animate-fadeIn">
            <TokenRoster />
          </div>
        )}
      </main>

      {/* Modals */}
      <DrawModal />
      <WalletModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <WalletProvider>
        <GameProvider>
          <MainContent />
        </GameProvider>
      </WalletProvider>
    </SoundProvider>
  );
}
