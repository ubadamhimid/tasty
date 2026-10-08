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
  Users,
  Settings,
  LogOut,
  Database,
  Menu,
  X,
  Sparkles,
  Crown,
  RefreshCw
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { logout, user, isAdmin } = useAdminAuth();
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncInfo, setSyncInfo] = useState(StorageService.getSyncInfo());
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    StorageService.initServerSync();

    const updateSyncStatus = () => {
      setSyncInfo(StorageService.getSyncInfo());
    };

    const unsubscribe = StorageService.subscribe(updateSyncStatus);
    updateSyncStatus();

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        StorageService.initServerSync();
      }
    };
    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    // Live continuous sync every 8 seconds so phones and laptops see changes instantly
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        StorageService.initServerSync();
      }
    }, 8000);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await StorageService.initServerSync();
    setSyncInfo(StorageService.getSyncInfo());
    setIsManualSyncing(false);
  };

  const handleLogout = () => {
    if (window.confirm('هل تود تسجيل الخروج من لوحة التحكم؟')) {
      logout();
      navigate('/admin/login');
    }
  };

  const allNavItems = [
    {
      to: '/admin',
      label: 'الإحصائيات العامة',
      shortLabel: 'الإحصائيات',
      icon: LayoutDashboard,
      exact: true,
      adminOnly: true,
    },
    {
      to: '/admin/sales',
      label: 'تسجيل مبيعات اليوم',
      shortLabel: 'المبيعات',
      icon: Receipt,
    },
    {
      to: '/admin/employees',
      label: 'الموظفون والورديات',
      shortLabel: 'الموظفون',
      icon: Users,
    },
    {
      to: '/admin/orders',
      label: 'طلبيات الشراء',
      shortLabel: 'المشتريات',
      icon: ShoppingBag,
    },
    {
      to: '/admin/debts',
      label: 'سجل الديون والدفعات',
      shortLabel: 'الديون',
      icon: Scale,
    },
    {
      to: '/admin/settings',
      label: 'الإعدادات والبيانات',
      shortLabel: 'الإعدادات',
      icon: Settings,
      adminOnly: true,
    },
  ];

  // Filter tabs: Managers cannot see admin-only tabs (Statistics & Settings)
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-tasty-charcoal flex flex-col font-cairo selection:bg-tasty-teal selection:text-white" dir="rtl">
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tasty-teal/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <NavLink to={isAdmin ? "/admin" : "/admin/sales"} className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <img 
                src="/images/logo.webp" 
                alt="TASTY Levantine Flavours" 
                className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/20 whitespace-nowrap shrink-0">
                لوحة الإدارة
              </span>
              <p className="text-[10px] text-gray-400 hidden md:block whitespace-nowrap">Hilversum • Groest 50</p>
            </NavLink>
          </div>

          {/* Live Server Sync Badge, Role & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Realtime Server Indicator Badge */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                syncInfo.status === 'synced'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : syncInfo.status === 'syncing'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                  : 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
              }`}
              title={
                syncInfo.status === 'synced'
                  ? `متصل ومحدث بالسيرفر المركزي (${syncInfo.lastSyncedTime || 'الآن'})`
                  : syncInfo.status === 'syncing'
                  ? 'جاري مزامنة أحدث البيانات من السيرفر...'
                  : 'جاري محاولة الاتصال بالسيرفر المركزي'
              }
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                syncInfo.status === 'synced'
                  ? 'bg-emerald-500 ring-2 ring-emerald-300'
                  : syncInfo.status === 'syncing'
                  ? 'bg-blue-500 animate-ping'
                  : 'bg-amber-500 ring-2 ring-amber-300'
              }`} />
              <span className="hidden sm:inline">
                {syncInfo.status === 'synced'
                  ? 'سيرفر موحد'
                  : syncInfo.status === 'syncing'
                  ? 'مزامنة...'
                  : 'مزامنة محلية'}
              </span>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isManualSyncing}
                className="p-1 hover:bg-black/5 rounded-md transition-transform active:scale-90 text-inherit"
                title="تحديث البيانات فوراً من السيرفر"
                aria-label="تحديث من السيرفر"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isAdmin && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs whitespace-nowrap">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>المدير العام</span>
              </span>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-2xs whitespace-nowrap shrink-0"
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
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
              className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all text-center ${
                isActive ? 'text-tasty-teal' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div className={`p-1 sm:p-1.5 rounded-xl transition-colors ${isActive ? 'bg-tasty-teal-light text-tasty-teal-dark' : ''}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="mt-0.5 whitespace-nowrap leading-tight text-[10px] sm:text-[11px] font-semibold">{item.shortLabel || item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Backup Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

    </div>
  );
};
