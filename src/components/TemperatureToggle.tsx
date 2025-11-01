import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTemperatureUnit } from '../store/weatherSlice';

export const TemperatureToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { temperatureUnit } = useSelector((state: RootState) => state.weather);

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => dispatch(setTemperatureUnit('celsius'))}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          temperatureUnit === 'celsius'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => dispatch(setTemperatureUnit('fahrenheit'))}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          temperatureUnit === 'fahrenheit'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        °F
      </button>
    </div>
  );
};