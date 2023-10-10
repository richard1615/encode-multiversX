import { useState, useEffect } from 'react';
import { ExtensionProvider } from "@multiversx/sdk-extension-provider";

function useProvider() {
  const walletProvider = ExtensionProvider.getInstance();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function initProvider() {
      try {
        await walletProvider.init();
        if (walletProvider.account && walletProvider.account.address !== '') {
          setIsConnected(true);
        }
        console.log(walletProvider.account.address);
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    }
    initProvider();
  }, []);

  return [walletProvider, isConnected, setIsConnected];
}

export default useProvider;
