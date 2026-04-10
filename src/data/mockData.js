export const componentTypes = [
  'CPU',
  'GPU',
  'Motherboard',
  'RAM',
  'Storage',
  'Power Supply',
  'Case',
]

export const componentChoices = {
  CPU: [
    { name: 'AMD Ryzen 5 5600',           price: 12097, wattage: 65  },
    { name: 'AMD Ryzen 5 7600',           price: 15717, wattage: 65  },
    { name: 'AMD Ryzen 5 7600X',          price: 18507, wattage: 105 },
    { name: 'AMD Ryzen 7 7700',           price: 21297, wattage: 65  },
    { name: 'AMD Ryzen 7 7700X',          price: 23157, wattage: 105 },
    { name: 'AMD Ryzen 7 7800X3D',        price: 36177, wattage: 120 },
    { name: 'AMD Ryzen 9 7900X',          price: 35247, wattage: 170 },
    { name: 'Intel Core i5-13600K',       price: 22227, wattage: 125 },
    { name: 'Intel Core i5-14400F',       price: 16647, wattage: 65  },
    { name: 'Intel Core i7-14700K',       price: 38037, wattage: 125 },
  ],

  GPU: [
    { name: 'AMD Radeon RX 6600',         price: 18507, wattage: 132 },
    { name: 'AMD Radeon RX 6700 XT',      price: 26877, wattage: 230 },
    { name: 'AMD Radeon RX 7600',         price: 23157, wattage: 165 },
    { name: 'AMD Radeon RX 7700 XT',      price: 32457, wattage: 245 },
    { name: 'AMD Radeon RX 7800 XT',      price: 41757, wattage: 263 },
    { name: 'AMD Radeon RX 7900 GRE',     price: 46407, wattage: 260 },
    { name: 'NVIDIA GeForce RTX 4060',    price: 27789, wattage: 115 },
    { name: 'NVIDIA GeForce RTX 4060 Ti', price: 37107, wattage: 165 },
    { name: 'NVIDIA GeForce RTX 4070',    price: 51057, wattage: 200 },
    { name: 'NVIDIA GeForce RTX 4070 Super', price: 55707, wattage: 220 },
  ],

  Motherboard: [
    { name: 'ASRock B550 Phantom Gaming 4',   price: 9207,  wattage: 35 },
    { name: 'MSI B550 Tomahawk',              price: 13857, wattage: 40 },
    { name: 'ASUS TUF Gaming B550-Plus',      price: 14787, wattage: 40 },
    { name: 'Gigabyte B650 Aorus Elite AX',   price: 17577, wattage: 45 },
    { name: 'MSI B650 Tomahawk WiFi',         price: 20367, wattage: 45 },
    { name: 'ASUS ROG Strix B650-A Gaming',   price: 24087, wattage: 50 },
    { name: 'ASUS TUF Gaming Z790-Plus WiFi', price: 25017, wattage: 55 },
    { name: 'MSI MAG Z790 Tomahawk WiFi',     price: 26877, wattage: 55 },
    { name: 'Gigabyte Z790 Aorus Master',     price: 35247, wattage: 60 },
    { name: 'ASUS ROG Maximus Z790 Hero',     price: 55707, wattage: 65 },
  ],

  RAM: [
    { name: '8GB DDR4 3200 CL16',             price: 2325,  wattage: 5  },
    { name: '16GB DDR4 3200 CL16',            price: 3627,  wattage: 7  },
    { name: '32GB DDR4 3600 CL18',            price: 6045,  wattage: 10 },
    { name: '16GB DDR5 5200 CL38',            price: 5115,  wattage: 8  },
    { name: '16GB DDR5 5600 CL36',            price: 6417,  wattage: 9  },
    { name: '32GB DDR5 5600 CL36',            price: 9207,  wattage: 10 },
    { name: '32GB DDR5 6000 CL30',            price: 11067, wattage: 12 },
    { name: '32GB DDR5 6400 CL32',            price: 12927, wattage: 12 },
    { name: '64GB DDR5 6000 CL30',            price: 20367, wattage: 18 },
    { name: '64GB DDR5 6400 CL32',            price: 25017, wattage: 20 },
  ],

  Storage: [
    { name: '500GB NVMe Gen3 SSD',            price: 4185,  wattage: 5  },
    { name: '1TB NVMe Gen3 SSD',              price: 6417,  wattage: 6  },
    { name: '2TB NVMe Gen3 SSD',              price: 10137, wattage: 7  },
    { name: '500GB NVMe Gen4 SSD',            price: 5487,  wattage: 6  },
    { name: '1TB NVMe Gen4 SSD',              price: 8277,  wattage: 8  },
    { name: '2TB NVMe Gen4 SSD',              price: 13857, wattage: 10 },
    { name: '4TB NVMe Gen4 SSD',              price: 25947, wattage: 12 },
    { name: '1TB SATA SSD',                   price: 6417,  wattage: 4  },
    { name: '2TB SATA SSD',                   price: 11067, wattage: 5  },
    { name: '4TB HDD 7200rpm',                price: 7347,  wattage: 9  },
  ],

  'Power Supply': [
    { name: '550W 80+ Bronze PSU',            price: 5487,  wattage: 0 },
    { name: '650W 80+ Bronze PSU',            price: 6417,  wattage: 0 },
    { name: '650W 80+ Gold PSU',              price: 8277,  wattage: 0 },
    { name: '750W 80+ Bronze PSU',            price: 7347,  wattage: 0 },
    { name: '750W 80+ Gold PSU',              price: 10137, wattage: 0 },
    { name: '750W 80+ Gold Modular PSU',      price: 12007, wattage: 0 },
    { name: '850W 80+ Gold PSU',              price: 12007, wattage: 0 },
    { name: '850W 80+ Gold Modular PSU',      price: 13857, wattage: 0 },
    { name: '1000W 80+ Gold Modular PSU',     price: 16647, wattage: 0 },
    { name: '1200W 80+ Platinum Modular PSU', price: 23157, wattage: 0 },
  ],

  Case: [
    { name: 'Cooler Master MasterBox Q300L',  price: 4557,  wattage: 0 },
    { name: 'NZXT H510',                      price: 6417,  wattage: 0 },
    { name: 'Fractal Design Pop Air',         price: 7347,  wattage: 0 },
    { name: 'Lian Li Lancool 205',            price: 8277,  wattage: 0 },
    { name: 'NZXT H6 Flow',                   price: 9207,  wattage: 0 },
    { name: 'Lian Li Lancool 216',            price: 10137, wattage: 0 },
    { name: 'Fractal Design Meshify 2',       price: 12927, wattage: 0 },
    { name: 'Lian Li O11 Dynamic EVO',        price: 13857, wattage: 0 },
    { name: 'NZXT H9 Flow',                   price: 15717, wattage: 0 },
    { name: 'Corsair 5000D Airflow',          price: 16182, wattage: 0 },
  ],
}

