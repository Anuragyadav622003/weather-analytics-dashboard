import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Settings, 
  Home, 
  MapPin, 
  Sun, 
  Moon, 
  Monitor,
  Bell,
  RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTemperatureUnit, setTheme, refreshAll } from '../store/weatherSlice';
import { clsx } from 'clsx';

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { temperatureUnit, theme, lastUpdated } = useAppSelector((state) => state.weather);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch(refreshAll());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'auto' as const, icon: Monitor, label: 'Auto' },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cloud className="text-blue-500 dark:text-blue-400 w-8 h-8" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                v{import.meta.env.VITE_APP_VERSION}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Last Updated */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw size={14} />
              <span>
                Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isRefreshing 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              title="Refresh all data"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            {/* Theme Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => dispatch(setTheme(option.value))}
                    className={clsx(
                      'p-2 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                    title={`${option.label} theme`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>

            {/* Temperature Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => dispatch(setTemperatureUnit('celsius'))}
                className={clsx(
                  'px-3 py-1 rounded-lg font-medium transition-all duration-200',
                  temperatureUnit === 'celsius'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                °C
              </button>
              <button
                onClick={() => dispatch(setTemperatureUnit('fahrenheit'))}
                className={clsx(
                  'px-3 py-1 rounded-lg font-medium transition-all duration-200',
                  temperatureUnit === 'fahrenheit'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                °F
              </button>
            </div>

            {/* Current Time */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;