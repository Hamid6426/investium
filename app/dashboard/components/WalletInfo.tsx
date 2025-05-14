import React from "react";
import { MdInfoOutline } from "react-icons/md";

export default function WalletInfo() {
  return (
    <div className="max-w-lg w-full bg-card rounded-xl px-3 py-4 overflow-hidden">
      <div className="flex flex-col">
        <div className="pb-4 text-lg">All Wallets in PKR</div>
        <div className="w-full h-[1px] bg-accent"></div>
        <div className="grid grid-cols-2 gap-y-3 mt-4 text-lg font-semibold">
          <div>PKR 0.0</div>
          <div className="place-self-end">Main Wallet</div>
          <div>PKR 0.00</div>
          <div className="place-self-end">Main Wallet</div>
        </div>
        <div className="w-full h-[1px] bg-accent mt-4"></div>
        <div className="flex items-center gap-4 mt-4">
          <MdInfoOutline className="text-lg" />
          <div className="text-xs">
            You earned <span>0</span> PKR this week
          </div>
        </div>
      </div>
    </div>
  );
}
