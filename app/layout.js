import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import UserContext from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";


const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Dronagiri Farm | Pure Farm-Fresh Organic Products",
  description:
    "Dronagiri Farm offers 100% natural, farm-fresh organic products including dals, grains, spices, oils, and ghee. Sourced directly from our farm to your table.",
  keywords:
    "organic farm, dronagiri farm, organic grains, desi ghee, farm fresh, natural products, haldi powder, basmati rice, khapli wheat",
  openGraph: {
    title: "Dronagiri Farm | Pure Farm-Fresh Organic Products",
    description:
      "100% natural farm-fresh organic products — dals, grains, spices, oils, ghee. Farm to table, the pure way.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-poppins)] bg-[#fdfbf7]">
        <UserContext>
          <CartProvider>
            <TooltipProvider>
              {children}
              <Toaster position="bottom-right" closeButton richColors />
            </TooltipProvider>
          </CartProvider>
            </UserContext>
      </body>
    </html>
  );
}
