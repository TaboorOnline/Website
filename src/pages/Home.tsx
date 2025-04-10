// src/pages/Home.tsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowDown, 
  CheckCircle, 
  Users, 
  Briefcase, 
  Calendar, 
  Award,
  Image as ImageIcon,
  CircleUser,
  ImageOff,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionTitle from '../components/common/SectionTitle';
import { getAllServices, getAllProjects, getApprovedTestimonials } from '../lib/supabase';
import { Service, Project, Testimonial } from '../lib/supabase';
import { isRTL } from '../i18n';

// Import the OptimizedImage component
import OptimizedImage from '../components/common/OptimizedImage';

const Home = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: false });
  
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll();
  const heroImageScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  
  // Get data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, projectsData, testimonialsData] = await Promise.all([
          getAllServices(),
          getAllProjects(),
          getApprovedTestimonials()
        ]);
        
        setServices(servicesData.slice(0, 6)); // Get first 6 services
        setProjects(projectsData.slice(0, 3)); // Get first 3 projects
        setTestimonials(testimonialsData.slice(0, 4)); // Get first 4 testimonials
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Smooth scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Motion effects for sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.1, 0.25, 0.3, 1],
      }
    }
  };

  // Stats counter animation
  const [counts, setCounts] = useState({
    clients: 0,
    projects: 0,
    years: 0,
    awards: 0
  });

  // Start counter when stats section comes into view
  useEffect(() => {
    if (statsInView) {
      const duration = 2000; // Animation duration (2 seconds)
      const interval = 20; // Every 20ms
      
      const targets = {
        clients: 200,
        projects: 150,
        years: 10,
        awards: 25
      };
      
      const steps = {
        clients: (targets.clients * interval) / duration,
        projects: (targets.projects * interval) / duration,
        years: (targets.years * interval) / duration,
        awards: (targets.awards * interval) / duration
      };
      
      let frame = 0;
      const counter = setInterval(() => {
        setCounts({
          clients: Math.min(Math.round(steps.clients * frame), targets.clients),
          projects: Math.min(Math.round(steps.projects * frame), targets.projects),
          years: Math.min(Math.round(steps.years * frame), targets.years),
          awards: Math.min(Math.round(steps.awards * frame), targets.awards)
        });
        
        frame++;
        
        if (
          frame > duration / interval || 
          (
            counts.clients >= targets.clients &&
            counts.projects >= targets.projects &&
            counts.years >= targets.years &&
            counts.awards >= targets.awards
          )
        ) {
          clearInterval(counter);
          setCounts(targets);
        }
      }, interval);
      
      return () => clearInterval(counter);
    }
  }, [statsInView]);

  // Feature motion effects
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  // Card hover animation
  const cardHoverAnimation = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: { 
        duration: 0.2, 
        ease: "easeInOut" 
      } 
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.2, 
        ease: "easeInOut" 
      } 
    }
  };

  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  // Helper function for fallback images
  const getPlaceholderImage = (type: string, index: number) => {
    // These are reliable placeholder services that generate colored placeholder images
    const colors = ['1E88E5', '43A047', 'E53935', 'FDD835', '5E35B1', '00ACC1'];
    const color = colors[index % colors.length];
    const dimensions = type === 'hero' ? '1200/600' : type === 'project' ? '600/400' : '300/300';
    
    return `https://dummyimage.com/${dimensions}/${color}/ffffff&text=${type[0].toUpperCase() + type.slice(1)}`;
  };
  
  // Function to generate SVG background patterns
  const generatePatternBackground = () => {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-white/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20"
      >
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            scale: heroImageScale,
            opacity: heroOpacity,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/80 dark:from-primary-950/90 dark:to-primary-800/80 z-10" />
          <OptimizedImage 
            src="/images/hero-bg.jpg" 
            alt="Hero Background" 
            className="w-full h-full"
            fallbackIcon={() => (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-600 dark:from-primary-900 dark:to-primary-700">
                {generatePatternBackground()}
              </div>
            )}
          />
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5 overflow-hidden opacity-40 pointer-events-none">
          <motion.div 
            className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-white/10 backdrop-blur-md"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute top-[20%] right-[15%] w-16 h-16 rounded-full bg-primary-400/10 backdrop-blur-md"
            animate={{
              y: [0, -15, 0],
              x: [0, -5, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-[30%] left-[20%] w-20 h-20 rounded-full bg-white/5 backdrop-blur-md"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className={`text-white ${isRTL() ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
              >
                <Sparkles size={16} className="mr-2 text-primary-300" />
                <span className="text-primary-100">{t('home.hero.badge') || 'Welcome to our world'}</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="relative inline-block">
                  {t('home.hero.title')}
                  <motion.span 
                    className="absolute -bottom-3 left-0 w-full h-2 bg-primary-500/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl mb-8 text-gray-100 max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {t('home.hero.subtitle')}
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4 rtl:space-x-reverse"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={scrollToServices}
                  className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  rightIcon={<ArrowIcon size={18} />}
                >
                  {t('home.hero.cta')}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  to="/contact"
                  className="border-white text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {t('nav.contact')}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className={`hidden lg:block ${isRTL() ? 'lg:order-1' : 'lg:order-2'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 backdrop-blur-md rounded-2xl rotate-3 scale-105"></div>
                <motion.div 
                  className="relative backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20 shadow-2xl"
                  whileHover={{ 
                    rotate: -2, 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <OptimizedImage
                    src="/images/hero-illustration.svg"
                    alt="Hero Illustration"
                    className="max-w-full h-auto rounded-lg"
                    fallbackIcon={() => (
                      <div className="h-64 flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, 0, -5, 0]
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            repeatType: "reverse" 
                          }}
                        >
                          <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="20" y="20" width="160" height="120" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                            <circle cx="100" cy="80" r="40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                            <path d="M80 80L110 60L110 100L80 80Z" fill="rgba(255,255,255,0.6)"/>
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -bottom-5 -left-5 bg-white text-primary-700 shadow-lg px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="text-yellow-500" size={16} /> 
                    {t('home.hero.badge1') || '10+ Years Experience'}
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-5 -right-5 bg-white text-primary-700 shadow-lg px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Heart className="text-red-500" size={16} /> 
                    {t('home.hero.badge2') || 'Loved by Clients'}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll down button */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <button
              onClick={scrollToServices}
              className="flex flex-col items-center text-white focus:outline-none group"
              aria-label="Scroll to services"
            >
              <span className="text-sm mb-2 opacity-80 group-hover:opacity-100 transition-opacity">{t('common.scrollDown')}</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={20} className="group-hover:text-primary-300 transition-colors" />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-70 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-70 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionTitle
            title={t('home.features.title')}
            subtitle={t('nav.about')}
            description={t('site.description')}
            fadeInView={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
            {/* Feature 1 */}
            <motion.div
              custom={0}
              variants={featureVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              whileHover="hover"
              initial="rest"
              variants={cardHoverAnimation}
              className="flex flex-col h-full"
            >
              <Card className="h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 rounded-xl overflow-hidden">
                <Card.Body className="flex flex-col items-center text-center p-6 sm:p-8">
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-4 rounded-full bg-primary-500/5 dark:bg-primary-500/10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div 
                      className="relative w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "var(--color-primary-200)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <CheckCircle size={32} />
                    </motion.div>
                  </div>
                  <Card.Title className="mb-3 text-xl font-bold">
                    {t('home.features.quality.title')}
                  </Card.Title>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('home.features.quality.description')}
                  </p>
                  
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <ul className="text-left space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Premium quality work</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Commitment to excellence</span>
                      </li>
                    </ul>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              custom={1}
              variants={featureVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              whileHover="hover"
              initial="rest"
              variants={cardHoverAnimation}
              className="flex flex-col h-full"
            >
              <Card className="h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 rounded-xl overflow-hidden">
                <Card.Body className="flex flex-col items-center text-center p-6 sm:p-8">
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-4 rounded-full bg-primary-500/5 dark:bg-primary-500/10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 4,
                        delay: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div 
                      className="relative w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "var(--color-primary-200)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Users size={32} />
                    </motion.div>
                  </div>
                  <Card.Title className="mb-3 text-xl font-bold">
                    {t('home.features.innovation.title')}
                  </Card.Title>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('home.features.innovation.description')}
                  </p>
                  
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <ul className="text-left space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cutting-edge solutions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Forward-thinking approaches</span>
                      </li>
                    </ul>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              custom={2}
              variants={featureVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              whileHover="hover"
              initial="rest"
              variants={cardHoverAnimation}
              className="flex flex-col h-full md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0 md:max-w-md lg:max-w-none"
            >
              <Card className="h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 rounded-xl overflow-hidden">
                <Card.Body className="flex flex-col items-center text-center p-6 sm:p-8">
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-4 rounded-full bg-primary-500/5 dark:bg-primary-500/10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 4,
                        delay: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div 
                      className="relative w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "var(--color-primary-200)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Briefcase size={32} />
                    </motion.div>
                  </div>
                  <Card.Title className="mb-3 text-xl font-bold">
                    {t('home.features.support.title')}
                  </Card.Title>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('home.features.support.description')}
                  </p>
                  
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <ul className="text-left space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">24/7 dedicated support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fast response times</span>
                      </li>
                    </ul>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-16 sm:py-20 md:py-24 bg-primary-900 dark:bg-primary-950 text-white relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-700/20 rounded-full translate-x-1/2 translate-y-1/2 filter blur-3xl"></div>
          {generatePatternBackground()}
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-1 opacity-20 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white/20"
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionTitle
            title={t('home.stats.title')}
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
            withAccent={true}
            accentColor="primary"
            fadeInView={true}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12">
            {/* Stat 1 */}
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Users size={28} className="text-primary-300" />
                </div>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-white mb-2 flex justify-center"
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, delay: counts.clients * 0.01 }}
                >
                  {counts.clients}
                </motion.span>
                <span className="text-primary-300">+</span>
              </motion.div>
              <p className="text-gray-300">{t('home.stats.clients')}</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Briefcase size={28} className="text-primary-300" />
                </div>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-white mb-2 flex justify-center"
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, delay: counts.projects * 0.01 }}
                >
                  {counts.projects}
                </motion.span>
                <span className="text-primary-300">+</span>
              </motion.div>
              <p className="text-gray-300">{t('home.stats.projects')}</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Calendar size={28} className="text-primary-300" />
                </div>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-white mb-2 flex justify-center"
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, delay: counts.years * 0.1 }}
                >
                  {counts.years}
                </motion.span>
                <span className="text-primary-300">+</span>
              </motion.div>
              <p className="text-gray-300">{t('home.stats.years')}</p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Award size={28} className="text-primary-300" />
                </div>
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-white mb-2 flex justify-center"
                initial={{ opacity: 0 }}
                animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, delay: counts.awards * 0.04 }}
                >
                  {counts.awards}
                </motion.span>
                <span className="text-primary-300">+</span>
              </motion.div>
              <p className="text-gray-300">{t('home.stats.awards')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl opacity-30 -mb-32 -ml-32 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle
              title={t('services.title')}
              subtitle={t('services.subtitle')}
              description={t('services.description')}
              fadeInView={true}
              className="md:max-w-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 md:mt-0"
            >
              <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-700 shadow-sm flex">
                <button className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-primary-500 text-white font-medium">
                  {t('services.allServices')}
                </button>
                <button className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium">
                  {t('services.popular')}
                </button>
                <button className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium">
                  {t('services.newest')}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
                </div>
              ))
            ) : services.length > 0 ? (
              // Display services
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="h-full"
                >
                  <Card className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                    <Card.Body className="p-6">
                      <div className="flex items-start">
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <span dangerouslySetInnerHTML={{ __html: service.icon }} />
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <Card.Title className="text-xl font-semibold">
                              {isRTL() ? service.title_ar : service.title_en}
                            </Card.Title>
                            <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full font-medium">
                              {t('services.popular')}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {isRTL() ? service.description_ar : service.description_en}
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <Button
                              variant="link"
                              to={`/services#${service.id}`}
                              className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center group"
                              rightIcon={
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ArrowIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                              }
                            >
                              {t('common.readMore')}
                            </Button>
                            
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                            >
                              <Heart size={14} />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('common.emptyState')}
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              to="/services"
              rightIcon={<ArrowIcon size={18} />}
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {t('common.seeAll')}
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl opacity-70 -mb-32 -mr-32 z-0"></div>
        <div className="absolute top-40 left-0 w-64 h-64 bg-gray-100 dark:bg-gray-800/50 rounded-full blur-3xl opacity-70 -ml-32 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <SectionTitle
                title={t('projects.title')}
                subtitle={t('projects.subtitle')}
                description={t('projects.description')}
                fadeInView={true}
                className="md:max-w-2xl"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 md:mt-0 flex space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-400"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/50"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {isLoading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-600"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-5/6"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
              ) : projects.length > 0 ? (
                // Display projects
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden group">
                        <OptimizedImage 
                          src={project.image_url || getPlaceholderImage('project', index)} 
                          alt={isRTL() ? project.title_ar : project.title_en}
                          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallbackIcon={() => (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <ImageIcon size={32} className="text-gray-400 dark:text-gray-600" />
                            </div>
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-sm mb-2">{isRTL() ? project.category_ar : project.category_en}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.tech_stack.slice(0, 3).map((tech, i) => (
                                <motion.span
                                  key={i}
                                  className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full"
                                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                              {project.tech_stack.length > 3 && (
                                <motion.span 
                                  className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-full"
                                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                >
                                  +{project.tech_stack.length - 3}
                                </motion.span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm cursor-pointer text-white"
                          >
                            <Heart size={14} />
                          </motion.div>
                        </div>
                      </div>
                      <Card.Body className="p-6">
                        <Card.Title className="mb-2 text-xl font-semibold">
                          {isRTL() ? project.title_ar : project.title_en}
                        </Card.Title>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {isRTL() ? project.description_ar : project.description_en}
                        </p>
                        
                        <Button
                          variant="outline"
                          to={`/projects/${project.id}`}
                          className="w-full justify-center hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 group"
                          rightIcon={
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                            >
                              <ArrowIcon size={16} />
                            </motion.div>
                          }
                        >
                          {t('projects.viewProject')}
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))
              ) : (
                // Empty state
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('projects.noProjects')}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="primary"
                size="lg"
                to="/projects"
                rightIcon={<ArrowIcon size={18} />}
                className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {t('common.seeAll')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full translate-x-1/2 -translate-y-1/2 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700/20 rounded-full -translate-x-1/2 translate-y-1/2 filter blur-3xl"></div>
          {generatePatternBackground()}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
            >
              <Sparkles size={16} className="mr-2 text-primary-300" />
              <span className="text-primary-100">{t('home.cta.badge') || 'Let\'s Work Together'}</span>
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('home.cta.title')}
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('home.cta.description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                to="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                rightIcon={
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <ArrowIcon size={18} />
                  </motion.div>
                }
              >
                {t('home.cta.button')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50 -ml-32 -mt-32 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionTitle
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
            description={t('testimonials.description')}
            fadeInView={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {isLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 animate-pulse">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ))
            ) : testimonials.length > 0 ? (
              // Display testimonials
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-300 rounded-xl">
                    <Card.Body className="p-6">
                      <div className="absolute top-6 right-6 text-primary-300 dark:text-primary-400 opacity-30">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.16667 7H4.83333C3.92286 7 3.46752 7 3.13459 7.16853C2.84241 7.31502 2.61385 7.55912 2.47704 7.86458C2.32005 8.21472 2.33538 8.67387 2.36604 9.59217L2.45296 12.1479C2.53988 14.8891 2.59365 17.2565 2.5347 18.4826C2.50289 19.0918 2.43132 19.5469 2.30108 19.8746C2.21907 20.0723 2.23394 20.3081 2.34128 20.4942C2.44861 20.6804 2.63486 20.7981 2.8452 20.8033C3.00413 20.8069 3.22563 20.7453 3.63378 20.6222C4.80978 20.2196 6.45211 19.3559 7.8552 18.3927C8.44334 17.9912 8.73741 17.7904 9.07532 17.6827C9.3679 17.5895 9.67834 17.5562 9.98695 17.5843C10.3413 17.6169 10.6678 17.7559 11.3208 18.0339L13.0256 18.7799C14.7876 19.5177 16.4933 20.2339 17.8015 20.5722C18.2283 20.6763 18.5683 20.7424 18.8212 20.7424C19.0242 20.7424 19.2199 20.6652 19.367 20.5258C19.5142 20.3865 19.6018 20.1991 19.6128 20C19.6275 19.7414 19.5588 19.3655 19.4213 18.7897C19.0248 17.131 18.2276 14.3477 17.9293 13.2637C17.8519 12.9877 17.8132 12.8497 17.7993 12.732C17.7855 12.6143 17.7822 12.4864 17.7902 12.3654C17.8009 12.1972 17.8452 12.0398 17.9339 11.7248L18.9528 8.66894C19.134 8.12437 19.2246 7.85209 19.2267 7.62355C19.2286 7.42522 19.1657 7.2331 19.0494 7.07766C18.9168 6.90023 18.6731 6.80129 18.1855 6.60342C16.8117 6.00522 14.1308 5 12.4167 5C11.5062 5 11.051 5 10.7181 5.16853C10.4259 5.31502 10.1973 5.55912 10.0605 5.86458C9.90354 6.21472 9.91886 6.67387 9.94953 7.59217L9.96531 7.91493C9.9683 7.95706 9.96979 7.97813 9.97263 8C9.98432 8.09099 10.0338 8.1709 10.1067 8.22372C10.1248 8.23782 10.1439 8.25028 10.1821 8.2752L10.1822 8.27524L10.3463 8.36455C10.5081 8.45372 10.589 8.49831 10.6361 8.56512C10.6793 8.62645 10.6993 8.69899 10.6938 8.772C10.6877 8.85183 10.6497 8.93367 10.5736 9.09734L9.1875 12.3267C9.14321 12.4183 9.12107 12.4641 9.11212 12.5124C9.10388 12.5564 9.10388 12.6011 9.11212 12.6451C9.12107 12.6934 9.14321 12.7392 9.1875 12.8308L9.73828 14.1367C9.94993 14.6236 10.0558 14.8671 9.9983 15.0596C9.94748 15.2311 9.82753 15.372 9.66725 15.442C9.48606 15.5215 9.21856 15.4536 8.68356 15.3177L5.31542 14.3885C5.06705 14.3155 4.94286 14.279 4.82061 14.2684C4.71017 14.2589 4.59913 14.2693 4.49373 14.2991C4.37654 14.3323 4.27273 14.3972 4.06511 14.5271C3.31593 15.0175 1.76741 15.8285 1.76741 15.8285" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex items-start mb-6">
                        <div className="flex-shrink-0 mr-4 rtl:ml-4 rtl:mr-0">
                          {testimonial.image_url ? (
                            <OptimizedImage 
                              src={testimonial.image_url} 
                              alt={testimonial.name} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                              fallbackIcon={() => (
                                <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                  <CircleUser size={28} />
                                </div>
                              )}
                            />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                              className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400"
                            >
                              <span className="text-lg font-medium">
                                {testimonial.name.charAt(0)}
                              </span>
                            </motion.div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.position}, {testimonial.company}
                          </p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.svg 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating 
                                    ? 'text-yellow-500' 
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                whileHover={{ scale: 1.2, rotate: i < testimonial.rating ? 5 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </motion.svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic relative">
                        <span className="text-3xl text-primary-300/20 absolute -top-2 -left-1">"</span>
                        {isRTL() ? testimonial.content_ar : testimonial.content_en}
                        <span className="text-3xl text-primary-300/20 absolute -bottom-5 -right-1">"</span>
                      </p>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('testimonials.noTestimonials')}
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              to="/testimonials"
              rightIcon={<ArrowIcon size={18} />}
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {t('common.seeAll')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;