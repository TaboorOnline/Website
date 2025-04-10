// src/pages/ProjectDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Calendar, Briefcase, Tag, Link as LinkIcon, ChevronLeft, ChevronRight, 
  ExternalLink
} from 'lucide-react';

import Button from '../components/ui/Button';
import SectionTitle from '../components/common/SectionTitle';
import { getAllProjects, Project } from '../lib/supabase';
import { isRTL } from '../i18n';
import { updatePageStats } from '../lib/supabase';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentLang = isRTL() ? 'ar' : 'en';
  const ArrowIcon = isRTL() ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRTL() ? ArrowRight : ArrowLeft;

  // جلب تفاصيل المشروع والمشاريع ذات الصلة
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // تحديث إحصائيات الصفحة
        await updatePageStats(`project-${id}`);
        
        // جلب جميع المشاريع
        const allProjects = await getAllProjects();
        
        // البحث عن المشروع المطلوب
        const projectId = parseInt(id);
        const foundProject = allProjects.find(p => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
          
          // البحث عن المشاريع ذات الصلة (مشاريع من نفس الفئة أو تستخدم تقنيات مشابهة)
          const related = allProjects
            .filter(p => p.id !== projectId)
            .filter(p => 
              p.category === foundProject.category || 
              p.tech_stack.some(tech => foundProject.tech_stack.includes(tech))
            )
            .slice(0, 3); // الحصول على أول 3 مشاريع ذات صلة
          
          setRelatedProjects(related);
        } else {
          setError(t('projects.notFound'));
          // قد ترغب في التوجيه إلى صفحة 404 هنا
          // navigate('/404', { replace: true });
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [id, t, navigate]);

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(
      currentLang === 'ar' ? 'ar-SA' : 'en-US', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    ).format(date);
  };

  // مكون بطاقة مشروع ذو صلة
  const RelatedProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/projects/${project.id}`} className="block h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full transition-shadow group-hover:shadow-lg">
          <div className="relative overflow-hidden h-48">
            <img 
              src={project.image_url || '/images/project-placeholder.jpg'} 
              alt={currentLang === 'ar' ? project.title_ar : project.title_en}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {currentLang === 'ar' ? project.title_ar : project.title_en}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {currentLang === 'ar' ? project.description_ar : project.description_en}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
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
          </div>
        </div>
      </Link>
    </motion.div>
  );

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="h-72 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error || !project) {
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-primary-600 dark:text-primary-400 mb-4">
              <AlertTriangle size={64} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || t('projects.notFound')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('projects.notFoundDescription')}
            </p>
            <Button
              variant="primary"
              to="/projects"
              leftIcon={<BackArrowIcon size={18} />}
            >
              {t('projects.backToProjects')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* صورة المشروع الرئيسية */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={project.image_url || '/images/project-placeholder.jpg'} 
          alt={currentLang === 'ar' ? project.title_ar : project.title_en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold text-white max-w-3xl"
            >
              {currentLang === 'ar' ? project.title_ar : project.title_en}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* تفاصيل المشروع */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* زر العودة */}
          <div className="mb-8">
            <Button
              variant="ghost"
              to="/projects"
              leftIcon={<BackArrowIcon size={18} />}
            >
              {t('projects.backToProjects')}
            </Button>
          </div>

          {/* معلومات المشروع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Calendar size={20} className="text-primary-600 dark:text-primary-400 mr-2 rtl:ml-2 rtl:mr-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('projects.date')}</h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(project.created_at)}</p>
              </div>
            </div>
            {project.category && (
              <div className="flex items-center">
                <Tag size={20} className="text-primary-600 dark:text-primary-400 mr-2 rtl:ml-2 rtl:mr-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('projects.category')}</h3>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{project.category}</p>
                </div>
              </div>
            )}
            {project.url && (
              <div className="flex items-center">
                <LinkIcon size={20} className="text-primary-600 dark:text-primary-400 mr-2 rtl:ml-2 rtl:mr-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('projects.website')}</h3>
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                  >
                    <span className="truncate">{new URL(project.url).hostname}</span>
                    <ExternalLink size={14} className="ml-1 rtl:mr-1 rtl:ml-0" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* وصف المشروع */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {currentLang === 'ar' ? project.description_ar : project.description_en}
            </p>
          </div>

          {/* التقنيات المستخدمة */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('projects.technologies')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* زر مشاهدة المشروع */}
          {project.url && (
            <div className="mb-16">
              <Button
                variant="primary"
                size="lg"
                href={project.url}
                rightIcon={<ExternalLink size={18} />}
              >
                {t('projects.viewLive')}
              </Button>
            </div>
          )}

          {/* المشاريع ذات الصلة */}
          {relatedProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('projects.relatedProjects')}
                </h2>
                <Button
                  variant="ghost"
                  to="/projects"
                  rightIcon={<ArrowIcon size={16} />}
                >
                  {t('common.seeAll')}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map(project => (
                  <RelatedProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;