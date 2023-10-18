import React, { useState } from 'react';
import useProvider from '@/hooks/useWalletProvider';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Address, AddressValue, BigIntValue } from '@multiversx/sdk-core';
import axios from 'axios';
import { SmartContract } from "@multiversx/sdk-core";
import { ResultsParser } from "@multiversx/sdk-core";
import { AbiRegistry } from '@multiversx/sdk-core';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useChatStore } from '@/store/store';

function ContractForm({ contractAddress }) {
  const [method, setMethod] = useState('');
  const [address, setAddress] = useState('');
  const [owner, setOwner] = useState('');
  const [spender, setSpender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [walletProvider, isConnected, setIsConnected] = useProvider()
  const supabase = createClientComponentClient();
  const selectedChatId = useChatStore(state => state.selectedChatId);


  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const callContract = async (methodName, ...args) => {
    console.log(`Called ${methodName} with args:`, args);
    const abiUrl = "https://github.com/CommanderAstern/encode-multiversX/raw/sdk-2/frontend/public/contract/erc20.abi.json"
    const response = await axios.get(`${window.location.origin}/api/abi?abiUrl=${abiUrl}`);
    const abiRegistry = AbiRegistry.create(response.data.data);
    const networkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");
    const _contractAddress = Address.fromBech32(contractAddress);
    const existingContract = new SmartContract({ address: _contractAddress, abi: abiRegistry });

    const balanceOf = async () => {
      const query = existingContract.createQuery({
        func: "balanceOf",
        args: [new AddressValue(Address.fromBech32(address))]
      });
      const getEndpoint = abiRegistry.getEndpoint("balanceOf");
      const queryResponse = await networkProvider.queryContract(query);
      const { values } = new ResultsParser().parseQueryResponse(queryResponse, getEndpoint);
      const { error } = await supabase.from('messages').insert([
        {
            text: `The balance of ${address} is ${values[0].valueOf().toFixed(0)}`,
            conversation_id: selectedChatId,
            is_bot: true
        }
    ]);
    }

    const allowance = async () => {
      const query = existingContract.createQuery({
        func: "allowance",
        args: [new AddressValue(Address.fromBech32(owner)), new AddressValue(Address.fromBech32(spender))]
      });
      const getEndpoint = abiRegistry.getEndpoint("allowance");
      const queryResponse = await networkProvider.queryContract(query);
      const { values } = new ResultsParser().parseQueryResponse(queryResponse, getEndpoint);
      const { error } = await supabase.from('messages').insert([
        {
            text: `The allowance of ${spender} is ${values[0].valueOf().toFixed(0)}`,
            conversation_id: selectedChatId,
            is_bot: true
        }
    ]);
    }

    const transfer = async () => {
      const deployerAddress = await walletProvider.login();
      const deployerOnNetwork = await networkProvider.getAccount(Address.fromBech32(deployerAddress));
      let tx = existingContract.methods.transfer([new AddressValue(Address.fromBech32(recipient)), new BigIntValue(amount)])
        .withSender(Address.fromBech32(deployerAddress))
        .withNonce(deployerOnNetwork.nonce)
        .withGasLimit(20000000)
        .withChainID("D")
        .buildTransaction();

      tx = await walletProvider.signTransaction(tx);
      const txHash = await networkProvider.sendTransaction(tx);
      const explorerLink = `https://devnet-explorer.multiversx.com/transactions/${txHash}`;
      const { error } = await supabase.from('messages').insert([
        {
            text: `Your transaction has been deployed successfully! Check it out [here](${explorerLink})`,
            conversation_id: selectedChatId,
            is_bot: true
        }
    ]);
    }

    const approve = async () => {
      const deployerAddress = await walletProvider.login();
      const deployerOnNetwork = await networkProvider.getAccount(Address.fromBech32(deployerAddress));
      let tx = existingContract.methods.approve([new AddressValue(Address.fromBech32(recipient)), new BigIntValue(amount)])
        .withSender(Address.fromBech32(deployerAddress))
        .withNonce(deployerOnNetwork.nonce)
        .withGasLimit(20000000)
        .withChainID("D")
        .buildTransaction();

      tx = await walletProvider.signTransaction(tx);
      const txHash = await networkProvider.sendTransaction(tx);
      const explorerLink = `https://devnet-explorer.multiversx.com/transactions/${txHash}`;
      const { error } = await supabase.from('messages').insert([
        {
            text: `Your transaction has been deployed successfully! Check it out [here](${explorerLink})`,
            conversation_id: selectedChatId,
            is_bot: true
        }
    ]);
    }

    switch (methodName) {
      case 'balanceOf':
        balanceOf();
        break;
      case 'allowance':
        allowance();
        break;
      case 'transfer':
        transfer();
        break;
      case 'approve':
        approve();
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (method) {
      case 'balanceOf':
        callContract('balanceOf', address);
        break;
      case 'allowance':
        callContract('allowance', owner, spender);
        break;
      case 'transfer':
        callContract('transfer', recipient, amount);
        break;
      case 'approve':
        callContract('approve', spender, amount);
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-4 p-6 rounded-md">
      <div className="mb-4">
        <select
          value={method}
          onChange={handleMethodChange}
          className="block w-full p-2 border rounded-md"
        >
          <option value="">--Select a method--</option>
          <option value="balanceOf">Check Balance</option>
          <option value="allowance">Check Allowance</option>
          <option value="transfer">Transfer Tokens</option>
          <option value="approve">Approve</option>
        </select>
      </div>

      {method === 'balanceOf' && (
        <input
          placeholder='Address to query the balance of'
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="mb-4 w-full p-2 border rounded-md"
        />
      )}

      {method === 'allowance' && (
        <>
          <input
            placeholder='Address that owns the funds'
            value={owner}
            onChange={e => setOwner(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
          <input
            placeholder='Address that will spend the funds'
            value={spender}
            onChange={e => setSpender(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
        </>
      )}

      {method === 'transfer' && (
        <>
          <input
            placeholder='Recipient address'
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
          <input
            placeholder='Amount'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
        </>
      )}

      {method === 'approve' && (
        <>
          <input
            placeholder='Spender address'
            value={spender}
            onChange={e => setSpender(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
          <input
            placeholder='Amount'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mb-4 w-full p-2 border rounded-md"
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-leaf-green text-white p-2 rounded-md hover:bg-[#97a754] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Execute
      </button>
    </div>
  );

}

export default ContractForm;
