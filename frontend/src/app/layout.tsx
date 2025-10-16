import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.scss";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import I18nProvider from '@/components/providers/I18nProvider';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Study Platform",
  description: "An intelligent study platform powered by AI",
};

// List of auth routes where navigation should be hidden
const authRoutes = [
  '/login',
  '/register',
  '/complete-profile',
  '/confirm-email',
  '/callback'
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll handle the auth route check in the individual layout files instead
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-full bg-gray-50 text-gray-900`}>
        <QueryProvider>
          <I18nProvider>
            <AuthProvider>
              <div className="min-h-full">
                {children}
              </div>
            </AuthProvider>
          </I18nProvider>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}