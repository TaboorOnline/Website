// src/modules/dashboard/pages/Dashboard.tsx
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
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
  FiEye
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
    <div>
      <DashboardHeader 
        title={t('dashboard.welcomeMessage')}
        subtitle={`${formatDate(currentTime)} · ${formatTime(currentTime)}`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t('dashboard.totalUsers')}
          value={statsLoading ? '--' : stats?.userCount || 0}
          icon={<FiUsers size={24} />}
          trend={!statsLoading && stats?.userTrend ? {
            value: stats.userTrend,
            isPositive: stats.userTrend > 0
          } : undefined}
          isLoading={statsLoading}
          color="primary"
        />
        
        <StatsCard
          title={t('dashboard.totalServices')}
          value={statsLoading ? '--' : stats?.serviceCount || 0}
          icon={<FiBox size={24} />}
          isLoading={statsLoading}
          color="secondary"
        />
        
        <StatsCard
          title={t('dashboard.pendingReviews')}
          value={statsLoading ? '--' : stats?.pendingReviewCount || 0}
          icon={<FiStar size={24} />}
          isLoading={statsLoading}
          color="warning"
        />
        
        <StatsCard
          title={t('dashboard.unreadMessages')}
          value={statsLoading ? '--' : stats?.unreadMessageCount || 0}
          icon={<FiMail size={24} />}
          trend={!statsLoading && stats?.messageTrend ? {
            value: stats.messageTrend,
            isPositive: stats.messageTrend > 0
          } : undefined}
          isLoading={statsLoading}
          color="info"
        />
      </div>

      {/* Chart and Traffic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Website Traffic Chart */}
        <div className="lg:col-span-2">
          <Card
            title={t('dashboard.websiteTraffic')}
            className="h-full"
          >
            <div className="relative h-80">
              {statsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('dashboard.trafficChartPlaceholder')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card
          title={t('dashboard.trafficSources')}
          className="h-full"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTrendingUp className="text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Google</span>
                  </div>
                  <span className="font-semibold">42%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiArrowUp className="text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Direct</span>
                  </div>
                  <span className="font-semibold">25%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiArrowDown className="text-red-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Social</span>
                  </div>
                  <span className="font-semibold">18%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTrendingUp className="text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Referral</span>
                  </div>
                  <span className="font-semibold">10%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiArrowUp className="text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Other</span>
                  </div>
                  <span className="font-semibold">5%</span>
                </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reviews */}
        <Card
          title={t('dashboard.recentReviews')}
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
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
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
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full ${
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
                {t('dashboard.noReviews')}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card
          title={t('dashboard.recentMessages')}
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
              recentMessages.map((message: { id: Key | null | undefined; read: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; created_at: string | number | Date; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined; }, index: number) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 ${
                    !message.read ? 'bg-primary-50 dark:bg-primary-900/10 -mx-6 px-6' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {message.name ? String(message.name).charAt(0) : ''}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {message.name}
                          {!message.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
                {t('dashboard.noMessages')}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Page Views */}
      <div className="mt-8">
        <Card
          title={t('dashboard.popularPages')}
        >
          {statsLoading ? (
            <div className="animate-pulse">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
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
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">Home Page</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      1,245
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 dark:text-green-400">32%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">Services</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      876
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-red-600 dark:text-red-400">45%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">About Us</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      642
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 dark:text-green-400">28%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">Blog</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      534
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 dark:text-green-400">25%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">Contact</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                      432
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-red-600 dark:text-red-400">48%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;