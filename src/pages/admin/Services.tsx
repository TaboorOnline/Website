// src/pages/admin/Services.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash, ArrowUp, ArrowDown, 
  Search, Check, X, AlertTriangle, Upload, Briefcase
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { 
  getAllServices, 
  addService, 
  updateService, 
  deleteService,
  Service 
} from '../../lib/supabase';
import { isRTL } from '../../i18n';

// مكون بطاقة الخدمة
interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
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
      <div className="p-5">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 mr-4 rtl:ml-4 rtl:mr-0">
            {service.icon ? (
              <div 
                className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Briefcase size={24} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {currentLang === 'ar' ? service.title_ar : service.title_en}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {service.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 mr-2 rtl:ml-2 rtl:mr-0">
                  {service.category}
                </span>
              )}
              <span>ID: {service.id}</span>
              {service.order !== undefined && (
                <span className="mx-2">•</span>
              )}
              {service.order !== undefined && (
                <span>{t('admin.services.order')}: {service.order}</span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {currentLang === 'ar' ? service.description_ar : service.description_en}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(service)}
              leftIcon={<Edit size={16} />}
            >
              {t('admin.services.edit')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(service.id)}
              leftIcon={<Trash size={16} />}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              {t('admin.services.delete')}
            </Button>
          </div>
          
          <div className="flex space-x-1 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp(service.id)}
              leftIcon={<ArrowUp size={16} />}
              disabled={isFirst}
              className={isFirst ? 'opacity-50 cursor-not-allowed' : ''}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown(service.id)}
              leftIcon={<ArrowDown size={16} />}
              disabled={isLast}
              className={isLast ? 'opacity-50 cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// مكون نموذج الخدمة
interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: Omit<Service, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title_ar: service?.title_ar || '',
    title_en: service?.title_en || '',
    description_ar: service?.description_ar || '',
    description_en: service?.description_en || '',
    icon: service?.icon || '',
    category: service?.category || '',
    order: service?.order || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [iconPreview, setIconPreview] = useState<string | null>(service?.icon || null);

  // تحديث البيانات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // تحديث الأيقونة
  const handleIconChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, icon: value }));
    setIconPreview(value);
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
      await onSubmit({
        title_ar: formData.title_ar,
        title_en: formData.title_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        icon: formData.icon,
        category: formData.category || undefined,
        order: Number(formData.order) || 0
      });
    } catch (error) {
      console.error('Error submitting service:', error);
      setErrors({
        form: t('admin.services.error.form')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // فئات الخدمات
  const serviceCategories = [
    { value: '', label: t('admin.services.categorySelect') },
    { value: 'web', label: t('projects.filters.web') },
    { value: 'mobile', label: t('projects.filters.mobile') },
    { value: 'desktop', label: t('projects.filters.desktop') },
    { value: 'ai', label: t('projects.filters.ai') },
    { value: 'consulting', label: 'استشارات' },
    { value: 'other', label: 'أخرى' }
  ];

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
            {t('admin.services.form.titleAr')} *
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
            {t('admin.services.form.titleEn')} *
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
            {t('admin.services.form.descriptionAr')} *
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
            {t('admin.services.form.descriptionEn')} *
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

        {/* أيقونة الخدمة */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.services.form.icon')}
          </label>
          <textarea
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleIconChange}
            rows={3}
            placeholder="<svg>...</svg>"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            أدخل رمز SVG للأيقونة
          </p>
          {iconPreview && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex items-center">
              <div 
                className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3 rtl:ml-3 rtl:mr-0"
                dangerouslySetInnerHTML={{ __html: iconPreview }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">معاينة الأيقونة</span>
            </div>
          )}
        </div>

        {/* الفئة */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.services.form.category')}
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            {serviceCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* الترتيب */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.services.form.order')}
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
          {t('admin.services.form.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={service ? <Edit size={18} /> : <Plus size={18} />}
        >
          {service ? t('admin.services.form.update') : t('admin.services.form.create')}
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
            <h3 className="text-lg font-medium">{t('admin.services.confirmDelete')}</h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('admin.services.confirmDeleteMessage')}
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
              {t('admin.services.delete')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// الصفحة الرئيسية لإدارة الخدمات
const ServicesManagement = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // جلب الخدمات
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const data = await getAllServices();
        setServices(data);
        applyFilters(data, searchQuery, filter);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrorMessage(t('admin.services.error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [t]);

  // تطبيق الفلاتر والبحث
  const applyFilters = (allServices: Service[], query: string, categoryFilter: string) => {
    let filtered = [...allServices];
    
    // فلترة حسب الفئة
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }
    
    // فلترة حسب البحث
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(service => 
        service.title_ar.toLowerCase().includes(searchLower) ||
        service.title_en.toLowerCase().includes(searchLower) ||
        service.description_ar.toLowerCase().includes(searchLower) ||
        service.description_en.toLowerCase().includes(searchLower) ||
        (service.category && service.category.toLowerCase().includes(searchLower))
      );
    }
    
    // ترتيب حسب الترتيب ثم المعرف
    filtered.sort((a, b) => {
      if (a.order === b.order) {
        return a.id - b.id;
      }
      return a.order - b.order;
    });
    
    setFilteredServices(filtered);
  };

  // إعادة تطبيق الفلاتر عند تغيير المدخلات
  useEffect(() => {
    applyFilters(services, searchQuery, filter);
  }, [searchQuery, filter, services]);

  // إضافة خدمة جديدة
  const handleAddService = async (data: Omit<Service, 'id' | 'created_at'>) => {
    try {
      const newService = await addService(data);
      
      if (newService) {
        setServices(prev => [...prev, newService].sort((a, b) => a.order - b.order));
        setShowAddForm(false);
        showSuccessMessage(t('admin.services.success.add'));
      }
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  // تحديث خدمة
  const handleUpdateService = async (data: Omit<Service, 'id' | 'created_at'>) => {
    if (!editingService) return;
    
    try {
      const updatedService = await updateService(editingService.id, data);
      
      if (updatedService) {
        setServices(prev => 
          prev.map(item => item.id === updatedService.id ? updatedService : item)
            .sort((a, b) => a.order - b.order)
        );
        setEditingService(null);
        showSuccessMessage(t('admin.services.success.edit'));
      }
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  // حذف خدمة
  const handleDeleteConfirm = async () => {
    if (serviceToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteService(serviceToDelete);
      
      if (success) {
        setServices(prev => prev.filter(item => item.id !== serviceToDelete));
        setServiceToDelete(null);
        showSuccessMessage(t('admin.services.success.delete'));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setErrorMessage(t('admin.services.error.delete'));
    } finally {
      setIsDeleting(false);
    }
  };

  // تحريك الخدمة للأعلى (تقليل الترتيب)
  const moveServiceUp = (id: number) => {
    const index = services.findIndex(p => p.id === id);
    if (index <= 0) return;
    
    const updatedServices = [...services];
    const currentOrder = updatedServices[index].order;
    const prevOrder = updatedServices[index - 1].order;
    
    // تبديل الترتيب
    updatedServices[index].order = prevOrder;
    updatedServices[index - 1].order = currentOrder;
    
    // تحديث الخدمات في قاعدة البيانات
    updateService(updatedServices[index].id, { order: prevOrder });
    updateService(updatedServices[index - 1].id, { order: currentOrder });
    
    // تحديث الحالة
    setServices(updatedServices.sort((a, b) => a.order - b.order));
  };

  // تحريك الخدمة للأسفل (زيادة الترتيب)
  const moveServiceDown = (id: number) => {
    const index = services.findIndex(p => p.id === id);
    if (index >= services.length - 1) return;
    
    const updatedServices = [...services];
    const currentOrder = updatedServices[index].order;
    const nextOrder = updatedServices[index + 1].order;
    
    // تبديل الترتيب
    updatedServices[index].order = nextOrder;
    updatedServices[index + 1].order = currentOrder;
    
    // تحديث الخدمات في قاعدة البيانات
    updateService(updatedServices[index].id, { order: nextOrder });
    updateService(updatedServices[index + 1].id, { order: currentOrder });
    
    // تحديث الحالة
    setServices(updatedServices.sort((a, b) => a.order - b.order));
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

  // استخراج فئات الخدمات المتاحة
  const categories = Array.from(
    new Set(services.map(service => service.category).filter(Boolean))
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.services.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.services.description')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          leftIcon={<Plus size={18} />}
          className="shrink-0"
        >
          {t('admin.services.addNew')}
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
            <Card.Title>{t('admin.services.addNew')}</Card.Title>
          </Card.Header>
          <Card.Body className="p-6">
            <ServiceForm
              onSubmit={handleAddService}
              onCancel={() => setShowAddForm(false)}
            />
          </Card.Body>
        </Card>
      )}

      {/* نموذج التعديل */}
      {editingService && (
        <Card className="mb-8">
          <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between">
            <Card.Title>{t('admin.services.edit')}</Card.Title>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingService(null)}
              leftIcon={<X size={16} />}
            >
              {t('common.cancel')}
            </Button>
          </Card.Header>
          <Card.Body className="p-6">
            <ServiceForm
              service={editingService}
              onSubmit={handleUpdateService}
              onCancel={() => setEditingService(null)}
            />
          </Card.Body>
        </Card>
      )}

      {/* فلاتر وخيارات البحث */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* تصفية حسب الفئة */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === 'all'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setFilter('all')}
            >
              {t('projects.filters.all')}
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === category
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* بحث */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full px-4 py-2 pl-10 rtl:pr-10 rtl:pl-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الخدمات */}
      <div className="space-y-4">
        {isLoading ? (
          // حالة التحميل
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 animate-pulse">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex space-x-1">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredServices.length > 0 ? (
          // عرض الخدمات
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={setEditingService}
                onDelete={(id) => setServiceToDelete(id)}
                onMoveUp={moveServiceUp}
                onMoveDown={moveServiceDown}
                isFirst={index === 0}
                isLast={index === filteredServices.length - 1}
              />
            ))}
          </AnimatePresence>
        ) : (
          // حالة عدم وجود خدمات
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {searchQuery || filter !== 'all' ? (
                <Search size={24} className="text-gray-400" />
              ) : (
                <Briefcase size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || filter !== 'all'
                ? t('admin.services.noSearchResults')
                : t('admin.services.noServices')
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery || filter !== 'all'
                ? t('admin.services.tryDifferentSearch')
                : t('admin.services.addYourFirstService')
              }
            </p>
            {!searchQuery && filter === 'all' && (
              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus size={18} />}
              >
                {t('admin.services.addNew')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {serviceToDelete !== null && (
          <ConfirmDelete
            onConfirm={handleDeleteConfirm}
            onCancel={() => setServiceToDelete(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ServicesManagement;