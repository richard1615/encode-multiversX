import React, { useEffect, useState } from 'react';
import ChainInfo from '../ChainInfo';
import UserModal from '../modals/UserModal';
import Button from './messages/Button';
import useWalletProvider from '@/hooks/useWalletProvider';
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { Address, AddressValue, BigIntValue } from '@multiversx/sdk-core';
import axios from 'axios';
import { SmartContract } from "@multiversx/sdk-core";
import { ResultsParser } from "@multiversx/sdk-core";
import { AbiRegistry } from '@multiversx/sdk-core';
import { TokenTransfer } from '@multiversx/sdk-core';

function Header() {
  const [walletProvider, isConnected, setIsConnected] = useWalletProvider();

  async function queryContract(contractAddressBech32, abiUrl) {
    // Load the ABI from an URL
    const response = await axios.get(`http://localhost:3000/api/abi?abiUrl=${abiUrl}`);
    const abiRegistry = AbiRegistry.create(response.data.data);
    const networkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");
    const deployerAddress = await walletProvider.login();
    const recipient = Address.fromBech32("erd17enrv0r7d8gqscplkw4ymec6j246ze54tklrfq4lshwyndpl6lcq4gjtx8");
    console.log(abiRegistry)
  
    // Create the SmartContract instance
    const contractAddress = Address.fromBech32(contractAddressBech32);
    const existingContract = new SmartContract({ address: contractAddress, abi: abiRegistry});
  
    // Create the query
    const query = existingContract.createQuery({
      func: "balanceOf",
      args: [new AddressValue(recipient)]
    });
  
    const queryResponse = await networkProvider.queryContract(query);
  
    const getEndpoint = abiRegistry.getEndpoint("balanceOf");
    const { values } = new ResultsParser().parseQueryResponse(queryResponse, getEndpoint);
    
    // const deployerOnNetwork = await networkProvider.getAccount(Address.fromBech32(deployerAddress));
    // console.log(deployerAddress)
    // let tx3 = existingContract.methods.transfer([new AddressValue(recipient), new BigIntValue(10)])
    //   .withSender(Address.fromBech32(deployerAddress))
    //   .withNonce(deployerOnNetwork.nonce)
    //   .withGasLimit(20000000)
    //   .withChainID("D")
    //   .buildTransaction();

    // tx3 = await walletProvider.signTransaction(tx3);
    // const txHash3 = await networkProvider.sendTransaction(tx3);
  
    // console.log("tx3", tx3);
  
    return values[0].valueOf().toFixed(0);
  }

  const createTransaction = () => {
    const contractAddress = "erd1qqqqqqqqqqqqqpgqdjfrylk03uvwlqc2t3l8ymwelev3zmw3wdtqqy0fzc";
    const abiEndpoint = "https://github.com/CommanderAstern/encode-multiversX/raw/sdk-2/frontend/public/contract/erc20.abi.json";
    queryContract(contractAddress, abiEndpoint).then(result => {
      console.log("Claimable rewards:", result);
    });
  }

  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className="flex items-center">
        <ChainInfo connected={isConnected} />
        <UserModal />
        <Button onClick={createTransaction} label={"Query Contract"} />
      </div>
    </div>
  );
}

export default Header;
