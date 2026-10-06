export const ARTIST_INFO = {
  name: "ADITYA RATHORE",
  title: "Visual Artist & Creative Director",
  discipline: "Oil on Linen, Spatial Installations & Digital Scenography",
  location: "Paris — Tokyo",
  coordinates: "48.8566° N, 2.3522° E",
  status: "Available for Commissions & Global Scenography (2026)",
  bio: "Working at the intersection of classical oil glaze chemistry and minimalist contemporary form. Each work explores silence, material weight, and the slow luminescence of pigment on raw Belgian linen.",
  manifesto: "Art is not the accumulation of details, but the severe elimination of the superfluous until only the luminous soul of the form remains."
};

export const PIGMENTS = [
  {
    id: "sienna",
    name: "Burnt Sienna",
    latin: "Terra di Siena",
    color: "#B85032",
    textColor: "#ffffff",
    description: "Calcined natural earth from the Tuscan hills. Warm, translucent, possessing immense atmospheric warmth when layered over raw gesso.",
    opacity: "Semi-Transparent",
    medium: "Refined Cold-Pressed Linseed"
  },
  {
    id: "ochre",
    name: "French Raw Ochre",
    latin: "Sil Atticum",
    color: "#C79238",
    textColor: "#ffffff",
    description: "Hydrated iron oxide quarried in Roussillon. Imparts an eternal golden hour glow, reminiscent of Roman frescoes under low morning light.",
    opacity: "Semi-Opaque",
    medium: "Stand Oil & Walnut Oil"
  },
  {
    id: "veronese",
    name: "Terre Verte (Veronese)",
    latin: "Terra Viridis",
    color: "#4A604D",
    textColor: "#ffffff",
    description: "Celadonite and glauconite silicate. The classical underpainting ground used by Renaissance masters to breathe calm balance into skin tones.",
    opacity: "Transparent Glaze",
    medium: "Venice Turpentine"
  },
  {
    id: "ultramarine",
    name: "Prussian Lazurite",
    latin: "Lapis Lazuli Extract",
    color: "#284255",
    textColor: "#ffffff",
    description: "Deep oceanic mineral pigment with intense tinting strength. Produces bottomless contemplative depths in large scale monochromes.",
    opacity: "Semi-Transparent",
    medium: "Sun-Bleached Poppyseed Oil"
  },
  {
    id: "titanium",
    name: "Zinc & Titanium Gesso",
    latin: "Alba Impasto",
    color: "#F2EDE4",
    textColor: "#2B2824",
    description: "A luminous, non-yellowing chalk white with tactile impasto body. Applied with palette knives to sculpt light directly on the canvas.",
    opacity: "Dense Opaque",
    medium: "Cold-Wax & Walnut Paste"
  }
];

export const SELECTED_WORKS = [
  {
    id: "work-01",
    title: "Silence of the Ochre Valley",
    category: "Oil & Canvas",
    year: "2026",
    dimensions: "210 × 160 cm",
    medium: "Oil, Raw Ochre & Marble Dust on Belgian Linen",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    curatorNote: "An expansive study on atmospheric stillness. The heavy impasto transitions into paper-thin translucent glazes, capturing the precise threshold between dawn and dust.",
    palette: ["#B85032", "#C79238", "#E8DFD3", "#3C3026"],
    exhibition: "Venice Biennale Collateral Pavilion, 2026"
  },
  {
    id: "work-02",
    title: "Chroma & Spatial Resonance",
    category: "Spatial / Scenography",
    year: "2025",
    dimensions: "Site-Specific Architectural Intervention",
    medium: "Natural Pigment Washes, Acoustic Felt & Monochromatic Light",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    curatorNote: "Commissioned for the Fondation Cartier atrium. Monolithic linen scrims suspended in tension, catching sunlight throughout the day to modulate the interior warmth.",
    palette: ["#F6F3EE", "#DCD5C9", "#5A675B", "#1C1B19"],
    exhibition: "Fondation Cartier pour l'art contemporain, Paris"
  },
  {
    id: "work-03",
    title: "Monochrome Study in Terre Verte",
    category: "Oil & Canvas",
    year: "2025",
    dimensions: "190 × 140 cm",
    medium: "Veronese Earth, Linseed Resin & Chalk on Linen",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    curatorNote: "A masterwork of subtle gradation. Twenty-two translucent glaze layers applied over six months, resulting in an optical depth that shifts according to the viewer's angle.",
    palette: ["#4A604D", "#8A9A86", "#D7DDD3", "#1B241E"],
    exhibition: "Galerie Thaddaeus Ropac, Pantin"
  },
  {
    id: "work-04",
    title: "The Architecture of Oblivion",
    category: "Digital Direction",
    year: "2025",
    dimensions: "Generative 4K Projection & Sound",
    medium: "Simulated Fluid Impasto & Generative Organic Physics",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    curatorNote: "Bridging algorithmic precision with painterly imperfection. Digital particles calculate viscosity and surface tension based on historic oil formulas.",
    palette: ["#284255", "#5A7386", "#E1DCD3", "#111A22"],
    exhibition: "Mori Art Museum, Tokyo"
  },
  {
    id: "work-05",
    title: "Nocturne in Lazurite & Bone",
    category: "Oil & Canvas",
    year: "2024",
    dimensions: "240 × 180 cm",
    medium: "Prussian Lazurite, Burnt Bone Black & Dammar Varnish",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
    curatorNote: "Inspired by the nocturnal seas of Brittany. Deep indigo mineral pigments applied wet-on-wet with wide Japanese calligraphy hake brushes.",
    palette: ["#1D2A36", "#314B5C", "#869BA9", "#ECE7DF"],
    exhibition: "Palais de Tokyo, Paris"
  },
  {
    id: "work-06",
    title: "Diaphanous Form & Clay",
    category: "Spatial / Scenography",
    year: "2024",
    dimensions: "Sculptural Ceramic & Canvas Suite",
    medium: "Unglazed Terracotta, Limewash & Raw Hemp Fabric",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85",
    thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    curatorNote: "Investigating primitive tactile materiality. Sculpted vessels paired with large draped canvases that softly breathe in room air currents.",
    palette: ["#BA765A", "#E4CCBA", "#725244", "#F5EFE9"],
    exhibition: "21_21 DESIGN SIGHT, Tokyo"
  }
];

