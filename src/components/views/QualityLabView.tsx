import React, { useState } from 'react';
import { FlaskConical, Plus, CheckCircle2, AlertTriangle, XCircle, Search, FileText } from 'lucide-react';
import { LabTest, WeighbridgeTicket, GrainType } from '../../types';
import { Language, translations } from '../../utils/translations';

interface QualityLabViewProps {
  labTests: LabTest[];
  tickets: WeighbridgeTicket[];
  onAddLabTest: (test: LabTest) => void;
  onPrintLabTest?: (test: LabTest) => void;
  lang: Language;
}

export const QualityLabView: React.FC<QualityLabViewProps> = ({
  labTests,
  tickets,
  onAddLabTest,
  onPrintLabTest,
  lang
}) => {
  const t = translations[lang];

  const [isAdding, setIsAdding] = useState(false);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState(tickets[0]?.ticketNumber || '');
  const [grainType, setGrainType] = useState<GrainType>('ble_tendre');
  const [moisture, setMoisture] = useState<number>(12.8);
  const [impurity, setImpurity] = useState<number>(1.5);
  const [specificWeight, setSpecificWeight] = useState<number>(78.5);
  const [protein, setProtein] = useState<number>(13.0);
  const [gluten, setGluten] = useState<number>(26.0);
  const [hagberg, setHagberg] = useState<number>(290);
  const [technician, setTechnician] = useState('م. فتيحة بوزيد (رئيسة المخبر)');
  const [labNotes, setLabNotes] = useState('');

  // Determine automated result according to Algerian OAIC grain norms:
  // Moisture: max 14.5%
  // Impurities: max 2.0%
  // Specific weight: min 76 kg/hl
  const isMoistureExceeded = moisture > 14.5;
  const isImpurityExceeded = impurity > 2.0;
  const isWeightLow = specificWeight < 76.0;

  let calculatedResult: 'accepted' | 'accepted_with_refaction' | 'rejected' = 'accepted';
  let refactionKg = 0;

  if (moisture > 15.5 || impurity > 3.5 || specificWeight < 72.0) {
    calculatedResult = 'rejected';
  } else if (isMoistureExceeded || isImpurityExceeded || isWeightLow) {
    calculatedResult = 'accepted_with_refaction';
    refactionKg = Math.round((moisture - 14.5 > 0 ? (moisture - 14.5) * 150 : 0) + (impurity - 2.0 > 0 ? (impurity - 2.0) * 100 : 0));
  }

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: LabTest = {
      id: `lab-${Date.now()}`,
      ticketNumber: selectedTicketNumber,
      date: new Date().toISOString().split('T')[0],
      grainType,
      moisturePercent: moisture,
      impurityPercent: impurity,
      specificWeight,
      proteinPercent: protein,
      glutenPercent: gluten,
      fallingNumberHagberg: hagberg,
      result: calculatedResult,
      refactionDeductionKg: refactionKg,
      laboratoryTechnician: technician,
      notes: labNotes || (calculatedResult === 'accepted' ? 'شحنة مطابقة لمعايير الديوان الوطني للحبوب OAIC' : 'تم تطبيق حسم وزني على الشحنة')
    };

    onAddLabTest(newTest);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'مخبر مراقبة جودة الحبوب وقبول الشحنات' : 'Laboratoire de Contrôle Qualité & Agréage'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'فحص رطوبة القمح، الشوائب، الوزن النوعي والغلوتين طبقاً للمواصفات الجزائرية المعتمدة لدى ديوان الحبوب OAIC.'
              : 'Analyses de l\'humidité, impuretés, poids spécifique et gluten selon les normes réglementaires algériennes.'}
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تسجيل تحليل مخبري جديد' : 'Nouvelle Analyse Laboratoire'}</span>
        </button>
      </div>

      {/* Lab Banner with Image & Standard Norms Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[200px] flex flex-col justify-end p-6 text-white">
          <img
            src="/src/assets/images/grain_quality_lab_1794130776431.jpg"
            alt="Quality Lab"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-30 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="relative z-10 space-y-1.5">
            <span className="text-xs font-bold text-amber-400">
              {lang === 'ar' ? 'المعايير المعتمدة لسلامة الحبوب' : 'Normes Officielles OAIC / IANOR'}
            </span>
            <h3 className="text-lg font-extrabold text-white">
              {lang === 'ar' ? 'تحاليل الفحص الفيزيوكيميائي والميكانيكي للحبوب' : 'Analyses Physico-Chimiques & Rhéologiques'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              تضمن أجهزة قياس الرطوبة الرقمية، وجهاز الوزن النوعي (Chondromètre)، وفحص الغلوتين الرطب الحفاظ على جودة استخراج الفرينة والسميد وحماية الصوامع من التخمر والحرارة.
            </p>
          </div>
        </div>

        {/* Official Algerian OAIC Norms Card */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            {lang === 'ar' ? 'المعايير الجزائرية المقننة (OAIC / IANOR)' : 'Normes Règlementaires Algériennes'}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">الرطوبة القصوى (Humidité):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">≤ 14.5 %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">نسبة الشوائب (Impuretés):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">≤ 2.0 %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">الوزن النوعي (Poids Spécifique):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">≥ 76.0 kg/hl</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">البروتين (Teneur en protéines):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">≥ 12.0 %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">الغلوتين الرطب (Gluten humide):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">≥ 24.0 %</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Lab Test Entry Form (Collapsible) */}
      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-amber-500/50 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'استمارة فحص عينة شحنة قبان' : 'Fiche d\'Analyse d\'Échantillon'}</span>
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              {t.cancel}
            </button>
          </div>

          <form onSubmit={handleCreateTest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'ربط بتذكرة القبان' : 'Ticket de Pesée Lié'}
                </label>
                <select
                  value={selectedTicketNumber}
                  onChange={(e) => setSelectedTicketNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                >
                  {tickets.map((t) => (
                    <option key={t.id} value={t.ticketNumber}>
                      {t.ticketNumber} - {t.truckMatricule} ({t.cclsOrigin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'نوع الحبوب' : 'Nature du Grain'}
                </label>
                <select
                  value={grainType}
                  onChange={(e) => setGrainType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="ble_tendre">{t.ble_tendre}</option>
                  <option value="ble_dur_local">{t.ble_dur_local}</option>
                  <option value="ble_dur_importe">{t.ble_dur_importe}</option>
                  <option value="orge">{t.orge}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'المخبري المسؤول' : 'Responsable d\'Analyse'}
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Test Numerical Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  الرطوبة %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="8"
                  max="20"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المعيار ≤ 14.5%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  الشوائب %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={impurity}
                  onChange={(e) => setImpurity(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المعيار ≤ 2.0%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  الوزن النوعي (kg/hl)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="60"
                  max="90"
                  value={specificWeight}
                  onChange={(e) => setSpecificWeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المعيار ≥ 76.0</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  البروتين %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="8"
                  max="20"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المعيار ≥ 12.0%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  الغلوتين الرطب %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="15"
                  max="40"
                  value={gluten}
                  onChange={(e) => setGluten(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المعيار ≥ 24.0%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  هاغبرغ Hagberg (s)
                </label>
                <input
                  type="number"
                  min="100"
                  max="500"
                  value={hagberg}
                  onChange={(e) => setHagberg(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">المثالي: 250-320s</span>
              </div>
            </div>

            {/* Decision Preview Banner */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              calculatedResult === 'accepted'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : calculatedResult === 'accepted_with_refaction'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {calculatedResult === 'accepted' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : calculatedResult === 'accepted_with_refaction' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span className="font-bold">
                  {calculatedResult === 'accepted'
                    ? 'النتيجة: مقبول بدون تحفظ (مطابق للشروط المعتمدة)'
                    : calculatedResult === 'accepted_with_refaction'
                    ? `النتيجة: مقبول مع تطبيق حسم وزني قدره ${refactionKg} كغ (Réfactions)`
                    : 'النتيجة: مرفوض نهائياً - مخالف للمقاييس الوطنية'}
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors"
              >
                تثبيت محضر الفحص
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lab Tests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            {lang === 'ar' ? 'سجل شهادات الفحص المخبري للشحنات المستلمة' : 'Historique des Analyses de Laboratoire'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-3 text-start font-semibold">رقم التذكرة</th>
                <th className="p-3 text-start font-semibold">تاريخ الفحص</th>
                <th className="p-3 text-start font-semibold">النوع</th>
                <th className="p-3 text-center font-semibold">الرطوبة</th>
                <th className="p-3 text-center font-semibold">الشوائب</th>
                <th className="p-3 text-center font-semibold">الوزن النوعي</th>
                <th className="p-3 text-center font-semibold">البروتين</th>
                <th className="p-3 text-center font-semibold">الغلوتين</th>
                <th className="p-3 text-center font-semibold">مؤشر هاغبرغ</th>
                <th className="p-3 text-center font-semibold">القرار الرسمي</th>
                <th className="p-3 text-start font-semibold">المخبري / ملاحظات</th>
                <th className="p-3 text-center font-semibold">شهادة الفحص</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {labTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                    {test.ticketNumber}
                  </td>
                  <td className="p-3 text-slate-500 font-mono">
                    {test.date}
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {t[test.grainType]}
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums font-semibold">
                    <span className={test.moisturePercent > 14.5 ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                      {test.moisturePercent.toFixed(1)} %
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">
                    <span className={test.impurityPercent > 2.0 ? 'text-amber-600 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                      {test.impurityPercent.toFixed(1)} %
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">
                    {test.specificWeight.toFixed(1)} kg/hl
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">
                    {test.proteinPercent.toFixed(1)} %
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">
                    {test.glutenPercent ? `${test.glutenPercent.toFixed(1)} %` : '—'}
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums">
                    {test.fallingNumberHagberg ? `${test.fallingNumberHagberg} s` : '—'}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      test.result === 'accepted'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : test.result === 'accepted_with_refaction'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {test.result === 'accepted' ? 'مقبول' : test.result === 'accepted_with_refaction' ? `حسم ${test.refactionDeductionKg} كغ` : 'مرفوض'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{test.laboratoryTechnician}</div>
                    <div className="text-[11px] text-slate-500">{test.notes}</div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onPrintLabTest && onPrintLabTest(test)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] rounded shadow-xs transition-colors"
                      title={lang === 'ar' ? 'تصدير وحفظ شهادة الفحص المخبري كـ PDF' : 'Exporter le bulletin en PDF'}
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'ar' ? 'شهادة PDF' : 'PDF'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
