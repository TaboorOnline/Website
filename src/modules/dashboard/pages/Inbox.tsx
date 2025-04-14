// src/modules/dashboard/pages/Inbox.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiTrash2, 
  FiFilter, 
  FiArchive,
  FiRefreshCw, 
  FiClock, 
  FiUser, 
  FiAtSign, 
  FiPhone
} from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Button from '../../../shared/components/Button';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { 
  useMessages, 
  useMarkMessageAsRead, 
  useArchiveMessage, 
  useDeleteMessage 
} from '../services/messageService';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import { ContactMessage } from '../../../shared/types/types';

const Inbox = () => {
  const { t } = useTranslation();
  
  // State
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Fetch messages based on filter
  const { data: messages, isLoading, error, refetch } = useMessages(
    filter === 'unread' ? false : filter === 'read' ? true : undefined,
    filter === 'archived' ? true : false
  );
  
  // Mutations
  const markAsReadMutation = useMarkMessageAsRead();
  const archiveMessageMutation = useArchiveMessage();
  const deleteMessageMutation = useDeleteMessage();
  
  // Handlers
  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (!message.read) {
      try {
        await markAsReadMutation.mutateAsync(message.id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };
  
  const handleArchiveMessage = async (messageId: string) => {
    try {
      await archiveMessageMutation.mutateAsync(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to archive message:', error);
    }
  };
  
  const handleDeleteClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedMessage) return;
    
    try {
      await deleteMessageMutation.mutateAsync(selectedMessage.id);
      setIsDeleteModalOpen(false);
      if (selectedMessage.id === selectedMessage.id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Filter options
  const filterOptions = [
    { value: 'all', label: t('inbox.filterAll') },
    { value: 'unread', label: t('inbox.filterUnread') },
    { value: 'read', label: t('inbox.filterRead') },
    { value: 'archived', label: t('inbox.filterArchived') },
  ];
  
  // Filtered messages based on search
  const filteredMessages = messages?.filter(message => {
    if (!searchQuery) return true;
    
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(lowerSearchQuery) ||
      message.email.toLowerCase().includes(lowerSearchQuery) ||
      message.message.toLowerCase().includes(lowerSearchQuery)
    );
  });
  
  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('errors.failedToLoadMessages')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('errors.tryAgainLater')}
          </p>
          <Button onClick={() => refetch()}>
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title={t('inbox.title')}
        subtitle={t('inbox.subtitle')}
        actions={
          <Button
            onClick={() => refetch()}
            icon={<FiRefreshCw className="mr-2" />}
            variant="outline"
          >
            {t('inbox.refresh')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
              <div className="flex items-center">
                <Select
                  options={filterOptions}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read' | 'archived')}
                  icon={<FiFilter />}
                  className="w-full"
                />
              </div>
              <Input
                placeholder={t('inbox.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<FiMail />}
              />
            </div>
            
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0 animate-pulse">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                          </div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-1/2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredMessages && filteredMessages.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          {message.name.charAt(0)}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {message.name}
                              {!message.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {message.email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <EmptyState
                    title={t('inbox.noMessages')}
                    message={t('inbox.noMessagesDescription')}
                    icon={<FiMail className="w-12 h-12 text-gray-400" />}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t('inbox.messageFrom')} {selectedMessage.name}
                    </h2>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveMessage(selectedMessage.id)}
                        icon={<FiArchive className="w-4 h-4" />}
                      >
                        {t('inbox.archive')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(selectedMessage)}
                        icon={<FiTrash2 className="w-4 h-4" />}
                      >
                        {t('inbox.delete')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 mr-2 font-medium">
                          {t('inbox.name')}:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedMessage.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FiClock className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 mr-2 font-medium">
                          {t('inbox.date')}:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(selectedMessage.created_at)} {formatTime(selectedMessage.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FiAtSign className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 mr-2 font-medium">
                          {t('inbox.email')}:
                        </span>
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 mr-2 font-medium">
                          {t('inbox.phone')}:
                        </span>
                        <a 
                          href={`tel:${selectedMessage.phone}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t('inbox.message')}
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {t('inbox.quickReply')}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => window.open(`mailto:${selectedMessage.email}?subject=RE: Contact Form Submission - Hilal Tech`, '_blank')}
                        >
                          {t('inbox.replyByEmail')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => window.open(`tel:${selectedMessage.phone}`, '_blank')}
                        >
                          {t('inbox.callNow')}
                        </Button>
                      </div>
                      
                      <div>
                        <textarea
                          className="input w-full mb-4"
                          rows={4}
                          placeholder={t('inbox.typeYourResponse')}
                        ></textarea>
                        
                        <div className="flex justify-end">
                          <Button>
                            {t('inbox.sendReply')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center h-full p-8"
                >
                  <div className="text-center">
                    <FiMail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('inbox.selectMessage')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      {t('inbox.selectMessageDescription')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMessageMutation.status === "pending"}
        title={t('inbox.deleteMessage')}
        message={t('inbox.deleteMessageConfirmation')}
      />
    </div>
  );
};

export default Inbox;