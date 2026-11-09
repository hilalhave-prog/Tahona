import React from 'react';
import { Cog, Plus, Wrench, Zap, CheckCircle2, AlertTriangle, Layers, Clock, TrendingUp } from 'lucide-react';
import { ProductionBatch, MaintenanceTask, Silo } from '../../types';
import { Language, translations, formatWeightQx } from '../../utils/translations';

interface MillingProductionViewProps {
  batches: ProductionBatch[];
  maintenance: MaintenanceTask[];
  silos: Silo[];
  onOpenNewBatch: () => void;
  onOpenNewMaintenance?: () => void;
  lang: Language;
}

export const MillingProductionView: React.FC<MillingProductionViewProps> = ({
  batches,
  maintenance,
  silos,
  onOpenNewBatch,
  onOpenNewMaintenance,
  lang
}) => {
  const t = translations[lang];

  const totalGrainCrushedQx = batches.reduce((acc, curr) => acc + curr.grainProcessedQx, 0);
  const avgExtractionRate = batches.length > 0 
    ? (batches.reduce((acc, curr) => acc + curr.extractionRatePercent, 0) / batches.length).toFixed(1)
    : '78.0';

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'قسم الطحن والإنتاج (Mouture & Transformation)' : 'Lignes de Mouture & Production Industrielle'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'متابعة خطوط سحق القمح اللين (الفرينة) والقمح الصلب (السميد)، مراقبة نسب الاستخراج الميكانيكية، وصيانة أسطوانات الطحن.'
              : 'Pilotage des moulins à blé dur et tendre, calcul des taux d\'extraction réels et maintenance des cylindres de broyage.'}
          </p>
        </div>

        <button
          onClick={onOpenNewBatch}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewBatch}</span>
        </button>
      </div>

      {/* Production KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'إجمالي الحبوب المسحوقة المسجلة' : 'Total Grains Écrasés'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(totalGrainCrushedQx, lang)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {(totalGrainCrushedQx / 10).toFixed(1)} طن من القمح اللين والصلب
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'متوسط معدل الاستخراج العام' : 'Taux d\'Extraction Moyen'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
            {avgExtractionRate} %
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            معيار الإنتاج الوطني المعتمد لدى OAIC: 78% للفرينة
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'استهلاك الطاقة النوعي' : 'Ratio Énergie Spécifique'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            11.8 kWh/Qx
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ضمن المعايير الطاقوية المثالية لآلات الطحن السويسرية
          </p>
        </div>
      </div>

      {/* Production Batches Log */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            {lang === 'ar' ? 'سجل ورديات الطحن اليومية ومخرجات المنتجات' : 'Historique des Équipes de Mouture'}
          </h3>
          <span className="text-[11px] text-slate-500">نظام الوردية الثلاثية (3x8)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-3 text-start font-semibold">رقم الدفعة</th>
                <th className="p-3 text-start font-semibold">التاريخ</th>
                <th className="p-3 text-start font-semibold">الوردية</th>
                <th className="p-3 text-start font-semibold">الخط الصناعي</th>
                <th className="p-3 text-end font-semibold">المسحوق (ق)</th>
                <th className="p-3 text-start font-semibold">المنتجات المستخرجة (أكياس)</th>
                <th className="p-3 text-center font-semibold">مردودية %</th>
                <th className="p-3 text-start font-semibold">المشرف / كبير الطحانين</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {batches.map((batch) => {
                const currentDate = new Date('2026-11-08');
                const isExpiringSoon = batch.expiryDate && (
                  (new Date(batch.expiryDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
                );
                const daysRemaining = batch.expiryDate ? Math.ceil(
                  (new Date(batch.expiryDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
                ) : null;

                return (
                  <tr key={batch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-700 dark:text-amber-400">
                        {batch.batchNumber}
                      </div>
                      {batch.expiryDate && (
                        <div className="mt-0.5">
                          {isExpiringSoon ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                              ⏳ صلاحية: {daysRemaining} يوماً ({batch.expiryDate})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              صلاحية: {batch.expiryDate}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  <td className="p-3 text-slate-500 font-mono">
                    {batch.date}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {batch.shift === 'morning' ? 'الصباح (06-14 سا)' : batch.shift === 'evening' ? 'المساء (14-22 سا)' : 'الليل (22-06 سا)'}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                    {batch.lineId === 'minoterie_tendre' ? 'مطحنة الفرينة (Blé Tendre)' : 'مطحنة السميد (Blé Dur)'}
                  </td>
                  <td className="p-3 text-end font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {batch.grainProcessedQx} ق
                  </td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      {batch.outputs.map((out, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{out.packageType}:</span>{' '}
                          <span className="font-mono tabular-nums font-bold text-amber-700 dark:text-amber-400">{out.bagsCount} كيس</span> ({out.quantityQx} ق)
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {batch.extractionRatePercent.toFixed(1)} %
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    <div className="font-medium">{batch.millerInCharge}</div>
                    <div className="text-[10px] text-slate-400">{batch.notes}</div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Maintenance Section (Bühler Rolls & Plansichters) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'سجل الصيانة الوقائية لأسطوانات الطحن والمناخل الكبرى (Plansichters)' : 'Maintenance Préventive des Cylindres et Plansichters'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {onOpenNewMaintenance && (
              <button
                onClick={onOpenNewMaintenance}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'بطاقة صيانة' : 'Nouvelle Tâche'}</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500">ساعات التشغيل ومؤشرات التآكل</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenance.map((task) => {
            const progress = Math.min(100, Math.round((task.currentHours / task.maxServiceHours) * 100));
            const isDue = task.status === 'due_soon' || task.status === 'critical';

            return (
              <div
                key={task.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? task.machineNameAr : task.machineNameFr}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.component}</p>
                  </div>
                  <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                    isDue ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                    {task.currentHours} / {task.maxServiceHours} سا
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>عمر الخدمة:</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isDue ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>المسؤول: {task.technician}</span>
                  <span>آخر تدخل: {task.lastMaintenanceDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
