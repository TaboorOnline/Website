// src/pages/admin/Projects.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash, Eye, ArrowUp, ArrowDown, 
  Search, Check, X, AlertTriangle, Upload, Link
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { 
  getAllProjects, 
  addProject, 
  updateProject, 
  deleteProject,
  Project 
} from '../../lib/supabase';
import { isRTL } from '../../i18n';

// مكون بطاقة المشروع
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  const { t } = useTranslation();
  const currentLang = isRTL() ? 'ar' : 'en';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row">
        {/* صورة المشروع */}
        <div className="sm:w-48 h-48 sm:h-auto relative">
          <img 
            src={project.image_url || '/images/project-placeholder.jpg'} 
            alt={currentLang === 'ar' ? project.title_ar : project.title_en}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 rtl:left-2 rtl:right-auto bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {project.id}
          </div>
        </div>
        
        {/* معلومات المشروع */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {currentLang === 'ar' ? project.title_ar : project.title_en}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {currentLang === 'ar' ? project.description_ar : project.description_en}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech_stack.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {project.url && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <Link size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
                >
                  {project.url}
                </a>
              </div>
            )}
          </div>
          
          {/* أزرار التحكم */}
          <div className="flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(project)}
                leftIcon={<Edit size={16} />}
              >
                {t('admin.projects.edit')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(project.id)}
                leftIcon={<Trash size={16} />}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                {t('admin.projects.delete')}
              </Button>
            </div>
            
            <div className="flex space-x-1 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveUp(project.id)}
                leftIcon={<ArrowUp size={16} />}
                disabled={isFirst}
                className={isFirst ? 'opacity-50 cursor-not-allowed' : ''}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveDown(project.id)}
                leftIcon={<ArrowDown size={16} />}
                disabled={isLast}
                className={isLast ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// مكون نموذج المشروع
interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title_ar: project?.title_ar || '',
    title_en: project?.title_en || '',
    description_ar: project?.description_ar || '',
    description_en: project?.description_en || '',
    image_url: project?.image_url || '',
    tech_stack: project?.tech_stack.join(', ') || '',
    url: project?.url || '',
    order: project?.order || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image_url || null);

  // تحديث البيانات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // مسح رسالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // رفع الصور (تخيلي، في التطبيق الحقيقي ستحتاج إلى معالجة رفع الصور)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // في التطبيق الحقيقي، سترفع الصورة هنا وتحصل على عنوان URL
      // للتبسيط، سنستخدم URL.createObjectURL للعرض المسبق
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image_url: `https://example.com/images/projects/${file.name}` }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title_ar.trim()) {
      newErrors.title_ar = t('contact.form.validation.required');
    }
    
    if (!formData.title_en.trim()) {
      newErrors.title_en = t('contact.form.validation.required');
    }
    
    if (!formData.description_ar.trim()) {
      newErrors.description_ar = t('contact.form.validation.required');
    }
    
    if (!formData.description_en.trim()) {
      newErrors.description_en = t('contact.form.validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // تحويل سلسلة التقنيات إلى مصفوفة
      const techArray = formData.tech_stack.split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      await onSubmit({
        title_ar: formData.title_ar,
        title_en: formData.title_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        image_url: formData.image_url,
        tech_stack: techArray,
        url: formData.url || undefined,
        order: Number(formData.order) || 0
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      setErrors({
        form: t('admin.projects.error.form')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md flex items-center">
          <AlertTriangle size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* العنوان العربي */}
        <div>
          <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.titleAr')} *
          </label>
          <input
            type="text"
            id="title_ar"
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.title_ar ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            dir="rtl"
          />
          {errors.title_ar && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title_ar}</p>
          )}
        </div>

        {/* العنوان الإنجليزي */}
        <div>
          <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.titleEn')} *
          </label>
          <input
            type="text"
            id="title_en"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.title_en ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            dir="ltr"
          />
          {errors.title_en && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title_en}</p>
          )}
        </div>

        {/* الوصف العربي */}
        <div>
          <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.descriptionAr')} *
          </label>
          <textarea
            id="description_ar"
            name="description_ar"
            value={formData.description_ar}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border ${
              errors.description_ar ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            dir="rtl"
          ></textarea>
          {errors.description_ar && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description_ar}</p>
          )}
        </div>

        {/* الوصف الإنجليزي */}
        <div>
          <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.descriptionEn')} *
          </label>
          <textarea
            id="description_en"
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border ${
              errors.description_en ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            dir="ltr"
          ></textarea>
          {errors.description_en && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description_en}</p>
          )}
        </div>

        {/* صورة المشروع */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.image')}
          </label>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none cursor-pointer">
              <Upload size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
              {t('common.upload')}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="أو أدخل رابط الصورة"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {imagePreview && (
            <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image_url: '' }));
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 focus:outline-none"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* التقنيات المستخدمة */}
        <div>
          <label htmlFor="tech_stack" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.technologies')}
          </label>
          <input
            type="text"
            id="tech_stack"
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="React, TypeScript, Tailwind CSS, ..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            أدخل التقنيات مفصولة بفواصل
          </p>
        </div>

        {/* رابط المشروع */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.url')}
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* الترتيب */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.projects.form.order')}
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          leftIcon={<X size={18} />}
        >
          {t('admin.projects.form.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={project ? <Edit size={18} /> : <Plus size={18} />}
        >
          {project ? t('admin.projects.form.update') : t('admin.projects.form.create')}
        </Button>
      </div>
    </form>
  );
};

// مكون تأكيد الحذف
interface ConfirmDeleteProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel, isDeleting }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle size={24} className="mr-3 rtl:ml-3 rtl:mr-0" />
            <h3 className="text-lg font-medium">{t('admin.projects.confirmDelete')}</h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('admin.projects.confirmDeleteMessage')}
          </p>
          
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isDeleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              isLoading={isDeleting}
              leftIcon={<Trash size={18} />}
            >
              {t('admin.projects.delete')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// الصفحة الرئيسية لإدارة المشاريع
const ProjectsManagement = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // جلب المشاريع
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setErrorMessage(t('admin.projects.error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [t]);

  // تطبيق البحث
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(project => 
        project.title_ar.toLowerCase().includes(query) ||
        project.title_en.toLowerCase().includes(query) ||
        project.description_ar.toLowerCase().includes(query) ||
        project.description_en.toLowerCase().includes(query) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(query))
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  // إضافة مشروع جديد
  const handleAddProject = async (data: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const newProject = await addProject(data);
      
      if (newProject) {
        setProjects(prev => [...prev, newProject].sort((a, b) => a.order - b.order));
        setShowAddForm(false);
        showSuccessMessage(t('admin.projects.success.add'));
      }
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  // تحديث مشروع
  const handleUpdateProject = async (data: Omit<Project, 'id' | 'created_at'>) => {
    if (!editingProject) return;
    
    try {
      const updatedProject = await updateProject(editingProject.id, data);
      
      if (updatedProject) {
        setProjects(prev => 
          prev.map(item => item.id === updatedProject.id ? updatedProject : item)
            .sort((a, b) => a.order - b.order)
        );
        setEditingProject(null);
        showSuccessMessage(t('admin.projects.success.edit'));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // حذف مشروع
  const handleDeleteConfirm = async () => {
    if (projectToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteProject(projectToDelete);
      
      if (success) {
        setProjects(prev => prev.filter(item => item.id !== projectToDelete));
        setProjectToDelete(null);
        showSuccessMessage(t('admin.projects.success.delete'));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setErrorMessage(t('admin.projects.error.delete'));
    } finally {
      setIsDeleting(false);
    }
  };

  // تحريك المشروع للأعلى
  const moveProjectUp = (id: number) => {
    const index = projects.findIndex(p => p.id === id);
    if (index <= 0) return;
    
    const updatedProjects = [...projects];
    const currentOrder = updatedProjects[index].order;
    const prevOrder = updatedProjects[index - 1].order;
    
    // تبديل الترتيب
    updatedProjects[index].order = prevOrder;
    updatedProjects[index - 1].order = currentOrder;
    
    // تحديث المشاريع في قاعدة البيانات
    updateProject(updatedProjects[index].id, { order: prevOrder });
    updateProject(updatedProjects[index - 1].id, { order: currentOrder });
    
    // تحديث الحالة
    setProjects(updatedProjects.sort((a, b) => a.order - b.order));
  };

  // تحريك المشروع للأسفل
  const moveProjectDown = (id: number) => {
    const index = projects.findIndex(p => p.id === id);
    if (index >= projects.length - 1) return;
    
    const updatedProjects = [...projects];
    const currentOrder = updatedProjects[index].order;
    const nextOrder = updatedProjects[index + 1].order;
    
    // تبديل الترتيب
    updatedProjects[index].order = nextOrder;
    updatedProjects[index + 1].order = currentOrder;
    
    // تحديث المشاريع في قاعدة البيانات
    updateProject(updatedProjects[index].id, { order: nextOrder });
    updateProject(updatedProjects[index + 1].id, { order: currentOrder });
    
    // تحديث الحالة
    setProjects(updatedProjects.sort((a, b) => a.order - b.order));
  };

  // عرض رسائل النجاح والخطأ
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.projects.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.projects.description')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          leftIcon={<Plus size={18} />}
          className="shrink-0"
        >
          {t('admin.projects.addNew')}
        </Button>
      </div>

      {/* رسائل النجاح والخطأ */}
      <AnimatePresence>
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

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md flex items-center"
          >
            <AlertTriangle size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نموذج الإضافة */}
      {showAddForm && (
        <Card className="mb-8">
          <Card.Header className="bg-gray-50 dark:bg-gray-800/50">
            <Card.Title>{t('admin.projects.addNew')}</Card.Title>
          </Card.Header>
          <Card.Body className="p-6">
            <ProjectForm
              onSubmit={handleAddProject}
              onCancel={() => setShowAddForm(false)}
            />
          </Card.Body>
        </Card>
      )}

      {/* نموذج التعديل */}
      {editingProject && (
        <Card className="mb-8">
          <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between">
            <Card.Title>{t('admin.projects.edit')}</Card.Title>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingProject(null)}
              leftIcon={<X size={16} />}
            >
              {t('common.cancel')}
            </Button>
          </Card.Header>
          <Card.Body className="p-6">
            <ProjectForm
              project={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          </Card.Body>
        </Card>
      )}

      {/* شريط البحث */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rtl:pr-10 rtl:pl-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* قائمة المشاريع */}
      <div className="space-y-4">
        {isLoading ? (
          // حالة التحميل
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredProjects.length > 0 ? (
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
                onDelete={(id) => setProjectToDelete(id)}
                onMoveUp={moveProjectUp}
                onMoveDown={moveProjectDown}
                isFirst={index === 0}
                isLast={index === filteredProjects.length - 1}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {searchQuery ? (
                <Search size={24} className="text-gray-400" />
              ) : (
                <Briefcase size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery
                ? t('admin.projects.noSearchResults')
                : t('admin.projects.noProjects')
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? t('admin.projects.tryDifferentSearch')
                : t('admin.projects.addYourFirstProject')
              }
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus size={18} />}
              >
                {t('admin.projects.addNew')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {projectToDelete !== null && (
          <ConfirmDelete
            onConfirm={handleDeleteConfirm}
            onCancel={() => setProjectToDelete(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ProjectsManagement;