import Link from "next/link";
import React from "react";
import {
  HiOutlineBanknotes,
  HiOutlineDocumentText,
  HiOutlineArrowDownCircle,
  HiOutlineArrowUpRight,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2"; // Heroicons v2

const buttons = [
  {
    href: "/user_dashboard/deposit",
    icon: <HiOutlineArrowDownCircle />,
    text: "Deposit",
  },
  {
    href: "/user_dashboard/investments",
    icon: <HiOutlineBuildingOffice2 />,
    text: "Investments",
  },
  {
    href: "/user_dashboard/withdrawal",
    icon: <HiOutlineBanknotes className="rotate-45" />,
    text: "Withdrawal",
  },
  {
    href: "/user_dashboard/schemas",
    icon: <HiOutlineClipboardDocumentList />,
    text: "Schemas",
  },
  {
    href: "/user_dashboard/deposit-logs",
    icon: <HiOutlineDocumentText />,
    text: "Transaction Logs",
  },
  {
    href: "/user_dashboard/withdrwal-logs",
    icon: <HiOutlineArrowUpRight className="rotate-45" />,
    text: "Withdrawal Logs",
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
