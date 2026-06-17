import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import UserContext from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import axios from "axios";


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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let initialUser = undefined;
  let initialCart = undefined;
  let initialOrders = undefined;

  if (token) {
    const serverUrl = "http://localhost:8000";
    try {
      const [userRes, cartRes, ordersRes] = await Promise.all([
        axios.get(`${serverUrl}/api/user/current`, {
          headers: { Cookie: `token=${token}` }
        }),
        axios.get(`${serverUrl}/api/cart`, {
          headers: { Cookie: `token=${token}` }
        }),
        axios.get(`${serverUrl}/api/orders`, {
          headers: { Cookie: `token=${token}` }
        })
      ]);

      initialUser = userRes.data;
      initialCart = cartRes.data;
      initialOrders = ordersRes.data;
    } catch (err) {
      console.error("Error fetching SSR initial data:", err.message);
    }
  } else {
    initialUser = null;
    initialCart = null;
    initialOrders = null;
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-poppins)] bg-[#fdfbf7]">
        <UserContext initialUser={initialUser}>
          <CartProvider initialCart={initialCart} initialOrders={initialOrders}>
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
