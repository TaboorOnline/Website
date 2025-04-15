// src/modules/landing/pages/Blog.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiTag, FiArchive } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../services/blogService';
// import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import useDebounce from '../../../shared/hooks/useDebounce';
import Image from '../../../shared/components/Image';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: posts, isLoading, error } = useBlogPosts();
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const currentLanguage = i18n.language as 'en' | 'ar';

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extract all unique tags from posts
  useEffect(() => {
    if (posts) {
      const tags = new Set<string>();
      posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    }
  }, [posts]);

  // Filter posts based on search query and selected tag
  useEffect(() => {
    if (posts) {
      let filtered = [...posts];
      
      if (debouncedSearchQuery) {
        const lowerSearchQuery = debouncedSearchQuery.toLowerCase();
        filtered = filtered.filter(post => {
          const postTitle = (((post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage]?.title) || post.title).toLowerCase();
          const postExcerpt = (((post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage]?.excerpt) || post.excerpt).toLowerCase();
          const postContent = (((post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage]?.content) || post.content).toLowerCase();
          
          return (
            postTitle.includes(lowerSearchQuery) ||
            postExcerpt.includes(lowerSearchQuery) ||
            postContent.includes(lowerSearchQuery)
          );
        });
      }
      
      if (selectedTag) {
        filtered = filtered.filter(post => 
          post.tags && Array.isArray(post.tags) && post.tags.includes(selectedTag)
        );
      }
      
      setFilteredPosts(filtered);
    }
  }, [posts, debouncedSearchQuery, selectedTag, currentLanguage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero section */}
      <section className="relative py-24 bg-white dark:bg-gray-950">
        {/* Color accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-100 dark:bg-indigo-950 rounded-full"></div>
          <div className="absolute top-1/2 -left-24 w-48 h-48 bg-rose-100 dark:bg-rose-950 rounded-full"></div>
          <div className="absolute -bottom-32 right-1/2 w-80 h-80 bg-amber-100 dark:bg-amber-950 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">
                {t('blog.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              {t('blog.pageTitle')}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {t('blog.pageSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Search for mobile */}
              <div className="lg:hidden mb-8">
                <Input
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch className="text-gray-400" />}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>

              {/* Blog posts */}
              {isLoading ? (
                <div className="space-y-8">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="aspect-video md:aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="md:col-span-2">
                          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4 mb-4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6"></div>
                          </div>
                          <div className="flex justify-between mt-6">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <p className="text-red-500 dark:text-red-400 mb-4">{t('errors.blogLoadFailed')}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl px-6 py-3"
                  >
                    {t('general.tryAgain')}
                  </Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('blog.noPostsFound')}</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl px-6 py-3"
                  >
                    {t('blog.clearFilters')}
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-8"
                >
                  {filteredPosts.map((post) => {
                    const postTranslations = (post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage] || {};
                    const title = postTranslations.title || post.title;
                    const excerpt = postTranslations.excerpt || post.excerpt;
                    
                    return (
                      <motion.div key={post.id} variants={itemVariants}>
                        <Link to={`/blog/${post.slug}`}>
                          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:-translate-y-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                              <div className="aspect-video md:aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">

                                <Image 
                                  src={post.featured_image} 
                                  alt={title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                  customIcon={
                                    <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                                      <FiArchive className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                                      <div className="text-sm text-indigo-500 dark:text-indigo-400">
                                        {t('blog.photoNotAvailable')}
                                      </div>
                                    </div>
                                  }
                                />
                              </div>
                              <div className="md:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                  {title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                  {excerpt}
                                </p>
                                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  <div className={`flex items-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                                    <FiCalendar className={`${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiUser className={`${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                                    <span>{post.profiles?.name || 'Admin'}</span>
                                  </div>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:h-fit space-y-8">
              {/* Search */}
                <div className="hidden lg:block">
                <Input
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch className="text-gray-400" />}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  custom="py-[12px] pr-[12px] pl-[40px] outline-none"
                />
                </div>

              {/* Categories/Tags */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiTag className={`text-indigo-600 dark:text-indigo-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('blog.tags')}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      selectedTag === null
                        ? 'bg-indigo-600 dark:bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors`}
                    onClick={() => setSelectedTag(null)}
                  >
                    {t('blog.allPosts')}
                  </button>
                  
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        selectedTag === tag
                          ? 'bg-indigo-600 dark:bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } transition-colors`}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('blog.recentPosts')}
                </h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <div key={index} className="flex gap-3 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-5">
                    {posts.slice(0, 3).map((post) => {
                      const postTranslations = (post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage] || {};
                      const title = postTranslations.title || post.title;
                      
                      return (
                        <Link key={post.id} to={`/blog/${post.slug}`}>
                          <div className="flex gap-4 group mb-1">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    
                            <Image 
                              src={post.featured_image} 
                              alt={title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              customIcon={
                                <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                                  <FiUser className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                                </div>
                              }
                            />

                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.published_at || post.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('blog.noPosts')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter subscription */}
      <section className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Color accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 -left-24 w-48 h-48 bg-indigo-100 dark:bg-indigo-950 rounded-full opacity-50 transform -translate-y-1/2"></div>
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-amber-100 dark:bg-amber-950 rounded-full opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('blog.newsletterTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('blog.newsletterDescription')}
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder={t('blog.emailPlaceholder')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 dark:shadow-indigo-600/20 transition-all duration-300"
              >
                {t('blog.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;