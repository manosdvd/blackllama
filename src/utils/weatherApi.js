// National Weather Service API Integration Utility
// Location: Camp Lawton, Mt. Lemmon, AZ (Coronado National Forest)
// Coordinates: 32.4440, -110.7873 (Approx. 7,900 feet elevation)

const LAT = "32.4440";
const LON = "-110.7873";
const USER_AGENT = "CampLawtonDashboard/1.0 (contact@catalinacouncil.org)";

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
    const relativeHumidity = (currentPeriod.relativeHumidity && typeof currentPeriod.relativeHumidity.value === 'number') ? currentPeriod.relativeHumidity.value : null;
    const temperature = typeof currentPeriod.temperature === 'number' ? currentPeriod.temperature : null;
    const duration = Date.now() - startTime;

    return {
      current: {
        temperature: temperature,
        temperatureUnit: currentPeriod.temperatureUnit || null,
        windSpeed: currentPeriod.windSpeed || null,
        windDirection: currentPeriod.windDirection || null,
        shortForecast: currentPeriod.shortForecast || null,
        detailedForecast: currentPeriod.detailedForecast || null,
        icon: currentPeriod.icon || null,
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
