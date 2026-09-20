import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_PLOTS, INITIAL_HISTORY, INITIAL_LEADERBOARD } from '../data/mockData';
import { useSound } from './SoundContext';
import { useWallet } from './WalletContext';
import { recordStakeActivity, recordRoundSettlement, fetchRoundsLog } from '../lib/supabase';
import confetti from 'canvas-confetti';

const GameContext = createContext();

const ROUND_TIME = 60; // 60 seconds per round

export const GameProvider = ({ children }) => {
  const { playTick, playShuffle, playWin } = useSound();
  const { creditBalance } = useWallet();

  const [roundNumber, setRoundNumber] = useState(143);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundStatus, setRoundStatus] = useState('betting'); // 'betting' | 'drawing' | 'settled'
  
  const [plots, setPlots] = useState(INITIAL_PLOTS);
  const [userStakes, setUserStakes] = useState({}); // { plotId: { eth: number, usdg: number } }
  const [selectedPlot, setSelectedPlot] = useState(null);
  
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  const [highlightedPlotId, setHighlightedPlotId] = useState(null);
  const [winningPlot, setWinningPlot] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState(null);

  // Total Pot computations
  const totalEthPot = plots.reduce((acc, p) => acc + p.ethStake, 0);
  const totalUsdgPot = plots.reduce((acc, p) => acc + p.usdgStake, 0);

  // Live timer countdown
  useEffect(() => {
    if (roundStatus !== 'betting') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDraw();
          return 0;
        }
        if (prev <= 10) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roundStatus, plots]);

  // Autonomous simulated stakes from other outlaws on chain to make board feel alive
  useEffect(() => {
    if (roundStatus !== 'betting') return;

    const botInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomPlotIndex = Math.floor(Math.random() * 16);
        const randomEth = +(Math.random() * 0.4 + 0.05).toFixed(2);
        const randomUsdg = +(Math.random() * 800 + 100).toFixed(0);

        setPlots(prev => prev.map((p, idx) => {
          if (idx === randomPlotIndex) {
            return {
              ...p,
              ethStake: +(p.ethStake + randomEth).toFixed(2),
              usdgStake: +(p.usdgStake + Number(randomUsdg)),
              stakersCount: p.stakersCount + 1
            };
          }
          return p;
        }));
      }
    }, 3500);

    return () => clearInterval(botInterval);
  }, [roundStatus]);

  // Fetch historical rounds from Supabase on start
  useEffect(() => {
    async function loadRounds() {
      try {
        const liveHistory = await fetchRoundsLog();
        if (liveHistory && liveHistory.length > 0) {
          setHistory(liveHistory);
          // Sync current round number with latest round + 1
          if (liveHistory[0]?.round) {
            setRoundNumber(liveHistory[0].round + 1);
          }
        }
      } catch (err) {
        console.warn('Initial rounds load note:', err);
      }
    }
    loadRounds();
  }, []);

  // Stake user funds on a plot
  const placeStake = (plotId, ethAmount, usdgAmount, walletAddress = null) => {
    const targetPlot = plots.find(p => p.id === plotId);

    setPlots(prev => prev.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          ethStake: +(p.ethStake + ethAmount).toFixed(2),
          usdgStake: +(p.usdgStake + usdgAmount),
          stakersCount: p.stakersCount + (userStakes[plotId] ? 0 : 1)
        };
      }
      return p;
    }));

    setUserStakes(prev => {
      const existing = prev[plotId] || { eth: 0, usdg: 0 };
      return {
        ...prev,
        [plotId]: {
          eth: +(existing.eth + ethAmount).toFixed(4),
          usdg: +(existing.usdg + usdgAmount).toFixed(2)
        }
      };
    });

    // Record activity in Supabase PostgreSQL
    if (walletAddress && targetPlot) {
      recordStakeActivity({
        roundNumber,
        walletAddress,
        plotId,
        cell: targetPlot.cell,
        tokenSymbol: targetPlot.symbol,
        ethAmount,
        usdgAmount
      });
    }
  };

  // Trigger high-suspense Roulette Draw Animation
  const triggerDraw = () => {
    setRoundStatus('drawing');
    
    // Pick winning plot
    const winningIdx = Math.floor(Math.random() * 16);
    const targetPlot = plots[winningIdx];
    
    let currentIdx = 0;
    let speed = 60;
    let iterations = 0;
    const totalIterations = 32 + winningIdx; // Spin around grid at least twice

    const spin = () => {
      setHighlightedPlotId(currentIdx % 16);
      playShuffle();
      currentIdx++;
      iterations++;

      if (iterations < totalIterations) {
        if (iterations > totalIterations - 10) {
          speed += 35; // Decelerate smoothly
        }
        setTimeout(spin, speed);
      } else {
        // Locked on winner
        setHighlightedPlotId(targetPlot.id);
        setWinningPlot(targetPlot);
        setRoundStatus('settled');
        playWin();

        // Check if user had a stake on the winning plot
        const userPlotStake = userStakes[targetPlot.id];
        let userPayoutEth = 0;
        let userPayoutUsdg = 0;

        if (userPlotStake && (userPlotStake.eth > 0 || userPlotStake.usdg > 0)) {
          // 90% goes to plot stakers proportionate to stake
          const ethShare = targetPlot.ethStake > 0 ? (userPlotStake.eth / targetPlot.ethStake) : 0;
          const usdgShare = targetPlot.usdgStake > 0 ? (userPlotStake.usdg / targetPlot.usdgStake) : 0;
          
          userPayoutEth = +(totalEthPot * 0.90 * ethShare).toFixed(4);
          userPayoutUsdg = +(totalUsdgPot * 0.90 * usdgShare).toFixed(2);

          if (userPayoutEth > 0) creditBalance(userPayoutEth, 'ETH');
          if (userPayoutUsdg > 0) creditBalance(userPayoutUsdg, 'USDG');

          // Trigger fireworks confetti!
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#b6d7bb', '#e3c98a', '#ffffff', '#ffd700']
            });
          } catch(e) {}
        }

        const settlement = {
          round: roundNumber,
          block: 1984201 + (roundNumber - 142) * 21,
          drawnPlotId: targetPlot.id,
          cell: targetPlot.cell,
          symbol: targetPlot.symbol,
          name: targetPlot.name,
          token: targetPlot.symbol,
          crew: targetPlot.name,
          potEth: +totalEthPot.toFixed(2),
          potUsdg: +totalUsdgPot.toFixed(0),
          winnerCount: targetPlot.stakersCount || 1,
          time: 'Just now',
          txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
          userWon: Boolean(userPlotStake && (userPayoutEth > 0 || userPayoutUsdg > 0)),
          userPayoutEth,
          userPayoutUsdg
        };

        setWinnerDetails(settlement);
        setHistory(prev => [settlement, ...prev.slice(0, 19)]);

        // Save settlement in Supabase database
        recordRoundSettlement(settlement);

        // Auto restart round after 9 seconds of celebration
        setTimeout(() => {
          resetRound();
        }, 9000);
      }
    };

    spin();
  };

  const resetRound = () => {
    setRoundNumber(prev => prev + 1);
    setTimeLeft(ROUND_TIME);
    setRoundStatus('betting');
    setHighlightedPlotId(null);
    setWinningPlot(null);
    setWinnerDetails(null);
    setUserStakes({});
    
    // Refresh plots with random baseline seeds
    setPlots(INITIAL_PLOTS.map(p => ({
      ...p,
      ethStake: +(Math.random() * 1.5 + 0.3).toFixed(2),
      usdgStake: +(Math.random() * 3000 + 500).toFixed(0),
      stakersCount: Math.floor(Math.random() * 15 + 3)
    })));
  };

  return (
    <GameContext.Provider
      value={{
        roundNumber,
        timeLeft,
        roundStatus,
        plots,
        userStakes,
        selectedPlot,
        setSelectedPlot,
        history,
        leaderboard,
        totalEthPot,
        totalUsdgPot,
        highlightedPlotId,
        winningPlot,
        winnerDetails,
        placeStake,
        triggerDraw,
        resetRound
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
