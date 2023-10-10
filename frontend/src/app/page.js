'use client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useEffect, useState } from 'react'
import Topics from '@/app/components/sidebars/Topics'
import ChatWindow from './components/chat/ChatWindow'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useChatStore } from '@/store/store'

import { AxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext/AxiosInterceptorContext';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList/TransactionsToastList';
import { NotificationModal } from '@multiversx/sdk-dapp/UI/NotificationModal/NotificationModal';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals';
import  { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';
const AppContent = () => {
  const walletConnectV2ProjectId = '9b1a9564f91cb659ffe21b73d5c4e2d8';
  const apiTimeout = 6000;
  const transactionSize = 10;
  const nativeAuth = true;

  return (
    <Router>
      <DappProvider
        environment={EnvironmentsEnum.devnet}
      >
        <AxiosInterceptorContext.Listener>
            <TransactionsToastList />
            <NotificationModal />
            <SignTransactionsModals />
        </AxiosInterceptorContext.Listener>
      </DappProvider>
    </Router>
  );
};

export default function Home() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const user = useChatStore((state) => state.user)
  const setUser = useChatStore((state) => state.setUser)


  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
          router.push('/login')
        } else {
          const { data, error } = await supabase.auth.getUser()
          setUser(data.user)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [])
  const API_URL = 'https://testnet-template-api.multiversx.com';
  const sampleAuthenticatedDomains = [API_URL];
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor
        authenticatedDomanis={sampleAuthenticatedDomains}
      >
        <AppContent />
      <div className="flex flex-row">
        <Topics />
        <ChatWindow />
      </div>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  )
}
