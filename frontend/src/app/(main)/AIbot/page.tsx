"use client";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '@/components/ui/PageContainer';
import ChatBox from '@/components/chatbot/ChatBox';

export default function AIbotPage() {
  const { t } = useTranslation('common');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-4">
            {t('pageTitles.aiAssistant')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('pageTitles.aiAssistantDesc')}
          </p>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <ChatBox />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('Study_Help', 'Study Help')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('get_explanations_summaries_and_study_tips_for_any_subject', 'Get explanations, summaries, and study tips for any subject')}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('Practice_Questions', 'Practice Questions')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('generate_practice_questions_and_get_instant_feedback', 'Generate practice questions and get instant feedback')}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('Writing_Assistant', 'Writing Assistant')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('get_help_with_essays_reports_and_other_writing_assignments', 'Get help with essays, reports, and other writing assignments')}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
