import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'open' | 'closed';
  onFilterChange: (value: 'all' | 'open' | 'closed') => void;
}

export const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange 
}: SearchAndFilterProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={t('searchPlaceholder', 'Search announcements...')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        value={filterStatus}
        onChange={(e) => onFilterChange(e.target.value as 'all' | 'open' | 'closed')}
      >
        <option value="all">{t('allStatus', 'All Status')}</option>
        <option value="open">{t('open', 'Open')}</option>
        <option value="closed">{t('closed', 'Closed')}</option>
      </select>
    </div>
  );
}; 