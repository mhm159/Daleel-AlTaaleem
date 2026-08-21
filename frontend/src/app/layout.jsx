import '../styles/globals.css';
import { AuthProvider } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'مدارس دليل التعلم - عين على تنشئة الجيل',
  description: 'مدارس دليل التعلم الأهلية بالمملكة العربية السعودية - عين على تنشئة الجيل.',
  keywords: 'مدارس أهلية, مدارس دليل التعلم, التعليم السعودي, القبول والتسجيل, بوابة ولي الأمر, المملكة العربية السعودية , السليل , وادي الدواسر, مدارس , مدارس خاصة ',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

import DynamicFavicon from '../components/DynamicFavicon';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <DynamicFavicon />
        <Toaster position="bottom-center" />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
