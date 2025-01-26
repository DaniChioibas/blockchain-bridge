import React, { useState } from "react";
import { WalletProvider, useWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

const ConnectWallet = () => {
  const wallet = useWallet();
  const [connectedAddress, setConnectedAddress] = useState(null);

  const handleConnect = async () => {
    try {
      await wallet.connect();
      setConnectedAddress(wallet.account?.address || null);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
      setConnectedAddress(null);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Connect to Wallet</h1>
      {connectedAddress ? (
        <div>
          <p>Connected as:</p>
          <p style={{ fontFamily: "monospace", color: "gray" }}>{connectedAddress}</p>
          <button
            style={{ padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          style={{ padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

const App = () => {
  return (
    <WalletProvider>
      <ConnectWallet />
    </WalletProvider>
  );
};

export default App;
