import React from 'react';
import { 
  Building2, 
  Scale, 
  Database, 
  Cog, 
  Package, 
  Store, 
  FileSpreadsheet, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  Silo, 
  WeighbridgeTicket, 
  ProductionBatch, 
  WarehouseItem, 
  BakeryClient, 
  MaintenanceTask, 
  MillSettings 
} from '../../types';
import { Language, translations, formatCurrency, formatWeightQx } from '../../utils/translations';

interface DashboardViewProps {
  silos: Silo[];
  tickets: WeighbridgeTicket[];
  batches: ProductionBatch[];
  warehouse: WarehouseItem[];
  bakeries: BakeryClient[];
  maintenance: MaintenanceTask[];
  settings: MillSettings;
  lang: Language;
  onNavigateTab: (tab: string) => void;
  onOpenNewReception: () => void;
  onOpenNewDelivery: () => void;
  onOpenNewBatch: () => void;
  onViewTicket: (ticket: WeighbridgeTicket) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  silos,
  tickets,
  batches,
  warehouse,
  bakeries,
  maintenance,
  settings,
  lang,
  onNavigateTab,
  onOpenNewReception,
  onOpenNewDelivery,
  onOpenNewBatch,
  onViewTicket
}) => {
  const t = translations[lang];

  // Calculated Metrics
  const totalGrainStockQx = silos.reduce((acc, curr) => acc + curr.currentStockQx, 0);
  const totalSilosCapacityQx = silos.reduce((acc, curr) => acc + curr.capacityQx, 0);
  const siloOccupancyRate = Math.round((totalGrainStockQx / totalSilosCapacityQx) * 100);

  const todayBatches = batches.slice(0, 2);
  const todayCrushedQx = todayBatches.reduce((acc, curr) => acc + curr.grainProcessedQx, 0);

  const totalFinishedBags = warehouse.reduce((acc, curr) => acc + curr.stockBags, 0);
  const totalSubsidizedFarineBags = warehouse.find(w => w.productType === 'farine_panifiable_55')?.stockBags || 0;

  const urgentMaintenance = maintenance.filter(m => m.status === 'critical' || m.status === 'due_soon');

  return (
    <div className="space-y-6">
      {/* Hero Architectural Facility Spotlight */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white min-h-[260px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/mill_facility_hero_1794130776241.jpg"
          alt="Algerian Flour Mill Facility"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span>{settings.wilayaAr}</span>
            <span aria-hidden="true">·</span>
            <span>{settings.oaicAgreementNumber}</span>
            <span aria-hidden="true">·</span>
            <span>طاقة السحق اليومية: {settings.dailyCapacityQx.toLocaleString()} قنطار/24 سا</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            {lang === 'ar' ? settings.millNameAr : settings.millNameFr}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {lang === 'ar'
              ? 'مجمع مطاحن الحبوب لإنتاج الفرينة والسميد المدعم والفاخر، وربط صوامع التخزين بالديوان الجزائري المهني للحبوب OAIC وشبكة توزيع المخابز المعتمدة.'
              : 'Complexe meunier industriel de transformation du blé dur et tendre en semoules et farines subventionnées, en liaison directe avec l\'OAIC et les boulangeries.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onOpenNewReception}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t.btnNewReception}</span>
            </button>
            <button
              onClick={onOpenNewBatch}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Cog className="w-3.5 h-3.5" />
              <span>{t.btnNewBatch}</span>
            </button>
            <button
              onClick={onOpenNewDelivery}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t.btnNewDelivery}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (High density, single elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Grain Stock */}
        <div 
          onClick={() => onNavigateTab('silos')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">{t.kpiTotalGrain}</span>
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(totalGrainStockQx, lang)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {siloOccupancyRate}% نسبة الامتلاء
            </span>
            <span aria-hidden="true">·</span>
            <span>6 صوامع نشطة</span>
          </div>
        </div>

        {/* KPI 2: Daily Crushing Rate */}
        <div 
          onClick={() => onNavigateTab('production')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">{t.kpiDailyCrushing}</span>
            <Cog className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(todayCrushedQx, lang)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-amber-600 dark:text-amber-400">وردية الصباح والمساء</span>
            <span aria-hidden="true">·</span>
            <span>خط الفرينة والسميد</span>
          </div>
        </div>

        {/* KPI 3: Extraction Yield */}
        <div 
          onClick={() => onNavigateTab('production')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">{t.kpiExtractionYield}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            81.0% / 75.0%
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>فرينة 55: 78%</span>
            <span aria-hidden="true">·</span>
            <span>سميد ممتاز: 75%</span>
          </div>
        </div>

        {/* KPI 4: Finished Goods Bags Stock */}
        <div 
          onClick={() => onNavigateTab('warehouse')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">{t.kpiWarehouseStock}</span>
            <Package className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalFinishedBags.toLocaleString()} {t.bag}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              {totalSubsidizedFarineBags.toLocaleString()} كيس مخابز (50 كغ)
            </span>
          </div>
        </div>
      </div>

      {/* Active Milling Lines Industrial Status Banner */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'حالة خطوط الإنتاج الكبرى والتشغيل اللحظي' : 'Lignes de Mouture en Temps Réel'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">مراقبة الحساسات الآلية SCADA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Line 1: Minoterie */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                خط الفرينة (Minoterie - Blé Tendre)
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                يعمل بطاقة 100%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              طاقة السحق: 125 قنطار/ساعة · الصومعة المغذية: SILO-01 · الضغط الهيدروليكي طبيعي
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[92%]" />
            </div>
          </div>

          {/* Line 2: Semoulerie */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                خط السميد (Semoulerie - Blé Dur)
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                يعمل بطاقة 95%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              طاقة السحق: 90 قنطار/ساعة · الصومعة المغذية: SILO-03 · أجهزة السوسوار (Sasseurs) نشطة
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Recent Weighbridge Receipts & Urgent Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grain Receptions (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.recentReceipts}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'الشحنات الواردة عبر ميزان القبان من تعاونيات الحبوب OAIC' : 'Arrivages récents via pont-bascule'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('weighbridge')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'عرض الكل' : 'Voir tout'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 pb-2">
                  <th className="text-start pb-2 font-medium">رقم التذكرة</th>
                  <th className="text-start pb-2 font-medium">الشاحنة / السائق</th>
                  <th className="text-start pb-2 font-medium">المصدر CCLS</th>
                  <th className="text-start pb-2 font-medium">نوع الحبوب</th>
                  <th className="text-end pb-2 font-medium">الصافي (ق)</th>
                  <th className="text-center pb-2 font-medium">الحالة</th>
                  <th className="text-end pb-2 font-medium">معاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {tickets.slice(0, 4).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-mono font-semibold text-amber-700 dark:text-amber-400">
                      {ticket.ticketNumber}
                    </td>
                    <td className="py-2.5">
                      <div className="font-mono text-slate-900 dark:text-white font-semibold">{ticket.truckMatricule}</div>
                      <div className="text-[11px] text-slate-500">{ticket.driverName}</div>
                    </td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">
                      {ticket.cclsOrigin}
                    </td>
                    <td className="py-2.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {t[ticket.grainType]}
                      </span>
                    </td>
                    <td className="py-2.5 text-end font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {ticket.netWeightQx.toFixed(1)}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {ticket.status === 'unloaded' ? 'مفرغ' : 'مقبول'}
                      </span>
                    </td>
                    <td className="py-2.5 text-end">
                      <button
                        onClick={() => onViewTicket(ticket)}
                        className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        title="طباعة التذكرة"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance & Quality Warnings (1 Column) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span>{t.maintenanceAlerts}</span>
              </h3>
              <button
                onClick={() => onNavigateTab('production')}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                سجل الأعطال
              </button>
            </div>

            <div className="space-y-3">
              {urgentMaintenance.map((m) => (
                <div key={m.id} className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.machineNameAr}
                    </span>
                    <span className="text-[11px] font-bold font-mono text-amber-700 dark:text-amber-400">
                      {m.currentHours} / {m.maxServiceHours} سا
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {m.component} · التقني: {m.technician}
                  </p>
                </div>
              ))}

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    مخبر مراقبة الجودة (Labo)
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">مطابق للنظام</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  متوسط الرطوبة لعينات اليوم: 12.8% (ضمن المعيار الأقصى 14.5% OAIC).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigateTab('material_balance')}
              className="w-full py-2 px-3 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'عرض الميزان المادي الشهري OAIC' : 'Bilan Matière OAIC'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
