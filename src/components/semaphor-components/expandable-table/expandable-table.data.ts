// Sample data with position-based columns:
// 1st = category, 2nd = name, 3rd = value, 4th = details, 5th+ = extra fields
export const sampleData = [
  // Electronics category
  {
    category: 'Electronics',
    name: 'Laptop Pro 15"',
    value: 1299,
    details: 'High-performance laptop with M2 chip, 16GB RAM, 512GB SSD',
    status: 'active',
    date: '2024-01-15',
  },
  {
    category: 'Electronics',
    name: 'Wireless Headphones',
    value: 349,
    details: 'Noise-canceling over-ear headphones with 30hr battery',
    status: 'active',
    date: '2024-01-18',
  },
  {
    category: 'Electronics',
    name: 'Smart Watch Series 8',
    value: 429,
    details: 'Health monitoring, GPS, water resistant to 50m',
    status: 'pending',
    date: '2024-01-20',
  },
  {
    category: 'Electronics',
    name: '4K Monitor 27"',
    value: 549,
    details: 'IPS panel, 144Hz refresh rate, USB-C connectivity',
    status: 'active',
    date: '2024-01-22',
  },

  // Furniture category
  {
    category: 'Furniture',
    name: 'Standing Desk',
    value: 699,
    details: 'Electric height adjustable, 60" x 30" bamboo top',
    status: 'active',
    date: '2024-01-10',
  },
  {
    category: 'Furniture',
    name: 'Ergonomic Chair',
    value: 899,
    details: 'Mesh back, lumbar support, adjustable armrests',
    status: 'active',
    date: '2024-01-12',
  },
  {
    category: 'Furniture',
    name: 'Bookshelf Unit',
    value: 249,
    details: '5-tier open shelving, solid oak construction',
    status: 'inactive',
    date: '2024-01-08',
  },

  // Software category
  {
    category: 'Software',
    name: 'Project Management Suite',
    value: 199,
    details: 'Annual subscription, up to 50 team members',
    status: 'active',
    date: '2024-01-25',
  },
  {
    category: 'Software',
    name: 'Design Tool Pro',
    value: 149,
    details: 'Vector graphics, prototyping, collaboration features',
    status: 'active',
    date: '2024-01-26',
  },

  // Office Supplies category
  {
    category: 'Office Supplies',
    name: 'Premium Notebooks (12-pack)',
    value: 48,
    details: 'A5 size, dotted pages, 120gsm paper',
    status: 'active',
    date: '2024-01-05',
  },
  {
    category: 'Office Supplies',
    name: 'Desk Organizer Set',
    value: 35,
    details: 'Bamboo construction, 6 compartments',
    status: 'active',
    date: '2024-01-06',
  },
  {
    category: 'Office Supplies',
    name: 'Whiteboard 48" x 36"',
    value: 89,
    details: 'Magnetic surface, includes markers and eraser',
    status: 'pending',
    date: '2024-01-07',
  },
];

export const sampleSettings = {
  title: 'Product Inventory',
  showNested: 'true',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  mode: 'light' as const,
};
