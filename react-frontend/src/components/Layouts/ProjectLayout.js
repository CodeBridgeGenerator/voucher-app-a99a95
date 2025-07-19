import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import CartPage from "../CartPage/CartPage";
import VoucherPage from "../VoucherPage/VoucherPage";
import CartHistoryPage from "../CartHistoryPage/CartHistoryPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "cart":
                return <CartPage />;
case "voucher":
                return <VoucherPage />;
case "cartHistory":
                return <CartHistoryPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
