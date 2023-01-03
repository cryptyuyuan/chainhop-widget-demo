export const widgetConfig = {
  referCode: "testWidget",
  domain: window.location.origin,
  swapMode: 2,
  chains: [56, 1, 43114, 10, 250],
  tokenList: [
    {
      chainId: 56,
      symbol: "SFM",
      address: "0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5",
      decimals: 9,
      name: "SafeMoon",
      logoUri: "https://bscscan.com/token/images/safemoon2_32.png",
    },
    {
      chainId: 56,
      symbol: "JST",
      address: "0xeA998D307ACA04D4f0A3B3036Aba84AE2E409C0A",
      decimals: 18,
      name: "JUST",
      logoUri: "https://bscscan.com/token/images/just_32.png",
    },
  ],
};

export interface NetworkInfo {
  name: string;
  color: string;
  chainId: number;
  rpcUrl: string;
  walletRpcUrl?: string;
  iconUrl: string;
  symbol: string;
  wrapTokenAddress: string;
  blockExplorerUrl: string;
}

export const mainnetNetworks = {
  localhost: {
    name: "--",
    chainId: 31337,
    rpcUrl: "http://localhost:8545",
    iconUrl: "./defaultIcon.png",
    symbol: "ETH",
    wrapTokenAddress: "WETH",
    blockExplorerUrl: "",
  },

  goerli: {
    name: "Goerli Testnet",
    chainId: 5,
    rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    iconUrl: "./ETH.png",
    symbol: "ETH",
    wrapTokenAddress: "WETH",
    blockExplorerUrl: "https://goerli.etherscan.io",
  },
  bscTest: {
    name: "BSC Testnet",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    iconUrl: "./bsc.png",
    symbol: "BNB",
    wrapTokenAddress: "WBNB",
    blockExplorerUrl: "https://testnet.bscscan.com",
  },
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    iconUrl: "./ETH.png",
    symbol: "ETH",
    wrapTokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    blockExplorerUrl: "https://etherscan.io",
  },
  bsc: {
    name: "BNB Chain",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    iconUrl: "./bnbchain.png",
    symbol: "BNB",
    wrapTokenAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    blockExplorerUrl: "https://bscscan.com",
  },

  polygon: {
    name: "Polygon (Matic)",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    iconUrl: "./polygon.png",
    symbol: "MATIC",
    wrapTokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    blockExplorerUrl: "https://polygonscan.com",
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    iconUrl: "./arbitrum.png",
    symbol: "ETH",
    wrapTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    blockExplorerUrl: "https://arbiscan.io",
  },
  Avalanche: {
    name: "Avalanche",
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    iconUrl: "./avalanche.png",
    symbol: "AVAX",
    wrapTokenAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    blockExplorerUrl: "https://snowtrace.io",
  },

  Fantom: {
    name: "Fantom",
    chainId: 250,
    rpcUrl: "https://rpc.ftm.tools",
    iconUrl: "./fantom.png",
    symbol: "FTM",
    wrapTokenAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    blockExplorerUrl: "https://ftmscan.com",
  },

  Optimism: {
    name: "Optimism",
    chainId: 10,
    rpcUrl:
      "https://opt-mainnet.g.alchemy.com/v2/PmGpTd85SWGf8488jy5H1--I09WBEkIl",
    walletRpcUrl: "https://mainnet.optimism.io",
    iconUrl: "./optimism.png",
    symbol: "ETH",
    wrapTokenAddress: "0x4200000000000000000000000000000000000006",
    blockExplorerUrl: "https://optimistic.etherscan.io",
  },
};

export const NETWORKS = mainnetNetworks;
export const CHAIN_LIST: NetworkInfo[] = Object.values(
  NETWORKS
) as NetworkInfo[];

export const getNetworkById: (chainId: number) => NetworkInfo = (
  chainId: number
) => {
  /* eslint-disable-next-line no-restricted-syntax */
  for (let i = 0; i < CHAIN_LIST.length; i++) {
    if (
      CHAIN_LIST[i]?.chainId === chainId ||
      CHAIN_LIST[i].chainId === Number(chainId)
    ) {
      return CHAIN_LIST[i];
    }
  }
  return NETWORKS.localhost as NetworkInfo;
};
