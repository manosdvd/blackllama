// National Weather Service API Integration Utility
// Location: Camp Lawton, Mt. Lemmon, AZ (Coronado National Forest)
// Coordinates: 32.4440, -110.7873 (Approx. 7,900 feet elevation)

const LAT = "32.4440";
const LON = "-110.7873";
const USER_AGENT = "CampLawtonDashboard/1.0 (contact@catalinacouncil.org)";

// High-fidelity fallback data representative of summer mountain weather at Camp Lawton
export const MOCK_WEATHER_DATA = {
  current: {
    temperature: 78,
    temperatureUnit: "F",
    windSpeed: "12 mph",
    windDirection: "SW",
    shortForecast: "Partly Cloudy",
    detailedForecast: "Partly cloudy, with a comfortable high near 78°F. Southwest wind around 12 mph, with gusts as high as 22 mph.",
    icon: "https://api.weather.gov/icons/land/day/bkn,20?size=medium",
    relativeHumidity: 28,
    elevationFeet: 7900,
    observationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMock: true
  },
  forecast: [
    {
      name: "Today",
      temperature: 78,
      temperatureUnit: "F",
      windSpeed: "10 to 15 mph",
      windDirection: "SW",
      shortForecast: "Partly Cloudy",
      detailedForecast: "Sunny early, becoming partly cloudy by afternoon. Comfortable high near 78°F. Southwest wind around 12 mph.",
      icon: "https://api.weather.gov/icons/land/day/bkn,20?size=medium",
      isDaytime: true
    },
    {
      name: "Tonight",
      temperature: 54,
      temperatureUnit: "F",
      windSpeed: "5 to 10 mph",
      windDirection: "S",
      shortForecast: "Mostly Clear & Cool",
      detailedForecast: "Mostly clear and crisp, with a low around 54°F. Light South-Southwest wind 5 to 10 mph. Warm layers recommended.",
      icon: "https://api.weather.gov/icons/land/night/few?size=medium",
      isDaytime: false
    },
    {
      name: "Sunday",
      temperature: 81,
      temperatureUnit: "F",
      windSpeed: "8 to 12 mph",
      windDirection: "W",
      shortForecast: "Sunny & Pleasant",
      detailedForecast: "Beautiful, clear sunny sky with a high near 81°F. West wind 8 to 12 mph. Great day for shooting ranges and outdoor skills.",
      icon: "https://api.weather.gov/icons/land/day/skc?size=medium",
      isDaytime: true
    },
    {
      name: "Sunday Night",
      temperature: 56,
      temperatureUnit: "F",
      windSpeed: "5 to 8 mph",
      windDirection: "SE",
      shortForecast: "Clear",
      detailedForecast: "Clear skies and calm winds. Low around 56°F. Perfect night for stargazing or a campfire program.",
      icon: "https://api.weather.gov/icons/land/night/skc?size=medium",
      isDaytime: false
    },
    {
      name: "Monday",
      temperature: 75,
      temperatureUnit: "F",
      windSpeed: "12 to 18 mph",
      windDirection: "SW",
      shortForecast: "Chance Thunderstorms",
      detailedForecast: "A 30 percent chance of afternoon showers and thunderstorms, typical of Coronado Forest monsoons. High near 75°F. Wind gusts up to 25 mph near storms.",
      icon: "https://api.weather.gov/icons/land/day/tsra_sct,30?size=medium",
      isDaytime: true
    },
    {
      name: "Monday Night",
      temperature: 52,
      temperatureUnit: "F",
      windSpeed: "8 to 12 mph",
      windDirection: "WSW",
      shortForecast: "Slight Chance Rain",
      detailedForecast: "A slight chance of lingering showers before midnight. Mostly cloudy, with a low around 52°F.",
      icon: "https://api.weather.gov/icons/land/night/tsra_hi?size=medium",
      isDaytime: false
    },
    {
      name: "Tuesday",
      temperature: 76,
      temperatureUnit: "F",
      windSpeed: "10 to 15 mph",
      windDirection: "W",
      shortForecast: "Partly Sunny",
      detailedForecast: "Partly sunny and refreshing. High near 76°F. West wind 10 to 15 mph.",
      icon: "https://api.weather.gov/icons/land/day/sct?size=medium",
      isDaytime: true
    }
  ],
  alerts: [
    {
      event: "Red Flag Warning",
      severity: "Severe",
      headline: "Red Flag Warning in effect for Santa Catalina Mountains due to low humidity and high winds",
      description: "The National Weather Service has issued a Red Flag Warning for critical fire weather conditions. Wind gusts may exceed 25 mph with relative humidity dipping below 15%. This creates volatile fire behavior environments.",
      instruction: "Campers and leaders must adhere strictly to Coronado National Forest Fire Restriction protocols. No open wood or charcoal campfires are permitted. Gas stoves with on/off valves are allowed in designated campsites only.",
      id: "mock-rfw-1234"
    }
  ]
};

