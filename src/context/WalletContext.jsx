import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncUserProfile, fetchUserProfile } from '../lib/supabase';

const WalletContext = createContext();

export const ROBINHOOD_CHAIN = {
  chainId: '0x924', // 2340 in hex
  chainIdDecimal: 2340,
  chainName: 'Robinhood Chain',
  rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
};

// Known popular Robinhood-supported wallet metadata
export const POPULAR_WALLETS = [
  {
    id: 'io.metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    downloadUrl: 'https://metamask.io/download/',
    checkInstalled: (p) => Boolean(p?.isMetaMask && !p?.isBraveWallet && !p?.isRabby),
  },
  {
    id: 'com.robinhood.wallet',
    name: 'Robinhood Wallet',
    icon: 'https://robinhoodchain.blockscout.com/favicon.ico',
    downloadUrl: 'https://robinhood.com/us/en/support/articles/robinhood-wallet/',
    checkInstalled: (p) => Boolean(p?.isRobinhood || p?.isRobinhoodWallet),
  },
  {
    id: 'io.rabby',
    name: 'Rabby Wallet',
    icon: 'https://rabby.io/assets/images/logo-white.svg',
    downloadUrl: 'https://rabby.io/',
    checkInstalled: (p) => Boolean(p?.isRabby),
  },
  {
    id: 'com.coinbase.wallet',
    name: 'Coinbase Wallet',
    icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4',
    downloadUrl: 'https://www.coinbase.com/wallet/downloads',
    checkInstalled: (p) => Boolean(p?.isCoinbaseWallet),
  },
  {
    id: 'com.brave.wallet',
    name: 'Brave Wallet',
    icon: 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
    downloadUrl: 'https://brave.com/wallet/',
    checkInstalled: (p) => Boolean(p?.isBraveWallet),
  },
  {
    id: 'me.rainbow',
    name: 'Rainbow Wallet',
    icon: 'https://avatars.githubusercontent.com/u/48327834?s=200&v=4',
    downloadUrl: 'https://rainbow.me/',
    checkInstalled: (p) => Boolean(p?.isRainbow),
  },
  {
    id: 'app.phantom',
    name: 'Phantom',
    icon: 'https://phantom.app/img/phantom-logo.svg',
    downloadUrl: 'https://phantom.app/',
    checkInstalled: (p) => Boolean(p?.isPhantom || window?.phantom?.ethereum),
  }
];

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ethBalance, setEthBalance] = useState(0.00);
  const [usdgBalance, setUsdgBalance] = useState(0);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // EIP-6963 Discovered Injected Providers
  const [discoveredProviders, setDiscoveredProviders] = useState([]);
  const [activeProvider, setActiveProvider] = useState(null);

  // Load persistent user data (USDG balance & profile stats)
  const loadUserData = async (address, defaultUsdg = 2500) => {
    if (!address) return;
    const key = address.toLowerCase();

    // 1. Persistent USDG balance in localStorage per wallet
    const savedUsdg = localStorage.getItem(`tood_usdg_${key}`);
    if (savedUsdg !== null) {
      setUsdgBalance(Number(savedUsdg));
    } else {
      setUsdgBalance(defaultUsdg);
      try {
        localStorage.setItem(`tood_usdg_${key}`, defaultUsdg.toString());
      } catch (e) {}
    }

    // 2. Fetch full player stats from Supabase
    try {
      const prof = await fetchUserProfile(address);
      if (prof) {
        setUserProfile(prof);
      }
    } catch (e) {
      console.warn('Failed to load profile:', e);
    }
  };

  // EIP-6963 Multi-Injected Provider Discovery Listener
  useEffect(() => {
    const handleAnnounceProvider = (event) => {
      const { info, provider } = event.detail;
      setDiscoveredProviders((prev) => {
        if (prev.some((p) => p.info.uuid === info.uuid)) return prev;
        return [...prev, { info, provider }];
      });
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounceProvider);
    // Request all wallet extensions to announce themselves
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounceProvider);
    };
  }, []);

  // Fetch Live On-Chain ETH Balance
  const fetchBalance = async (address, provider) => {
    const p = provider || activeProvider || window.ethereum;
    if (!p || !address) return;
    try {
      const balanceHex = await p.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceWei = BigInt(balanceHex);
      const ethVal = Number(balanceWei) / 1e18;
      setEthBalance(+(ethVal.toFixed(4)));
    } catch (e) {
      console.warn('Failed to fetch balance:', e);
    }
  };

  // Switch or Add Robinhood Chain
  const switchToRobinhoodChain = async (provider) => {
    const p = provider || activeProvider || window.ethereum;
    if (!p) return;
    try {
      await p.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ROBINHOOD_CHAIN.chainId }],
      });
      setIsWrongNetwork(false);
    } catch (switchError) {
      // 4902 error code indicates that the chain has not been added yet
      if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
        try {
          await p.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ROBINHOOD_CHAIN.chainId,
                chainName: ROBINHOOD_CHAIN.chainName,
                rpcUrls: ROBINHOOD_CHAIN.rpcUrls,
                nativeCurrency: ROBINHOOD_CHAIN.nativeCurrency,
                blockExplorerUrls: ROBINHOOD_CHAIN.blockExplorerUrls,
              },
            ],
          });
          setIsWrongNetwork(false);
        } catch (addError) {
          console.error('Failed to add Robinhood Chain:', addError);
        }
      }
    }
  };

  // Connect to a Specific Injected Provider or window.ethereum
  const connectWallet = async (selectedProvider = null) => {
    setConnectionError('');
    setIsConnecting(true);

    const provider = selectedProvider || activeProvider || window.ethereum;

    if (!provider) {
      setConnectionError('No Ethereum wallet detected in your browser. Please install MetaMask, Robinhood Wallet, or Rabby.');
      setIsConnecting(false);
      return;
    }

    try {
      setActiveProvider(provider);

      // Trigger REAL browser extension connection popup!
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const fullAddr = accounts[0];
        const shortAddr = `${fullAddr.slice(0, 6)}...${fullAddr.slice(-4)}`;
        
        setFullAddress(fullAddr);
        setAccount(shortAddr);
        setIsConnected(true);

        try {
          localStorage.setItem('tood_last_connected_wallet', fullAddr);
        } catch (e) {}

        // Sync user profile to Supabase database
        await syncUserProfile(fullAddr);

        // Check Network
        try {
          const chainId = await provider.request({ method: 'eth_chainId' });
          setCurrentChainId(chainId);
          if (parseInt(chainId, 16) !== ROBINHOOD_CHAIN.chainIdDecimal) {
            setIsWrongNetwork(true);
            // Prompt network switch
            await switchToRobinhoodChain(provider);
          }
        } catch (chainErr) {
          console.warn('Network check warning:', chainErr);
        }

        // Fetch balance
        await fetchBalance(fullAddr, provider);

        // Load persistent profile & USDG balance
        await loadUserData(fullAddr, 2500);
        setShowWalletModal(false);
      }
    } catch (err) {
      console.error('Wallet connection rejected or failed:', err);
      if (err.code === 4001) {
        setConnectionError('Connection request rejected by user.');
      } else {
        setConnectionError(err.message || 'Connection failed. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Demo Sandbox Wallet Connect (One-click instant trial)
  const connectDemoMode = async () => {
    const demoAddr = '0x71C83907c0E2134567890abcdef1234567890123';
    setFullAddress(demoAddr);
    setAccount('0x71C8...4E21');
    setIsConnected(true);
    setEthBalance(5.50);
    try {
      localStorage.setItem('tood_last_connected_wallet', 'demo');
    } catch (e) {}
    setShowWalletModal(false);
    setConnectionError('');
    await syncUserProfile(demoAddr);
    await loadUserData(demoAddr, 10000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setFullAddress(null);
    setEthBalance(0);
    setUsdgBalance(0);
    setUserProfile(null);
    setActiveProvider(null);
    try {
      localStorage.removeItem('tood_last_connected_wallet');
    } catch (e) {}
  };

  const claimFaucet = () => {
    setEthBalance((prev) => +(prev + 2.0).toFixed(4));
    setUsdgBalance((prev) => {
      const next = prev + 5000;
      if (fullAddress) {
        try {
          localStorage.setItem(`tood_usdg_${fullAddress.toLowerCase()}`, next.toString());
        } catch (e) {}
      }
      return next;
    });
  };

  const deductBalance = (amount, tokenType) => {
    if (tokenType === 'ETH') {
      if (ethBalance < amount) return false;
      setEthBalance((prev) => +(prev - amount).toFixed(4));
      return true;
    } else {
      if (usdgBalance < amount) return false;
      setUsdgBalance((prev) => {
        const next = +(prev - amount).toFixed(2);
        if (fullAddress) {
          try {
            localStorage.setItem(`tood_usdg_${fullAddress.toLowerCase()}`, next.toString());
          } catch (e) {}
        }
        return next;
      });
      return true;
    }
  };

  const creditBalance = (amount, tokenType) => {
    if (tokenType === 'ETH') {
      setEthBalance((prev) => +(prev + amount).toFixed(4));
    } else {
      setUsdgBalance((prev) => {
        const next = +(prev + amount).toFixed(2);
        if (fullAddress) {
          try {
            localStorage.setItem(`tood_usdg_${fullAddress.toLowerCase()}`, next.toString());
          } catch (e) {}
        }
        return next;
      });
    }
  };

  // Auto restore wallet connection from previous session if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tood_last_connected_wallet');
      if (saved === 'demo') {
        connectDemoMode();
      } else if (saved && (window.ethereum || activeProvider)) {
        const p = activeProvider || window.ethereum;
        p?.request?.({ method: 'eth_accounts' })
          .then((accs) => {
            if (accs && accs.length > 0 && accs[0].toLowerCase() === saved.toLowerCase()) {
              connectWallet(p);
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  // Listen to provider events (accountsChanged, chainChanged)
  useEffect(() => {
    const p = activeProvider || window.ethereum;
    if (!p || !p.on) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const fullAddr = accounts[0];
        setFullAddress(fullAddr);
        setAccount(`${fullAddr.slice(0, 6)}...${fullAddr.slice(-4)}`);
        fetchBalance(fullAddr, p);
      }
    };

    const handleChainChanged = (chainId) => {
      setCurrentChainId(chainId);
      setIsWrongNetwork(parseInt(chainId, 16) !== ROBINHOOD_CHAIN.chainIdDecimal);
      if (fullAddress) {
        fetchBalance(fullAddress, p);
      }
    };

    p.on('accountsChanged', handleAccountsChanged);
    p.on('chainChanged', handleChainChanged);

    return () => {
      if (p.removeListener) {
        p.removeListener('accountsChanged', handleAccountsChanged);
        p.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [activeProvider, fullAddress]);

  return (
    <WalletContext.Provider
      value={{
        account,
        fullAddress,
        isConnected,
        isConnecting,
        ethBalance,
        usdgBalance,
        userProfile,
        isWrongNetwork,
        showWalletModal,
        connectionError,
        discoveredProviders,
        setShowWalletModal,
        connectWallet,
        connectDemoMode,
        disconnectWallet,
        claimFaucet,
        deductBalance,
        creditBalance,
        switchToRobinhoodChain,
        loadUserData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
