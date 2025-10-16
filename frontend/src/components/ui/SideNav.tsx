'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  FiHome,
  FiBook,
  FiUser,
  FiSettings,
  FiChevronLeft,
  FiMenu,
  FiCalendar,
  FiEdit,
  FiMessageSquare,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiSearch,
  FiUsers
} from 'react-icons/fi';

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768; // Changed to 768px for mobile-only sidebar
      setIsMobile(isMobileView);
      setIsCollapsed(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { 
      href: '/dashboard', 
      icon: <FiHome size={20} />, 
      label: 'Home', 
      id: 'home',
      description: 'Go to dashboard'
    },
    { 
      href: '/courses', 
      icon: <FiBook size={20} />, 
      label: 'Courses', 
      id: 'courses',
      description: 'Manage your courses'
    },
    { 
      href: '/planning', 
      icon: <FiCalendar size={20} />, 
      label: 'Planning', 
      id: 'planning',
      description: 'View your schedule'
    },
    { 
      href: '/notes', 
      icon: <FiEdit size={20} />, 
      label: 'Notes', 
      id: 'notes',
      description: 'Access your notes'
    },
    { 
      href: '/AIbot', 
      icon: <FiMessageSquare size={20} />, 
      label: 'AI Chat', 
      id: 'chat',
      description: 'Chat with AI assistant'
    },
    { 
      href: '/help-requests', 
      icon: <FiUsers size={20} />, 
      label: 'Help Requests', 
      id: 'help-requests',
      description: 'Find or offer course help'
    },
  ];

  const bottomNavItems = [
    { 
      href: '/profile', 
      icon: <FiUser size={20} />, 
      label: 'Profile', 
      id: 'profile',
      description: 'View your profile'
    },
    { 
      href: '/notifications', 
      icon: <FiBell size={20} />, 
      label: 'Notifications', 
      id: 'notifications',
      description: 'Check notifications'
    },
    { 
      href: '/help', 
      icon: <FiHelpCircle size={20} />, 
      label: 'Help', 
      id: 'help',
      description: 'Get support'
    },
    { 
      href: '/settings', 
      icon: <FiSettings size={20} />, 
      label: 'Settings', 
      id: 'settings',
      description: 'Manage settings'
    },
  ];

  // Top Navigation Bar for larger screens
  const TopNav = () => (
    <div className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/emsi.svg" alt="Emsi Logo" className="h-8" />
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                  pathname === item.href 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
              <FiBell size={20} />
            </button>
            <Link
              href="/profile"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              <FiUser size={20} />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              {isLoggingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
              ) : (
                <FiLogOut size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Navigation for larger screens */}
      <TopNav />

      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar for mobile only */}
      <div 
        className={`md:hidden fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-soft transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-20' : 'w-72'} 
          ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}`}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          {isCollapsed ? (
            <FiMenu size={20} className="text-gray-600" />
          ) : (
            <FiChevronLeft size={20} className="text-gray-600" />
          )}
        </button>

        {/* Logo */}
        <div className={`flex items-center justify-center border-b border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
          {isCollapsed ? (
            <img src="/emsi.png" alt="Emsi Logo" className="h-10 w-auto animate-scale-in" />
          ) : (
            <img src="/emsi.svg" alt="Your Logo" className="h-10 animate-scale-in" />
          )}
        </div>

        {/* Main Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            {!isCollapsed && <span className="animate-fade-in">Main Menu</span>}
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 animate-fade-in">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom Navigation */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              {!isCollapsed && <span className="animate-fade-in">Settings</span>}
            </div>
            <ul className="space-y-1">
              {bottomNavItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="ml-3 animate-fade-in">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
              
              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoggingOut ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <span className="flex-shrink-0">
                    {isLoggingOut ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                    ) : (
                      <FiLogOut size={20} />
                    )}
                  </span>
                  {!isCollapsed && (
                    <span className="ml-3 animate-fade-in">
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}