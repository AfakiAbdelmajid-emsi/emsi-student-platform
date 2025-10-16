import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Requests | AI Study Platform',
  description: 'Find or offer help with your courses through our community of students.',
};

export default function HelpRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 