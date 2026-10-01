import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { BackupModal } from './BackupModal';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Scale,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  Menu,
  X,
  Bell,
  Sparkles,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { credentials, logout } = useAdminAuth();
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncInfo, setSyncInfo] = useState(StorageService.getSyncInfo());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    StorageService.initServerSync();
    const unsubscribe = StorageService.subscribe(() => {
      setSyncInfo(StorageService.getSyncInfo());
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    if (window.confirm('هل تود تسجيل الخروج من لوحة التحكم؟')) {
      logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    {
      to: '/admin',
      label: 'نظرة عامة',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/admin/orders',
      label: 'طلبيات الشراء',
      icon: ShoppingBag,
    },
    {
      to: '/admin/sales',
      label: 'تقفيل المبيعات',
      icon: Receipt,
    },
    {
      to: '/admin/debts',
      label: 'سجل الديون',
      icon: Scale,
    },
    {
      to: '/admin/settings',
      label: 'الإعدادات والبيانات',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-tasty-charcoal flex flex-col font-cairo selection:bg-tasty-teal selection:text-white" dir="rtl">
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tasty-teal/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <NavLink to="/admin" className="flex items-center gap-3 group">
              <img 
                src="/images/logo.webp" 
                alt="TASTY Levantine Flavours" 
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/20">
                    لوحة الإدارة
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 hidden sm:block">Hilversum • Leeuwenstraat 14</p>
              </div>
            </NavLink>
          </div>

          {/* Quick Actions (Right side in RTL) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Server Sync Status Badge */}
            <button
              onClick={() => StorageService.triggerManualSync()}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                syncInfo.status === 'synced'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : syncInfo.status === 'syncing'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title={
                syncInfo.status === 'synced'
                  ? `البيانات متصلة ومحفوظة على السيرفر (${syncInfo.lastSyncedTime || 'الآن'}) - اضغط لتحديث الاتصال`
                  : syncInfo.status === 'syncing'
                  ? 'جاري حفظ ومزامنة البيانات على السيرفر...'
                  : 'محفوظ في ذاكرة المتصفح - اضغط للمزامنة مع السيرفر'
              }
            >
              {syncInfo.status === 'synced' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">محفوظ على السيرفر</span>
                </>
              ) : syncInfo.status === 'syncing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span className="hidden sm:inline">جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">محفوظ محلياً</span>
                </>
              )}
            </button>

            {/* Backup & Restore Button */}
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-tasty-teal hover:bg-tasty-teal-light/20 text-xs font-semibold text-tasty-charcoal transition-all shadow-xs"
              title="تصدير واستيراد نسخة احتياطية"
            >
              <Database className="w-3.5 h-3.5 text-tasty-teal" />
              <span>النسخ الاحتياطي</span>
            </button>

            {/* Visit Public Menu */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tasty-bg-warm hover:bg-amber-100/60 border border-amber-200/60 text-xs font-semibold text-amber-900 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden xs:inline">المنيو العام</span>
            </a>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-tasty-charcoal leading-none">{credentials.username}</span>
                <span className="text-[10px] text-emerald-600 font-medium">نشط الآن</span>
              </div>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-3xl p-4 shadow-sm border border-gray-100/80 space-y-1">
            
            <div className="px-3 py-2 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">إدارة العمليات اليومية</p>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-l from-tasty-teal to-tasty-teal-dark text-white shadow-md shadow-tasty-teal/20 translate-x-1'
                      : 'text-gray-600 hover:text-tasty-charcoal hover:bg-tasty-bg-warm'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-tasty-teal'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Quick Summary Card in Sidebar */}
            <div className="mt-8 pt-4 border-t border-gray-100 px-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-tasty-teal-light to-white border border-tasty-teal/20 text-xs">
                <div className="flex items-center gap-1.5 text-tasty-teal-dark font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tasty Hilversum</span>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  نظام محلي متكامل للطلبيات، المبيعات وسجل الديون بدون الحاجة لاتصال خارجي.
                </p>
                <button
                  onClick={() => setIsBackupOpen(true)}
                  className="mt-3 w-full py-1.5 bg-white hover:bg-tasty-teal hover:text-white text-tasty-teal-dark border border-tasty-teal/30 rounded-xl font-bold text-[11px] transition-all shadow-2xs"
                >
                  حفظ نسخة احتياطية
                </button>
              </div>
            </div>

          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs flex" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/images/logo.webp" alt="TASTY" className="h-8 w-auto object-contain" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/20">
                      لوحة الإدارة
                    </span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? location.pathname === item.to 
                      : location.pathname.startsWith(item.to);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-tasty-teal text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBackupOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                >
                  <Database className="w-4 h-4 text-tasty-teal" />
                  <span>النسخ الاحتياطي (JSON)</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-6">
          <Outlet />
        </main>

      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-tasty-teal' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-tasty-teal-light' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5 truncate max-w-[64px]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Backup Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

    </div>
  );
};
