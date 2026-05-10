import { getDb } from "../api/queries/connection";
import { destinations, destinationActivities } from "./schema";

const destinationData = [
  {
    city: "Tokyo",
    country: "Japan",
    region: "asia" as const,
    description: "A dazzling metropolis where ancient traditions meet cutting-edge technology. Explore neon-lit streets, serene temples, and world-class cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    costIndex: 75,
    popularity: 95,
    tags: ["temples", "food", "shopping", "nightlife"],
  },
  {
    city: "Paris",
    country: "France",
    region: "europe" as const,
    description: "The City of Light enchants with iconic landmarks, exquisite art, café culture, and some of the world's finest dining.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    costIndex: 85,
    popularity: 98,
    tags: ["romance", "museums", "food", "architecture"],
  },
  {
    city: "Bali",
    country: "Indonesia",
    region: "asia" as const,
    description: "A tropical paradise of rice terraces, ancient temples, surf breaks, and spiritual retreats in the heart of Indonesia.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    costIndex: 40,
    popularity: 92,
    tags: ["beach", "temples", "surfing", "yoga"],
  },
  {
    city: "New York",
    country: "United States",
    region: "americas" as const,
    description: "The city that never sleeps. From Broadway to Brooklyn, experience unmatched energy, diversity, and iconic landmarks.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    costIndex: 90,
    popularity: 96,
    tags: ["nightlife", "museums", "shopping", "food"],
  },
  {
    city: "Santorini",
    country: "Greece",
    region: "europe" as const,
    description: "Iconic white-washed buildings perched on volcanic cliffs overlooking the sapphire Aegean Sea. Unforgettable sunsets await.",
    imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    costIndex: 80,
    popularity: 88,
    tags: ["romance", "views", "beach", "wine"],
  },
  {
    city: "Rome",
    country: "Italy",
    region: "europe" as const,
    description: "The Eternal City captivates with ancient ruins, Renaissance art, vibrant piazzas, and legendary Italian cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    costIndex: 70,
    popularity: 94,
    tags: ["history", "food", "museums", "architecture"],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    region: "asia" as const,
    description: "A vibrant city of golden temples, floating markets, street food paradise, and bustling nightlife along the Chao Phraya.",
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    costIndex: 35,
    popularity: 90,
    tags: ["temples", "street food", "nightlife", "markets"],
  },
  {
    city: "Sydney",
    country: "Australia",
    region: "oceania" as const,
    description: "Harbour city beauty with the iconic Opera House, golden beaches, and a laid-back outdoor lifestyle.",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    costIndex: 85,
    popularity: 87,
    tags: ["harbour", "beaches", "outdoor", "food"],
  },
  {
    city: "Cape Town",
    country: "South Africa",
    region: "africa" as const,
    description: "Stunning landscapes where Table Mountain meets the Atlantic. World-class wine regions and diverse wildlife nearby.",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    costIndex: 45,
    popularity: 82,
    tags: ["mountains", "wine", "wildlife", "beaches"],
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    region: "asia" as const,
    description: "A futuristic oasis of luxury shopping, ultramodern architecture, desert adventures, and world-record-breaking attractions.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    costIndex: 88,
    popularity: 91,
    tags: ["luxury", "shopping", "desert", "architecture"],
  },
  {
    city: "London",
    country: "United Kingdom",
    region: "europe" as const,
    description: "A timeless capital blending royal heritage, world-class theatre, diverse neighborhoods, and iconic landmarks.",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    costIndex: 88,
    popularity: 97,
    tags: ["history", "theatre", "museums", "parks"],
  },
  {
    city: "Barcelona",
    country: "Spain",
    region: "europe" as const,
    description: "Gaudi's architectural masterpieces, Mediterranean beaches, vibrant tapas culture, and a lively arts scene.",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    costIndex: 65,
    popularity: 93,
    tags: ["architecture", "beach", "food", "nightlife"],
  },
  {
    city: "Cancun",
    country: "Mexico",
    region: "americas" as const,
    description: "Turquoise Caribbean waters, white sand beaches, ancient Mayan ruins, and vibrant nightlife on the Yucatan Peninsula.",
    imageUrl: "https://images.unsplash.com/photo-1552074291-ad4df87b13ce?w=800&q=80",
    costIndex: 55,
    popularity: 86,
    tags: ["beach", "ruins", "diving", "nightlife"],
  },
  {
    city: "Kyoto",
    country: "Japan",
    region: "asia" as const,
    description: "Japan's cultural heart with thousands of classical Buddhist temples, gardens, imperial palaces, and traditional geisha districts.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    costIndex: 60,
    popularity: 89,
    tags: ["temples", "gardens", "culture", "food"],
  },
  {
    city: "Marrakech",
    country: "Morocco",
    region: "africa" as const,
    description: "A sensory feast of colorful souks, ornate palaces, aromatic spices, and the magic of the Sahara at your doorstep.",
    imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    costIndex: 35,
    popularity: 84,
    tags: ["markets", "desert", "culture", "food"],
  },
];

