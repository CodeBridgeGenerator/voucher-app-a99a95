import React from "react";
import UserProjectLayout from "../../Layouts/UserProjectLayout";
import { connect } from "react-redux";
import CartHistoryPage from "./CartHistoryPage";

const CartHistoryProjectLayoutPage = (props) => {
  return (
    <UserProjectLayout>
      <CartHistoryPage />
    </UserProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CartHistoryProjectLayoutPage);