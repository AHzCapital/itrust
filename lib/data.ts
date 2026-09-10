export type Asset = {
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  type: string;
  status: string;
  category: string;
  area: string;
  description: string;
  owner: string;
  verification: string[];
  highlights: string[];
  accent: string;
};

export const assets: Asset[] = [
  {
    id: "nile-view-villa",
    title: "Contemporary Villa with Nile View",
    location: "Maadi, Cairo, Egypt",
    price: "EGP 45M",
    priceValue: 45000000,
    type: "Residential",
    status: "Verified",
    category: "Villas",
    area: "620 m²",
    description: "A private contemporary residence with generous interiors, landscaped outdoor space, and a rare Nile-facing position in one of Cairo's established residential districts.",
    owner: "Verified private seller",
    verification: ["Ownership documents reviewed", "Property documentation checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Nile-facing outlook", "Private garden", "Contemporary architecture", "Prime Cairo location"],
    accent: "villa",
  },
  {
    id: "skyline-penthouse",
    title: "Skyline Penthouse",
    location: "New Cairo, Egypt",
    price: "EGP 18M",
    priceValue: 18000000,
    type: "Residential",
    status: "Verified",
    category: "Apartments",
    area: "310 m²",
    description: "A high-floor penthouse designed around light, privacy, and expansive city views, with a refined interior footprint suited to modern Cairo living.",
    owner: "Verified private seller",
    verification: ["Ownership documents reviewed", "Property documentation checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Panoramic views", "Private terrace", "High-floor residence", "New Cairo"],
    accent: "penthouse",
  },
  {
    id: "modern-commercial-building",
    title: "Modern Commercial Building",
    location: "Giza, Egypt",
    price: "EGP 32M",
    priceValue: 32000000,
    type: "Commercial",
    status: "Verified",
    category: "Commercial",
    area: "1,140 m²",
    description: "A modern income-oriented commercial property with flexible floor plates and a location designed for established businesses and long-term operators.",
    owner: "Verified corporate seller",
    verification: ["Ownership documents reviewed", "Commercial records checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Flexible floor plates", "Commercial zoning", "Established district", "Income potential"],
    accent: "commercial",
  },
  {
    id: "prime-development-land",
    title: "Prime Development Land",
    location: "New Cairo, Egypt",
    price: "EGP 28M",
    priceValue: 28000000,
    type: "Land",
    status: "Verified",
    category: "Land",
    area: "2,400 m²",
    description: "A development-ready land opportunity positioned for investors seeking a sizable plot in a high-demand growth corridor.",
    owner: "Verified corporate seller",
    verification: ["Title documentation reviewed", "Land records checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Large plot", "Growth corridor", "Development potential", "Clear documentation"],
    accent: "land",
  },
  {
    id: "private-garden-villa",
    title: "Private Garden Villa",
    location: "6th of October, Egypt",
    price: "EGP 12.5M",
    priceValue: 12500000,
    type: "Residential",
    status: "Verified",
    category: "Villas",
    area: "410 m²",
    description: "A family-oriented villa with a private garden, generous living spaces, and a quiet residential setting close to key West Cairo destinations.",
    owner: "Verified private seller",
    verification: ["Ownership documents reviewed", "Property documentation checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Private garden", "Family layout", "Quiet community", "West Cairo"],
    accent: "garden",
  },
  {
    id: "boutique-office-floor",
    title: "Boutique Office Floor",
    location: "Zamalek, Cairo, Egypt",
    price: "EGP 8M",
    priceValue: 8000000,
    type: "Commercial",
    status: "Verified",
    category: "Commercial",
    area: "265 m²",
    description: "A compact premium office floor in a central Cairo address, suited to professional firms, boutique operators, or owner-occupiers.",
    owner: "Verified private seller",
    verification: ["Ownership documents reviewed", "Property documentation checked", "Seller identity verified", "Listing information reviewed"],
    highlights: ["Central address", "Boutique scale", "Professional setting", "Flexible use"],
    accent: "office",
  },
];

export function getAsset(id: string) {
  return assets.find((asset) => asset.id === id);
}

export const categories = ["All", "Residential", "Commercial", "Land"];
