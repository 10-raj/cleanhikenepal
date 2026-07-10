import { aiFAQData, keywordPatterns, matchFAQ } from '../data/aiFAQ';

export function processUserQuery(query: string): string {
  const normalizedQuery = query.toLowerCase().trim();

  // Try local FAQ match first
  const localResponse = matchFAQ(query);
  if (localResponse) {
    return localResponse;
  }

  // Check for programming/technology questions
  if (normalizedQuery.includes('javascript') || normalizedQuery.includes('react') || normalizedQuery.includes('coding') ||
      normalizedQuery.includes('programming') || normalizedQuery.includes('code')) {
    return `I can help with general programming questions! However, for specific technical support unrelated to our website:\n\n- **Email**: acharyaraj2005@gmail.com\n- **Contact Page**: Submit your query\n\nOur team will connect you with the right resources.`;
  }

  // Check for career/advice questions
  if (normalizedQuery.includes('career') || normalizedQuery.includes('job') || normalizedQuery.includes('work')) {
    return `For career or professional inquiries, I'd recommend reaching out to our team:\n\n- **Email**: acharyaraj2005@gmail.com\n\nWe may have opportunities in guiding, conservation, or administration!`;
  }

  // Topics we should redirect
  const redirectTopics = [
    ['booking', 'price', 'cost', 'reservation'],
    ['custom', 'private', 'group tour'],
    ['complaint', 'issue', 'problem', 'refund'],
    ['legal', 'contract', 'insurance'],
  ];

  for (const topics of redirectTopics) {
    if (topics.some(t => normalizedQuery.includes(t))) {
      return `For specific inquiries about ${topics[0]}, please contact us directly:\n\n- **Email**: acharyaraj2005@gmail.com\n- **Contact Page**: Available on our website\n\nOur team will provide personalized assistance within 24 hours.`;
    }
  }

  // Default fallback for unknown queries
  return `I couldn't find a specific answer for that question. For further assistance:\n\n- **Email**: acharyaraj2005@gmail.com\n- **Contact Page**: Visit our website to submit an inquiry\n\nI'm here to help with questions about:\n- Completed hikes and trek info\n- Donation methods and environmental mission\n- Nepal travel advice\n- General queries\n\nPlease try rephrasing your question or reach out directly!`;
}
