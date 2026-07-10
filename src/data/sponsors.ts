import { Sponsor } from '../types';

export const sponsorsData: Sponsor[] = [
  {
    id: '1',
    name: 'Nepal Tour and Trek',
    logo: 'https://cleanhikenepal.com/images/576/20527727/logosocial-bDsVBskhX3VtFDps2fjhpg.png',
    website: 'https://nepaltourandtrek.com/',
    tier: 'platinum',
    description: 'Supporting sustainable tourism development in Nepal.',
  },
  {
    id: '2',
    name: 'German Exam Nepal',
    logo: 'https://cleanhikenepal.com/images/576/20511488/logogen-R2aApFn_dDr_gPbUHxdYAA.jpg',
    website: 'https://germanexamnepal.com/',
    tier: 'gold',
    description: 'Premium outdoor gear for adventurers worldwide.',
  },
  /*
  {
    id: '3',
    name: 'World Wildlife Fund',
    logo: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://www.worldwildlife.org',
    tier: 'gold',
    description: 'Conservation partner protecting Nepal\'s biodiversity.',
  },
  {
    id: '4',
    name: 'Local Trekking Agency',
    logo: 'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: '#',
    tier: 'silver',
    description: 'Expert local guides with decades of experience.',
  },
  {
    id: '5',
    name: 'Himalayan Health Care',
    logo: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: '#',
    tier: 'silver',
    description: 'Medical support for remote mountain communities.',
  },
  {
    id: '6',
    name: 'Sustainable Trails',
    logo: 'https://images.pexels.com/photos/1421909/pexels-photo-1421909.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: '#',
    tier: 'bronze',
    description: 'Eco-friendly trekking initiatives.',
  }, */
];

export const getSponsorsByTier = (tier: string) =>
  sponsorsData.filter(s => s.tier === tier);

export const platinumSponsors = sponsorsData.filter(s => s.tier === 'platinum');
export const goldSponsors = sponsorsData.filter(s => s.tier === 'gold');
export const silverSponsors = sponsorsData.filter(s => s.tier === 'silver');
export const bronzeSponsors = sponsorsData.filter(s => s.tier === 'bronze');
