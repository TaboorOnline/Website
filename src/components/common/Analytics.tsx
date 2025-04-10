// src/components/common/Analytics.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageStats } from '../../lib/supabase';

const Analytics = () => {
  const location = useLocation();

  // تحديث إحصائيات الصفحة عند تغيير المسار
  useEffect(() => {
    const recordPageView = async () => {
      try {
        // الحصول على اسم الصفحة الحالية من المسار
        const pageName = location.pathname === '/' ? 'home' : location.pathname.substring(1);
        
        // تحديث الإحصائيات في قاعدة البيانات
        await updatePageStats(pageName);
        
        // إذا كان Google Analytics مُعداً، يمكن إضافة الكود هنا
        if (typeof window.gtag !== 'undefined') {
          window.gtag('config', 'G-XXXXXXXXXX', {
            page_path: location.pathname + location.search
          });
        }
      } catch (error) {
        console.error('Error recording page view:', error);
      }
    };

    recordPageView();
  }, [location]);

  // هذا المكون لا يُظهر أي واجهة مستخدم
  return null;
};

export default Analytics;

// إضافة تعريف النوع لـ gtag كونه غير معرّف بشكل افتراضي
declare global {
  interface Window {
    gtag: (command: string, target: string, config?: any) => void;
  }
}