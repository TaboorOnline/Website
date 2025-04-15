// src/modules/dashboard/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  FiCalendar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import StatsCard from '../components/StatsCard';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { useDashboardStats } from '../services/dashboardService';
import { useRecentReviews } from '../services/reviewService';
import { useRecentMessages } from '../services/messageService';

const Dashboard = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentReviews, isLoading: reviewsLoading } = useRecentReviews(5);
  const { data: recentMessages, isLoading: messagesLoading } = useRecentMessages(5);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title={t('dashboard.welcomeMessage')}
        subtitle={
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FiCalendar className="text-primary-500" />
            <span>{formatDate(currentTime)}</span>
            <FiClock className="text-primary-500 ml-2" />
            <span>{formatTime(currentTime)}</span>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title={t('dashboard.totalUsers')}
          value={statsLoading ? '--' : stats?.userCount || 0}
          icon={<FiUsers size={20} className="text-primary-500" />}
          trend={!statsLoading && stats?.userTrend ? {
            value: stats.userTrend,
            isPositive: stats.userTrend > 0
          } : undefined}
          isLoading={statsLoading}
          color="primary"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        
        <StatsCard
          title={t('dashboard.totalServices')}
          value={statsLoading ? '--' : stats?.serviceCount || 0}
          icon={<FiBox size={20} className="text-secondary-500" />}
          isLoading={statsLoading}
          color="secondary"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        
        <StatsCard
          title={t('dashboard.pendingReviews')}
          value={statsLoading ? '--' : stats?.pendingReviewCount || 0}
          icon={<FiStar size={20} className="text-warning-500" />}
          isLoading={statsLoading}
          color="warning"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        
        <StatsCard
          title={t('dashboard.unreadMessages')}
          value={statsLoading ? '--' : stats?.unreadMessageCount || 0}
          icon={<FiMail size={20} className="text-info-500" />}
          trend={!statsLoading && stats?.messageTrend ? {
            value: stats.messageTrend,
            isPositive: stats.messageTrend > 0
          } : undefined}
          isLoading={statsLoading}
          color="info"
          className="hover:shadow-lg transition-shadow duration-200"
        />
      </div>

      {/* Chart and Traffic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Website Traffic Chart */}
        <div className="lg:col-span-2">
          <Card
            title={t('dashboard.websiteTraffic')}
            className="h-full"
            headerAction={
              <Button variant="ghost" size="sm">
                {t('dashboard.last30Days')}
              </Button>
            }
          >
            <div className="relative h-80">
              {statsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">12,345</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total visits</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FiArrowUp className="mr-1" /> 12.5%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                      {t('dashboard.trafficChartPlaceholder')}
                      <br />
                      <span className="text-sm">(Chart visualization would appear here)</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card
          title={t('dashboard.trafficSources')}
          className="h-full"
          headerAction={
            <Button variant="ghost" size="sm">
              {t('dashboard.viewDetails')}
            </Button>
          }
        >
          {statsLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mr-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {[
                  { source: 'Google', value: 42, trend: 'up', color: 'green' },
                  { source: 'Direct', value: 25, trend: 'up', color: 'green' },
                  { source: 'Social', value: 18, trend: 'down', color: 'red' },
                  { source: 'Referral', value: 10, trend: 'up', color: 'green' },
                  { source: 'Other', value: 5, trend: 'up', color: 'green' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.trend === 'up' ? (
                        <FiTrendingUp className={`text-${item.color}-500 mr-2`} />
                      ) : (
                        <FiArrowDown className={`text-${item.color}-500 mr-2`} />
                      )}
                      <span className="text-gray-700 dark:text-gray-300">{item.source}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">{item.value}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-${item.color}-500 h-2 rounded-full`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/dashboard/stats">
                  <Button variant="outline" fullWidth>
                    {t('dashboard.viewAllStats')}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Recent Reviews and Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Reviews */}
        <Card
          title={t('dashboard.recentReviews')}
          headerAction={
            <Button variant="ghost" size="sm">
              {t('dashboard.newestFirst')}
            </Button>
          }
          footer={
            <Link to="/dashboard/reviews">
              <Button variant="outline" fullWidth>
                {t('dashboard.viewAllReviews')}
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
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
              recentReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{review.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.position}, {review.company}
                      </p>
                      <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                        {review.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          review.approved
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}>
                          {review.approved ? t('dashboard.approved') : t('dashboard.pending')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <FiStar className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>{t('dashboard.noReviews')}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card
          title={t('dashboard.recentMessages')}
          headerAction={
            <Button variant="ghost" size="sm">
              {t('dashboard.unreadFirst')}
            </Button>
          }
          footer={
            <Link to="/dashboard/inbox">
              <Button variant="outline" fullWidth>
                {t('dashboard.viewAllMessages')}
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
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
              recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 ${
                    !message.read ? 'bg-primary-50 dark:bg-primary-900/10 -mx-4 px-4 py-3 rounded-lg' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
                      {message.name ? String(message.name).charAt(0) : '?'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {message.name || t('dashboard.anonymous')}
                          {!message.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {message.email}
                      </p>
                      <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <FiMail className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>{t('dashboard.noMessages')}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Page Views */}
      <Card
        title={t('dashboard.popularPages')}
        headerAction={
          <Button variant="ghost" size="sm">
            {t('dashboard.byVisitors')}
          </Button>
        }
      >
        {statsLoading ? (
          <div className="animate-pulse">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                  { page: 'Home Page', visitors: 1245, bounceRate: 32, trend: 'down' },
                  { page: 'Services', visitors: 876, bounceRate: 45, trend: 'up' },
                  { page: 'About Us', visitors: 642, bounceRate: 28, trend: 'down' },
                  { page: 'Blog', visitors: 534, bounceRate: 25, trend: 'down' },
                  { page: 'Contact', visitors: 432, bounceRate: 48, trend: 'up' },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{row.page}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      {row.visitors.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end">
                        {row.trend === 'up' ? (
                          <FiArrowUp className="text-red-500 mr-1" />
                        ) : (
                          <FiArrowDown className="text-green-500 mr-1" />
                        )}
                        <span className={row.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
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
    </div>
  );
};

export default Dashboard;