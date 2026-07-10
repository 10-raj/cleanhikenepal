export const aiFAQData: Record<string, string> = {
  // Greetings
  'hello': 'Hello! Welcome to CleanHike Nepal! I\'m your intelligent assistant, ready to help you with hiking, environmental conservation, donations, and general questions. How can I assist you today?',
  'hi': 'Hi there! I\'m the CleanHike AI assistant. I can help with trek info, donation methods, environmental info, or general questions. What would you like to know?',
  'hey': 'Hey! Great to see you! I\'m here to assist with anything from Nepal trekking to general queries. What\'s on your mind?',

  // About CleanHike
  'what is cleanhike': 'CleanHike Nepal is a premium eco-tourism platform dedicated to sustainable hiking and environmental conservation. We organize trekking expeditions, support environmental initiatives, and help preserve Nepal\'s natural beauty. We believe every hike should leave nature better than we found it.',
  'about cleanhike': 'CleanHike Nepal combines adventure tourism with environmental stewardship. We offer guided treks, promote sustainable practices, and support local communities. Our mission is to preserve Nepal\'s trails for future generations while providing unforgettable Himalayan experiences.',

  // Completed Hikes
  'completed hikes': 'Here are our completed trekking adventures:\n\n1. **Annapurna Base Camp Trek** - 115km, 10 days, Moderate\n2. **Everest View Trek** - 65km, 8 days, Moderate\n3. **Langtang Valley Trek** - 77km, 7 days, Moderate\n4. **Mardi Himal Trek** - 55km, 6 days, Moderate\n5. **Manaslu Circuit Trek** - 177km, 14 days, Challenging\n6. **Ghorepani Poon Hill Trek** - 45km, 4 days, Easy\n7. **Upper Mustang Trek** - 145km, 12 days, Challenging\n8. **Gokyo Lakes Trek** - 85km, 10 days, Challenging\n\nAsk me about any specific trek for more details!',
  'which hikes completed': 'We\'ve successfully completed 8 major treks including Annapurna Base Camp, Everest View, Langtang Valley, Mardi Himal, Manaslu Circuit, Ghorepani Poon Hill, Upper Mustang, and Gokyo Lakes. Each trek supports our environmental mission.',

  // Environmental Mission
  'environmental mission': 'Our environmental mission is to conserve nature for future generations. We:\n\n- Protect natural trails from erosion\n- Preserve wildlife habitats\n- Promote Leave No Trace principles\n- Reduce environmental impact through sustainable practices\n- Inspire conservation awareness\n\nEvery donation supports these initiatives!',
  'conservation': 'We believe every hike should leave nature better than we found it. Our conservation efforts include trail maintenance, wildlife protection, waste management programs, and environmental education. Support our mission by donating through eSewa, Khalti, IME Pay, ConnectIPS, or bank transfer.',

  // Donations
  'how to donate': 'You can support our environmental mission through multiple payment methods:\n\n1. **eSewa** - Popular digital wallet\n2. **Khalti** - Digital payment platform\n3. **IME Pay** - Secure mobile wallet\n4. **ConnectIPS** - Bank payment gateway\n5. **Bank Transfer** - Direct deposit\n\nVisit our Donate page to scan QR codes and complete your donation easily!',
  'donation methods': 'We accept:\n\n- **eSewa** - Quick mobile payment\n- **Khalti** - Popular wallet app\n- **IME Pay** - Secure transactions\n- **ConnectIPS** - Bank transfers\n- **Bank Transfer** - For large donations\n\nAll donations support trail conservation and environmental programs!',
  'payment options': 'We support multiple payment options:\n\n1. eSewa\n2. Khalti\n3. IME Pay\n4. ConnectIPS\n5. Bank Transfer\n\nEach method shows a QR code for easy scanning. Your donation helps preserve Nepal\'s natural beauty.',

  // Contact
  'contact': 'You can reach us through:\n\n- **Email**: acharyaraj2005@gmail.com\n- **Contact Form**: Available on our Contact page\n- **Location**: Thamel, Kathmandu, Nepal\n\nWe typically respond within 24 hours. Feel free to ask me specific questions too!',
  'how to contact': 'For assistance, you can:\n\n1. Email us at: acharyaraj2005@gmail.com\n2. Use our Contact page form\n3. Continue chatting with me for quick answers\n\nWe\'re always happy to help!',

  // Trekking Info
  'best season': 'Best times to trek in Nepal:\n\n**Autumn (Sept-Nov)** - Clear skies, pleasant weather\n**Spring (Mar-May)** - Blooming rhododendrons, warming temperatures\n\nWinter offers fewer crowds, while monsoon season (Jun-Aug) is not recommended for most treks.',
  'trek preparation': 'Essential trek preparation:\n\n1. **Physical fitness** - Cardio and leg exercises\n2. **Gear** - Sturdy boots, layers, rain gear\n3. **Permits** - TIMS card and area permits\n4. **Insurance** - Travel and evacuation coverage\n5. **Acclimatization** - Plan for altitude\n\nNeed specific advice for a particular trek?',
  'trekking gear': 'Essential trekking gear:\n\n- Hiking boots (broken in)\n- Down jacket\n- Waterproof shell\n- Thermal layers\n- Sleeping bag (-10C to -20C)\n- Trekking poles\n- Water bottles with purification\n- Sun protection\n- First aid kit\n\nAsk me for specific gear recommendations!',

  // General questions fallback
  'weather': 'Nepal\'s weather varies by season:\n\n- **Spring (Mar-May)**: 15-25°C, pleasant\n- **Summer/Monsoon (Jun-Aug)**: 20-30°C, rainy\n- **Autumn (Sep-Nov)**: 10-20°C, clear\n- **Winter (Dec-Feb)**: 0-15°C, cold at altitude\n\nBest trekking is during autumn and spring!',
  'kathmandu': 'Kathmandu is Nepal\'s capital, located in a valley surrounded by hills. Key highlights:\n\n- UNESCO World Heritage Sites\n- Rich cultural heritage\n- Starting point for treks\n- Thamel: main tourist district\n- Bhaktapur: ancient city nearby\n\nVisit our Gallery for photos!',
  'visa nepal': 'Nepal visa information:\n\n- Available on arrival at Tribhuvan Airport\n- Costs: $30 (15 days), $50 (30 days), $125 (90 days)\n- Passport required with 6 months validity\n- Two passport photos needed\n\nTrekking permits obtained separately in Kathmandu.',

  // Safety
  'altitude sickness': 'Altitude sickness prevention:\n\n1. **Acclimatize properly** - Rest days above 3000m\n2. **Stay hydrated** - 3-4 liters daily\n3. **Ascend slowly** - Max 400m per day gain\n4. **Recognize symptoms** - Headache, nausea, dizziness\n5. **Descend if symptoms worsen**\n\nOur guides are trained in altitude safety!',
  'safety': 'CleanHike prioritizes safety with:\n\n- Experienced, certified guides\n- First aid trained staff\n- Emergency evacuation plans\n- Quality equipment\n- Proper acclimatization schedules\n- 24/7 communication\n\nYour safety is our top priority!',
};

