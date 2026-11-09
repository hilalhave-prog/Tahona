import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  Clock, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  Sparkles,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { AlertNotification } from '../../types';
import { Language } from '../../utils/translations';

interface NotificationDropdownProps {
  alerts: AlertNotification[];
  onDismissAlert: (id: string) => void;
  onClearAll: () => void;
  onNavigateToApp: (appId: string) => void;
  onTriggerSimulatedAlert: (type: 'bag_stock_low' | 'batch_expiring') => void;
  lang: Language;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  alerts,
  onDismissAlert,
  onClearAll,
  onNavigateToApp,
  onTriggerSimulatedAlert,
  lang
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'bags' | 'batches'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'bags') return a.type === 'bag_stock_low';
    if (activeFilter === 'batches') return a.type === 'batch_expiring';
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-1.5 rounded transition-colors text-white hover:bg-white/15 ${
          isOpen ? 'bg-white/20' : ''
        }`}
        title={lang === 'ar' ? 'التنبيهات الذكية والإشعارات' : 'Alertes Intelligentes'}
        aria-label="Smart Alerts Bell"
      >
        <Bell className="w-4 h-4" />
        {alerts.length > 0 && (
          <span className={`absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-mono font-bold text-white rounded-full shadow-md animate-pulse ${
            criticalCount > 0 ? 'bg-rose-600' : 'bg-amber-500'
          }`}>
            {alerts.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute end-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-2"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="p-3.5 bg-[#714B67] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold">
                {lang === 'ar' ? 'مركز التنبيهات الذكية' : 'Centre d\'Alertes Intelligentes'}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20">
                {alerts.length}
              </span>
            </div>

            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-white/80 hover:text-white underline transition-colors"
              >
                {lang === 'ar' ? 'مسح الكل' : 'Tout effacer'}
              </button>
            )}
          </div>

          {/* Simulation & Testing Bar */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {lang === 'ar' ? 'تجربة المحاكاة:' : 'Simulations:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onTriggerSimulatedAlert('bag_stock_low')}
                className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-200 transition-colors text-[10px]"
                title="إنشاء تنبيه فوري لانخفاض مخزون أكياس الفرينة"
              >
                + نقص أكياس
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('batch_expiring')}
                className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold hover:bg-rose-200 transition-colors text-[10px]"
                title="إنشاء تنبيه فوري لاقتراب انتهاء صلاحية دفعة"
              >
                + انتهاء دفعة
              </button>
            </div>
          </div>

          {/* Filter subtabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2 text-center font-semibold transition-colors border-b-2 ${
                activeFilter === 'all'
                  ? 'border-[#714B67] text-[#714B67] dark:text-amber-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'Tous'} ({alerts.length})
            </button>
            <button
              onClick={() => setActiveFilter('bags')}
              className={`flex-1 py-2 text-center font-semibold transition-colors border-b-2 ${
                activeFilter === 'bags'
                  ? 'border-[#714B67] text-[#714B67] dark:text-amber-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'مخزون الأكياس' : 'Sacs'}
            </button>
            <button
              onClick={() => setActiveFilter('batches')}
              className={`flex-1 py-2 text-center font-semibold transition-colors border-b-2 ${
                activeFilter === 'batches'
                  ? 'border-[#714B67] text-[#714B67] dark:text-amber-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'صلاحية الدفعات' : 'DLC Lots'}
            </button>
          </div>

          {/* List of Alerts */}
          <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-80 text-xs">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-80" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? 'لا توجد تنبيهات نشطة حالياً' : 'Aucune alerte active'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' 
                    ? 'كافة أرصدة الأكياس تفوق الحد الأدنى ولا توجد دفعات قريبة الانتهاء.'
                    : 'Les stocks de sacs sont nominaux et aucun lot ne périme prochainement.'}
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isBatch = alert.type === 'batch_expiring';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors space-y-1.5 ${
                      isCritical ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isBatch ? (
                          <Clock className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
                        ) : (
                          <Package className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
                        )}
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                          {lang === 'ar' ? alert.titleAr : alert.titleFr}
                        </h4>
                      </div>
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                        title={lang === 'ar' ? 'إخفاء' : 'Fermer'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'ar' ? alert.messageAr : alert.messageFr}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {alert.timestamp}
                      </span>

                      {alert.targetAppId && (
                        <button
                          onClick={() => {
                            onNavigateToApp(alert.targetAppId!);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-bold text-[#714B67] dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>{lang === 'ar' ? alert.actionLabelAr || 'الانتقال' : alert.actionLabelFr || 'Voir'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
            {lang === 'ar'
              ? 'مراقبة آلية لحظية لمخزون الأكياس وتواريخ الصلاحية وفق اللوائح الجزائرية'
              : 'Surveillance automatique des stocks de sacs et DLC réglementaires'}
          </div>
        </div>
      )}
    </div>
  );
};
