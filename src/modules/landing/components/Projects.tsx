// src/modules/landing/components/Projects.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser, FiImage } from 'react-icons/fi';
import { useProjects } from '../services/landingService';
import Button from '../../../shared/components/Button';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: projects, isLoading, error } = useProjects();
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  
  const currentLanguage = i18n.language as 'en' | 'ar';

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
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + 6);
  };

  const renderProjects = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6 mb-4"></div>
              </div>
              <div className="flex justify-between pt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-4 px-6 rounded-lg inline-block">
            {t('errors.projectsLoadFailed')}
          </p>
        </div>
      );
    }

    return projects?.slice(0, visibleProjects).map((project) => {
      const projectTranslations = ((project.translations as Record<'en' | 'ar', { title?: string; description?: string }>)?.[currentLanguage]) || {};
      const title = projectTranslations.title || project.title;
      const description = projectTranslations.description || project.description;
      
      return (
        <motion.div key={project.id} variants={itemVariants}>
          <Link to={`/projects/${project.slug || project.id}`} className="block h-full group">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image 
                  src={project.image_url} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  customIcon={
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                      <FiImage className="w-12 h-12 mb-2" />
                      <span className="text-sm">{t('common.imageNotAvailable')}</span>
                    </div>
                  }
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                    {project.category || t('projects.defaultCategory')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 leading-relaxed">{description}</p>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1.5" />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-1.5" />
                    <span>{project.client}</span>
                  </div>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950" id="projects">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-20 left-0 w-full h-1/3 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        
        {/* Decorative grid patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMGMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.span 
            variants={itemVariants} 
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
          >
            {t('projects.badge')}
          </motion.span>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('projects.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl transform -translate-x-1/2"></div>
          
          {renderProjects()}
        </motion.div>

        {projects && visibleProjects < projects.length && (
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <Button 
              onClick={loadMoreProjects}
              className="px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-300 inline-flex items-center"
            >
              <span className="mr-2">{t('projects.loadMore')}</span>
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;