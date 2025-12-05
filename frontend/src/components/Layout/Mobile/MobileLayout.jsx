import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileCartBar from './MobileCartBar';
import CartDrawer from '../../Cart/CartDrawer';
import useMobileHeaderHeight from '../../../hooks/useMobileHeaderHeight';

const MobileLayout = ({ children, showBottomNav = true, showCartBar = true }) => {
  const location = useLocation();
  const headerHeight = useMobileHeaderHeight();
  // Always show bottom nav on /app routes
  const shouldShowBottomNav = location.pathname.startsWith('/app') ? true : showBottomNav;
  // Hide header on categories, search, wishlist, and profile pages
  const shouldShowHeader = location.pathname !== '/app/categories' && location.pathname !== '/app/search' && location.pathname !== '/app/wishlist' && location.pathname !== '/app/profile';
  
  // Ensure body scroll is restored when component mounts
  useEffect(() => {
    document.body.style.overflowY = '';
    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <>
      {shouldShowHeader && <MobileHeader />}
      <main 
        className={`min-h-screen w-full overflow-x-hidden ${shouldShowBottomNav ? 'pb-20' : ''} ${showCartBar ? 'pb-24' : ''}`}
        style={{ paddingTop: shouldShowHeader ? `${headerHeight}px` : '0px' }}
      >
        {children}
      </main>
      {showCartBar && <MobileCartBar />}
      {shouldShowBottomNav && <MobileBottomNav />}
      <CartDrawer />
    </>
  );
};

export default MobileLayout;

