import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import client from '../../../services/restClient';
import { FaStar, FaGem, FaCrown, FaSearch, FaChevronRight } from "react-icons/fa";

const VoucherPage = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [featuredVouchers, setFeaturedVouchers] = useState([]);
    const [categoryVouchers, setCategoryVouchers] = useState([]);
    const [categories] = useState(['Food & Dining', 'Shopping', 'Entertainment', 'Travel', 'Health & Beauty']);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const response = await client.service('voucher').find({
                query: {
                    $limit: 8,
                    status: 'active'
                }
            });
            
            if (response.data) {
                setFeaturedVouchers(response.data.slice(0, 4));
                setCategoryVouchers(response.data.slice(4, 8));
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            // Fallback to mock data if API fails
            setFeaturedVouchers([
                {
                    _id: '1',
                    title: 'Gourmet Dining Experience',
                    description: '20% off at Michelin-star restaurants',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Food & Dining',
                    points: 500
                },
                {
                    _id: '2',
                    title: 'Luxury Shopping Spree',
                    description: '15% off at premium boutiques',
                    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Shopping',
                    points: 750
                },
                {
                    _id: '3',
                    title: 'VIP Entertainment Access',
                    description: 'Exclusive tickets to premium events',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Entertainment',
                    points: 1000
                },
                {
                    _id: '4',
                    title: 'First-Class Travel Upgrade',
                    description: 'Complimentary upgrade on select flights',
                    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
                    category: 'Travel',
                    points: 1500
                }
            ]);
            setCategoryVouchers([
                {
                    _id: '5',
                    title: 'Spa Retreat Package',
                    description: 'Full day spa experience for two',
                    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Health & Beauty',
                    points: 800
                },
                {
                    _id: '6',
                    title: 'Wine Tasting Experience',
                    description: 'Private tasting with sommelier',
                    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Food & Dining',
                    points: 600
                },
                {
                    _id: '7',
                    title: 'Designer Accessories',
                    description: '10% off luxury handbags and watches',
                    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1636&q=80',
                    category: 'Shopping',
                    points: 900
                },
                {
                    _id: '8',
                    title: 'Concert VIP Package',
                    description: 'Backstage passes and premium seating',
                    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                    category: 'Entertainment',
                    points: 1200
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleVoucherClick = (voucher) => {
        navigate(`/voucher/${voucher._id || voucher.id}`);
    };

    const handleCategoryClick = (category) => {
        // Navigate to category-specific vouchers or filter current view
        console.log('Category clicked:', category);
    };

    const filteredVouchers = [...featuredVouchers, ...categoryVouchers].filter(voucher => 
        voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen" style={{fontFamily: '"Public Sans", "Noto Sans", sans-serif'}}>
            {/* Hero Section */}
            <section className="relative w-full pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-[#2d5a8b] to-[#0f2537]"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&h=1080')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded-full mb-6">
                            <FaCrown className="text-gold-500 w-4 h-4 mr-2" />
                            <span className="text-gold-500 font-medium text-sm">PREMIUM VOUCHER COLLECTION</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-center">
                            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-300">VIP Vouchers</span>
                        </h1>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-white/90 backdrop-blur-sm border border-white/30 text-gray-900 text-sm rounded-full block w-full pl-10 p-3 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                placeholder="Search vouchers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Featured Vouchers Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Vouchers</span>
                        </h2>
                        <button 
                            onClick={() => navigate('/voucher/all')}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center"
                        >
                            View All <FaChevronRight className="ml-1 w-3 h-3" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                                    <div className="w-full h-48 bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredVouchers.map((voucher) => (
                                <div 
                                    key={voucher._id || voucher.id} 
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                                    onClick={() => handleVoucherClick(voucher)}
                                >
                                    <div className="relative overflow-hidden h-48">
                                        <img 
                                            src={voucher.image} 
                                            alt={voucher.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <span className="inline-flex items-center px-2 py-1 bg-gold-500 text-xs font-medium rounded text-gray-900">
                                                <FaStar className="mr-1" /> Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{voucher.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{voucher.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                {voucher.category || 'Premium'}
                                            </span>
                                            <span className="text-sm font-semibold text-gold-600">
                                                {voucher.points || '500'} pts
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Categories</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center"
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category === 'Health & Beauty' && <FaGem className="mr-2 text-pink-500" />}
                                {category === 'Travel' && <FaCrown className="mr-2 text-gold-500" />}
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* All Vouchers Section */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-yellow-500">Voucher Collection</span>
                    </h2>
                    
                    {searchQuery && (
                        <p className="text-gray-600 mb-6">
                            Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                        </p>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                                    <div className="w-full h-48 bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(searchQuery ? filteredVouchers : categoryVouchers).map((voucher) => (
                                <div 
                                    key={voucher._id || voucher.id} 
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                                    onClick={() => handleVoucherClick(voucher)}
                                >
                                    <div className="relative overflow-hidden h-48">
                                        <img 
                                            src={voucher.image} 
                                            alt={voucher.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{voucher.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{voucher.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                {voucher.category || 'Premium'}
                                            </span>
                                            <span className="text-sm font-semibold text-gold-600">
                                                {voucher.points || '500'} pts
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapState = (state) => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn
});

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(VoucherPage);