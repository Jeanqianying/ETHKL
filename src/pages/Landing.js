import './Landing.css';
import MetaMaskButton from './MetaMaskButton';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        // Initialize Web3 with MetaMask provider
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        if (window.ethereum.selectedAddress) {
          // If MetaMask already has a selected address, set it as the account
          setAccount(window.ethereum.selectedAddress);

          // Get the user's Ethereum balance
          const weiBalance = await web3Instance.eth.getBalance(
            window.ethereum.selectedAddress
          );
          const etherBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
          setBalance(etherBalance);
        }
      }
    }
    initWeb3();
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      if (!window.ethereum.selectedAddress) {
        // Request MetaMask to enable Ethereum access
        await window.ethereum.enable();
        console.log('Connected to MetaMask');

        // After connecting, set the account and balance
        const web3Instance = web3;
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
        const etherBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
        setBalance(etherBalance);
      }
      // You can perform Ethereum-related operations here
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };


  
  return (


   
      <div className="App">
        <header className="App-header">
          <div className='welcome'>

            <MetaMaskButton onClick={handleConnectMetaMask} />
          </div>
        </header>

        <p>Connected Account: {account}</p>
        {/* <p>Balance: {balance} SepoliaETH</p> */}
      </div>

 

  );
}

export default App;