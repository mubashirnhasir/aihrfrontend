import React from "react";
import Card from "./cardUpdated";
import OnLeave from "./onLeave";
import Employees from "./employees";
import Documents from "./documents";
import Posts from "./posts";
import Holidays from "./holidays";
import Meetings from "./meetings";
const DashboardWrapper = () => {
  return (
    <div className="mx-auto py-2 space-y-8 px-2">
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="grid grid-cols-1  gap-6">
          <Card />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <OnLeave />
        </div>
        <div className="md:col-span-2">
          <Posts />
        </div>
        <div className="md:col-span-1">
          <Holidays />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Employees />
        </div>
        <div className="md:col-span-2">
          <Documents />
        </div>
        <div className="md:col-span-2">
          <Meetings />
        </div>
      </div>
    </div>
  );
};

export default DashboardWrapper;
