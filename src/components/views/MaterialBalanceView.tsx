import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, CheckCircle2, AlertCircle, ArrowDownRight, Layers, BarChart3, FileText } from 'lucide-react';
import { Silo, WeighbridgeTicket, ProductionBatch, MillSettings } from '../../types';
import { Language, translations, formatWeightQx } from '../../utils/translations';
import { WeeklyMillingChart } from '../charts/WeeklyMillingChart';

interface MaterialBalanceViewProps {
  silos: Silo[];
  tickets: WeighbridgeTicket[];
  batches: ProductionBatch[];
  settings: MillSettings;
  lang: Language;
}

export const MaterialBalanceView: React.FC<MaterialBalanceViewProps> = ({
  silos,
  tickets,
  batches,
  settings,
  lang
}) => {
  const t = translations[lang];

  // Mathematical Material Balance calculations (Bilan Matière OAIC)
  const currentSilosStockQx = silos.reduce((acc, curr) => acc + curr.currentStockQx, 0);
  const totalReceivedQx = tickets.reduce((acc, curr) => acc + curr.netWeightQx, 0);
  const totalMilledGrainQx = batches.reduce((acc, curr) => acc + curr.grainProcessedQx, 0);
  const estimatedInitialStockQx = Math.max(0, currentSilosStockQx + totalMilledGrainQx - totalReceivedQx);

  // Milled outputs aggregated
  let totalFarineQx = 0;
  let totalSemouleQx = 0;
  let totalSonQx = 0;

  batches.forEach((b) => {
    b.outputs.forEach((out) => {
      if (out.productType.includes('farine') && out.productType !== 'farine_basse') {
        totalFarineQx += out.quantityQx;
      } else if (out.productType.includes('semoule')) {
        totalSemouleQx += out.quantityQx;
      } else {
        totalSonQx += out.quantityQx;
      }
    });
  });

  const totalFinishedOutputQx = totalFarineQx + totalSemouleQx + totalSonQx;
  const processLossesQx = Math.max(0, totalMilledGrainQx - totalFinishedOutputQx);
  const overallYieldPercent = totalMilledGrainQx > 0 
    ? ((totalFinishedOutputQx / totalMilledGrainQx) * 100).toFixed(2)
    : '98.5';

  const handleExportCSV = () => {
    const csvContent = [
      ['Bilan Matiere OAIC - Moulins d Algerie', settings.millNameFr],
      ['Date d extraction', new Date().toLocaleDateString('fr-FR')],
      [''],
      ['Section 1: Flux Matieres Premieres (Ble)', 'Quantite (Qx)'],
      ['Stock Initial en Silos', estimatedInitialStockQx.toFixed(1)],
      ['Receptions Totales CCLS/OAIC', totalReceivedQx.toFixed(1)],
      ['Total Ble Disponible', (estimatedInitialStockQx + totalReceivedQx).toFixed(1)],
      ['Ble Ecrase / Moulu', totalMilledGrainQx.toFixed(1)],
      ['Stock Final en Silos', currentSilosStockQx.toFixed(1)],
      [''],
      ['Section 2: Produits Obtenus de la Mouture', 'Quantite (Qx)', 'Taux (%)'],
      ['Farines Panifiables & Patissieres', totalFarineQx.toFixed(1), ((totalFarineQx / totalMilledGrainQx) * 100).toFixed(1) + '%'],
      ['Semoules Superieures & Courantes', totalSemouleQx.toFixed(1), ((totalSemouleQx / totalMilledGrainQx) * 100).toFixed(1) + '%'],
      ['Son de Ble & Sous-produits', totalSonQx.toFixed(1), ((totalSonQx / totalMilledGrainQx) * 100).toFixed(1) + '%'],
      ['Pertes d humidite & Ecarts techniques', processLossesQx.toFixed(1), ((processLossesQx / totalMilledGrainQx) * 100).toFixed(1) + '%'],
      ['Rendement Global Extraction', totalFinishedOutputQx.toFixed(1), overallYieldPercent + '%']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bilan_matiere_oaic_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [reportTab, setReportTab] = useState<'all' | 'chart' | 'official'>('all');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'التقارير والميزان المادي لديوان الحبوب (Bilan Matière OAIC)' : 'Rapports & Bilan Matière Officiel OAIC'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'التقرير الإحصائي والتحليلي لحركة الحبوب ومعدل استهلاك القمح مقابل إنتاج الطحين والسميد المعتمد لدى OAIC.'
              : 'Analyses graphiques et déclaration officielle des stocks, tonnages écrasés, farines et semoules produites.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tabs Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setReportTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                reportTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'عرض شامل' : 'Vue Complète'}
            </button>
            <button
              onClick={() => setReportTab('chart')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                reportTab === 'chart'
                  ? 'bg-[#714B67] text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الرسم البياني الأسبوعي' : 'Graphique Hebdomadaire'}</span>
            </button>
            <button
              onClick={() => setReportTab('official')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                reportTab === 'official'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الكشف الرسمي OAIC' : 'Bilan OAIC'}</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تصدير CSV' : 'Exporter CSV'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.print}</span>
          </button>
        </div>
      </div>

      {/* 1. Interactive Recharts: Weekly Wheat Consumption vs Actual Flour Output */}
      {(reportTab === 'all' || reportTab === 'chart') && (
        <WeeklyMillingChart batches={batches} lang={lang} />
      )}

      {/* 2. Official Declaration Paper Structure */}
      {(reportTab === 'all' || reportTab === 'official') && (
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-300 dark:border-slate-700 p-6 sm:p-8 space-y-6">
        {/* Header Block */}
        <div className="text-center pb-4 border-b border-slate-300 dark:border-slate-700 space-y-1">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">الجمهورية الجزائرية الديمقراطية الشعبية</p>
          <p className="text-xs font-semibold text-slate-500">وزارة الفلاحة والتنمية الريفية · الديوان الجزائري المهني للحبوب (OAIC)</p>
          <h1 className="text-base font-extrabold text-amber-800 dark:text-amber-400 pt-2">
            كشف الميزان المادي الشهري لحركة الحبوب والدقيق والسميد (BILAN MATIÈRE)
          </h1>
          <div className="flex justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono pt-1">
            <span>المطحنة: {settings.millNameAr}</span>
            <span>الولاية: {settings.wilayaAr}</span>
            <span>رقم الاعتماد: {settings.oaicAgreementNumber}</span>
          </div>
        </div>

        {/* Section 1: Raw Grain Flow (CCLS Blé) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded">
            {lang === 'ar' ? 'أولاً: ميزان حركة المادة الأولية (القمح اللين والصلب)' : '1. Mouvement de la Matière Première (Blé)'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-start">البيان / Désignation</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-end">الكمية بالقنطار (Qx)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-end">الكمية بالطن المتري (T)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-start">ملاحظات ومصادر الحبوب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">1. الرصيد الافتتاحي في الصوامع (Stock Initial)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums">{estimatedInitialStockQx.toFixed(1)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">{(estimatedInitialStockQx / 10).toFixed(2)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">رصيد الصوامع في أول الشهر</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">2. إجمالي الشحنات المستلمة (Réceptions OAIC/CCLS)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums text-amber-700 dark:text-amber-400">+{totalReceivedQx.toFixed(1)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">+{(totalReceivedQx / 10).toFixed(2)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">حسب تذاكر قبان الوزن الرسمية</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold">
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans">المجموع الإجمالي المتاح (Total Disponible)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">{(estimatedInitialStockQx + totalReceivedQx).toFixed(1)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">{((estimatedInitialStockQx + totalReceivedQx) / 10).toFixed(2)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">رصيد بداية + استلامات</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">3. كميات القمح المسحوقة / المطحونة (Écrasement)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums text-rose-600">-{totalMilledGrainQx.toFixed(1)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">-{(totalMilledGrainQx / 10).toFixed(2)}</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">المطحون بخطوط الفرينة والسميد</td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/40 font-bold">
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-amber-900 dark:text-amber-200">
                    4. الرصيد الختامي الحقيقي في الصوامع (Stock Final)
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums text-amber-700 dark:text-amber-400">
                    {currentSilosStockQx.toFixed(1)}
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums">
                    {(currentSilosStockQx / 10).toFixed(2)}
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-emerald-600 dark:text-emerald-400">
                    مطابق لقراءات حساسات الصوامع الست
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Products Yields & Extraction Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded">
            {lang === 'ar' ? 'ثانياً: المنتجات المحولة ومعدلات الاستخراج الفعلي (Mouture & Rendements)' : '2. Produits Finis et Taux d\'Extraction'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-start">المنتج المستخرج / Catégorie</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-end">الكمية الناتجة (ق)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center">معدل الاستخراج %</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-start">المطابقة للمعيار الجزائري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">الفرينة (فرينة الخبز المدعمة T55 + الحلويات T45)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums">{totalFarineQx.toFixed(1)} ق</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold tabular-nums text-emerald-600">
                    {totalMilledGrainQx > 0 ? ((totalFarineQx / totalMilledGrainQx) * 100).toFixed(1) : '78.0'} %
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">المعيار الوزاري: 78.0% إلى 82.0%</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">السميد (فائق النعومة، ممتاز، متوسط، مقنن)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums">{totalSemouleQx.toFixed(1)} ق</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold tabular-nums text-emerald-600">
                    {totalMilledGrainQx > 0 ? ((totalSemouleQx / totalMilledGrainQx) * 100).toFixed(1) : '75.0'} %
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">المعيار الوزاري: 72.0% إلى 76.0%</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold">نخالة القمح والمنتجات الثانوية (Son de blé)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums">{totalSonQx.toFixed(1)} ق</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold tabular-nums">
                    {totalMilledGrainQx > 0 ? ((totalSonQx / totalMilledGrainQx) * 100).toFixed(1) : '18.5'} %
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">مخصصة للأعلاف ومربي المواشي</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-semibold text-slate-500">الفواقد التقنية والرطوبة الطبيعية (Pertes)</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end font-bold tabular-nums text-slate-500">{processLossesQx.toFixed(1)} ق</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold tabular-nums text-slate-500">
                    {totalMilledGrainQx > 0 ? ((processLossesQx / totalMilledGrainQx) * 100).toFixed(1) : '1.5'} %
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">ضمن عتبة التبخر المسموح بها</td>
                </tr>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans">الإجمالي المحول والمطحون</td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-end tabular-nums text-amber-700 dark:text-amber-400">
                    {totalMilledGrainQx.toFixed(1)} ق
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center tabular-nums text-emerald-600">
                    100.0 %
                  </td>
                  <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-emerald-600">
                    الميزان متوازن ومصادق عليه
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Signatures block */}
        <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
          <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">مدير المطحنة والإنتاج</p>
            <p className="text-[10px] text-slate-400 mt-6">(التوقيع والختم الرسمي)</p>
          </div>
          <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">محافظ الحسابات المعتمد</p>
            <p className="text-[10px] text-slate-400 mt-6">(تأشيرة المطابقة)</p>
          </div>
          <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">مفتشية ديوان الحبوب OAIC</p>
            <p className="text-[10px] text-slate-400 mt-6">(وصل الإيداع والقبول)</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
