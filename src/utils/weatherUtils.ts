import { ForecastData, ChartData, HourlyForecast, CurrentWeather } from '../types/weather';

// Temperature conversion
export const convertTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): number => {
  return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
};

// Weather icon handling
export const getWeatherIcon = (iconCode: string, size: number = 2): string => {
  return `https://cdn.weatherapi.com/weather/64x64/${iconCode}.png`;
};

// Time formatting
export const formatTime = (timeString: string): string => {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

// Weather calculations
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVIndexLevel = (uvIndex: number): { level: string; color: string; bgColor: string } => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100' };
  return { level: 'Extreme', color: 'text-purple-600', bgColor: 'bg-purple-100' };
};

export const getAqiLevel = (aqi: number): { level: string; color: string; bgColor: string } => {
  const levels = [
    { level: 'Good', color: 'text-green-600', bgColor: 'bg-green-100' },
    { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { level: 'Unhealthy for Sensitive', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { level: 'Unhealthy', color: 'text-red-600', bgColor: 'bg-red-100' },
    { level: 'Very Unhealthy', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { level: 'Hazardous', color: 'text-red-800', bgColor: 'bg-red-300' },
  ];
  return levels[aqi - 1] || levels[0];
};

export const calculateDewPoint = (temp: number, humidity: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
};

export const getVisibilityLevel = (vis: number): string => {
  if (vis >= 10) return 'Excellent';
  if (vis >= 5) return 'Good';
  if (vis >= 2) return 'Moderate';
  if (vis >= 1) return 'Poor';
  return 'Very Poor';
};

// Data processing for charts
export const processHourlyForecastData = (hourlyData: HourlyForecast[], unit: 'celsius' | 'fahrenheit'): ChartData[] => {
  return hourlyData.slice(0, 24).map(hour => ({
    time: formatTime(hour.time),
    temperature: Math.round(convertTemperature(hour.temp_c, unit)),
    humidity: hour.humidity,
    pressure: hour.pressure_mb,
    windSpeed: hour.wind_kph,
    precipitation: hour.chance_of_rain,
    uv: hour.uv,
    feelsLike: Math.round(convertTemperature(hour.feelslike_c, unit)),
  }));
};

export const processDailyForecastData = (forecastData: ForecastData, unit: 'celsius' | 'fahrenheit'): ChartData[] => {
  return forecastData.forecast.forecastday.map(day => ({
    time: formatDate(day.date),
    temperature: Math.round(convertTemperature(day.day.avgtemp_c, unit)),
    humidity: day.day.avghumidity,
    pressure: 1013,
    windSpeed: day.day.maxwind_kph,
    precipitation: day.day.totalprecip_mm,
    uv: day.day.uv,
    feelsLike: Math.round(convertTemperature(day.day.avgtemp_c, unit)),
  }));
};

// City key generation
export const generateCityKey = (location: { name: string; country: string }): string => {
  return `${location.name},${location.country}`;
};

// Weather condition to gradient mapping
export const getWeatherGradient = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return 'from-purple-600 via-blue-800 to-gray-900';
  }
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'from-blue-500 via-blue-600 to-blue-700';
  }
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    return 'from-blue-200 via-blue-300 to-blue-400';
  }
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return 'from-gray-400 via-gray-500 to-gray-600';
  }
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return 'from-gray-300 via-gray-400 to-gray-500';
  }
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return 'from-yellow-400 via-orange-500 to-red-500';
  }
  return 'from-sky-400 via-blue-500 to-indigo-600';
};

// Get appropriate weather icon based on condition
export const getConditionIcon = (condition: string, isDay: number = 1): string => {
  const conditionLower = condition.toLowerCase();
  const time = isDay ? 'day' : 'night';
  
  if (conditionLower.includes('thunder')) return '200';
  if (conditionLower.includes('storm')) return '230';
  if (conditionLower.includes('rain')) return '302';
  if (conditionLower.includes('snow')) return '338';
  if (conditionLower.includes('cloud')) return '119';
  if (conditionLower.includes('clear')) return time === 'day' ? '113' : '116';
  return '113';
};