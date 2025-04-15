// src/modules/landing/components/Team.tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiMail, FiUser } from 'react-icons/fi';
import { useTeamMembers } from '../services/landingService';
// import { useTheme } from '../../../shared/hooks/useTheme';
import Image from '../../../shared/components/Image';

const Team = () => {
  const { t, i18n } = useTranslation();
  // const { theme } = useTheme();
  const { data: team, isLoading, error } = useTeamMembers();
  
  const currentLanguage = i18n.language as 'en' | 'ar';

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

  const renderTeamMembers = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <motion.div key={index} variants={itemVariants} className="animate-pulse">
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden h-full">
            {/* Image placeholder */}
            <div className="relative aspect-square bg-gray-200 dark:bg-gray-800"></div>
            
            {/* Content */}
            <div className="p-8">
              <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 mb-5"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-4/6 mb-5"></div>
              </div>
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
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
            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden h-full shadow-lg shadow-indigo-500/5 dark:shadow-indigo-950/5 transform-gpu transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-950/10 hover:-translate-y-1"
          >
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden">
              {/* Color overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              
              <Image 
                src={member.image_url} 
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                customIcon={
                  <div className="flex flex-col items-center justify-center h-full bg-indigo-50 dark:bg-indigo-950/30">
                    <FiUser className="w-20 h-20 text-indigo-300 dark:text-indigo-700 mb-2" />
                    <div className="text-sm text-indigo-500 dark:text-indigo-400">
                      {t('team.photoNotAvailable')}
                    </div>
                  </div>
                }
              />
              
              {/* Social links overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center space-x-4">
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                    aria-label="Twitter"
                  >
                    <FiTwitter className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.email && (
                  <a 
                    href={`mailto:${socialLinks.email}`}
                    className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                    aria-label="Email"
                  >
                    <FiMail className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{title}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-0 line-clamp-3 leading-relaxed">{bio}</p>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950" id="team">
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
              {t('team.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('team.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {t('team.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {renderTeamMembers()}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;