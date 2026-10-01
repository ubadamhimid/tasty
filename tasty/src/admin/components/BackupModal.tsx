import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Download, Upload, RefreshCw, X, Check, AlertCircle, Copy, FileText, Trash2 } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    StorageService.downloadBackupJSON();
    setStatusMessage({ type: 'success', text: 'تم تنزيل ملف النسخة الاحتياطية بنجاح!' });
  };

  const handleCopyJSON = () => {
    const json = StorageService.exportBackup();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setStatusMessage({ type: 'success', text: 'تم نسخ نص البيانات (JSON) إلى الحافظة بنجاح.' });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImportText = () => {
    if (!importText.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى لصق كود JSON للنسخة الاحتياطية أولاً.' });
      return;
    }
    const res = StorageService.importBackup(importText.trim());
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setImportText('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
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
          setStatusMessage({ type: 'success', text: 'تم استيراد الملف بنجاح وتحديث كافة البيانات!' });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setStatusMessage({ type: 'error', text: res.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط البيانات إلى النماذج التجريبية الأولية؟ سيتم مسح أي تعديلات يدوية لم تُحفظ في نسخة احتياطية.')) {
      StorageService.resetToDemoData();
      setStatusMessage({ type: 'success', text: 'تمت استعادة البيانات الافتراضية بنجاح!' });
      setTimeout(() => onClose(), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-tasty-teal/20 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tasty-teal-light flex items-center justify-center text-tasty-teal">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cairo font-bold text-lg text-tasty-charcoal">إدارة النسخ الاحتياطي للبيانات</h3>
              <p className="text-xs text-gray-500">تصدير واستيراد كافة بيانات المحل (طلبيات، مبيعات، ديون، كتالوج)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Export Section */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">تصدير البيانات وحفظها (Export)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-tasty-teal hover:bg-tasty-teal-dark text-white rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف JSON</span>
            </button>
            <button
              onClick={handleCopyJSON}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-tasty-charcoal rounded-xl font-medium text-sm transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ كود JSON'}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">استرجاع أو استيراد البيانات (Import)</h4>
          
          {/* File input */}
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 hover:border-tasty-teal/50 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-tasty-teal-light/20 transition-all">
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <Upload className="w-6 h-6 text-tasty-teal mb-1" />
              <p className="text-xs text-gray-600 font-medium">اضغط لاختيار ملف <span className="font-semibold text-tasty-teal">.JSON</span> من جهازك</p>
              <p className="text-[10px] text-gray-400">سيتم استبدال البيانات الحالية بالملف المستورد</p>
            </div>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Paste JSON */}
          <div className="space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="أو الصق محتوى ملف JSON هنا مباشرة..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tasty-teal focus:ring-1 focus:ring-tasty-teal font-mono bg-gray-50 resize-none"
            />
            {importText.trim().length > 0 && (
              <button
                onClick={handleImportText}
                className="w-full py-2 bg-tasty-charcoal hover:bg-black text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                تطبيق البيانات الملصقة الآن
              </button>
            )}
          </div>
        </div>

        {/* Reset & Clear to Clean Slate */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-gray-700">التحكم في بيانات النظام</p>
            <p className="text-[11px] text-gray-400">تصفير السجلات لبدء الإدخال الفعلي أو شحن عينة</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('هل تود مسح وتصفير كافة سجلات المبيعات والديون والطلبيات والبدء بسجلات فارغة؟')) {
                  StorageService.clearAllTransactionData();
                  setStatusMessage({ type: 'success', text: 'تم تفريغ السجلات بنجاح (الأرصدة €0)!' });
                  setTimeout(() => onClose(), 1200);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors border border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تصفير ومسح السجلات</span>
            </button>
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors border border-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>عينة تجريبية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
