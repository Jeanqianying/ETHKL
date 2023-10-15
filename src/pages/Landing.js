import './Landing.css';
import MetaMaskButton from './MetaMaskButton';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import Logo from '../components/logo.png';
import Board from './Board';
//import { Network, Alchemy } from "alchemy-sdk";
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        if (window.ethereum.selectedAddress) {
          setAccount(window.ethereum.selectedAddress);
          const weiBalance = await web3Instance.eth.getBalance(
            window.ethereum.selectedAddress
          );
          const etherBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
          setBalance(etherBalance);
          setWalletConnected(true);

          
        }
      }
    }
    initWeb3();
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      if (!window.ethereum.selectedAddress) {
        await window.ethereum.enable();
        console.log('Connected to MetaMask');

        const web3Instance = web3;
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
        const etherBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
        setBalance(etherBalance);
        setWalletConnected(true);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='center'>
          <div className='centered-logo'>
            <img src={Logo} alt='Logo' />
          </div>
          <div className='button-container'>
            {walletConnected ? (
              navigate('/Board', { replace: true })
            ) : (
              <div>
                <MetaMaskButton onClick={handleConnectMetaMask} className='metamask-button'>
                  Connect Wallet
                </MetaMaskButton>
                <p>Connected Account: {account}</p>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
