import crowdFundingAbi from "../abi/crowdFunding.json";

export const EIP6963AnnounceProvider = "eip6963:announceProvider";
export const EIP6963RequestProvider = "eip6963:requestProvider";

export const rpc_url = "https://ethereum-sepolia-rpc.publicnode.com";

export const CONTRACTS = {
  crowdFunding: {
    address: "0x0B14BDDb6890202147D35C80C4C285165643D642",
    abi: crowdFundingAbi,
  },
};