export const EXHIBITIONS = [
  {
    year: "2026",
    title: "Luminescence & Void",
    venue: "Pavilion of Light, Venice Biennale",
    city: "Venice, Italy",
    type: "Solo Exhibition"
  },
  {
    year: "2025",
    title: "Material Memory: 10 Years on Linen",
    venue: "Galerie Thaddaeus Ropac",
    city: "Paris, France",
    type: "Solo Retrospective"
  },
  {
    year: "2025",
    title: "Fluid Architectures",
    venue: "Mori Art Museum",
    city: "Tokyo, Japan",
    type: "Group Invitational"
  },
  {
    year: "2024",
    title: "The Weight of White",
    venue: "Kunsthalle Bern",
    city: "Bern, Switzerland",
    type: "Curated Installation"
  },
  {
    year: "2023",
    title: "Chromatic Stillness",
    venue: "White Cube Bermondsey",
    city: "London, UK",
    type: "Solo Exhibition"
  }
];

export const MONOGRAPHS_PRESS = [
  {
    title: "The Tactile Canvas: Monograph in Five Colors",
    publisher: "Hatje Cantz Verlag",
    year: "2025",
    detail: "Hardcover, 280 pages, Clothbound in Belgian Raw Linen"
  },
  {
    title: "Interview: On Pigment, Turpentine & Silence",
    publisher: "Frieze Magazine, Issue 242",
    year: "2025",
    detail: "Feature Conversation with Hans Ulrich Obrist"
  },
  {
    title: "The Architecture of Slowness",
    publisher: "Abitare Architectural Review",
    year: "2024",
    detail: "Critical Essay by Beatrice Galilee"
  }
];

export const SKILLS_DATA = [
  {
    id: "terra",
    roman: "I",
    title: "Physical Alchemy & Canvas",
    latin: "Materia Primordialis",
    natureMotif: "Raw Flax & Mineral Earths",
    pigment: "#B85032",
    pigmentName: "Burnt Sienna",
    quote: "Grinding stone and earth into light.",
    description: "Sourcing hand-woven Belgian flax, hand-grinding natural Tuscan earths, and formulating cold-wax glazes that breathe deep tactile warmth into physical rooms.",
    capabilities: [
      "Mineral Pigment Extraction",
      "Cold-Wax & Walnut Glazes",
      "Belgian Linen Preparation",
      "Sculptural Palette Knife Impasto",
      "Natural Gesso Substrates"
    ],
    metric: "100% Organic Binders"
  },
  {
    id: "aura",
    roman: "II",
    title: "Spatial Scenography & Light",
    latin: "Lux & Spatium",
    natureMotif: "Alpine Mist & Morning Light",
    pigment: "#C79238",
    pigmentName: "French Raw Ochre",
    quote: "Modulating the silence of physical space.",
    description: "Architectural installations and monolithic linen scrims suspended in tension, catching ambient daylight to sculpt the emotional temperature of atriums.",
    capabilities: [
      "Site-Specific Interventions",
      "Monolithic Linen Scrims",
      "Acoustic Natural Felt",
      "Circadian Light Studies",
      "Spatial Harmonization"
    ],
    metric: "Museum & Biennial Scale"
  },
  {
    id: "fluida",
    roman: "III",
    title: "Generative Nature & Shaders",
    latin: "Motus Fluens",
    natureMotif: "Waterfalls & Moss Currents",
    pigment: "#4A604D",
    pigmentName: "Terre Verte",
    quote: "Code as fluid digital watercolor.",
    description: "Translating mountain cascades and mossy forest viscosity into real-time WebGL shaders, fluid mechanics, and organic interactive physics on screen.",
    capabilities: [
      "WebGL & Custom GLSL Shaders",
      "Navier-Stokes Fluid Dynamics",
      "Generative Particle Physics",
      "Silky Inertial Interaction",
      "High-Performance Canvas"
    ],
    metric: "120 FPS GPU Physics"
  },
  {
    id: "folio",
    roman: "IV",
    title: "Editorial & Typographic Form",
    latin: "Littera Formosa",
    natureMotif: "Pressed Leaves & Archival Paper",
    pigment: "#284255",
    pigmentName: "Prussian Lazurite",
    quote: "The quiet power of negative space.",
    description: "Radical editorial restraint, high-contrast serif proportions, and monograph publication systems designed with reverence for white space and stillness.",
    capabilities: [
      "High-Fashion Display Typography",
      "Archival Monograph Systems",
      "Fine Art Creative Direction",
      "Minimalist Design Systems",
      "Curatorial Narratives"
    ],
    metric: "Hatje Cantz & Frieze Published"
  }
];

