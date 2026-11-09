import React, { useState } from 'react';
import { X, Scale, AlertCircle } from 'lucide-react';
import { Silo, WeighbridgeTicket, GrainType } from '../../types';
import { Language, translations } from '../../utils/translations';

interface NewReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  silos: Silo[];
  onAddTicket: (ticket: WeighbridgeTicket) => void;
  lang: Language;
}

export const NewReceptionModal: React.FC<NewReceptionModalProps> = ({
  isOpen,
  onClose,
  silos,
  onAddTicket,
  lang
}) => {
  const t = translations[lang];

  const [truckMatricule, setTruckMatricule] = useState('');
  const [driverName, setDriverName] = useState('');
  const [carrierCompany, setCarrierCompany] = useState('مؤسسة النقل البري SNTR');
  const [cclsOrigin, setCclsOrigin] = useState('تعاونية الحبوب CCLS سطيف');
  const [grainType, setGrainType] = useState<GrainType>('ble_tendre');
  const [grossWeightKg, setGrossWeightKg] = useState<number>(42500);
  const [tareWeightKg, setTareWeightKg] = useState<number>(14200);
  const [assignedSiloId, setAssignedSiloId] = useState<string>(silos[0]?.id || '');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const netWeightQx = netWeightKg / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckMatricule || !driverName || netWeightKg <= 0) return;

    const newTicket: WeighbridgeTicket = {
      id: `tck-${Date.now()}`,
      ticketNumber: `TCK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      truckMatricule,
      driverName,
      carrierCompany,
      cclsOrigin,
      grainType,
      grossWeightKg,
      tareWeightKg,
      netWeightKg,
      netWeightQx,
      assignedSiloId,
      status: 'accepted',
      notes: notes || 'تم التحقق من الوزن بالقبّان والمطابقة'
    };

    onAddTicket(newTicket);
    onClose();
  };

  const cclsList = [
    'تعاونية الحبوب CCLS سطيف',
    'تعاونية الحبوب CCLS قسنطينة',
    'تعاونية الحبوب CCLS تيارت',
    'تعاونية الحبوب CCLS البليدة',
    'تعاونية الحبوب CCLS أم البواقي',
    'تعاونية الحبوب CCLS سيدي بلعباس',
    'ميناء جن جن (جيجل) - واردات OAIC',
    'ميناء الجزائر العاصمة - شحنات OAIC'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'تسجيل شحنة حبوب جديدة (ميزان القبان)' : 'Nouvelle Réception Céréales (Pont-Bascule)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'رقم لوحة الشاحنة (Matricule)' : 'Matricule Camion'}
              </label>
              <input
                type="text"
                required
                placeholder="مثال: 08412-120-19"
                value={truckMatricule}
                onChange={(e) => setTruckMatricule(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'اسم السائق' : 'Nom du Chauffeur'}
              </label>
              <input
                type="text"
                required
                placeholder="مثال: عمر بلقاسم"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'المصدر (تعاونية CCLS أو الميناء)' : 'Origine CCLS / Port'}
              </label>
              <select
                value={cclsOrigin}
                onChange={(e) => setCclsOrigin(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {cclsList.map((ccls, idx) => (
                  <option key={idx} value={ccls}>{ccls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'شركة النقل' : 'Société de Transport'}
              </label>
              <input
                type="text"
                value={carrierCompany}
                onChange={(e) => setCarrierCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'نوع الحبوب' : 'Type de Céréale'}
              </label>
              <select
                value={grainType}
                onChange={(e) => setGrainType(e.target.value as GrainType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="ble_tendre">{t.ble_tendre}</option>
                <option value="ble_dur_local">{t.ble_dur_local}</option>
                <option value="ble_dur_importe">{t.ble_dur_importe}</option>
                <option value="orge">{t.orge}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'صومعة التفريغ المخصصة' : 'Silo de Déchargement'}
              </label>
              <select
                value={assignedSiloId}
                onChange={(e) => setAssignedSiloId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {silos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {lang === 'ar' ? s.nameAr : s.nameFr} (متبقي: {s.capacityQx - s.currentStockQx} قنطار)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weighbridge Calculation Box */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              {lang === 'ar' ? 'بيانات الوزن الآلي بالقبّان (Pont-Bascule)' : 'Mesure des Poids au Pont-Bascule'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'ar' ? 'الوزن الإجمالي (Poids Brut) كغ' : 'Poids Brut (kg)'}
                </label>
                <input
                  type="number"
                  min="1000"
                  max="80000"
                  step="20"
                  value={grossWeightKg}
                  onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono tabular-nums text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'ar' ? 'وزن الشاحنة فارغة (Tare) كغ' : 'Tare du Camion (kg)'}
                </label>
                <input
                  type="number"
                  min="1000"
                  max="30000"
                  step="20"
                  value={tareWeightKg}
                  onChange={(e) => setTareWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono tabular-nums text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'الصافي (Poids Net)' : 'Poids Net'}
                </label>
                <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-400 font-bold font-mono tabular-nums text-sm">
                  {netWeightKg.toLocaleString()} كغ ({netWeightQx.toFixed(1)} قنطار)
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.notes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات حول حالة الشحنة أو رقم إذن الخروج..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
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
              {lang === 'ar' ? 'تأكيد التسجيل وإصدار تذكرة الوزن' : 'Valider & Émettre Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
