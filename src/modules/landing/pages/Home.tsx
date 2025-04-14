// src/modules/landing/pages/Home.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import Reviews from '../components/Reviews';
import Team from '../components/Team';
import BlogPreview from '../components/BlogPreview';
import ContactForm from '../components/ContactForm';

const Home = () => {
  // const { t } = useTranslation();

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define animation variants for scroll animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Projects Showcase */}
      <Projects />

      {/* Timeline / Company History */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Timeline />
      </motion.div>

      {/* Customer Reviews */}
      <Reviews />

      {/* Team Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Team />
      </motion.div>

      {/* Blog Preview */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <BlogPreview />
      </motion.div>

      {/* Contact Form */}
      <ContactForm />

      {/* Scroll to top button - appears after scrolling */}
      <ScrollToTopButton />
    </div>
  );
};

// Scroll to top button component
const ScrollToTopButton = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    const toggleVisibility = () => {
      const button = document.getElementById('scroll-to-top');
      if (button) {
        if (window.pageYOffset > 500) {
          button.classList.remove('opacity-0', 'pointer-events-none');
          button.classList.add('opacity-100');
        } else {
          button.classList.remove('opacity-100');
          button.classList.add('opacity-0', 'pointer-events-none');
        }
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      id="scroll-to-top"
      onClick={scrollToTop}
      aria-label={t('general.scrollToTop')}
      className="fixed bottom-8 right-8 p-3 rounded-full bg-primary-600 text-white shadow-lg opacity-0 pointer-events-none transition-opacity duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default Home;