import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsapAnimations } from '../../utils/animations';
import CategoryCard from '../CategoryCard';
import { categories } from '../../data/categories';

const CategoriesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsapAnimations.scrollReveal(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-transparent relative">
      <div className="container mx-auto px-2 sm:px-4 relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10 relative z-20 py-4 sm:py-6 min-h-[100px] sm:min-h-[120px]">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gradient relative z-20 leading-tight">Browse by Categories</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 relative z-[1]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

