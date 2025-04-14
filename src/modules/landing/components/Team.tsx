// src/modules/landing/components/Team.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiMail, FiUser } from 'react-icons/fi';
import { useTeamMembers } from '../services/landingService';
import useIntersectionObserver from '../../../shared/hooks/useIntersectionObserver';
import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Team = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { data: team, isLoading, error } = useTeamMembers();
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

  const renderTeamMembers = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="h-80 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-3"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-5"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6 mb-5"></div>
              </div>
              <div className="flex space-x-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"></div>
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
            {t('errors.teamLoadFailed')}
          </p>
        </div>
      );
    }

    return team?.map((member) => {
      const memberTranslations = (member.translations as Record<string, { name?: string; title?: string; bio?: string }>)?.[currentLanguage] || {};
      const name = memberTranslations.name || member.name;
      const title = memberTranslations.title || member.title;
      const bio = memberTranslations.bio || member.bio;
      const socialLinks = (member.social_links as { linkedin?: string; twitter?: string; email?: string }) || {};
      
      return (
        <motion.div key={member.id} variants={itemVariants}>
          <div 
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden h-full border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <Image 
                src={member.image_url} 
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                customIcon={
                  <div className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                    <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-2" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('team.photoNotAvailable')}
                    </div>
                  </div>
                }
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{name}</h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4 font-medium">{title}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">{bio}</p>
              
              <div className="flex space-x-3">
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label="Twitter"
                  >
                    <FiTwitter className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.email && (
                  <a 
                    href={`mailto:${socialLinks.email}`}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label="Email"
                  >
                    <FiMail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" id="team">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-50/20 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
        
        <div className="absolute -top-40 left-1/3 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl opacity-70 transform -translate-x-1/2"></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl opacity-70 transform translate-x-1/2"></div>
        
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
            {t('team.badge')}
          </motion.span>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('team.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('team.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 right-1/3 w-24 h-24 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl transform translate-x-1/2"></div>
          
          {renderTeamMembers()}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;