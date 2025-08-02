import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePageSimple = (props) => {
  const navigate = useNavigate();

  // Sample featured vouchers data
  const featuredVouchers = [
    {
      id: 1,
      title: "Luxury Hotel Stay",
      description: "Redeem for a luxurious stay at a top-rated hotel.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYpU0fWYMnrowXCFCYZ0_HD9ucmvm6vzgR-fOMgWMRJGNjAqL09VypAWoSHQFrgGzztJAkKIOIkliKB3o7WFzTx8FMMGaSSK8WPunl_2Ywep1iZEZPBt37sEoPakunQsLnl7uBzZXhaim3mCi2UNSZOh4WSB8bZFAvXoKq5YhW5uM6tM87xE9lEs7ivAis9MxRn0DNfHJTASf6iiLIYPi58YKFAsFKCzKWzE6M7cwi7EKOKE-WmHZXSe9kEGQ1zIAnggLuuIkGUpw"
    },
    {
      id: 2,
      title: "Fine Dining Experience",
      description: "Enjoy a gourmet meal at a renowned restaurant.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmttI9TF5OKAlffMUmCaxqWuyW2uRXu683fKcNW0MiGadCZiauZdyhLJdMXw73PuqDv8-1mjis7J7RJwvsmPgS19VgrDlHB02jv55dpfc-3vj2GeODmFCZGmuk2I2sUYS7nSX897OUoa8ieiofpIIZyTCAMPdDg7-nd6yDO8gGhVJrlMn0mKXA7LOODVmJIVywwIf1ugUxeKOwDOffXTMQG5huztUFdjOIGpgzuQlB1WhL5xKzR3RNCfYI6c6DzN4DlJXkMC8ROH4"
    },
    {
      id: 3,
      title: "Spa Retreat",
      description: "Relax and rejuvenate with a spa day.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPmZ0f9uC5Zq7p_fxgi1xHb8LipjfzIhID8_aqp1XS9gOSc3pyEYm1oz7_FhoBVyYPA3NB3Oxi7PNCO2KiseYMxGfPWxjsirDyNamOs8A2_xXYUawGBIq5LpDTzR4jrsOZlXjJKi8JtEAzX4FHhPMAWoP6j1kQ5_k9qt-IXnoCMW1G_u9DzLJqwxcT9z70545BaLPfsdvMCD25p-1mrxLEe517QPP9UDzEFvoCDz6oW432_5bkaOKhLcEyZe2n82xA1hl2ql16VNs"
    },
    {
      id: 4,
      title: "Adventure Package",
      description: "Experience thrilling activities with our adventure package.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUPCg3fnTUJEBMzvrUiJX7uTbcG-nk3sPvhU9uaGm-Ny9pCaD3Mph5El-3cXpOC2oRirW8ULkWBFWj83Mq8iUO3g9pCJ5pZF1Tlcrgo_0GC0xJn0CR2_ei7b02IUDCTnbwd_V3ECXoChS9TiC1QzGYD9E31q5B1MBwDplVNslXbWNb-gRaHG5CZEG0oSXG8TxljlT8NXPSDaqaBooNoBZyIeXfpAKK8djAfQRpkLklnJjlU8hCWUJ6fGCfSSzbdUkg84tB8C99ViA"
    }
  ];

  const categoryVouchers = [
    {
      id: 5,
      title: "Weekend Getaway",
      description: "Escape for a weekend with our curated travel vouchers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_1hMjDK1ebOQ0lsyosgWFZRI2tfAiCUxkt6_ZJ__bpxkWpJXuRB143cgudm94OZ0ncmedx2mXPcs0eCnqhHLG5ORKgde9xZsOEg4jemPYnDGfNGbJRKaNAFxTM-1Ow-YzimN5r_54XWnvsLp8RwAAlM4AUpjOVRy4yqxhVOFdIO33-trzBO-2AXFx6N98UKIk2iISxV_A-8RbVhl0UBjgvWOr7ra_T-owPGR_cd8hItcbm75xw6jQ01A-HTB9Sp7pfXwYg2RwcO0"
    },
    {
      id: 6,
      title: "Culinary Delights",
      description: "Savor exquisite flavors with our dining vouchers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfchrDGdm6VKehYv-3t1Aj9Bp_m1oUxJzA6ZlysMO6Md0UJeTdOZzC1IEV13riZfHnqbxxNqWC_FkukF5CFMsEaXYL3LCbYErq05LPESCNKDAEAt6sNqH19asDmZ07WnnVz5vgRTsfBtIvLjl_RimAIcmUw7mFTOKdI4vQ4diCUxcgePj1YD2TpQ7aX09eynRXcfjof7TISZ9p6iEqz-S5lFOYI_SRxT8ye5-CFnNeKo3c24eU7q5rsP_Ph4qTfA27fA0_5jWbNSE"
    },
    {
      id: 7,
      title: "Relaxation & Wellness",
      description: "Indulge in self-care with our wellness vouchers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASFPvRusSLn50RZrKWdOR2LtcUVXYrVbT-ELvjly2-eXwcDIFzDCWLn5mVzlg3FFAaDNrdKy8VteA199WFyd9N5NeQFW-zn_AvmehQx8Y9St632DrqwchfA64QrgZ_WBvPSVSxsC_kKR1qO5UQvkiDgj34Lmemltma_fdcnV83qRKqZxapaGHZn86_NjBtvQFSErIHx0wqRI_HtFs4l_i-ek_3P_Nm6GjuMcp4-bPv-OrvqFXjolMg5NLjFx1s2QDRNUbgDQjPYyI"
    },
    {
      id: 8,
      title: "Adventure Awaits",
      description: "Embark on exciting adventures with our experience vouchers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk4XoPfhESoLwMC65UMH4mDF-j-K9r-nKnBptjlk4Mtl17OwqCmnprAE74yf6jsjn7ZAeYUux9laxqAzoMgVd5CtMkEbpdSjycNrjrrDaJq878wBwHZPu4pCvBdaYpdTYWrktCtjS4Iiff00rtrD3gev908tszrEgWIr0-BFTlEGQGdLZrkTDpjYJRsG_0EJtFwQbOrL4ldF1xxXIuOfrRMdT7eVjpR2jjY0bt9XJnjW_gfz3cmJzP0bQ9ouk8dDLiZ8u7yxhD9Tk"
    }
  ];

  const categories = [
    "Travel", "Dining", "Wellness", "Experiences", "Shopping", "Entertainment"
  ];

  const handleVoucherClick = (voucher) => {
    if (props.isLoggedIn) {
      navigate(`/voucher/${voucher.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleCategoryClick = (category) => {
    if (props.isLoggedIn) {
      navigate(`/voucher?category=${category.toLowerCase()}`);
    } else {
      navigate("/login");
    }
  };

  const handleMyAccountClick = () => {
    if (props.isLoggedIn) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  const handleVouchersClick = () => {
    if (props.isLoggedIn) {
      navigate("/voucher");
    } else {
      navigate("/login");
    }
  };

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
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/")}>Home</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={handleVouchersClick}>Vouchers</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/categories")}>Categories</a>
              <a className="text-[#111418] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate("/help")}>Help</a>
            </div>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleMyAccountClick}
            >
              <span className="truncate">{props.isLoggedIn ? "My Account" : "Login"}</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer bg-gray-300 flex items-center justify-center"
              onClick={handleMyAccountClick}
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section */}
            <div className="container mx-auto">
              <div className="px-4 py-3">
                <div
                  className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg min-h-[218px] cursor-pointer"
                  onClick={() => props.isLoggedIn ? navigate("/voucher") : navigate("/login")}
                >
                  <div className="flex p-4">
                    <p className="text-white tracking-light text-[28px] font-bold leading-tight">Exclusive Redemption Offer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Vouchers Section */}
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Vouchers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
              {featuredVouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col gap-3 pb-3 cursor-pointer" onClick={() => handleVoucherClick(voucher)}>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{backgroundImage: `url("${voucher.image}")`}}
                  ></div>
                  <div>
                    <p className="text-[#111418] text-base font-medium leading-normal">{voucher.title}</p>
                    <p className="text-[#637588] text-sm font-normal leading-normal">{voucher.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Section */}
            <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Browse Categories</h2>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {categories.map((category) => (
                <div 
                  key={category}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] pl-4 pr-4 cursor-pointer hover:bg-[#e0e2e4] transition-colors"
                  onClick={() => handleCategoryClick(category)}
                >
                  <p className="text-[#111418] text-sm font-medium leading-normal">{category}</p>
                </div>
              ))}
            </div>

            {/* Category Vouchers Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
              {categoryVouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col gap-3 pb-3 cursor-pointer" onClick={() => handleVoucherClick(voucher)}>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{backgroundImage: `url("${voucher.image}")`}}
                  ></div>
                  <div>
                    <p className="text-[#111418] text-base font-medium leading-normal">{voucher.title}</p>
                    <p className="text-[#637588] text-sm font-normal leading-normal">{voucher.description}</p>
                  </div>
                </div>
              ))}
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

export default connect(mapState, mapDispatch)(HomePageSimple); 