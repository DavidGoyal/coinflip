"use client";

import React from "react";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="flex flex-row gap-4 fixed bottom-6 left-8">
      <FaDiscord
        className="text-2xl cursor-pointer"
        onClick={() => {
          window.open("https://discord.gg/HJMdYb8U4Q", "_blank");
        }}
      />
      {/* <FaInstagram
        className="text-2xl cursor-pointer"
        onClick={() => {
          window.open("https://discord.gg/cubhub", "_blank");
        }}
      /> */}
      <FaXTwitter
        className="text-2xl cursor-pointer"
        onClick={() => {
          window.open("https://x.com/CubhubX", "_blank");
        }}
      />
    </footer>
  );
}

export default Footer;
