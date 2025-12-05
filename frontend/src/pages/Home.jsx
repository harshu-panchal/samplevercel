import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HeroBanner from '../components/Home/HeroBanner';
import BrandLogosScroll from '../components/Home/BrandLogosScroll';
import CategoriesSection from '../components/Home/CategoriesSection';
import PromotionalBanners from '../components/Home/PromotionalBanners';
import MostPopularSection from '../components/Home/MostPopularSection';
import TrendingBanner from '../components/Home/TrendingBanner';
import TrendingItemsSection from '../components/Home/TrendingItemsSection';
import FlashSaleSection from '../components/Home/FlashSaleSection';
import PopularBrandsSection from '../components/Home/PopularBrandsSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import PageTransition from '../components/PageTransition';
import useHeaderHeight from '../hooks/useHeaderHeight';

const Home = () => {
  const headerHeight = useHeaderHeight();
  
  // Ensure body scroll is restored when component mounts
  useEffect(() => {
    document.body.style.overflowY = '';
    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background w-full overflow-x-hidden">
        <Header />
        <Navbar />
        <main className="w-full overflow-x-hidden" style={{ paddingTop: `${headerHeight}px` }}>
          <HeroBanner />
          <BrandLogosScroll />
          <CategoriesSection />
          <PromotionalBanners />
          <MostPopularSection />
          <TrendingBanner />
          <TrendingItemsSection />
          <FlashSaleSection />
          <PopularBrandsSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;

