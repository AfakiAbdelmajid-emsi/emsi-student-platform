'use client';
import { FolderOpen, Pin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileTabsProps {
  activeTab: 'all' | 'pinned' | 'recent';
  onTabChange: (tab: 'all' | 'pinned' | 'recent') => void;
}

export default function FileTabs({ activeTab, onTabChange }: FileTabsProps) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white rounded-xl shadow-soft mb-6 border border-gray-100">
      <div className="flex space-x-4 p-4">
        <button
          onClick={() => onTabChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FolderOpen className="h-4 w-4 inline-block mr-2" />
          {t('allFiles', 'All Files')}
        </button>
        <button
          onClick={() => onTabChange('pinned')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'pinned'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Pin className="h-4 w-4 inline-block mr-2" />
          {t('pinned', 'Pinned')}
        </button>
        <button
          onClick={() => onTabChange('recent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recent'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="h-4 w-4 inline-block mr-2" />
          {t('recent', 'Recent')}
        </button>
      </div>
    </div>
  );
} 