// src/pages/admin/Testimonials.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Mail, Eye, Calendar, Star, 
  Search, ChevronDown, ChevronUp, MessageSquare
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { NoContentEmptyState } from '../../components/common/EmptyState';
import { 
  getAllTestimonials, 
  approveTestimonial, 
  rejectTestimonial, 
  Testimonial 
} from '../../lib/supabase';
import { isRTL } from '../../i18n';

// مكون التيستيمونيال
interface TestimonialItemProps {
  testimonial: Testimonial;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onReply: (testimonial: Testimonial) => void;
  onPreview: (testimonial: Testimonial) => void;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({
  testimonial,
  onApprove,
  onReject,
  onReply,
  onPreview
}) => {
  const { t } = useTranslation();
  const { id, name, company, position, rating, created_at, is_approved } = testimonial;
  
  // تنسيق التاريخ
  const formattedDate = new Date(created_at).toLocaleDateString(
    isRTL() ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center mb-2 sm:mb-0">
            {testimonial.image_url ? (
              <img 
                src={testimonial.image_url} 
                alt={name} 
                className="w-8 h-8 rounded-full object-cover mr-3 rtl:ml-3 rtl:mr-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3 rtl:ml-3 rtl:mr-0">
                <span className="text-sm font-medium">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {name}
              </h4>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {position}, {company}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex mr-3 rtl:ml-3 rtl:mr-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i}
                  size={14}
                  className={`${
                    i < rating 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
              {formattedDate}
            </div>
            
            {is_approved && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
                {t('admin.testimonials.approved')}
              </span>
            )}
            
            {!is_approved && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Clock size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
                {t('admin.testimonials.pending')}
              </span>
            )}
          </div>
        </div>
        
        <Card.Body className="p-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {isRTL() ? testimonial.content_ar : testimonial.content_en}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(testimonial)}
              leftIcon={<Eye size={16} />}
            >
              {t('admin.testimonials.preview')}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(testimonial)}
              leftIcon={<Mail size={16} />}
            >
              {t('admin.testimonials.reply')}
            </Button>
            
            {!is_approved && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(id)}
                leftIcon={<CheckCircle size={16} />}
                className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10"
              >
                {t('admin.testimonials.approve')}
              </Button>
            )}
            
            <Button
              variant={is_approved ? "outline" : "ghost"}
              size="sm"
              onClick={() => onReject(id)}
              leftIcon={<XCircle size={16} />}
              className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              {t('admin.testimonials.reject')}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// مكون النموذج للرد على العميل
interface ReplyFormProps {
  testimonial: Testimonial;
  onClose: () => void;
  onSubmit: (testimonial: Testimonial, message: string) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ testimonial, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    // محاكاة إرسال الرد
    setTimeout(() => {
      onSubmit(testimonial, message);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <Card.Header className="bg-gray-50 dark:bg-gray-800/50">
        <Card.Title>{t('admin.testimonials.reply')}</Card.Title>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Body className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('contact.form.email')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-gray-900 dark:text-gray-100 cursor-not-allowed"
              value={testimonial.email}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="subject">
              {t('admin.testimonials.replyForm.subject')}
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              defaultValue={t('testimonials.form.title')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="message">
              {t('admin.testimonials.replyForm.message')}
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
        </Card.Body>
        
        <Card.Footer className="bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('admin.testimonials.replyForm.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {t('admin.testimonials.replyForm.send')}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

// مكون عرض التيستيمونيال
interface TestimonialPreviewProps {
  testimonial: Testimonial;
  onClose: () => void;
}

const TestimonialPreview: React.FC<TestimonialPreviewProps> = ({ testimonial, onClose }) => {
  const { t } = useTranslation();
  const { name, company, position, rating, created_at } = testimonial;
  
  // تنسيق التاريخ
  const formattedDate = new Date(created_at).toLocaleDateString(
    isRTL() ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
  
  return (
    <Card className="w-full">
      <Card.Header className="bg-gray-50 dark:bg-gray-800/50">
        <Card.Title>{t('admin.testimonials.preview')}</Card.Title>
      </Card.Header>
      <Card.Body className="p-6">
        <div className="mb-6 flex items-start">
          {testimonial.image_url ? (
            <img 
              src={testimonial.image_url} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover mr-4 rtl:ml-4 rtl:mr-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4 rtl:ml-4 rtl:mr-0">
              <span className="text-xl font-medium">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {position}, {company}
            </p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    size={16}
                    className={`${
                      i < rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 italic">
            "{isRTL() ? testimonial.content_ar : testimonial.content_en}"
          </p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('contact.form.email')}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {testimonial.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('testimonials.form.rating')}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {rating}/5
            </p>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-gray-50 dark:bg-gray-800/50 flex justify-end">
        <Button
          variant="primary"
          onClick={onClose}
        >
          {t('common.close')}
        </Button>
      </Card.Footer>
    </Card>
  );
};

// مكون تأكيد رفض التيستيمونيال
interface ConfirmRejectProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmReject: React.FC<ConfirmRejectProps> = ({ onConfirm, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="w-full max-w-md">
      <Card.Body className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('admin.testimonials.confirmReject')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('admin.testimonials.confirmRejectDescription')}
        </p>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {t('admin.testimonials.reject')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

// الصفحة الرئيسية لإدارة آراء العملاء
const TestimonialsManagement = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [sortField, setSortField] = useState<'created_at' | 'name' | 'rating'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // حالات العرض
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [testimonialToReject, setTestimonialToReject] = useState<number | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // جلب البيانات
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
      applyFilters(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // تطبيق الفلاتر والبحث
  const applyFilters = (allTestimonials: Testimonial[]) => {
    let filtered = [...allTestimonials];
    
    // فلترة حسب التاب النشط
    filtered = filtered.filter(item => 
      activeTab === 'pending' ? !item.is_approved : item.is_approved
    );
    
    // فلترة حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.position.toLowerCase().includes(query) ||
        item.content_ar.toLowerCase().includes(query) ||
        item.content_en.toLowerCase().includes(query)
      );
    }
    
    // فرز النتائج
    filtered.sort((a, b) => {
      if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'rating') {
        return sortDirection === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });
    
    setFilteredTestimonials(filtered);
  };
  
  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  // إعادة تطبيق الفلاتر عند تغيير البيانات
  useEffect(() => {
    applyFilters(testimonials);
  }, [activeTab, searchQuery, sortField, sortDirection]);
  
  // تغيير اتجاه الفرز
  const toggleSortDirection = (field: 'created_at' | 'name' | 'rating') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // إدارة الموافقة على التيستيمونيال
  const handleApprove = async (id: number) => {
    setIsApproving(true);
    try {
      const updatedTestimonial = await approveTestimonial(id);
      if (updatedTestimonial) {
        // تحديث القائمة
        setTestimonials(prevTestimonials => 
          prevTestimonials.map(item => 
            item.id === id ? { ...item, is_approved: true } : item
          )
        );
        applyFilters(testimonials.map(item => 
          item.id === id ? { ...item, is_approved: true } : item
        ));
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
    } finally {
      setIsApproving(false);
    }
  };
  
  // إدارة رفض التيستيمونيال
  const handleReject = (id: number) => {
    setTestimonialToReject(id);
  };
  
  const confirmReject = async () => {
    if (testimonialToReject === null) return;
    
    setIsRejecting(true);
    try {
      const success = await rejectTestimonial(testimonialToReject);
      if (success) {
        // تحديث القائمة
        setTestimonials(prevTestimonials => 
          prevTestimonials.filter(item => item.id !== testimonialToReject)
        );
        applyFilters(testimonials.filter(item => item.id !== testimonialToReject));
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
    } finally {
      setIsRejecting(false);
      setTestimonialToReject(null);
    }
  };
  
  // إدارة الرد على التيستيمونيال
  const handleReply = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowReplyForm(true);
  };
  
  const handleSendReply = (testimonial: Testimonial, message: string) => {
    // في البيئة الحقيقية، هنا سيتم إرسال الرسالة إلى البريد الإلكتروني
    console.log(`Sending reply to ${testimonial.email}:`, message);
    
    // إغلاق النموذج
    setShowReplyForm(false);
    setSelectedTestimonial(null);
  };
  
  // إدارة معاينة التيستيمونيال
  const handlePreview = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowPreview(true);
  };
  
  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.testimonials.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.testimonials.description')}
          </p>
        </div>
      </div>
      
      {/* فلاتر وخيارات البحث */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* تابس */}
          <div className="flex border-b sm:border-b-0 sm:border-r dark:border-gray-700 pb-3 sm:pb-0 sm:pr-4">
            <button
              className={`mr-4 px-2 py-1 border-b-2 ${
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              {t('admin.testimonials.pending')}
            </button>
            <button
              className={`px-2 py-1 border-b-2 ${
                activeTab === 'approved'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              {t('admin.testimonials.approved')}
            </button>
          </div>
          
          {/* بحث وفرز */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              {/* فرز حسب التاريخ */}
              <button
                className={`flex items-center px-3 py-2 border ${
                  sortField === 'created_at'
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                } rounded-md`}
                onClick={() => toggleSortDirection('created_at')}
              >
                <Calendar size={16} className="mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                <span className="text-sm">{t('common.date')}</span>
                {sortField === 'created_at' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                )}
              </button>
              
              {/* فرز حسب التقييم */}
              <button
                className={`flex items-center px-3 py-2 border ${
                  sortField === 'rating'
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                } rounded-md`}
                onClick={() => toggleSortDirection('rating')}
              >
                <Star size={16} className="mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                <span className="text-sm">{t('testimonials.form.rating')}</span>
                {sortField === 'rating' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* قائمة التيستيمونيال */}
      <div className="space-y-4">
        {isLoading ? (
          // حالة التحميل
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="ml-3 rtl:mr-3 rtl:ml-0">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            </div>
          ))
        ) : filteredTestimonials.length > 0 ? (
          // عرض التيستيمونيال
          <AnimatePresence>
            {filteredTestimonials.map((testimonial) => (
              <TestimonialItem
                key={testimonial.id}
                testimonial={testimonial}
                onApprove={handleApprove}
                onReject={handleReject}
                onReply={handleReply}
                onPreview={handlePreview}
              />
            ))}
          </AnimatePresence>
        ) : (
          // حالة عدم وجود بيانات
          <NoContentEmptyState
            message={t('admin.testimonials.noTestimonials')}
            icon={<MessageSquare size={48} className="text-gray-400" />}
          />
        )}
      </div>
      
      {/* نموذج الرد */}
      {showReplyForm && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg"
          >
            <ReplyForm
              testimonial={selectedTestimonial}
              onClose={() => {
                setShowReplyForm(false);
                setSelectedTestimonial(null);
              }}
              onSubmit={handleSendReply}
            />
          </motion.div>
        </div>
      )}
      
      {/* معاينة التيستيمونيال */}
      {showPreview && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg"
          >
            <TestimonialPreview
              testimonial={selectedTestimonial}
              onClose={() => {
                setShowPreview(false);
                setSelectedTestimonial(null);
              }}
            />
          </motion.div>
        </div>
      )}
      
      {/* تأكيد رفض التيستيمونيال */}
      {testimonialToReject !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ConfirmReject
              onConfirm={confirmReject}
              onCancel={() => setTestimonialToReject(null)}
              isLoading={isRejecting}
            />
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TestimonialsManagement;