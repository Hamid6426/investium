import React from "react";

const ProfileCard: React.FC = () => {
  return (
    <div className="max-w-lg w-full h-24 bg-card rounded-lg px-3 py-2 overflow-hidden">
      <div className="flex justify-between">
        <div className="flex">
          <img
            className="w-20 h-20 object-cover rounded-full border-2 border-border"
            src="/hamid-profile-picture.png"
            alt="Profile"
          />
          <div className="flex flex-col px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
            <p className="text-gray-600">Level - 1</p>
          </div>
        </div>
        <div className="rounded-full h-20 w-20 flex flex-col justify-center items-center bg-background">
          <div className="text-2xl font-bold">1</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
