// API Configuration
// You can get free API keys from:
// 1. RapidAPI (API-Football): https://rapidapi.com/api-sports/api/api-football
// 2. Free API-FOOTBALL alternative: https://www.football-data.org/
// 3. For demo, using football-data.org which has a free tier

export const API_CONFIG = {
  // Football-Data.org - Free tier available
  // Get your key from: https://www.football-data.org/client/register
  FOOTBALL_DATA_API_KEY: 'YOUR_API_KEY_HERE', // Replace with your actual key
  FOOTBALL_DATA_BASE_URL: 'https://api.football-data.org/v4',
  
  // TheSportsDB - Free API
  THESPORTSDB_API_KEY: '3', // Free test key
  THESPORTSDB_BASE_URL: 'https://www.thesportsdb.com/api/v1/json',
  
  // Alternative: API-SPORTS (RapidAPI) - Requires subscription
  // RAPIDAPI_KEY: 'YOUR_RAPIDAPI_KEY',
  // RAPIDAPI_HOST: 'api-football-v1.p.rapidapi.com',
};

// For demonstration, we'll use a combination of:
// 1. football-data.org for Soccer (free tier: 10 requests/minute)
// 2. TheSportsDB for Cricket and Rugby
// 3. If APIs fail, we'll show proper error messages

export const USE_DEMO_MODE = true; // Set to false when you have API keys
