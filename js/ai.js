const data = JSON.parse(localStorage.getItem("tripData"));
const container = document.getElementById("planContainer");

// Comprehensive famous places database for major cities
const famousPlacesDatabase = {
  // Major international cities
  paris: {
    food: ["Le Comptoir du Relais", "L'As du Fallafel", "Marché des Enfants Rouges", "Breizh Café"],
    history: ["Louvre Museum", "Eiffel Tower", "Notre-Dame Cathedral", "Arc de Triomphe"],
    art: ["Musée d'Orsay", "Centre Pompidou", "Musée Rodin", "Palais de Tokyo"],
    nature: ["Luxembourg Gardens", "Tuileries Garden", "Bois de Boulogne", "Parc des Buttes-Chaumont"],
    "local life": ["Le Marais District", "Saint-Germain-des-Prés", "Montmartre", "Canal Saint-Martin"]
  },
  london: {
    food: ["Borough Market", "Brick Lane", "Camden Market", "Dishoom"],
    history: ["British Museum", "Tower of London", "Westminster Abbey", "Churchill War Rooms"],
    art: ["Tate Modern", "National Gallery", "British Museum", "Saatchi Gallery"],
    nature: ["Hyde Park", "Regent's Park", "Kew Gardens", "Greenwich Park"],
    "local life": ["Covent Garden", "Notting Hill", "Shoreditch", "South Bank"]
  },
  newyork: {
    food: ["Katz's Delicatessen", "Chelsea Market", "Smorgasburg", "Joe's Pizza"],
    history: ["Metropolitan Museum", "Statue of Liberty", "9/11 Memorial", "Ellis Island"],
    art: ["MoMA", "Guggenheim Museum", "Whitney Museum", "Brooklyn Museum"],
    nature: ["Central Park", "High Line", "Brooklyn Botanic Garden", "Prospect Park"],
    "local life": ["Times Square", "Greenwich Village", "Williamsburg", "SoHo"]
  },
  rome: {
    food: ["Trastevere Restaurants", "Campo de' Fiori", "Mercato di Testaccio", "Pasticceria Regoli"],
    history: ["Colosseum", "Roman Forum", "Pantheon", "Vatican Museums"],
    art: ["Vatican Museums", "Borghese Gallery", "Capitoline Museums", "Palazzo Barberini"],
    nature: ["Villa Borghese", "Villa Adriana", "Orange Garden", "Parco degli Acquedotti"],
    "local life": ["Trastevere", "Campo de' Fiori", "Spanish Steps", "Piazza Navona"]
  },
  tokyo: {
    food: ["Tsukiji Fish Market", "Shibuya Food Streets", "Ameya-Yokochō", "Depachika"],
    history: ["Senso-ji Temple", "Imperial Palace", "Meiji Shrine", "Yasukuni Shrine"],
    art: ["Tokyo National Museum", "Mori Art Museum", "TeamLab Borderless", "21st Century Museum"],
    nature: ["Ueno Park", "Shinjuku Gyoen", "Imperial Palace East Garden", "Mount Takao"],
    "local life": ["Shibuya Crossing", "Akihabara", "Harajuku", "Golden Gai"]
  },
  // Indian cities
  delhi: {
    food: ["Chandni Chowk", "Khan Market", "Hauz Khas Village", "Dilli Haat"],
    history: ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb"],
    art: ["National Museum", "National Gallery", "Crafts Museum", "Kiran Nadar Museum"],
    nature: ["Lodhi Gardens", "Garden of Five Senses", "Deer Park", "Sanjay Van"],
    "local life": ["Connaught Place", "Hauz Khas", "Sunder Nagar", "Mehrauli"]
  },
  mumbai: {
    food: ["Crawford Market", "Chor Bazaar", "Bandra West", "Colaba Causeway"],
    history: ["Gateway of India", "Chhatrapati Shivaji Terminus", "Elephanta Caves", "Kanheri Caves"],
    art: ["CSMVS Museum", "National Gallery", "Jehangir Art Gallery", "Kala Ghoda"],
    nature: ["Sanjay Gandhi National Park", "Hanging Gardens", "Marine Drive", "Powai Lake"],
    "local life": ["Marine Drive", "Bandra-Worli Sea Link", "Dadar", "Fort Kochi"]
  },
  bangalore: {
    food: ["VV Puram Food Street", "Commercial Street", "Brigade Road", "Malleshwaram"],
    history: ["Bangalore Palace", "Tipu Sultan's Summer Palace", "Bugle Rock", "Devanahalli Fort"],
    art: ["National Gallery of Modern Art", "Government Museum", "Venkatappa Art Gallery", "Rangashankara"],
    nature: ["Lalbagh Botanical Garden", "Cubbon Park", "Bannerghatta Park", "Ulsoor Lake"],
    "local life": ["MG Road", "Brigade Road", "Indiranagar", "Koramangala"]
  },
  // Default fallback for any city
  default: {
    food: ["Central Market", "Food Street", "Local Restaurant District", "Night Market"],
    history: ["National Museum", "Historic Quarter", "Ancient Temple", "Heritage Site"],
    art: ["Art Gallery", "Cultural Center", "Artist Quarter", "Museum of Modern Art"],
    nature: ["Botanical Garden", "City Park", "Scenic Viewpoint", "Nature Reserve"],
    "local life": ["Town Square", "Community Center", "Local Market", "Cultural District"]
  }
};

