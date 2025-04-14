// src/modules/dashboard/pages/Stats.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiEye, FiClock, FiActivity, FiRefreshCw, FiGlobe, FiChevronDown } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import StatsCard from '../components/StatsCard';
import Select from '../../../shared/components/Select';
import { useSiteStatistics } from '../services/statsService';

// Date range type
type DateRange = '7days' | '30days' | '90days' | 'year' | 'all';

const Stats = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  
  // Fetch statistics
  const { data: stats, isLoading, error, refetch } = useSiteStatistics(dateRange);
  
  // Date range options
  const dateRangeOptions = [
    { value: '7days', label: t('stats.last7Days') },
    { value: '30days', label: t('stats.last30Days') },
    { value: '90days', label: t('stats.last90Days') },
    { value: 'year', label: t('stats.lastYear') },
    { value: 'all', label: t('stats.allTime') },
  ];

  return (
    <div>
      <DashboardHeader
        title={t('stats.websiteStatistics')}
        subtitle={t('stats.websiteStatisticsDescription')}
        actions={
          <div className="flex items-center space-x-2">
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              icon={<FiChevronDown />}
            />
            <Button
              onClick={() => refetch()}
              icon={<FiRefreshCw className="mr-2" />}
              variant="outline"
            >
              {t('stats.refresh')}
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadStats')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button onClick={() => refetch()}>
            {t('common.refresh')}
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={t('stats.pageViews')}
              value={isLoading ? '--' : stats?.totalPageViews.toLocaleString() || '0'}
              icon={<FiEye size={24} />}
              trend={!isLoading && stats?.pageViewsTrend ? {
                value: stats.pageViewsTrend,
                isPositive: stats.pageViewsTrend > 0
              } : undefined}
              isLoading={isLoading}
              color="primary"
            />
            
            <StatsCard
              title={t('stats.uniqueVisitors')}
              value={isLoading ? '--' : stats?.totalUniqueVisitors.toLocaleString() || '0'}
              icon={<FiUsers size={24} />}
              trend={!isLoading && stats?.visitorsTrend ? {
                value: stats.visitorsTrend,
                isPositive: stats.visitorsTrend > 0
              } : undefined}
              isLoading={isLoading}
              color="secondary"
            />
            
            <StatsCard
              title={t('stats.bounceRate')}
              value={isLoading ? '--' : `${stats?.avgBounceRate.toFixed(1)}%` || '0%'}
              icon={<FiActivity size={24} />}
              trend={!isLoading && stats?.bounceRateTrend ? {
                value: stats.bounceRateTrend,
                isPositive: stats.bounceRateTrend < 0 // Lower bounce rate is positive
              } : undefined}
              isLoading={isLoading}
              color={!isLoading && stats?.avgBounceRate < 50 ? 'success' : 'warning'}
            />
            
            <StatsCard
              title={t('stats.avgSessionDuration')}
              value={isLoading ? '--' : formatTime(stats?.avgSessionDuration || 0)}
              icon={<FiClock size={24} />}
              trend={!isLoading && stats?.sessionDurationTrend ? {
                value: stats.sessionDurationTrend,
                isPositive: stats.sessionDurationTrend > 0
              } : undefined}
              isLoading={isLoading}
              color="info"
            />
          </div>

          {/* Traffic Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Traffic Chart */}
            <Card
              title={t('stats.trafficOverTime')}
              className="lg:col-span-2 h-96"
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('stats.trafficChartPlaceholder')}
                  </p>
                </div>
              )}
            </Card>

            {/* Traffic Sources */}
            <Card
              title={t('stats.trafficSources')}
              className="h-96"
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : stats?.referrers ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    {stats.referrers.map((referrer, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <FiGlobe className="mr-2 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{referrer.source}</span>
                          </div>
                          <span className="font-semibold">{referrer.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${referrer.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('stats.noDataAvailable')}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Top Pages */}
          <Card
            title={t('stats.topPages')}
          >
            {isLoading ? (
              <div className="animate-pulse">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : stats?.topPages ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3">{t('stats.page')}</th>
                      <th className="px-6 py-3">{t('stats.views')}</th>
                      <th className="px-6 py-3">{t('stats.uniqueViews')}</th>
                      <th className="px-6 py-3">{t('stats.avgTimeOnPage')}</th>
                      <th className="px-6 py-3">{t('stats.bounceRate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.topPages.map((page, index) => (
                      <tr key={index} className="text-gray-700 dark:text-gray-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiEye className="text-gray-400 mr-2" />
                            <span>{page.path}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {page.pageViews.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {page.uniqueViews.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatTime(page.avgTimeOnPage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={page.bounceRate > 50 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'}>
                            {page.bounceRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('stats.noDataAvailable')}
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

// Helper function to format time in seconds to mm:ss or hh:mm:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default Stats;