export const aiBuildTemplates = {
  gaming: {
    CPU:            'AMD Ryzen 7 7800X3D',
    GPU:            'NVIDIA GeForce RTX 4070 Super',
    Motherboard:    'MSI B650 Tomahawk WiFi',
    RAM:            '32GB DDR5 6000 CL30',
    Storage:        '1TB NVMe Gen4 SSD',
    PSU:            '750W 80+ Gold PSU',
    Case:           'Lian Li Lancool 216',
  },
  editing: {
    CPU:            'Intel Core i7-14700K',
    GPU:            'NVIDIA GeForce RTX 4070 Super',
    Motherboard:    'ASUS TUF Gaming Z790-Plus WiFi',
    RAM:            '64GB DDR5 6000 CL30',
    Storage:        '2TB NVMe Gen4 SSD',
    PSU:            '850W 80+ Gold Modular PSU',
    Case:           'Fractal Design Meshify 2',
  },
  programming: {
    CPU:            'AMD Ryzen 7 7700',
    GPU:            'NVIDIA GeForce RTX 4060',
    Motherboard:    'Gigabyte B650 Aorus Elite AX',
    RAM:            '32GB DDR5 5600 CL36',
    Storage:        '1TB NVMe Gen4 SSD',
    PSU:            '650W 80+ Gold PSU',
    Case:           'NZXT H6 Flow',
  },
  office: {
    CPU:            'Intel Core i5-14400F',
    GPU:            'AMD Radeon RX 6600',
    Motherboard:    'ASRock B550 Phantom Gaming 4',
    RAM:            '16GB DDR4 3200 CL16',
    Storage:        '500GB NVMe Gen4 SSD',
    PSU:            '550W 80+ Bronze PSU',
    Case:           'NZXT H510',
  },
}

export const upgradeRecommendations = [
  {
    title:  'GPU Upgrade: RTX 4070 Super',
    reason: 'Delivers a major uplift in modern game FPS and CUDA workloads.',
  },
  {
    title:  'RAM Upgrade: 32GB DDR5 6000',
    reason: 'Improves multitasking and reduces bottlenecks in editing workflows.',
  },
  {
    title:  'Storage Upgrade: 2TB NVMe Gen4 SSD',
    reason: 'Faster load times and enough capacity for games, footage, and tools.',
  },
  {
    title:  'CPU Upgrade: Ryzen 7 / Core i7 Tier',
    reason: 'Stronger single-core performance and better sustained productivity.',
  },
]