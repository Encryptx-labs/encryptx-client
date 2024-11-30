// utils/faucet.js
import { ethers } from 'ethers';

export const networks = {
  inco: {
    name: 'INCO',
    rpcUrl: process.env.NEXT_PUBLIC_INCO_RPC_URL,
    explorer: process.env.NEXT_PUBLIC_INCO_EXPLORER
  },
  linea: {
    name: 'LINEA',
    rpcUrl: process.env.NEXT_PUBLIC_LINEA_RPC_URL,
    explorer: process.env.NEXT_PUBLIC_LINEA_EXPLORER
  }
};

export class FaucetClient {
  constructor() {
    this.minBalance = ethers.parseEther('0.1');
    this.fundingAmount = ethers.parseEther('0.1');
  }

  async getProvider(network) {
    return new ethers.JsonRpcProvider(networks[network].rpcUrl);
  }

  async checkBalance(address, network) {
    const provider = await this.getProvider(network);
    return await provider.getBalance(address);
  }

  async sendFunds(address, network) {
    try {
      const provider = await this.getProvider(network);
      const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
      
      const balance = await this.checkBalance(address, network);
      
      if (balance >= this.minBalance) {
        throw new Error(`Balance is already above 0.1 ${networks[network].name}`);
      }

      const tx = await wallet.sendTransaction({
        to: address,
        value: this.fundingAmount
      });

      const receipt = await tx.wait();
      
      return {
        success: true,
        message: `Successfully funded address on ${networks[network].name}`,
        txHash: receipt.hash,
        explorerUrl: `${networks[network].explorer}/tx/${receipt.hash}`
      };
    } catch (error) {
      throw new Error(`Failed to fund on ${networks[network].name}: ${error.message}`);
    }
  }
}