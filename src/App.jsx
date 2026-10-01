// src/App.jsx
import ConnectButton from "./components/ConnectButton";
import CreateCampaign from "./components/CreateCampaign";
import CampaignList from "./components/CampaignList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>CrowdFunding</h1>
      <ConnectButton />
      <CreateCampaign onCreated={() => window.location.reload()} />
      <CampaignList />
    </div>
  );
}

export default App;