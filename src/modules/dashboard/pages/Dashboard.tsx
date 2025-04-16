// src/modules/dashboard/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiBox, 
  FiStar, 
  FiMail, 
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiEye,
  FiClock,
  FiCalendar,
  FiChevronRight,
  FiRefreshCw,
  FiActivity
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import StatsCard from '../components/StatsCard';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { useDashboardStats } from '../services/dashboardService';
import { useRecentReviews } from '../services/reviewService';
import { useRecentMessages } from '../services/messageService';

// Animation variants for staggered animations
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentReviews, isLoading: reviewsLoading } = useRecentReviews(5);
  const { data: recentMessages, isLoading: messagesLoading } = useRecentMessages(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0); // For refreshing animations

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Refresh dashboard data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Here you would typically refetch your data
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <DashboardHeader 
          title={t('dashboard.welcomeMessage')}
          subtitle={
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FiCalendar className="text-indigo-500" />
              <span>{formatDate(currentTime)}</span>
              <FiClock className="text-indigo-500 ml-2" />
              <span>{formatTime(currentTime)}</span>
            </div>
          }
        />

        {/* Refresh button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="py-3 mt-4 md:mt-0 flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          {t('dashboard.refresh')}
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            title={t('dashboard.totalUsers')}
            value={statsLoading ? '--' : stats?.userCount || 0}
            icon={<FiUsers size={20} className="text-blue-500" />}
            trend={!statsLoading && stats?.userTrend ? {
              value: stats.userTrend,
              isPositive: stats.userTrend > 0
            } : undefined}
            isLoading={statsLoading}
            color="blue"
            className="hover:shadow-lg transition-all duration-200 border-t-4 border-blue-500 overflow-hidden"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title={t('dashboard.totalServices')}
            value={statsLoading ? '--' : stats?.serviceCount || 0}
            icon={<FiBox size={20} className="text-purple-500" />}
            isLoading={statsLoading}
            color="purple"
            className="hover:shadow-lg transition-all duration-200 border-t-4 border-purple-500 overflow-hidden"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title={t('dashboard.pendingReviews')}
            value={statsLoading ? '--' : stats?.pendingReviewCount || 0}
            icon={<FiStar size={20} className="text-amber-500" />}
            isLoading={statsLoading}
            color="amber"
            className="hover:shadow-lg transition-all duration-200 border-t-4 border-amber-500 overflow-hidden"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title={t('dashboard.unreadMessages')}
            value={statsLoading ? '--' : stats?.unreadMessageCount || 0}
            icon={<FiMail size={20} className="text-green-500" />}
            trend={!statsLoading && stats?.messageTrend ? {
              value: stats.messageTrend,
              isPositive: stats.messageTrend > 0
            } : undefined}
            isLoading={statsLoading}
            color="green"
            className="hover:shadow-lg transition-all duration-200 border-t-4 border-green-500 overflow-hidden"
          />
        </motion.div>
      </motion.div>

      {/* Chart and Traffic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Website Traffic Chart */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            title={t('dashboard.websiteTraffic')}
            className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
          >
            <div className="relative h-80">
              {statsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-1 max-w-xs m-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FiUsers className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Unique Visitors</p>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">8,249</h3>
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                            <FiArrowUp className="mr-1" /> 12.5%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-1 max-w-xs m-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FiEye className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Page Views</p>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">21,503</h3>
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                            <FiArrowUp className="mr-1" /> 8.2%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-1 max-w-xs m-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <FiActivity className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</p>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">42.3%</h3>
                          <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
                            <FiArrowUp className="mr-1" /> 3.1%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative rounded-lg p-4">
                    {/* Stylized chart placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-full h-32 relative">
                        {/* Simplified chart visualization */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full px-4">
                          {[35, 45, 30, 60, 70, 55, 65, 45, 50, 55, 60, 75].map((height, i) => (
                            <div 
                              key={i} 
                              className="w-1/12 mx-0.5"
                              style={{ height: `${height}%` }}
                            >
                              <div 
                                className={`w-full h-full rounded-t-md bg-gradient-to-t ${i % 2 === 0 
                                  ? 'from-indigo-500/80 to-indigo-400/90' 
                                  : 'from-indigo-600/80 to-indigo-500/90'
                                } relative group transition-all hover:from-indigo-600 hover:to-indigo-500 cursor-pointer`}
                              >
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {height * 120}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[0, 1, 2, 3].map((_, i) => (
                            <div key={i} className="border-b border-gray-200 dark:border-gray-700 w-full h-0"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between w-full mt-2 px-4 text-xs text-gray-500 dark:text-gray-400">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                          <div key={i}>{month}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card title={t('dashboard.trafficSources')} className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {statsLoading ? (
              <div className="space-y-4 p-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mr-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-5 p-4">
                  {[
                    { source: 'Google', value: 42, trend: 'up', color: 'green' },
                    { source: 'Direct', value: 25, trend: 'up', color: 'blue' },
                    { source: 'Social', value: 18, trend: 'down', color: 'red' },
                    { source: 'Referral', value: 10, trend: 'up', color: 'green' },
                    { source: 'Other', value: 5, trend: 'up', color: 'green' },
                  ].map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {item.trend === 'up' ? (
                            <FiTrendingUp className={`text-${item.color}-500 mr-2`} />
                          ) : (
                            <FiArrowDown className={`text-${item.color}-500 mr-2`} />
                          )}
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.source}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800 dark:text-gray-200 mr-2">{item.value}%</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${item.color}-500 rounded-full transition-all duration-500 group-hover:opacity-90`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 pt-0">
                  <Link to="/dashboard/stats" className="group block">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-300"
                    >
                      <span>{t('dashboard.viewAllStats')}</span>
                      <FiChevronRight className="ml-2 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Reviews and Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card
            title={t('dashboard.recentReviews')}
            className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            headerClassName="border-b border-gray-200 dark:border-gray-700"
            footer={
              <Link to="/dashboard/reviews" className="group block">
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-300"
                >
                  <span>{t('dashboard.viewAllReviews')}</span>
                  <FiChevronRight className="ml-2 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Link>
            }
          >
            <div className="p-4 space-y-4">
              {reviewsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentReviews && recentReviews.length > 0 ? (
                <AnimatePresence>
                  {recentReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="flex items-start">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white font-medium shadow-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 transition-all duration-200 ${
                                    i < review.rating
                                      ? 'text-amber-400 fill-current'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.position}, {review.company}
                          </p>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                            "{review.content}"
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.approved
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                            }`}>
                              {review.approved ? t('dashboard.approved') : t('dashboard.pending')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiStar className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm">{t('dashboard.noReviews')}</p>
                  <button className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
                    {t('dashboard.refresh')}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card
            title={t('dashboard.recentMessages')}
            className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            headerClassName="border-b border-gray-200 dark:border-gray-700"
            footer={
              <Link to="/dashboard/inbox" className="group block">
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-300"
                >
                  <span>{t('dashboard.viewAllMessages')}</span>
                  <FiChevronRight className="ml-2 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Link>
            }
          >
            <div className="p-4 space-y-4">
              {messagesLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentMessages && recentMessages.length > 0 ? (
                <AnimatePresence>
                  {recentMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border hover:border-gray-200 dark:hover:border-gray-600 ${
                        !message.read 
                          ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30' 
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm text-white font-medium ${
                          !message.read 
                            ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800'
                        }`}>
                          {message.name ? String(message.name).charAt(0) : '?'}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                              {message.name || t('dashboard.anonymous')}
                              {!message.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {message.email}
                          </p>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                            {message.message}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                              {t('dashboard.readMore')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiMail className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm">{t('dashboard.noMessages')}</p>
                  <button className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
                    {t('dashboard.refresh')}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Page Views */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card
          title={t('dashboard.popularPages')}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
          headerClassName="border-b border-gray-200 dark:border-gray-700"
        >
          {statsLoading ? (
            <div className="animate-pulse p-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.page')}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.visitors')}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.bounceRate')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { page: 'Home Page', visitors: 1245, bounceRate: 32, trend: 'down', path: '/' },
                    { page: 'Services', visitors: 876, bounceRate: 45, trend: 'up', path: '/services' },
                    { page: 'About Us', visitors: 642, bounceRate: 28, trend: 'down', path: '/about' },
                    { page: 'Blog', visitors: 534, bounceRate: 25, trend: 'down', path: '/blog' },
                    { page: 'Contact', visitors: 432, bounceRate: 48, trend: 'up', path: '/contact' },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 mr-3">
                            <FiEye className="text-gray-600 dark:text-gray-400" size={16} />
                          </div>
                          <div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{row.page}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{row.path}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300 font-medium">
                        {row.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            row.trend === 'up' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}>
                            {row.trend === 'up' ? (
                              <FiArrowUp className="mr-1" size={12} />
                            ) : (
                              <FiArrowDown className="mr-1" size={12} />
                            )}
                            {row.bounceRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;