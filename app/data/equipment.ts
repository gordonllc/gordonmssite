export type EquipmentItem = {
  slug: string;
  year: number;
  make: string;
  model: string;
  title: string;
  category: string;
  price: number;
  priceLabel: string;
  hours: number | null;
  availability: 'For Sale' | 'Rental Available';
  status: 'Available';
  image: string;
  alternateImage?: string;
  alt: string;
  description: string;
  featured?: boolean;
};

export const equipment: EquipmentItem[] = [
  {
    slug: '2013-deere-backhoe-loader',
    year: 2013,
    make: 'Deere',
    model: 'Backhoe Loader',
    title: '2013 Deere Backhoe Loader',
    category: 'Backhoe Loaders',
    price: 75000,
    priceLabel: '$75,000',
    hours: null,
    availability: 'For Sale',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558558381333-FVAAMBRD0BRH0JP8HEOE/deere2.png?format=1500w',
    alt: '2013 Deere backhoe loader owned by Gordon Machinery Solutions',
    description: 'A Deere backhoe loader available for inspection. Contact Gordon for a current condition report, transportation options and additional machine details.',
    featured: true,
  },
  {
    slug: '2022-vermeer-sc70tx',
    year: 2022,
    make: 'Vermeer',
    model: 'SC70TX',
    title: '2022 Vermeer SC70TX',
    category: 'Stump Grinders',
    price: 72500,
    priceLabel: '$72,500',
    hours: 200,
    availability: 'For Sale',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1699020594540-9RPIF3KW0DD7H754MNY6/img+7.jpeg?format=1500w',
    alternateImage: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1699020592861-6E5Y7O6QC9UYRY7VTP3D/img+%282%29.jpeg?format=1500w',
    alt: '2022 Vermeer SC70TX stump grinder owned by Gordon Machinery Solutions',
    description: 'A low-hour Vermeer stump grinder with clear pricing and inspection availability. Ask the Gordon team about financing and delivery.',
    featured: true,
  },
  {
    slug: '2010-bobcat-e80-excavator',
    year: 2010,
    make: 'Bobcat',
    model: 'E80',
    title: '2010 Bobcat E80 Excavator',
    category: 'Excavators',
    price: 42000,
    priceLabel: '$42,000',
    hours: 3740,
    availability: 'For Sale',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558540425329-IA0T275AK5VYOV5108NK/bobcattt.png?format=1500w',
    alt: '2010 Bobcat E80 excavator owned by Gordon Machinery Solutions',
    description: 'A compact Bobcat excavator suited to contractors who need capable digging performance in a manageable footprint. Available for inspection in the Atlanta area.',
    featured: true,
  },
  {
    slug: '2003-cat-305cr-excavator',
    year: 2003,
    make: 'CAT',
    model: '305CR',
    title: '2003 CAT 305CR Excavator',
    category: 'Excavators',
    price: 35000,
    priceLabel: '$35,000',
    hours: 5600,
    availability: 'Rental Available',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558548846922-M9GQ56I41YDANHVE1UI1/2004cat4.png?format=1500w',
    alt: '2003 CAT 305CR excavator available from Gordon Machinery Solutions',
    description: 'A compact CAT excavator available for purchase or qualifying rental arrangements. Contact Gordon to discuss the job, rental term and current machine condition.',
  },
  {
    slug: '2000-cat-320cl-excavator',
    year: 2000,
    make: 'CAT',
    model: '320CL',
    title: '2000 CAT 320CL Excavator',
    category: 'Excavators',
    price: 58000,
    priceLabel: '$58,000',
    hours: 4187,
    availability: 'For Sale',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558550679017-LPQLUQSFABJQDADHGKL8/cat.jpeg?format=1500w',
    alt: 'CAT 320CL excavator in Gordon Machinery Solutions equipment yard',
    description: 'A CAT 320CL excavator with hours and pricing listed. Contact the team for inspection availability, financing and transportation support.',
  },
  {
    slug: '2017-jcb-3cx-backhoe-loader',
    year: 2017,
    make: 'JCB',
    model: '3CX',
    title: '2017 JCB 3CX Backhoe Loader',
    category: 'Backhoe Loaders',
    price: 65000,
    priceLabel: '$65,000',
    hours: null,
    availability: 'Rental Available',
    status: 'Available',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558546181171-881IF7O9MBGS55ZESNNG/jcb3cxbackhoe.png?format=1500w',
    alt: '2017 JCB 3CX backhoe loader available from Gordon Machinery Solutions',
    description: 'A versatile JCB backhoe loader available for purchase or qualifying rental terms. Tell Gordon about your project to discuss fit, timing and transportation.',
  },
];

export function getEquipment(slug: string) {
  return equipment.find((item) => item.slug === slug);
}

export const equipmentCategories = ['All Equipment', 'Excavators', 'Backhoe Loaders', 'Stump Grinders'];
