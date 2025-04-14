// src/modules/landing/components/Reviews.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiUser } from 'react-icons/fi';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useReviews } from '../services/reviewService';
import { Review } from '../../../shared/types/types';
import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: reviews, isLoading, error } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <FiStar
        key={index}
        className={`${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
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

  const renderReviewContent = (review: Review) => {
    const reviewTranslations = (review.translations as Record<'en' | 'ar', { content?: string, name?: string, position?: string, company?: string }> | undefined)?.[currentLanguage] || {};
    const content = reviewTranslations.content || review.content;
    const name = reviewTranslations.name || review.name;
    const position = reviewTranslations.position || review.position;
    const company = reviewTranslations.company || review.company;

    return (
      <>
        <div className="flex mb-5">{renderStars(review.rating)}</div>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">"{content}"</p>
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full overflow-hidden flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
            {review.avatar_url ? (
              <Image 
                src={review.avatar_url} 
                alt={name} 
                className="w-full h-full object-cover"
                customIcon={
                  <div className="flex items-center justify-center h-full w-full">
                    <FiUser className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                }
              />
            ) : (
              <span className="text-xl font-semibold text-blue-500 dark:text-blue-400">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="ml-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{position}</span>
              {company && `, ${company}`}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-50/30 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
        
        <div className="absolute -top-20 right-1/4 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl opacity-70"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.span 
            variants={itemVariants} 
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
          >
            {t('reviews.badge')}
          </motion.span>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('reviews.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('reviews.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="max-w-4xl mx-auto relative"
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            {/* Decorative quote marks */}
            <div className="absolute -top-6 -left-6 text-9xl text-blue-100 dark:text-blue-900/30 font-serif">
              "
            </div>
            <div className="absolute -bottom-24 -right-6 text-9xl text-blue-100 dark:text-blue-900/30 font-serif rotate-180">
              "
            </div>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="flex mb-6 space-x-1">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md mb-3 w-full"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md mb-3 w-5/6"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md mb-8 w-4/6"></div>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="ml-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-48"></div>
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
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="min-h-[240px]"
                  >
                    {renderReviewContent(reviews[currentIndex])}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">{t('reviews.noReviews')}</p>
              </div>
            )}
          </div>

          {reviews && reviews.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                aria-label={t('reviews.previous')}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Pagination indicators */}
              <div className="flex items-center space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === index 
                        ? 'bg-blue-500 dark:bg-blue-400 w-6' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-300 dark:hover:bg-blue-700'
                    }`}
                    aria-label={`${t('reviews.goToReview')} ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                aria-label={t('reviews.next')}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="mt-16 text-center"
        >
          <a
            href="#contact-form"
            className="px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-300 inline-block"
          >
            {t('reviews.submitReview')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;