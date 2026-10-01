import { useCallback, useState } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import { useWalletConnection } from "./useWalletConnection";
import { CONTRACTS, rpc_url } from "../constants";

const jsonRpcProvider = new JsonRpcProvider(rpc_url);

export const useCrowdFunding = () => {
  const { signer, account } = useWalletConnection();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getContract = useCallback(
    (withSigner = false) => {
      if (withSigner && !signer) return null;
      return new Contract(
        CONTRACTS.crowdFunding.address,
        CONTRACTS.crowdFunding.abi,
        withSigner ? signer : jsonRpcProvider
      );
    },
    [signer]
  );

  const runWrite = useCallback(
    async (fnName, args) => {
      setError("");
      setLoading(true);
      try {
        const contract = getContract(true);
        if (!contract) throw new Error("Connect your wallet first");

        const tx = await contract[fnName](...args);
        await tx.wait();
        return true;
      } catch (err) {
        if (err.code === "ACTION_REJECTED") {
          setError("Transaction rejected.");
        } else if (err.reason) {
          setError(err.reason);
        } else if (err.shortMessage) {
          setError(err.shortMessage);
        } else {
          setError("Something went wrong.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getContract]
  );

  // ----- WRITE FUNCTIONS -----

  const createCampaign = (target, deadline, token, amounts, statuses) =>
    runWrite("createCampaign", [target, deadline, token, amounts, statuses]);

  const contribute = (amount, token, campaignId) =>
    runWrite("contributing", [amount, token, campaignId]);

  const approveMilestones = (campaignId) =>
    runWrite("approveMilestones", [campaignId]);

  const withdraw = (campaignId) =>
    runWrite("Withdrawal", [campaignId]);

  const refund = (campaignId) =>
    runWrite("refundMoney", [campaignId]);

  const cancelCampaign = (campaignId) =>
    runWrite("cancelCampaign", [campaignId]);

  // ----- READ FUNCTIONS -----

  const getCampaign = useCallback(
    async (campaignId) => {
      try {
        const contract = getContract(false);
        return await contract.campaign(campaignId);
      } catch {
        return null;
      }
    },
    [getContract]
  );

  const getMyContribution = useCallback(
    async (campaignId) => {
      if (!account) return null;
      try {
        const contract = getContract(false);
        return await contract.contributors(campaignId, account);
      } catch {
        return null;
      }
    },
    [account, getContract]
  );

  const getAllCampaigns = useCallback(async () => {
    try {
      const contract = getContract(false);
      const nextId = await contract.NextCampignId();
      const list = [];
      for (let i = 0; i < Number(nextId); i++) {
        const c = await contract.campaign(i);
        list.push({ id: i, ...c.toObject() });
      }
      return list;
    } catch {
      setError("Could not load campaigns.");
      return [];
    }
  }, [getContract]);

  return {
    error,
    loading,
    createCampaign,
    contribute,
    approveMilestones,
    withdraw,
    refund,
    cancelCampaign,
    getCampaign,
    getMyContribution,
    getAllCampaigns,
  };
};