import React from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "primereact/menu";
import { useRef } from "react";

const UserHeader = (props) => {
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const userMenuItems = [
    {
      label: "My Profile",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
    {
      label: "My Vouchers",
      icon: "pi pi-ticket",
      command: () => navigate("/voucher"),
    },
    {
      label: "My Cart",
      icon: "pi pi-shopping-cart",
      command: () => navigate("/cart"),
    },
    {
      label: "Order History",
      icon: "pi pi-history",
      command: () => navigate("/cartHistory"),
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => props.logout(),
    },
  ];

  const showUserMenu = (e) => {
    if (userMenuRef?.current) userMenuRef.current.show(e);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-4 md:px-10 py-3">
      <div className="flex items-center gap-4 text-[#111418]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Carter Bank Vouchers</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/home")}>Home</a>
                           <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/voucher")}>Vouchers</a>
          <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/cart")}>Cart</a>
          <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/cartHistory")}>History</a>
        </div>
        <button
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
          onClick={showUserMenu}
        >
          <span className="truncate">My Account</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer bg-gray-300 flex items-center justify-center"
          onClick={showUserMenu}
        >
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* User Menu Dropdown */}
      <Menu model={userMenuItems} popup ref={userMenuRef} />
    </header>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  logout: () => dispatch.auth.logout(),
});

export default connect(mapState, mapDispatch)(UserHeader); 