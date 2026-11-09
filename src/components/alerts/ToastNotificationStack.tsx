import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Package, 
  Clock, 
  X, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { AlertNotification } from '../../types';
import { Language } from '../../utils/translations';

interface ToastNotificationStackProps {
  toasts: AlertNotification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onNavigateToApp?: (appId: string) => void;
  lang: Language;
}

export const ToastNotificationStack: React.FC<ToastNotificationStackProps> = ({
  toasts,
  onDismiss,
  onDismissAll,
  onNavigateToApp,
  lang
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-14 end-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header if multiple alerts */}
      {toasts.length > 1 && (
        <div className="pointer-events-auto flex items-center justify-between bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs border border-slate-700/60 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>
              {lang === 'ar' 
                ? `تنبيهات ذكية نشطة (${toasts.length})` 
                : `Alertes Intelligentes Actives (${toasts.length})`}
            </span>
          </div>
          <button
            onClick={onDismissAll}
            className="text-slate-300 hover:text-white underline text-[10px] transition-colors"
          >
            {lang === 'ar' ? 'إخفاء الكل' : 'Tout masquer'}
          </button>
        </div>
      )}

      {/* Stack of toasts */}
      {toasts.map((toast) => {
        const isCritical = toast.severity === 'critical';
        const isBatch = toast.type === 'batch_expiring';
        const isBag = toast.type === 'bag_stock_low';

        return (
          <div
            key={toast.id}
            onMouseEnter={() => setHoveredId(toast.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`pointer-events-auto group relative overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              isCritical
                ? 'bg-rose-950/95 text-white border-rose-500/80 shadow-rose-950/40'
                : 'bg-amber-950/95 text-white border-amber-500/80 shadow-amber-950/40'
            }`}
          >
            {/* Top Accent Line */}
            <div className={`absolute top-0 inset-x-0 h-1 ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`p-2 rounded-lg shrink-0 ${
                isCritical 
                  ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40' 
                  : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
              }`}>
                {isBatch ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : isBag ? (
                  <Package className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold leading-tight truncate">
                    {lang === 'ar' ? toast.titleAr : toast.titleFr}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-300 shrink-0">
                    {toast.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {lang === 'ar' ? toast.messageAr : toast.messageFr}
                </p>

                {/* Key Metric Pill */}
                {toast.details && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-black/40 text-amber-200 border border-white/10">
                      <span>المؤشر:</span>
                      <span className="text-white">
                        {toast.details.currentValue?.toLocaleString()} {toast.details.unit}
                      </span>
                      {toast.details.thresholdValue && (
                        <span className="text-slate-400">
                          (الحد: {toast.details.thresholdValue?.toLocaleString()})
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {/* Action CTA & Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                  {toast.targetAppId && onNavigateToApp ? (
                    <button
                      onClick={() => {
                        onNavigateToApp(toast.targetAppId!);
                        onDismiss(toast.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      <span>{lang === 'ar' ? toast.actionLabelAr || 'الانتقال للقسم' : toast.actionLabelFr || 'Afficher'}</span>
                      {lang === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Fermer'}
                  </button>
                </div>
              </div>

              {/* Close Button Top-Corner */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors shrink-0 -mt-1 -me-1"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
