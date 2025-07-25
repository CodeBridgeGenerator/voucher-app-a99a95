import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";

const UserProfile = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Sophia Clark",
    memberSince: "2021",
    pointsBalance: 12500,
    totalRedemptions: 5,
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvRTWXzgT72sc7tbxFa9ieIIN0rY1Ym4Z6zSaZWKys13Cq06mP79VMgrAMG2GYK0qOO1rEYtTMWcjFxHHkSz6p6MWZt1m9ql6JjXkxDqQ920_domq6FlF3MX90LQRdLW_DiW4QyZUTxzXbDJ5lYF-iZhlW70B-4l_cC47UhM6IiGedQvr4LEBEHtq_D1OSwUeZNkTsoCMiQNeuIWlrQ0m7zdLbeQF-QTYbbrOvFwrcBgBzqFAX1gWIVQFxJXk3m6nqCGi7jfYMobA"
  });

  const [recentRedemptions, setRecentRedemptions] = useState([
    {
      id: 1,
      date: "07/15/2024",
      voucher: "$50 Amazon Gift Card",
      pointsRedeemed: 5000
    },
    {
      id: 2,
      date: "06/20/2024",
      voucher: "$25 Starbucks Voucher",
      pointsRedeemed: 2500
    },
    {
      id: 3,
      date: "05/10/2024",
      voucher: "$100 Hotel Credit",
      pointsRedeemed: 10000
    }
  ]);

  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/login");
      return;
    }

    // Load user data from API
    const loadUserData = async () => {
      try {
        const response = await client.service("users").get(props.user._id);
        setUserData({
          name: response.name || "Sophia Clark",
          memberSince: new Date(response.createdAt).getFullYear().toString(),
          pointsBalance: response.pointsBalance || 12500,
          totalRedemptions: response.totalRedemptions || 5,
          profileImage: response.profileImage || userData.profileImage
        });
      } catch (error) {
        console.log("Using default user data");
      }
    };

    // Load recent redemptions from API
    const loadRecentRedemptions = async () => {
      try {
        const response = await client.service("voucher").find({
          query: {
            $limit: 10,
            $sort: { createdAt: -1 },
            redeemedBy: props.user._id
          }
        });
        if (response.data && response.data.length > 0) {
          setRecentRedemptions(response.data.map(voucher => ({
            id: voucher._id,
            date: new Date(voucher.redeemedAt || voucher.createdAt).toLocaleDateString(),
            voucher: voucher.title || voucher.name,
            pointsRedeemed: voucher.pointsCost || 0
          })));
        }
      } catch (error) {
        console.log("Using default redemption data");
      }
    };

    loadUserData();
    loadRecentRedemptions();
  }, [props.isLoggedIn, props.user, navigate]);

  const handleLogout = () => {
    // Handle logout logic
    props.logout();
    navigate("/");
  };

  const handleContactInfo = () => {
    navigate("/profile/contact");
  };

  const handlePasswordChange = () => {
    navigate("/profile/password");
  };

  const handleLinkedAccounts = () => {
    navigate("/profile/linked-accounts");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleVouchersClick = () => {
    navigate("/voucher");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (!props.isLoggedIn) {
    return null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: '"Public Sans", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
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
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Carter Bank</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-9">
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleHomeClick}>Home</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleVouchersClick}>Vouchers</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/categories")}>Categories</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/help")}>Help</a>
            </div>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
              onClick={handleNotificationsClick}
            >
              <div className="text-[#111418]" data-icon="Bell" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                  ></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
              style={{backgroundImage: `url("${userData.profileImage}")`}}
              onClick={handleProfileClick}
            ></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Profile Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">My Profile</p>
                <p className="text-[#637588] text-sm font-normal leading-normal">Manage your account settings and view your redemption history.</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{backgroundImage: `url("${userData.profileImage}")`}}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em]">{userData.name}</p>
                    <p className="text-[#637588] text-base font-normal leading-normal">Member since {userData.memberSince}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Account Summary</h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-t-[#dce0e5] py-5">
                <p className="text-[#637588] text-sm font-normal leading-normal">Points Balance</p>
                <p className="text-[#111418] text-sm font-normal leading-normal">{userData.pointsBalance.toLocaleString()}</p>
              </div>
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-t-[#dce0e5] py-5">
                <p className="text-[#637588] text-sm font-normal leading-normal">Total Redemptions</p>
                <p className="text-[#111418] text-sm font-normal leading-normal">{userData.totalRedemptions}</p>
              </div>
            </div>

            {/* Recent Redemptions */}
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Redemptions</h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#dce0e5] bg-white">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Voucher</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Points Redeemed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRedemptions.map((redemption) => (
                      <tr key={redemption.id} className="border-t border-t-[#dce0e5]">
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#637588] text-sm font-normal leading-normal">
                          {redemption.date}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#637588] text-sm font-normal leading-normal">
                          {redemption.voucher}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#637588] text-sm font-normal leading-normal">
                          {redemption.pointsRedeemed.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Settings */}
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Account Settings</h2>
            
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between cursor-pointer hover:bg-gray-50" onClick={handleContactInfo}>
              <div className="flex flex-col justify-center">
                <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Contact Information</p>
                <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Update your contact information</p>
              </div>
              <div className="shrink-0">
                <div className="text-[#111418] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between cursor-pointer hover:bg-gray-50" onClick={handlePasswordChange}>
              <div className="flex flex-col justify-center">
                <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Password</p>
                <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Change your password</p>
              </div>
              <div className="shrink-0">
                <div className="text-[#111418] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between cursor-pointer hover:bg-gray-50" onClick={handleLinkedAccounts}>
              <div className="flex flex-col justify-center">
                <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">Linked Accounts</p>
                <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">Manage your linked accounts</p>
              </div>
              <div className="shrink-0">
                <div className="text-[#111418] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex px-4 py-3 justify-start">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0e2e4] transition-colors"
                onClick={handleLogout}
              >
                <span className="truncate">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  logout: () => dispatch.auth.logout(),
});

export default connect(mapState, mapDispatch)(UserProfile); 