const activityData: Record<number, Array<{ name: string; description: string; type: "sightseeing" | "food" | "transport" | "stay" | "other"; avgCost: string; duration: string }>> = {
  0: [ // Tokyo
    { name: "Senso-ji Temple Visit", description: "Explore Tokyo's oldest Buddhist temple in Asakusa", type: "sightseeing", avgCost: "0", duration: "2 hours" },
    { name: "Sushi Omakase Dinner", description: "Premium sushi tasting at a Michelin-starred restaurant", type: "food", avgCost: "150", duration: "2 hours" },
    { name: "Shibuya Crossing Walk", description: "Experience the world's busiest pedestrian crossing", type: "sightseeing", avgCost: "0", duration: "30 min" },
    { name: "Tsukiji Outer Market Tour", description: "Street food tour through the legendary fish market", type: "food", avgCost: "40", duration: "3 hours" },
    { name: "Tokyo Metro Day Pass", description: "Unlimited rides on Tokyo subway and JR lines", type: "transport", avgCost: "15", duration: "1 day" },
  ],
  1: [ // Paris
    { name: "Louvre Museum", description: "See the Mona Lisa and world-class art collections", type: "sightseeing", avgCost: "22", duration: "4 hours" },
    { name: "Eiffel Tower Summit", description: "Panoramic views from the iconic iron lady", type: "sightseeing", avgCost: "35", duration: "2 hours" },
    { name: "Seine River Cruise", description: "Scenic boat tour past Notre-Dame and landmarks", type: "sightseeing", avgCost: "18", duration: "1 hour" },
    { name: "French Pastry Class", description: "Learn to make croissants and macarons", type: "food", avgCost: "80", duration: "3 hours" },
    { name: "Montmartre Walking Tour", description: "Explore the artistic heart of Paris", type: "sightseeing", avgCost: "25", duration: "3 hours" },
  ],
  2: [ // Bali
    { name: "Tegallalang Rice Terraces", description: "Walk through stunning UNESCO-recognized rice paddies", type: "sightseeing", avgCost: "5", duration: "2 hours" },
    { name: "Uluwatu Temple Sunset", description: "Cliff-top temple with traditional Kecak fire dance", type: "sightseeing", avgCost: "15", duration: "3 hours" },
    { name: "Balinese Cooking Class", description: "Learn to cook authentic Balinese dishes", type: "food", avgCost: "35", duration: "4 hours" },
    { name: "Mount Batur Sunrise Trek", description: "Pre-dawn hike to watch sunrise from the volcano", type: "other", avgCost: "50", duration: "6 hours" },
    { name: "Surf Lesson in Canggu", description: "Beginner-friendly surf session", type: "other", avgCost: "30", duration: "2 hours" },
  ],
  3: [ // New York
    { name: "Statue of Liberty & Ellis Island", description: "Ferry to the iconic symbol of freedom", type: "sightseeing", avgCost: "25", duration: "4 hours" },
    { name: "Broadway Show", description: "World-class theatre performance in Times Square", type: "other", avgCost: "120", duration: "3 hours" },
    { name: "Central Park Bike Tour", description: "Guided cycling through the iconic urban park", type: "sightseeing", avgCost: "50", duration: "2 hours" },
    { name: "Brooklyn Food Tour", description: "Taste your way through Williamsburg's best eateries", type: "food", avgCost: "65", duration: "3 hours" },
    { name: "Empire State Building", description: "360-degree views from the 86th floor observatory", type: "sightseeing", avgCost: "45", duration: "2 hours" },
  ],
  4: [ // Santorini
    { name: "Oia Sunset Viewing", description: "Watch the world-famous sunset from Oia village", type: "sightseeing", avgCost: "0", duration: "2 hours" },
    { name: "Wine Tasting Tour", description: "Sample volcanic wines at local vineyards", type: "food", avgCost: "55", duration: "3 hours" },
    { name: "Caldera Boat Cruise", description: "Sail the volcanic crater with hot springs swim", type: "other", avgCost: "80", duration: "5 hours" },
    { name: "Akrotiri Archaeological Site", description: "Explore the ancient Minoan Pompeii", type: "sightseeing", avgCost: "15", duration: "2 hours" },
  ],
  5: [ // Rome
    { name: "Colosseum & Roman Forum", description: "Walk through ancient Rome's greatest amphitheater", type: "sightseeing", avgCost: "18", duration: "3 hours" },
    { name: "Vatican Museums & Sistine Chapel", description: "Michelangelo's masterpiece and papal art collections", type: "sightseeing", avgCost: "20", duration: "4 hours" },
    { name: "Pasta Making Class", description: "Learn to make fresh pasta from Roman chefs", type: "food", avgCost: "65", duration: "3 hours" },
    { name: "Trevi Fountain & Spanish Steps", description: "Iconic landmarks of the historic center", type: "sightseeing", avgCost: "0", duration: "1 hour" },
  ],
  6: [ // Bangkok
    { name: "Grand Palace & Wat Phra Kaew", description: "Thailand's most sacred temple and former royal residence", type: "sightseeing", avgCost: "15", duration: "3 hours" },
    { name: "Chatuchak Weekend Market", description: "One of the world's largest outdoor markets", type: "other", avgCost: "20", duration: "4 hours" },
    { name: "Street Food Tour", description: "Guided tasting of Bangkok's legendary street cuisine", type: "food", avgCost: "35", duration: "3 hours" },
    { name: "Wat Arun at Sunset", description: "The Temple of Dawn illuminated at golden hour", type: "sightseeing", avgCost: "5", duration: "1 hour" },
  ],
  7: [ // Sydney
    { name: "Sydney Opera House Tour", description: "Behind-the-scenes at the iconic performing arts venue", type: "sightseeing", avgCost: "30", duration: "1 hour" },
    { name: "Bondi to Coogee Coastal Walk", description: "Scenic cliff-top walking trail past beaches", type: "other", avgCost: "0", duration: "3 hours" },
    { name: "Harbour Bridge Climb", description: "Scale the iconic bridge for panoramic views", type: "other", avgCost: "180", duration: "3 hours" },
    { name: "Taronga Zoo", description: "Native Australian wildlife with harbour views", type: "sightseeing", avgCost: "40", duration: "5 hours" },
  ],
  8: [ // Cape Town
    { name: "Table Mountain Cable Car", description: "Ascend to the flat-topped mountain's summit", type: "sightseeing", avgCost: "25", duration: "2 hours" },
    { name: "Robben Island Tour", description: "Visit Nelson Mandela's former prison", type: "sightseeing", avgCost: "20", duration: "4 hours" },
    { name: "Stellenbosch Wine Tour", description: "Tasting tour through Cape Winelands", type: "food", avgCost: "75", duration: "6 hours" },
    { name: "Boulders Beach Penguins", description: "Walk among a colony of African penguins", type: "sightseeing", avgCost: "10", duration: "2 hours" },
  ],
  9: [ // Dubai
    { name: "Burj Khalifa At The Top", description: "Views from the world's tallest building", type: "sightseeing", avgCost: "45", duration: "2 hours" },
    { name: "Desert Safari", description: "Dune bashing, camel ride, and Bedouin dinner", type: "other", avgCost: "80", duration: "6 hours" },
    { name: "Dubai Mall & Fountain Show", description: "World's largest mall with spectacular water show", type: "other", avgCost: "0", duration: "3 hours" },
    { name: "Old Dubai Souks", description: "Gold and spice markets in the historic district", type: "other", avgCost: "0", duration: "2 hours" },
  ],
  10: [ // London
    { name: "British Museum", description: "World's history under one roof, free entry", type: "sightseeing", avgCost: "0", duration: "3 hours" },
    { name: "Tower of London", description: "Crown Jewels and 1000 years of history", type: "sightseeing", avgCost: "35", duration: "3 hours" },
    { name: "West End Theatre Show", description: "World-class musical or play", type: "other", avgCost: "80", duration: "3 hours" },
    { name: "Thames River Cruise", description: "Sightseeing boat from Westminster to Greenwich", type: "sightseeing", avgCost: "15", duration: "1 hour" },
  ],
  11: [ // Barcelona
    { name: "Sagrada Familia", description: "Gaudi's unfinished masterpiece basilica", type: "sightseeing", avgCost: "28", duration: "2 hours" },
    { name: "Park Guell", description: "Colorful mosaic park with city views", type: "sightseeing", avgCost: "12", duration: "2 hours" },
    { name: "Tapas Crawl in El Born", description: "Evening tapas hopping through the Gothic Quarter", type: "food", avgCost: "45", duration: "3 hours" },
    { name: "Camp Nou Stadium Tour", description: "Behind the scenes at FC Barcelona's home", type: "other", avgCost: "30", duration: "2 hours" },
  ],
  12: [ // Cancun
    { name: "Chichen Itza Day Trip", description: "Visit the ancient Mayan Wonder of the World", type: "sightseeing", avgCost: "60", duration: "10 hours" },
    { name: "Isla Mujeres Catamaran", description: "Sail to a Caribbean island paradise", type: "other", avgCost: "70", duration: "6 hours" },
    { name: "Cenote Swimming", description: "Swim in crystal-clear natural sinkholes", type: "other", avgCost: "15", duration: "2 hours" },
    { name: "Mexican Cooking Class", description: "Learn authentic Yucatecan recipes", type: "food", avgCost: "50", duration: "3 hours" },
  ],
  13: [ // Kyoto
    { name: "Fushimi Inari Shrine", description: "Walk through thousands of vermillion torii gates", type: "sightseeing", avgCost: "0", duration: "3 hours" },
    { name: "Arashiyama Bamboo Grove", description: "Stroll through the iconic bamboo forest", type: "sightseeing", avgCost: "0", duration: "1 hour" },
    { name: "Tea Ceremony Experience", description: "Traditional Japanese tea ritual in a machiya", type: "other", avgCost: "40", duration: "1 hour" },
    { name: "Kaiseki Dinner", description: "Multi-course traditional Japanese haute cuisine", type: "food", avgCost: "120", duration: "2 hours" },
  ],
  14: [ // Marrakech
    { name: "Jemaa el-Fnaa Square", description: "Vibrant market square with performers and food stalls", type: "sightseeing", avgCost: "10", duration: "2 hours" },
    { name: "Majorelle Garden", description: "Botanical garden designed by Yves Saint Laurent", type: "sightseeing", avgCost: "15", duration: "1 hour" },
    { name: "Atlas Mountains Day Trip", description: "Hike through Berber villages", type: "other", avgCost: "55", duration: "8 hours" },
    { name: "Moroccan Hammam", description: "Traditional steam bath and body treatment", type: "other", avgCost: "30", duration: "2 hours" },
  ],
};

async function seed() {
  const db = getDb();
  console.log("Seeding destinations...");

  for (const dest of destinationData) {
    const [inserted] = await db.insert(destinations).values(dest);
    const destId = inserted.insertId;
    const acts = activityData[destinationData.indexOf(dest)];
    if (acts) {
      for (const act of acts) {
        await db.insert(destinationActivities).values({
          destinationId: destId,
          ...act,
        });
      }
    }
  }

  console.log(`Seeded ${destinationData.length} destinations with activities.`);
}

seed().catch(console.error);
