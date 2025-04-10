// src/pages/Services.tsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowLeft, Monitor, Smartphone, Database, Code, Server, BrainCircuit, Presentation, MessageSquare } from 'lucide-react';

import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAllServices, Service } from '../lib/supabase';
import { isRTL } from '../i18n';

// مكون خدمة متميزة (عرض كبير)
const FeaturedService: React.FC<{
  service: Service;
  isEven: boolean;
}> = ({ service, isEven }) => {
  const { t } = useTranslation();
  const serviceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(serviceRef, { once: true, amount: 0.3 });
  
  const title = isRTL() ? service.title_ar : service.title_en;
  const description = isRTL() ? service.description_ar : service.description_en;
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;
  
  // اختيار الأيقونة المناسبة
  const getIcon = () => {
    const iconSize = 48;
    if (service.icon) {
      return <div dangerouslySetInnerHTML={{ __html: service.icon }} />;
    }
    
    switch (service.id % 6) {
      case 0:
        return <Monitor size={iconSize} />;
      case 1:
        return <Smartphone size={iconSize} />;
      case 2:
        return <Database size={iconSize} />;
      case 3:
        return <Code size={iconSize} />;
      case 4:
        return <Server size={iconSize} />;
      case 5:
        return <BrainCircuit size={iconSize} />;
      default:
        return <Code size={iconSize} />;
    }
  };

  return (
    <div ref={serviceRef} className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div 
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            isEven ? 'lg:rtl:flex-row-reverse' : ''
          }`}
        >
          {/* صورة الخدمة */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-primary-100 dark:bg-primary-900/30 w-full h-96 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-primary-600 dark:text-primary-400">
                {getIcon()}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-600 dark:bg-primary-800 rounded-full flex items-center justify-center">
              <div className="text-white text-4xl font-bold">
                {service.id}
              </div>
            </div>
          </motion.div>
          
          {/* محتوى الخدمة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" id={`service-${service.id}`}>
              {title}
            </h3>
            <div className="w-16 h-1 bg-primary-600 dark:bg-primary-500 mb-6" />
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {description}
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mt-0.5 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">تصميم وتطوير مخصص وفقاً لاحتياجاتك الفريدة</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mt-0.5 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">فريق من الخبراء المتخصصين في مجالهم</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mt-0.5 mr-3 rtl:ml-3 rtl:mr-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">جودة عالية بتكلفة تنافسية</span>
              </li>
            </ul>
            <Button
              variant="primary"
              to="/contact"
              rightIcon={<ArrowIcon size={16} />}
            >
              {t('services.cta')}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// مكون بطاقة خدمة (للعرض المصغر)
const ServiceCard: React.FC<{
  service: Service;
  index: number;
}> = ({ service, index }) => {
  const { t } = useTranslation();
  const title = isRTL() ? service.title_ar : service.title_en;
  const description = isRTL() ? service.description_ar : service.description_en;
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;
  
  // اختيار الأيقونة المناسبة
  const getIcon = () => {
    const iconSize = 32;
    if (service.icon) {
      return <div dangerouslySetInnerHTML={{ __html: service.icon }} />;
    }
    
    switch (service.id % 6) {
      case 0:
        return <Monitor size={iconSize} />;
      case 1:
        return <Smartphone size={iconSize} />;
      case 2:
        return <Database size={iconSize} />;
      case 3:
        return <Code size={iconSize} />;
      case 4:
        return <Server size={iconSize} />;
      case 5:
        return <BrainCircuit size={iconSize} />;
      default:
        return <Code size={iconSize} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <Card.Body className="p-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
            {getIcon()}
          </div>
          
          <Card.Title className="mb-4">
            {title}
          </Card.Title>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>
          
          <Button
            variant="link"
            href={`#service-${service.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(`service-${service.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center mt-auto"
            rightIcon={<ArrowIcon size={16} />}
          >
            {t('common.readMore')}
          </Button>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// صفحة الخدمات الرئيسية
const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // جلب الخدمات
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // استخدام بيانات افتراضية في حالة الخطأ
        setServices(getDummyServices());
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // تصنيفات الخدمات
  const categories = [
    { id: 'all', name: 'جميع الخدمات' },
    { id: 'web', name: 'تطوير الويب' },
    { id: 'mobile', name: 'تطبيقات الجوال' },
    { id: 'desktop', name: 'برامج سطح المكتب' },
    { id: 'ai', name: 'الذكاء الاصطناعي' },
  ];

  // تصفية الخدمات حسب التصنيف
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category === activeCategory);

  // بيانات افتراضية في حالة عدم وجود بيانات حقيقية
  function getDummyServices(): Service[] {
    return [
      {
        id: 1,
        title_ar: 'تطوير مواقع الويب',
        title_en: 'Web Development',
        description_ar: 'تصميم وتطوير مواقع إلكترونية احترافية وعصرية تتناسب مع جميع الأجهزة والشاشات.',
        description_en: 'Design and develop professional and modern websites that are compatible with all devices and screens.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path></svg>',
        order: 1,
        category: 'web',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title_ar: 'تطوير تطبيقات الجوال',
        title_en: 'Mobile App Development',
        description_ar: 'تطوير تطبيقات الهواتف الذكية المتميزة لأنظمة iOS و Android بأحدث التقنيات.',
        description_en: 'Develop outstanding mobile applications for iOS and Android using the latest technologies.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>',
        order: 2,
        category: 'mobile',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title_ar: 'برامج سطح المكتب',
        title_en: 'Desktop Applications',
        description_ar: 'تطوير برامج سطح المكتب المتخصصة والمتكاملة لتلبية احتياجات الأعمال المختلفة.',
        description_en: 'Develop specialized and integrated desktop software to meet various business needs.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path></svg>',
        order: 3,
        category: 'desktop',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title_ar: 'الأنظمة الإدارية',
        title_en: 'Management Systems',
        description_ar: 'بناء أنظمة إدارية متكاملة تساعد على أتمتة العمليات وتحسين الإنتاجية وزيادة الكفاءة.',
        description_en: 'Building integrated management systems that help automate processes, improve productivity, and increase efficiency.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-6"></path></svg>',
        order: 4,
        category: 'web',
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title_ar: 'حلول الذكاء الاصطناعي',
        title_en: 'AI Solutions',
        description_ar: 'تطوير حلول وتطبيقات ذكية باستخدام تقنيات الذكاء الاصطناعي وتعلم الآلة لتحسين عمليات الأعمال.',
        description_en: 'Developing intelligent solutions and applications using artificial intelligence and machine learning to improve business processes.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        order: 5,
        category: 'ai',
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        title_ar: 'الاستشارات التقنية',
        title_en: 'Technical Consulting',
        description_ar: 'تقديم استشارات فنية متخصصة لمساعدة الشركات في اختيار التقنيات المناسبة وتطوير استراتيجيات التحول الرقمي.',
        description_en: 'Providing specialized technical consultations to help companies choose appropriate technologies and develop digital transformation strategies.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
        order: 6,
        category: 'web',
        created_at: new Date().toISOString()
      }
    ];
  }

  // عرض الخدمات المميزة (العناصر الثلاثة الأولى)
  const featuredServices = services.slice(0, 3);

  return (
    <div className="pt-16">
      {/* قسم العنوان */}
      <section className="bg-primary-900 dark:bg-primary-950 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('services.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* قسم نظرة عامة */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('services.title')}
            subtitle={t('services.subtitle')}
            description={t('services.description')}
          />

          {/* تصفية الخدمات */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* عرض بطاقات الخدمات */}
          {isLoading ? (
            // حالة التحميل
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            // عرض الخدمات
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          ) : (
            // رسالة عدم وجود خدمات
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Presentation size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                لا توجد خدمات في هذه الفئة
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                جرب اختيار فئة أخرى أو العودة إلى جميع الخدمات
              </p>
              <Button
                variant="primary"
                onClick={() => setActiveCategory('all')}
              >
                عرض جميع الخدمات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* قسم الخدمات المميزة */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 mb-12">
          <SectionTitle
            title="خدماتنا المميزة"
            subtitle="استكشف خدماتنا المتميزة"
            description="نقدم مجموعة متنوعة من الخدمات المميزة التي تلبي احتياجات عملائنا بأعلى معايير الجودة"
          />
        </div>

        {isLoading ? (
          // حالة التحميل
          <div className="space-y-16">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="space-y-2 pt-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start">
                          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        </div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 mt-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          // عرض الخدمات المميزة
          <div className="space-y-16">
            {featuredServices.map((service, index) => (
              <FeaturedService
                key={service.id}
                service={service}
                isEven={index % 2 === 1}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* قسم الأسئلة المتكررة */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="الأسئلة المتكررة"
            subtitle="الأسئلة الشائعة"
            description="إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا"
          />

          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {/* سؤال 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ما هي مدة تنفيذ المشروع؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>تختلف مدة تنفيذ المشروع حسب حجمه وتعقيده ومتطلباته. نقوم بتقديم جدول زمني تفصيلي لكل مشروع بعد دراسة متطلباته بدقة. نلتزم دائماً بالمواعيد المتفق عليها ونحرص على تسليم المشاريع في الوقت المحدد مع الحفاظ على أعلى معايير الجودة.</p>
                </div>
              </details>
            </motion.div>

            {/* سؤال 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ما هي تكلفة تطوير موقع إلكتروني أو تطبيق؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>تختلف التكلفة باختلاف متطلبات المشروع ونطاقه وتعقيده. نقوم بتقديم عروض أسعار تفصيلية لكل مشروع بعد فهم متطلباته بدقة. نحرص دائماً على تقديم أسعار تنافسية مع الحفاظ على أعلى معايير الجودة. يمكنك التواصل معنا للحصول على عرض سعر مفصل لمشروعك.</p>
                </div>
              </details>
            </motion.div>

            {/* سؤال 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">هل تقدمون خدمات الدعم الفني بعد تسليم المشروع؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>نعم، نقدم خدمات الدعم الفني والصيانة لجميع مشاريعنا بعد التسليم. نوفر عقود صيانة سنوية تشمل الدعم الفني والتحديثات والإصلاحات وتحسينات الأداء. كما نقدم خدمة الاستضافة وإدارة الخوادم لضمان استمرارية عمل المشروع بكفاءة وأمان.</p>
                </div>
              </details>
            </motion.div>

            {/* سؤال 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ما هي التقنيات التي تستخدمونها في تطوير المشاريع؟</h3>
                  <span className="transform group-open:rotate-180 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>نستخدم أحدث التقنيات والأدوات في تطوير مشاريعنا. بالنسبة لتطوير الويب، نستخدم React.js وNext.js وVue.js وAngular والعديد من إطارات العمل الحديثة. أما بالنسبة لتطبيقات الجوال، فنستخدم React Native وFlutter وSwift وKotlin. نختار التقنية المناسبة لكل مشروع حسب متطلباته واحتياجاته لضمان أفضل أداء وتجربة مستخدم.</p>
                </div>
              </details>
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل (CTA) */}
      <section className="py-16 bg-primary-900 dark:bg-primary-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              هل أنت جاهز لبدء مشروعك؟
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              تواصل معنا الآن لمناقشة مشروعك والحصول على استشارة مجانية
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"
            >
              <Button 
                variant="primary" 
                size="lg" 
                to="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100"
                leftIcon={<MessageSquare size={20} />}
              >
                تواصل معنا
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;