import SecurityAnswerCheck from "@/components/SecurityAnswerCheck";
import React from "react";
import DashboardNavbar from "./components/DashboardNavbar";
import ProfileCard from "./components/ProfileCard";
import WalletInfo from "./components/WalletInfo";
import MainDashboardButtons from "./components/MainDashboardButtons";
import AllNavigations from "./components/AllNavigations";

export default function page() {
  return (
    <div className="">
      <SecurityAnswerCheck />

      <DashboardNavbar />
      <div className="flex flex-col items-center w-full px-3 mt-8 gap-8">
        <ProfileCard />
        <WalletInfo />
        <MainDashboardButtons />
        <AllNavigations />
      </div>
    </div>
  );
}
