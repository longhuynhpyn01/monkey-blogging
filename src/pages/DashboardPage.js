import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect } from "react";

const DashboardPage = () => {
  useEffect(() => {
    document.title = "Monkey Blogging - Dashboard";
  }, []);

  return (
    <div>
      <DashboardHeading
        title="Dashboard"
        desc="Overview dashboard monitor"
      ></DashboardHeading>
    </div>
  );
};

export default DashboardPage;
