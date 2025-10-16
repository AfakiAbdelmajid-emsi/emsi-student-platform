'use client';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Calendar = dynamic(() => import('react-calendar'), {
  ssr: false
});

interface CalendarSectionProps {
  selectedDate: Date | null;
  currentDate: Date;
  onDateChange: (value: any) => void;
  tileContent: ({ date }: { date: Date }) => React.ReactNode;
}

export default function CalendarSection({ 
  selectedDate, 
  currentDate, 
  onDateChange, 
  tileContent 
}: CalendarSectionProps) {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-gray-900">{t('studyCalendar', 'Study Calendar')}</h2>
      </div>
      <div className="bg-white rounded-xl shadow-soft p-6">
        <Calendar
          value={selectedDate || currentDate}
          onChange={onDateChange}
          className="custom-calendar"
          tileContent={tileContent}
          prevLabel={<ChevronLeft className="h-5 w-5" />}
          nextLabel={<ChevronRight className="h-5 w-5" />}
          prev2Label={null}
          next2Label={null}
          minDetail="month"
          maxDetail="month"
          formatShortWeekday={(locale, date) => {
            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
          }}
        />
        <style jsx global>{`
          .custom-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
            background: transparent;
          }
          .custom-calendar .react-calendar__navigation {
            margin-bottom: 1rem;
          }
          .custom-calendar .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 1rem;
            font-weight: 600;
            color: #374151;
          }
          .custom-calendar .react-calendar__navigation button:enabled:hover,
          .custom-calendar .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 0.75rem;
            color: #6b7280;
          }
          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 0.5rem;
          }
          .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          .custom-calendar .react-calendar__tile {
            padding: 1rem 0.5rem;
            background: none;
            text-align: center;
            line-height: 1.5;
            font-size: 0.875rem;
            color: #374151;
            position: relative;
          }
          .custom-calendar .react-calendar__tile:enabled:hover,
          .custom-calendar .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__tile--now {
            background-color: #e5e7eb;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__tile--active {
            background-color: #4f46e5;
            color: white;
            border-radius: 0.5rem;
          }
          .custom-calendar .react-calendar__tile--active:enabled:hover,
          .custom-calendar .react-calendar__tile--active:enabled:focus {
            background-color: #4338ca;
          }
          .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
            color: #9ca3af;
          }
        `}</style>
      </div>
    </div>
  );
} 