// Keywords for flexible matching
export const keywordPatterns: Record<string, string[]> = {
  hello: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
  about_cleanhike: ['about cleanhike', 'what is cleanhike', 'tell me about', 'cleanhike', 'who are you', 'about you'],
  completed_hikes: ['completed hikes', 'completed treks', 'which hikes', 'hikes done', 'finished treks', 'completed adventures'],
  environmental_mission: ['environmental', 'conservation', 'mission', 'protect nature', 'environment'],
  how_to_donate: ['donate', 'donation', 'contribute', 'support', 'give', 'payment', 'how to pay', 'donate money'],
  payment_options: ['payment', 'payment methods', 'pay methods', 'esewa', 'khalti', 'ime pay', 'bank transfer'],
  contact: ['contact', 'reach', 'email', 'phone', 'how to contact', 'get in touch'],
  best_season: ['best season', 'when to visit', 'best time', 'weather', 'season'],
  trek_preparation: ['preparation', 'prepare', 'ready for trek', 'before hike', 'how to prepare'],
  trekking_gear: ['gear', 'equipment', 'what to bring', 'packing', 'clothes', 'boots'],
  altitude_sickness: ['altitude', 'mountain sickness', 'ams', 'height', 'elevation'],
  safety: ['safe', 'safety', 'danger', 'risk', 'secure'],
  kathmandu: ['kathmandu', 'capital', 'city'],
  visa_nepal: ['visa', 'permit', 'entry', 'travel document'],
};

// Questions that should redirect to contact
const contactRedirectPatterns = [
  'book', 'reservation', 'price', 'cost', 'how much', 'discount',
  'group', 'private trek', 'custom', 'itinerary',
  'refund', 'cancel', 'complaint', 'issue', 'problem',
];

export function matchFAQ(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();

  // Check if we should redirect to contact
  if (contactRedirectPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return `I'd be happy to help with specific bookings, pricing, or custom requests. For detailed assistance, please contact us directly:\n\n- **Email**: acharyaraj2005@gmail.com\n- **Contact Page**: Use our contact form\n\nOur team will respond within 24 hours!`;
  }

  // Direct match
  if (aiFAQData[normalizedQuery]) {
    return aiFAQData[normalizedQuery];
  }

  // Keyword matching
  for (const [key, patterns] of Object.entries(keywordPatterns)) {
    if (patterns.some(pattern => normalizedQuery.includes(pattern))) {
      const faqKey = key;
      for (const [dataKey, dataValue] of Object.entries(aiFAQData)) {
        if (dataKey.includes(faqKey) || faqKey.includes(dataKey)) {
          return dataValue;
        }
      }
    }
  }

  return null;
}

export const suggestedQuestions = [
  'Completed hikes till now',
  'How to donate?',
  'Environmental mission',
  'Best season for trekking',
];
