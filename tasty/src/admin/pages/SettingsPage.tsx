import React, { useState } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import {
  Settings,
  Lock,
  User,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Database,
  Trash2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { credentials, updateCredentials } = useAdminAuth();

  // Credentials change state
  const [username, setUsername] = useState(credentials.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Backup state
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [jsonText, setJsonText] = useState('');

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setCredMessage(null);

    if (currentPassword !== credentials.passwordHash) {
      setCredMessage({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
      return;
    }

    if (newPassword.length < 4) {
      setCredMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف/أرقام على الأقل' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredMessage({ type: 'error', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' });
      return;
    }

    const res = updateCredentials(username, newPassword);
    if (res.success) {
      setCredMessage({ type: 'success', text: 'تم تحديث بيانات الحساب بنجاح!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setCredMessage({ type: 'error', text: res.error || 'فشل التحديث' });
    }
  };

  const handleDownloadBackup = () => {
    StorageService.downloadBackupJSON();
    setBackupMessage({ type: 'success', text: 'تم تنزيل ملف النسخة الاحتياطية بنجاح!' });
  };

  const handleImportText = () => {
    if (!jsonText.trim()) {
      setBackupMessage({ type: 'error', text: 'يرجى لصق كود JSON أولاً' });
      return;
    }
    const res = StorageService.importBackup(jsonText.trim());
    if (res.success) {
      setBackupMessage({ type: 'success', text: res.message });
      setJsonText('');
    } else {
      setBackupMessage({ type: 'error', text: res.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = StorageService.importBackup(content);
        if (res.success) {
          setBackupMessage({ type: 'success', text: 'تم استيراد الملف وتحديث كافة السجلات بنجاح!' });
        } else {
          setBackupMessage({ type: 'error', text: res.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('هل أنت متأكد من استعادة البيانات التجريبية الأولية؟ سيتم مسح أي سجلات غير محفوظة في ملف نسخة احتياطية.')) {
      StorageService.resetToDemoData();
      setBackupMessage({ type: 'success', text: 'تمت استعادة البيانات التجريبية بنجاح!' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark">
            الإعدادات والأمان
          </span>
        </div>
        <h1 className="font-serif font-black text-xl sm:text-2xl text-tasty-charcoal">
          إعدادات النظام والبيانات
        </h1>
        <p className="text-xs text-gray-500">
          تغيير بيانات الدخول، إدارة ملفات النسخ الاحتياطي، ومعلومات المطعم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Credentials Form */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-tasty-teal-light text-tasty-teal flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cairo font-bold text-base text-tasty-charcoal">حساب المسؤول</h2>
              <p className="text-xs text-gray-400">تعديل اسم المستخدم وكلمة المرور الخاصة بلوحة الإدارة</p>
            </div>
          </div>

          {credMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                credMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {credMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{credMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCreds} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم المستخدم</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">كلمة المرور الحالية</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية للتحقق"
                  required
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="4 أحرف/أرقام على الأقل"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة الجديدة"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-tasty-teal hover:bg-tasty-teal-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              تحديث بيانات الدخول
            </button>
          </form>
        </div>

        {/* Data Backup & Restore */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cairo font-bold text-base text-tasty-charcoal">النسخ الاحتياطي ونقل البيانات</h2>
              <p className="text-xs text-gray-400">تصدير قاعدة البيانات محلياً كملف JSON لضمان عدم ضياع أي سجل</p>
            </div>
          </div>

          {backupMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                backupMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {backupMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{backupMessage.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-tasty-charcoal hover:bg-black text-white text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تحميل نسخة احتياطية كاملة (JSON Download)</span>
            </button>

            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-tasty-teal hover:bg-tasty-teal-light/20 text-gray-700 text-xs font-bold cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-tasty-teal" />
              <span>استيراد واسترجاع من ملف JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Paste JSON */}
          <div className="pt-2">
            <textarea
              rows={2}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="أو الصق كود JSON للنسخة الاحتياطية هنا..."
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal bg-gray-50 font-mono resize-none"
            />
            {jsonText.trim().length > 0 && (
              <button
                onClick={handleImportText}
                className="mt-1.5 w-full py-2 bg-tasty-teal hover:bg-tasty-teal-dark text-white rounded-xl text-xs font-bold"
              >
                تطبيق النص الملصق
              </button>
            )}
          </div>

          {/* Reset & Clear buttons */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <span className="text-xs text-gray-500 font-medium">التحكم في سجلات النظام:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل تود تصفير ومسح كافة سجلات المبيعات والديون والطلبيات؟ ستصبح جميع الأرصدة €0.')) {
                    StorageService.clearAllTransactionData();
                    setBackupMessage({ type: 'success', text: 'تم تفريغ وتصفير كافة السجلات بنجاح (الأرصدة الحالية €0)!' });
                  }
                }}
                className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تصفير ومسح السجلات</span>
              </button>

              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحميل عينة تجريبية</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Restaurant Info Summary Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
        <h3 className="font-cairo font-bold text-base text-tasty-charcoal mb-3">
          معلومات الفرع والمطعم (Tasty Hilversum)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-tasty-charcoal">
              <MapPin className="w-4 h-4 text-tasty-teal" />
              <span>العنوان والموقع:</span>
            </div>
            <p>Leeuwenstraat 14, 1211 MD Hilversum</p>
            <p className="text-gray-400">هولندا • شمال هولندا</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-tasty-charcoal">
              <Phone className="w-4 h-4 text-tasty-teal" />
              <span>هاتف الطلبات والتواصل:</span>
            </div>
            <p dir="ltr" className="text-right font-mono font-bold">035 204 2001</p>
            <p className="text-gray-400">واتساب ومكالمات مباشرة</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-tasty-bg-warm border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-tasty-charcoal">
              <Clock className="w-4 h-4 text-tasty-teal" />
              <span>ساعات العمل الرسمية:</span>
            </div>
            <p>الاثنين - الخميس: 12:00 - 22:00</p>
            <p>الجمعة - السبت: 12:00 - 23:00</p>
            <p>الأحد: 13:00 - 22:00</p>
          </div>
        </div>
      </div>

    </div>
  );
};
