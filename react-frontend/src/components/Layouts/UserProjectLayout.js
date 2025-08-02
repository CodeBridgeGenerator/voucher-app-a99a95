import React from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

const UserProjectLayout = (props) => {
  const { children } = props;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white">
        <UserHeader />
      </div>
      
      {/* Main Content - No container constraints */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <UserFooter />
    </div>
  );
};

export default UserProjectLayout; 