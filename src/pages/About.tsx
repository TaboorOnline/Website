// src/pages/About.tsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Users, Lightbulb, CheckCircle, TrendingUp, Shield, Award } from 'lucide-react';

import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getSectionContent } from '../lib/supabase';
import { isRTL } from '../i18n';

// مكون لعرض قيمة من قيم الشركة
const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <Card.Body className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
            {icon}
          </div>
          <Card.Title className="mb-3">{title}</Card.Title>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// مكون لعرض عضو من فريق العمل
const TeamMember: React.FC<{
  name: string;
  position: string;
  image: string;
  social?: { platform: string; url: string }[];
  index: number;
}> = ({ name, position, image, social, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-300">{position}</p>
          
          {social && social.length > 0 && (
            <div className="flex mt-2 space-x-2 rtl:space-x-reverse">
              {social.map((item, i) => (
                <a 
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  {item.platform === 'twitter' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  )}
                  {item.platform === 'linkedin' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  )}
                  {item.platform === 'github' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// صفحة "من نحن"
const About = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  // جلب المحتوى من قاعدة البيانات
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const aboutContent = await getSectionContent('about');
        setContent(aboutContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
        // استخدام محتوى افتراضي في حالة عدم وجود بيانات
        setContent([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // قيم الشركة
  const companyValues = [
    {
      icon: <Lightbulb size={32} />,
      title: t('about.values.innovation'),
      description: 'نسعى دائماً للابتكار وتطوير حلول إبداعية تلبي احتياجات عملائنا المتغيرة.',
    },
    {
      icon: <CheckCircle size={32} />,
      title: t('about.values.quality'),
      description: 'نلتزم بتقديم أعلى معايير الجودة في جميع منتجاتنا وخدماتنا.',
    },
    {
      icon: <Shield size={32} />,
      title: t('about.values.integrity'),
      description: 'نؤمن بالصدق والشفافية في جميع تعاملاتنا مع عملائنا وشركائنا.',
    },
    {
      icon: <TrendingUp size={32} />,
      title: t('about.values.commitment'),
      description: 'نلتزم بتحقيق أهداف عملائنا والوفاء بوعودنا مهما كانت التحديات.',
    },
    {
      icon: <Users size={32} />,
      title: t('about.values.teamwork'),
      description: 'نعمل كفريق واحد متكامل لتحقيق النجاح وتجاوز توقعات عملائنا.',
    },
  ];

  // فريق العمل (بيانات افتراضية)
  const teamMembers = [
    {
      name: 'أحمد محمد',
      position: 'المدير التنفيذي',
      image: '/images/team/team1.jpg',
      social: [
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
    },
    {
      name: 'سارة أحمد',
      position: 'مدير التكنولوجيا',
      image: '/images/team/team2.jpg',
      social: [
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'github', url: 'https://github.com' },
      ],
    },
    {
      name: 'محمد علي',
      position: 'مطور واجهات أمامية',
      image: '/images/team/team3.jpg',
      social: [
        { platform: 'github', url: 'https://github.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
    },
    {
      name: 'عمر خالد',
      position: 'مطور تطبيقات',
      image: '/images/team/team4.jpg',
      social: [
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'github', url: 'https://github.com' },
      ],
    },
  ];

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
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* قسم القصة */}
      <section ref={storyRef} className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* صورة الشركة */}
            <motion.div
              initial={{ opacity: 0, x: isRTL() ? 50 : -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRTL() ? 50 : -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={isRTL() ? 'lg:order-1' : ''}
            >
              <img
                src="/images/about/company.jpg"
                alt={t('about.story.title')}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </motion.div>

            {/* محتوى القصة */}
            <div>
              <SectionTitle
                title={t('about.story.title')}
                subtitle={t('about.subtitle')}
                alignment="left"
                fadeInView={true}
              />

              {isLoading ? (
                // حالة التحميل
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t('about.story.content')}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('about.vision.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('about.vision.content')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('about.mission.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('about.mission.content')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      variant="primary"
                      to="/contact"
                    >
                      {t('nav.contact')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* قسم القيم */}
      <section ref={valuesRef} className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('about.values.title')}
            subtitle={t('about.subtitle')}
            description="قيمنا هي أساس عملنا ونجاحنا، وهي تعكس التزامنا تجاه عملائنا وفريقنا ومجتمعنا."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {companyValues.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* قسم الفريق */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('about.team.title')}
            subtitle={t('about.subtitle')}
            description={t('about.team.description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                position={member.position}
                image={member.image}
                social={member.social}
                index={index}
              />
            ))}
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
              هل أنت جاهز للعمل معنا؟
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              دعنا نساعدك في تحقيق أهدافك وتطوير أعمالك
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
                to="/services"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                استكشف خدماتنا
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                to="/contact"
                className="border-white text-white hover:bg-white/10"
              >
                {t('nav.contact')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;