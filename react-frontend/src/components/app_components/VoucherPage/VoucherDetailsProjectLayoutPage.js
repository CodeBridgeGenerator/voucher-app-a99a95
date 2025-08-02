import React from "react";
import UserProjectLayout from "../../Layouts/UserProjectLayout";
import { connect } from "react-redux";
import VoucherDetailsPage from "./VoucherDetailsPage";

const VoucherDetailsProjectLayoutPage = (props) => {
  return (
    <UserProjectLayout>
      <VoucherDetailsPage />
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

export default connect(mapState, mapDispatch)(VoucherDetailsProjectLayoutPage); 