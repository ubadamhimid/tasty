import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (result.success) {
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4 relative overflow-hidden font-cairo selection:bg-tasty-teal selection:text-white" dir="rtl">
      
      {/* Background Decorative Ambient Blurs */}
      <div className="absolute top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-tasty-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-tasty-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Real Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <img 
              src="/images/logo.webp" 
              alt="TASTY Levantine Flavours Hilversum" 
              className="h-20 sm:h-24 w-auto object-contain mx-auto mb-2 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <p className="text-xs text-tasty-charcoal-muted font-medium">
            بوابة تسجيل الدخول للوحة التحكم الإدارية والعمليات
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-tasty-charcoal/5 border border-tasty-teal/15">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="font-cairo font-bold text-lg text-tasty-charcoal">تسجيل الدخول</h2>
              <p className="text-xs text-gray-400">أدخل بيانات المسؤول للوصول للوحة التحكم</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-tasty-teal-light text-tasty-teal border border-tasty-teal/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="اسم المستخدم..."
                  required
                  autoFocus
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/15 text-sm transition-all bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal focus:ring-2 focus:ring-tasty-teal/15 text-sm transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-tasty-teal to-tasty-teal-dark hover:from-tasty-teal-dark hover:to-tasty-teal text-white font-bold text-sm shadow-md shadow-tasty-teal/25 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
            </button>
          </form>

          {/* Back to public site */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-tasty-teal transition-colors"
            >
              <span>العودة إلى موقع وقائمة طعام Tasty</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          نظام محمي لإدارة مطعم Tasty Hilversum • Leeuwenstraat 14
        </p>

      </div>
    </div>
  );
};
