import React, { useState, useEffect } from "react";
import { 
  Menu, X, Map as MapIcon, Calendar, Cloud, Sun, Droplets, Wind,
  AlertTriangle, Navigation, Tent, TreePine, MapPin, 
  Coffee, Users, Clock, Sunrise, BookOpen, Search, Compass,
  ChevronDown, ChevronUp, Check, Settings, Star, Award, Shield,
  RefreshCw, CheckCircle2, AlertOctagon, HelpCircle, Anchor, Ship, Skull, SkullIcon,
  Layers, ShieldAlert, ExternalLink, Thermometer, Phone, CheckSquare, Activity, Flame, CloudLightning, Info
} from "lucide-react";
import { fetchLiveWeatherData } from "./utils/weatherApi";
import { MERIT_BADGES } from './data/meritBadges';
import schedules from "./data/schedules.js";
import CampfireEmbers from "./components/CampfireEmbers.jsx";

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
  const [barkerStandard, setBarkerStandard] = useState({});
  const [tribeRank, setTribeRank] = useState("Hunter");
  const [faqOpen, setFaqOpen] = useState(null);
  const [scheduleDay, setScheduleDay] = useState("weekday");

  // Responsive UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Merit Badge Survey States
  const [mbInterest, setMbInterest] = useState({});
  const [mbSortKey, setMbSortKey] = useState("Interest");
  const [mbSortDir, setMbSortDir] = useState("desc");

  const handleMbInterestChange = (badgeName, val) => {
    const newVal = Math.max(0, parseInt(val) || 0);
    setMbInterest(prev => ({ ...prev, [badgeName]: newVal }));
  };

  const getSortedMeritBadges = () => {
    return [...MERIT_BADGES].sort((a, b) => {
      let aVal = a[mbSortKey];
      let bVal = b[mbSortKey];

      if (mbSortKey === "Interest") {
        aVal = mbInterest[a["Merit Badge"]] || 0;
        bVal = mbInterest[b["Merit Badge"]] || 0;
      }

      if (aVal < bVal) return mbSortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return mbSortDir === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleMbSort = (key) => {
    if (mbSortKey === key) {
      setMbSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setMbSortKey(key);
      setMbSortDir(key === "Interest" ? "desc" : "asc");
    }
  };

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


  // Sync Checklist and Barker Standard with localStorage
  useEffect(() => {
    const storedChecklist = localStorage.getItem("camp_lawton_checklist");
    const storedBarker = localStorage.getItem("camp_lawton_barker");
    try {
      if (storedChecklist) {
        setCheckedItems(JSON.parse(storedChecklist));
      }
      if (storedBarker) {
        setBarkerStandard(JSON.parse(storedBarker));
      }
    } catch (e) {
      console.error("Failed to parse local storage", e);
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

  const toggleBarkerStandard = (item) => {
    const newChecked = { ...barkerStandard, [item]: !barkerStandard[item] };
    setBarkerStandard(newChecked);
    localStorage.setItem("camp_lawton_barker", JSON.stringify(newChecked));
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
      <CampfireEmbers />
      
      {/* Sidebar - Desktop Layout */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/dancing_logo.gif" 
            alt="Camp Lawton Dancing Logo" 
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
          <div 
            onClick={() => { setActiveTab("mb-survey"); setMobileMenuOpen(false); }} 
            className={`nav-item ${activeTab === "mb-survey" ? "active" : ""}`}
            id="nav-mb-survey"
          >
            <Compass className="w-5 h-5" />
            MB Survey
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
            src="/dancing_logo.gif" 
            alt="Camp Lawton Dancing Logo" 
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
              {activeTab === "mb-survey" && "Merit Badge Interest Survey"}
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
                <div className="hero-banner-card" style={{ position: "relative", overflow: "hidden" }}>
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", top: 0, left: 0, zIndex: 0 }}
                  >
                    <source src="/title_card.mp4" type="video/mp4" />
                  </video>
                  <div className="hero-banner-overlay" style={{ position: "relative", zIndex: 1, height: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "8px" }}>
                      <Anchor className="w-8 h-8 text-primary" />
                      <h2>Welcome to Camp Lawton</h2>
                      <Anchor className="w-8 h-8 text-primary" />
                    </div>
                    <p style={{ fontSize: "18px", color: "var(--color-primary-light)", fontWeight: "bold" }}>2027 Season: Pirate Crew Adventures</p>
                    <p style={{ marginTop: "4px" }}>Catalina Council property serving Scouting America on Mount Lemmon in the Coronado National Forest.</p>
                  </div>
                </div>

                {/* CRITICAL INFORMATION ALERT */}
                <div style={{ padding: "16px", background: "rgba(239,68,68,0.1)", border: "2px solid var(--color-danger)", borderRadius: "8px", marginBottom: "24px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-danger)", fontFamily: "var(--font-title)", marginBottom: "12px" }}>
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                    CRITICAL INFORMATION — READ BEFORE YOU MAKE PLANS
                  </h3>
                  <ul style={{ listStyleType: "disc", paddingLeft: "24px", color: "var(--color-text-bright)", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li><strong>NO AQUATICS AND LIMITED FIREARMS:</strong> Camp Lawton has no pool or waterfront and the USFS has limited us to pellet rifles for the Rifle merit badge.</li>
                    <li><strong>FIRE:</strong> Fire restrictions may prohibit campfires at any time — check daily with staff.</li>
                    <li><strong>VEHICLES:</strong> Not permitted inside camp beyond the parking area. Plan to carry your gear. Back into spaces.</li>
                    <li><strong>MEDICAL:</strong> All prescription meds must be surrendered to the Medic in original bottles. Forms A, B, and C required for &gt; 3 days.</li>
                    <li><strong>SAFEGUARDING YOUTH:</strong> All adults must have current SYT. Two-deep leadership required. No 1-on-1 adult/youth contact.</li>
                  </ul>
                </div>

                {/* Welcome Letters */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }} className="responsive-split">
                  <div className="glass-panel" style={{ borderTop: "4px solid var(--color-primary)" }}>
                    <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "12px", color: "var(--color-primary-light)" }}>Welcome from the Program Director</h3>
                    <p style={{ fontSize: "14px", color: "var(--color-text)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "12px" }}>
                      "Ahoy Leaders! We are absolutely thrilled to welcome you back to a full week-long summer camp at Lawton. This year, we're diving deep into our Pirate Crew Adventures theme! Why the theme? Because camp shouldn't just be a merit badge factory. It's about building memories, exploring the outdoors, and having serious FUN while we do it. So grab your tricorn hats, rally your crew, and get ready for the best summer yet. I can't wait to see you up on the mountain!"
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "bold", textAlign: "right" }}>- Lexi</p>
                  </div>
                  <div className="glass-panel" style={{ borderTop: "4px solid var(--color-success)" }}>
                    <h3 style={{ fontFamily: "var(--font-title)", marginBottom: "12px", color: "var(--color-success)" }}>Welcome from the Camp Director</h3>
                    <p style={{ fontSize: "14px", color: "var(--color-text)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "12px" }}>
                      "Scouts and Scouters, welcome home to Camp Lawton. A tremendous amount of hard work has gone into preparing our historic 60-acre facility for your arrival. We take deep pride in the upkeep of this property so that your scouts have a safe, clean, and incredible environment to learn and grow. Our dedicated staff is ready to support your unit's goals, from rank advancement to leadership development. We're honored you chose to spend your summer with us."
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "bold", textAlign: "right" }}>- MaryLou</p>
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

                      {/* Active Regional Alerts Widget */}
                      <div className="glass-panel alerts-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                          <h3 style={{ fontFamily: "var(--font-title)" }}>Active Regional Alerts</h3>
                          <AlertTriangle className={`w-5 h-5 ${activeAlerts.length > 0 ? "text-danger animate-pulse" : "text-success"}`} />
                        </div>
                        
                        {activeAlerts.length === 0 ? (
                          <div style={{ padding: "16px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "8px", textAlign: "center" }}>
                            <CheckCircle2 className="w-8 h-8 text-success" style={{ margin: "0 auto 8px" }} />
                            <h4 style={{ color: "var(--color-success)", fontWeight: "600", marginBottom: "4px" }}>All Clear</h4>
                            <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>No active weather or forest alerts for this region.</p>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
                            {activeAlerts.map(alert => (
                              <div key={alert.id} style={{ padding: "12px", background: "rgba(239,68,68,0.08)", borderLeft: "4px solid var(--color-danger)", borderRadius: "4px" }}>
                                <h5 style={{ color: "var(--color-danger)", fontWeight: "bold", marginBottom: "4px", fontSize: "14px" }}>{alert.event}</h5>
                                <p style={{ fontSize: "12px", color: "var(--color-text-bright)", marginBottom: "6px" }}>{alert.headline}</p>
                                {alert.instruction && (
                                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)", background: "rgba(0,0,0,0.2)", padding: "6px", borderRadius: "4px" }}>
                                    {alert.instruction}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", textAlign: "right" }}>
                          <a 
                            href={weatherData?.syncInfo?.alertsUrl || "https://alerts.weather.gov/"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: "var(--color-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            Source: NOAA NWS Alerts Feed <ExternalLink className="w-3 h-3" />
                          </a>
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
                      <div style={{ marginTop: "24px", textAlign: "right" }}>
                        <a 
                          href={weatherData?.syncInfo?.alertsUrl || "https://alerts.weather.gov/"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: "14px", color: "var(--color-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          Source: NOAA NWS Alerts Feed <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
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
                <div className="guide-subtabs" style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
                  <button onClick={() => setGuideSubTab("overview")} className={`guide-subtab-btn ${guideSubTab === "overview" ? "active" : ""}`}>Welcome & Check-In</button>
                  <button onClick={() => setGuideSubTab("policies")} className={`guide-subtab-btn ${guideSubTab === "policies" ? "active" : ""}`}>Policies & Safety</button>
                  <button onClick={() => setGuideSubTab("schedule")} className={`guide-subtab-btn ${guideSubTab === "schedule" ? "active" : ""}`}>Schedule & Logistics</button>
                  <button onClick={() => setGuideSubTab("programs")} className={`guide-subtab-btn ${guideSubTab === "programs" ? "active" : ""}`}>Program Highlights</button>
                  <button onClick={() => setGuideSubTab("awards")} className={`guide-subtab-btn ${guideSubTab === "awards" ? "active" : ""}`}>Awards & Recognition</button>
                  <button onClick={() => setGuideSubTab("faq")} className={`guide-subtab-btn ${guideSubTab === "faq" ? "active" : ""}`}>FAQ</button>
                  <button onClick={() => setGuideSubTab("checklist")} className={`guide-subtab-btn ${guideSubTab === "checklist" ? "active" : ""}`}>Packing Checklist</button>
                </div>

                <div className="guide-content-panel glass-panel">
                  {/* GUIDE: OVERVIEW / WELCOME */}
                  {guideSubTab === "overview" && (
                    <div className="animate-fade-in">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <Anchor className="w-6 h-6 text-primary" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Welcome & Check-In Procedures
                        </h3>
                      </div>
                      
                      <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", borderLeft: "4px solid var(--color-primary)" }}>
                        <h4 style={{ color: "var(--color-primary-light)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Welcome to Camp Lawton, est. 1921</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                          Nestled in the Catalina Mountains, Camp Lawton is the premier scout camp of the Catalina Council. We are fully accredited by the National Camp Accreditation Program (NCAP) and operate under a strict Special Use Permit with the US Forest Service. Please preserve the magic of this place by strictly adhering to Leave No Trace principles.
                        </p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }} className="responsive-split">
                        <div>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Arrival & Directions</h4>
                          <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Arrival Time:</strong> Sunday between 1:00 PM and 3:00 PM. No early arrivals! Staff are prepping the property.</li>
                            <li><strong>Directions:</strong> Take Catalina Highway up Mount Lemmon. Turn right at the USFS Palisade Visitor Center onto Organization Ridge Road.</li>
                            <li><strong>Parking:</strong> Park immediately in the main lot. Back into all spaces to facilitate emergency evacuation.</li>
                            <li><strong>Gear Drop:</strong> Only ONE unit trailer or vehicle is permitted on the loop road to drop gear at your campsite. All other vehicles must stay in the lot.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 style={{ color: "var(--color-primary-light)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Check-In Process</h4>
                          <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Step 1:</strong> Unit Leader heads to the Camp Office. Bring the Unit Roster and fee settlement.</li>
                            <li><strong>Step 2:</strong> Present all medical forms (A, B, C) in a single alphabetical binder to the Health Lodge.</li>
                            <li><strong>Step 3:</strong> Turn in all prescription medications to the Medic in their original containers.</li>
                            <li><strong>Step 4:</strong> Meet your Troop Guide for a campsite tour and latrine orientation.</li>
                            <li><strong>Step 5:</strong> Proceed to the parade ground for the 5:00 PM safety briefing.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="fire-restrictions-box" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <h5 style={{ color: "var(--color-success)", fontWeight: 700, marginBottom: "4px" }}>Scouter Code of Conduct</h5>
                        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                          All attendees (youth and adults) are expected to live by the Scout Oath and Law. Keep the noise down after Taps (10:00 PM). Ensure your crew's behavior honors the uniform.
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

                  {/* GUIDE: DAILY SCHEDULE & LOGISTICS */}
                  {guideSubTab === "schedule" && (
                    <div className="animate-fade-in">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <Ship className="w-6 h-6 text-primary" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Schedule & Logistics
                        </h3>
                      </div>

                      {/* PIRATE LINGO */}
                      <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", borderLeft: "4px solid var(--color-warning)" }}>
                        <h4 style={{ color: "var(--color-warning)", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>Pirate Crew Lingo</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "var(--color-text-bright)" }}>
                          <div><strong>The Fleet:</strong> All troops at camp</div>
                          <div><strong>Your Ship:</strong> Your Troop/Campsite</div>
                          <div><strong>Captain:</strong> Senior Patrol Leader (SPL)</div>
                          <div><strong>First Mate:</strong> Assistant SPL</div>
                          <div><strong>The Admiral:</strong> Scoutmaster</div>
                          <div><strong>The Galley:</strong> Dining Hall</div>
                          <div><strong>The Brig:</strong> Health Lodge</div>
                        </div>
                      </div>

                      <div className="schedule-day-tabs">
                        <button onClick={() => setScheduleDay("sunday")} className={`schedule-day-btn ${scheduleDay === "sunday" ? "active" : ""}`}>Sunday Arrival</button>
                        <button onClick={() => setScheduleDay("weekday")} className={`schedule-day-btn ${scheduleDay === "weekday" ? "active" : ""}`}>Standard Day (Mon-Thu)</button>
                        <button onClick={() => setScheduleDay("saturday")} className={`schedule-day-btn ${scheduleDay === "saturday" ? "active" : ""}`}>Saturday Departure</button>
                      </div>

                      <div className="timeline" style={{ marginBottom: "24px" }}>
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

                      {/* LEADER LOGISTICS */}
                      <h4 style={{ color: "var(--color-primary-light)", fontSize: "18px", marginTop: "10px", marginBottom: "12px", fontFamily: "var(--font-title)" }}>Leader Logistics</h4>
                      <div className="glass-panel">
                        <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <li><strong>SPL (Captain's) Meeting:</strong> Every day at 1:15 PM at the Galley (Dining Hall). The SPL and Scoutmaster must attend.</li>
                          <li><strong>Leader Coffee:</strong> Fresh coffee is available on the Dining Hall porch every morning at 6:30 AM.</li>
                          <li><strong>Communication:</strong> WiFi is available near the Camp Office for adults only. Cell service is extremely spotty. Emergency radios (FRS Channel 5) are monitored by staff 24/7.</li>
                          <li><strong>Departure:</strong> Saturday morning check-out begins at 7:00 AM. A camp commissioner will inspect your latrine and fire ring. You will not receive your health binder until the inspection is signed off.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: PROGRAM HIGHLIGHTS */}
                  {guideSubTab === "programs" && (
                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <Compass className="w-6 h-6 text-primary" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Program Highlights
                        </h3>
                      </div>

                      {/* Evening Programs */}
                      <div className="glass-panel" style={{ borderLeft: "4px solid #a855f7" }}>
                        <h4 style={{ color: "#a855f7", fontWeight: 700, marginBottom: "12px", fontSize: "18px" }}>Evening Programs</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px" }}>
                            <strong style={{ color: "var(--color-text-bright)" }}>Sunday:</strong> Opening Campfire. Wear field uniform. Meet at parade ground.
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px" }}>
                            <strong style={{ color: "var(--color-text-bright)" }}>Monday:</strong> Vespers & Interfaith Service at the Chapel.
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px" }}>
                            <strong style={{ color: "var(--color-text-bright)" }}>Wednesday:</strong> Pirate Feast (Root beer floats & cobbler in the Galley).
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px" }}>
                            <strong style={{ color: "var(--color-text-bright)" }}>Friday:</strong> Closing Campfire & OA Callout.
                          </div>
                        </div>
                      </div>

                      {/* Campsite Competitions */}
                      <div className="glass-panel" style={{ borderLeft: "4px solid var(--color-warning)" }}>
                        <h4 style={{ color: "var(--color-warning)", fontWeight: 700, marginBottom: "12px", fontSize: "18px" }}>Campsite Competitions</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text)", marginBottom: "12px", lineHeight: 1.5 }}>
                          Throughout the week, units compete for the coveted "Golden Anchor" by earning points in the following events:
                        </p>
                        <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <li><strong>Pieces of Eight Hunt:</strong> Staff hide 8 gold coins around the property daily. Bring them to the office for points.</li>
                          <li><strong>Knot-Tying Relay:</strong> Tuesday at 4:00 PM at Scoutcraft.</li>
                          <li><strong>Walk the Plank:</strong> Thursday at 4:00 PM. A balance and agility obstacle course on the parade ground.</li>
                        </ul>
                      </div>

                      {/* Special Programs */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="responsive-split">
                        <div className="glass-panel" style={{ borderTop: "3px solid var(--color-danger)" }}>
                          <h5 style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>Captain's Challenge</h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Scoutmasters can challenge any staff member to a dual of their choosing (e.g., fire-building, knot tying, trivia) on Thursday evening. Winner takes home a specialized "Pirate Duel" patch.
                          </p>
                        </div>
                        <div className="glass-panel" style={{ borderTop: "3px solid var(--color-primary-light)" }}>
                          <h5 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>Astronomy Talk</h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Given our proximity to the Mount Lemmon Observatory, a guest astronomer will bring telescopes to the parade ground on Tuesday night (weather permitting) for a deep-sky viewing session.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: AWARDS & RECOGNITION */}
                  {guideSubTab === "awards" && (
                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <SkullIcon className="w-6 h-6 text-warning" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Awards & Recognition
                        </h3>
                      </div>

                      {/* Tribe of Papago */}
                      <div className="glass-panel" style={{ borderTop: "4px solid var(--color-primary-light)" }}>
                        <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "8px", fontSize: "18px" }}>The Tribe of Papago</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "16px", lineHeight: 1.5 }}>
                          Camp Lawton's historic honor camping society. The primary role is recognition of Scouts returning to camp for multiple years. Select your rank to view the requirements:
                        </p>
                        
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                          {["Hunter", "Warrior", "Medicine Man", "Chief", "Elder", "Guide"].map(rank => (
                            <button 
                              key={rank}
                              onClick={() => setTribeRank(rank)}
                              style={{ 
                                padding: "6px 12px", 
                                borderRadius: "4px", 
                                background: tribeRank === rank ? "var(--color-primary)" : "rgba(255,255,255,0.05)",
                                color: tribeRank === rank ? "#fff" : "var(--color-text-bright)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                cursor: "pointer",
                                fontSize: "13px"
                              }}
                            >
                              {rank}
                            </button>
                          ))}
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px" }}>
                          {tribeRank === "Hunter" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li>Earn one merit badge or "Graduate" at Model Camp.</li>
                              <li>Hike one camp trail (Mt. Bigalow, Eagle Trail, Compass Course, etc.)</li>
                              <li>Show Scout spirit.</li>
                            </ul>
                          )}
                          {tribeRank === "Warrior" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li>Participate in a one hour service project for Camp Lawton.</li>
                              <li>Earn two merit badges or "Graduate" Model Camp.</li>
                              <li>Hike one camp trail.</li>
                              <li>Show Scout Spirit.</li>
                            </ul>
                          )}
                          {tribeRank === "Medicine Man" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li>Complete two hours of service projects.</li>
                              <li>Earn two merit badges.</li>
                              <li>Demonstrate leadership by volunteering in a program area for one hour during camp (or tutor scouts for 3 hours).</li>
                              <li>Hike two camp trails.</li>
                              <li>Show Scout spirit.</li>
                            </ul>
                          )}
                          {tribeRank === "Chief" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li>Complete three hours of service projects.</li>
                              <li>Earn three merit badges.</li>
                              <li>Demonstrate leadership by volunteering in a program area for one hour AND tutor scouts for 1 hour.</li>
                              <li>Hike two camp trails.</li>
                              <li>Show Scout spirit.</li>
                            </ul>
                          )}
                          {tribeRank === "Elder" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li><em>Adult leaders or Fifth year in Tribe</em></li>
                              <li>Encourage and support Scouts in earning rank in the Tribe of Papago.</li>
                              <li>Complete three hours of service projects.</li>
                              <li>Hike one camp trail.</li>
                              <li>Volunteer to help in a program area for at least one hour.</li>
                            </ul>
                          )}
                          {tribeRank === "Guide" && (
                            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-bright)", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <li><em>Staff members</em></li>
                              <li>Work on staff for more than one week.</li>
                              <li>Lead or assist in leading a Tribe of Papago service project.</li>
                              <li>Teach at least 10 Scouts over a week.</li>
                              <li>Visit a campsite at least once a day.</li>
                              <li>Learn about the purposes of the Tribe of Papago and participate in a ceremony.</li>
                              <li>Obtain recommendations from a Scoutmaster and Area Director.</li>
                              <li>Attend Chapel service for at least 2 weeks.</li>
                              <li>Lead a unit on one camp trail.</li>
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* The Barker Standard */}
                      <div className="glass-panel" style={{ borderTop: "4px solid var(--color-warning)" }}>
                        <h4 style={{ color: "var(--color-warning)", fontWeight: 700, marginBottom: "8px", fontSize: "18px" }}>The Barker Standard</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "16px", lineHeight: 1.5 }}>
                          Named for legendary scout leader Roy J. Barker (1924-2012). Fulfill these 9 requirements to be recognized as an honor troop and earn a special ribbon for your troop flag. Your progress is saved to your device.
                        </p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {[
                            "Request and pass a Uniform Inspection by a Senior Staff member",
                            "Request and pass a Campsite Inspection by a Senior Staff member",
                            "Lead a Flag Ceremony",
                            "Sing a Song at a camp wide activity",
                            "Perform a skit, song, or story at the campwide closing campfire",
                            "Volunteer for cleanup duty in the Mess Hall and/or shower facilities",
                            "Complete a service project while in camp",
                            "Demonstrate consistent Scout Spirit, Live the Scout Oath, Law, Motto, Slogan, and Outdoor Code throughout the week",
                            "Request and complete the Barker Standard application form"
                          ].map((req, i) => (
                            <div 
                              key={i} 
                              onClick={() => toggleBarkerStandard(`req_${i}`)}
                              style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "12px", 
                                padding: "12px", 
                                background: barkerStandard[`req_${i}`] ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                                border: barkerStandard[`req_${i}`] ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <div style={{ 
                                width: "24px", 
                                height: "24px", 
                                borderRadius: "4px", 
                                border: barkerStandard[`req_${i}`] ? "2px solid var(--color-success)" : "2px solid rgba(255,255,255,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: barkerStandard[`req_${i}`] ? "var(--color-success)" : "transparent",
                                flexShrink: 0
                              }}>
                                {barkerStandard[`req_${i}`] && <CheckSquare className="w-4 h-4 text-dark" />}
                              </div>
                              <span style={{ 
                                fontSize: "14px", 
                                color: barkerStandard[`req_${i}`] ? "var(--color-success)" : "var(--color-text-bright)",
                                textDecoration: barkerStandard[`req_${i}`] ? "line-through" : "none",
                                opacity: barkerStandard[`req_${i}`] ? 0.8 : 1
                              }}>
                                {i + 1}. {req}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: POLICIES & SAFETY */}
                  {guideSubTab === "policies" && (
                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ShieldAlert className="w-6 h-6 text-danger" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Camp Policies & Safety
                        </h3>
                      </div>
                      
                      <div className="glass-panel" style={{ borderLeft: "4px solid var(--color-primary)" }}>
                        <h4 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "8px" }}>USFS Special Use Permit</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text)", lineHeight: 1.5 }}>
                          Camp Lawton operates on land leased from the United States Forest Service. We are guests in the Coronado National Forest. All units must strictly practice <strong>Leave No Trace (LNT)</strong>. No trenching tents, no cutting live trees, and absolutely no littering. You carry it in, you carry it out.
                        </p>
                      </div>

                      <div className="glass-panel" style={{ borderLeft: "4px solid var(--color-danger)" }}>
                        <h4 style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "8px" }}>Safeguarding Youth Guidelines</h4>
                        <p style={{ fontSize: "14px", color: "var(--color-text)", lineHeight: 1.5, marginBottom: "8px" }}>
                          Camp Lawton strictly enforces BSA's Safeguarding Youth policies:
                        </p>
                        <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <li><strong>Two-Deep Leadership:</strong> Minimum of two registered adult leaders over 21 required at all times.</li>
                          <li><strong>No 1-on-1 Contact:</strong> Private interactions between adults and youth (other than their own child) are strictly prohibited.</li>
                          <li><strong>Privacy:</strong> Separate accommodations for adults and youth. Separate shower times.</li>
                          <li>All adults must have current SYT (Safeguarding Youth Training) certification on file.</li>
                        </ul>
                      </div>

                      <h4 style={{ color: "var(--color-text-bright)", fontSize: "18px", marginTop: "10px", marginBottom: "0px", fontFamily: "var(--font-title)" }}>Mountain Wildlife & Hazards</h4>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="responsive-split">
                        <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px" }}>
                          <h5 style={{ color: "var(--color-warning)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Flame className="w-4 h-4" /> Black Bears
                          </h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                            No food or smellables in tents ever. Lock all food in trailers or bear boxes. If encountered, group up, make noise, and back away slowly. Do not run.
                          </p>
                        </div>
                        <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px", borderLeftColor: "var(--color-primary)" }}>
                          <h5 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Activity className="w-4 h-4" /> Mountain Lions
                          </h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                            Avoid hiking alone at dawn or dusk. If encountered, make yourself look large, maintain eye contact, and shout loudly.
                          </p>
                        </div>
                        <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px", borderLeftColor: "var(--color-danger)" }}>
                          <h5 style={{ color: "var(--color-danger)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <ShieldAlert className="w-4 h-4" /> Rattlesnakes
                          </h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                            Stay on marked trails. Do not reach into blind crevices or step over logs without looking. Do NOT attempt to kill or move the snake—notify staff immediately.
                          </p>
                        </div>
                        <div className="weather-alert-card watch" style={{ margin: 0, padding: "16px", borderLeftColor: "#a855f7" }}>
                          <h5 style={{ color: "#a855f7", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <CloudLightning className="w-4 h-4" /> Emergencies
                          </h5>
                          <p style={{ fontSize: "13px", color: "var(--color-text)", lineHeight: 1.4 }}>
                            <strong>Bell Rings:</strong> Report to parade ground immediately.<br />
                            <strong>Active Threat:</strong> Run, Hide, Fight. Do NOT report to parade ground. Listen for megaphone announcements.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUIDE: FAQ */}
                  {guideSubTab === "faq" && (
                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <Info className="w-6 h-6 text-primary" />
                        <h3 style={{ fontFamily: "var(--font-title)", color: "var(--color-text-bright)", margin: 0 }}>
                          Frequently Asked Questions
                        </h3>
                      </div>
                      
                      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <details style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <summary style={{ fontWeight: "700", color: "var(--color-primary-light)", cursor: "pointer", outline: "none", fontSize: "15px" }}>
                            How many merit badges can a scout earn in a week?
                          </summary>
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            That depends on how much the scout likes their free time… and sanity. Technically there are 6 sessions in a day. A scout willing to face the gauntlet and some clever scheduling could probably sign up for 6 badges. We don’t recommend that though. That is a very heavy load for a week of what’s supposed to be fun.
                          </p>
                        </details>

                        <details style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <summary style={{ fontWeight: "700", color: "var(--color-primary-light)", cursor: "pointer", outline: "none", fontSize: "15px" }}>
                            How big is the camp?
                          </summary>
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Camp Lawton is roughly 60 acres. That’s about 45 football fields, 0.1 square miles. That’s not much, but with the thinner air, it feels like more when you’re walking across it. We believe our small size is an advantage, allowing for a more intimate experience where scouts get to know our staff personally.
                          </p>
                        </details>

                        <details style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <summary style={{ fontWeight: "700", color: "var(--color-primary-light)", cursor: "pointer", outline: "none", fontSize: "15px" }}>
                            Why no Aquatics program?
                          </summary>
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Our pool, which we kept functioning until 2024, was a relic of a bygone time. We finally reached the point where it was more trouble than it was worth. Will we never have a pool again? Never say never. A generous donation and approval from the Forest Service could certainly get us back in the Aquatics Program game.
                          </p>
                        </details>

                        <details style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <summary style={{ fontWeight: "700", color: "var(--color-primary-light)", cursor: "pointer", outline: "none", fontSize: "15px" }}>
                            Why the BB Guns?
                          </summary>
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Technically they’re Airsoft Rifles. We are in a relatively congested area on leased National Forest land. The decision was made in the 90s that the sound and environmental impact of .22 bullets was not sustainable. Switching to low power rifles keeps everyone happy and saves scouts from dealing with noise, recoil, and ammo fees.
                          </p>
                        </details>

                        <details style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <summary style={{ fontWeight: "700", color: "var(--color-primary-light)", cursor: "pointer", outline: "none", fontSize: "15px" }}>
                            What if I can’t register my scouts for merit badges online?
                          </summary>
                          <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                            Don’t worry about it. Contact us in advance if you can, but when you arrive at camp, we’ll do our best to correct the issue or find a good alternative. We won’t leave any scout out in the cold.
                          </p>
                        </details>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. MERIT BADGE SURVEY VIEW */}
            {activeTab === "mb-survey" && (
              <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="glass-panel" style={{ borderTop: "4px solid var(--color-primary-light)" }}>
                  <h3 style={{ color: "var(--color-primary-light)", fontWeight: 700, marginBottom: "8px", fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Compass className="w-6 h-6" /> Merit Badge Interest Survey
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "16px" }}>
                    This is an interest survey to help camp leadership prepare staffing and resources. It is <strong>not</strong> a class sign-up. Please indicate how many scouts in your troop are interested in taking each merit badge. Note that badges marked with an asterisk (*) are technically doable but require staffing, equipment, or conditions we cannot guarantee will be available.
                  </p>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "var(--color-text-muted)" }}>
                          <th onClick={() => toggleMbSort("Merit Badge")} style={{ cursor: "pointer", padding: "12px 8px" }}>Merit Badge {mbSortKey === "Merit Badge" && (mbSortDir === "asc" ? "▲" : "▼")}</th>
                          <th onClick={() => toggleMbSort("Area")} style={{ cursor: "pointer", padding: "12px 8px" }}>Area {mbSortKey === "Area" && (mbSortDir === "asc" ? "▲" : "▼")}</th>
                          <th onClick={() => toggleMbSort("Tier")} style={{ cursor: "pointer", padding: "12px 8px" }}>Tier {mbSortKey === "Tier" && (mbSortDir === "asc" ? "▲" : "▼")}</th>
                          <th onClick={() => toggleMbSort("Status")} style={{ cursor: "pointer", padding: "12px 8px" }}>Status {mbSortKey === "Status" && (mbSortDir === "asc" ? "▲" : "▼")}</th>
                          <th onClick={() => toggleMbSort("Interest")} style={{ cursor: "pointer", padding: "12px 8px", textAlign: "center", color: "var(--color-primary-light)" }}>
                            Scouts Interested {mbSortKey === "Interest" && (mbSortDir === "asc" ? "▲" : "▼")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedMeritBadges().map((mb, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: idx % 2 === 0 ? "rgba(0,0,0,0.1)" : "transparent" }}>
                            <td style={{ padding: "12px 8px", color: "var(--color-text-bright)", fontWeight: 500 }}>
                              {mb["Merit Badge"]}
                              {mb["Prerequisites"] && mb["Prerequisites"] !== "None" && mb["Prerequisites"] !== "N/A" && (
                                <div style={{ fontSize: "11px", color: "var(--color-warning)", marginTop: "4px" }}>Req: {mb["Prerequisites"]}</div>
                              )}
                            </td>
                            <td style={{ padding: "12px 8px", color: "var(--color-text)" }}>{mb["Area"]}</td>
                            <td style={{ padding: "12px 8px", color: "var(--color-text-muted)" }}>{mb["Tier"]}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <span style={{ 
                                padding: "2px 6px", 
                                borderRadius: "4px", 
                                fontSize: "11px", 
                                background: mb["Status"].includes("Complete") ? (mb["Status"].includes("*") ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)") : "rgba(239,68,68,0.1)",
                                color: mb["Status"].includes("Complete") ? (mb["Status"].includes("*") ? "var(--color-warning)" : "var(--color-success)") : "var(--color-danger)"
                              }}>
                                {mb["Status"]}
                              </span>
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <button 
                                  onClick={() => handleMbInterestChange(mb["Merit Badge"], (mbInterest[mb["Merit Badge"]] || 0) - 1)}
                                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", width: "24px", height: "24px", color: "var(--color-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={mbInterest[mb["Merit Badge"]] || 0} 
                                  onChange={(e) => handleMbInterestChange(mb["Merit Badge"], e.target.value)}
                                  style={{ width: "40px", textAlign: "center", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "var(--color-text-bright)", padding: "4px" }}
                                />
                                <button 
                                  onClick={() => handleMbInterestChange(mb["Merit Badge"], (mbInterest[mb["Merit Badge"]] || 0) + 1)}
                                  style={{ background: "var(--color-primary)", border: "none", borderRadius: "4px", width: "24px", height: "24px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
