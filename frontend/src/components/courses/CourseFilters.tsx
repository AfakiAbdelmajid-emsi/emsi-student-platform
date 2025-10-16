import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Squares2X2Icon as GridIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: { value: string; label: string }[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const CourseFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
}: CourseFiltersProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-6">
      <div className="relative w-full sm:w-1/2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-primary-500" />
        </div>
        <input
          type="text"
          placeholder={t('searchCourses', 'Search courses...')}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-500" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 bg-white/80 backdrop-blur-sm appearance-none"
          >
            <option value="">{t('allCategories', 'All Categories')}</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
          >
            <GridIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 