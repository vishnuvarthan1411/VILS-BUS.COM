// seedData.js - Comprehensive Indian Bus Booking Seed Dataset for VILS BUS.COM
import bcrypt from 'bcryptjs';

export const CITIES = [
  {
    id: "BLR",
    name: "Bengaluru",
    state: "Karnataka",
    popularPoints: [
      { name: "Majestic (KBS)", landmark: "Platform 12, Majestic Terminal" },
      { name: "Electronic City", landmark: "Toll Gate Bus Bay" },
      { name: "Silk Board", landmark: "Near Silk Board Flyover Junction" },
      { name: "Madiwala", landmark: "Near Total Mall & A2B" },
      { name: "Indiranagar", landmark: "CMH Road Metro Station" },
      { name: "Yeshwanthpur", landmark: "Govardhan Theater" },
      { name: "Marathahalli", landmark: "Multiplex Bridge" },
      { name: "Hebbal", landmark: "Esteem Mall Entrance" }
    ]
  },
  {
    id: "MAA",
    name: "Chennai",
    state: "Tamil Nadu",
    popularPoints: [
      { name: "Koyambedu (CMBT)", landmark: "Omni Bus Stand, Platform 3" },
      { name: "Guindy", landmark: "Guindy Metro Bus Stop" },
      { name: "Tambaram", landmark: "Tambaram West Bus Stand" },
      { name: "Perungalathur", landmark: "Near Railway Station Footover" },
      { name: "Sriperumbudur", landmark: "Toll Plaza Pickup Bay" },
      { name: "Ashok Nagar", landmark: "Pillar Metro Station" },
      { name: "Sholinganallur", landmark: "OMR Junction" }
    ]
  },
  {
    id: "HYD",
    name: "Hyderabad",
    state: "Telangana",
    popularPoints: [
      { name: "Ameerpet", landmark: "Big Bazaar Lane" },
      { name: "Gachibowli", landmark: "ORR Outer Ring Road Junction" },
      { name: "Kukatpally", landmark: "JNTU Metro Pillar 614" },
      { name: "MGBS", landmark: "Mahatma Gandhi Bus Station Gate 2" },
      { name: "Lakdikapul", landmark: "Near Petrol Pump" },
      { name: "Miyapur", landmark: "Allwyn X Road" },
      { name: "Shamshabad", landmark: "Airport Approach Road" }
    ]
  },
  {
    id: "BOM",
    name: "Mumbai",
    state: "Maharashtra",
    popularPoints: [
      { name: "Borivali East", landmark: "National Park Bridge" },
      { name: "Andheri East", landmark: "Bisleri Compound Western Exp Hwy" },
      { name: "Sion", landmark: "Chunabhatti Flyover" },
      { name: "Vashi", landmark: "Old Toll Plaza, Sector 17" },
      { name: "Dadar East", landmark: "Pritam Hotel" },
      { name: "Thane West", landmark: "Teen Hath Naka" }
    ]
  },
  {
    id: "PNQ",
    name: "Pune",
    state: "Maharashtra",
    popularPoints: [
      { name: "Wakad", landmark: "Ginger Hotel Highway Bridge" },
      { name: "Hinjawadi", landmark: "Phase 1 Bridge Point" },
      { name: "Shivajinagar", landmark: "Bank of Maharashtra Bus Bay" },
      { name: "Swargate", landmark: "Laxmi Narayan Cinema" },
      { name: "Viman Nagar", landmark: "Near Phoenix Marketcity" }
    ]
  },
  {
    id: "CJB",
    name: "Coimbatore",
    state: "Tamil Nadu",
    popularPoints: [
      { name: "Gandhipuram", landmark: "SETC Central Bus Stand" },
      { name: "Omni Bus Stand", landmark: "Sathy Road" },
      { name: "Hopes College", landmark: "Avinashi Road" },
      { name: "Ukkadam", landmark: "Bus Terminus" },
      { name: "KMCH", landmark: "Civil Aerodrome Post" }
    ]
  },
  {
    id: "IXM",
    name: "Madurai",
    state: "Tamil Nadu",
    popularPoints: [
      { name: "Mattuthavani", landmark: "Integrated Bus Terminus" },
      { name: "Periyar Bus Stand", landmark: "Near Railway Junction" },
      { name: "Arapalayam", landmark: "Omni Bus Depot" },
      { name: "Thirunagar", landmark: "Bus Stop Junction" }
    ]
  },
  {
    id: "DEL",
    name: "Delhi",
    state: "Delhi NCR",
    popularPoints: [
      { name: "Kashmere Gate ISBT", landmark: "Gate 1, Metro Station" },
      { name: "Dhaula Kuan", landmark: "Metro Station Underpass" },
      { name: "Majnu Ka Tilla", landmark: "Gurudwara Tibetan Colony" },
      { name: "Sarai Kale Khan ISBT", landmark: "Ring Road" },
      { name: "Mahipalpur", landmark: "Airport Flyover" }
    ]
  },
  {
    id: "JAI",
    name: "Jaipur",
    state: "Rajasthan",
    popularPoints: [
      { name: "Sindhi Camp", landmark: "Central Bus Stand Gate 3" },
      { name: "Narayan Singh Circle", landmark: "City Palace Highway Entry" },
      { name: "200 Feet Bypass", landmark: "Ajmer Road Junction" },
      { name: "Transport Nagar", landmark: "Delhi Highway Toll" }
    ]
  },
  {
    id: "GOI",
    name: "Goa",
    state: "Goa",
    popularPoints: [
      { name: "Panaji", landmark: "KTC Bus Stand Platform 4" },
      { name: "Mapusa", landmark: "New Bus Stand, North Goa" },
      { name: "Madgaon (Margao)", landmark: "KTC Bus Terminus, South Goa" }
    ]
  },
  {
    id: "COK",
    name: "Kochi",
    state: "Kerala",
    popularPoints: [
      { name: "Vyttila Mobility Hub", landmark: "KSRTC / Private Bay 7" },
      { name: "Edappally", landmark: "Lulu Mall Junction" },
      { name: "Aluva", landmark: "Near Aluva Metro Station & Railway" }
    ]
  },
  {
    id: "TIR",
    name: "Tirupati",
    state: "Andhra Pradesh",
    popularPoints: [
      { name: "RTC Central Bus Station", landmark: "Platform 10" },
      { name: "Alipiri", landmark: "Toll Gate Entrance to Hills" },
      { name: "Leela Mahal", landmark: "Circle Bus Bay" }
    ]
  },
  {
    id: "MYS",
    name: "Mysore",
    state: "Karnataka",
    popularPoints: [
      { name: "Suburban Bus Stand", landmark: "Platform 5" },
      { name: "Columbia Asia Hospital", landmark: "Bangalore-Mysore Highway" },
      { name: "Infosys Campus", landmark: "Hebbal Industrial Area Gate" }
    ]
  },
  {
    id: "PDY",
    name: "Pondicherry",
    state: "Puducherry",
    popularPoints: [
      { name: "New Bus Stand", landmark: "Maraimalai Adigal Salai" },
      { name: "Jipmer Circle", landmark: "Gorimedu Gate" },
      { name: "ECR Toll Plaza", landmark: "Chennai Road" }
    ]
  }
];