// Simple in-memory cache to prevent hitting NWS endpoint limits repeatedly
let cachedEndpoints = null;

async function getNwsEndpoints() {
  if (cachedEndpoints) return cachedEndpoints;
  
  const response = await fetch(`https://api.weather.gov/points/${LAT},${LON}`, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/ld+json"
    }
  });

  if (!response.ok) {
    throw new Error(`NWS points lookup failed: ${response.statusText}`);
  }

  const data = await response.json();
  cachedEndpoints = {
    forecastUrl: data.forecast,
    forecastHourlyUrl: data.forecastHourly,
    forecastGridDataUrl: data.forecastGridData,
    countyZoneUrl: data.county
  };
  return cachedEndpoints;
}

export async function fetchLiveWeatherData() {
  const startTime = Date.now();
  try {
    const endpoints = await getNwsEndpoints();

    // 1. Fetch daily forecast
    const forecastResponse = await fetch(endpoints.forecastUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
      }
    });

    if (!forecastResponse.ok) {
      throw new Error(`Forecast retrieval failed: HTTP ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    const periods = forecastData.properties.periods;

    if (!periods || periods.length === 0) {
      throw new Error("Empty forecast periods returned from NOAA");
    }

    // 2. Fetch current active alerts for coordinates
    const alertsResponse = await fetch(`https://api.weather.gov/alerts/active?point=${LAT},${LON}`, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
      }
    });

    let activeAlerts = [];
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json();
      if (alertsData.features) {
        activeAlerts = alertsData.features.map(feat => ({
          event: feat.properties.event,
          severity: feat.properties.severity,
          headline: feat.properties.headline,
          description: feat.properties.description,
          instruction: feat.properties.instruction,
          id: feat.properties.id || feat.id
        }));
      }
    }

    // Extract current metrics from the first period
    const currentPeriod = periods[0];
    const relativeHumidity = currentPeriod.relativeHumidity?.value || 30;
    const duration = Date.now() - startTime;

    return {
      current: {
        temperature: currentPeriod.temperature,
        temperatureUnit: currentPeriod.temperatureUnit || "F",
        windSpeed: currentPeriod.windSpeed,
        windDirection: currentPeriod.windDirection,
        shortForecast: currentPeriod.shortForecast,
        detailedForecast: currentPeriod.detailedForecast,
        icon: currentPeriod.icon,
        relativeHumidity: relativeHumidity,
        elevationFeet: 7900,
        observationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMock: false
      },
      forecast: periods.slice(0, 8), // Get next 8 periods (approx 4 days day/night)
      alerts: activeAlerts,
      syncInfo: {
        status: "success",
        timestamp: new Date().toLocaleString(),
        responseTimeMs: duration,
        origin: "National Weather Service (NOAA) API",
        pointsUrl: `https://api.weather.gov/points/${LAT},${LON}`,
        forecastUrl: endpoints.forecastUrl,
        alertsUrl: `https://api.weather.gov/alerts/active?point=${LAT},${LON}`,
        gridId: "TWC",
        gridCoords: "99, 57",
        rawMetadataJson: JSON.stringify({
          updated: forecastData.properties.updated,
          generatedAt: forecastData.properties.generatedAt,
          elevation: forecastData.properties.elevation,
          units: forecastData.properties.units,
          gridId: "TWC",
          gridX: 99,
          gridY: 57,
          periodsCount: periods.length,
          httpStatus: "200 OK",
          userAgent: USER_AGENT
        }, null, 2)
      }
    };

  } catch (error) {
    console.error("NWS API Fetch error. Live weather feed is unavailable.", error);
    throw new Error(`NOAA NWS API is unreachable: ${error.message}`);
  }
}
