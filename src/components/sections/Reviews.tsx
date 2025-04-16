import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiUser } from 'react-icons/fi';
import { useReviews } from '../../services/reviewService';
import { Review } from '../../types/types';
// import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../common/Image';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const { data: reviews, isLoading, error } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <FiStar
        key={index}
        className={`${
          index < rating
            ? 'text-amber-400 fill-current dark:text-amber-500'
            : 'text-gray-300 dark:text-gray-700'
        } w-5 h-5`}
      />
    ));
  };

  const handlePrevious = () => {
    if (!reviews) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (!reviews) return;
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
  };

  const currentLanguage = i18n.language as 'en' | 'ar';
  // const isRTL = currentLanguage === 'ar';

  const renderReviewContent = (review: Review) => {
    const reviewTranslations = (review.translations as Record<'en' | 'ar', { content?: string, name?: string, position?: string, company?: string }> | undefined)?.[currentLanguage] || {};
    const content = reviewTranslations.content || review.content;
    const name = reviewTranslations.name || review.name;
    const position = reviewTranslations.position || review.position;
    const company = reviewTranslations.company || review.company;

    return (
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-950/5 transition-all duration-500">
        {/* Left side - Avatar and info */}
        <div className="w-full md:w-1/3 bg-indigo-600 dark:bg-indigo-900 text-white p-8 md:p-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full overflow-hidden ring-4 ring-indigo-400 dark:ring-indigo-700 shadow-lg mb-6">
            {review.avatar_url ? (
              <Image 
                src={review.avatar_url} 
                alt={name} 
                className="w-full h-full object-cover"
                customIcon={
                  <div className="flex items-center justify-center h-full w-full">
                    <FiUser className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
                  </div>
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-indigo-100 dark:bg-indigo-950">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <h4 className="text-xl font-bold text-white mb-1">{name}</h4>
          <p className="text-indigo-200 dark:text-indigo-300 mb-6">
            <span className="font-medium">{position}</span>
            {company && <span> @ {company}</span>}
          </p>
          
          <div className="flex space-x-1 rtl:space-x-reverse">
            {renderStars(review.rating)}
          </div>
        </div>
        
        {/* Right side - Review content */}
        <div className="w-full md:w-2/3 p-8 md:p-10 relative" dir="auto">
          {/* Quote marks */}
          <svg className="absolute top-6 left-6 w-12 h-12 text-indigo-100 dark:text-indigo-950 transform -scale-x-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
          </svg>
          
          <div className="relative z-10">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8 italic">"{content}"</p>
            
            {/* Date and time info */}
            <div className="text-sm text-gray-500 dark:text-gray-500 italic">
              {review.date && <span>{new Date(review.date).toLocaleDateString(i18n.language)}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-950" dir="auto">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-5">
              {t('reviews.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('reviews.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('reviews.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="max-w-5xl mx-auto relative"
        >
          {isLoading ? (
            <div className="animate-pulse">
              <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden">
                <div className="w-full md:w-1/3 bg-indigo-200 dark:bg-indigo-900/60 h-72 md:h-auto"></div>
                <div className="w-full md:w-2/3 bg-gray-100 dark:bg-gray-800 p-10">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-36 mb-4"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6"></div>
                  </div>
                  <div className="h-4 w-40 mt-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-4 px-6 rounded-lg inline-block">
                {t('errors.reviewsLoadFailed')}
              </p>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="relative">
              {/* Main review container */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {renderReviewContent(reviews[currentIndex])}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation controls */}
              {reviews.length > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevious}
                    className="p-3 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300"
                    aria-label={t('reviews.previous')}
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  
                  {/* Review counter */}
                  <div className="text-gray-500 dark:text-gray-400 font-medium">
                    {currentIndex + 1} / {reviews.length}
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300"
                    aria-label={t('reviews.next')}
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">{t('reviews.noReviews')}</p>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants}>
            <a
              href="#contact-form"
              className="px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/20 inline-block"
            >
              {t('reviews.submitReview')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;