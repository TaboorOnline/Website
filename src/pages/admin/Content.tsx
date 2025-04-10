// src/pages/admin/Content.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Save, X, Edit, FileText, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getSectionContent, updateContent, ContentItem } from '../../lib/supabase';
import { isRTL } from '../../i18n';

// مكون نموذج تحرير المحتوى
interface ContentEditorProps {
  content: ContentItem;
  onSave: (id: number, updates: Partial<ContentItem>) => Promise<void>;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title_ar: content.title_ar,
    title_en: content.title_en,
    content_ar: content.content_ar,
    content_en: content.content_en
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تحديث البيانات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // حفظ التغييرات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(content.id, formData);
    } catch (err) {
      console.error('Error updating content:', err);
      setError(t('admin.content.actions.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md flex items-center">
          <AlertTriangle size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* العنوان العربي */}
        <div>
          <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.content.fields.titleAr')}
          </label>
          <input
            type="text"
            id="title_ar"
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            dir="rtl"
          />
        </div>

        {/* العنوان الإنجليزي */}
        <div>
          <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.content.fields.titleEn')}
          </label>
          <input
            type="text"
            id="title_en"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            dir="ltr"
          />
        </div>

        {/* المحتوى العربي */}
        <div>
          <label htmlFor="content_ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.content.fields.contentAr')}
          </label>
          <textarea
            id="content_ar"
            name="content_ar"
            value={formData.content_ar}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            dir="rtl"
          ></textarea>
        </div>

        {/* المحتوى الإنجليزي */}
        <div>
          <label htmlFor="content_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.content.fields.contentEn')}
          </label>
          <textarea
            id="content_en"
            name="content_en"
            value={formData.content_en}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            dir="ltr"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          leftIcon={<X size={18} />}
        >
          {t('admin.content.actions.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Save size={18} />}
        >
          {t('admin.content.actions.save')}
        </Button>
      </div>
    </form>
  );
};

// مكون عرض المحتوى
interface ContentItemProps {
  content: ContentItem;
  onEdit: (content: ContentItem) => void;
}

const ContentDisplay: React.FC<ContentItemProps> = ({ content, onEdit }) => {
  const { t } = useTranslation();
  const currentLang = isRTL() ? 'ar' : 'en';

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {currentLang === 'ar' ? content.title_ar : content.title_en}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {t('admin.content.fields.key')}: {content.key}
          </p>
          <div className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none">
            <p>{currentLang === 'ar' ? content.content_ar : content.content_en}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(content)}
          leftIcon={<Edit size={16} />}
          className="flex-shrink-0"
        >
          {t('admin.content.actions.edit')}
        </Button>
      </div>
    </div>
  );
};

// مكون قسم المحتوى
interface ContentSectionProps {
  title: string;
  contents: ContentItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onEditContent: (content: ContentItem) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  contents, 
  isExpanded, 
  onToggle, 
  onEditContent 
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <button
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <FileText size={20} className="mr-2 rtl:ml-2 rtl:mr-0 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <span className="ml-3 rtl:mr-3 rtl:ml-0 text-sm text-gray-500 dark:text-gray-400">
            ({contents.length} {t('admin.content.items')})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          {contents.length > 0 ? (
            <div className="space-y-4">
              {contents.map(content => (
                <ContentDisplay
                  key={content.id}
                  content={content}
                  onEdit={onEditContent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('common.emptyState')}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// الصفحة الرئيسية لإدارة المحتوى
const ContentManagement = () => {
  const { t } = useTranslation();
  const [contents, setContents] = useState<Record<string, ContentItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentlyEditing, setCurrentlyEditing] = useState<ContentItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // تحميل المحتوى
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        // جلب المحتوى لكل قسم
        const sections = ['home', 'about', 'services', 'contact'];
        const allContents: Record<string, ContentItem[]> = {};
        
        for (const section of sections) {
          const sectionContent = await getSectionContent(section);
          allContents[section] = sectionContent;
          
          // تعيين القسم كموسع افتراضياً
          setExpandedSections(prev => ({
            ...prev,
            [section]: section === 'home', // فتح قسم الصفحة الرئيسية افتراضياً
          }));
        }
        
        setContents(allContents);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  // تبديل حالة قسم (موسع/مطوي)
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // فتح نموذج التحرير
  const handleEditContent = (content: ContentItem) => {
    setCurrentlyEditing(content);
  };

  // إلغاء التحرير
  const handleCancelEdit = () => {
    setCurrentlyEditing(null);
  };

  // حفظ التغييرات
  const handleSaveContent = async (id: number, updates: Partial<ContentItem>) => {
    try {
      const updatedContent = await updateContent(id, updates);
      
      if (updatedContent) {
        // تحديث المحتوى في الحالة
        setContents(prev => {
          const newContents = { ...prev };
          
          // البحث عن القسم الذي يحتوي على المحتوى
          for (const section in newContents) {
            const index = newContents[section].findIndex(item => item.id === id);
            if (index !== -1) {
              newContents[section] = [
                ...newContents[section].slice(0, index),
                updatedContent,
                ...newContents[section].slice(index + 1),
              ];
              break;
            }
          }
          
          return newContents;
        });
        
        setCurrentlyEditing(null);
        setSuccessMessage(t('admin.content.actions.success'));
        
        // إخفاء رسالة النجاح بعد 3 ثوانٍ
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  };

  // ترجمة أسماء الأقسام
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'home':
        return t('admin.content.sections.home');
      case 'about':
        return t('admin.content.sections.about');
      case 'services':
        return t('admin.content.sections.services');
      case 'contact':
        return t('admin.content.sections.contact');
      default:
        return section;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.content.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.content.description')}
          </p>
        </div>
      </div>

      {/* رسالة النجاح */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-md flex items-center"
        >
          <Check size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* نموذج التحرير */}
      {currentlyEditing && (
        <Card className="mb-8">
          <Card.Header className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <Card.Title>
              {t('admin.content.edit')} - {currentlyEditing.key}
            </Card.Title>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              leftIcon={<X size={16} />}
            >
              {t('admin.content.actions.cancel')}
            </Button>
          </Card.Header>
          <Card.Body className="p-6">
            <ContentEditor
              content={currentlyEditing}
              onSave={handleSaveContent}
              onCancel={handleCancelEdit}
            />
          </Card.Body>
        </Card>
      )}

      {/* عرض أقسام المحتوى */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex justify-between">
                      <div className="space-y-3 w-full">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        Object.keys(contents).map(section => (
          <ContentSection
            key={section}
            title={getSectionTitle(section)}
            contents={contents[section]}
            isExpanded={expandedSections[section] || false}
            onToggle={() => toggleSection(section)}
            onEditContent={handleEditContent}
          />
        ))
      )}
    </AdminLayout>
  );
};

export default ContentManagement;