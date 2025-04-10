// src/pages/admin/Messages.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Search, Filter, Eye, 
  Trash, Check, AlertTriangle, X, Reply, 
  Calendar, Clock, ChevronDown, ChevronUp  
} from 'lucide-react';

import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { 
  getAllContactMessages, 
  markMessageAsRead, 
  deleteContactMessage,
  ContactMessage
} from '../../lib/supabase';
import { isRTL } from '../../i18n';

// مكون عنصر الرسالة
interface MessageItemProps {
  message: ContactMessage;
  onView: (message: ContactMessage) => void;
  onDelete: (id: number) => void;
  onReply: (message: ContactMessage) => void;
  onMarkAsRead: (id: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onView,
  onDelete,
  onReply,
  onMarkAsRead
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isRTL() ? 'ar-SA' : 'en-US', 
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };
  
  // تنسيق الوقت
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(
      isRTL() ? 'ar-SA' : 'en-US', 
      { hour: '2-digit', minute: '2-digit' }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border ${
        message.is_read 
          ? 'border-gray-200 dark:border-gray-700' 
          : 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              message.is_read 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            } mr-3 rtl:ml-3 rtl:mr-0`}>
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {message.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <a href={`mailto:${message.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {message.email}
                </a>
                {message.phone && (
                  <>
                    <span className="mx-2">•</span>
                    <a href={`tel:${message.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                      {message.phone}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-3 rtl:mr-3 rtl:ml-0">
            <Calendar size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
            <span>{formatDate(message.created_at)}</span>
            <span className="mx-1">-</span>
            <Clock size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
            <span>{formatTime(message.created_at)}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {message.subject}
          </h4>
          <p className={`text-gray-600 dark:text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {message.message}
          </p>
          {message.message.length > 150 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
            >
              {t('common.readMore')}
            </button>
          )}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
            >
              {t('common.showLess')}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!message.is_read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(message.id)}
              leftIcon={<Check size={16} />}
              className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10"
            >
              {t('admin.messages.markAsRead')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(message)}
            leftIcon={<Eye size={16} />}
          >
            {t('admin.messages.view')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(message)}
            leftIcon={<Reply size={16} />}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
          >
            {t('admin.messages.reply')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(message.id)}
            leftIcon={<Trash size={16} />}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            {t('admin.messages.delete')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// مكون عرض تفاصيل الرسالة
interface MessageViewProps {
  message: ContactMessage;
  onClose: () => void;
  onReply: (message: ContactMessage) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ message, onClose, onReply }) => {
  const { t } = useTranslation();
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isRTL() ? 'ar-SA' : 'en-US', 
      { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  return (
    <Card className="w-full max-w-3xl">
      <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <Card.Title>{t('admin.messages.details')}</Card.Title>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          leftIcon={<X size={16} />}
        >
          {t('common.close')}
        </Button>
      </Card.Header>
      <Card.Body className="p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {message.subject}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(message.created_at)}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('contact.form.name')}
              </h3>
              <p className="text-gray-900 dark:text-white">
                {message.name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('contact.form.email')}
              </h3>
              <p className="text-gray-900 dark:text-white">
                <a href={`mailto:${message.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {message.email}
                </a>
              </p>
            </div>
            {message.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('contact.form.phone')}
                </h3>
                <p className="text-gray-900 dark:text-white">
                  <a href={`tel:${message.phone}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {message.phone}
                  </a>
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('admin.messages.status')}
              </h3>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                message.is_read 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {message.is_read ? t('admin.messages.read') : t('admin.messages.unread')}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('contact.form.message')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {message.message}
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          {t('common.close')}
        </Button>
        <Button
          variant="primary"
          onClick={() => onReply(message)}
          leftIcon={<Reply size={18} />}
        >
          {t('admin.messages.reply')}
        </Button>
      </Card.Footer>
    </Card>
  );
};

// مكون نموذج الرد
interface ReplyFormProps {
  message: ContactMessage;
  onClose: () => void;
  onSubmit: (message: ContactMessage, replyText: string) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ message, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    
    // في التطبيق الحقيقي، هنا سيتم إرسال البريد
    setTimeout(() => {
      onSubmit(message, replyText);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl">
      <Card.Header className="bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <Card.Title>{t('admin.messages.reply')}</Card.Title>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          leftIcon={<X size={16} />}
        >
          {t('common.close')}
        </Button>
      </Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Body className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('contact.form.email')}
            </label>
            <input
              type="text"
              value={message.email}
              disabled
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-gray-900 dark:text-gray-100 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('contact.form.subject')}
            </label>
            <input
              type="text"
              id="subject"
              defaultValue={`رد: ${message.subject}`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="reply" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.messages.replyForm.message')}
            </label>
            <textarea
              id="reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.messages.originalMessage')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400 border-s-2 border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <div className="font-medium mb-1">{message.subject}</div>
              <div>{message.message}</div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Reply size={18} />}
          >
            {t('admin.messages.replyForm.send')}
          </Button>
        </Card.Footer>
      </form>
    </Card>
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
    <Card className="w-full max-w-md">
      <Card.Body className="p-6">
        <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle size={24} className="mr-3 rtl:ml-3 rtl:mr-0" />
          <h3 className="text-lg font-medium">{t('admin.messages.confirmDelete')}</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('admin.messages.confirmDeleteMessage')}
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
            {t('admin.messages.delete')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

// الصفحة الرئيسية لإدارة الرسائل
const MessagesManagement = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [sortField, setSortField] = useState<'date' | 'name' | 'subject'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // حالات العرض
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewingMessage, setIsViewingMessage] = useState(false);
  const [isReplyingMessage, setIsReplyingMessage] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // رسائل الإشعارات
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // جلب الرسائل
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await getAllContactMessages();
        setMessages(data);
        applyFilters(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setErrorMessage(t('admin.messages.error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [t]);

  // تطبيق الفلاتر والبحث والترتيب
  const applyFilters = (allMessages: ContactMessage[]) => {
    let filtered = [...allMessages];
    
    // فلترة حسب التاب
    if (activeTab === 'unread') {
      filtered = filtered.filter(message => !message.is_read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(message => message.is_read);
    }
    
    // فلترة حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
      );
    }
    
    // ترتيب النتائج
    filtered.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'subject') {
        return sortDirection === 'asc'
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      }
      return 0;
    });
    
    setFilteredMessages(filtered);
  };

  // إعادة تطبيق الفلاتر عند تغيير المدخلات
  useEffect(() => {
    applyFilters(messages);
  }, [activeTab, searchQuery, sortField, sortDirection, messages]);

  // تغيير اتجاه الترتيب
  const toggleSortDirection = (field: 'date' | 'name' | 'subject') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // تعيين الرسالة كمقروءة
  const handleMarkAsRead = async (id: number) => {
    try {
      const updatedMessage = await markMessageAsRead(id);
      
      if (updatedMessage) {
        setMessages(prev => 
          prev.map(message => 
            message.id === id ? { ...message, is_read: true } : message
          )
        );
        showSuccessMessage(t('admin.messages.success.markAsRead'));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      showErrorMessage(t('admin.messages.error.markAsRead'));
    }
  };

  // حذف رسالة
  const handleDeleteConfirm = async () => {
    if (messageToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteContactMessage(messageToDelete);
      
      if (success) {
        setMessages(prev => prev.filter(message => message.id !== messageToDelete));
        setMessageToDelete(null);
        showSuccessMessage(t('admin.messages.success.delete'));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showErrorMessage(t('admin.messages.error.delete'));
    } finally {
      setIsDeleting(false);
    }
  };

  // إرسال رد
  const handleSendReply = (message: ContactMessage, replyText: string) => {
    // في التطبيق الحقيقي، هنا سيتم إرسال البريد الإلكتروني
    console.log(`Sending reply to ${message.email}:`, replyText);
    
    // وضع علامة الرسالة كمقروءة إذا لم تكن مقروءة
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
    
    // إغلاق نموذج الرد
    setIsReplyingMessage(false);
    setSelectedMessage(null);
    
    // عرض رسالة نجاح
    showSuccessMessage(t('admin.messages.success.reply'));
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

  // حساب عدد الرسائل غير المقروءة
  const unreadCount = messages.filter(message => !message.is_read).length;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('admin.messages.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.messages.description')}
            {unreadCount > 0 && (
              <span className="ml-2 rtl:mr-2 rtl:ml-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {t('admin.messages.unreadCount', { count: unreadCount })}
              </span>
            )}
          </p>
        </div>
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

      {/* فلاتر وخيارات البحث */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* تابس */}
          <div className="flex border-b sm:border-b-0 sm:border-r dark:border-gray-700 pb-3 sm:pb-0 sm:pr-4">
            <button
              className={`mr-4 px-2 py-1 border-b-2 ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('all')}
            >
              {t('admin.messages.all')}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({messages.length})</span>
            </button>
            <button
              className={`mr-4 px-2 py-1 border-b-2 ${
                activeTab === 'unread'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('unread')}
            >
              {t('admin.messages.unread')}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({unreadCount})</span>
            </button>
            <button
              className={`px-2 py-1 border-b-2 ${
                activeTab === 'read'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('read')}
            >
              {t('admin.messages.read')}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({messages.length - unreadCount})</span>
            </button>
          </div>
          
          {/* بحث وفرز */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
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
            
            <div className="flex gap-2">
              {/* فرز حسب التاريخ */}
              <button
                className={`flex items-center px-3 py-2 border ${
                  sortField === 'date'
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                } rounded-md`}
                onClick={() => toggleSortDirection('date')}
              >
                <Calendar size={16} className="mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                <span className="text-sm">{t('common.date')}</span>
                {sortField === 'date' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                )}
              </button>
              
              {/* فرز حسب الاسم */}
              <button
                className={`flex items-center px-3 py-2 border ${
                  sortField === 'name'
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                } rounded-md`}
                onClick={() => toggleSortDirection('name')}
              >
                <span className="text-sm">{t('contact.form.name')}</span>
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الرسائل */}
      <div className="space-y-4">
        {isLoading ? (
          // حالة التحميل
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                  <div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="mb-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                ))}
              </div>
            </div>
          ))
        ) : filteredMessages.length > 0 ? (
          <AnimatePresence>
            {filteredMessages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                onView={(msg) => {
                  setSelectedMessage(msg);
                  setIsViewingMessage(true);
                  
                  // تعيين الرسالة كمقروءة إذا لم تكن مقروءة
                  if (!msg.is_read) {
                    handleMarkAsRead(msg.id);
                  }
                }}
                onReply={(msg) => {
                  setSelectedMessage(msg);
                  setIsReplyingMessage(true);
                }}
                onDelete={(id) => setMessageToDelete(id)}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </AnimatePresence>
        ) : (
          // حالة عدم وجود رسائل
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {searchQuery ? (
                <Search size={24} className="text-gray-400" />
              ) : (
                <Mail size={24} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery
                ? t('admin.messages.noSearchResults')
                : t('admin.messages.noMessages')
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery
                ? t('admin.messages.tryDifferentSearch')
                : t('admin.messages.noMessagesDescription')
              }
            </p>
          </div>
        )}
      </div>

      {/* نموذج عرض تفاصيل الرسالة */}
      <AnimatePresence>
        {isViewingMessage && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <MessageView
                message={selectedMessage}
                onClose={() => {
                  setIsViewingMessage(false);
                  setSelectedMessage(null);
                }}
                onReply={(msg) => {
                  setIsViewingMessage(false);
                  setIsReplyingMessage(true);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نموذج الرد على الرسالة */}
      <AnimatePresence>
        {isReplyingMessage && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ReplyForm
                message={selectedMessage}
                onClose={() => {
                  setIsReplyingMessage(false);
                  setSelectedMessage(null);
                }}
                onSubmit={handleSendReply}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {messageToDelete !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ConfirmDelete
                onConfirm={handleDeleteConfirm}
                onCancel={() => setMessageToDelete(null)}
                isDeleting={isDeleting}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default MessagesManagement;