export const POPULAR_ROUTES = [
  { from: "Bengaluru", to: "Chennai", distance: "350 km", avgDuration: "5h 45m", startingPrice: 599, busCount: 42 },
  { from: "Bengaluru", to: "Hyderabad", distance: "570 km", avgDuration: "8h 15m", startingPrice: 799, busCount: 38 },
  { from: "Mumbai", to: "Pune", distance: "150 km", avgDuration: "3h 30m", startingPrice: 349, busCount: 56 },
  { from: "Bengaluru", to: "Coimbatore", distance: "365 km", avgDuration: "6h 30m", startingPrice: 650, busCount: 28 },
  { from: "Delhi", to: "Jaipur", distance: "280 km", avgDuration: "5h 00m", startingPrice: 449, busCount: 34 },
  { from: "Chennai", to: "Madurai", distance: "460 km", avgDuration: "7h 15m", startingPrice: 699, busCount: 25 },
  { from: "Bengaluru", to: "Goa", distance: "560 km", avgDuration: "11h 00m", startingPrice: 999, busCount: 19 },
  { from: "Hyderabad", to: "Vijayawada", distance: "275 km", avgDuration: "5h 00m", startingPrice: 499, busCount: 30 }
];

export const OFFERS = [
  {
    id: "OFFER1",
    code: "VILSFIRST",
    title: "Flat ₹150 OFF for New Users",
    description: "Get ₹150 instant discount on your first bus booking with VILS BUS.COM.",
    discountType: "flat",
    discountValue: 150,
    minBookingAmount: 400,
    validTill: "2026-12-31",
    badge: "NEW USER",
    color: "#d84e55"
  },
  {
    id: "OFFER2",
    code: "VILS20",
    title: "20% OFF up to ₹250",
    description: "Save big on all premium AC Sleeper & Volvo bus bookings across India.",
    discountType: "percent",
    discountValue: 20,
    maxDiscount: 250,
    minBookingAmount: 800,
    validTill: "2026-11-30",
    badge: "POPULAR",
    color: "#ff5722"
  },
  {
    id: "OFFER3",
    code: "SUPERDEAL",
    title: "Flat ₹100 Cashback/Discount",
    description: "Applicable on all weekend routes and intercity overnight rides.",
    discountType: "flat",
    discountValue: 100,
    minBookingAmount: 600,
    validTill: "2026-12-15",
    badge: "WEEKEND SPECIAL",
    color: "#e91e63"
  },
  {
    id: "OFFER4",
    code: "FESTIVE50",
    title: "Flat ₹50 OFF No Minimum Fare",
    description: "Everyday commute discount on express and semi-sleeper services.",
    discountType: "flat",
    discountValue: 50,
    minBookingAmount: 200,
    validTill: "2026-12-31",
    badge: "EVERYDAY",
    color: "#4caf50"
  }
];

