import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import BannerPage from "@/components/Banner";
import ProductsCard from "@/components/ProductsCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Marquee />
      <BannerPage />
      <ProductsCard/>
    </div>
  );
}