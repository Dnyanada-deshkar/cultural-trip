const trip = JSON.parse(localStorage.getItem("tripData"));
let map;
let currentLayer;
let satelliteLayer;
let culturalMarkers = [];

// Initialize map
function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5);
  
  // Standard tile layer
  currentLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Satellite tile layer
  satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri & Contributors',
    maxZoom: 19
  });
  
  // Add geocoder control
  L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: 'Search location...',
    errorMessage: 'Location not found.',
    showResultIcons: false,
    suggestMinLength: 2,
    suggestTimeout: 250,
    queryMinLength: 1
  }).on('markgeocode', function(e) {
    const bbox = e.geocode.bbox;
    const poly = L.polygon(bbox);
    map.fitBounds(bbox);
    map.addLayer(poly);
    
    L.marker(e.geocode.center)
      .addTo(map)
      .bindPopup(e.geocode.name)
      .openPopup();
  }).addTo(map);
  
  // Search for the trip city
  if (trip && trip.city) {
    searchCity(trip.city);
  }
}

// Search for city and set view
function searchCity(city) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const displayName = data[0].display_name;
        
        map.setView([lat, lon], 13);
        
        // Add main city marker
        const cityMarker = L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #4a7c4a;">📍 ${trip.city}</h3>
              <p style="margin: 0; font-size: 12px;">${displayName}</p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">
                ${trip.days} days • ${trip.budget} budget
              </p>
            </div>
          `)
          .openPopup();
          
        // Add cultural markers based on interests
        if (trip.interests && trip.interests.length > 0) {
          setTimeout(() => addCulturalMarkers(), 1000);
        }
      } else {
        // If city not found, show error
        L.popup()
          .setLatLng(map.getCenter())
          .setContent(`<div style="text-align: center; padding: 10px;">
            <p style="color: #e74c3c; margin: 0;">❌ City "${city}" not found</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Try searching manually using the search bar</p>
          </div>`)
          .openOn(map);
      }
    })
    .catch(error => {
      console.error('Error searching for city:', error);
      L.popup()
        .setLatLng(map.getCenter())
        .setContent('<div style="text-align: center; padding: 10px;"><p style="color: #e74c3c;">❌ Error loading location</p></div>')
        .openOn(map);
    });
}

// Toggle between standard and satellite view
function toggleSatellite() {
  if (map.hasLayer(currentLayer)) {
    map.removeLayer(currentLayer);
    map.addLayer(satelliteLayer);
  } else {
    map.removeLayer(satelliteLayer);
    map.addLayer(currentLayer);
  }
}

// Add cultural markers based on interests
function addCulturalMarkers() {
  // Clear existing cultural markers
  culturalMarkers.forEach(marker => map.removeLayer(marker));
  culturalMarkers = [];
  
  if (!trip || !trip.city || !trip.interests) return;
  
  const culturalSites = {
    food: [
      { name: "Local Market", icon: "🏪", type: "market" },
      { name: "Traditional Restaurant", icon: "🍽️", type: "restaurant" },
      { name: "Street Food Area", icon: "🥘", type: "street_food" }
    ],
    history: [
      { name: "Historical Museum", icon: "🏛️", type: "museum" },
      { name: "Ancient Monument", icon: "🏺", type: "monument" },
      { name: "Heritage Site", icon: "🏰", type: "heritage" }
    ],
    art: [
      { name: "Art Gallery", icon: "🎨", type: "gallery" },
      { name: "Local Art Studio", icon: "🖼️", type: "studio" },
      { name: "Street Art District", icon: "🎭", type: "street_art" }
    ],
    nature: [
      { name: "Botanical Garden", icon: "🌿", type: "garden" },
      { name: "Nature Reserve", icon: "🌲", type: "reserve" },
      { name: "Scenic Viewpoint", icon: "🏞️", type: "viewpoint" }
    ],
    "local life": [
      { name: "Community Center", icon: "🏘️", type: "community" },
      { name: "Local Festival Ground", icon: "🎪", type: "festival" },
      { name: "Traditional Neighborhood", icon: "🏡", type: "neighborhood" }
    ]
  };
  
  const center = map.getCenter();
  const radius = 0.05; // Approximate radius for nearby locations
  
  trip.interests.forEach(interest => {
    if (culturalSites[interest]) {
      culturalSites[interest].forEach((site, index) => {
        // Generate random nearby coordinates
        const angle = (index * 120) * Math.PI / 180; // Spread markers around
        const lat = center.lat + Math.cos(angle) * radius * (1 + Math.random() * 0.5);
        const lng = center.lng + Math.sin(angle) * radius * (1 + Math.random() * 0.5);
        
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <div style="font-size: 20px; margin-bottom: 5px;">${site.icon}</div>
              <h4 style="margin: 0 0 5px 0; color: #4a7c4a;">${site.name}</h4>
              <p style="margin: 0; font-size: 11px; color: #666;">Cultural site for ${interest}</p>
            </div>
          `);
        
        culturalMarkers.push(marker);
      });
    }
  });
}

// Reset map view to city
function resetView() {
  if (trip && trip.city) {
    searchCity(trip.city);
  } else {
    map.setView([20.5937, 78.9629], 5);
  }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);
