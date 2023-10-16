import React, { useEffect, useState } from 'react';
import ChainInfo from '../ChainInfo';
import UserModal from '../modals/UserModal';
import Button from './messages/Button';
import useWalletProvider from '@/hooks/useWalletProvider';
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { Transaction, TransactionPayload, TokenTransfer } from "@multiversx/sdk-core";
import { Account } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
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

  const connectWallet = async () => {
    const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");
    const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    try {
      const deployerAddress = await walletProvider.login();
      const deployerOnNetwork = await apiNetworkProvider.getAccount(Address.fromBech32(deployerAddress));
      const contract = new SmartContract();

      const response = await axios.get("http://localhost:3000/api");
      const buffer = Buffer.from(response.data.buffer);
      const code = Code.fromBuffer(buffer);

      const deployTransaction = contract.deploy({
        deployer: Address.fromBech32(deployerAddress),
        code: code,
        codeMetadata: new CodeMetadata(),
        initArguments: [],
        gasLimit: 20000000,
        chainID: "D"
      });
      deployTransaction.setNonce(deployerOnNetwork.nonce);
      
      const _deployTransaction = await walletProvider.signTransaction(deployTransaction);

      await apiNetworkProvider.sendTransaction(_deployTransaction);
      let transactionOnNetwork = await new TransactionWatcher(apiNetworkProvider).awaitCompleted(_deployTransaction);

      console.log("Transaction hash:", transactionOnNetwork);

      const { returnCode } = new ResultsParser().parseUntypedOutcome(transactionOnNetwork);
      console.log("Return code:", returnCode);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className="flex items-center">
        <ChainInfo connected={isConnected} />
        <UserModal />
        {/* <Button onClick={connectWallet} /> */}
      </div>
    </div>
  );
}

export default Header;
