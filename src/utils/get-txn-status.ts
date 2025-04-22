"use server";

import * as ethers from "ethers";
import { Address } from "viem";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  ["function txnResult(address) view returns (bool)"],
  provider
);

export async function checkBetStatus(address: Address) {
  const result = await contract.txnResult(address);
  return result;
}
