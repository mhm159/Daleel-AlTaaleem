import '../styles/globals.css';
import { AuthProvider } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'مدارس دليل التعلم الأهلية - نحو مستقبل مشرق',
  description: 'مدارس دليل التعلم الأهلية بالمملكة العربية السعودية - بيئة تعليمية متكاملة تجمع بين الأمان والتميز الأكاديمي وتنمية شخصية الطالب وفق المناهج الوطنية السعودية.',
  keywords: 'مدارس أهلية, مدارس دليل التعلم, التعليم السعودي, القبول والتسجيل, بوابة ولي الأمر, المملكة العربية السعودية',
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
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
