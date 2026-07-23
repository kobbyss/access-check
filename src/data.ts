export interface Tier {
  id: "office" | "gaming" | "elite";
  name: string;
  tagline: string;
  priceRange: string;
  accent: "cyan" | "orange" | "amber";
  hex: string;
  useCase: string;
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    cooling: string;
  };
  features: string[];
  badge?: string;
}

export const tiers: Tier[] = [
  {
    id: "office",
    name: "Office & Productivity",
    tagline: "Budget-friendly, quiet, and fast for everyday multitasking.",
    priceRange: "$700 – $1,100",
    accent: "cyan",
    hex: "#22d3ee",
    useCase:
      "Perfect for home offices, students, and professionals who need a snappy, silent machine for browsing, documents, spreadsheets, and light creative work.",
    components: {
      cpu: "AMD Ryzen 5 5600G or Intel Core i5-12400",
      gpu: "Integrated Radeon Vega 7 / Intel UHD 730 (entry-level)",
      ram: "16GB DDR4-3200 (upgradeable to 64GB)",
      storage: "500GB – 1TB NVMe Gen3 SSD",
      cooling: "Low-profile silent air cooler",
    },
    features: [
      "Whisper-quiet operation",
      "Instant boot times",
      "Minimal footprint",
      "Energy-efficient",
    ],
  },
  {
    id: "gaming",
    name: "Mid-Grade Gaming",
    tagline: "The price-to-performance sweet spot for 1440p gaming.",
    priceRange: "$1,400 – $2,200",
    accent: "orange",
    hex: "#FF6B00",
    badge: "Most Popular",
    useCase:
      "Built for gamers who want high-framerate 1440p gameplay, smooth streaming, and enough headroom for content creation on the side.",
    components: {
      cpu: "AMD Ryzen 5 7600X or Intel Core i5-13600K",
      gpu: "NVIDIA RTX 4060 / 4070 (8–12GB VRAM)",
      ram: "32GB DDR5-5600 (upgradeable to 96GB)",
      storage: "1TB – 2TB NVMe Gen4 SSD",
      cooling: "240mm AIO liquid cooler",
    },
    features: [
      "1440p high-refresh gaming",
      "DLSS 3 & ray tracing ready",
      "Stream-ready performance",
      "Future-proof DDR5 platform",
    ],
  },
  {
    id: "elite",
    name: "Elite High-Frame",
    tagline: "Zero compromises. 4K ultra gaming, streaming, and beyond.",
    priceRange: "$2,800 – $5,000+",
    accent: "amber",
    hex: "#FF9E00",
    useCase:
      "For enthusiasts and professionals who demand the absolute best — 4K ultra settings, simultaneous streaming, 3D rendering, and AI workloads without breaking a sweat.",
    components: {
      cpu: "AMD Ryzen 7 7800X3D or Intel Core i9-14900K",
      gpu: "NVIDIA RTX 4080 Super / RTX 4090 (16–24GB VRAM)",
      ram: "32GB – 64GB DDR5-6000 (CL30)",
      storage: "2TB – 4TB NVMe Gen5 SSD",
      cooling: "360mm AIO liquid cooler + optimized airflow",
    },
    features: [
      "4K ultra at 120fps+",
      "Simultaneous 4K streaming",
      "3D rendering & AI workloads",
      "Premium cable management",
    ],
  },
];

export interface Build {
  id: number;
  title: string;
  category: string;
  image: string;
  specs: string;
}

export const builds: Build[] = [
  {
    id: 1,
    title: "Cryo-Stream Pro",
    category: "Liquid-Cooled Gaming",
    image:
      "https://images.pexels.com/photos/2582932/pexels-photo-2582932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 7 7800X3D · RTX 4080 · 32GB DDR5 · 360mm AIO",
  },
  {
    id: 2,
    title: "Stealth Cube",
    category: "Compact ITX Build",
    image:
      "https://images.pexels.com/photos/19012051/pexels-photo-19012051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 5 7600 · RTX 4070 · 32GB DDR5 · 240mm AIO",
  },
  {
    id: 3,
    title: "Apex Frame",
    category: "4K Elite Rig",
    image:
      "https://images.pexels.com/photos/19012063/pexels-photo-19012063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "i9-14900K · RTX 4090 · 64GB DDR5 · 4TB Gen5 NVMe",
  },
  {
    id: 4,
    title: "Frost Workstation",
    category: "Creator Productivity",
    image:
      "https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 9 7950X · RTX 4070 Ti · 64GB DDR5 · 2TB NVMe",
  },
  {
    id: 5,
    title: "Neon Pulse",
    category: "RGB Showcase",
    image:
      "https://images.pexels.com/photos/2693208/pexels-photo-2693208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 7 5800X3D · RTX 4070 · 32GB DDR4 · Custom Loop",
  },
  {
    id: 6,
    title: "Silent Deck",
    category: "Office & Quiet Build",
    image:
      "https://images.pexels.com/photos/2063246/pexels-photo-2063246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "i5-12400 · Integrated · 16GB DDR4 · 1TB NVMe",
  },
];