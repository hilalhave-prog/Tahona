import React from 'react';
import { Check, Printer, XCircle } from 'lucide-react';
import { OdooStage } from '../../types';
import { Language, translations } from '../../utils/translations';

interface OdooStatusBarProps {
  currentStage: OdooStage;
  onStageChange: (stage: OdooStage) => void;
  onConfirm?: () => void;
  onPrint?: () => void;
  onCancel?: () => void;
  lang: Language;
}

export const OdooStatusBar: React.FC<OdooStatusBarProps> = ({
  currentStage,
  onStageChange,
  onConfirm,
  onPrint,
  onCancel,
  lang
}) => {
  const t = translations[lang];

  const stages: { id: OdooStage; labelAr: string; labelFr: string }[] = [
    { id: 'draft', labelAr: 'مسودة', labelFr: 'Brouillon' },
    { id: 'confirmed', labelAr: 'مؤكد', labelFr: 'Confirmé' },
    { id: 'in_progress', labelAr: 'قيد التنفيذ', labelFr: 'En cours' },
    { id: 'done', labelAr: 'تم الإنجاز', labelFr: 'Fait' }
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 sm:px-4 rounded-t-xl border-b border-slate-200 dark:border-slate-700">
      {/* Left: Quick Form Action Buttons */}
      <div className="flex items-center gap-2">
        {onConfirm && currentStage !== 'done' && (
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-[#008784] hover:bg-[#00706d] dark:bg-emerald-600 rounded transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>تأكيد (Confirmer)</span>
          </button>
        )}

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.print}</span>
          </button>
        )}

        {onCancel && currentStage !== 'cancelled' && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
          >
            <span>{t.cancel}</span>
          </button>
        )}
      </div>

      {/* Right: Odoo Arrow Status Bar Stages */}
      <div className="flex items-center text-xs overflow-x-auto">
        {stages.map((stage, idx) => {
          const isCurrent = stage.id === currentStage;
          const isPassed = currentStageIndex > idx;

          return (
            <div
              key={stage.id}
              onClick={() => onStageChange(stage.id)}
              className={`relative px-3 py-1 cursor-pointer font-semibold transition-colors flex items-center whitespace-nowrap ${
                isCurrent
                  ? 'bg-[#714B67] text-white font-bold rounded shadow-xs'
                  : isPassed
                  ? 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{lang === 'ar' ? stage.labelAr : stage.labelFr}</span>
              {idx < stages.length - 1 && (
                <span className="ms-2 text-slate-300 dark:text-slate-600">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
