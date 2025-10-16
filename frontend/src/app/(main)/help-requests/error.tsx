'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';

export default function HelpRequestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation('common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('errorOccurred', 'Something went wrong!')}</h2>
        <p className="text-gray-600 mb-8">
          {t('helpRequestsLoadError', 'We couldn\'t load the help requests. Please try again later.')}
        </p>
        <Button
          onClick={reset}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {t('tryAgain', 'Try again')}
        </Button>
      </div>
    </PageContainer>
  );
} 