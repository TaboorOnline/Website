// src/components/common/SectionTitle.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  withAccent?: boolean;
  accentColor?: string;
  fadeInView?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  description,
  alignment = 'center',
  titleClassName = '',
  subtitleClassName = '',
  descriptionClassName = '',
  containerClassName = '',
  withAccent = true,
  accentColor = 'primary',
  fadeInView = true,
}) => {
  // تحديد قيم التموضع بناءً على المحاذاة
  const alignmentClasses = {
    left: 'text-left rtl:text-right items-start',
    center: 'text-center items-center',
    right: 'text-right rtl:text-left items-end',
  };

  // ألوان الزخرفة
  const accentColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-gray-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  // تأثيرات الحركة
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // تطبيق الأنماط حسب المحاذاة المختارة
  const alignClass = alignmentClasses[alignment];
  const accentClass = accentColors[accentColor as keyof typeof accentColors] || accentColors.primary;

  return (
    <motion.div
      className={`flex flex-col ${alignClass} mb-12 ${containerClassName}`}
      variants={containerVariants}
      initial={fadeInView ? 'hidden' : 'visible'}
      whileInView={fadeInView ? 'visible' : undefined}
      viewport={{ once: true, amount: 0.2 }}
    >
      {subtitle && (
        <motion.div variants={itemVariants} className="mb-2">
          <span className={`text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wider text-sm ${subtitleClassName}`}>
            {subtitle}
          </span>
        </motion.div>
      )}

      <motion.h2
        variants={itemVariants}
        className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${titleClassName}`}
      >
        {title}
      </motion.h2>

      {withAccent && (
        <motion.div
          variants={itemVariants}
          className={`h-1 w-16 ${accentClass} rounded mb-6`}
          style={{
            marginLeft: alignment === 'center' ? 'auto' : (alignment === 'right' ? '0' : undefined),
            marginRight: alignment === 'center' ? 'auto' : (alignment === 'left' ? '0' : undefined),
          }}
        />
      )}

      {description && (
        <motion.p
          variants={itemVariants}
          className={`text-gray-600 dark:text-gray-300 max-w-2xl ${descriptionClassName}`}
          style={{
            marginLeft: alignment === 'center' ? 'auto' : undefined,
            marginRight: alignment === 'center' ? 'auto' : undefined,
          }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;