import { useState } from "react";
import { useCrowdFunding } from "../hooks/useCrowdFunding";
import { parseUnits } from "ethers";

const CreateCampaign = ({ onCreated }) => {
  const { createCampaign, loading, error } = useCrowdFunding();
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [token, setToken] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const targetWei = parseUnits(target, 18);
    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
    const amounts = [parseUnits(milestoneAmount, 18)];
    const statuses = [0]; // 0 = early, 1 = medium, 2 = late

    const success = await createCampaign(targetWei, deadlineTimestamp, token, amounts, statuses);
    if (success) onCreated();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create Campaign</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="Target amount" value={target} onChange={(e) => setTarget(e.target.value)} />
      <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <input placeholder="Token address" value={token} onChange={(e) => setToken(e.target.value)} />
      <input placeholder="First milestone amount" value={milestoneAmount} onChange={(e) => setMilestoneAmount(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
};

export default CreateCampaign;