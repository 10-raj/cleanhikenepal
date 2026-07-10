import { Donation } from '../types';

export const donationsData: Donation[] = [
  {
    id: '1',
    title: 'Trail Conservation Fund',
    description: 'Maintain and restore damaged trekking trails across Nepal\'s most popular routes. Funds support trail repair, signage, and safety improvements.',
    goalAmount: 50000,
    currentAmount: 32500,
    category: 'environmental',
    image: 'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=800',
    donorsCount: 245,
  },
  {
    id: '2',
    title: 'Community Cleanup Initiative',
    description: 'Monthly waste collection drives along popular trekking routes. We engage local communities and volunteers to keep Nepal\'s wilderness pristine.',
    goalAmount: 25000,
    currentAmount: 18750,
    category: 'environmental',
    image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=800',
    donorsCount: 189,
  },
  {
    id: '3',
    title: 'School Building Project',
    description: 'Constructing a new school building in a remote village along the Annapurna trail, providing education access for over 200 children.',
    goalAmount: 75000,
    currentAmount: 48500,
    category: 'education',
    image: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800',
    donorsCount: 312,
  },
  {
    id: '4',
    title: 'Eco-Tourism Training Program',
    description: 'Training local youth in sustainable tourism practices, creating economic opportunities while preserving natural resources.',
    goalAmount: 30000,
    currentAmount: 22000,
    category: 'community',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    donorsCount: 156,
  },
  {
    id: '5',
    title: 'Bridge Construction',
    description: 'Building safe suspension bridges in remote areas, connecting isolated communities to essential services and trekking routes.',
    goalAmount: 40000,
    currentAmount: 31000,
    category: 'infrastructure',
    image: 'https://images.pexels.com/photos/17697/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    donorsCount: 198,
  },
];

export const getDonationByCategory = (category: string) =>
  donationsData.filter(d => d.category === category);