export const FAQS = [
  {
    category: "Booking & Tickets",
    question: "How do I book a bus ticket on VILS BUS.COM?",
    answer: "Simply enter your departure city, destination, and travel date on the homepage. Browse available buses, select your preferred seats, enter passenger details, choose boarding/dropping points, and proceed to our secure mock checkout."
  },
  {
    category: "Seat Holds",
    question: "How long are my selected seats reserved during checkout?",
    answer: "When you select seats on VILS BUS.COM, our backend server places a 10-minute temporary seat hold to ensure nobody else books them while you complete payment. If payment isn't completed within 10 minutes, the hold expires automatically."
  },
  {
    category: "Cancellation & Refunds",
    question: "What is the cancellation and refund policy?",
    answer: "You can cancel confirmed tickets from 'My Bookings'. Cancellation > 24 hours prior to departure gives a 90% refund; 12–24 hours gives a 75% refund; 4–12 hours gives a 50% refund. Cancellations under 4 hours are non-refundable."
  },
  {
    category: "Payment",
    question: "What payment methods are supported?",
    answer: "In development mode, VILS BUS.COM features an interactive mock payment simulator supporting UPI / QR Code, Credit & Debit Cards, Net Banking, and Mobile Wallets. No actual money is transferred."
  },
  {
    category: "Safety & Ladies Seats",
    question: "Are there dedicated seats for solo female travelers?",
    answer: "Yes, VILS BUS.COM features pink-tinted 'Ladies Reserved' seats in both lower and upper decks. Adjacent berths to female travelers are reserved exclusively for women."
  }
];

