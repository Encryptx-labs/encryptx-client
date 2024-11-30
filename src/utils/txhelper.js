// utils/transactionHelper.js
import { ethers } from 'ethers';

export class TransactionHelper {
  constructor(config = {}) {
    this.providers = {
      inco: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INCO_RPC_URL),
      linea: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_LINEA_RPC_URL)
    };
    
    this.funderWallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY
    );
    
    this.minBalance = ethers.parseEther(config.minBalance || '0.1');
    this.fundingAmount = ethers.parseEther(config.fundingAmount || '0.1');
  }

  async ensureWalletFunded(address, network, estimatedGas) {
    try {
      const provider = this.providers[network];
      const balance = await provider.getBalance(address);
      const requiredBalance = estimatedGas + this.minBalance;

      // If balance is sufficient, return immediately
      if (balance >= requiredBalance) {
        return {
          funded: true,
          message: 'Wallet has sufficient funds',
          balance: balance
        };
      }

      // Need to fund the wallet
      const connectedFunder = this.funderWallet.connect(provider);
      const tx = await connectedFunder.sendTransaction({
        to: address,
        value: this.fundingAmount
      });

      const receipt = await tx.wait();

      return {
        funded: true,
        message: 'Wallet has been funded',
        txHash: receipt.hash,
        balance: await provider.getBalance(address)
      };

    } catch (error) {
      return {
        funded: false,
        message: `Failed to fund wallet: ${error.message}`,
        error: error
      };
    }
  }

  async executeWithFunding(
    transactionFunc,
    { address, network, gasEstimate = ethers.parseEther('0.01') }
  ) {
    try {
      // First ensure the wallet has enough funds
      const fundingResult = await this.ensureWalletFunded(
        address,
        network,
        gasEstimate
      );

      if (!fundingResult.funded) {
        throw new Error(fundingResult.message);
      }

      // Execute the actual transaction
      return await transactionFunc();

    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}

// Example usage:
/*
// Initialize the helper
const txHelper = new TransactionHelper({
  minBalance: '0.1',    // 0.1 ETH minimum balance
  fundingAmount: '0.1'  // Fund 0.1 ETH when needed
});

// Use it with any transaction
const sendNFT = async () => {
  try {
    const result = await txHelper.executeWithFunding(
      async () => {
        // Your actual transaction code here
        const tx = await nftContract.mint(address);
        return await tx.wait();
      },
      {
        address: userAddress,
        network: 'inco',
        gasEstimate: ethers.parseEther('0.05') // Estimated gas needed
      }
    );
    
    console.log('Transaction successful:', result);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};
*/