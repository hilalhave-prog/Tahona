import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Printer, 
  Check, 
  Layers, 
  Database, 
  FlaskConical, 
  Package, 
  FileText, 
  Clock 
} from 'lucide-react';
import { OdooStage } from '../../types';
import { OdooStatusBar } from './OdooStatusBar';
import { OdooChatter } from './OdooChatter';
import { Language, translations, formatCurrency } from '../../utils/translations';

interface OdooFormViewProps {
  title: string;
  subtitle?: string;
  code: string;
  currentStage: OdooStage;
  onStageChange: (stage: OdooStage) => void;
  onBack: () => void;
  onPrint?: () => void;
  onConfirm?: () => void;
  smartButtons?: {
    icon: any;
    label: string;
    value: string;
    onClick?: () => void;
  }[];
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  headerFields?: {
    label: string;
    value: React.ReactNode;
  }[];
  documentId: string;
  documentType: string;
  lang: Language;
}

export const OdooFormView: React.FC<OdooFormViewProps> = ({
  title,
  subtitle,
  code,
  currentStage,
  onStageChange,
  onBack,
  onPrint,
  onConfirm,
  smartButtons = [],
  tabs,
  headerFields = [],
  documentId,
  documentType,
  lang
}) => {
  const t = translations[lang];
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
      {/* Odoo Status Bar & Pipeline */}
      <OdooStatusBar
        currentStage={currentStage}
        onStageChange={onStageChange}
        onConfirm={onConfirm}
        onPrint={onPrint}
        lang={lang}
      />

      {/* Main Odoo Sheet */}
      <div className="p-4 sm:p-8 space-y-6">
        {/* Top: Back Link & Smart Stat Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#714B67] dark:hover:text-amber-400 mb-2 transition-colors"
            >
              {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{lang === 'ar' ? 'العودة إلى القائمة' : 'Retour à la liste'}</span>
            </button>

            <span className="text-xs font-bold font-mono text-[#714B67] dark:text-amber-400">
              {code}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Odoo Smart Buttons */}
          {smartButtons.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {smartButtons.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={btn.onClick}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-start transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#714B67] dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{btn.label}</span>
                      <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{btn.value}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Header Fields Grid (Odoo 2-column sheet style) */}
        {headerFields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {headerFields.map((field, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="font-semibold text-slate-500">{field.label}:</span>
                <span className="font-medium text-slate-900 dark:text-white text-end">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Odoo Notebook Tabs */}
        {tabs.length > 0 && (
          <div className="pt-4">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`pb-2 transition-colors relative ${
                    activeTabId === tab.id
                      ? 'text-[#714B67] dark:text-amber-400 border-b-2 border-[#714B67] dark:border-amber-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-4">
              {tabs.find((t) => t.id === activeTabId)?.content}
            </div>
          </div>
        )}
      </div>

      {/* Odoo Chatter */}
      <OdooChatter
        documentId={documentId}
        documentType={documentType}
        lang={lang}
      />
    </div>
  );
};