// Helper to generate a realistic seat layout for sleeper / seater buses
export function generateSeatLayout(busType, baseFare) {
  const seats = [];
  const isSleeper = busType.toLowerCase().includes('sleeper');
  
  if (isSleeper) {
    // 2+1 Sleeper Layout: Lower deck (L1-L15) and Upper deck (U1-U15)
    // Lower Deck: 5 rows of 3 seats (Single window, double row)
    for (let row = 1; row <= 5; row++) {
      // Single Berth (Left window)
      seats.push({
        seatNo: `L${(row - 1) * 3 + 1}`,
        deck: "lower",
        type: "sleeper",
        berth: "single",
        row,
        col: 1,
        price: baseFare + 50,
        isWindow: true,
        isLadies: row === 1 || row === 2, // L1, L4 reserved for ladies
        status: Math.random() < 0.25 ? "booked" : "available"
      });

      // Double Berths (Right side: aisle and window)
      seats.push({
        seatNo: `L${(row - 1) * 3 + 2}`,
        deck: "lower",
        type: "sleeper",
        berth: "double",
        row,
        col: 2,
        price: baseFare,
        isWindow: false,
        isLadies: false,
        status: Math.random() < 0.2 ? "booked" : "available"
      });

      seats.push({
        seatNo: `L${(row - 1) * 3 + 3}`,
        deck: "lower",
        type: "sleeper",
        berth: "double",
        row,
        col: 3,
        price: baseFare + 30,
        isWindow: true,
        isLadies: false,
        status: Math.random() < 0.3 ? "booked" : "available"
      });
    }

    // Upper Deck: 5 rows of 3 sleeper berths
    for (let row = 1; row <= 5; row++) {
      seats.push({
        seatNo: `U${(row - 1) * 3 + 1}`,
        deck: "upper",
        type: "sleeper",
        berth: "single",
        row,
        col: 1,
        price: baseFare + 80,
        isWindow: true,
        isLadies: row === 1, // U1 reserved for ladies
        status: Math.random() < 0.2 ? "booked" : "available"
      });

      seats.push({
        seatNo: `U${(row - 1) * 3 + 2}`,
        deck: "upper",
        type: "sleeper",
        berth: "double",
        row,
        col: 2,
        price: baseFare + 20,
        isWindow: false,
        isLadies: false,
        status: Math.random() < 0.25 ? "booked" : "available"
      });

      seats.push({
        seatNo: `U${(row - 1) * 3 + 3}`,
        deck: "upper",
        type: "sleeper",
        berth: "double",
        row,
        col: 3,
        price: baseFare + 50,
        isWindow: true,
        isLadies: false,
        status: Math.random() < 0.15 ? "booked" : "available"
      });
    }
  } else {
    // 2+2 Semi-Sleeper / Seater layout: 9 rows of 4 seats (S1 to S36)
    for (let row = 1; row <= 8; row++) {
      // Left window
      seats.push({
        seatNo: `${(row - 1) * 4 + 1}`,
        deck: "lower",
        type: "seater",
        berth: "chair",
        row,
        col: 1,
        price: baseFare + 20,
        isWindow: true,
        isLadies: row === 1,
        status: Math.random() < 0.2 ? "booked" : "available"
      });
      // Left aisle
      seats.push({
        seatNo: `${(row - 1) * 4 + 2}`,
        deck: "lower",
        type: "seater",
        berth: "chair",
        row,
        col: 2,
        price: baseFare,
        isWindow: false,
        isLadies: false,
        status: Math.random() < 0.25 ? "booked" : "available"
      });
      // Right aisle
      seats.push({
        seatNo: `${(row - 1) * 4 + 3}`,
        deck: "lower",
        type: "seater",
        berth: "chair",
        row,
        col: 3,
        price: baseFare,
        isWindow: false,
        isLadies: false,
        status: Math.random() < 0.2 ? "booked" : "available"
      });
      // Right window
      seats.push({
        seatNo: `${(row - 1) * 4 + 4}`,
        deck: "lower",
        type: "seater",
        berth: "chair",
        row,
        col: 4,
        price: baseFare + 20,
        isWindow: true,
        isLadies: false,
        status: Math.random() < 0.3 ? "booked" : "available"
      });
    }
  }
  return seats;
}

