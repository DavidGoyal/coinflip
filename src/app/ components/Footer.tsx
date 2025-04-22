"use client";

import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="flex flex-row gap-4 fixed bottom-6 left-8">
      <FaXTwitter
        className="text-2xl cursor-pointer"
        onClick={() => {
          window.open("https://x.com/David__Goyal", "_blank");
        }}
      />
    </footer>
  );
}

export default Footer;
