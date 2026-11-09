import React, { useState } from 'react';
import { Database, Wind, Thermometer, Droplets, ArrowRightLeft, Check, AlertCircle, Plus } from 'lucide-react';
import { Silo } from '../../types';
import { Language, translations, formatWeightQx } from '../../utils/translations';

interface SilosViewProps {
  silos: Silo[];
  onToggleVentilation: (siloId: string) => void;
  onTransferGrain: (sourceId: string, destId: string, amountQx: number) => void;
  lang: Language;
}

export const SilosView: React.FC<SilosViewProps> = ({
  silos,
  onToggleVentilation,
  onTransferGrain,
  lang
}) => {
  const t = translations[lang];

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [sourceSiloId, setSourceSiloId] = useState(silos[0]?.id || '');
  const [destSiloId, setDestSiloId] = useState(silos[4]?.id || ''); // e.g. Silo de repos
  const [transferAmountQx, setTransferAmountQx] = useState<number>(300);

  const totalCapacityQx = silos.reduce((acc, curr) => acc + curr.capacityQx, 0);
  const totalStockQx = silos.reduce((acc, curr) => acc + curr.currentStockQx, 0);
  const occupancyRate = Math.round((totalStockQx / totalCapacityQx) * 100);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceSiloId === destSiloId || transferAmountQx <= 0) return;
    onTransferGrain(sourceSiloId, destSiloId, transferAmountQx);
    setIsTransferOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'صوامع التخزين والترطيب (Silos de Stockage)' : 'Parc des Silos de Céréales'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'مراقبة مستويات الامتلاء، درجات حرارة الحبوب، تشغيل مراوح التهوية، وتحويل الشحنات لصوامع التكييف والراحة.'
              : 'Supervision des niveaux, sondes de température, aération forcée et transfert vers les silos de mouillage.'}
          </p>
        </div>

        <button
          onClick={() => setIsTransferOpen(!isTransferOpen)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تحويل حبوب بين الصوامع' : 'Transfert Inter-Silos'}</span>
        </button>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">{t.kpiTotalGrain}</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(totalStockQx, lang)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            الطاقة الإجمالية القصوى: {formatWeightQx(totalCapacityQx, lang)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'معدل شغل الصوامع الكلي' : 'Taux d\'Occupation Global'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
            {occupancyRate}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'مراوح التهوية الفعالة (Ventilation)' : 'Ventilateurs Actifs'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {silos.filter(s => s.ventilationActive).length} / {silos.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            تبريد هوائي نشط لمنع التخمر وارتفاع الحرارة
          </div>
        </div>
      </div>

      {/* Transfer Grain Form Modal / Section */}
      {isTransferOpen && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'تحويل كمية من الحبوب عبر السيور الناقلة' : 'Transfert Mécanique par Bande'}</span>
            </h3>
            <button
              onClick={() => setIsTransferOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              {t.cancel}
            </button>
          </div>

          <form onSubmit={handleTransferSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الصومعة المصدر' : 'Silo Source'}
              </label>
              <select
                value={sourceSiloId}
                onChange={(e) => setSourceSiloId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              >
                {silos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {lang === 'ar' ? s.nameAr : s.nameFr} ({s.currentStockQx} ق)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الصومعة المستقبلة (مثلاً الترطيب)' : 'Silo Destination'}
              </label>
              <select
                value={destSiloId}
                onChange={(e) => setDestSiloId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              >
                {silos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {lang === 'ar' ? s.nameAr : s.nameFr} (متبقي: {s.capacityQx - s.currentStockQx} ق)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الكمية المحولة (قنطار)' : 'Quantité (Qx)'}
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={transferAmountQx}
                onChange={(e) => setTransferAmountQx(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded shadow-xs"
            >
              {lang === 'ar' ? 'تأكيد أمر التحويل' : 'Exécuter le Transfert'}
            </button>
          </form>
        </div>
      )}

      {/* Silos Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {silos.map((silo) => {
          const fillPercent = Math.min(100, Math.round((silo.currentStockQx / silo.capacityQx) * 100));
          const isLow = fillPercent < 20;
          const isWarm = silo.temperatureC > 21.0;

          return (
            <div
              key={silo.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              {/* Silo Top Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-extrabold text-amber-700 dark:text-amber-400">
                    {silo.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {t[silo.grainType]}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? silo.nameAr : silo.nameFr}
                </h3>
              </div>

              {/* Graphic Silo Tank Visualizer */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-500">مستوى الشحن:</span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                    {fillPercent}% ({silo.currentStockQx.toLocaleString()} / {silo.capacityQx.toLocaleString()} {t.quintal})
                  </span>
                </div>

                {/* Cylinder Vertical Tank Fill Bar */}
                <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isLow ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold font-mono text-white drop-shadow-xs">
                    {(silo.currentStockQx / 10).toFixed(1)} طن متري
                  </div>
                </div>
              </div>

              {/* Environmental Probes (Temperature & Moisture) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>الحرارة</span>
                  </div>
                  <span className={`font-mono font-bold text-sm tabular-nums ${isWarm ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                    {silo.temperatureC.toFixed(1)} °C
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>الرطوبة</span>
                  </div>
                  <span className="font-mono font-bold text-sm tabular-nums text-slate-900 dark:text-white">
                    {silo.moisturePercent.toFixed(1)} %
                  </span>
                </div>
              </div>

              {/* Ventilation Fan Toggle Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  آخر تعبئة: {silo.lastFillDate}
                </div>

                <button
                  onClick={() => onToggleVentilation(silo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    silo.ventilationActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Wind className={`w-3.5 h-3.5 ${silo.ventilationActive ? 'animate-spin' : ''}`} />
                  <span>{silo.ventilationActive ? 'التهوية تعمل' : 'تشغيل التهوية'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
