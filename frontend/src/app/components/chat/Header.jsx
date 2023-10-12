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
import { Address } from '@multiversx/sdk-core';
import axios from 'axios';
import { SmartContract } from "@multiversx/sdk-core";
import { CodeMetadata } from "@multiversx/sdk-core";
import { TransactionWatcher } from "@multiversx/sdk-core";
import { ResultsParser } from "@multiversx/sdk-core";
import { Code } from '@multiversx/sdk-core';



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
      const aliceOnNetwork = await apiNetworkProvider.getAccount(Address.fromBech32(address));
      // substituting address directly in string format doesn't work either
      console.log(aliceOnNetwork);

      // const tx = new Transaction({
      //   data: new TransactionPayload("helloWorld"),
      //   gasLimit: 70000,
      //   sender: Address.fromBech32(address),
      //   receiver: Address.fromBech32('erd17enrv0r7d8gqscplkw4ymec6j246ze54tklrfq4lshwyndpl6lcq4gjtx8'),
      //   value: TokenTransfer.egldFromAmount(1),
      //   chainID: "D"
      // });

      // tx.setNonce(aliceOnNetwork.nonce + 1);

      // const _tx = await walletProvider.signTransaction(tx);
      // let txHash = await proxyNetworkProvider.sendTransaction(_tx); 
      // console.log(txHash);

      let response = await axios.get("http://localhost:3000/api");
      console.log(response)

      const buffer = Buffer.from(response.data.buffer);
      const code = Code.fromBuffer(buffer);

      const deployerAddress = address;

      let contract = new SmartContract();

      const deployTransaction = contract.deploy({
        deployer: Address.fromBech32(deployerAddress),
        code: code,
        codeMetadata: new CodeMetadata(/* set the parameters accordingly */),
        initArguments: [/* set the initial arguments, if any */],
        gasLimit: 20000000,
        chainID: "D"
      });

      deployTransaction.setNonce(aliceOnNetwork.nonce + 1);

      let contractAddress = SmartContract.computeAddress(deployTransaction.getSender(), deployTransaction.getNonce());
      console.log("Contract address:", contractAddress.bech32());

      const _deployTransaction = await walletProvider.signTransaction(deployTransaction);

      await apiNetworkProvider.sendTransaction(_deployTransaction);
      let transactionOnNetwork = await new TransactionWatcher(apiNetworkProvider).awaitCompleted(_deployTransaction);

      // Currently getting Expected transaction status not reached error here
      let { returnCode } = new ResultsParser().parseUntypedOutcome(transactionOnNetwork);
      console.log("Return code:", returnCode);
    } catch (error) {
      console.error(error);
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
        <Button onClick={connectWallet} />
        {/* <Button onClick={signTransaction} /> */}
      </div>
    </div>
  );
}

export default Header;
