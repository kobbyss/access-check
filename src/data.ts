export interface Tier {
  id: "office" | "gaming" | "elite" | "custom";
  name: string;
  tagline: string;
  priceRange: string;
  accent: "cyan" | "orange" | "amber" | "ice";
  hex: string;
  useCase: string;
  image: string;
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    cooling: string;
  };
  /** Selectable upgrade paths shown in the consultation customizer. */
  options: {
    cpu: string[];
    gpu: string[];
    ram: string[];
    storage: string[];
    cooling: string[];
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
    image:
      "https://images.pexels.com/photos/4009598/pexels-photo-4009598.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    useCase:
      "Perfect for home offices, students, and professionals who need a snappy, silent machine for browsing, documents, spreadsheets, and light creative work.",
    components: {
      cpu: "AMD Ryzen 5 5600G or Intel Core i5-12400",
      gpu: "Integrated Radeon Vega 7 / Intel UHD 730 (entry-level)",
      ram: "16GB DDR4-3200 (upgradeable to 64GB)",
      storage: "500GB – 1TB NVMe Gen3 SSD",
      cooling: "Low-profile silent air cooler",
    },
    options: {
      cpu: ["Ryzen 5 5600G (recommended)", "Intel Core i5-12400", "Ryzen 7 5700G (+multitasking)"],
      gpu: ["Integrated graphics (recommended)", "GTX 1650 / RTX 3050 (light gaming)", "Dual-monitor pro card"],
      ram: ["16GB DDR4-3200 (recommended)", "32GB DDR4-3200", "64GB DDR4-3200"],
      storage: ["500GB NVMe (recommended)", "1TB NVMe", "1TB NVMe + 2TB HDD"],
      cooling: ["Silent air cooler (recommended)", "Premium tower air cooler", "120mm AIO liquid"],
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
    image:
      "https://images.pexels.com/photos/19012051/pexels-photo-19012051.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    useCase:
      "Built for gamers who want high-framerate 1440p gameplay, smooth streaming, and enough headroom for content creation on the side.",
    components: {
      cpu: "AMD Ryzen 5 7600X or Intel Core i5-13600K",
      gpu: "NVIDIA RTX 4060 / 4070 (8–12GB VRAM)",
      ram: "32GB DDR5-5600 (upgradeable to 96GB)",
      storage: "1TB – 2TB NVMe Gen4 SSD",
      cooling: "240mm AIO liquid cooler",
    },
    options: {
      cpu: ["Ryzen 5 7600X (recommended)", "Intel Core i5-13600K", "Ryzen 7 7800X3D (+gaming)"],
      gpu: ["RTX 4060 (recommended)", "RTX 4060 Ti 16GB", "RTX 4070 Super", "AMD RX 7800 XT"],
      ram: ["32GB DDR5-5600 (recommended)", "32GB DDR5-6000 CL30", "64GB DDR5-5600"],
      storage: ["1TB Gen4 NVMe (recommended)", "2TB Gen4 NVMe", "2TB Gen4 + 4TB HDD"],
      cooling: ["240mm AIO (recommended)", "360mm AIO", "High-end air cooler (quietest)"],
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
    image:
      "https://images.pexels.com/photos/2582932/pexels-photo-2582932.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    useCase:
      "For enthusiasts and professionals who demand the absolute best — 4K ultra settings, simultaneous streaming, 3D rendering, and AI workloads without breaking a sweat.",
    components: {
      cpu: "AMD Ryzen 7 7800X3D or Intel Core i9-14900K",
      gpu: "NVIDIA RTX 4080 Super / RTX 4090 (16–24GB VRAM)",
      ram: "32GB – 64GB DDR5-6000 (CL30)",
      storage: "2TB – 4TB NVMe Gen5 SSD",
      cooling: "360mm AIO liquid cooler + optimized airflow",
    },
    options: {
      cpu: ["Ryzen 7 7800X3D (recommended)", "Ryzen 9 7950X3D", "Intel Core i9-14900K"],
      gpu: ["RTX 4080 Super (recommended)", "RTX 4090 24GB", "Dual-slot workstation card"],
      ram: ["32GB DDR5-6000 CL30 (recommended)", "64GB DDR5-6000 CL30", "96GB DDR5-6400"],
      storage: ["2TB Gen5 NVMe (recommended)", "4TB Gen5 NVMe", "4TB Gen5 + 8TB archive drive"],
      cooling: ["360mm AIO (recommended)", "420mm AIO", "Custom hard-line water loop"],
    },
    features: [
      "4K ultra at 120fps+",
      "Simultaneous 4K streaming",
      "3D rendering & AI workloads",
      "Premium cable management",
    ],
  },
  {
    id: "custom",
    name: "Custom & Upgrades",
    tagline: "Upgrade the rig you already own, or design one from scratch.",
    priceRange: "Quoted per job",
    accent: "ice",
    hex: "#7FE5FF",
    image:
      "https://images.pexels.com/photos/19012063/pexels-photo-19012063.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    useCase:
      "For anyone who already has a machine and wants more out of it — GPU swaps, more memory, faster storage, better cooling, or a full re-build in a new case. We diagnose what's holding you back and only replace what actually helps.",
    components: {
      cpu: "CPU / motherboard platform upgrade (kept or swapped)",
      gpu: "GPU upgrade sized to your monitor & PSU headroom",
      ram: "Memory capacity or speed upgrade",
      storage: "NVMe upgrade + data migration from your old drive",
      cooling: "Cooling, airflow, and cable re-work",
    },
    options: {
      cpu: ["Keep my current CPU", "CPU only (same socket)", "Full CPU + motherboard platform swap"],
      gpu: ["Keep my current GPU", "Mid-range GPU upgrade", "Flagship GPU upgrade"],
      ram: ["Keep my current RAM", "Add matching memory kit", "Full faster kit (32GB+)"],
      storage: ["Keep my current drives", "Add an NVMe SSD", "New NVMe + clone my existing data"],
      cooling: ["Keep my current cooling", "New air cooler + fan re-work", "AIO liquid cooler + cable re-do"],
    },
    features: [
      "Free bottleneck diagnosis",
      "Reuse whatever still performs",
      "Data migration included",
      "Cable re-work & re-test",
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
      "https://images.pexels.com/photos/19012051/pexels-photo-19012051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 9 7950X · RTX 4070 Ti · 64GB DDR5 · 2TB NVMe",
  },
  {
    id: 5,
    title: "Neon Pulse",
    category: "RGB Showcase",
    image:
      "https://images.pexels.com/photos/4009598/pexels-photo-4009598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "Ryzen 7 5800X3D · RTX 4070 · 32GB DDR4 · Custom Loop",
  },
  {
    id: 6,
    title: "Silent Deck",
    category: "Office & Quiet Build",
    image:
      "https://images.pexels.com/photos/2582932/pexels-photo-2582932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1",
    specs: "i5-12400 · Integrated · 16GB DDR4 · 1TB NVMe",
  },
];