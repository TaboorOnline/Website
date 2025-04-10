// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, MessageSquare, Mail, 
  TrendingUp, Activity, Eye, BarChart2
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/ui/Card';
import { 
  getAllServices, 
  getAllProjects, 
  getAllTestimonials, 
  getAllContactMessages,
  getSiteStats
} from '../../lib/supabase';

// مكون بطاقة إحصائية
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeLabel,
  isLoading = false
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
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        </div>
        
        {change !== undefined && (
          <div className="mt-4 flex items-center">
            <span 
              className={`text-sm font-medium ${
                change > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : change < 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
              }`}
            >
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

// مكون لوحة التحكم الرئيسية
const Dashboard = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    testimonials: 0,
    pendingTestimonials: 0,
    messages: 0,
    unreadMessages: 0,
    visitors: 0,
    pageViews: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [services, projects, testimonials, messages, siteStats] = await Promise.all([
          getAllServices(),
          getAllProjects(),
          getAllTestimonials(),
          getAllContactMessages(),
          getSiteStats()
        ]);

        // حساب الإحصائيات
        const pendingTestimonials = testimonials.filter(t => !t.is_approved).length;
        const unreadMessages = messages.filter(m => !m.is_read).length;
        
        // حساب إجمالي الزيارات ومشاهدات الصفحات
        const totalVisitors = siteStats.reduce((acc, stat) => acc + (stat.unique_visitors || 0), 0);
        const totalPageViews = siteStats.reduce((acc, stat) => acc + (stat.visits || 0), 0);

        setStats({
          services: services.length,
          projects: projects.length,
          testimonials: testimonials.length,
          pendingTestimonials,
          messages: messages.length,
          unreadMessages,
          visitors: totalVisitors,
          pageViews: totalPageViews
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // تأثيرات الحركة للبطاقات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
      },
    },
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <motion.h1 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('admin.dashboard.welcome')}
        </motion.h1>
        <motion.p
          className="text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('admin.dashboard.stats.title')}
        </motion.p>
      </div>

      {/* الإحصائيات الرئيسية */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* إحصائية الزوار */}
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('admin.dashboard.stats.visitors')}
            value={stats.visitors}
            icon={<Users size={20} />}
            change={12.5}
            changeLabel={t('admin.stats.period.monthly')}
            isLoading={isLoading}
          />
        </motion.div>

        {/* إحصائية المشاهدات */}
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('admin.dashboard.stats.pageViews')}
            value={stats.pageViews}
            icon={<Eye size={20} />}
            change={8.2}
            changeLabel={t('admin.stats.period.monthly')}
            isLoading={isLoading}
          />
        </motion.div>

        {/* إحصائية المشاريع */}
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('admin.dashboard.stats.projects')}
            value={stats.projects}
            icon={<Briefcase size={20} />}
            isLoading={isLoading}
          />
        </motion.div>

        {/* إحصائية الخدمات */}
        <motion.div variants={itemVariants}>
          <StatCard
            title={t('admin.dashboard.stats.services')}
            value={stats.services}
            icon={<Activity size={20} />}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      {/* الصف الثاني من الإحصائيات */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* إحصائية آراء العملاء */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <Card.Header className="bg-gray-50 dark:bg-gray-800/50 border-b-0">
              <Card.Title>{t('admin.dashboard.stats.testimonials')}</Card.Title>
            </Card.Header>
            <Card.Body className="pb-2">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="text-green-600 dark:text-green-400 mr-2" size={18} />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {t('admin.testimonials.approved')}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.testimonials - stats.pendingTestimonials}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="text-yellow-600 dark:text-yellow-400 mr-2" size={18} />
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {t('admin.testimonials.pending')}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.pendingTestimonials}
                    </p>
                  </div>
                </div>
              )}
            </Card.Body>
            <div className="p-4">
              <a
                href="/admin/testimonials"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {t('common.seeAll')}
              </a>
            </div>
          </Card>
        </motion.div>

        {/* إحصائية الرسائل */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <Card.Header className="bg-gray-50 dark:bg-gray-800/50 border-b-0">
              <Card.Title>{t('admin.dashboard.stats.messages')}</Card.Title>
            </Card.Header>
            <Card.Body className="pb-2">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="text-gray-600 dark:text-gray-400 mr-2" size={18} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t('admin.messages.read')}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.messages - stats.unreadMessages}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="text-blue-600 dark:text-blue-400 mr-2" size={18} />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {t('admin.messages.unread')}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.unreadMessages}
                    </p>
                  </div>
                </div>
              )}
            </Card.Body>
            <div className="p-4">
              <a
                href="/admin/messages"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {t('common.seeAll')}
              </a>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* إحصائيات النشاط */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <Card.Title>{t('admin.stats.pages.title')}</Card.Title>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('admin.stats.period.monthly')}
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    <div className="font-medium">{t('admin.stats.pages.page')}</div>
                    <div className="font-medium">{t('admin.stats.pages.views')}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      <span>{t('nav.home')}</span>
                    </div>
                    <div>1,245</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      <span>{t('nav.services')}</span>
                    </div>
                    <div>856</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      <span>{t('nav.projects')}</span>
                    </div>
                    <div>732</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      <span>{t('nav.contact')}</span>
                    </div>
                    <div>621</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      <span>{t('nav.about')}</span>
                    </div>
                    <div>543</div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;