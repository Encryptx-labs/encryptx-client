export const changeWallet = async (wallet, chainId) => {
  try {
    await wallet.switchChain(chainId);
    return { success: true };
  } catch (error) {
    // Handle specific error types
    if (error.code === 4902) {
      // Chain not added to wallet
      console.error("Chain not added to wallet:", error);
      return { 
        success: false, 
        error: "Selected network not added to wallet. Please add the network first." 
      };
    } else if (error.code === -32002) {
      // Request already pending
      console.error("Chain switch request pending:", error);
      return { 
        success: false, 
        error: "Network switch request already pending. Please check your wallet." 
      };
    } else if (error.code === 4001) {
      // User rejected request
      console.error("User rejected chain switch:", error);
      return { 
        success: false, 
        error: "Network switch was rejected. Please try again." 
      };
    }

    // Generic error handling
    console.error("Failed to switch chain:", error);
    return { 
      success: false, 
      error: "Failed to switch network. Please try again." 
    };
  }
};