// Generate personalized AI response with real places
async function generatePersonalizedPlan(data) {
  const { city, days, budget, interests } = data;
  const plan = {};
  
  // Normalize city name for database lookup
  const cityKey = city.toLowerCase().replace(/\s+/g, '');
  
  // Get places for the city (try exact match first, then fallback)
  let cityPlaces = famousPlacesDatabase[cityKey];
  if (!cityPlaces) {
    // Try partial matches
    const cityLower = city.toLowerCase();
    for (const [key, places] of Object.entries(famousPlacesDatabase)) {
      if (key !== 'default' && cityLower.includes(key) || key.includes(cityLower)) {
        cityPlaces = places;
        break;
      }
    }
  }
  
  // Use default if no match found
  if (!cityPlaces) {
    cityPlaces = famousPlacesDatabase.default;
    console.log('Using default places for city:', city);
  } else {
    console.log('Using specific places for city:', city);
  }
  
  // Budget modifiers for recommendations
  const budgetRecommendations = {
    low: "affordable local spots and free attractions",
    medium: "popular mid-range restaurants and paid attractions", 
    high: "premium experiences and exclusive venues"
  };
  
  for (let day = 1; day <= parseInt(days); day++) {
    const dayActivities = [];
    
    interests.forEach(interest => {
      const places = cityPlaces[interest] || famousPlacesDatabase.default[interest];
      if (places && places.length > 0) {
        // Select a random place for this interest
        const randomPlace = places[Math.floor(Math.random() * places.length)];
        dayActivities.push({
          name: randomPlace,
          category: interest
        });
      }
    });
    
    // Create detailed day plan
    plan[`day${day}`] = {
      places: dayActivities,
      description: `Explore ${dayActivities.map(p => p.name).join(", ")} - ${budgetRecommendations[budget]} in ${city || "your destination"}`
    };
  }
  
  return plan;
}

// Generate and display the plan (synchronous version for reliability)
function displayPlan() {
  if (!data || !data.city) {
    container.innerHTML = `
      <div class="card" style="text-align: center; grid-column: 1 / -1;">
        <h3>No Trip Data Found</h3>
        <p>Please plan a trip first to see your itinerary.</p>
        <button onclick="location.href='../index.html'">Plan Your Trip</button>
      </div>
    `;
    return;
  }
  
  // Show loading state briefly
  container.innerHTML = `
    <div class="card" style="text-align: center; grid-column: 1 / -1;">
      <h3>🔍 Creating Your Cultural Itinerary...</h3>
      <p>Finding the best places in ${data.city} for your interests...</p>
    </div>
  `;
  
  // Generate plan synchronously for reliability
  setTimeout(async () => {
    try {
      const aiResponse = await generatePersonalizedPlan(data);
      
      // Clear loading state
      container.innerHTML = '';
      
      Object.keys(aiResponse).forEach(day => {
        const card = document.createElement("div");
        card.className = "card";
        
        const places = aiResponse[day].places;
        const placesList = places.map(place => {
          const icons = {
            food: '🍽️',
            history: '🏛️',
            art: '🎨',
            nature: '🌿',
            'local life': '🏘️'
          };
          return `${icons[place.category] || '📍'} ${place.name}`;
        }).join('<br>');
        
        card.innerHTML = `
          <h3>${day.replace('day', 'Day ').toUpperCase()}</h3>
          <div style="margin: 15px 0;">
            <strong>Places to Visit:</strong><br>
            ${placesList}
          </div>
          <p style="margin-top: 15px; color: #666; font-style: italic;">
            ${aiResponse[day].description}
          </p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
            <small style="color: #888;">💡 Tip: Check opening hours and book tickets in advance for popular attractions</small>
          </div>
        `;
        
        container.appendChild(card);
      });
      
    } catch (error) {
      console.error('Error generating plan:', error);
      container.innerHTML = `
        <div class="card" style="text-align: center; grid-column: 1 / -1;">
          <h3>⚠️ Unable to Generate Itinerary</h3>
          <p>We couldn't create your itinerary for ${data.city}. Please try again.</p>
          <button onclick="location.reload()">Try Again</button>
        </div>
      `;
    }
  }, 1000); // Brief loading delay for better UX
}

// Initialize the plan display
displayPlan();
