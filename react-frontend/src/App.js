import React from "react";
import { useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import MyRouter from "./MyRouter/MyRouter";
import store from "./utils/store";
import { AppConfigStatic } from "./AppConfigStatic";
import AppTopbar from "./components/Layouts/AppTopbar";
import AppFooter from "./components/Layouts/AppFooter";
import MainLayout from "./components/Layouts/MainLayout";
import LoadingWrapper from "./MyRouter/wrappers/LoadingWrapper";
import ToastWrapper from "./MyRouter/wrappers/ToastWrapper";
import StartupWrapper from "./MyRouter/wrappers/StartupWrapper";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/layout/layout.scss";
import "./assets/mainTheme/mainTheme.css";
import "./css/customStyles.css";

// Inner App component that can access Redux state
const AppInner = (props) => {
  const location = useLocation();

  const showSideMenuButton = false;

  // Check if current route is a user route (not admin)
  const isUserRoute = () => {
    const userRoutes = ['/home', '/voucher', '/cart', '/cartHistory', '/profile'];
    return userRoutes.includes(location.pathname) || location.pathname.startsWith('/voucher/');
  };

  // Only show AppTopbar for admin users or non-user routes
  const shouldShowAppTopbar = () => {
    if (!props.isLoggedIn) return true; // Show for login page
    if (props.user?.role === 'admin') return true; // Always show for admin
    return !isUserRoute(); // Don't show for user routes
  };

  return (
    <>
      {shouldShowAppTopbar() && <AppTopbar showSideMenuButton={showSideMenuButton} />}
      <MainLayout>
        <MyRouter />
      </MainLayout>

      <LoadingWrapper />
      <ToastWrapper />
      <StartupWrapper />

      <AppConfigStatic
        rippleEffect={true}
        inputStyle={"outlined"}
        layoutMode={"static"}
        layoutColorMode={"light"}
      />
    </>
  );
};

// Connect the inner component to Redux
const ConnectedAppInner = connect((state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user
}))(AppInner);

// Main App component that provides the store
const App = () => {
  return (
    <Provider store={store}>
      <ConnectedAppInner />
    </Provider>
  );
};

export default App;
