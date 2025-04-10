// src/pages/Projects.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ArrowRight, ArrowLeft, ExternalLink, 
  X, ArrowDown, AlertTriangle
} from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionTitle from '../components/common/SectionTitle';
import { getAllProjects, Project, updatePageStats } from '../lib/supabase';
import { isRTL } from '../i18n';

// مكون بطاقة المشروع
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { t } = useTranslation();
  const currentLang = isRTL() ? 'ar' : 'en';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer h-full"
      onClick={onClick}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative overflow-hidden h-48">
          <img 
            src={project.image_url || '/images/project-placeholder.jpg'} 
            alt={currentLang === 'ar' ? project.title_ar : project.title_en}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          {project.category && (
            <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto bg-primary-600/80 text-white text-xs font-medium px-2.5 py-1 rounded">
              {project.category}
            </div>
          )}
        </div>
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {currentLang === 'ar' ? project.title_ar : project.title_en}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {currentLang === 'ar' ? project.description_ar : project.description_en}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tech_stack.slice(0, 3).map((tech, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="link"
              className="text-primary-600 dark:text-primary-400 p-0 h-auto font-medium text-sm"
            >
              {t('projects.viewProject')}
            </Button>
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// مكون مرشح المشاريع
interface FilterProps {
  categories: string[];
  activeCategory: string;
  onChangeCategory: (category: string) => void;
}

const ProjectFilter: React.FC<FilterProps> = ({ 
  categories, 
  activeCategory, 
  onChangeCategory 
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-3 mb-4 md:hidden">
        <button
          className="flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Filter size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-500 dark:text-gray-400" />
            <span>
              {activeCategory === 'all' 
                ? t('projects.filters.all') 
                : categories.find(c => c === activeCategory) || activeCategory}
            </span>
          </div>
          <ArrowDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden"
            >
              <div className="p-2">
                <button
                  key="all"
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeCategory === 'all'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    onChangeCategory('all');
                    setIsOpen(false);
                  }}
                >
                  {t('projects.filters.all')}
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeCategory === category
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      onChangeCategory(category);
                      setIsOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onChangeCategory('all')}
        >
          {t('projects.filters.all')}
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => onChangeCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// صفحة المشاريع الرئيسية
const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;

  // جلب المشاريع
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // تحديث إحصائيات الصفحة
        await updatePageStats('projects');
        
        setIsLoading(true);
        const data = await getAllProjects();
        setProjects(data);
        
        // استخراج الفئات الفريدة من المشاريع
        const categories = [...new Set(data.map(project => project.category).filter(Boolean))];
        setVisibleCategories(categories as string[]);
        
        // تطبيق الفلترة الأولية
        applyFilters(data, 'all', '');
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(t('projects.error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [t]);

  // تطبيق الفلترة عند تغيير المدخلات
  useEffect(() => {
    applyFilters(projects, activeCategory, searchQuery);
  }, [activeCategory, searchQuery, projects]);

  // وظيفة تطبيق الفلترة
  const applyFilters = (allProjects: Project[], category: string, query: string) => {
    let filtered = [...allProjects];
    
    // فلترة حسب الفئة
    if (category !== 'all') {
      filtered = filtered.filter(project => project.category === category);
    }
    
    // فلترة حسب البحث
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(project => 
        project.title_ar.toLowerCase().includes(lowerQuery) ||
        project.title_en.toLowerCase().includes(lowerQuery) ||
        project.description_ar.toLowerCase().includes(lowerQuery) ||
        project.description_en.toLowerCase().includes(lowerQuery) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredProjects(filtered);
  };

  // التوجه إلى صفحة تفاصيل المشروع
  const handleViewProject = (projectId: number) => {
    window.location.href = `/projects/${projectId}`;
  };

  // مسح البحث
  const clearSearch = () => {
    setSearchQuery('');
  };

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
              {t('projects.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('projects.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* قسم المشاريع */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
            description={t('projects.description')}
          />

          {/* شريط البحث */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rtl:pr-10 rtl:pl-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 rtl:pl-0">
                <Search size={18} className="text-gray-400" />
              </div>
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center pr-3 rtl:pl-3 rtl:pr-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={clearSearch}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* فلترة المشاريع */}
          <ProjectFilter
            categories={visibleCategories}
            activeCategory={activeCategory}
            onChangeCategory={setActiveCategory}
          />

          {/* رسالة خطأ */}
          {error && (
            <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md flex items-center">
              <AlertTriangle size={20} className="mr-3 rtl:ml-3 rtl:mr-0" />
              <span>{error}</span>
            </div>
          )}

          {/* قائمة المشاريع */}
          {isLoading ? (
            // حالة التحميل
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            // عرض المشاريع
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleViewProject(project.id)}
                />
              ))}
            </div>
          ) : (
            // رسالة عدم وجود مشاريع
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                {searchQuery || activeCategory !== 'all' ? (
                  <Search size={32} className="text-gray-400" />
                ) : (
                  <Briefcase size={32} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery || activeCategory !== 'all'
                  ? t('projects.noFilteredProjects')
                  : t('projects.noProjects')
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || activeCategory !== 'all'
                  ? t('projects.tryDifferentFilter')
                  : t('projects.checkBackLater')
                }
              </p>
              {(searchQuery || activeCategory !== 'all') && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  {t('projects.resetFilters')}
                </Button>
              )}
            </div>
          )}
          
          {/* خدمات ذات صلة */}
          <div className="mt-20">
            <SectionTitle
              title={t('projects.relatedServices')}
              subtitle={t('services.title')}
              titleClassName="text-2xl"
            />
            
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                {t('projects.relatedServicesDescription')}
              </p>
              
              <Button
                variant="primary"
                size="lg"
                to="/services"
                rightIcon={<ArrowIcon size={18} />}
              >
                {t('services.title')}
              </Button>
            </div>
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
              {t('projects.ctaTitle')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              {t('projects.ctaDescription')}
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
              >
                {t('projects.ctaButton')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;