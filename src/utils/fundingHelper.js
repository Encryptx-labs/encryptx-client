// utils/fundingHelper.js
import { ethers } from 'ethers';

const NETWORK_CONFIG = {
  inco: {
    rpcUrl: process.env.NEXT_PUBLIC_INCO_RPC_URL,
    name: 'INCO'
  },
  linea: {
    rpcUrl: process.env.NEXT_PUBLIC_LINEA_RPC_URL,
    name: 'LINEA'
  }
};

export async function ensureFunding(
  address, 
  network = 'inco', 
  requiredBalance = '0.1',
  fundAmount = '0.1'
) {
  try {
    // Validate inputs
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid address');
    }
    
    if (!NETWORK_CONFIG[network]) {
      throw new Error('Invalid network');
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG[network].rpcUrl);
    const funder = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

    // Convert amounts to BigInt
    const minBalanceRequired = ethers.parseEther('0.01');
    const fundingAmount = ethers.parseEther('0.01');

    // Check current balance
    const currentBalance = await provider.getBalance(address);

    // If balance is sufficient, return early
    if (currentBalance >= minBalanceRequired) {
      return {
        success: true,
        funded: false,
        message: `Sufficient balance already exists on ${NETWORK_CONFIG[network].name}`,
        balance: ethers.formatEther(currentBalance)
      };
    }

    // Send funding transaction
    const tx = await funder.sendTransaction({
      to: address,
      value: fundingAmount,
    });

    const receipt = await tx.wait();
    const newBalance = await provider.getBalance(address);

    return {
      success: true,
      funded: true,
      message: `Successfully funded address on ${NETWORK_CONFIG[network].name}`,
      txHash: receipt.hash,
      balance: ethers.formatEther(newBalance)
    };

  } catch (error) {
    return {
      success: false,
      funded: false,
      message: `Funding failed: ${error.message}`,
      error: error
    };
  }
}