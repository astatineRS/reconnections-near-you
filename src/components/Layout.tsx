
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { currentUser } from "@/lib/mockData";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userAvatar={currentUser.avatarUrl} userName={currentUser.name} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
