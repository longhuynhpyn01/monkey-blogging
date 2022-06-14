import { Button } from "components/button";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import UserTable from "./UserTable";

const UserManage = () => {
  useEffect(() => {
    document.title = "Monkey Blogging - Manage user";
  }, []);

  // const { userInfo } = useAuth();
  // if (userInfo.role !== userRole.ADMIN) return null;

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <Button kind="ghost" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
