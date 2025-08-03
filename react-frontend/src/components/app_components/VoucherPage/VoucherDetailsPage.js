import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import client from "../../../services/restClient";

const VoucherDetailsPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { singleVoucherId } = useParams();
  
  // Get voucher data from navigation state or use default
  const initialVoucherData = location.state?.voucherData || {
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
  };
  
  const [voucher, setVoucher] = useState(initialVoucherData);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userPoints, setUserPoints] = useState(25000);

  useEffect(() => {
    const loadVoucherDetails = async () => {
      setLoading(true);
      try {
        // If we have voucher data from navigation state, use it
        if (location.state?.voucherData) {
          setVoucher(location.state.voucherData);
          setLoading(false);
          return;
        }
        
        // Otherwise, try to fetch from API
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
      // Create cart item with voucher details
      const cartItem = {
        userId: props.user._id,
        voucherId: voucher._id,
        voucherTitle: voucher.title,
        voucherImage: voucher.image,
        voucherDescription: voucher.description,
        quantity: 1,
        pointsCost: voucher.pointsCost,
        category: voucher.category,
        status: "pending",
        createdBy: props.user._id,
        updatedBy: props.user._id
      };
      
      console.log("Adding to cart:", cartItem);
      
      // Always save to localStorage for immediate cart updates
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const newCartItem = {
        id: `local-${Date.now()}`,
        name: voucher.title,
        quantity: 1,
        points: voucher.pointsCost,
        voucherId: voucher._id,
        voucherTitle: voucher.title,
        voucherImage: voucher.image,
        voucherDescription: voucher.description,
        category: voucher.category
      };
      localCart.push(newCartItem);
      localStorage.setItem('cartItems', JSON.stringify(localCart));
      
      // Trigger storage event for other tabs/pages
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cartItems',
        newValue: JSON.stringify(localCart),
        oldValue: JSON.stringify(localCart.slice(0, -1))
      }));
      
      // Also trigger a custom event for immediate refresh
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cartItems: localCart }
      }));
      
      // Also trigger a global event that any page can listen to
      window.dispatchEvent(new CustomEvent('cartItemAdded', {
        detail: { 
          item: newCartItem,
          cartItems: localCart 
        }
      }));
      
      try {
        const result = await client.service("cart").create(cartItem);
        console.log("Cart result:", result);
        props.alert({ type: "success", message: "Added to cart successfully!" });
      } catch (apiError) {
        console.error("API error, but item saved locally:", apiError);
        props.alert({ type: "success", message: "Added to cart successfully! (saved locally)" });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      props.alert({ type: "error", message: "Failed to add to cart: " + error.message });
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
      
      // Create redemption record
      const redemptionData = {
        userId: props.user._id,
        voucherId: voucher._id,
        voucherTitle: voucher.title,
        voucherImage: voucher.image,
        voucherDescription: voucher.description,
        pointsCost: voucher.pointsCost,
        category: voucher.category,
        redeemedAt: new Date(),
        status: "redeemed",
        createdBy: props.user._id,
        updatedBy: props.user._id
      };
      
      // Add to cart history (redemption record)
      await client.service("cartHistory").create(redemptionData);

      // Update user points
      await client.service("users").patch(props.user._id, {
        pointsBalance: userPoints - voucher.pointsCost
      });

      props.alert({ type: "success", message: "Voucher redeemed successfully!" });
      navigate("/cart-history"); // Redirect to cart history to see redemption
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a className="text-gray-500 text-base font-medium cursor-pointer hover:text-gray-700" onClick={handleRewardsClick}>Rewards</a>
          <span className="text-gray-500 text-base font-medium">/</span>
          <span className="text-gray-900 text-base font-medium">Voucher Details</span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Voucher Image */}
          <div className="relative h-64 md:h-80">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover"
              style={{backgroundImage: `url("${voucher.image}")`}}
            ></div>
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1 rounded-lg">
                {voucher.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {voucher.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {voucher.description}
            </p>

            {/* Points and Action Buttons */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {voucher.pointsCost.toLocaleString()} Points
                  </p>
                  {props.isLoggedIn && (
                    <p className="text-gray-600 text-sm">
                      You have {userPoints.toLocaleString()} points available
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 sm:flex-none min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={addingToCart || (props.isLoggedIn && userPoints < voucher.pointsCost)}
                  >
                    <span className="truncate">{addingToCart ? "Adding..." : "Add to Cart"}</span>
                  </button>
                  <button
                    className="flex-1 sm:flex-none min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRedeemNow}
                    disabled={addingToCart || (props.isLoggedIn && userPoints < voucher.pointsCost)}
                  >
                    <span className="truncate">{addingToCart ? "Processing..." : "Redeem Now"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h3>
              <p className="text-gray-600 leading-relaxed">
                {voucher.termsAndConditions}
              </p>
            </div>

            {/* How to Redeem */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How to Redeem</h3>
              <p className="text-gray-600 leading-relaxed">
                {voucher.howToRedeem}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expiry Date</h3>
              <p className="text-gray-600 leading-relaxed">
                This voucher is valid until {voucher.expiryDate}. Please ensure you redeem it before this date to avoid disappointment.
              </p>
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