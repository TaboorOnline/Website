// src/pages/admin/Stats.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Users, Eye, TrendingUp, TrendingDown, Activity, Clock, 
  BarChart2, LineChart, PieChart, ArrowRight, ArrowLeft, Calendar, 
  ChevronDown, AlertTriangle, RefreshCw
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getSiteStats, SiteStats } from '../../lib/supabase';
import { isRTL } from '../../i18n';

// نوع بيانات الإحصائيات المعروضة
interface StatsData {
  pages: {
    name: string;
    views: number;
    visitors: number;
  }[];
  totalViews: number;
  totalVisitors: number;
  periodViews: number[];
  periodVisitors: number[];
  bounceRate: number;
  avgSessionDuration: number;
}

// مكون بطاقة إحصائية
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  isLoading?: boolean;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  isLoading = false,
  iconBgColor = 'bg-primary-100 dark:bg-primary-900/30',
  iconColor = 'text-primary-600 dark:text-primary-400'
}) => {
  return (
    <Card className="h-full">
      <Card.Body className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {title}
            </h3>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
            {icon}
          </div>
        </div>
        
        {change !== undefined && (
          <div className="mt-4 flex items-center">
            <span 
              className={`text-sm font-medium flex items-center ${
                change > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : change < 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {change > 0 ? <TrendingUp size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> : 
               change < 0 ? <TrendingDown size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> : null}
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ms-1.5">
              {changeLabel}
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// مكون مخطط أعمدة بسيط
interface BarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  isLoading?: boolean;
  height?: number;
  color?: string;
}

const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  isLoading = false,
  height = 240,
  color = 'bg-primary-500 dark:bg-primary-600'
}) => {
  // إيجاد أعلى قيمة لتحديد نسبة الارتفاع للمخططات
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="h-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          {title}
        </h3>
      )}
      
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="flex items-end h-full gap-2">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center"
                style={{ height: `${height}px` }}
              >
                <div className="relative flex-1 w-full flex items-end">
                  <div 
                    className={`w-full rounded-t ${color}`} 
                    style={{ height: `${percentage}%` }} 
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 w-full text-center truncate">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// الصفحة الرئيسية للإحصائيات
const AdminStats = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;
  
  // جلب بيانات الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        const siteStats = await getSiteStats();
        
        // تحويل البيانات إلى الشكل المطلوب للعرض
        // في التطبيق الفعلي، ستقوم بتحليل البيانات المستلمة من Supabase
        const processedData: StatsData = {
          pages: siteStats.map(stat => ({
            name: mapPageName(stat.page),
            views: stat.visits,
            visitors: stat.unique_visitors || 0
          })),
          totalViews: siteStats.reduce((total, stat) => total + stat.visits, 0),
          totalVisitors: siteStats.reduce((total, stat) => total + (stat.unique_visitors || 0), 0),
          // إنشاء بيانات نموذجية للرسوم البيانية
          periodViews: generateFakeChartData(period, 'views'),
          periodVisitors: generateFakeChartData(period, 'visitors'),
          bounceRate: 45.8, // نسبة مثالية
          avgSessionDuration: 2.7 // دقائق
        };
        
        setStatsData(processedData);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setErrorMessage(t('admin.stats.error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [period, t]);

  // وظيفة لتوليد بيانات نموذجية للرسوم البيانية
  const generateFakeChartData = (period: string, type: 'views' | 'visitors') => {
    const multiplier = type === 'views' ? 1 : 0.7;
    
    // توليد عدد مختلف من النقاط بناءً على الفترة المختارة
    let pointsCount = 7; // أسبوعي افتراضياً
    
    if (period === 'daily') {
      pointsCount = 24; // ساعات اليوم
    } else if (period === 'monthly') {
      pointsCount = 30; // أيام الشهر
    } else if (period === 'yearly') {
      pointsCount = 12; // أشهر السنة
    }
    
    // توليد قيم عشوائية مع اتجاه تصاعدي
    return Array.from({ length: pointsCount }, (_, i) => {
      // قاعدة متزايدة بشكل عام
      const base = 50 + i * 3;
      // تباين عشوائي
      const variance = Math.floor(Math.random() * 30) - 15;
      
      return Math.floor((base + variance) * multiplier);
    });
  };

  // تحويل اسم الصفحة من المسار إلى اسم مقروء
  const mapPageName = (page: string) => {
    // إزالة البادئة "page-" إن وجدت
    const cleaned = page.replace(/^page-/, '');
    
    // تحويل مسارات محددة إلى أسماء مقروءة
    switch (cleaned) {
      case 'home':
        return t('nav.home');
      case 'about':
        return t('nav.about');
      case 'services':
        return t('nav.services');
      case 'projects':
        return t('nav.projects');
      case 'testimonials':
        return t('nav.testimonials');
      case 'contact':
        return t('nav.contact');
      default:
        // إذا كان مسار مشروع
        if (cleaned.startsWith('project-')) {
          return t('projects.title') + ' #' + cleaned.replace('project-', '');
        }
        // تحويل الشرطات إلى مسافات وجعل الحرف الأول من كل كلمة كبيراً
        return cleaned
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  // إعداد بيانات مخطط أكثر الصفحات زيارة
  const topPagesData = statsData?.pages
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(page => ({ name: page.name, value: page.views })) || [];

  // إعداد بيانات مخطط الزيارات حسب الفترة
  const periodLabels = getPeriodLabels(period);
  
  // الحصول على تسميات الفترة للرسم البياني
  function getPeriodLabels(period: string) {
    switch (period) {
      case 'daily':
        return Array.from({ length: 24 }, (_, i) => `${i}:00`);
      case 'weekly':
        return [t('days.sun'), t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat')];
      case 'monthly':
        return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      case 'yearly':
        return [
          t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
          t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
          t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
        ];
      default:
        return [];
    }
  }

  // تهيئة مخطط الزيارات اليومية
  const visitsChartData = periodLabels.map((label, index) => ({
    name: label,
    value: statsData?.periodViews[index] || 0
  }));

  // تهيئة مخطط الزوار اليومية
  const visitorsChartData = periodLabels.map((label, index) => ({
    name: label,
    value: statsData?.periodVisitors[index] || 0
  }));

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.stats.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.stats.description')}
          </p>
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            rightIcon={<ChevronDown size={16} />}
            className="w-full sm:w-auto"
          >
            <span className="mr-1">{t('admin.stats.period.' + period)}</span>
          </Button>
          <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-focus:block">
            <div className="py-1">
              <button 
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPeriod('daily')}
              >
                {t('admin.stats.period.daily')}
              </button>
              <button 
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPeriod('weekly')}
              >
                {t('admin.stats.period.weekly')}
              </button>
              <button 
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPeriod('monthly')}
              >
                {t('admin.stats.period.monthly')}
              </button>
              <button 
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPeriod('yearly')}
              >
                {t('admin.stats.period.yearly')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* رسالة خطأ */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md flex items-center">
          <AlertTriangle size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
          <div className="flex-1">{errorMessage}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('common.retry')}
          </Button>
        </div>
      )}

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* إجمالي الزيارات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            title={t('admin.stats.metrics.pageViews')}
            value={isLoading ? '...' : statsData?.totalViews?.toLocaleString() || '0'}
            icon={<Eye size={20} />}
            change={8.2}
            changeLabel={t('admin.stats.vsLastPeriod')}
            isLoading={isLoading}
          />
        </motion.div>
        
        {/* إجمالي الزوار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            title={t('admin.stats.metrics.visitors')}
            value={isLoading ? '...' : statsData?.totalVisitors?.toLocaleString() || '0'}
            icon={<Users size={20} />}
            change={12.5}
            changeLabel={t('admin.stats.vsLastPeriod')}
            isLoading={isLoading}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
        </motion.div>
        
        {/* معدل الارتداد */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatCard
            title={t('admin.stats.metrics.bounceRate')}
            value={isLoading ? '...' : `${statsData?.bounceRate}%`}
            icon={<TrendingDown size={20} />}
            change={-2.4}
            changeLabel={t('admin.stats.vsLastPeriod')}
            isLoading={isLoading}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />
        </motion.div>
        
        {/* متوسط مدة الجلسة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatCard
            title={t('admin.stats.metrics.avgSessionDuration')}
            value={isLoading ? '...' : `${statsData?.avgSessionDuration} ${t('units.minutes')}`}
            icon={<Clock size={20} />}
            change={3.6}
            changeLabel={t('admin.stats.vsLastPeriod')}
            isLoading={isLoading}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />
        </motion.div>
      </div>

      {/* مخططات الإحصائيات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* مخطط الزيارات */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <Card.Title>{t('admin.stats.charts.pageViews')}</Card.Title>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('admin.stats.period.' + period)}
              </span>
            </Card.Header>
            <Card.Body className="p-4">
              <SimpleBarChart
                data={visitsChartData}
                isLoading={isLoading}
                height={240}
              />
            </Card.Body>
          </Card>
        </motion.div>
        
        {/* مخطط أكثر الصفحات زيارة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <Card.Header className="bg-gray-50 dark:bg-gray-800/50">
              <Card.Title>{t('admin.stats.pages.title')}</Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : topPagesData.length > 0 ? (
                <div className="space-y-4">
                  {topPagesData.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-medium mr-3 rtl:ml-3 rtl:mr-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{page.name}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {page.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('common.emptyState')}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* مخطط الزوار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="mb-8">
          <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <Card.Title>{t('admin.stats.charts.visitors')}</Card.Title>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.stats.period.' + period)}
            </span>
          </Card.Header>
          <Card.Body className="p-4">
            <SimpleBarChart
              data={visitorsChartData}
              isLoading={isLoading}
              height={240}
              color="bg-blue-500 dark:bg-blue-600"
            />
          </Card.Body>
        </Card>
      </motion.div>

      {/* مستقبل المشروع */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <Card.Header className="bg-gray-50 dark:bg-gray-800/50">
            <Card.Title>{t('admin.stats.future')}</Card.Title>
          </Card.Header>
          <Card.Body className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('admin.stats.futureDescription')}
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Button
                variant="primary"
                rightIcon={<ArrowIcon size={16} />}
              >
                {t('admin.stats.exploreAnalytics')}
              </Button>
              <Button
                variant="outline"
              >
                {t('admin.stats.setupIntegrations')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminStats;