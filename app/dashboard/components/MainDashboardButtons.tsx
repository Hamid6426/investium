import Link from "next/link";
import React from "react";
import {
  HiOutlineArrowDownCircle,
  HiOutlineBanknotes,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const buttons = [
  {
    href: "/dashboard/deposit",
    icon: <HiOutlineArrowDownCircle />,
    text: "Deposit",
  },
  {
    href: "/dashboard/investments",
    icon: <HiOutlineBuildingOffice2 />,
    text: "Investments",
  },
  {
    href: "/dashboard/withdrawal",
    icon: <HiOutlineBanknotes className="rotate-45" />,
    text: "Withdrawal",
  },
];

export default function MainDashboardButtons() {
  return (
    <div className="grid grid-cols-3 max-w-lg place-items-center gap-4 text-3xl xs:text-4xl w-full">
      {buttons.map((button, index) => (
        <Link
          key={index}
          href={button.href}
          className="flex flex-col items-center justify-center gap-1 xs:gap-3 border-border border w-full aspect-square rounded-2xl  hover:bg-accent transition  text-heading"
        >
          {button.icon}
          <div className="text-xs xs:text-sm">{button.text}</div>
        </Link>
      ))}
    </div>
  );
}
