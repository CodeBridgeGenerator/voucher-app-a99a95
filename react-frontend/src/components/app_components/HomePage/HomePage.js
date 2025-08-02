import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Panel, Tag, Avatar } from 'primereact';
import { 
  FaStar, FaTrophy, FaShieldAlt, FaGem, FaCrown, 
  FaHandshake, FaHeadset, FaTag, FaGift, FaClock, 
  FaUserCog, FaConciergeBell, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

const HomePage = (props) => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleGetStarted = () => {
    navigate(props.isLoggedIn ? '/voucher' : '/login');
  };

  const handleLearnMore = () => navigate('/voucher');

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => setCurrentTestimonial(index);

  const testimonials = [
    {
      id: 1,
      quote: "Carter Bank's voucher program has transformed how I manage my wealth. The exclusive benefits are unparalleled in the industry.",
      name: "Sarah Mitchell",
      role: "Investment Portfolio Manager",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      status: "Platinum Member"
    },
    {
      id: 2,
      quote: "The personalized attention and premium offerings make Carter Bank stand out. I've never experienced this level of service elsewhere.",
      name: "Robert Chen",
      role: "Technology Executive",
      rating: 5,
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
      status: "Gold Member"
    },
    {
      id: 3,
      quote: "As a long-time client, the evolution of their voucher program reflects their commitment to excellence and innovation.",
      name: "Maria Rodriguez",
      role: "Arts Foundation Director",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      status: "Diamond Member"
    },
    {
      id: 4,
      quote: "The 24/7 concierge support and instant redemption make every interaction seamless and exceptional.",
      name: "James Thompson",
      role: "Real Estate Developer",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      status: "Platinum Member"
    }
  ];

  const features = [
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: "Premium Rewards",
      description: "Access exclusive vouchers worth up to $10,000 with our elite tier system."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Transactions",
      description: "Bank-grade security ensures your voucher redemptions are always protected."
    },
    {
      icon: <FaGem className="w-8 h-8" />,
      title: "Luxury Partners",
      description: "Curated selection of premium merchants and exclusive lifestyle experiences."
    },
    {
      icon: <FaCrown className="w-8 h-8" />,
      title: "VIP Treatment",
      description: "Priority booking, dedicated support, and personalized recommendations."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50" style={{fontFamily: '"Public Sans", "Noto Sans", sans-serif'}}>
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-[#2d5a8b] to-[#0f2537]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&h=1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded-full mb-8">
              <FaCrown className="text-gold-500 w-4 h-4 mr-2" />
              <span className="text-gold-500 font-medium text-sm">PREMIUM BANKING EXPERIENCE</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-300">VIP Voucher</span> Redemption
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Unlock premium benefits with your Carter Bank voucher. Experience financial privileges reserved for our most valued clients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-gold-500 to-yellow-500 text-navy-800 hover:from-gold-600 hover:to-yellow-600 font-bold px-10 py-5 rounded-full text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-gold-500/25"
              >
                <span className="flex items-center justify-center">
                  {props.isLoggedIn ? 'Redeem Now' : 'Get Started'}
                  <FaTrophy className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
              <button 
                onClick={handleLearnMore}
                className="group bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-5 rounded-full text-lg transition-all backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  Learn More
                  <FaHandshake className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">2,500+</div>
                <div className="text-white/80 text-sm">Active Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">$50M+</div>
                <div className="text-white/80 text-sm">Rewards Value</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">99.8%</div>
                <div className="text-white/80 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Unparalleled <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the pinnacle of private banking with exclusive benefits designed for discerning clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <Panel id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Carter Bank prestigious interior" 
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-6">
                <FaCrown className="text-gold-600 w-4 h-4 mr-2" />
                <span className="text-gold-600 font-medium text-sm">ESTABLISHED 1892</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                131 Years of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-yellow-600">Financial Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Carter Bank has been the cornerstone of private banking since 1892, serving distinguished clients with 
                unparalleled financial services and exclusive privileges.
              </p>
              
              <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">$2.5B+</div>
                  <div className="text-sm text-gray-600">Assets Under Management</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">131</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">99.8%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-purple-50 border border-purple-100 rounded-full mb-6">
              <FaGem className="text-purple-600 w-5 h-5 mr-3" />
              <span className="text-purple-600 font-medium text-sm">EXCLUSIVE BENEFITS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Advantages</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our VIP voucher program offers unparalleled advantages designed for discerning clients.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {[
                { icon: <FaHeadset className="w-5 h-5" />, title: "Priority 24/7 Support", desc: "Dedicated assistance whenever you need it" },
                { icon: <FaTag className="w-5 h-5" />, title: "Exclusive Discounts", desc: "Special rates with our luxury partners" },
                { icon: <FaGift className="w-5 h-5" />, title: "Complimentary Services", desc: "Premium perks at no additional cost" },
                { icon: <FaClock className="w-5 h-5" />, title: "Early Access", desc: "Be the first to enjoy new offerings" },
                { icon: <FaUserCog className="w-5 h-5" />, title: "Personalized Offers", desc: "Tailored to your preferences" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start">
                    <div className="bg-purple-50 p-2 rounded-lg mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative h-full min-h-[300px]">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 h-full flex flex-col justify-center">
                <div className="text-center mb-6">
                  <FaGem className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Partners</h3>
                  <p className="text-gray-600 mb-6">Access our exclusive network of luxury brands</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {["Gucci", "Tiffany", "Four Seasons", "NetJets", "Rolex", "AMEX"].map((brand) => (
                    <div key={brand} className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm">
                      <span className="text-sm font-medium text-gray-800">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gold-50 border border-gold-100 rounded-full mb-6">
              <FaStar className="text-gold-600 w-4 h-4 mr-2" />
              <span className="text-gold-600 font-medium text-sm">CLIENT TESTIMONIALS</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-yellow-500">Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our distinguished members about their exclusive experiences
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.slice(0, 2).map((testimonial) => (
              <Card key={testimonial.id} className="border border-gray-200 hover:border-gold-300 transition-all">
                <div className="flex items-start mb-4">
                  <Avatar 
                    image={testimonial.image} 
                    size="large" 
                    shape="circle" 
                    className="mr-4 border-2 border-gold-500"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{testimonial.role}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 text-gold-500" />
                      ))}
                      <span className="ml-2 text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full">
                        {testimonial.status}
                      </span>
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic pl-2 border-l-2 border-gold-300">
                  "{testimonial.quote}"
                </blockquote>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/testimonials')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              View All Testimonials
              <FaChevronRight className="ml-2 w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapState = (state) => ({
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn
});

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(HomePage);