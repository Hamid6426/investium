import Link from "next/link";
import React from "react";
import {
  MdSchema,
  MdOutlineRealEstateAgent,
  MdDownload,
  MdListAlt,
  MdAccountBalanceWallet,
} from "react-icons/md";

const buttons = [
  {
    href: "/dashboard/schemas",
    icon: <MdSchema />,
    text: "Schemas",
  },
  {
    href: "/dashboard/investments",
    icon: <MdOutlineRealEstateAgent />,
    text: "Investments",
  },
  {
    href: "/dashboard/transactions",
    icon: <MdListAlt />,
    text: "Transactions",
  },
  {
    href: "/dashboard/deposit",
    icon: <MdDownload />,
    text: "Deposit",
  },
  {
    href: "/dashboard/deposit-log",
    icon: <MdListAlt />,
    text: "Deposit Log",
  },
  {
    href: "/dashboard/wallet-exchange",
    icon: <MdAccountBalanceWallet />,
    text: "Wallet Exchange",
  },
];

export default function AllNavigations() {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="w-full border-r border-t border-l border-accent px-4 py-3 rounded-t-xl text-xl font-bold">
        ALL NAVIGATIONS
      </div>
      <div className="w-full grid grid-cols-3 max-w-lg place-items-center gap-4 text-3xl xs:text-4xl border border-accent rounded-b-xl p-6">
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.href}
            className="flex flex-col items-center justify-center gap-1 xs:gap-3 w-full aspect-square rounded-2xl hover:bg-accent transition  text-heading"
          >
            {button.icon}
            <div className="text-xs xs:text-sm text-heading">{button.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
