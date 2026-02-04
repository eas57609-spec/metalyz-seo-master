'use client';

import { Search, Bell, Moon, Sun, User, LogOut, Crown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole, isOwner, isSuperAdmin } from '@/types/user';
import { useTheme } from 'next-themes';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Dashboard" }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  // Refs for outside click detection
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      // Mock search results - in production, this would query the database
      const mockResults = [
        { id: 1, type: 'project', title: 'Amazon SEO Analysis', url: '/generator?project=amazon', description: 'E-commerce optimization project' },
        { id: 2, type: 'project', title: 'Google Analytics Setup', url: '/generator?project=google', description: 'Analytics integration project' },
        { id: 3, type: 'analysis', title: 'Microsoft.com Report', url: '/reports/microsoft', description: '96/100 SEO Score - Technology Company' },
        { id: 4, type: 'keyword', title: 'SEO optimization', url: '/generator?keyword=seo', description: 'High-performing keyword' },
        { id: 5, type: 'page', title: 'Profile Settings', url: '/profile', description: 'Manage your account settings' }
      ];

      const filtered = mockResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);
      setShowSearchResults(filtered.length > 0);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSelect = (result: any) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(result.url);
  };

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (user?.id) {
        try {
          const { getUserNotifications } = await import('@/lib/supabase');
          const userNotifications = await getUserNotifications(user.id);
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        } catch (error) {
          // Fallback - no notifications
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    loadNotifications();
  }, [user?.id]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const { markNotificationAsRead } = await import('@/lib/supabase');
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.log('Could not mark notification as read');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSubscriptionBadge = (subscription?: string, role?: UserRole) => {
    // Owner gets special treatment - Type-safe role comparison
    if ((user?.role as string) === 'owner') {
      return { 
        label: 'Owner', 
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500', 
        icon: Crown,
        textColor: 'text-yellow-600 dark:text-yellow-400'
      };
    }
    
    // SuperAdmin gets special golden treatment - Type-safe role comparison
    if ((user?.role as string) === 'superadmin') {
      return { 
        label: 'SuperAdmin', 
        color: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500', 
        icon: Crown,
        textColor: 'text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text'
      };
    }
    
    switch (subscription) {
      case 'lifetime':
        return { 
          label: 'Lifetime Pro', 
          color: 'bg-gradient-to-r from-purple-500 to-pink-500', 
          icon: Crown,
          textColor: 'text-purple-600 dark:text-purple-400'
        };
      case 'pro':
        return { 
          label: 'Pro', 
          color: 'bg-blue-500', 
          icon: Crown,
          textColor: 'text-blue-600 dark:text-blue-400'
        };
      case 'enterprise':
        return { 
          label: 'Enterprise', 
          color: 'bg-purple-500', 
          icon: Crown,
          textColor: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return null;
    }
  };

  const subscriptionBadge = getSubscriptionBadge(user?.subscription, user?.role);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left side - Title & Search */}
        <div className="flex items-center space-x-6 flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">
            {title}
          </h1>
          
          <div className="relative max-w-md w-full" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, keywords, or analytics..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        result.type === 'project' ? 'bg-blue-500' :
                        result.type === 'analysis' ? 'bg-green-500' :
                        result.type === 'keyword' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {result.title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          {result.description}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          result.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          result.type === 'analysis' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          result.type === 'keyword' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions & Profile */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 max-h-[500px] overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${
                          notification.read 
                            ? 'border-transparent' 
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.read ? 'bg-gray-300' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {notification.title}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                        No new notifications
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        New notifications will appear here
                      </p>
                      
                      {/* Plan expiration warning model */}
                      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                          <Crown className="w-5 h-5" />
                          <span className="font-medium">Plan Status</span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          {(user?.role as string) === 'owner' 
                            ? '👑 Master Owner - Lifetime Access' 
                            : user?.subscription === 'pro' 
                              ? 'Pro Plan - Active' 
                              : 'Free Plan - Consider upgrading'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                )}
                {subscriptionBadge && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                    (user?.role as string) === 'owner' ? subscriptionBadge.color : subscriptionBadge.color
                  }`}>
                    <subscriptionBadge.icon className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'SEO Explorer'}
                </p>
                <p className={`text-xs font-semibold ${
                  (user?.role as string) === 'owner'
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : subscriptionBadge?.textColor || 'text-blue-600 dark:text-blue-400'
                }`}>
                  {(user?.role as string) === 'owner'
                    ? '👑 Master Owner' 
                    : subscriptionBadge 
                      ? subscriptionBadge.label 
                      : 'Pro Member'
                  }
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user ? getInitials(user.name) : 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'SEO Explorer'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || 'explorer@metalyz.io'}
                      </p>
                      {subscriptionBadge && (
                        <div className="flex items-center space-x-1 mt-1">
                          <subscriptionBadge.icon className="w-3 h-3 text-yellow-500" />
                          <span className={`text-xs font-bold ${
                            (user?.role as string) === 'owner'
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : subscriptionBadge.textColor || 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {(user?.role as string) === 'owner' ? '👑 Master Owner' : `${subscriptionBadge.label} Member`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Navigation moved to sidebar */}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}