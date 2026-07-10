

export interface CompletedHike {
  id: string;
  name: string;
  location: string;
  elevation: string;
  distance: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Hard';
  completedDate: string;
  image: string;
  description: string;
  highlights: string[];
}

export const completedHikes: CompletedHike[] = [
  {
    id: '1',
    name: 'Champadevi Region',
    location: 'Dakshinkali, Kathmandu',
    elevation: '2,285 meters',
    distance: '3,500 meters',
    duration: '3-4 hours',
    difficulty: 'Moderate',
    completedDate: '2026-02-28',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67CuDVUh4jlaydFQ5MWGY5Ovut9XGo5Da3fS9I8sNG-h93_lL-hHS5iQo&s=10',
    description: 'A peaceful ridge hike through fragrant pine forests to a sacred summit overlooking the Kathmandu Valley.',
    highlights: ['Himalayan Ridge Panorama', 'Dual Faith Shrine', 'Pine Forest Canopy'],
  },
  {
    id: '2',
    name: 'Chapakharka Trail',
    location: 'Godawari, Lalitpur',
    elevation: '1,980 meters',
    distance: '4,200 meters',
    duration: '3-4 hours',
    difficulty: 'Moderate',
    completedDate: '2026-03-28',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4iaB1Hb8xEkBRFIsgzk0tfGHOjJp79pqrba0XeenHX1TpnVo4BLvo_sQ&s=10',
    description: 'A gentle mountain escape leading to rolling grassy clearings and panoramic paragliding viewpoints high above Godawari.',
    highlights: ['Phulchoki Range Vistas', 'Paragliding Takeoff Zone', 'Lush Botanical Foothills'],

  },
  {
    id: '3',
    name: 'Tarebhir Region, Trail',
    location: ' Gokarneshwor, Kathmandu',
    elevation: '1,820 meters',
    distance: '4,500 meters',
    duration: '3-4 hours',
    difficulty: 'Easy',
    completedDate: '2026-05-30',
    image: 'https://trekwaysnepal.com/images/main/Fri-08-31-15-1112364885-tare-vir.webp',
    description: 'A scenic cliffside trek skirting the national park boundary to a traditional Tamang village overlooking the entire city.',
    highlights: ['Dramatic Cliffside Views', 'Shivapuri Forest Canopy', 'Tamang Cultural Heritage'],

  },
  {
    id: '4',
    name: 'Bhundole Chaur Trail',
    location: 'Pharping, Kathmandu',
    elevation: '1,850 meters',
    distance: '4,000 meters',
    duration: '2-3 hours',
    difficulty: 'Easy',
    completedDate: '2026-06-20',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4BkidsygU6olIU8BU19i7beyROPDHB8ERLoFcl_4MtH45bKIUG9b4pgvH&s=10',
    description: 'A refreshing walk through pine-scented hills leading to an expansive, hidden meadow popular for camping and picnics.',
    highlights: ['Vast Green Meadow', 'Pharping Pine Woodlands', 'Serene Picnic Clearings'],

  },
  
  /*{
    id: '5',
    name: 'Manaslu Circuit Trek',
    location: 'Gorkha, Manaslu Region',
    elevation:'',
    distance: '177 km',
    duration: '14 days',
    difficulty: 'Challenging',
    completedDate: '2024-07-18',
    image: 'https://images.pexels.com/photos/1291962/pexels-photo-1291962.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'A remote, culturally rich circuit around the world\'s 8th highest mountain.',
    highlights: ['Larkya La Pass', 'Nubri Culture', 'Hot Springs'],
  },
  {
    id: '6',
    name: 'Ghorepani Poon Hill Trek',
    location: 'Myagdi, Annapurna Region',
    elevation:'',
    distance: '45 km',
    duration: '4 days',
    difficulty: 'Easy',
    completedDate: '2024-08-12',
    image: 'https://images.pexels.com/photos/3025159/pexels-photo-3025159.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Perfect for beginners, featuring iconic sunrise views over the Annapurna and Dhaulagiri ranges.',
    highlights: ['Poon Hill Sunrise', 'Rhododendron Forests', 'Gurung Villages'],
  },
  {
    id: '7',
    name: 'Upper Mustang Trek',
    location: 'Mustang, Himalayan Desert',
    elevation:'',
    distance: '145 km',
    duration: '12 days',
    difficulty: 'Challenging',
    completedDate: '2024-09-25',
    image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Journey to the forbidden kingdom, exploring ancient caves and Tibetan-influenced culture.',
    highlights: ['Lo Manthang', 'Ancient Caves', 'Desert Landscapes'],
  },
  {
    id: '8',
    name: 'Gokyo Lakes Trek',
    location: 'Solukhumbu, Everest Region',
    elevation:'',
    distance: '85 km',
    duration: '10 days',
    difficulty: 'Challenging',
    completedDate: '2024-10-08',
    image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Trek to sacred emerald lakes with unparalleled views of Everest and surrounding peaks.',
    highlights: ['Gokyo Ri', 'Sacred Lakes', 'Ngozumpa Glacier'],
  },*/
];

export const getHikesByDifficulty = (difficulty: string) =>
  completedHikes.filter(h => difficulty === 'All' || h.difficulty === difficulty);
