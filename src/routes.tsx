// src/app/routes.tsx
import React, { ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingLayout from './components/layout/LandingLayout';

// Landing pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';


// 404 page
import NotFound from './pages/NotFound';

// Page transitions
const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing pages */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <PageTransition>
              <Home />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/services"
        element={
          <LandingLayout>
            <PageTransition>
              <Services />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/about"
        element={
          <LandingLayout>
            <PageTransition>
              <About />
            </PageTransition>
          </LandingLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <LandingLayout>
            <PageTransition>
              <Contact />
            </PageTransition>
          </LandingLayout>
        }
      />
      
 
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;