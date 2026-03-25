import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Phone, 
  Clock, 
  Heart,
  Activity,
  Calendar,
  Users,
  Award,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  const publicLinks = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/about', label: 'About', icon: Users },
    { path: '/services', label: 'Services', icon: Activity, hasDropdown: true },
    { path: '/reviews', label: 'Reviews', icon: Award },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  const servicesDropdown = [
    { path: '/services', label: 'Pain Relief' },
    { path: '/services#sports-rehab', label: 'Sports Rehab' },
    { path: '/services#post-surgery', label: 'Post Surgery Recovery' },
    { path: '/services#neuro', label: 'Neuro Physiotherapy' },
    { path: '/services#home-visit', label: 'Home Visit' },
  ];

  return (
    <>
      {/* Add top padding to prevent content overlap */}
      <div className="h-16" />
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'bg-gray-50/95 backdrop-blur-md shadow-[0_8px_32px_-8px_rgba(31,38,135,0.15)]' 
            : 'bg-gray-50'
        }`}
        style={{
          boxShadow: isScrolled 
            ? '0 8px 32px -8px rgba(31, 38, 135, 0.15), 0 4px 16px -4px rgba(31, 38, 135, 0.1)'
            : '0 2px 8px -2px rgba(31, 38, 135, 0.05), 0 1px 4px -1px rgba(31, 38, 135, 0.03)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>
            
            {/* Left: Logo + Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] group-hover:shadow-[0_6px_12px_-2px_rgba(31,38,135,0.2),0_3px_6px_-1px_rgba(31,38,135,0.15)] group-active:shadow-[inset_0_2px_4px_rgba(31,38,135,0.2)] ${
                  isScrolled ? 'w-9 h-9' : 'w-10 h-10'
                }`}>
                  <Heart className={`text-white transition-all duration-300 ease-in-out ${
                    isScrolled ? 'w-4 h-4' : 'w-5 h-5'
                  }`} />
                </div>
                <div>
                  <div className={`font-bold text-gray-800 transition-all duration-300 ease-in-out ${
                    isScrolled ? 'text-base' : 'text-lg'
                  }`}>
                    PhysioCare
                  </div>
                  <div className={`text-gray-600 transition-all duration-300 ease-in-out ${
                    isScrolled ? 'text-[10px]' : 'text-xs'
                  }`}>
                    Medical Center
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links - Desktop Only */}
            <div className="hidden md:flex items-center space-x-2">
              {publicLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.path);
                
                if (link.hasDropdown) {
                  return (
                    <div 
                      key={link.path}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        className={`relative flex items-center px-4 py-2 rounded-2xl font-medium transition-all duration-300 ease-in-out ${
                          isActive 
                            ? 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(31,38,135,0.1)] text-blue-600' 
                            : 'text-gray-700 hover:text-blue-600 hover:shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] hover:bg-gray-50'
                        }`}
                        onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                        aria-label="Services menu"
                        aria-expanded={isServicesDropdownOpen}
                        aria-haspopup="true"
                      >
                        <Icon className={`transition-all duration-300 ease-in-out ${
                          isScrolled ? 'w-3 h-3' : 'w-4 h-4'
                        } mr-2`} />
                        <span className={`transition-all duration-300 ease-in-out ${
                          isScrolled ? 'text-xs' : 'text-sm'
                        }`}>
                          {link.label}
                        </span>
                        <ChevronDown 
                          className={`ml-1 transition-all duration-300 ease-in-out ${
                            isScrolled ? 'w-3 h-3' : 'w-4 h-4'
                          } ${isServicesDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {/* Neumorphic Dropdown Menu */}
                      {isServicesDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-56 bg-gray-50 rounded-2xl shadow-[0_8px_32px_-8px_rgba(31,38,135,0.15),0_4px_16px_-4px_rgba(31,38,135,0.1)] border border-gray-200/50 py-2 z-50"
                          role="menu"
                          style={{
                            boxShadow: '0 8px 32px -8px rgba(31, 38, 135, 0.15), 0 4px 16px -4px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          {servicesDropdown.map((service, index) => (
                            <Link
                              key={service.path}
                              to={service.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-all duration-300 ease-in-out mx-2 my-1 hover:shadow-[inset_0_1px_2px_rgba(31,38,135,0.05)]"
                              role="menuitem"
                              onClick={() => setIsServicesDropdownOpen(false)}
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center px-4 py-2 rounded-2xl font-medium transition-all duration-300 ease-in-out ${
                      isActive 
                        ? 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(31,38,135,0.1)] text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`transition-all duration-300 ease-in-out ${
                      isScrolled ? 'w-3 h-3' : 'w-4 h-4'
                    } mr-2`} />
                    <span className={`transition-all duration-300 ease-in-out ${
                      isScrolled ? 'text-xs' : 'text-sm'
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button - Mobile Only */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-gray-50/50 shadow-[0_2px_4px_-1px_rgba(31,38,135,0.1),0_1px_2px_-0.5px_rgba(31,38,135,0.05)] hover:shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] active:shadow-[inset_0_1px_2px_rgba(31,38,135,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ease-in-out"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu - Mobile Only */}
          <div className={`md:hidden border-t border-gray-200/50 transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-4 pb-3 space-y-2 sm:px-3 bg-gray-50/50">
              {publicLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.path);
                
                if (link.hasDropdown) {
                  return (
                    <div key={link.path} className="space-y-1">
                      <button
                        onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                        className={`w-full flex items-center px-4 py-3 rounded-2xl font-medium transition-all duration-300 ease-in-out ${
                          isActive 
                            ? 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(31,38,135,0.1)] text-blue-600' 
                            : 'text-gray-700 hover:text-blue-600 hover:shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {link.label}
                        <ChevronDown 
                          className={`w-4 h-4 ml-auto transition-transform duration-300 ease-in-out ${
                            isServicesDropdownOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {isServicesDropdownOpen && (
                        <div className="pl-8 space-y-1">
                          {servicesDropdown.map((service) => (
                            <Link
                              key={service.path}
                              to={service.path}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-all duration-300 ease-in-out hover:shadow-[inset_0_1px_2px_rgba(31,38,135,0.05)]"
                              onClick={() => {
                                setIsServicesDropdownOpen(false);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-2xl font-medium transition-all duration-300 ease-in-out ${
                      isActive 
                        ? 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(31,38,135,0.1)] text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:shadow-[0_4px_8px_-2px_rgba(31,38,135,0.15),0_2px_4px_-1px_rgba(31,38,135,0.1)] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
              
              </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
