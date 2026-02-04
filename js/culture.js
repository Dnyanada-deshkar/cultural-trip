const trip = JSON.parse(localStorage.getItem("tripData"));
const container = document.getElementById("cultureData");

// Generate comprehensive cultural information based on interests
function generateCultureInfo(trip) {
  const cultureData = [];
  
  // General city information
  cultureData.push({
    title: "🏛️ City Overview",
    icon: "🏛️",
    content: [
      `<strong>Destination:</strong> ${trip.city || 'Your chosen destination'}`,
      `<strong>Best Time to Visit:</strong> Spring and Autumn offer pleasant weather for cultural exploration`,
      `<strong>Language:</strong> Learn basic phrases like "Hello," "Thank you," and "Excuse me" in the local language`,
      `<strong>Currency:</strong> Carry local currency for markets and small establishments`
    ],
    tips: "Always carry a city map and download offline translation apps for better navigation."
  });
  
  // Interest-based cultural information
  if (trip.interests && trip.interests.length > 0) {
    trip.interests.forEach(interest => {
      switch(interest) {
        case 'food':
          cultureData.push({
            title: "🍽️ Food Culture",
            icon: "🍽️",
            content: [
              `<strong>Local Etiquette:</strong> Wait for the host to begin eating before you start`,
              `<strong>Must-Try Dishes:</strong> Ask locals for recommendations on authentic regional specialties`,
              `<strong>Dining Times:</strong> Research typical meal times as they vary by culture`,
              `<strong>Street Food:</strong> Choose busy stalls with high turnover for the freshest options`,
              `<strong>Tipping:</strong> Learn local tipping customs to avoid over or under-tipping`
            ],
            tips: "Visit local markets early in the morning for the freshest ingredients and most authentic experience."
          });
          break;
          
        case 'history':
          cultureData.push({
            title: "📚 Historical Heritage",
            icon: "📚",
            content: [
              `<strong>Historical Timeline:</strong> Research key historical periods that shaped the city`,
              `<strong>Heritage Sites:</strong> Many sites require advance booking - plan ahead`,
              `<strong>Guided Tours:</strong> Local guides provide insights you won't find in guidebooks`,
              `<strong>Photography Rules:</strong> Some historical sites restrict photography - check beforehand`,
              `<strong>Dress Code:</strong> Religious and historical sites often require modest dress`
            ],
            tips: "Visit museums during weekday mornings to avoid crowds and have more time with exhibits."
          });
          break;
          
        case 'art':
          cultureData.push({
            title: "🎨 Art & Crafts",
            icon: "🎨",
            content: [
              `<strong>Local Artisans:</strong> Visit workshops to see traditional crafts being made`,
              `<strong>Art Galleries:</strong> Many offer free admission on certain days`,
              `<strong>Street Art:</strong> Take walking tours to discover hidden murals and graffiti`,
              `<strong>Art Markets:</strong> Purchase directly from artists to support local creativity`,
              `<strong>Cultural Performances:</strong> Check local event listings for traditional dance and music`
            ],
            tips: "Ask artisans about the stories behind their crafts - many have fascinating cultural significance."
          });
          break;
          
        case 'nature':
          cultureData.push({
            title: "🌿 Natural Heritage",
            icon: "🌿",
            content: [
              `<strong>National Parks:</strong> Many have cultural significance beyond natural beauty`,
              `<strong>Botanical Gardens:</strong> Often feature native plants with cultural importance`,
              `<strong>Eco-Tours:</strong> Choose operators who respect local environmental practices`,
              `<strong>Seasonal Changes:</strong> Research how seasons affect cultural activities and landscapes`,
              `<strong>Wildlife:</strong> Learn about animals that hold cultural significance in the region`
            ],
            tips: "Hire local naturalist guides who can explain both ecological and cultural aspects of the landscape."
          });
          break;
          
        case 'local life':
          cultureData.push({
            title: "🏘️ Daily Life & Customs",
            icon: "🏘️",
            content: [
              `<strong>Greeting Customs:</strong> Learn appropriate greetings for different social situations`,
              `<strong>Personal Space:</strong> Cultural norms about personal distance vary significantly`,
              `<strong>Gift Giving:</strong> Understand local customs if you plan to bring gifts`,
              `<strong>Public Behavior:</strong> Research norms about public displays and social interactions`,
              `<strong>Religious Customs:</strong> Be aware of prayer times and religious holidays`
            ],
            tips: "Spend time in neighborhood cafes and parks to observe daily life and interact with locals."
          });
          break;
      }
    });
  }
  
  // General cultural tips
  cultureData.push({
    title: "💡 Essential Cultural Tips",
    icon: "💡",
    content: [
      `<strong>Respect:</strong> Always be respectful of local customs, even if they differ from your own`,
      `<strong>Patience:</strong> Cultural approaches to time and service may differ from what you're used to`,
      `<strong>Curiosity:</strong> Ask questions politely - most people appreciate genuine interest`,
      `<strong>Flexibility:</strong> Plans may change due to cultural factors - embrace the unexpected`,
      `<strong>Documentation:</strong> Keep copies of important documents and know local emergency numbers`
    ],
    tips: "Keep a small journal to record cultural observations and insights during your journey."
  });
  
  return cultureData;
}

// Display cultural information
function displayCultureInfo() {
  if (!trip) {
    container.innerHTML = `
      <div class="culture-card" style="grid-column: 1 / -1; text-align: center;">
        <h3>No Trip Data Found</h3>
        <p>Please plan a trip first to access cultural information.</p>
        <button onclick="location.href='../index.html'">Plan Your Trip</button>
      </div>
    `;
    return;
  }
  
  const cultureData = generateCultureInfo(trip);
  
  cultureData.forEach(section => {
    const card = document.createElement('div');
    card.className = 'culture-card';
    
    const listItems = section.content.map(item => 
      `<li>
        <span class="bullet">•</span>
        <span class="content">${item}</span>
      </li>`
    ).join('');
    
    card.innerHTML = `
      <h3>
        <span class="icon">${section.icon}</span>
        ${section.title}
      </h3>
      <ul class="culture-list">
        ${listItems}
      </ul>
      ${section.tips ? `
        <div class="tip-box">
          <strong>💡 Pro Tip:</strong> ${section.tips}
        </div>
      ` : ''}
    `;
    
    container.appendChild(card);
  });
}

// Load Wikipedia information if available
function loadWikipediaInfo() {
  if (trip && trip.city) {
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(trip.city)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.extract && data.extract !== 'Not found.') {
          const wikiCard = document.createElement('div');
          wikiCard.className = 'culture-card';
          wikiCard.style.gridColumn = '1 / -1';
          wikiCard.innerHTML = `
            <h3>
              <span class="icon">📖</span>
              About ${trip.city}
            </h3>
            <p style="line-height: 1.6; color: #2d4a2d;">${data.extract}</p>
            ${data.content_urls && data.content_urls.desktop ? 
              `<p style="margin-top: 15px;">
                <a href="${data.content_urls.desktop.page}" target="_blank" 
                   style="color: #4a7c4a; text-decoration: none; font-weight: 500;">
                  📚 Read more on Wikipedia →
                </a>
              </p>` : ''}
          `;
          container.insertBefore(wikiCard, container.firstChild);
        }
      })
      .catch(error => {
        console.log('Wikipedia info not available:', error);
      });
  }
}

// Initialize the page
displayCultureInfo();
loadWikipediaInfo();

