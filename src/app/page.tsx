import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { NewsTicker } from "@/components/sections/NewsTicker";
import { QuickAccess } from "@/components/sections/QuickAccess";
import { UtilityNumbers } from "@/components/sections/UtilityNumbers";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { HomePromoPopup } from "@/components/sections/HomePromoPopup";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <Hero />
        <NewsTicker />
        <QuickAccess />
        <UtilityNumbers />
        <NewsGrid />
      </main>
      <Footer />
      <HomePromoPopup />
    </>
  );
}
