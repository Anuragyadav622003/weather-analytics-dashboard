import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Settings as SettingsIcon, Trash2, RefreshCw } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { setRefreshInterval, removeCity, clearError } from '../store/weatherSlice';
import { generateCityKey } from '../utils/weatherUtils';

export const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWeather, favoriteCities, refreshInterval } = useSelector((state: RootState) => state.weather);

  const refreshIntervals = [
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
    { value: 900000, label: '15 minutes' },
    { value: 1800000, label: '30 minutes' },
  ];

  const handleRemoveCity = (cityKey: string) => {
    if (window.confirm('Are you sure you want to remove this city?')) {
      dispatch(removeCity(cityKey));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <SettingsIcon size={24} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Refresh Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw size={20} />
              Auto-Refresh Settings
            </h2>
            <p className="text-gray-600 mb-4">
              How often should we refresh weather data for your favorite cities?
            </p>
            <div className="space-y-3">
              {refreshIntervals.map((interval) => (
                <label key={interval.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="refreshInterval"
                    value={interval.value}
                    checked={refreshInterval === interval.value}
                    onChange={() => dispatch(setRefreshInterval(interval.value))}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{interval.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Manage Cities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Cities</h2>
            <p className="text-gray-600 mb-4">
              {Object.keys(currentWeather).length} cities in your dashboard
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.values(currentWeather).map((weather) => {
                const cityKey = generateCityKey(weather.location);
                const isFavorite = favoriteCities.includes(cityKey);
                
                return (
                  <div
                    key={cityKey}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {weather.location.name}, {weather.location.country}
                      </div>
                      <div className="text-sm text-gray-500">
                        {weather.location.region} • {isFavorite && '⭐ Favorite'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCity(cityKey)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove city"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">App Information</h3>
              <div className="space-y-1 text-gray-600">
                <div>Name: {import.meta.env.VITE_APP_NAME}</div>
                <div>Version: 1.0.0</div>
                <div>Data Provider: WeatherAPI.com</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                <li>Real-time weather data</li>
                <li>7-day forecasts</li>
                <li>Interactive charts</li>
                <li>Favorite cities</li>
                <li>Multiple temperature units</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};