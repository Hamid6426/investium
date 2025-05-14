import SecurityAnswerCheck from "@/components/SecurityAnswerCheck";
import React from "react";
import DashboardNavbar from "./components/DashboardNavbar";
import ProfileCard from "./components/ProfileCard";
import WalletInfo from "./components/WalletInfo";

export default function page() {
  return (
    <div>
      <SecurityAnswerCheck />

      <DashboardNavbar />
      <div className="flex flex-col items-center w-full px-3 mt-8 gap-8">
        <ProfileCard />
        <WalletInfo />
      </div>
    </div>
  );
}
