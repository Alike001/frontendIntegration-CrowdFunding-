import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { EIP6963AnnounceProvider, EIP6963RequestProvider } from "../constants";

export const useWalletConnection = () => {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [browserProvider, setBrowserProvider] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!browserProvider) return;
    const accounts = await browserProvider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    const newSigner = await browserProvider.getSigner(accounts[0]);
    setSigner(newSigner);
  }, [browserProvider]);

  useEffect(() => {
    const handleAnnouncement = (event) => {
      if (event.detail.info.rdns === "io.metamask") {
        setProvider(event.detail.provider);
        setBrowserProvider(new BrowserProvider(event.detail.provider));
      }
    };

    window.addEventListener(EIP6963AnnounceProvider, handleAnnouncement);
    window.dispatchEvent(new Event(EIP6963RequestProvider));

    return () => {
      window.removeEventListener(EIP6963AnnounceProvider, handleAnnouncement);
    };
  }, []);

  useEffect(() => {
    if (!provider) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
    };

    provider.on("accountsChanged", handleAccountsChanged);
    return () => provider.removeListener("accountsChanged", handleAccountsChanged);
  }, [provider]);

  // Add this function inside useWalletConnection.js
const disconnectWallet = useCallback(async () => {
  try {
    if (provider) {
      await provider.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    }
  } catch (error) {
    console.error("Failed to revoke permissions:", error);
  }

  setAccount("");
  setSigner(null);
}, [provider]);

  return { account, signer, browserProvider, connectWallet, disconnectWallet };
};

