import SecurityAnswerCheck from "@/app/(auth)/SecurityAnswerCheck";
import React from "react";
import ProfileCard from "./components/ProfileCard";
import WalletInfo from "./components/WalletInfo";
import MainDashboardButtons from "./components/MainDashboardButtons";
import AllNavigations from "./components/AllNavigations";
import GetAllPlansForUser from "./components/GetAllPlansForUser";

export default function page() {
  return (
    <div className="">
      <SecurityAnswerCheck />

      <div className="flex flex-col items-center w-full px-3 mt-8 gap-8">
        <ProfileCard />
        <WalletInfo />
        <MainDashboardButtons />
        <AllNavigations />
        <GetAllPlansForUser />
      </div>
    </div>
  );
}
