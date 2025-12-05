import { motion } from 'framer-motion';
import { brands } from '../../data/brands';
import LazyImage from '../LazyImage';

const BrandLogosScroll = () => {
  // Use existing brands, can be expanded to 8-10 when more brands are added
  const displayBrands = brands.slice(0, 10);

  return (
    <section className="bg-transparent w-full overflow-hidden">
      <div className="w-full">
        <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-3 sm:gap-4 min-w-max px-4 pb-2">
            {displayBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-shrink-0 flex flex-col items-center"
                style={{
                  width: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                  minWidth: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                  maxWidth: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 md:p-3 shadow-md transition-all duration-300 flex items-center justify-center w-full aspect-square group cursor-pointer border border-gray-100 mb-2">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-[85%] h-[85%] object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x80?text=Brand';
                    }}
                    loading="lazy"
                  />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-black text-center transition-colors truncate w-full px-1">
                  {brand.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosScroll;

