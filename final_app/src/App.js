import React, { useState } from 'react';
import { ConnectButton, useAccountBalance, useWallet, useCoinBalance } from '@suiet/wallet-kit';
import Web3 from 'web3';
import contractABI from './contractABI.json';
import "@suiet/wallet-kit/style.css";
import "./App.css";

export default function App() {
  const [ethAccount, setEthAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [suiAmount, setSuiAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const { balance: itbTokenBalance } = useCoinBalance({
    type: '0x3d9c22b536e38cb5cbe198cd22c1bf71b421de215be3383c633580e5bf792245::itb::ITB',
    disabled: false,
  });

  const CONTRACT_ADDRESS = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';

  {successMessage && (
    <div className="success-message">
      <p>{successMessage}</p>
    </div>
  )}
  // Metamask Connection
  const connectMetamask = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setEthAccount(accounts[0]);
        setWeb3(web3Instance);

        const tokenContract = new web3Instance.eth.Contract(contractABI, CONTRACT_ADDRESS);
        setContract(tokenContract);
      } catch (error) {
        console.error("Metamask Connection failed:", error);
      }
    } else {
      console.error("Metamask is not installed");
    }
  };

  // Ethereum MINT
  const mintTokens = async () => {
    if (contract && ethAccount && ethAmount) {
      try {
        // Send mint transaction
        await contract.methods.mint(ethAccount, `${ethAmount}000000000000000000`).send({ from: ethAccount });
        console.log(`Minted ${ethAmount} ITB tokens to ${ethAccount}`);
        
        // Success message
        setSuccessMessage(`Successfully minted ${ethAmount} ITB tokens to Ethereum account`);
      } catch (error) {
        console.error("Error during minting:", error);
        setSuccessMessage('Error during minting');
      }
    } else {
      setSuccessMessage('Ethereum account or contract is not connected');
    }
  };

  // Ethereum BURN
  const burnTokens = async () => {
    if (contract && ethAccount && ethAmount) {
      try {
        // Send burn transaction
        await contract.methods.burn(`${ethAmount}000000000000000000`).send({ from: ethAccount });
        console.log(`Burned ${ethAmount} ITB tokens from ${ethAccount}`);
      } catch (error) {
        console.error("Error during burning:", error);
      }
    } else {
      console.error("Ethereum account or contract is not connected");
    }
  };

    // Sui MINT
    const mintSuiTokens = async () => {
      if (suiAmount) {
        try {
          const response = await fetch('http://localhost:5000/mint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              account: '0x780680913b960bef99ee6ba11c21d5a0badb975e67b6523c181e9b6bf19c42a4', // forgot to change to wallet account
              amount: suiAmount,
            }),
          });
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Error during minting:", error);
        }
      } else {
        console.error("Sui amount is missing");
      }
    };
  
    // Sui BURN
    const burnSuiTokens = async () => {
      if (suiAmount) {
        try {
          const response = await fetch('http://localhost:5000/burn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              account: '0x780680913b960bef99ee6ba11c21d5a0badb975e67b6523c181e9b6bf19c42a4', // f
              amount: suiAmount,
            }),
          });
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Error during burning:", error);
        }
      } else {
        console.error("Sui amount is missing");
      }
    };

  const transferSuiToEth = async () => {
    if (transferAmount) {
      try {
        const response = await fetch('http://localhost:5000/burn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: '0x780680913b960bef99ee6ba11c21d5a0badb975e67b6523c181e9b6bf19c42a4', 
            amount: transferAmount,
          }),
        });
        const result = await response.json();
        console.log(result);
        if (contract && ethAccount && transferAmount) {
          try {
            // Send mint transaction
            await contract.methods.mint(ethAccount, `${transferAmount}000000000000000000`).send({ from: ethAccount });
            console.log(`Minted ${transferAmount} ITB tokens to ${ethAccount}`);
          } catch (error) {
            console.error("Error during minting:", error);
          }
        } else {
          console.error("Ethereum account or contract is not connected");
        }
      } catch (error) {
        console.error("Error during burning:", error);
      }
    } else {
      console.error("Sui amount is missing");
    }
  };

  const transferEthToSui = async () => {
    if (contract && ethAccount && transferAmount) {
      try {
        // Burn tokens from Ethereum
        await contract.methods.burn(`${transferAmount}000000000000000000`).send({ from: ethAccount });
        console.log(`Burned ${transferAmount} ITB tokens from ${ethAccount}`);
        
        // Mint tokens on Sui
        const response = await fetch('http://localhost:5000/mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account: '0x780680913b960bef99ee6ba11c21d5a0badb975e67b6523c181e9b6bf19c42a4', // example account
            amount: transferAmount,
          }),
        });
        const result = await response.json();
        console.log(result);
        
        // Success message
        setSuccessMessage(`Successfully transferred ${transferAmount} ITB tokens from Ethereum to Sui`);
      } catch (error) {
        console.error("Error during transfer from Ethereum to Sui:", error);
        setSuccessMessage('Error during transfer from Ethereum to Sui');
      }
    } else {
      setSuccessMessage('Ethereum account or transfer amount is missing');
    }
  };

  return (
    <div className="app-container">
      <h1>Centralized Bridge for ITB Token</h1>
      <h2>Using Sui and Ethereum Blockchains</h2>

      {/* Sui Wallet Section */}
      <div className="wallet-section">
        <h3>Sui Wallet</h3>
        <ConnectButton />
        <div className="wallet-details">
          {itbTokenBalance && <p>ITB Balance: {itbTokenBalance.value / 1_000_000_000}</p>}
          <input
            type="number"
            value={suiAmount}
            onChange={(e) => setSuiAmount(e.target.value)}
            placeholder="ITB Token Amount (Sui)"
          />
          <button onClick={mintSuiTokens}>Mint ITB Tokens on Sui</button>
          <button onClick={burnSuiTokens}>Burn ITB Tokens on Sui</button>
        </div>
      </div>

      {/* Ethereum Wallet Section */}
      <div className="wallet-section">
        <h3>Ethereum Wallet</h3>
        <button onClick={connectMetamask}>
          {ethAccount ? `Connected: ${ethAccount}` : 'Connect Metamask'}
        </button>
        {ethAccount && (
          <div className="wallet-actions">
            <input
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="ITB Token Amount (ETH)"
            />
            <button onClick={mintTokens}>Mint ITB Tokens on Ethereum</button>
            <button onClick={burnTokens}>Burn ITB Tokens on Ethereum</button>
          </div>
        )}
      </div>

            {/* Transfer Section */}
            <div className="transfer-section">
        <h3>Transfer ITB Tokens</h3>
        <div className="transfer-actions">
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Transfer Amount"
          />
          <button onClick={transferSuiToEth}>Transfer from Sui to Ethereum</button>
          <button onClick={transferEthToSui}>Transfer from Ethereum to Sui</button>
        </div>
      </div>
    </div>
  );
}
