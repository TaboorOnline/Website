import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// عناصر التخطيط المشتركة
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// الصفحات العامة
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// صفحات لوحة الإدارة
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminContent from './pages/admin/Content';
import AdminProjects from './pages/admin/Projects';
import AdminServices from './pages/admin/Services';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminMessages from './pages/admin/Messages';
import AdminStats from './pages/admin/Stats';

// مكونات المصادقة والحماية
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// تهيئة اللغة وإعدادات i18n
import { setupLanguage } from './i18n';

// مكون تتبع التحليلات
import Analytics from './components/common/Analytics';

// محتوى التطبيق الرئيسي
const App = () => {
  const { i18n } = useTranslation();

  // تهيئة اللغة عند بدء التطبيق
  useEffect(() => {
    setupLanguage();
  }, []);

  // ضبط اتجاه الصفحة بناءً على اللغة
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* مسارات لوحة الإدارة */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/content" 
            element={
              <ProtectedRoute>
                <AdminContent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/services" 
            element={
              <ProtectedRoute>
                <AdminServices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/testimonials" 
            element={
              <ProtectedRoute>
                <AdminTestimonials />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/stats" 
            element={
              <ProtectedRoute>
                <AdminStats />
              </ProtectedRoute>
            } 
          />

          {/* مسارات الموقع العام */}
          <Route 
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/about" 
            element={
              <>
                <Header />
                <About />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/services" 
            element={
              <>
                <Header />
                <Services />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <>
                <Header />
                <Projects />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/projects/:id" 
            element={
              <>
                <Header />
                <ProjectDetails />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/testimonials" 
            element={
              <>
                <Header />
                <Testimonials />
                <Footer />
                <Analytics />
              </>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <>
                <Header />
                <Contact />
                <Footer />
                <Analytics />
              </>
            } 
          />

          {/* مسارات إضافية */}
          <Route 
            path="/404" 
            element={
              <>
                <Header />
                <NotFound />
                <Footer />
              </>
            } 
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;