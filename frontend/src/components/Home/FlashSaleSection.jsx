import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsapAnimations } from '../../utils/animations';
import ProductCard from '../ProductCard';
import { getFlashSale } from '../../data/products';

const FlashSaleSection = () => {
  const sectionRef = useRef(null);
  const products = getFlashSale();

  useEffect(() => {
    if (sectionRef.current) {
      gsapAnimations.scrollReveal(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-transparent relative">
      <div className="container mx-auto px-2 sm:px-4 relative">
        <div className="flex items-center justify-between mb-10 relative z-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gradient relative z-20">Flash Sale</h2>
          <Link
            to="/flash-sale"
            className="gradient-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-glow-green transition-all duration-300 hover:scale-105"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 relative z-[1]">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;

