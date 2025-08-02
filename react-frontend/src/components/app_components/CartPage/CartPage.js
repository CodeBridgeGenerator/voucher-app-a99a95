import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";

const CartPage = (props) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "$25 Gift Card to Local Coffee Shop",
      quantity: 1,
      points: 2500,
      voucherId: "voucher1"
    },
    {
      id: 2,
      name: "$50 Voucher for Fine Dining",
      quantity: 2,
      points: 5000,
      voucherId: "voucher2"
    },
    {
      id: 3,
      name: "$100 Travel Credit",
      quantity: 1,
      points: 10000,
      voucherId: "voucher3"
    }
  ]);

  const [userPoints, setUserPoints] = useState(25000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/login");
      return;
    }

    // Load cart items from API
    const loadCartItems = async () => {
      setLoading(true);
      try {
        const response = await client.service("cart").find({
          query: {
            $limit: 50,
            userId: props.user._id,
            $populate: [{ path: "voucherId", service: "voucher" }]
          }
        });
        
        if (response.data && response.data.length > 0) {
          const items = response.data.map(item => ({
            id: item._id,
            name: item.voucherId?.title || item.voucherId?.name || "Unknown Voucher",
            quantity: item.quantity || 1,
            points: item.pointsCost || 0,
            voucherId: item.voucherId?._id || item.voucherId
          }));
          setCartItems(items);
        }
      } catch (error) {
        console.log("Using default cart data");
      } finally {
        setLoading(false);
      }
    };

    // Load user points
    const loadUserPoints = async () => {
      try {
        const response = await client.service("users").get(props.user._id);
        setUserPoints(response.pointsBalance || 25000);
      } catch (error) {
        console.log("Using default points");
      }
    };

    loadCartItems();
    loadUserPoints();
  }, [props.isLoggedIn, props.user, navigate]);

  const handleRemoveItem = async (itemId) => {
    try {
      await client.service("cart").remove(itemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      props.alert({ type: "success", message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item:", error);
      props.alert({ type: "error", message: "Failed to remove item" });
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is 0, remove the item
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await client.service("cart").patch(itemId, { quantity: newQuantity });
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      props.alert({ type: "success", message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      props.alert({ type: "error", message: "Failed to update quantity" });
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      handleQuantityChange(itemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      handleQuantityChange(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      handleRemoveItem(itemId);
    }
  };

  const handleRedeem = async () => {
    if (cartItems.length === 0) {
      props.alert({ type: "warning", message: "Your cart is empty" });
      return;
    }

    const totalPoints = cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
    
    if (totalPoints > userPoints) {
      props.alert({ type: "error", message: "Insufficient points for redemption" });
      return;
    }

    try {
      setLoading(true);
      
      // Process each cart item as a redemption
      for (const item of cartItems) {
        await client.service("voucher").patch(item.voucherId, {
          redeemedBy: props.user._id,
          redeemedAt: new Date(),
          status: "redeemed"
        });
      }

      // Clear cart
      for (const item of cartItems) {
        await client.service("cart").remove(item.id);
      }

      // Update user points
      await client.service("users").patch(props.user._id, {
        pointsBalance: userPoints - totalPoints
      });

      setCartItems([]);
      setUserPoints(prev => prev - totalPoints);
      
      props.alert({ type: "success", message: "Redemption successful!" });
      navigate("/profile"); // Redirect to profile to see redemption history
    } catch (error) {
      console.error("Error processing redemption:", error);
      props.alert({ type: "error", message: "Failed to process redemption" });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/voucher");
  };

  const handleRewardsClick = () => {
    navigate("/rewards");
  };

  const handleTravelClick = () => {
    navigate("/voucher?category=travel");
  };

  const handleDiningClick = () => {
    navigate("/voucher?category=dining");
  };

  const handleShoppingClick = () => {
    navigate("/voucher?category=shopping");
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
  const total = subtotal; // No additional fees in this case

  if (!props.isLoggedIn) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 p-4">
              <a className="text-[#637588] text-base font-medium leading-normal cursor-pointer" onClick={handleRewardsClick}>Rewards</a>
              <span className="text-[#637588] text-base font-medium leading-normal">/</span>
              <span className="text-[#111418] text-base font-medium leading-normal">Cart</span>
            </div>

            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Your Cart</p>
            </div>

            {/* Cart Items Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#dce0e5] bg-white">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Item</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Points</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-60 text-[#637588] text-sm font-medium leading-normal">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="border-t border-t-[#dce0e5]">
                        <td colSpan="4" className="h-[72px] px-4 py-2 text-center text-[#637588] text-sm font-normal leading-normal">
                          Loading cart items...
                        </td>
                      </tr>
                    ) : cartItems.length === 0 ? (
                      <tr className="border-t border-t-[#dce0e5]">
                        <td colSpan="4" className="h-[72px] px-4 py-2 text-center text-[#637588] text-sm font-normal leading-normal">
                          Your cart is empty
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item) => (
                        <tr key={item.id} className="border-t border-t-[#dce0e5]">
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                            {item.name}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#637588] text-sm font-normal leading-normal">
                            <div className="flex items-center gap-2">
                              <button
                                className="w-6 h-6 rounded border border-[#dce0e5] flex items-center justify-center text-[#637588] hover:bg-[#f0f2f4] transition-colors"
                                onClick={() => handleDecreaseQuantity(item.id)}
                              >
                                -
                              </button>
                              <span className="min-w-[20px] text-center">{item.quantity}</span>
                              <button
                                className="w-6 h-6 rounded border border-[#dce0e5] flex items-center justify-center text-[#637588] hover:bg-[#f0f2f4] transition-colors"
                                onClick={() => handleIncreaseQuantity(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#637588] text-sm font-normal leading-normal">
                            {(item.points * item.quantity).toLocaleString()}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-60 text-[#637588] text-sm font-bold leading-normal tracking-[0.015em]">
                            <button
                              className="cursor-pointer hover:text-[#111418] transition-colors"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="p-4">
              <div className="flex justify-between gap-x-6 py-2">
                <p className="text-[#637588] text-sm font-normal leading-normal">Subtotal</p>
                <p className="text-[#111418] text-sm font-normal leading-normal text-right">{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between gap-x-6 py-2">
                <p className="text-[#111418] text-base font-bold leading-normal">Total</p>
                <p className="text-[#111418] text-base font-bold leading-normal text-right">{total.toLocaleString()}</p>
              </div>
            </div>

            {/* Points Available */}
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
              You have {userPoints.toLocaleString()} points available
            </p>

            {/* Action Buttons */}
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1672ce] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0f5bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleRedeem}
                  disabled={loading || cartItems.length === 0 || total > userPoints}
                >
                  <span className="truncate">{loading ? "Processing..." : "Redeem"}</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0e2e4] transition-colors"
                  onClick={handleContinueShopping}
                >
                  <span className="truncate">Continue Shopping</span>
                </button>
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

export default connect(mapState, mapDispatch)(CartPage);
