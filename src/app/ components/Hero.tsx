"use client";

import { abi } from "@/abi/abi";
import { checkBetStatus } from "@/utils/get-txn-status";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Address, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import axios from "axios";
import moment from "moment";

function Hero() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [connected, setConnected] = useState(false);
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const [won, setWon] = useState(false);
  const [bet, setBet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<0.1 | 0.25 | 0.5 | 0.75>(0.1);
  const [chartData, setChartData] = useState<
    {
      game: string;
      address: string;
      time: string;
      betAmount: number;
      transaction: string;
      result: boolean;
    }[]
  >([]);

  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract();

  const { isSuccess: isConfirmed, error: writeError } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onBet = async () => {
    if (!address) {
      toast.error("Please connect your wallet to bet");
      return;
    }
    if (Number(balance?.value.toString() || 0) / 1e18 < amount) {
      toast.error("Insufficient Balance");
      return;
    }
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      toast.error("Contract address not found");
      return;
    }
    setLoading(true);
    try {
      await writeContractAsync({
        address: contractAddress as Address,
        abi,
        functionName: "coinFlip",
        args: [side === "heads" ? 0 : 1],
        value: parseEther(amount.toString()),
        gas: BigInt(500000),
      });
    } catch (e) {
      console.log(e);
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    const result = await checkBetStatus(address as Address);
    setWon(result);

    if (result === null) {
      return;
    }
    setLoading(false);
    setBet(true);
  };

  // Enhanced useEffect for error handling
  useEffect(() => {
    // Handle transaction confirmation
    if (isConfirmed && hash) {
      checkStatus();
    }

    // Handle pending state
    if (isPending) {
      toast.info("Transaction pending...");
    }

    // Handle errors from useWriteContract
    if (error && loading) {
      setLoading(false);
      toast.error(error.message || "Transaction reverted");
      console.error("Write contract error:", error);
    }

    //Handle errors from transaction receipt
    if (writeError && loading) {
      setLoading(false);
      toast.error(writeError.message || "Transaction failed");
      console.error("Transaction receipt error:", writeError);
    }
  }, [isConfirmed, isPending, error, writeError, hash]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getTopBets");
        const data = response.data;

        setChartData(() => {
          return data.map((bet: any) => {
            return {
              game: bet.game,
              address: bet.better,
              time: bet.time,
              betAmount: bet.betAmount,
              transaction: bet.transaction,
              result: bet.result,
            };
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Set up the interval correctly
    let id: any = null;
    fetchData().then(() => {
      id = setInterval(fetchData, 3000);
    });
    // Cleanup function to clear interval on unmount
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center p-8 gap-8">
      {!connected ? (
        <>
          <h1 className="text-5xl text-center font-bold">
            COIN FLIP. <span className="font-[100]">FLIP TO PLAY.</span>
          </h1>
          <Image
            src={"/Home/head-coin.png"}
            alt="coin"
            width={300}
            height={300}
          />

          <button
            className="py-2 px-6 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
            onClick={() => {
              if (!address) {
                toast.error("Please connect your wallet");
                return;
              }
              setConnected(true);
            }}
          >
            CONNECT
          </button>

          <div className="w-[40%] min-h-[30vh] rounded-2xl border-2 border-[#B58421] bg-[#02012E] h-auto">
            {chartData.map((item, index) => (
              <div
                key={index}
                className={`w-full ${index === 0 ? "rounded-t-2xl" : ""} ${
                  index !== chartData.length - 1
                    ? "border-b-2 border-[#B58421]"
                    : ""
                } flex justify-between items-center p-4 font-[100]`}
              >
                <p>
                  <span className="font-bold">
                    {item.address.slice(0, 3)}...{item.address.slice(-3)}
                  </span>{" "}
                  flipped{" "}
                  <span
                    className={`${
                      item.result ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.betAmount}
                  </span>{" "}
                  and <span>{item.result ? "doubled !" : "got rugged"}</span>
                </p>
                {moment.utc(item.time).local().fromNow()}
              </div>
            ))}
          </div>
        </>
      ) : !bet ? (
        <>
          <div className="flex flex-row w-[70%] justify-between items-center">
            <button
              className="cursor-pointer relative flex items-center justify-center"
              disabled={loading}
              onClick={() => setSide("heads")}
              style={{
                filter:
                  side === "heads" ? "drop-shadow(0px 0px 25px #B58421)" : "",
              }}
            >
              <Image
                src={"/Home/coin-bg.png"}
                alt="coin-bg"
                width={100}
                height={100}
              />
              <p className="absolute">HEADS</p>
            </button>
            {!loading ? (
              <Image
                src={
                  side === "heads"
                    ? "/Home/head-coin.png"
                    : "/Home/tail-coin.png"
                }
                alt="coin"
                width={400}
                height={400}
                className={`transition-transform ${
                  loading ? "animate-coin-flip" : ""
                }`}
              />
            ) : (
              <div className="coin-container">
                <div className={`coin-flipper ${!loading ? "paused" : ""}`}>
                  <Image
                    src="/Home/head-coin.png"
                    alt="coin heads"
                    width={400}
                    height={400}
                    className="coin-side coin-front"
                    loading="eager"
                  />
                  <Image
                    src="/Home/tail-coin.png"
                    alt="coin tails"
                    width={400}
                    height={400}
                    className="coin-side coin-back"
                    loading="eager"
                  />
                </div>
              </div>
            )}
            <button
              className="cursor-pointer relative flex items-center justify-center"
              disabled={loading}
              onClick={() => setSide("tails")}
              style={{
                filter:
                  side === "tails" ? "drop-shadow(0px 0px 25px #B58421)" : "",
              }}
            >
              <Image
                src={"/Home/coin-bg.png"}
                alt="coin-bg"
                width={100}
                height={100}
              />
              <p className="absolute">TAILS</p>
            </button>
          </div>
          <div className="flex flex-row items-center gap-4">
            <button
              className="py-2 px-10 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
              disabled={loading}
              style={{
                backgroundColor: amount === 0.1 ? "#B58421" : "#010026",
              }}
              onClick={() => {
                setAmount(0.1);
              }}
            >
              0.1 HYPE
            </button>
            <button
              className="py-2 px-10 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
              disabled={loading}
              style={{
                backgroundColor: amount === 0.25 ? "#B58421" : "#010026",
              }}
              onClick={() => {
                setAmount(0.25);
              }}
            >
              0.25 HYPE
            </button>
            <button
              className="py-2 px-10 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
              disabled={loading}
              style={{
                backgroundColor: amount === 0.5 ? "#B58421" : "#010026",
              }}
              onClick={() => {
                setAmount(0.5);
              }}
            >
              0.5 HYPE
            </button>
            <button
              className="py-2 px-10 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
              disabled={loading}
              style={{
                backgroundColor: amount === 0.75 ? "#B58421" : "#010026",
              }}
              onClick={() => {
                setAmount(0.75);
              }}
            >
              0.75 HYPE
            </button>
          </div>
          <button
            className="py-2 px-10 mt-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
            disabled={loading}
            onClick={onBet}
          >
            FLIP
          </button>
        </>
      ) : (
        <>
          <h1 className="text-5xl text-center font-bold">
            YOU{" "}
            {won ? (
              <>
                WIN! <span className="text-green-500">{2 * amount}</span>
              </>
            ) : (
              "LOST!"
            )}
          </h1>

          <button
            className="py-2 px-8 rounded-4xl font-bold bg-[#010026] border-2 border-[#B58421] cursor-pointer hover:border-cyan-400 hover:bg-[#B58421]"
            disabled={loading}
            onClick={() => {
              setBet(false);
            }}
          >
            FLIP AGAIN
          </button>

          {
            <Image
              src={
                won
                  ? side === "heads"
                    ? "/Home/head-coin.png"
                    : "/Home/tail-coin.png"
                  : side === "heads"
                  ? "/Home/tail-coin.png"
                  : "/Home/head-coin.png"
              }
              alt="coin"
              width={300}
              height={300}
            />
          }

          <div className="w-[40%] min-h-[30vh] mt-8 rounded-2xl border-2 border-[#B58421] bg-[#02012E] h-auto">
            {chartData.map((item, index) => (
              <div
                key={index}
                className={`w-full ${index === 0 ? "rounded-t-2xl" : ""} ${
                  index !== chartData.length - 1
                    ? "border-b-2 border-[#B58421]"
                    : ""
                } flex justify-between items-center p-4 font-[100]`}
              >
                <p>
                  <span className="font-bold">
                    {item.address.slice(0, 2)}...{item.address.slice(-2)}
                  </span>{" "}
                  flipped{" "}
                  <span
                    className={`${
                      item.result ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.betAmount}
                  </span>{" "}
                  and <span>{item.result ? "doubled !" : "got rugged"}</span>
                </p>
                <p>{moment.utc(item.time).local().fromNow()}</p>{" "}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Hero;
