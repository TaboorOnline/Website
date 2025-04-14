// src/modules/landing/pages/Blog.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../services/blogService';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import useDebounce from '../../../shared/hooks/useDebounce';

const Blog = () => {
  const { t, i18n } = useTranslation();
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
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span variants={itemVariants} className="inline-block px-3 py-1 text-sm text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              {t('blog.badge')}
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('blog.pageTitle')}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('blog.pageSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Search for mobile */}
              <div className="lg:hidden mb-8">
                <Input
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch className="text-gray-400" />}
                />
              </div>

              {/* Blog posts */}
              {isLoading ? (
                <div className="space-y-8">
                  {Array(3).fill(0).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{t('errors.blogLoadFailed')}</p>
                  <Button onClick={() => window.location.reload()}>
                    {t('general.tryAgain')}
                  </Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t('blog.noPostsFound')}</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                    }}
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
                          <Card hoverable className="transition-all duration-300 hover:shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="aspect-video md:aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <img 
                                  src={post.featured_image} 
                                  alt={title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                  onError={(e) => {
                                    // Fallback for broken images
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Blog+Post';
                                  }}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                  {title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                  {excerpt}
                                </p>
                                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  <div className="flex items-center mr-4">
                                    <FiCalendar className="mr-1" />
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiUser className="mr-1" />
                                    <span>{post.profiles?.name || 'Admin'}</span>
                                  </div>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {/* Search */}
              <div className="hidden lg:block mb-8">
                <Input
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<FiSearch className="text-gray-400" />}
                />
              </div>

              {/* Categories/Tags */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiTag className="mr-2" />
                  {t('blog.tags')}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedTag === null ? 'primary' : 'outline'}
                    onClick={() => setSelectedTag(null)}
                  >
                    {t('blog.allPosts')}
                  </Button>
                  
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={selectedTag === tag ? 'primary' : 'outline'}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('blog.recentPosts')}
                </h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <div key={index} className="flex gap-3 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => {
                      const postTranslations = (post.translations as Record<'en' | 'ar', { title: string; excerpt?: string; content?: string }>)?.[currentLanguage] || {};
                      const title = postTranslations.title || post.title;
                      
                      return (
                        <Link key={post.id} to={`/blog/${post.slug}`}>
                          <div className="flex gap-3 group">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                              <img 
                                src={post.featured_image} 
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  // Fallback for broken images
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Post';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('blog.newsletterTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('blog.newsletterDescription')}
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                placeholder={t('blog.emailPlaceholder')}
                type="email"
                className="flex-1"
              />
              <Button type="submit">
                {t('blog.subscribe')}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;