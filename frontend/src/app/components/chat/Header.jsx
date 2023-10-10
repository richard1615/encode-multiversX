import React, { useEffect, useState } from 'react';
import ChainInfo from '../ChainInfo';
import UserModal from '../modals/UserModal';
import Button from './messages/Button';
import useWalletProvider from '@/hooks/useWalletProvider';
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { Transaction, TransactionPayload, TokenTransfer } from "@multiversx/sdk-core";
import { Account } from "@multiversx/sdk-core";

function Header() {
  const [walletProvider, isConnected, setIsConnected] = useWalletProvider();
  const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");
  const [account, setAccount] = useState(null);

  useEffect(() => {
    console.log(account);

    if (!walletProvider || !apiNetworkProvider) {
      return;
    }

    const fetchAccountData = async () => {
      if (!walletProvider.account || !walletProvider.account.address) {
        return;
      }

      const _account = new Account(walletProvider.account.address);
      const _accountOnNetwork = await apiNetworkProvider.getAccount(walletProvider.account.address);
      if (_accountOnNetwork) {
        _account.update(_accountOnNetwork);
        setAccount(_account);
      }
    };

    fetchAccountData();
  }, [walletProvider, apiNetworkProvider]);



  const connectWallet = async () => {
    try {
      const address = await walletProvider.login();
      if (address) {
        setIsConnected(true);
      }
      console.log(address);
      console.log(walletProvider.account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const signTransaction = async () => {
    const tx = new Transaction({
      data: new TransactionPayload("helloWorld"),
      gasLimit: 70000,
      sender: "addressOfAlice",
      receiver: "addressOfBob",
      value: TokenTransfer.egldFromAmount(1),
      chainID: "D"
    });

    tx.setNonce(account.getNonceThenIncrement());

    await walletProvider.signTransaction(tx);
  }

  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className="flex items-center">
        <ChainInfo connected={isConnected} />
        <UserModal />
        <Button onClick={connectWallet} />
        <Button onClick={signTransaction} />
      </div>
    </div>
  );
}

export default Header;
