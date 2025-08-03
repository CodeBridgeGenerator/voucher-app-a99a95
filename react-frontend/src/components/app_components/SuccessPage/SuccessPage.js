import React from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redemptionData = location.state?.redemptionData || {};

  const handleContinueShopping = () => {
    navigate("/voucher");
  };

  const handleViewHistory = () => {
    navigate("/cartHistory");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Icon and Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Redemption Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your vouchers have been successfully redeemed and added to your account.
          </p>

          {redemptionData.totalPoints && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Total Points Redeemed</p>
                <p className="text-2xl font-bold text-blue-900">
                  {redemptionData.totalPoints.toLocaleString()} points
                </p>
              </div>
            </div>
          )}

          {redemptionData.items && redemptionData.items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Redeemed Items:</h3>
              <div className="space-y-2">
                {redemptionData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-900 font-medium">
                      {item.quantity} × {item.points.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinueShopping}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={handleViewHistory}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Redemption History
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Go to Home
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

export default connect(mapState, mapDispatch)(SuccessPage); 