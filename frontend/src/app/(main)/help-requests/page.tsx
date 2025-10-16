'use client';
import { HelpAnnouncement } from '@/components/help/HelpAnnouncement';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';


export default function HelpRequestsPage() {
  const { t } = useTranslation('common');


  return (
    <PageContainer>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-4">
          {t('pageTitles.helpRequests')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('pageTitles.helpRequestsDesc')}
        </p>
      </div>
      <HelpAnnouncement />
    </PageContainer>
  );
} 