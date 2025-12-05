import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsapAnimations } from '../../utils/animations';
import BrandCard from '../BrandCard';
import { brands } from '../../data/brands';

const PopularBrandsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsapAnimations.scrollReveal(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-transparent relative">
      <div className="container mx-auto px-2 sm:px-4 relative">
        <div className="flex items-center justify-between mb-10 relative z-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gradient relative z-20">Popular Brands</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 relative z-[1]">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <BrandCard brand={brand} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrandsSection;

