import {
  Bean,
  Candy,
  Circle,
  Droplets,
  Leaf,
  Milk,
  Nut,
  Sparkles,
  Sprout,
  Sun,
  Wheat,
} from "lucide-react";

const productIconMap = {
  "Haldi Powder": Leaf,
  Ragi: Wheat,
  Lobia: Bean,
  Shengdana: Nut,
  Soyabean: Sprout,
  Rajma: Bean,
  "Gud Powder": Sparkles,
  "Gud Cubes (Khada Gud)": Candy,
  Sugar: Circle,
  "Masoor Dal": Bean,
  "Urad Dal White": Circle,
  "Chana Dal": Bean,
  "Moong Dal": Sprout,
  "Arhar Dal": Bean,
  "Basmati Whole": Wheat,
  "Basmati Tukda": Wheat,
  "Khapli Wheat": Wheat,
  "Sihore Wheat": Wheat,
  Jowar: Wheat,
  "Desi Ghee": Milk,
  "Ground Nut Oil": Droplets,
  "Sunflower Oil": Sun,
};

const categoryIconMap = {
  Spices: Leaf,
  Millets: Wheat,
  Pulses: Bean,
  Rice: Wheat,
  "Wheat & Grains": Wheat,
  "Oils & Ghee": Droplets,
  Sweeteners: Candy,
  "Nuts & Seeds": Nut,
};

export default function ProductIcon({ product, className = "" }) {
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className="object-cover rounded-2xl w-24 h-24 shadow-sm"
      />
    );
  }

  const Icon =
    productIconMap[product.name] || categoryIconMap[product.category] || Leaf;

  return <Icon className={className} aria-hidden="true" />;
}
