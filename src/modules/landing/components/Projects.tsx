// src/modules/landing/components/Projects.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser, FiImage } from 'react-icons/fi';
import { useProjects } from '../services/landingService';
import Button from '../../../shared/components/Button';
import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: projects, isLoading, error } = useProjects();
  const [visibleProjects, setVisibleProjects] = useState(6);
  
  const currentLanguage = i18n.language as 'en' | 'ar';
  const isRTL = currentLanguage === 'ar';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + 6);
  };

  const renderProjects = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="aspect-[5/3] bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-8">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-4"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div>
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
            <div className="h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transform-gpu hover:-translate-y-1">
              {/* Image */}
              <div className="aspect-[5/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image 
                  src={project.image_url} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  customIcon={
                    <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                      <FiImage className="w-14 h-14 text-indigo-300 dark:text-indigo-700 mb-2" />
                      <span className="text-sm text-indigo-500 dark:text-indigo-400">{t('common.imageNotAvailable')}</span>
                    </div>
                  }
                />
                
                {/* Category tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                    {project.category || t('projects.defaultCategory')}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8" dir="auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">{description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex items-center">
                    <FiCalendar className={`${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className={`${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span>{project.client}</span>
                  </div>
                </div>
                
                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                        +{project.tags.length - 3}
                      </span>
                    )}
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
    <section className="py-24 bg-white dark:bg-gray-950" id="projects">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-5">
              {t('projects.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('projects.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {renderProjects()}
        </motion.div>

        {projects && visibleProjects < projects.length && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mt-16 text-center"
          >
            <motion.div variants={itemVariants}>
              <Button 
                onClick={loadMoreProjects}
                className="px-8 py-4 text-white font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/20 inline-flex items-center"
              >
                <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{t('projects.loadMore')}</span>
                <FiArrowRight className={`transition-transform duration-300 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;