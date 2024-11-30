export const chainsName = { 
  inco: "Inco",
  lineaSepolia: "Linea Sepolia"
};

export const incoNetwork = {
  id: 21097,
  network: "Rivest",
  name: "Rivest Testnet",
  nativeCurrency: {
    name: "INCO",
    symbol: "INCO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://validator.rivest.inco.org"],
    },
    public: {
      http: ["https://validator.rivest.inco.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.rivest.inco.org",
    },
  },
};

export const lineaSepoliaNetwork = {
  id: 59141,
  network: "linea-sepolia",
  name: "Linea Sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.linea.build"],
    },
    public: {
      http: ["https://rpc.sepolia.linea.build"],
    },
  },
  blockExplorers: {
    default: {
      name: "Lineascan",
      url: "https://sepolia.lineascan.build",
    },
  },
  testnet: true,
};

export const networks = {
  inco: incoNetwork,
  lineaSepolia: lineaSepoliaNetwork,
};