import React, { useState } from 'react';
import { X, Cog, CheckCircle, AlertCircle } from 'lucide-react';
import { Silo, ProductionBatch, ProductType } from '../../types';
import { Language, translations } from '../../utils/translations';

interface NewProductionBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  silos: Silo[];
  onAddBatch: (batch: ProductionBatch) => void;
  lang: Language;
}

export const NewProductionBatchModal: React.FC<NewProductionBatchModalProps> = ({
  isOpen,
  onClose,
  silos,
  onAddBatch,
  lang
}) => {
  const t = translations[lang];

  const [lineId, setLineId] = useState<'minoterie_tendre' | 'semoulerie_dur'>('minoterie_tendre');
  const [shift, setShift] = useState<'morning' | 'evening' | 'night'>('morning');
  const [grainProcessedQx, setGrainProcessedQx] = useState<number>(1000);
  const [siloSourceId, setSiloSourceId] = useState<string>(silos[0]?.id || '');
  const [millerInCharge, setMillerInCharge] = useState('الشيخ عبد الرزاق بن علي (رئيس الوردية)');
  const [energyConsumedKwh, setEnergyConsumedKwh] = useState<number>(11500);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedSilo = silos.find((s) => s.id === siloSourceId) || silos[0];

  // Calculated standard yield outputs based on line
  let outputs: {
    productType: ProductType;
    quantityQx: number;
    bagsCount: number;
    packageType: string;
  }[] = [];

  let extractionRatePercent = 0;

  if (lineId === 'minoterie_tendre') {
    // 78% Farine 55, 3% Farine 45, 17% Son
    const farine55Qx = Math.round(grainProcessedQx * 0.78);
    const farine45Qx = Math.round(grainProcessedQx * 0.03);
    const sonQx = Math.round(grainProcessedQx * 0.17);
    extractionRatePercent = 81.0;

    outputs = [
      {
        productType: 'farine_panifiable_55',
        quantityQx: farine55Qx,
        bagsCount: (farine55Qx * 100) / 50, // 50kg bags
        packageType: 'أكياس 50 كغ'
      },
      {
        productType: 'farine_patissiere_45',
        quantityQx: farine45Qx,
        bagsCount: (farine45Qx * 100) / 25, // 25kg bags
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'son_ble',
        quantityQx: sonQx,
        bagsCount: Math.round((sonQx * 100) / 35), // 35kg bags
        packageType: 'أكياس 35 كغ'
      }
    ];
  } else {
    // Semoulerie: 40% Extra-fine, 30% Moyenne, 5% Grosse, 21% Son
    const semouleExtraQx = Math.round(grainProcessedQx * 0.40);
    const semouleMoyQx = Math.round(grainProcessedQx * 0.30);
    const semouleGrosseQx = Math.round(grainProcessedQx * 0.05);
    const sonQx = Math.round(grainProcessedQx * 0.21);
    extractionRatePercent = 75.0;

    outputs = [
      {
        productType: 'semoule_extra_fine',
        quantityQx: semouleExtraQx,
        bagsCount: (semouleExtraQx * 100) / 25,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'semoule_moyenne',
        quantityQx: semouleMoyQx,
        bagsCount: (semouleMoyQx * 100) / 25,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'semoule_grosse',
        quantityQx: semouleGrosseQx,
        bagsCount: (semouleGrosseQx * 100) / 25,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'son_ble',
        quantityQx: sonQx,
        bagsCount: Math.round((sonQx * 100) / 35),
        packageType: 'أكياس 35 كغ'
      }
    ];
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grainProcessedQx <= 0) return;

    const defaultExp = new Date();
    defaultExp.setMonth(defaultExp.getMonth() + 6);

    const newBatch: ProductionBatch = {
      id: `bat-${Date.now()}`,
      batchNumber: `PROD-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      shift,
      lineId,
      grainProcessedQx,
      siloSourceId,
      outputs,
      extractionRatePercent,
      energyConsumedKwh,
      millerInCharge,
      expiryDate: defaultExp.toISOString().split('T')[0],
      notes: notes || 'تمت المطحنة في ظروف تشغيلية طبيعية'
    };

    onAddBatch(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'تسجيل وردية طحن وسحق حبوب جديدة' : 'Nouvelle Mouture & Écrasement'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'خط الطحن والإنتاج' : 'Ligne de Production'}
              </label>
              <select
                value={lineId}
                onChange={(e) => setLineId(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="minoterie_tendre">خط الفرينة (Minoterie - Blé Tendre)</option>
                <option value="semoulerie_dur">خط السميد (Semoulerie - Blé Dur)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'وردية العمل (Quart)' : 'Équipe de Quart'}
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="morning">وردية الصباح (06:00 - 14:00)</option>
                <option value="evening">وردية المساء (14:00 - 22:00)</option>
                <option value="night">وردية الليل (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'كمية الحبوب المسحوبة للطحن (قنطار)' : 'Quantité de Blé à Écraser (Qx)'}
              </label>
              <input
                type="number"
                min="50"
                max="10000"
                step="50"
                value={grainProcessedQx}
                onChange={(e) => setGrainProcessedQx(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'صومعة التغذية والسحب' : 'Silo Source'}
              </label>
              <select
                value={siloSourceId}
                onChange={(e) => setSiloSourceId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {silos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {lang === 'ar' ? s.nameAr : s.nameFr} (متوفر: {s.currentStockQx} ق)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Yield preview */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {lang === 'ar' ? 'تقدير المنتجات المستخرجة ومعدل المردودية' : 'Prévision des Rendements'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                {lang === 'ar' ? 'نسبة الاستخراج:' : 'Taux d\'extraction:'} {extractionRatePercent.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-1.5">
              {outputs.map((out, idx) => (
                <div key={idx} className="flex justify-between text-xs bg-white/70 dark:bg-slate-900/70 p-2 rounded">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{out.packageType} ({out.productType})</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {out.quantityQx} قنطار <span className="text-amber-700 font-bold">({out.bagsCount} كيس)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'المسؤول عن الوردية (كبير الطحانين)' : 'Meunier Responsable'}
              </label>
              <input
                type="text"
                value={millerInCharge}
                onChange={(e) => setMillerInCharge(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'استهلاك الكهرباء (كيلوواط/ساعة kWh)' : 'Consommation Électrique (kWh)'}
              </label>
              <input
                type="number"
                value={energyConsumedKwh}
                onChange={(e) => setEnergyConsumedKwh(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors"
            >
              {lang === 'ar' ? 'بدء الوردية وتسجيل الإنتاج' : 'Lancer & Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