// Generate rich trips across key city pairs
export function generateInitialTrips() {
  const routes = [
    { from: "Bengaluru", to: "Chennai", dur: "5h 30m" },
    { from: "Chennai", to: "Bengaluru", dur: "5h 45m" },
    { from: "Bengaluru", to: "Hyderabad", dur: "8h 15m" },
    { from: "Hyderabad", to: "Bengaluru", dur: "8h 00m" },
    { from: "Mumbai", to: "Pune", dur: "3h 30m" },
    { from: "Pune", to: "Mumbai", dur: "3h 45m" },
    { from: "Bengaluru", to: "Coimbatore", dur: "6h 30m" },
    { from: "Coimbatore", to: "Bengaluru", dur: "6h 45m" },
    { from: "Delhi", to: "Jaipur", dur: "5h 00m" },
    { from: "Jaipur", to: "Delhi", dur: "5h 15m" },
    { from: "Chennai", to: "Madurai", dur: "7h 15m" },
    { from: "Madurai", to: "Chennai", dur: "7h 00m" },
    { from: "Bengaluru", to: "Goa", dur: "11h 00m" },
    { from: "Goa", to: "Bengaluru", dur: "11h 15m" },
    { from: "Bengaluru", to: "Mysore", dur: "3h 15m" },
    { from: "Chennai", to: "Pondicherry", dur: "3h 30m" }
  ];

  const operators = [
    { name: "VILS Express", rating: 4.8, ratingsCount: 2450, badge: "Primo Partner", liveTracking: true },
    { name: "VILS Royal Platinum", rating: 4.9, ratingsCount: 1820, badge: "Luxury Star", liveTracking: true },
    { name: "IntrCity SmartBus", rating: 4.7, ratingsCount: 3120, badge: "Primo", liveTracking: true },
    { name: "Orange Tours and Travels", rating: 4.6, ratingsCount: 1540, badge: "Top Rated", liveTracking: true },
    { name: "SRS Travels", rating: 4.3, ratingsCount: 980, badge: "Value", liveTracking: false },
    { name: "KPN Travels", rating: 4.4, ratingsCount: 1210, badge: "Popular", liveTracking: true },
    { name: "VRL Travels", rating: 4.5, ratingsCount: 2900, badge: "Trusted", liveTracking: true },
    { name: "Zingbus Plus", rating: 4.6, ratingsCount: 1420, badge: "Primo", liveTracking: true }
  ];

  const busModels = [
    { type: "AC Sleeper 2+1 (Multi-Axle)", isAC: true, isSleeper: true, baseFare: 950 },
    { type: "BharatBenz AC Sleeper (2+1)", isAC: true, isSleeper: true, baseFare: 1100 },
    { type: "Volvo 9600 Multi-Axle AC Sleeper", isAC: true, isSleeper: true, baseFare: 1350 },
    { type: "Scania AC Executive Semi-Sleeper (2+2)", isAC: true, isSleeper: false, baseFare: 750 },
    { type: "Express Non-AC Seater / Sleeper (2+1)", isAC: false, isSleeper: true, baseFare: 550 },
    { type: "Ultra Deluxe 2+2 Semi-Sleeper", isAC: true, isSleeper: false, baseFare: 650 }
  ];

  const times = [
    { dep: "06:30 AM", arr: "12:15 PM", slot: "morning" },
    { dep: "09:00 AM", arr: "02:45 PM", slot: "morning" },
    { dep: "01:30 PM", arr: "07:15 PM", slot: "afternoon" },
    { dep: "05:00 PM", arr: "10:30 PM", slot: "evening" },
    { dep: "08:30 PM", arr: "05:45 AM", slot: "night" },
    { dep: "09:45 PM", arr: "06:30 AM", slot: "night" },
    { dep: "10:30 PM", arr: "07:15 AM", slot: "night" },
    { dep: "11:15 PM", arr: "08:00 AM", slot: "night" }
  ];

  const amenitiesList = [
    { id: "wifi", name: "High Speed Wi-Fi", icon: "wifi" },
    { id: "charging", name: "Charging Point", icon: "zap" },
    { id: "water", name: "Water Bottle", icon: "droplet" },
    { id: "blanket", name: "Clean Blanket & Pillow", icon: "cloud" },
    { id: "reading_light", name: "Personal Reading Light", icon: "sun" },
    { id: "cctv", name: "CCTV Surveillance", icon: "video" },
    { id: "emergency_exit", name: "Emergency Exit & Hammer", icon: "shield" },
    { id: "gps", name: "Live GPS Tracking", icon: "navigation" }
  ];

  let trips = [];
  let idCounter = 101;

  for (const r of routes) {
    const fromCityObj = CITIES.find(c => c.name === r.from) || { popularPoints: [{ name: r.from + " Central", landmark: "Bus Terminal" }] };
    const toCityObj = CITIES.find(c => c.name === r.to) || { popularPoints: [{ name: r.to + " Central", landmark: "Bus Terminal" }] };

    // Create 3 to 4 trips per route
    const tripCount = Math.floor(Math.random() * 2) + 3;
    for (let i = 0; i < tripCount; i++) {
      const op = operators[(idCounter + i) % operators.length];
      const model = busModels[(idCounter + i) % busModels.length];
      const timeSlot = times[(idCounter + i * 2) % times.length];

      // Pick boarding points
      const boardingPoints = fromCityObj.popularPoints.slice(0, 4).map((p, idx) => ({
        id: `bp_${idCounter}_${idx}`,
        name: p.name,
        landmark: p.landmark,
        time: timeSlot.dep // simplified or offset
      }));

      // Pick dropping points
      const droppingPoints = toCityObj.popularPoints.slice(0, 4).map((p, idx) => ({
        id: `dp_${idCounter}_${idx}`,
        name: p.name,
        landmark: p.landmark,
        time: timeSlot.arr
      }));

      const seats = generateSeatLayout(model.type, model.baseFare);
      const availableCount = seats.filter(s => s.status === "available").length;

      trips.push({
        id: `TRIP-${idCounter}`,
        busNumber: `KA-01-VB-${1000 + idCounter}`,
        operatorName: op.name,
        busType: model.type,
        isAC: model.isAC,
        isSleeper: model.isSleeper,
        fromCity: r.from,
        toCity: r.to,
        departureTime: timeSlot.dep,
        arrivalTime: timeSlot.arr,
        duration: r.dur,
        departureSlot: timeSlot.slot,
        rating: op.rating,
        ratingsCount: op.ratingsCount,
        badge: op.badge,
        liveTracking: op.liveTracking,
        baseFare: model.baseFare,
        boardingPoints,
        droppingPoints,
        amenities: amenitiesList.slice(0, model.isAC ? 7 : 4),
        seats,
        totalSeats: seats.length,
        availableSeats: availableCount,
        cancellationPolicy: [
          { time: "Before 24 hrs of journey", refund: "90% refund (₹50 service fee)" },
          { time: "Between 12 to 24 hrs of journey", refund: "75% refund" },
          { time: "Between 4 to 12 hrs of journey", refund: "50% refund" },
          { time: "Less than 4 hrs of journey", refund: "0% (No refund)" }
        ]
      });
      idCounter++;
    }
  }

  return trips;
}

export function getInitialUsers() {
  const salt = bcrypt.genSaltSync(10);
  return [
    {
      id: "USER-ADMIN",
      name: "Admin VILS BUS",
      email: "admin@vilsbus.com",
      phone: "+91 98765 43210",
      passwordHash: bcrypt.hashSync("admin123", salt),
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "USER-DEMO",
      name: "Vishnu Vils",
      email: "demo@vilsbus.com",
      phone: "+91 91234 56789",
      passwordHash: bcrypt.hashSync("password123", salt),
      role: "customer",
      createdAt: new Date().toISOString()
    }
  ];
}
