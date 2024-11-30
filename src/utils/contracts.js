
export const LINEA_SEPOLIA_MAILBOX =
  "0x4e9D72CEC8576fC12b41f25A344B1F5F41270E52";
export const INCO_ADDRESS = "0xf14cd3457E87cCbdb8c4B4c72b637874F921f537";
export const USDCADDRESS = "0xd6CA7dc92249e6CD18450EdeCFb312eEcaBF73C3";
export const LINEA_SEPOLIA_EVENT_CONTRACT =
  "0x30e7dC00c645B6F45Bba89d957dc55e4db734b00";

export const MAILBOXES = {
  LINEA_SEPOLIA: LINEA_SEPOLIA_MAILBOX,
  INCO: INCO_ADDRESS,
};

export const INCO_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mailBoxAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "eaddress",
        name: "holderAddress",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenProcessed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "einput",
        name: "_eaddressInput",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "inputProof",
        type: "bytes",
      },
    ],
    name: "formEaddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "senderContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getDeterministicKey",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_tokeKey",
        type: "bytes32",
      },
    ],
    name: "getEaddressForTicket",
    outputs: [
      {
        internalType: "eaddress",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
    ],
    name: "getRandomWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_origin",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_sender",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "handle",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "interchainSecurityModule",
    outputs: [
      {
        internalType: "contract IInterchainSecurityModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mailbox",
    outputs: [
      {
        internalType: "contract IMailbox",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "randomNumber",
        type: "uint32",
      },
    ],
    name: "myCustomCallback",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "eventContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "readUsersTotalTickets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requestIdToStruct",
    outputs: [
      {
        internalType: "uint256",
        name: "originChain",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "eventContractAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "returnAEaddress",
    outputs: [
      {
        internalType: "eaddress",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "eventContract",
        type: "address",
      },
    ],
    name: "returnEaddress",
    outputs: [
      {
        internalType: "eaddress",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "setInterchainSecurityModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenKeyCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "tokenKeyToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "tokenKeyToEaddress",
    outputs: [
      {
        internalType: "eaddress",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "eaddress",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenKeyToEaddressToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenKeyWinner",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const LINEA_SEPOLIA_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_paymentToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mailBoxAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_raffleAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_incoContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cost",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "actualEInput",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "inputProof",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenPurchased",
    type: "event",
  },
  {
    inputs: [],
    name: "cost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incoContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incoDomain",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mailBox",
    outputs: [
      {
        internalType: "contract IMailbox",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "actualEInput",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "inputProof",
        type: "bytes",
      },
    ],
    name: "purchaseToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "raffleAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newIncoContractAddress",
        type: "address",
      },
    ],
    name: "setIncoContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "tokenIdToAddressToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenIdToToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenUri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newRaffleAmount",
        type: "uint256",
      },
    ],
    name: "updateRaffleAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const DUMMYABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_paymentToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mailBoxAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_raffleAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_incoContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cost",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "actualEInput",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "inputProof",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "purchaseToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newIncoContractAddress",
        type: "address",
      },
    ],
    name: "setIncoContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "actualEInput",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "inputProof",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenPurchased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newRaffleAmount",
        type: "uint256",
      },
    ],
    name: "updateRaffleAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incoContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incoDomain",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mailBox",
    outputs: [
      {
        internalType: "contract IMailbox",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "raffleAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "tokenIdToAddressToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenIdToToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenUri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const USDC_LINEA_SEPOLIA_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "transferFromOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const CONTRACTBYTECODE =
 "60806040523480156200001157600080fd5b5060405162001c0d38038062001c0d83398181016040528101906200003791906200034b565b33600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000ad5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000a49190620003e4565b60405180910390fd5b620000be81620001e260201b60201c565b5084600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040518060400160405280600381526020017f75726900000000000000000000000000000000000000000000000000000000008152506005908162000187919062000671565b508260068190555081600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600781905550505050505062000758565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620002d882620002ab565b9050919050565b620002ea81620002cb565b8114620002f657600080fd5b50565b6000815190506200030a81620002df565b92915050565b6000819050919050565b620003258162000310565b81146200033157600080fd5b50565b60008151905062000345816200031a565b92915050565b600080600080600060a086880312156200036a5762000369620002a6565b5b60006200037a88828901620002f9565b95505060206200038d88828901620002f9565b9450506040620003a08882890162000334565b9350506060620003b388828901620002f9565b9250506080620003c68882890162000334565b9150509295509295909350565b620003de81620002cb565b82525050565b6000602082019050620003fb6000830184620003d3565b92915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200048357607f821691505b6020821081036200049957620004986200043b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620005037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620004c4565b6200050f8683620004c4565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005526200054c620005468462000310565b62000527565b62000310565b9050919050565b6000819050919050565b6200056e8362000531565b620005866200057d8262000559565b848454620004d1565b825550505050565b600090565b6200059d6200058e565b620005aa81848462000563565b505050565b5b81811015620005d257620005c660008262000593565b600181019050620005b0565b5050565b601f8211156200062157620005eb816200049f565b620005f684620004b4565b8101602085101562000606578190505b6200061e6200061585620004b4565b830182620005af565b50505b505050565b600082821c905092915050565b6000620006466000198460080262000626565b1980831691505092915050565b600062000661838362000633565b9150826002028217905092915050565b6200067c8262000401565b67ffffffffffffffff8111156200069857620006976200040c565b5b620006a482546200046a565b620006b1828285620005d6565b600060209050601f831160018114620006e95760008415620006d4578287015190505b620006e0858262000653565b86555062000750565b601f198416620006f9866200049f565b60005b828110156200072357848901518255600182019150602085019450602081019050620006fc565b868310156200074357848901516200073f601f89168262000633565b8355505b6001600288020188555050505b505050505050565b6114a580620007686000396000f3fe6080604052600436106100f35760003560e01c80636bd5c4e61161008a578063c94028c211610059578063c94028c2146102e9578063e2f09c8014610314578063f2fde38b14610351578063f52bcc111461037a576100f3565b80636bd5c4e614610251578063715018a61461027c5780638da5cb5b14610293578063c77391e6146102be576100f3565b8063355e0c5d116100c6578063355e0c5d146101b657806344d544df146101e1578063494be57a146101fd578063547cb1d414610228576100f3565b806313faede6146100f857806317d70f7c14610123578063230ee0551461014e5780633013ce291461018b575b600080fd5b34801561010457600080fd5b5061010d6103a3565b60405161011a9190610baa565b60405180910390f35b34801561012f57600080fd5b506101386103a9565b6040516101459190610baa565b60405180910390f35b34801561015a57600080fd5b5061017560048036038101906101709190610c3b565b6103af565b6040516101829190610baa565b60405180910390f35b34801561019757600080fd5b506101a06103d4565b6040516101ad9190610cbc565b60405180910390f35b3480156101c257600080fd5b506101cb6103fa565b6040516101d89190610d67565b60405180910390f35b6101fb60048036038101906101f69190610ebe565b610488565b005b34801561020957600080fd5b50610212610892565b60405161021f9190610cbc565b60405180910390f35b34801561023457600080fd5b5061024f600480360381019061024a9190610f59565b6108b8565b005b34801561025d57600080fd5b506102666108fc565b6040516102739190610fe5565b60405180910390f35b34801561028857600080fd5b50610291610922565b005b34801561029f57600080fd5b506102a8610936565b6040516102b59190610cbc565b60405180910390f35b3480156102ca57600080fd5b506102d361095f565b6040516102e0919061101f565b60405180910390f35b3480156102f557600080fd5b506102fe610965565b60405161030b9190610baa565b60405180910390f35b34801561032057600080fd5b5061033b6004803603810190610336919061103a565b61096b565b6040516103489190610baa565b60405180910390f35b34801561035d57600080fd5b5061037860048036038101906103739190610f59565b610983565b005b34801561038657600080fd5b506103a1600480360381019061039c919061103a565b610a09565b005b60075481565b60015481565b6008602052816000526040600020602052806000526040600020600091509150505481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6005805461040790611096565b80601f016020809104026020016040519081016040528092919081815260200182805461043390611096565b80156104805780601f1061045557610100808354040283529160200191610480565b820191906000526020600020905b81548152906001019060200180831161046357829003601f168201915b505050505081565b8060075461049691906110f6565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b81526004016104f3929190611138565b602060405180830381865afa158015610510573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105349190611176565b1015610575576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056c906111ef565b60405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846007546105c391906110f6565b6040518463ffffffff1660e01b81526004016105e19392919061120f565b6020604051808303816000875af1158015610600573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610624919061127e565b50806008600060015481526020019081526020016000206000858152602001908152602001600020819055506001543373ffffffffffffffffffffffffffffffffffffffff167ffda420ee4b35a6c6ddf22465057a4128f06fd94ae7521dd7962fcb243c80019a85858560405161069d9392919061130f565b60405180910390a3600160008154809291906106b89061134d565b91905055506000336001548585856040516020016106da959493929190611395565b60405160208183030381529060405290506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639c42bd18615269610759600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610a1b565b856040518463ffffffff1660e01b8152600401610778939291906113ef565b602060405180830381865afa158015610795573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107b99190611176565b9050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663fa31de0182615269610828600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610a1b565b866040518563ffffffff1660e01b8152600401610847939291906113ef565b60206040518083038185885af1158015610865573d6000803e3d6000fd5b50505050506040513d601f19601f8201168201806040525081019061088a9190611442565b505050505050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61092a610a3e565b6109346000610ac5565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b61526981565b60065481565b60096020528060005260406000206000915090505481565b61098b610a3e565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036109fd5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016109f49190610cbc565b60405180910390fd5b610a0681610ac5565b50565b610a11610a3e565b8060068190555050565b60008173ffffffffffffffffffffffffffffffffffffffff1660001b9050919050565b610a46610b89565b73ffffffffffffffffffffffffffffffffffffffff16610a64610936565b73ffffffffffffffffffffffffffffffffffffffff1614610ac357610a87610b89565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610aba9190610cbc565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6000819050919050565b610ba481610b91565b82525050565b6000602082019050610bbf6000830184610b9b565b92915050565b6000604051905090565b600080fd5b600080fd5b610be281610b91565b8114610bed57600080fd5b50565b600081359050610bff81610bd9565b92915050565b6000819050919050565b610c1881610c05565b8114610c2357600080fd5b50565b600081359050610c3581610c0f565b92915050565b60008060408385031215610c5257610c51610bcf565b5b6000610c6085828601610bf0565b9250506020610c7185828601610c26565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610ca682610c7b565b9050919050565b610cb681610c9b565b82525050565b6000602082019050610cd16000830184610cad565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d11578082015181840152602081019050610cf6565b60008484015250505050565b6000601f19601f8301169050919050565b6000610d3982610cd7565b610d438185610ce2565b9350610d53818560208601610cf3565b610d5c81610d1d565b840191505092915050565b60006020820190508181036000830152610d818184610d2e565b905092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610dcb82610d1d565b810181811067ffffffffffffffff82111715610dea57610de9610d93565b5b80604052505050565b6000610dfd610bc5565b9050610e098282610dc2565b919050565b600067ffffffffffffffff821115610e2957610e28610d93565b5b610e3282610d1d565b9050602081019050919050565b82818337600083830152505050565b6000610e61610e5c84610e0e565b610df3565b905082815260208101848484011115610e7d57610e7c610d8e565b5b610e88848285610e3f565b509392505050565b600082601f830112610ea557610ea4610d89565b5b8135610eb5848260208601610e4e565b91505092915050565b600080600060608486031215610ed757610ed6610bcf565b5b6000610ee586828701610c26565b935050602084013567ffffffffffffffff811115610f0657610f05610bd4565b5b610f1286828701610e90565b9250506040610f2386828701610bf0565b9150509250925092565b610f3681610c9b565b8114610f4157600080fd5b50565b600081359050610f5381610f2d565b92915050565b600060208284031215610f6f57610f6e610bcf565b5b6000610f7d84828501610f44565b91505092915050565b6000819050919050565b6000610fab610fa6610fa184610c7b565b610f86565b610c7b565b9050919050565b6000610fbd82610f90565b9050919050565b6000610fcf82610fb2565b9050919050565b610fdf81610fc4565b82525050565b6000602082019050610ffa6000830184610fd6565b92915050565b600063ffffffff82169050919050565b61101981611000565b82525050565b60006020820190506110346000830184611010565b92915050565b6000602082840312156110505761104f610bcf565b5b600061105e84828501610bf0565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806110ae57607f821691505b6020821081036110c1576110c0611067565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061110182610b91565b915061110c83610b91565b925082820261111a81610b91565b91508282048414831517611131576111306110c7565b5b5092915050565b600060408201905061114d6000830185610cad565b61115a6020830184610cad565b9392505050565b60008151905061117081610bd9565b92915050565b60006020828403121561118c5761118b610bcf565b5b600061119a84828501611161565b91505092915050565b7f496e73756666696369656e7420616c6c6f77616e636500000000000000000000600082015250565b60006111d9601683610ce2565b91506111e4826111a3565b602082019050919050565b60006020820190508181036000830152611208816111cc565b9050919050565b60006060820190506112246000830186610cad565b6112316020830185610cad565b61123e6040830184610b9b565b949350505050565b60008115159050919050565b61125b81611246565b811461126657600080fd5b50565b60008151905061127881611252565b92915050565b60006020828403121561129457611293610bcf565b5b60006112a284828501611269565b91505092915050565b6112b481610c05565b82525050565b600081519050919050565b600082825260208201905092915050565b60006112e1826112ba565b6112eb81856112c5565b93506112fb818560208601610cf3565b61130481610d1d565b840191505092915050565b600060608201905061132460008301866112ab565b818103602083015261133681856112d6565b90506113456040830184610b9b565b949350505050565b600061135882610b91565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361138a576113896110c7565b5b600182019050919050565b600060a0820190506113aa6000830188610cad565b6113b76020830187610b9b565b6113c460408301866112ab565b81810360608301526113d681856112d6565b90506113e56080830184610b9b565b9695505050505050565b60006060820190506114046000830186611010565b61141160208301856112ab565b818103604083015261142381846112d6565b9050949350505050565b60008151905061143c81610c0f565b92915050565b60006020828403121561145857611457610bcf565b5b60006114668482850161142d565b9150509291505056fea264697066735822122020a6bc8f312d3448a4cec8f33098167acfd36c427233222fe0829fa958e49bf464736f6c63430008180033"