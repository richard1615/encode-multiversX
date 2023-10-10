import React, { useEffect, useState } from 'react';
import ChainInfo from '../ChainInfo';
import UserModal from '../modals/UserModal';
import Button from './messages/Button';
import useWalletProvider from '@/hooks/useWalletProvider';
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { Transaction, TransactionPayload, TokenTransfer } from "@multiversx/sdk-core";
import { Account } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ExtensionLoginButton } from '@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton/ExtensionLoginButton';
import { sendTransactions } from "@multiversx/sdk-dapp/services/transactions";


function Header() {
  const [walletProvider, isConnected, setIsConnected] = useWalletProvider();
  const [account, setAccount] = useState(null);

  // useEffect(() => {
  //   console.log(account);

  //   if (!walletProvider || !apiNetworkProvider) {
  //     return;
  //   }

  //   const fetchAccountData = async () => {
  //     if (!walletProvider.account || !walletProvider.account.address) {
  //       return;
  //     }

  //     const _account = new Account(walletProvider.account.address);
  //     const _accountOnNetwork = await apiNetworkProvider.getAccount(walletProvider.account.address);
  //     if (_accountOnNetwork) {
  //       _account.update(_accountOnNetwork);
  //       setAccount(_account);
  //     }
  //   };

  //   fetchAccountData();
  // }, [walletProvider, apiNetworkProvider]);

  const connectWallet = async () => {
    const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");
    const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    try {
      const address = await walletProvider.login();
      // const alice = new Account(address);
      // const aliceOnNetwork = await apiNetworkProvider.getAccount(address);
      // substituting address directly in string format doesn't work either

      const tx = new Transaction({
        data: new TransactionPayload("helloWorld"),
        gasLimit: 70000,
        sender: address,
        receiver: 'erd17enrv0r7d8gqscplkw4ymec6j246ze54tklrfq4lshwyndpl6lcq4gjtx8',
        value: TokenTransfer.egldFromAmount(1),
        chainID: "D"
      });

      tx.setNonce(1);

      await walletProvider.signTransaction(tx);
      let txHash = await proxyNetworkProvider.sendTransaction(tx); 
      console.log(txHash);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const connectWallet2 = async () => {
    console.log("Hi")
    const { sessionId, error } = await sendTransactions({
      transactions: [
          {
            value: '1000000000000000000',
            receiver: 'erd1xjwy83a59ggvvyzu3gdq4q2dp85lqqdf9gkus6wmqupmsnwc2laqtmhsej'
          },
        ]
      });
  };

  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className="flex items-center">
        <ChainInfo connected={isConnected} />
        <UserModal />
        <ExtensionLoginButton
              loginButtonText='DeFi Wallet'
            />
        <Button onClick={connectWallet2} />
        {/* <Button onClick={signTransaction} /> */}
      </div>
    </div>
  );
}

export default Header;
