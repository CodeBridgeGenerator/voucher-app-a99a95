import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";

const CartPage = (props) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userPoints, setUserPoints] = useState(25000);
  const [loading, setLoading] = useState(false);

  // Local storage functions for cart persistence
  const saveCartToLocalStorage = (items) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  };

  // Load cart items from localStorage first, then try API
  const loadCartItems = async () => {
    setLoading(true);
    try {
      console.log("Loading cart items...");
      
      // First, always check localStorage for cart items
      const localCart = loadCartFromLocalStorage();
      console.log("Cart items from localStorage:", localCart);
      
      if (localCart && localCart.length > 0) {
        console.log("Setting cart items from localStorage:", localCart);
        // Use localStorage items directly - they should already be in the right format
        setCartItems(localCart);
        setLoading(false);
        return;
      }
      
      // If no local cart items, check if user is authenticated and try API
      if (props.user && props.user._id) {
        console.log("No local cart items, trying API for user:", props.user._id);
        
        try {
          const response = await client.service("cart").find({
            query: {
              $limit: 50,
              userId: props.user._id
            }
          });
          
          console.log("Cart API response:", response);
          
          if (response.data && response.data.length > 0) {
            const items = response.data.map(item => ({
              id: item._id,
              name: item.voucherTitle || item.voucherId?.title || "Unknown Voucher",
              quantity: item.quantity || 1,
              points: item.pointsCost || 0,
              voucherId: item.voucherId || item.voucherId
            }));
            console.log("Processed cart items from API:", items);
            setCartItems(items);
            // Save API items to localStorage for consistency
            saveCartToLocalStorage(items);
          } else {
            console.log("No cart items found in API");
            setCartItems([]);
          }
        } catch (apiError) {
          console.error("Error loading cart from API:", apiError);
          setCartItems([]);
        }
      } else {
        console.log("User not authenticated, showing empty cart");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error in loadCartItems:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh cart data - simplified to avoid dependency issues
  const refreshCartData = () => {
    console.log("Refreshing cart data...");
    try {
      const localCart = loadCartFromLocalStorage();
      console.log("Current local cart:", localCart);
      
      if (localCart && localCart.length > 0) {
        console.log("Setting cart items from localStorage:", localCart);
        setCartItems(localCart);
      } else {
        console.log("No local cart items, showing empty cart");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error refreshing cart data:", error);
      setCartItems([]);
    }
  };

  // Force refresh cart from localStorage
  const forceRefreshCart = () => {
    console.log("Force refreshing cart...");
    const localCart = loadCartFromLocalStorage();
    console.log("Force refresh - local cart:", localCart);
    if (localCart && localCart.length > 0) {
      setCartItems(localCart);
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/login");
      return;
    }

    loadCartItems();
    loadUserPoints();

    // Listen for storage changes (when items are added from other pages)
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        console.log("Cart storage changed, refreshing...");
        // Direct localStorage check instead of calling refreshCartData
        try {
          const localCart = loadCartFromLocalStorage();
          if (localCart && localCart.length > 0) {
            setCartItems(localCart);
          }
        } catch (error) {
          console.error("Error in storage change handler:", error);
        }
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = (e) => {
      console.log("Cart update event received:", e.detail);
      // Direct localStorage check instead of calling refreshCartData
              try {
          const localCart = loadCartFromLocalStorage();
          if (localCart && localCart.length > 0) {
            setCartItems(localCart);
          }
        } catch (error) {
          console.error("Error in cart update handler:", error);
        }
    };

    // Listen for cart item added events
    const handleCartItemAdded = (e) => {
      console.log("Cart item added event received:", e.detail);
      // Update cart immediately with the new data
      if (e.detail && e.detail.cartItems) {
        setCartItems(e.detail.cartItems);
        console.log("Cart updated with new items:", e.detail.cartItems);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartItemAdded', handleCartItemAdded);

    // Also check for changes every 2 seconds as fallback
    const interval = setInterval(() => {
      try {
        const currentLocalCart = loadCartFromLocalStorage();
        const currentStateItems = cartItems;
        
        // Compare if local storage has more items than current state
        if (currentLocalCart && currentLocalCart.length > currentStateItems.length) {
          console.log("New items detected in localStorage, refreshing...");
          setCartItems(currentLocalCart);
        }
      } catch (error) {
        console.error("Error in interval check:", error);
      }
    }, 2000);

    // Refresh cart when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing cart...");
        // Direct localStorage check instead of calling refreshCartData
        try {
          const localCart = loadCartFromLocalStorage();
          if (localCart && localCart.length > 0) {
            setCartItems(localCart);
          }
        } catch (error) {
          console.error("Error in visibility change handler:", error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartItemAdded', handleCartItemAdded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [props.isLoggedIn, props.user, navigate]);

  const loadUserPoints = async () => {
    try {
      if (props.user && props.user._id) {
        const userResponse = await client.service("users").get(props.user._id);
        setUserPoints(userResponse.pointsBalance || 25000);
      }
    } catch (error) {
      console.error("Error loading user points:", error);
      setUserPoints(25000);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      console.log("Removing item with ID:", itemId);
      
      // Remove from API if user is authenticated
      if (props.user && props.user._id) {
        try {
          await client.service("cart").remove(itemId);
          console.log("Item removed from API successfully");
        } catch (apiError) {
          console.error("Error removing from API:", apiError);
          // Continue with local removal even if API fails
        }
      }
      
      // Remove from state and localStorage
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      saveCartToLocalStorage(updatedItems);
      props.alert({ type: "success", message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item:", error);
      // If everything fails, still remove from local storage
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      saveCartToLocalStorage(updatedItems);
      props.alert({ type: "success", message: "Item removed from cart (local)" });
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is 0, remove the item
      await handleRemoveItem(itemId);
      return;
    }

    try {
      console.log("Updating quantity for item:", itemId, "to:", newQuantity);
      
      // Update via API if user is authenticated
      if (props.user && props.user._id) {
        try {
          await client.service("cart").patch(itemId, { 
            quantity: newQuantity,
            updatedBy: props.user._id
          });
          console.log("Quantity updated in API successfully");
        } catch (apiError) {
          console.error("Error updating quantity in API:", apiError);
          // Continue with local update even if API fails
        }
      }
      
      // Update state and localStorage
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      saveCartToLocalStorage(updatedItems);
      props.alert({ type: "success", message: "Quantity updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      // If everything fails, still update local storage
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      saveCartToLocalStorage(updatedItems);
      props.alert({ type: "success", message: "Quantity updated successfully (local)" });
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
    if (item) {
      handleQuantityChange(itemId, item.quantity - 1);
    }
  };

  const handleRedeem = async () => {
    if (cartItems.length === 0) {
      props.alert({ type: "error", message: "Your cart is empty" });
      return;
    }

    const totalPoints = cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
    
    if (totalPoints > userPoints) {
      props.alert({ type: "error", message: "Insufficient points to redeem all items" });
      return;
    }

    try {
      // Process each cart item
      for (const item of cartItems) {
        // Create redemption record
        const redemptionData = {
          userId: props.user._id,
          voucherId: item.voucherId,
          voucherTitle: item.name,
          pointsCost: item.points * item.quantity,
          redeemedAt: new Date(),
          status: "redeemed",
          createdBy: props.user._id,
          updatedBy: props.user._id
        };

        // Add to cart history if user is authenticated
        if (props.user && props.user._id) {
          try {
            await client.service("cartHistory").create(redemptionData);
          } catch (historyError) {
            console.error("Error creating cart history:", historyError);
            // Continue with other items even if history creation fails
          }
        }

        // Remove from cart if user is authenticated and item has API ID
        if (props.user && props.user._id && !item.id.startsWith('test-')) {
          try {
            await client.service("cart").remove(item.id);
          } catch (removeError) {
            console.error("Error removing item from cart:", removeError);
            // Continue with other items even if one fails to remove
          }
        }
      }

      // Update user points if user is authenticated
      if (props.user && props.user._id) {
        try {
          await client.service("users").patch(props.user._id, {
            pointsBalance: userPoints - totalPoints
          });
        } catch (pointsError) {
          console.error("Error updating user points:", pointsError);
          // Continue with success flow even if points update fails
        }
      }

      // Clear cart
      setCartItems([]);
      saveCartToLocalStorage([]);

      // Prepare redemption data for success page
      const redemptionData = {
        totalPoints: totalPoints,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          points: item.points * item.quantity
        }))
      };

      props.alert({ type: "success", message: "All items redeemed successfully!" });
      
      // Navigate to success page with redemption data
      navigate("/success", { 
        state: { 
          redemptionData: redemptionData 
        } 
      });
    } catch (error) {
      console.error("Error redeeming items:", error);
      props.alert({ type: "error", message: "Failed to redeem items" });
    }
  };

  const handleContinueShopping = () => {
    navigate("/voucher");
  };

  const handleRefreshCart = () => {
    console.log("Manual refresh triggered");
    refreshCartData();
  };

  const handleForceRefresh = () => {
    console.log("Force refresh triggered");
    forceRefreshCart();
  };

  const handleDebugCart = () => {
    console.log("=== CART DEBUG INFO ===");
    console.log("Current cart state:", cartItems);
    console.log("localStorage cart:", localStorage.getItem('cartItems'));
    console.log("Parsed localStorage:", JSON.parse(localStorage.getItem('cartItems') || '[]'));
    console.log("User:", props.user);
    console.log("Is logged in:", props.isLoggedIn);
    console.log("=======================");
    
    // Also show in alert for easy viewing
    const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    alert(`Cart Debug Info:
Current State Items: ${cartItems.length}
localStorage Items: ${localCart.length}
localStorage Content: ${JSON.stringify(localCart, null, 2)}
User ID: ${props.user?._id || 'Not logged in'}`);
  };

  const handleAddTestItem = () => {
    console.log("Adding test item to cart...");
    const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const testItem = {
      id: `local-${Date.now()}`,
      name: "Test Voucher " + new Date().toLocaleTimeString(),
      quantity: 1,
      points: 2500,
      voucherId: "test-voucher-123",
      voucherTitle: "Test Voucher " + new Date().toLocaleTimeString(),
      voucherImage: "https://example.com/image.jpg",
      voucherDescription: "This is a test voucher",
      category: "Test"
    };
    localCart.push(testItem);
    localStorage.setItem('cartItems', JSON.stringify(localCart));
    
    // Update state immediately
    setCartItems(localCart);
    
    console.log("Test item added:", testItem);
    console.log("Updated localStorage:", localStorage.getItem('cartItems'));
    props.alert({ type: "success", message: "Test item added to cart!" });
  };





  const handleRewardsClick = () => {
    navigate("/rewards");
  };

  const handleTravelClick = () => {
    navigate("/travel");
  };

  const handleDiningClick = () => {
    navigate("/dining");
  };

  const handleShoppingClick = () => {
    navigate("/shopping");
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a className="text-gray-500 text-base font-medium cursor-pointer hover:text-gray-700" onClick={handleRewardsClick}>Rewards</a>
          <span className="text-gray-500 text-base font-medium">/</span>
          <span className="text-gray-900 text-base font-medium">Cart</span>
        </div>

        {/* Page Title with Refresh Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Cart</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleDebugCart}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Debug Cart
            </button>
            <button
              onClick={handleAddTestItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Test Item
            </button>
            <button
              onClick={handleForceRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        Loading cart items...
                      </div>
                    </td>
                  </tr>
                ) : cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Your cart is empty
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => handleDecreaseQuantity(item.id)}
                          >
                            -
                          </button>
                          <span className="min-w-[40px] text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(item.points * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Points Available */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Points Available</h3>
                <p className="text-blue-700">{userPoints.toLocaleString()} points</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Points needed: {total.toLocaleString()}</p>
                <p className={`text-sm ${total > userPoints ? 'text-red-600' : 'text-green-600'}`}>
                  {total > userPoints ? 'Insufficient points' : 'Sufficient points'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleContinueShopping}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleRedeem}
            disabled={cartItems.length === 0 || total > userPoints}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Redeem All ({cartItems.length} items)
          </button>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
});

const mapDispatch = (dispatch) => ({
  alert: (alert) => dispatch({ type: "ALERT", payload: alert }),
});

export default connect(mapState, mapDispatch)(CartPage);
