import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../../services/restClient";

const VoucherDetailsPage = (props) => {
  const navigate = useNavigate();
  const { singleVoucherId } = useParams();
  const [voucher, setVoucher] = useState({
    _id: singleVoucherId,
    title: "Luxury Spa Day Voucher",
    description: "Indulge in a day of relaxation and rejuvenation with our exclusive Luxury Spa Day Voucher. This voucher entitles you to a full day of pampering at a top-rated spa, including a massage, facial, and access to all spa facilities. Treat yourself or a loved one to an unforgettable experience of tranquility and wellness.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOCQvqjC1YJtrGjkAWtCSBsl5aHDTgZU65wucep6hkA5GrbHCUr-P0UlfPZhoAAtSCxcNGSGnVwhI_D474FZ07paFERzV5c4R3gga8G7DBQw68t6dIdj0ffBFurTslUDVQXnYFSwg8qtFd_uCdDEDg5m-JS1BTuJVb2f82IzuRwXoYinsK0t-qYSfJVIAQz-Z5Q3N_foK2VJ4SnfsGHcoYsqU9fra8RyfkqJQGw8qY4Owyr9RvyAD_EkTZdnHDXHN1LNJLRisjvaQ",
    pointsCost: 15000,
    termsAndConditions: "This voucher is valid for one person and must be presented upon arrival at the spa. Advance booking is required and subject to availability. The voucher is non-transferable and cannot be exchanged for cash. Any additional services or products purchased at the spa are not included and must be paid for separately. Please check the spa's website for their specific terms and conditions.",
    howToRedeem: "To redeem your Luxury Spa Day Voucher, simply contact the spa directly to make a booking. Provide the voucher code and any other required details. Ensure you bring the physical or digital voucher with you on the day of your appointment for verification.",
    expiryDate: "December 31, 2024",
    category: "Wellness",
    status: "active"
  });

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userPoints, setUserPoints] = useState(25000);

  useEffect(() => {
    const loadVoucherDetails = async () => {
      setLoading(true);
      try {
        const response = await client.service("voucher").get(singleVoucherId);
        setVoucher({
          _id: response._id,
          title: response.title || response.name || "Luxury Spa Day Voucher",
          description: response.description || "Indulge in a day of relaxation and rejuvenation with our exclusive Luxury Spa Day Voucher. This voucher entitles you to a full day of pampering at a top-rated spa, including a massage, facial, and access to all spa facilities. Treat yourself or a loved one to an unforgettable experience of tranquility and wellness.",
          image: response.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDOCQvqjC1YJtrGjkAWtCSBsl5aHDTgZU65wucep6hkA5GrbHCUr-P0UlfPZhoAAtSCxcNGSGnVwhI_D474FZ07paFERzV5c4R3gga8G7DBQw68t6dIdj0ffBFurTslUDVQXnYFSwg8qtFd_uCdDEDg5m-JS1BTuJVb2f82IzuRwXoYinsK0t-qYSfJVIAQz-Z5Q3N_foK2VJ4SnfsGHcoYsqU9fra8RyfkqJQGw8qY4Owyr9RvyAD_EkTZdnHDXHN1LNJLRisjvaQ",
          pointsCost: response.pointsCost || 15000,
          termsAndConditions: response.termsAndConditions || "This voucher is valid for one person and must be presented upon arrival at the spa. Advance booking is required and subject to availability. The voucher is non-transferable and cannot be exchanged for cash. Any additional services or products purchased at the spa are not included and must be paid for separately. Please check the spa's website for their specific terms and conditions.",
          howToRedeem: response.howToRedeem || "To redeem your Luxury Spa Day Voucher, simply contact the spa directly to make a booking. Provide the voucher code and any other required details. Ensure you bring the physical or digital voucher with you on the day of your appointment for verification.",
          expiryDate: response.expiryDate || "December 31, 2024",
          category: response.category || "Wellness",
          status: response.status || "active"
        });
      } catch (error) {
        console.log("Using default voucher data");
        props.alert({ type: "warning", message: "Could not load voucher details" });
      } finally {
        setLoading(false);
      }
    };

    const loadUserPoints = async () => {
      if (props.isLoggedIn) {
        try {
          const response = await client.service("users").get(props.user._id);
          setUserPoints(response.pointsBalance || 25000);
        } catch (error) {
          console.log("Using default points");
        }
      }
    };

    loadVoucherDetails();
    loadUserPoints();
  }, [singleVoucherId, props.isLoggedIn, props.user, props.alert]);

  const handleAddToCart = async () => {
    if (!props.isLoggedIn) {
      navigate("/login");
      return;
    }

    if (userPoints < voucher.pointsCost) {
      props.alert({ type: "error", message: "Insufficient points to add this voucher to cart" });
      return;
    }

    setAddingToCart(true);
    try {
      await client.service("cart").create({
        userId: props.user._id,
        voucherId: voucher._id,
        quantity: 1,
        pointsCost: voucher.pointsCost
      });
      props.alert({ type: "success", message: "Added to cart successfully!" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      props.alert({ type: "error", message: "Failed to add to cart" });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRedeemNow = async () => {
    if (!props.isLoggedIn) {
      navigate("/login");
      return;
    }

    if (userPoints < voucher.pointsCost) {
      props.alert({ type: "error", message: "Insufficient points to redeem this voucher" });
      return;
    }

    try {
      setAddingToCart(true);
      
      // Mark voucher as redeemed
      await client.service("voucher").patch(voucher._id, {
        redeemedBy: props.user._id,
        redeemedAt: new Date(),
        status: "redeemed"
      });

      // Update user points
      await client.service("users").patch(props.user._id, {
        pointsBalance: userPoints - voucher.pointsCost
      });

      props.alert({ type: "success", message: "Voucher redeemed successfully!" });
      navigate("/profile"); // Redirect to profile to see redemption history
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      props.alert({ type: "error", message: "Failed to redeem voucher" });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleRewardsClick = () => {
    navigate("/rewards");
  };

  const handleOffersClick = () => {
    navigate("/offers");
  };

  const handleServicesClick = () => {
    navigate("/services");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: '"Public Sans", "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1672ce] mx-auto mb-4"></div>
              <p className="text-[#637588] text-lg">Loading voucher details...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleRewardsClick}>Rewards</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleOffersClick}>Offers</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleServicesClick}>Services</a>
            </div>
            {props.isLoggedIn && (
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1672ce] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0f5bb3] transition-colors"
                onClick={handleCartClick}
              >
                <span className="truncate">Cart</span>
              </button>
            )}
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#e0e2e4] transition-colors"
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
              style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6xYkdEircPwvLnMeqSkMjArG3LeBhve_RxM6-_dh1zMtbYOdM6txGtR6vnSjZYU6d0vBZpXP6iHm1yVtgvtZqejLVhUzdqk9ls6BvaLE2gl0ysm7hx6CALcl_VqcRLxphD1ri63BGwuLJBzKSgyNEUlggRKaXGVkz_sj8TROgZx2S4YcyrDgdBFimIiWpZGjeRn9bOm4R1ol5eqYAT9kxWEHrjwlrRky6NstPMHBQKe-TmUXMr2v5O8Ba7RXVR5lf__8o-JGT5Ts")`}}
              onClick={handleProfileClick}
            ></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 p-4">
              <a className="text-[#637588] text-base font-medium leading-normal cursor-pointer" onClick={handleRewardsClick}>Rewards</a>
              <span className="text-[#637588] text-base font-medium leading-normal">/</span>
              <span className="text-[#111418] text-base font-medium leading-normal">Voucher Details</span>
            </div>

            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">{voucher.title}</p>
            </div>

            {/* Voucher Image */}
            <div className="flex w-full grow bg-white p-4">
              <div className="w-full gap-1 overflow-hidden bg-white md:gap-2 aspect-[3/2] rounded-lg flex">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                  style={{backgroundImage: `url("${voucher.image}")`}}
                ></div>
              </div>
            </div>

            {/* Voucher Description */}
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {voucher.description}
            </p>

            {/* Points and Action Buttons */}
            <div className="px-4 py-3 bg-[#f8f9fa] rounded-lg mx-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[#111418] text-lg font-bold leading-normal">
                    {voucher.pointsCost.toLocaleString()} Points
                  </p>
                  {props.isLoggedIn && (
                    <p className="text-[#637588] text-sm font-normal leading-normal">
                      You have {userPoints.toLocaleString()} points available
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1672ce] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0f5bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={addingToCart || (props.isLoggedIn && userPoints < voucher.pointsCost)}
                  >
                    <span className="truncate">{addingToCart ? "Adding..." : "Add to Cart"}</span>
                  </button>
                  <button
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#28a745] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#218838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRedeemNow}
                    disabled={addingToCart || (props.isLoggedIn && userPoints < voucher.pointsCost)}
                  >
                    <span className="truncate">{addingToCart ? "Processing..." : "Redeem Now"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Terms & Conditions</h3>
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {voucher.termsAndConditions}
            </p>

            {/* How to Redeem */}
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">How to Redeem</h3>
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {voucher.howToRedeem}
            </p>

            {/* Expiry Date */}
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Expiry Date</h3>
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
              This voucher is valid until {voucher.expiryDate}. Please ensure you redeem it before this date to avoid disappointment.
            </p>

            {/* Category */}
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Category</h3>
            <div className="px-4 pb-3">
              <span className="inline-block bg-[#f0f2f4] text-[#111418] text-sm font-medium px-3 py-1 rounded-lg">
                {voucher.category}
              </span>
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
});

export default connect(mapState, mapDispatch)(VoucherDetailsPage); 