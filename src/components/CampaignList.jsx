import { useCallback, useEffect, useState } from "react";
import { useCrowdFunding } from "../hooks/useCrowdFunding";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { formatUnits, parseUnits } from "ethers";

const CampaignList = () => {
  const { account } = useWalletConnection();
  const {
    error,
    loading,
    contribute,
    withdraw,
    refund,
    cancelCampaign,
    approveMilestones,
    getAllCampaigns,
  } = useCrowdFunding();

  const [campaigns, setCampaigns] = useState([]);
  const [amounts, setAmounts] = useState({});

  const loadCampaigns = useCallback(async () => {
    const data = await getAllCampaigns();
    setCampaigns(data);
  }, [getAllCampaigns]);

  useEffect(() => {
    let cancelled = false;

    getAllCampaigns().then((data) => {
      if (!cancelled) setCampaigns(data);
    });

    return () => {
      cancelled = true;
    };
  }, [getAllCampaigns]);

  const handleContribute = async (id, token) => {
    const amount = amounts[id];
    if (!amount) return;
    const success = await contribute(parseUnits(amount, 18), token, id);
    if (success) loadCampaigns();
  };

  return (
    <div>
      <h3>All Campaigns</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={loadCampaigns}>Refresh</button>

      {campaigns.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <h4>Campaign #{c.id}</h4>
          <p>Creator: {c.creator}</p>
          <p>Target: {formatUnits(c.target, 18)}</p>
          <p>Raised: {formatUnits(c.moneyRaised, 18)}</p>
          <p>Available: {formatUnits(c.moneyavailable, 18)}</p>
          <p>Active: {c.active ? "Yes" : "No"} | Cancelled: {c.cancelled ? "Yes" : "No"}</p>
          <p>Deadline: {new Date(Number(c.deadline) * 1000).toLocaleString()}</p>

          <div style={{ marginTop: "10px" }}>
            <input
              placeholder="Amount"
              value={amounts[c.id] || ""}
              onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })}
            />
            <button onClick={() => handleContribute(c.id, c.tokenAccepted)} disabled={loading}>
              Contribute
            </button>
            <button onClick={() => refund(c.id).then(loadCampaigns)} disabled={loading}>
              Refund
            </button>
          </div>

          {account === c.creator && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => approveMilestones(c.id).then(loadCampaigns)} disabled={loading}>
                Approve Milestones
              </button>
              <button onClick={() => withdraw(c.id).then(loadCampaigns)} disabled={loading}>
                Withdraw
              </button>
              <button onClick={() => cancelCampaign(c.id).then(loadCampaigns)} disabled={loading}>
                Cancel Campaign
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CampaignList;