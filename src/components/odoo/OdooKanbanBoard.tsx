import React from 'react';
import { Database, Scale, Cog, Store, ArrowUpRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Language, translations, formatCurrency } from '../../utils/translations';

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  code: string;
  stage: string;
  metricLabel: string;
  metricValue: string;
  secondaryMetric?: string;
  tag?: string;
  tagColor?: string;
  date?: string;
  rawItem: any;
}

interface OdooKanbanBoardProps {
  items: KanbanItem[];
  onItemClick: (item: KanbanItem) => void;
  lang: Language;
}

export const OdooKanbanBoard: React.FC<OdooKanbanBoardProps> = ({
  items,
  onItemClick,
  lang
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick(item)}
          className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md hover:border-[#714B67] dark:hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between group"
        >
          {/* Top header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-[#714B67] dark:text-amber-400">
                {item.code}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {item.date}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#714B67] dark:group-hover:text-amber-400 transition-colors">
              {item.title}
            </h4>

            {item.subtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {item.subtitle}
              </p>
            )}

            {item.tag && (
              <div className="mt-2">
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.tag}
                </span>
              </div>
            )}
          </div>

          {/* Metric and Footer */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">{item.metricLabel}</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                {item.metricValue}
              </span>
            </div>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              {item.stage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
