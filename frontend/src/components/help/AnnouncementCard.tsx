import { BookOpen, Clock, MessageSquare, Mail, Phone, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { HelpAnnouncement } from '@/types/help';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AnnouncementCardProps {
  announcement: HelpAnnouncement;
  activeTab: 'all' | 'my';
  onEdit?: (id: string) => void;
  onClose?: (id: string) => void;
  onContact?: (announcement: HelpAnnouncement) => void;
  onDelete?: (id: string) => void;
}

export const AnnouncementCard = ({ 
  announcement, 
  activeTab,
  onEdit,
  onClose,
  onContact,
  onDelete
}: AnnouncementCardProps) => {
  const [showContact, setShowContact] = useState(false);
  const { t } = useTranslation('common');
  console.log('AnnouncementCard rendered:', announcement);

  const handleContactClick = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <BookOpen className="h-4 w-4" />
            <span>{announcement.categorie}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          announcement.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {announcement.status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={announcement.image_url || '/placeholder-avatar.jpg'}
              alt={announcement.full_name || 'User'}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{announcement.full_name || 'Anonymous'}</span>
          </div>
          {showContact && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm w-fit">
              <div className="flex items-center gap-2">
                {announcement.contact_method === 'email' ? (
                  <Mail className="h-4 w-4 text-gray-500" />
                ) : (
                  <Phone className="h-4 w-4 text-gray-500" />
                )}
                <span className="font-semibold">
                  {announcement.contact_method === 'email' ? 'Email type:' : 'Phone type:'}
                </span>
                <span className="text-gray-700 break-all">{announcement.contact_value}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
          </div>
          {activeTab === 'all' ? (
            <div className="flex flex-col items-end">
              <Button 
                variant="outline"
                onClick={handleContactClick}
                className="flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Button 
                variant="outline" 
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                onClick={() => onEdit?.(announcement.id)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                className={`${
                  announcement.status === 'open'
                    ? 'text-red-600 border-red-200 hover:bg-red-50'
                    : 'text-green-600 border-green-200 hover:bg-green-50'
                }`}
                onClick={() => onClose?.(announcement.id)}
              >
                {announcement.status === 'open' ? 'Close' : 'Reopen'}
              </Button>
              <button
                type="button"
                onClick={() => onDelete?.(announcement.id)}
                className="ml-2 p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
                title="Delete announcement"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 