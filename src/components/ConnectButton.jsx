// src/components/ConnectButton.jsx
import { useWalletConnection } from "../hooks/useWalletConnection";

const ConnectButton = () => {
  const { account, connectWallet, disconnectWallet } = useWalletConnection();

  return (
    <div>
      {account ? (
        <>
          <span style={{ marginRight: "10px" }}>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button onClick={disconnectWallet}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectButton;