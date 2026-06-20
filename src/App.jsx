import React, { useState, useEffect } from "react";
import { 
  Flame, Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, 
  AlertTriangle, Compass, MapPin, Phone, Calendar, CheckSquare, 
  Square, Map as MapIcon, BookOpen, Info, Search, Menu, X, 
  Activity, ExternalLink, Thermometer, ShieldAlert, Layers, 
  RefreshCw, CheckCircle2, AlertOctagon, HelpCircle
} from "lucide-react";
import { fetchLiveWeatherData } from "./utils/weatherApi";

// Campsite Data
const CAMPSITES = [
  { id: "apache", name: "Apache", capacity: 24, shade: "High", platforms: true, poolDist: "Short (1 min)", features: ["Near Pool", "Permanent Platforms", "Shaded Canyon View"] },
  { id: "navajo", name: "Navajo", capacity: 28, shade: "High", platforms: true, poolDist: "Medium (3 mins)", features: ["Close to Dining Hall", "Under Pines", "Permanent Platforms"] },
  { id: "mohave", name: "Mohave", capacity: 20, shade: "Moderate", platforms: false, poolDist: "Medium (4 mins)", features: ["Near Main Restrooms", "Level Tent Pads", "Central Location"] },
  { id: "gila", name: "Gila", capacity: 16, shade: "High", platforms: false, poolDist: "Long (7 mins)", features: ["Rustic & Secluded", "Direct Trail Access", "Quiet Area"] },
  { id: "pima", name: "Pima", capacity: 32, shade: "Moderate", platforms: true, poolDist: "Medium (5 mins)", features: ["Largest Capacity", "Close to Campfire Ring", "Permanent Platforms"] },
  { id: "cochise", name: "Cochise", capacity: 24, shade: "Moderate", platforms: true, poolDist: "Long (6 mins)", features: ["Scenic Ridge View", "Near Archery Range", "Permanent Platforms"] },
  { id: "rotary", name: "Rotary", capacity: 30, shade: "High", platforms: false, poolDist: "Medium (3 mins)", features: ["Grassy Clearing", "Near Activity Field", "Historic Rotary Plaque"] },
  { id: "cabin-ridge", name: "Cabin Ridge", capacity: 12, shade: "High", platforms: false, poolDist: "Short (2 mins)", features: ["Electricity Access", "Log Cabins for Leaders", "Premium Comfort"] }
];

// Packing Checklist Data
const CHECKLIST_SECTIONS = {
  essentials: {
    title: "Scout Essentials",
    items: [
      "Pocketknife (Totin' Chip required)",
      "First aid kit (personal size)",
      "Reusable water bottle (1-2 quarts)",
      "Flashlight or headlamp (with fresh batteries)",
      "Matches or fire starter",
      "Trail food / snacks",
      "Sun protection (SPF 30+ sunglasses)",
      "Whistle (emergency signal)",
      "BSA Scout Handbook"
    ]
  },
  personal: {
    title: "Personal Gear & Bedding",
    items: [
      "Warm sleeping bag (comfort rated to 40°F)",
      "Sleeping pad (for insulation)",
      "Pillow (optional)",
      "Toiletry kit (toothbrush, paste, soap, comb)",
      "Towel and washcloth",
      "Insect repellent (non-aerosol)",
      "Personal medications (turned in at health lodge)",
      "Camp chair (folding, for campsite)"
    ]
  },
  clothing: {
    title: "Mountain Clothing",
    items: [
      "BSA Field Uniform (Class A) for dinner/campfires",
      "4-6 Scout t-shirts (Class B)",
      "2-3 pairs durable shorts",
      "2 pairs long pants (nights get cold!)",
      "6 pairs socks (moisture-wicking preferred)",
      "6 sets underwear",
      "Sturdy closed-toe hiking shoes/boots",
      "Extra sneakers (backup shoes)",
      "Warm sweater or fleece jacket (essential)",
      "Raincoat or poncho (afternoon storms)",
      "Swimsuit (for swimming pool sessions)"
    ]
  },
  unit: {
    title: "Unit & Leader Gear",
    items: [
      "BSA Medical Forms (Parts A, B, and C)",
      "Unit roster (printed copies)",
      "Campsite flag and rope",
      "Dutch oven / campfire cookware (optional)",
      "Lantern (gas or LED)",
      "Lockbox for unit funds and medications",
      "First aid kit (large unit size)",
      "Tarps and extension cords"
    ]
  }
};

// Daily Schedule Data
const SUMMER_SCHEDULE = {
  sunday: [
    { time: "1:00 PM - 3:00 PM", task: "Camp Arrival & Check-In", desc: "Welcome! Report to Dining Hall. Health checks, swim tests, and camp orientation tour." },
    { time: "3:30 PM", task: "Leader Meeting", desc: "Camp Commissioner meeting with Scoutmasters and SPLs in the Dining Hall." },
    { time: "5:45 PM", task: "Flag Lowering Ceremony", desc: "All units assemble at the main parade ground in Class A uniforms." },
    { time: "6:00 PM", task: "Dinner", desc: "Dinner at the Dining Hall (Orientation & Table Captain briefing)." },
    { time: "8:00 PM", task: "Opening Campfire Program", desc: "Join the staff at the campfire amphitheater for songs, skits, and high energy!" }
  ],
  weekday: [
    { time: "7:00 AM", task: "Reveille", desc: "Wake up! Prepare for the mountain air. Clean campsite." },
    { time: "7:45 AM", task: "Morning Flag Ceremony", desc: "Uniform assembly at the main field." },
    { time: "8:00 AM", task: "Breakfast", desc: "Dining Hall hot meal." },
    { time: "9:00 AM - 12:00 PM", task: "Morning Program Sessions", desc: "Merit Badge instruction at Shooting Sports, Pool, Ecology, Outdoor Skills, and Handicraft." },
    { time: "12:15 PM", task: "Lunch & Siesta", desc: "Dining Hall lunch. Mail call followed by quiet rest hour in campsites." },
    { time: "2:00 PM - 5:00 PM", task: "Afternoon Program Sessions", desc: "Merit badge continuations, open swimming, rifle shoots, nature hikes, and STEM activities." },
    { time: "5:45 PM", task: "Evening Flag Ceremony", desc: "Uniform assembly at parade ground." },
    { time: "6:00 PM", task: "Dinner", desc: "Dining Hall hot meal." },
    { time: "7:30 PM", task: "Twilight Activities", desc: "Free shoot, open swim, SPL meetings, scoutmaster coffee hour, and astronomy presentations." },
    { time: "10:00 PM", task: "Taps & Lights Out", desc: "Quiet hours begin. All Scouts in designated campsites." }
  ],
  saturday: [
    { time: "7:00 AM", task: "Reveille & Packing", desc: "Pack personal gear, clean campsite, check out unit locker." },
    { time: "8:00 AM", task: "Breakfast", desc: "Grab-and-go breakfast bags distributed at Dining Hall." },
    { time: "8:30 AM - 9:30 AM", task: "Campsite Inspection & Check-Out", desc: "Commissioner inspection of campsites for checkout approval. Collect unit medical packet." }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  
  // Campsite Finder Selection
  const [selectedCampsiteId, setSelectedCampsiteId] = useState("apache");
  const [campsiteFilter, setCampsiteFilter] = useState("all");

  // Leader's Guide States
  const [guideSubTab, setGuideSubTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [scheduleDay, setScheduleDay] = useState("weekday");

  // Responsive UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load weather from API on mount
  const refreshWeather = async () => {
    setLoadingWeather(true);
    setErrorWeather(null);
    try {
      const data = await fetchLiveWeatherData();
      setWeatherData(data);
      setActiveAlerts(data.alerts || []);
    } catch (err) {
      console.error("Failed to load live weather from NOAA:", err);
      setErrorWeather(err.message || "NOAA NWS API is currently unreachable.");
      setWeatherData(null);
      setActiveAlerts([]);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    refreshWeather();
  }, []);

  // Dynamic Fire Danger & Restrictions Calculation based on NOAA live metrics (Chandler Burning Index model)
  const getDynamicFireInfo = () => {
    if (errorWeather || !weatherData || loadingWeather) {
      return { level: "Unavailable", restriction: "Refer to official Coronado Forest notices", percent: 0 };
    }

    // Force Extreme if an active NWS warning mentions red flag or extreme fire weather
    const hasRedFlag = activeAlerts.some(alert => 
      alert.event.toLowerCase().includes("red flag") || 
      alert.event.toLowerCase().includes("fire weather")
    );

    if (hasRedFlag) {
      return { level: "Extreme", restriction: "Complete Campfire Ban", percent: 100 };
    }

    const tempF = weatherData.current.temperature;
    const rh = weatherData.current.relativeHumidity;
    
    if (tempF === null || rh === null || tempF === undefined || rh === undefined) {
      return { level: "Unavailable", restriction: "Live parameters (temperature/humidity) missing from NWS feed. Refer to official Coronado Forest notices.", percent: 0 };
    }
    
    // Chandler Burning Index calculation:
    const tempC = (tempF - 32) * 5 / 9;
    const cbi = (((110 - 1.37 * rh) * Math.pow(10, 0.06 * tempC)) / 10);

    let level = "Low";
    let restriction = "Standard Forest Restrictions";
    let percent = 20;

    if (cbi >= 97.5) {
      level = "Extreme";
      restriction = "Complete Campfire Ban";
      percent = 100;
    } else if (cbi >= 90) {
      level = "Very High";
      restriction = "Stage II Restrictions";
      percent = 85;
    } else if (cbi >= 75) {
      level = "High";
      restriction = "Stage I Restrictions";
      percent = 65;
    } else if (cbi >= 50) {
      level = "Moderate";
      restriction = "Stage I Restrictions";
      percent = 45;
    }

    return { level, restriction, percent };
  };

  const calculatedFire = getDynamicFireInfo();

  // Sync Checklist with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("camp_lawton_checklist");
    if (stored) {
      try {
        setCheckedItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse checklist states from local storage", e);
      }
    }
  }, []);

  const toggleChecklistItem = (item) => {
    const newChecked = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(newChecked);
    localStorage.setItem("camp_lawton_checklist", JSON.stringify(newChecked));
  };

  const clearChecklist = () => {
    if (window.confirm("Are you sure you want to reset your packing checklist progress?")) {
      setCheckedItems({});
      localStorage.removeItem("camp_lawton_checklist");
    }
  };

  // Helper: calculate total checked percentage
  const getChecklistStats = () => {
    let total = 0;
    let checked = 0;
    Object.values(CHECKLIST_SECTIONS).forEach(sec => {
      sec.items.forEach(item => {
        total++;
        if (checkedItems[item]) checked++;
      });
    });
    return {
      total,
      checked,
      percent: Math.round((checked / total) * 100) || 0
    };
  };

  const checklistStats = getChecklistStats();

  // Helper: search leader guide content
  const performSearch = () => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    const results = [];

    // Search Campsites
    CAMPSITES.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.features.some(f => f.toLowerCase().includes(query))) {
        results.push({
          type: "Campsite",
          title: `Campsite: ${c.name}`,
          snippet: `Capacity: ${c.capacity} campers. Highlights: ${c.features.join(", ")}. Proximity to pool: ${c.poolDist}.`,
          action: () => {
            setActiveTab("campsites");
            setSelectedCampsiteId(c.id);
            setSearchQuery("");
          }
        });
      }
    });

    // Search Checklist
    Object.keys(CHECKLIST_SECTIONS).forEach(secKey => {
      const sec = CHECKLIST_SECTIONS[secKey];
      sec.items.forEach(item => {
        if (item.toLowerCase().includes(query)) {
          results.push({
            type: "Packing List",
            title: `Item: ${item}`,
            snippet: `Found in "${sec.title}" packing list category.`,
            action: () => {
              setActiveTab("guide");
              setGuideSubTab("checklist");
              setSearchQuery("");
            }
          });
        }
      });
    });

    // Search Schedule
    Object.keys(SUMMER_SCHEDULE).forEach(dayKey => {
      const day = SUMMER_SCHEDULE[dayKey];
      day.forEach(slot => {
        if (slot.task.toLowerCase().includes(query) || slot.desc.toLowerCase().includes(query)) {
          results.push({
            type: "Schedule",
            title: `Event: ${slot.task} (${dayKey.toUpperCase()})`,
            snippet: `${slot.time} - ${slot.desc}`,
            action: () => {
              setActiveTab("guide");
              setGuideSubTab("schedule");
              setScheduleDay(dayKey === "sunday" || dayKey === "saturday" ? dayKey : "weekday");
              setSearchQuery("");
            }
          });
        }
      });
    });

    // Search Health & Safety Text
    const healthSafetyPoints = [
      { t: "Dehydration & Altitude", d: "Camp Lawton is at 7,900 ft elevation. Drink at least 1 liter of water per hour of outdoor activity." },
      { t: "Bear Awareness", d: "Store all food, scent items, and trash in lockboxes or troop trailers. Do not eat inside tents." },
      { t: "Rattlesnakes & Wildlife", d: "Always use buddy system. Watch your step in rocks, and never reach where you can't see." },
      { t: "Weather Safety & Lightning", d: "During thunderstorms, vacate the swimming pool and shooting ranges immediately. Gather in the Dining Hall." }
    ];
    healthSafetyPoints.forEach(pt => {
      if (pt.t.toLowerCase().includes(query) || pt.d.toLowerCase().includes(query)) {
        results.push({
          type: "Health & Safety",
          title: pt.t,
          snippet: pt.d,
          action: () => {
            setActiveTab("guide");
            setGuideSubTab("safety");
            setSearchQuery("");
          }
        });
      }
    });

    return results;
  };

  const searchResults = performSearch();

  // Filter Campsites based on tab selection
  const filteredCampsites = CAMPSITES.filter(c => {
    if (campsiteFilter === "high-cap") return c.capacity >= 28;
    if (campsiteFilter === "near-pool") return c.poolDist.includes("1 min") || c.poolDist.includes("2 mins");
    if (campsiteFilter === "platforms") return c.platforms;
    return true;
  });

  const selectedCampsite = CAMPSITES.find(c => c.id === selectedCampsiteId) || CAMPSITES[0];

  return (
    <div className="app-container">
      {/* Sidebar - Desktop Layout */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/cl-logo-1x1.png" 
            alt="Camp Lawton Logo" 
            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }} 
          />
          <div className="sidebar-logo-text">
            <h2>CAMP LAWTON</h2>
            <p>Catalina Council, BSA</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div 
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            id="nav-dashboard"
          >
            <Layers className="w-5 h-5" />
            Dashboard Hub
          </div>
          <div 
            onClick={() => { setActiveTab("weather"); setMobileMenuOpen(false); }} 
            className={`nav-item ${activeTab === "weather" ? "active" : ""}`}
            id="nav-weather"
          >
            <Sun className="w-5 h-5" />
            Live Weather Hub
          </div>
          <div 
            onClick={() => { setActiveTab("campsites"); setMobileMenuOpen(false); }} 
            className={`nav-item ${activeTab === "campsites" ? "active" : ""}`}
            id="nav-campsites"
          >
            <MapIcon className="w-5 h-5" />
            Campsite Finder
          </div>
          <div 
            onClick={() => { setActiveTab("guide"); setMobileMenuOpen(false); }} 
            className={`nav-item ${activeTab === "guide" ? "active" : ""}`}
            id="nav-guide"
          >
            <BookOpen className="w-5 h-5" />
            Leader's Guide
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-contact-card">
            <strong>Catalina Council Office</strong>
            <p>Phone: 520.750.0385</p>
            <p>Mt. Lemmon, AZ (7,900 ft)</p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/cl-logo-1x1.png" 
            alt="Camp Lawton Logo" 
            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)' }} 
          />
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '18px' }}>CAMP LAWTON</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--color-text)' }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Top Info Bar */}
        <div className="status-bar">
          <div className="page-title">
            <h1>
              {activeTab === "dashboard" && "Leader & Attendee Hub"}
              {activeTab === "weather" && "Live Mountain Weather"}
              {activeTab === "campsites" && "Interactive Campsite Finder"}
              {activeTab === "guide" && "Interactive Leader's Guide"}
            </h1>
            <p>Mount Lemmon, Coronado National Forest | Elevation 7,900 ft</p>
          </div>

          <div className="meta-stats">
            <span className="stat-badge" style={{ borderColor: errorWeather ? "rgba(239, 68, 68, 0.3)" : weatherData?.syncInfo?.status === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: errorWeather ? 'var(--color-danger)' : weatherData?.syncInfo?.status === "success" ? 'var(--color-success)' : 'var(--color-warning)' }}></span>
              Sync: {errorWeather ? "OFFLINE" : loadingWeather ? "SYNCING" : "LIVE"}
            </span>
            <span className="stat-badge camp-open">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-success"></span>
              Camp Open
            </span>
            <span className="stat-badge">
              <Layers className="w-4 h-4 text-primary" />
              7,900 ft
            </span>
            <button 
              onClick={refreshWeather} 
              className="stat-badge" 
              style={{ cursor: "pointer", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.03)", display: 'flex', gap: '6px', alignItems: 'center' }}
              title="Refresh Live Weather"
              aria-label="Refresh Weather Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? "animate-spin" : ""}`} />
              Sync
            </button>
          </div>
        </div>

        {/* Global Warning Banner if Severe Weather Alert exists */}
        {activeAlerts.length > 0 && (
          <div className="alert-banner">
            <AlertTriangle className="alert-banner-icon w-6 h-6" />
            <div className="alert-banner-content">
              <h4>Active Forest Weather Warning: {activeAlerts[0].event}</h4>
              <p>{activeAlerts[0].headline}</p>
              <span className="alert-banner-action" onClick={() => setActiveTab("weather")}>
                View warning safety directives & details &rarr;
              </span>
            </div>
          </div>
        )}

        {/* Main Search Panel - display results inline if user typed something */}
        <div style={{ marginBottom: "24px" }}>
          <div className="guide-search-wrapper">
            <Search className="guide-search-icon w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search campsites, packing items, schedules, safety guidelines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="guide-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Render Search Results Overlay if search exists */}
        {searchQuery ? (
          <div className="glass-panel animate-fade-in" style={{ minHeight: "300px" }}>
            <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "16px" }}>
              Search Results ({searchResults?.length || 0})
            </h3>
            {searchResults && searchResults.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {searchResults.map((res, index) => (
                  <div 
                    key={index} 
                    onClick={res.action}
                    className="glass-card-interactive" 
                    style={{ borderLeft: "3px solid var(--color-primary)" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <h4 style={{ fontWeight: 700, color: "var(--color-text-bright)" }}>{res.title}</h4>
                      <span className="campsite-badge">{res.type}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{res.snippet}</p>
                    <span style={{ fontSize: "11px", color: "var(--color-primary-light)", display: "block", marginTop: "8px", fontWeight: "600" }}>
                      Click to navigate to this section &rarr;
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">
                <HelpCircle className="w-12 h-12 text-muted" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                No results match your query. Try searching for terms like "cook", "bear", "bag", "pool", "rifle", or specific campsite names.
              </div>
            )}
          </div>
        ) : (
          /* OTHERWISE RENDER SELECTED TAB PANELS */
          <>
            {/* 1. DASHBOARD HUB VIEW */}
            {activeTab === "dashboard" && (
              <div className="animate-slide-up">
                {/* Hero Banner Image */}
                <div className="hero-banner-card">
                  <div className="hero-banner-overlay">
                    <h2>Welcome to Camp Lawton</h2>
                    <p>Catalina Council property serving Scouting America on Mount Lemmon in the Coronado National Forest.</p>
                  </div>
                </div>

                 <div className="dashboard-grid">
                  {loadingWeather ? (
                    <div className="glass-panel weather-primary-widget" style={{ gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "220px" }}>
                      <div style={{ textAlign: "center" }}>
                        <RefreshCw className="w-10 h-10 animate-spin text-primary" style={{ margin: "0 auto 12px" }} />
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>Establishing Live NOAA Connection...</p>
                      </div>
                    </div>
                  ) : errorWeather ? (
                    <div className="glass-panel weather-primary-widget" style={{ gridColumn: "span 2", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", gridColumn: "span 2" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-danger)" }}>
                          <AlertOctagon className="w-8 h-8" />
                          <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700 }}>NOAA Telemetry Connection Failure</h3>
                        </div>
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                          This dashboard is configured for real live data only. The connection to the National Weather Service (weather.gov) coordinates lookup has failed or is currently offline.
                        </p>
                        <div style={{ padding: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px", fontSize: "12px", color: "var(--color-danger)", fontFamily: "monospace" }}>
                          Error: {errorWeather}
                        </div>
                        <button 
                          onClick={refreshWeather}
                          className="admin-btn active"
                          style={{ alignSelf: "flex-start", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry Live Sync
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Weather Overview Widget */}
                      <div className="glass-panel weather-primary-widget">
                        <div className="weather-dial-container">
                          <img 
                            src={weatherData?.current.icon} 
                            alt={weatherData?.current.shortForecast} 
                            className="weather-icon-giant"
                          />
                          <div className="weather-temp-giant">
                            {weatherData?.current.temperature !== null && weatherData?.current.temperature !== undefined ? (
                              <>{weatherData.current.temperature}<span>°F</span></>
                            ) : (
                              "Unavailable"
                            )}
                          </div>
                          <span className="weather-condition-text">{weatherData?.current.shortForecast || "Unavailable"}</span>
                          <span style={{ fontSize: "10px", color: "var(--color-success)", marginTop: "4px", background: "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: "10px" }}>
                            Synced: {weatherData?.syncInfo?.timestamp ? weatherData.syncInfo.timestamp.split(', ')[1] : "OK"}
                          </span>
                          <a 
                            href="https://weather.gov" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: "11px", color: "var(--color-primary-light)", marginTop: "8px", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "2px" }}
                          >
                            Source: NWS NOAA
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <div className="weather-details-grid">
                          <div className="weather-detail-item">
                            <div className="weather-detail-icon"><Wind className="w-5 h-5" /></div>
                            <div className="weather-detail-info">
                              <p>Wind Speed</p>
                              <h5>{weatherData?.current.windSpeed ? `${weatherData.current.windSpeed} (${weatherData.current.windDirection || ""})` : "Unavailable"}</h5>
                            </div>
                          </div>
                          <div className="weather-detail-item">
                            <div className="weather-detail-icon"><Droplets className="w-5 h-5" /></div>
                            <div className="weather-detail-info">
                              <p>Humidity</p>
                              <h5>{weatherData?.current.relativeHumidity !== null && weatherData?.current.relativeHumidity !== undefined ? `${weatherData.current.relativeHumidity}%` : "Unavailable"}</h5>
                            </div>
                          </div>
                          <div className="weather-detail-item">
                            <div className="weather-detail-icon"><Thermometer className="w-5 h-5" /></div>
                            <div className="weather-detail-info">
                              <p>Cool Factor</p>
                              <h5>{weatherData?.current.temperature !== null && weatherData?.current.temperature !== undefined ? "~22°F Cooler" : "Unavailable"}</h5>
                            </div>
                          </div>
                          <div className="weather-detail-item">
                            <div className="weather-detail-icon"><Layers className="w-5 h-5" /></div>
                            <div className="weather-detail-info">
                              <p>Observation</p>
                              <h5>{weatherData?.current.observationTime}</h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fire Danger Widget */}
                      <div className="glass-panel fire-danger-card">
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontFamily: "var(--font-title)" }}>Forest Fire Risk</h3>
                            <Flame className={`w-5 h-5 ${calculatedFire.level === "Extreme" ? "animate-pulse" : ""}`} style={{ color: "var(--color-primary)" }} />
                          </div>
                          
                          <div className="fire-danger-badge-container">
                            <span className={`fire-indicator-light bg-level-${calculatedFire.level.toLowerCase().replace(" ", "-")}`}></span>
                            <h4 className={`fire-danger-level-name level-${calculatedFire.level.toLowerCase().replace(" ", "-")}`}>
                              {calculatedFire.level} Danger
                            </h4>
                          </div>

                          <div className="gauge-track">
                            <div 
                              className="gauge-fill"
                              style={{
                                width: `${calculatedFire.percent}%`,
                                background: calculatedFire.level === "Low" || calculatedFire.level === "Moderate" ? "var(--color-success)" : calculatedFire.level === "High" ? "var(--color-warning)" : calculatedFire.level === "Very High" ? "var(--color-primary)" : "var(--color-danger)"
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="fire-restrictions-box">
                          <h6>Current Protocol: {calculatedFire.restriction}</h6>
                          <p>
                            {calculatedFire.level === "Low" && "Low wildfire danger. Standard Coronado National Forest campfire guidelines apply."}
                            {calculatedFire.level === "Moderate" && "Moderate fire weather conditions. Campfires permitted in designated steel/concrete fire rings only."}
                            {calculatedFire.level === "High" && "Campfires permitted only in designated campsite fire rings. Spark screens must remain closed."}
                            {calculatedFire.level === "Very High" && "Strict fire restrictions in place. Campfires permitted in concrete rings ONLY from 6 PM to 10 PM. No charcoal grills."}
                            {calculatedFire.level === "Extreme" && "ALL OPEN FIRES PROHIBITED. Only gas camp stoves with on/off safety valves are permitted. Keep shovel & extinguisher nearby."}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Info Strip */}
                <div className="info-strip-grid">
                  <div className="glass-panel info-strip-card">
                    <div className="info-strip-icon-box"><Phone className="w-6 h-6" /></div>
                    <div className="info-strip-details">
                      <h5>Emergency Frequencies</h5>
                      <p>Family Radio Service (FRS) Ch. 5</p>
                      <p>Mt. Lemmon Fire District: 911</p>
                    </div>
                  </div>

                  <div className="glass-panel info-strip-card">
                    <div className="info-strip-icon-box"><CheckSquare className="w-6 h-6" /></div>
                    <div className="info-strip-details">
                      <h5>Packing Readiness</h5>
                      <p>{checklistStats.percent}% Packed ({checklistStats.checked}/{checklistStats.total} items)</p>
                      <div className="gauge-track" style={{ width: "120px", marginTop: "4px" }}>
                        <div className="gauge-fill" style={{ width: `${checklistStats.percent}%`, background: "var(--color-success)" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel info-strip-card">
                    <div className="info-strip-icon-box"><Activity className="w-6 h-6" /></div>
                    <div className="info-strip-details">
                      <h5>High Elevation Safety</h5>
                      <p>Elevation 7,900 ft limits breathing</p>
                      <p>Rule: Hydrate 1 liter water per hour</p>
                    </div>
                  </div>
                </div>

                {/* Resource Links / Secondary grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="responsive-split">
                  <div className="glass-panel">
                    <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "16px" }}>Attendee Fast Actions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <a href="https://catalinacouncil.org/" target="_blank" rel="noopener noreferrer" className="nav-item" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <ExternalLink className="w-4 h-4 text-primary" />
                        Catalina Council Portal
                      </a>
                      <a href="https://scoutingevent.com/" target="_blank" rel="noopener noreferrer" className="nav-item" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <ExternalLink className="w-4 h-4 text-primary" />
                        Reserve Campsite (Black Pug)
                      </a>
                      <div 
                        onClick={() => { setActiveTab("guide"); setGuideSubTab("checklist"); }}
                        className="nav-item" 
                        style={{ background: "rgba(255,122,0,0.05)", borderColor: "rgba(255,122,0,0.15)" }}
                      >
                        <CheckSquare className="w-4 h-4 text-primary" />
                        Open My Packing Checklist ({checklistStats.total - checklistStats.checked} left)
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "10px" }}>Leader Check-In Protocol</h3>
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                        Troops must arrive on Sunday between 1:00 PM and 3:00 PM. Have all BSA Medical Forms (Parts A, B, and C) completed and organized alphabetically in a single binder for the Health Lodge review.
                      </p>
                    </div>
                    <button 
                      onClick={() => { setActiveTab("guide"); setGuideSubTab("overview"); }}
                      className="admin-btn active"
                      style={{ marginTop: "16px", padding: "10px", width: "100%", borderRadius: "8px", fontSize: "13px" }}
                    >
                      Read Detailed Check-In Guide
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WEATHER HUB VIEW */}
            {activeTab === "weather" && (
              <div className="animate-slide-up">
                <div className="glass-panel" style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-title)" }}>National Weather Service Live Feed</h3>
                      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        Live meteorological feeds synced from <a href="https://weather.gov" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary-light)", textDecoration: "underline" }}>National Weather Service (NOAA)</a>
                      </p>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                      Station: Coronado National Forest (AZZ150)
                    </span>
                  </div>
                  
                  {loadingWeather ? (
                    <div style={{ padding: "60px 0", textAlign: "center" }}>
                      <RefreshCw className="w-10 h-10 animate-spin text-primary" style={{ margin: "0 auto 12px" }} />
                      <p>Fetching real-time weather metrics from weather.gov...</p>
                    </div>
                  ) : errorWeather ? (
                    <div style={{ padding: "40px", textAlign: "center", border: "1px dashed rgba(239, 68, 68, 0.3)", borderRadius: "12px", background: "rgba(239,68,68,0.02)" }}>
                      <AlertOctagon className="w-16 h-16 text-danger" style={{ margin: "0 auto 16px" }} />
                      <h4 style={{ fontFamily: "var(--font-title)", fontSize: "20px", color: "var(--color-text-bright)", marginBottom: "8px" }}>Live NOAA Connection Error</h4>
                      <p style={{ fontSize: "14px", color: "var(--color-text-muted)", maxWidth: "500px", margin: "0 auto 16px", lineHeight: 1.5 }}>
                        Could not synchronize with weather.gov grid services. This dashboard requires real live data and will not display offline mock variables.
                      </p>
                      <div style={{ padding: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px", fontSize: "12px", color: "var(--color-danger)", fontFamily: "monospace", display: "inline-block", textAlign: "left", marginBottom: "16px" }}>
                        Error Detail: {errorWeather}
                      </div>
                      <div>
                        <button 
                          onClick={refreshWeather}
                          className="admin-btn active"
                          style={{ margin: "0 auto", display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry Live Sync
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="weather-primary-widget" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "24px" }}>
                        <div className="weather-dial-container">
                          <img src={weatherData?.current.icon} alt="Forecast icon" className="weather-icon-giant" />
                          <div className="weather-temp-giant">
                            {weatherData?.current.temperature !== null && weatherData?.current.temperature !== undefined ? (
                              <>{weatherData.current.temperature}<span>°F</span></>
                            ) : (
                              "Unavailable"
                            )}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: "16px" }}>{weatherData?.current.shortForecast || "Unavailable"}</span>
                        </div>
                        <div>
                          <h4 style={{ color: "var(--color-primary-light)", marginBottom: "8px", fontWeight: "600" }}>Current Detailed Forecast</h4>
                          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-muted)" }}>
                            {weatherData?.current.detailedForecast || "Unavailable"}
                          </p>
                          
                          <div className="weather-details-grid" style={{ marginTop: "20px" }}>
                            <div className="weather-detail-item">
                              <Wind className="text-primary w-4 h-4" />
                              <div>
                                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Wind</span>
                                <h6 style={{ fontSize: "13px" }}>{weatherData?.current.windSpeed ? `${weatherData.current.windSpeed} ${weatherData.current.windDirection || ""}` : "Unavailable"}</h6>
                              </div>
                            </div>
                            <div className="weather-detail-item">
                              <Droplets className="text-primary w-4 h-4" />
                              <div>
                                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Humidity</span>
                                <h6 style={{ fontSize: "13px" }}>{weatherData?.current.relativeHumidity !== null && weatherData?.current.relativeHumidity !== undefined ? `${weatherData.current.relativeHumidity}%` : "Unavailable"}</h6>
                              </div>
                            </div>
                            <div className="weather-detail-item">
                              <Thermometer className="text-primary w-4 h-4" />
                              <div>
                                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Camp Temp Diff</span>
                                <h6 style={{ fontSize: "13px" }}>~22°F Cooler than Tucson</h6>
                              </div>
                            </div>
                            <div className="weather-detail-item">
                              <Layers className="text-primary w-4 h-4" />
                              <div>
                                <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Observation Time</span>
                                <h6 style={{ fontSize: "13px" }}>{weatherData?.current.observationTime}</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Extended Forecast Grid */}
                      <h4 style={{ fontFamily: "var(--font-title)", marginTop: "24px", marginBottom: "12px", color: "var(--color-text-bright)" }}>
                        5-Day Extended Forecast (Mt. Lemmon Ridge)
                      </h4>
                      <div className="weather-forecast-grid">
                        {weatherData?.forecast.map((f, i) => (
                          <div key={i} className="glass-card-interactive forecast-card">
                            <span className="forecast-day-name">{f.name}</span>
                            <img src={f.icon} alt={f.shortForecast} className="forecast-icon" />
                            <span className="forecast-temp">{f.temperature}°{f.temperatureUnit || "F"}</span>
                            <span className="forecast-desc">{f.shortForecast}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!errorWeather && weatherData && (
                  <>
                    {/* Live NOAA Sync & API Verification Control Panel */}
                    <div className="glass-panel" style={{ marginBottom: "24px", marginTop: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-title)" }}>NOAA Live Sync Verification</h3>
                          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            Verify the live government telemetry and sync statuses for Mt. Lemmon.
                          </p>
                        </div>
                        <button 
                          onClick={refreshWeather}
                          className="admin-btn active"
                          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px" }}
                          disabled={loadingWeather}
                        >
                          <RefreshCw className={`w-4 h-4 ${loadingWeather ? "animate-spin" : ""}`} />
                          Sync Live Data Now
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }} className="responsive-split">
                        <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "16px" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>Sync Pipeline Diagnostics</h4>
                          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                            <tbody>
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "8px 0", color: "var(--color-text-muted)" }}>Coordinates</td>
                                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>32.4440° N, 110.7873° W</td>
                              </tr>
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "8px 0", color: "var(--color-text-muted)" }}>Source Server</td>
                                <td style={{ padding: "8px 0", textAlign: "right" }}>
                                  {weatherData?.syncInfo?.status === "success" ? (
                                    <span style={{ color: "var(--color-success)", fontWeight: "700" }}>● api.weather.gov (NOAA)</span>
                                  ) : (
                                    <span style={{ color: "var(--color-warning)", fontWeight: "700" }}>● Offline Fallback Mode</span>
                                  )}
                                </td>
                              </tr>
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "8px 0", color: "var(--color-text-muted)" }}>Last Synced</td>
                                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>{weatherData?.syncInfo?.timestamp || new Date().toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: "8px 0", color: "var(--color-text-muted)" }}>API Response Time</td>
                                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>{weatherData?.syncInfo?.responseTimeMs || "0"} ms</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "16px" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>Origin API Feeds</h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                            <p style={{ color: "var(--color-text-muted)", fontSize: "12px", marginBottom: "4px" }}>
                              Click below to inspect the government JSON streams directly from NOAA to verify the data is authentic:
                            </p>
                            <a 
                              href={weatherData?.syncInfo?.pointsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: "var(--color-primary)", textDecoration: "underline", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              1. Raw NWS Location Grid Lookup
                            </a>
                            <a 
                              href={weatherData?.syncInfo?.status === "success" ? weatherData.syncInfo.forecastUrl : "https://api.weather.gov/gridpoints/TWC/99,57/forecast"} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: "var(--color-primary)", textDecoration: "underline", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              2. Raw Live Forecast Feed (JSON)
                            </a>
                            <a 
                              href={weatherData?.syncInfo?.alertsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: "var(--color-primary)", textDecoration: "underline", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              3. Raw Active Warnings Feed
                            </a>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <button 
                          onClick={() => {
                            const pre = document.getElementById("nws-raw-pre");
                            if (pre) pre.style.display = pre.style.display === "none" ? "block" : "none";
                          }}
                          className="admin-btn"
                          style={{ fontSize: "12px" }}
                        >
                          Toggle Detailed Response Payload Metadata
                        </button>
                        <pre 
                          id="nws-raw-pre" 
                          style={{ 
                            display: "none", 
                            marginTop: "12px", 
                            padding: "12px", 
                            background: "#030712", 
                            border: "1px solid var(--border-glass)", 
                            borderRadius: "6px", 
                            fontSize: "11px", 
                            overflowX: "auto",
                            color: "#34d399",
                            maxHeight: "150px"
                          }}
                        >
                          {weatherData?.syncInfo?.rawMetadataJson || "// Metadata not loaded"}
                        </pre>
                      </div>
                    </div>

                    {/* Active Alerts Panel */}
                    <div className="glass-panel">
                      <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "16px" }}>
                        Active Severe Weather Alerts & Watches ({activeAlerts.length})
                      </h3>
                      {activeAlerts.length > 0 ? (
                        <div className="weather-alerts-container">
                          {activeAlerts.map((alert) => (
                            <div key={alert.id} className="glass-card-interactive weather-alert-card warning">
                              <div className="weather-alert-header">
                                <h4>{alert.event}</h4>
                                <span className="severity-badge">{alert.severity} Severity</span>
                              </div>
                              <p className="weather-alert-desc"><strong>Headline:</strong> {alert.headline}</p>
                              <p className="weather-alert-desc"><strong>Description:</strong> {alert.description}</p>
                              {alert.instruction && (
                                <div className="weather-alert-instruction">
                                  <strong>Directives for Leaders:</strong> {alert.instruction}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: "30px", color: "var(--color-text-muted)" }}>
                          <CheckCircle2 className="w-12 h-12 text-success" style={{ margin: "0 auto 12px" }} />
                          <p>No severe meteorological watches, warnings, or red flag advisories are currently active for the Santa Catalina Ranger District coordinates.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 3. CAMPSITE FINDER VIEW */}
            {activeTab === "campsites" && (
              <div className="animate-slide-up">
                <div className="filter-bar">
                  <button onClick={() => setCampsiteFilter("all")} className={`filter-btn ${campsiteFilter === "all" ? "active" : ""}`}>All Campsites</button>
                  <button onClick={() => setCampsiteFilter("high-cap")} className={`filter-btn ${campsiteFilter === "high-cap" ? "active" : ""}`}>High Capacity (28+)</button>
                  <button onClick={() => setCampsiteFilter("near-pool")} className={`filter-btn ${campsiteFilter === "near-pool" ? "active" : ""}`}>Near Pool (&lt; 2 min)</button>
                  <button onClick={() => setCampsiteFilter("platforms")} className={`filter-btn ${campsiteFilter === "platforms" ? "active" : ""}`}>Premium Platform Decks</button>
                </div>

                <div className="campsite-finder-container">
                  {/* Left Column: Interactive SVG Map */}
                  <div className="campsite-map-interactive">
                    <div className="svg-map-wrapper">
                      <svg viewBox="0 0 400 350" width="100%" height="auto" style={{ background: "transparent" }}>
                        {/* Styled Topography Map Grid Background */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Topo lines representation */}
                        <path d="M-10,80 Q100,50 200,120 T420,110" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="2" />
                        <path d="M-20,170 Q130,120 220,190 T420,200" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="2" />
                        <path d="M-10,260 Q110,240 240,290 T420,280" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="2" />

                        {/* Main Camp Organization Ridge Road */}
                        <path 
                          d="M 40 310 Q 150 250 220 150 T 360 40" 
                          fill="none" 
                          stroke="rgba(255,122,0,0.15)" 
                          strokeWidth="6" 
                          strokeDasharray="6 4"
                          id="camp-road"
                        />
                        <text x="50" y="325" fill="var(--color-text-muted)" fontSize="8" transform="rotate(-15 50 325)">Organization Ridge Rd</text>

                        {/* Landmarks */}
                        {/* Pool Landmark */}
                        <rect x="75" y="195" width="24" height="18" fill="rgba(59,130,246,0.2)" stroke="var(--color-info)" strokeWidth="1" rx="2" />
                        <text x="87" y="207" fill="var(--color-info)" fontSize="7" fontWeight="bold" textAnchor="middle">POOL</text>

                        {/* Dining Hall Landmark */}
                        <rect x="180" y="110" width="30" height="20" fill="rgba(16,185,129,0.2)" stroke="var(--color-success)" strokeWidth="1" rx="2" />
                        <text x="195" y="122" fill="var(--color-success)" fontSize="7" fontWeight="bold" textAnchor="middle">DINING</text>

                        {/* Shooting Ranges Landmark */}
                        <polygon points="310,90 330,80 320,105" fill="rgba(245,158,11,0.15)" stroke="var(--color-warning)" strokeWidth="1" />
                        <text x="320" y="115" fill="var(--color-warning)" fontSize="7" fontWeight="bold" textAnchor="middle">RANGES</text>

                        {/* Campsite Nodes */}
                        {/* Apache */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "apache" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "apache") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("apache")}
                          transform="translate(85, 235)"
                        >
                          <circle r="12" />
                          <text y="3">AP</text>
                        </g>

                        {/* Navajo */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "navajo" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "navajo") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("navajo")}
                          transform="translate(145, 175)"
                        >
                          <circle r="12" />
                          <text y="3">NV</text>
                        </g>

                        {/* Mohave */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "mohave" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "mohave") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("mohave")}
                          transform="translate(195, 185)"
                        >
                          <circle r="12" />
                          <text y="3">MH</text>
                        </g>

                        {/* Gila */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "gila" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "gila") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("gila")}
                          transform="translate(290, 165)"
                        >
                          <circle r="12" />
                          <text y="3">GL</text>
                        </g>

                        {/* Pima */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "pima" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "pima") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("pima")}
                          transform="translate(250, 205)"
                        >
                          <circle r="12" />
                          <text y="3">PM</text>
                        </g>

                        {/* Cochise */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "cochise" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "cochise") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("cochise")}
                          transform="translate(320, 60)"
                        >
                          <circle r="12" />
                          <text y="3">CH</text>
                        </g>

                        {/* Rotary */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "rotary" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "rotary") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("rotary")}
                          transform="translate(115, 115)"
                        >
                          <circle r="12" />
                          <text y="3">RT</text>
                        </g>

                        {/* Cabin Ridge */}
                        <g 
                          className={`campsite-node ${selectedCampsiteId === "cabin-ridge" ? "selected" : ""} ${filteredCampsites.some(c => c.id === "cabin-ridge") ? "highlighted" : ""}`}
                          onClick={() => setSelectedCampsiteId("cabin-ridge")}
                          transform="translate(70, 155)"
                        >
                          <circle r="12" />
                          <text y="3">CR</text>
                        </g>
                      </svg>
                    </div>

                    <div className="map-legend">
                      <div className="legend-item"><span className="legend-dot" style={{ background: "var(--color-primary)" }}></span> Selected Campsite</div>
                      <div className="legend-item"><span className="legend-dot animate-pulse" style={{ background: "var(--color-success)" }}></span> Matches Filter</div>
                      <div className="legend-item"><span className="legend-dot" style={{ background: "#1f2937", border: "1px solid var(--border-glass)" }}></span> Campsite Node</div>
                    </div>
                  </div>

                  {/* Right Column: List & Detailed panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="glass-panel campsite-detail-panel">
                      <div className="campsite-detail-header">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3>Campsite: {selectedCampsite.name}</h3>
                          <span className={`campsite-badge ${selectedCampsite.platforms ? "premium" : ""}`}>
                            {selectedCampsite.platforms ? "Wooden Platforms" : "Ground Pads Only"}
                          </span>
                        </div>
                      </div>

                      <div className="campsite-details-grid-mini">
                        <div className="detail-mini-item">
                          <p>Max Capacity</p>
                          <h5>{selectedCampsite.capacity} campers</h5>
                        </div>
                        <div className="detail-mini-item">
                          <p>Shade Density</p>
                          <h5>{selectedCampsite.shade} Shade</h5>
                        </div>
                        <div className="detail-mini-item">
                          <p>Distance to Pool</p>
                          <h5>{selectedCampsite.poolDist}</h5>
                        </div>
                        <div className="detail-mini-item">
                          <p>Water Availability</p>
                          <h5>Spigot in Campsite</h5>
                        </div>
                      </div>

                      <div>
                        <h5 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--color-text-bright)" }}>
                          Campsite Highlights
                        </h5>
                        <div className="features-list-tags">
                          {selectedCampsite.features.map((feat, i) => (
                            <span key={i} className="feature-tag">{feat}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: "1px dashed var(--border-glass)", paddingTop: "14px", marginTop: "10px" }}>
                        <p style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                          * Platform campsites feature pre-erected heavy-canvas wall tents on elevated wooden bases. Ground pad sites require unit-provided dome tents.
                        </p>
                      </div>
                    </div>

                    {/* Campsite List for Filtering / Selection */}
                    <div className="campsite-list">
                      {filteredCampsites.map((c) => (
                        <div 
                          key={c.id} 
                          onClick={() => setSelectedCampsiteId(c.id)}
                          className={`campsite-card ${selectedCampsiteId === c.id ? "selected" : ""}`}
                        >
                          <div className="campsite-info-left">
                            <h4>{c.name}</h4>
                            <p>Capacity: {c.capacity} | Pool: {c.poolDist}</p>
                          </div>
                          <span className={`campsite-badge ${c.platforms ? "premium" : ""}`}>
                            {c.platforms ? "Platforms" : "Ground"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. LEADER'S GUIDE VIEW */}
            {activeTab === "guide" && (
              <div className="animate-slide-up leaders-guide-container">
                <div className="guide-subtabs">
                  <button onClick={() => setGuideSubTab("overview")} className={`guide-subtab-btn ${guideSubTab === "overview" ? "active" : ""}`}>Overview & Check-In</button>
                  <button onClick={() => setGuideSubTab("checklist")} className={`guide-subtab-btn ${guideSubTab === "checklist" ? "active" : ""}`}>Packing Checklist</button>
                  <button onClick={() => setGuideSubTab("schedule")} className={`guide-subtab-btn ${guideSubTab === "schedule" ? "active" : ""}`}>Daily Schedule</button>
                  <button onClick={() => setGuideSubTab("programs")} className={`guide-subtab-btn ${guideSubTab === "programs" ? "active" : ""}`}>Program & Merit Badges</button>
                  <button onClick={() => setGuideSubTab("safety")} className={`guide-subtab-btn ${guideSubTab === "safety" ? "active" : ""}`}>Health & Safety</button>
                </div>

                <div className="guide-content-panel glass-panel">
                  {/* GUIDE: OVERVIEW */}
                  {guideSubTab === "overview" && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "12px", color: "var(--color-text-bright)" }}>
                        Overview & Check-In Procedures
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }} className="responsive-split">
                        <div>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Check-In Details</h4>
                          <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Arrival Time:</strong> Sunday between 1:00 PM and 3:00 PM. Please do not arrive early as staff are completing weekly property prep.</li>
                            <li><strong>Arrival Depot:</strong> Park in main lot. Only one unit trailer vehicle is permitted to enter the loop road to drop gear at the campsite.</li>
                            <li><strong>Medical Binder:</strong> Present all medical forms (Parts A, B, and C) completed within the last 12 calendar months and signed by a licensed physician.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Check-Out Details</h4>
                          <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Time:</strong> Saturday morning by 9:30 AM.</li>
                            <li><strong>Inspection:</strong> Campsite commissioners will inspect tent structures, fire zones, and clean latrines.</li>
                            <li><strong>Medications:</strong> Retrieve all unit medications and physical health binders from the Health Lodge before driving out.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="fire-restrictions-box" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <h5 style={{ color: "var(--color-success)", fontWeight: 700, marginBottom: "4px" }}>Scouter Code of Conduct</h5>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                          All attendees (youth and adults) are expected to live by the Scout Oath and Law. Leave No Trace principles must be practiced at all times. Liquid or gas fuels are preferred. Open wood campfires are subject to daily restrictions based on fire weather conditions.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: PACKING CHECKLIST */}
                  {guideSubTab === "checklist" && (
                    <div className="animate-fade-in">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)" }}>Personal & Unit Packing Guide</h3>
                          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Checked items are saved automatically to your device browser cache.</p>
                        </div>
                        <button onClick={clearChecklist} className="admin-btn" style={{ padding: "6px 14px" }}>Reset Checklist</button>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span>Completion Progress</span>
                          <span style={{ fontWeight: 700, color: "var(--color-success)" }}>{checklistStats.percent}% ({checklistStats.checked}/{checklistStats.total} items)</span>
                        </div>
                        <div className="gauge-track">
                          <div className="gauge-fill" style={{ width: `${checklistStats.percent}%`, background: "var(--color-success)" }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {Object.keys(CHECKLIST_SECTIONS).map((secKey) => {
                          const sec = CHECKLIST_SECTIONS[secKey];
                          return (
                            <div key={secKey} className="checklist-category">
                              <h4>{sec.title}</h4>
                              <div className="checklist-items-grid">
                                {sec.items.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => toggleChecklistItem(item)}
                                    className={`checklist-item ${checkedItems[item] ? "checked" : ""}`}
                                  >
                                    <div className="checkbox-custom">
                                      {checkedItems[item] && <span style={{ fontSize: "10px" }}>✓</span>}
                                    </div>
                                    <span className="checklist-item-text">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* GUIDE: DAILY SCHEDULE */}
                  {guideSubTab === "schedule" && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "12px", color: "var(--color-text-bright)" }}>
                        Camp Lawton Daily Schedule
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
                        Uniform of the day is generally activity uniform (Class B / Scout t-shirt) for daylight training, and field uniform (Class A) for dinner assemblies and evening campfires.
                      </p>

                      <div className="schedule-day-tabs">
                        <button onClick={() => setScheduleDay("sunday")} className={`schedule-day-btn ${scheduleDay === "sunday" ? "active" : ""}`}>Sunday Arrival</button>
                        <button onClick={() => setScheduleDay("weekday")} className={`schedule-day-btn ${scheduleDay === "weekday" ? "active" : ""}`}>Mon - Fri Rotations</button>
                        <button onClick={() => setScheduleDay("saturday")} className={`schedule-day-btn ${scheduleDay === "saturday" ? "active" : ""}`}>Saturday Checkout</button>
                      </div>

                      <div className="timeline">
                        {SUMMER_SCHEDULE[scheduleDay].map((slot, idx) => (
                          <div key={idx} className="timeline-item">
                            <span className="timeline-time">{slot.time}</span>
                            <div className="timeline-content">
                              <h5>{slot.task}</h5>
                              <p>{slot.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GUIDE: PROGRAMS & MERIT BADGES */}
                  {guideSubTab === "programs" && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "12px", color: "var(--color-text-bright)" }}>
                        Program Areas & Camp Merit Badges
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
                        Staff instruction operates across six specialized program areas on Mt. Lemmon:
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="responsive-split">
                        <div className="glass-card-interactive" style={{ cursor: "default" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "6px" }}>Shooting Sports</h4>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                            Includes archery range, air rifle range, and shotgun shooting. Merit badges offered: <strong>Archery, Rifle Shooting, Shotgun Shooting</strong>. Safety briefs are mandatory on Sunday.
                          </p>
                        </div>
                        <div className="glass-card-interactive" style={{ cursor: "default" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "6px" }}>Aquatics (Swimming Pool)</h4>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                            Camp Lawton features an outdoor swimming pool. Swimmers are classified during Sunday check-in. Merit badges offered: <strong>Swimming, Lifesaving</strong>. Afternoon free-swim sessions are open to all.
                          </p>
                        </div>
                        <div className="glass-card-interactive" style={{ cursor: "default" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "6px" }}>Ecology & Nature</h4>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                            Study the unique flora and fauna of the Coronado National Forest. Merit badges offered: <strong>Environmental Science, Forestry, Weather, Reptile Study</strong>.
                          </p>
                        </div>
                        <div className="glass-card-interactive" style={{ cursor: "default" }}>
                          <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "6px" }}>Outdoor Skills (Scoutcraft)</h4>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                            Knot tying, pioneering, and wilderness survival. Merit badges offered: <strong>Camping, Pioneering, Wilderness Survival</strong>. Also coordinates the "Trail to First Class" program for new scouts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: HEALTH & SAFETY */}
                  {guideSubTab === "safety" && (
                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "6px", color: "var(--color-text-bright)" }}>
                          Health & Safety Guidelines
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                          Operating at high altitudes in a national forest wilderness requires proactive safety management.
                        </p>
                      </div>

                      <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px" }}>
                        <h5 style={{ color: "var(--color-warning)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Layers className="w-4 h-4" /> Elevation Preparations (7,900 ft)
                        </h5>
                        <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                          Temperatures are typically 20 to 25 degrees cooler than in Tucson, but the air is much thinner. Dehydration occurs rapidly. Leaders must ensure Scouts drink at least one full water bottle (32oz) every hour. Limit strenuous hiking on the first 24 hours of arrival to allow acclimatization.
                        </p>
                      </div>

                      <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px", borderLeftColor: "var(--color-primary)" }}>
                        <h5 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Flame className="w-4 h-4" /> Bear Aware Protocols
                        </h5>
                        <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                          Mt. Lemmon is active black bear habitat. No food, candy, gum, soda, or scented items (deodorant, toothpaste, chapstick) may ever be kept inside tents. Troops must lock all foodstuffs inside their unit trailer or the camp's bear-proof steel storage boxes.
                        </p>
                      </div>

                      <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px", borderLeftColor: "var(--color-danger)" }}>
                        <h5 style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <AlertTriangle className="w-4 h-4" /> Monsoon & Lightning Policy
                        </h5>
                        <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                          During July and August, sudden severe thunderstorms frequently hit Mt. Lemmon in the afternoon. If lightning strikes within 10 miles of camp (heard as thunder), all outdoor program zones (swimming pool, shooting ranges) are suspended. All troops must report immediately to the Dining Hall for shelter until given the all-clear by the Camp Director.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
