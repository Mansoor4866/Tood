// 16 Real Tokens mapped to the 16 Grid plots (A1..D4) with authentic avatars and colors
export const GRID_TOKENS = [
  { id: 0, cell: 'A1', name: 'Pons', symbol: 'PONS', color: '#b6d7bb', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pons&backgroundColor=ffffff', ethStake: 1.45, usdgStake: 3200, stakersCount: 12, volume: '45.2 ETH' },
  { id: 1, cell: 'B1', name: 'Pepe Hood', symbol: 'PEPE', color: '#52c41a', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=pepehood&backgroundColor=498835', ethStake: 2.80, usdgStake: 5400, stakersCount: 28, volume: '88.5 ETH' },
  { id: 2, cell: 'C1', name: 'Cyber Doge', symbol: 'CDOGE', color: '#ff7849', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cdoge&backgroundColor=ffd7a8', ethStake: 0.95, usdgStake: 1800, stakersCount: 8, volume: '22.1 ETH' },
  { id: 3, cell: 'D1', name: 'Robin Cat', symbol: 'CAT', color: '#e3c98a', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=robincat&backgroundColor=d4b36a', ethStake: 3.40, usdgStake: 7800, stakersCount: 35, volume: '112.4 ETH' },
  
  { id: 4, cell: 'A2', name: 'Mushroom Protocol', symbol: 'SHROOM', color: '#d48806', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=shroom&backgroundColor=a88532', ethStake: 1.10, usdgStake: 2450, stakersCount: 14, volume: '34.6 ETH' },
  { id: 5, cell: 'B2', name: 'Pyramid Dao', symbol: 'PYRA', color: '#00c805', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=pyramid&backgroundColor=1f662a', ethStake: 2.15, usdgStake: 4100, stakersCount: 19, volume: '67.0 ETH' },
  { id: 6, cell: 'C2', name: 'Candy Swap', symbol: 'CANDY', color: '#eb2f96', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=candy&backgroundColor=e66ba7', ethStake: 4.20, usdgStake: 9500, stakersCount: 42, volume: '145.8 ETH' },
  { id: 7, cell: 'D2', name: 'Loop Ring', symbol: 'LOOP', color: '#2775ca', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=loop&backgroundColor=254d7e', ethStake: 1.85, usdgStake: 6200, stakersCount: 22, volume: '56.3 ETH' },

  { id: 8, cell: 'A3', name: 'Mech Bot', symbol: 'MECH', color: '#c0c0c0', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mechbot&backgroundColor=e0e0e0', ethStake: 1.60, usdgStake: 3500, stakersCount: 15, volume: '49.1 ETH' },
  { id: 9, cell: 'B3', name: 'Sad Cat', symbol: 'SAD', color: '#ffffff', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=sadcat&backgroundColor=ffffff', ethStake: 0.85, usdgStake: 1600, stakersCount: 9, volume: '19.8 ETH' },
  { id: 10, cell: 'C3', name: 'Neural Head', symbol: 'BRAIN', color: '#ffd700', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=brainai&backgroundColor=1a3b3a', ethStake: 2.05, usdgStake: 4600, stakersCount: 20, volume: '73.2 ETH' },
  { id: 11, cell: 'D3', name: 'Golden Eagle', symbol: 'EAGLE', color: '#e3c98a', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=eagle&backgroundColor=d9a84e', ethStake: 1.75, usdgStake: 3800, stakersCount: 17, volume: '58.7 ETH' },

  { id: 12, cell: 'A4', name: 'Knight Guard', symbol: 'GUARD', color: '#7c887e', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=knight&backgroundColor=5c6a60', ethStake: 0.70, usdgStake: 1200, stakersCount: 6, volume: '14.5 ETH' },
  { id: 13, cell: 'B4', name: 'Oracle Eye', symbol: 'ORCL', color: '#00f0ff', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=oracle&backgroundColor=1b4757', ethStake: 1.30, usdgStake: 2900, stakersCount: 11, volume: '39.0 ETH' },
  { id: 14, cell: 'C4', name: 'Pixel Fox', symbol: 'FOX', color: '#52c41a', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pixelfox&backgroundColor=284d2a', ethStake: 1.15, usdgStake: 2100, stakersCount: 10, volume: '31.2 ETH' },
  { id: 15, cell: 'D4', name: 'Hedgehog Club', symbol: 'HODG', color: '#ff4d4f', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=hedgehog&backgroundColor=8f5b40', ethStake: 0.50, usdgStake: 900, stakersCount: 5, volume: '11.0 ETH' }
];

export const INITIAL_PLOTS = GRID_TOKENS;

export const INITIAL_SALOON_CHATS = [
  { id: 1, user: '0x0c58...c219', text: 'hi!', time: '23:24', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' },
  { id: 2, user: '0x4ed4...9ece', text: 'yo', time: '23:24', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2' },
  { id: 3, user: '0x4ed4...9ece', text: 'this dope af', time: '23:28', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2' },
  { id: 4, user: '0x0c58...c219', text: 'go go go', time: '02:35', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' },
  { id: 5, user: '0x0c58...c219', text: 'fuck', time: '02:36', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' },
  { id: 6, user: '0x0c58...c219', text: 'go next round????', time: '02:37', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' }
];

export const HOUSE_RULES = [
  {
    num: "01",
    title: "An empty plot pays nobody",
    description: "If the draw lands on a plot holding less than the round minimum, that whole pot goes back to the people who staked it, and no fee is taken"
  },
  {
    num: "02",
    title: "Two pots, never mixed",
    description: "ETH and USDG settle apart from each other. One can pay out while the other refunds. No price feed ever touches your payout"
  },
  {
    num: "03",
    title: "The draw cannot be withheld",
    description: "The seed is sealed on chain before the round opens, then mixed with the hash of the block that closed it. Nobody, operator included, can pick the outcome"
  },
  {
    num: "04",
    title: "You collect it yourself",
    description: "Ninety percent of the entire round pot goes to whoever holds the drawn plot, shared out by stake. Everyone else lost the ground they stood on"
  }
];

export const HOW_A_CLAIM_PAYS = [
  {
    num: "01",
    title: "Stake a plot",
    description: "Pick one of sixteen. Put ETH or USDG on it. Hold as many plots as you like, and keep adding to them until the clock runs out"
  },
  {
    num: "02",
    title: "Ride with a token",
    description: "Every stake is signed with one of the sixteen Robinhood Chain tokens on the map. Whichever token holds the most volume on a plot flies its colours there. It changes the map, never the money"
  },
  {
    num: "03",
    title: "The draw",
    description: "The seed is sealed on chain before the round opens, then mixed with the hash of the block that closed it. Nobody, operator included, can pick the outcome"
  },
  {
    num: "04",
    title: "Split the pot",
    description: "Ninety percent of the entire round pot goes to whoever holds the drawn plot, shared out by stake. Everyone else lost the ground they stood on"
  }
];

export const INITIAL_HISTORY = [
  { round: 3, block: 1984201, cell: 'D1', token: 'CAT', crew: '—', potEth: 0, potUsdg: 1, winnerCount: 0, time: '2 mins ago', txHash: '0x451b...d751', refunded: true },
  { round: 2, block: 1984180, cell: 'A4', token: 'GUARD', crew: '—', potEth: 0.001, potUsdg: 0, winnerCount: 0, time: '5 mins ago', txHash: '0xded8...79cc', refunded: true },
  { round: 1, block: 1984159, cell: 'D4', token: 'HODG', crew: '—', potEth: 0, potUsdg: 1, winnerCount: 0, time: '8 mins ago', txHash: '0xe8ff...9791', refunded: true }
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, address: '0x71C...8921', name: '0x71C8...8921', wonEth: 18.45, wonUsdg: 34200, stakedEth: 4.20, stakedUsdg: 8100, winRate: '68%', roundsPlayed: 45 },
  { rank: 2, address: '0x3Fa...4412', name: '0x3Fa2...4412', wonEth: 14.10, wonUsdg: 26800, stakedEth: 3.80, stakedUsdg: 7500, winRate: '61%', roundsPlayed: 39 },
  { rank: 3, address: '0x99B...a3F1', name: '0x99B0...a3F1', wonEth: 11.75, wonUsdg: 22100, stakedEth: 2.90, stakedUsdg: 6200, winRate: '54%', roundsPlayed: 32 },
  { rank: 4, address: '0x12E...76c0', name: '0x12E9...76c0', wonEth: 9.30, wonUsdg: 18400, stakedEth: 3.10, stakedUsdg: 5900, winRate: '49%', roundsPlayed: 28 }
];
