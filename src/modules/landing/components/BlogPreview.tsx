// src/modules/landing/components/BlogPreview.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser, FiFileText } from 'react-icons/fi';
import { useBlogPosts } from '../services/blogService';
// import Button from '../../../shared/components/Button';
// import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const BlogPreview = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const { data: posts, isLoading, error } = useBlogPosts(3); // Limit to 3 most recent posts
  const currentLanguage = i18n.language as 'en' | 'ar';
  const isRTL = currentLanguage === 'ar';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderBlogPosts = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-8">
              <div className="h-4 w-24 bg-indigo-200 dark:bg-indigo-900 rounded-full mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-4"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-4 px-6 rounded-lg inline-block">
            {t('errors.blogLoadFailed')}
          </p>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{t('blog.noPosts')}</p>
        </div>
      );
    }

    return posts.map((post) => {
      const postTranslations = (typeof post.translations === 'object' && !Array.isArray(post.translations)
        ? (post.translations as Record<string, any>)[currentLanguage]
        : {}) || {};
      const title = postTranslations.title || post.title;
      const excerpt = postTranslations.excerpt || post.excerpt;
      
      return (
        <motion.div key={post.id} variants={itemVariants}>
          <Link to={`/blog/${post.slug}`} className="block h-full group">
            <div className="h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image 
                  src={post.featured_image} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  customIcon={
                    <div className="flex flex-col items-center justify-center h-full">
                      <FiFileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('blog.imageNotAvailable')}
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                    {(post as { category?: string }).category || t('blog.defaultCategory')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex items-center">
                    <FiCalendar className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span>{post.profiles?.name || t('blog.admin')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950" id="blog-preview">
      {/* Subtle color accents */}
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full opacity-50 -z-10 blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-rose-100 dark:bg-rose-950 rounded-full opacity-50 -z-10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-5">
              {t('blog.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('blog.latestTitle')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('blog.latestSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {renderBlogPosts()}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants}>
            <Link to="/blog">
              <button className="px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/20 flex items-center mx-auto">
                <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('blog.viewAll')}</span>
                <FiArrowRight className={`transition-transform duration-300 group-hover:${isRTL ? 'translate-x-minus-1' : 'translate-x-1'}`} />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;