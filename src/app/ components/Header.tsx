"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import WalletButton from "./Wallet-Button";
import { TiArrowSortedDown } from "react-icons/ti";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const [streakMenu, setStreakMenu] = useState(false);
  const [recentMenu, setRecentMenu] = useState(false);
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
  const [streakData, setStreakData] = useState<
    {
      address: string;
      loseStreak: number;
      winStreak: number;
    }[]
  >([]);
  const [heads, setHeads] = useState(50);

  const router = useRouter();

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
              time: new Date(bet.time).toLocaleString(),
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

    const fetchHeads = async () => {
      try {
        const response = await axios.get("/api/getHeadsCount");
        const data = response.data;

        const heads = Number(data.heads);
        const tails = Number(data.tails);
        const total = heads + tails;

        if (Number(total) === 0) {
          setHeads(50);
        } else {
          setHeads(((total - tails) / total) * 100);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/getStreak");
        const data = response.data;

        setStreakData(() => {
          return data.map((bet: any) => {
            return {
              address: bet.address,
              loseStreak: bet.lossStreak,
              winStreak: bet.winStreak,
            };
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Set up the interval correctly
    let id: any = null;
    let id2: any = null;
    let id3: any = null;
    fetchData().then(() => {
      id = setInterval(fetchData, 3000);
    });
    fetchHeads().then(() => {
      id2 = setInterval(fetchHeads, 3000);
    });
    fetchStreak().then(() => {
      id3 = setInterval(fetchStreak, 3000);
    });
    // Cleanup function to clear interval on unmount
    return () => {
      clearInterval(id);
      clearInterval(id2);
      clearInterval(id3);
    };
  }, []);

  return (
    <>
      <nav className="w-full h-[8rem] p-8 flex flex-row justify-between items-center">
        <div className="flex h-full gap-4 items-center">
          <button
            className="cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <Image
              src="/home/head-coin.png"
              alt="Logo"
              width={100}
              height={100}
              className="h-16 w-16 rounded-full"
            />
          </button>
          <WalletButton />
        </div>

        <div className="w-[40%] h-full flex flex-col justify-center">
          <div className="flex w-full justify-between text-cyan-400">
            <p>HEADS {heads.toFixed(2)}%</p>
            <p>TAILS {(100 - heads).toFixed(2)}%</p>
          </div>
          <div className="w-full h-4 rounded-2xl border-[1px] border-cyan-400">
            <div
              className="h-full rounded-2xl"
              style={{
                background: "linear-gradient(to right, #020142, #0085BF)",
                width: `${heads}%`,
              }}
            />
          </div>
        </div>

        <div className="h-full flex gap-8 items-center">
          <button
            className="w-fit h-fit border-[1px] border-cyan-400 rounded-3xl py-2 px-4 text-cyan-400 cursor-pointer flex items-center justify-between gap-1"
            onClick={() => {
              setStreakMenu(false);
              setRecentMenu((prev) => !prev);
            }}
          >
            RECENT <TiArrowSortedDown className="text-2xl" />
          </button>
          <button
            className="w-fit h-fit border-[1px] border-cyan-400 rounded-3xl py-2 px-4 text-cyan-400 cursor-pointer flex items-center justify-between gap-1"
            onClick={() => {
              setRecentMenu(false);
              setStreakMenu((prev) => !prev);
            }}
          >
            STREAKS <TiArrowSortedDown className="text-2xl" />
          </button>
        </div>
      </nav>

      <div
        className="absolute top-28 right-6 flex-col h-[58%] w-[22%] rounded-2xl border-2 border-cyan-400 bg-[#000000] transition-all duration-1000 ease-in-out z-50"
        style={{ display: recentMenu ? "flex" : "none" }}
      >
        {chartData.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className={`w-full ${index === 0 ? "rounded-t-2xl" : ""} ${
              index !== 7 ? "border-b-2 border-cyan-400" : ""
            } flex gap-1 items-center justify-center p-4 font-[100]`}
          >
            <span className="font-bold">
              {item.address.slice(0, 2)}...{item.address.slice(-2)}
            </span>{" "}
            flipped{" "}
            <span
              className={`${item.result ? "text-green-600" : "text-red-600"}`}
            >
              {item.betAmount}
            </span>{" "}
            and <span>{item.result ? "doubled !" : "got rugged"}</span>
          </div>
        ))}
      </div>
      <div
        className="absolute top-28 right-6 flex-col h-[58%] w-[22%] rounded-2xl border-2 border-cyan-400 bg-[#000000] transition-all duration-1000 ease-in-out z-50"
        style={{ display: streakMenu ? "flex" : "none" }}
      >
        {streakData.slice(0.8).map((item, index) => (
          <div
            key={index}
            className={`w-full ${index === 0 ? "rounded-t-2xl" : ""} ${
              index !== 8 ? "border-b-2 border-cyan-400" : ""
            } flex gap-1 items-center justify-center p-4 font-[100]`}
          >
            <span className="font-bold">
              {item.address.slice(0, 2)}...{item.address.slice(-2)}
            </span>{" "}
            is on{" "}
            <span
              className={`${
                item.winStreak > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.winStreak > 0
                ? `${item.winStreak} WIN`
                : `${item.loseStreak} LOSE`}
            </span>{" "}
            streak
          </div>
        ))}
      </div>
    </>
  );
}

export default Header;
