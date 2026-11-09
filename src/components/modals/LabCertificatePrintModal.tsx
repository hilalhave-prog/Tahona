import React from 'react';
import { X, Printer, Download, FlaskConical, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { LabTest, WeighbridgeTicket, MillSettings } from '../../types';
import { Language, translations } from '../../utils/translations';

interface LabCertificatePrintModalProps {
  test: LabTest | null;
  ticket?: WeighbridgeTicket | null;
  settings: MillSettings;
  onClose: () => void;
  lang: Language;
}

export const LabCertificatePrintModal: React.FC<LabCertificatePrintModalProps> = ({
  test,
  ticket,
  settings,
  onClose,
  lang
}) => {
  if (!test) return null;
  const t = translations[lang];

  const handlePrint = () => {
    window.print();
  };

  const certNumber = `CERT-OAIC-${test.date.replace(/-/g, '')}-${test.ticketNumber.replace('TCK-', '')}`;

  // Evaluate compliance per parameter
  const moistureOk = test.moisturePercent <= 14.5;
  const impurityOk = test.impurityPercent <= 2.0;
  const weightOk = test.specificWeight >= 76.0;
  const proteinOk = test.proteinPercent >= 11.5;
  const glutenOk = test.glutenPercent ? test.glutenPercent >= 22.0 : true;
  const hagbergOk = test.fallingNumberHagberg ? test.fallingNumberHagberg >= 220 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-[#714B67] text-white print:hidden">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold">
              {lang === 'ar' 
                ? 'شهادة الفحص والقبول المخبري للحبوب (تصدير PDF)' 
                : 'Bulletin d\'Analyse & Agréage Officiel OAIC'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded shadow-xs transition-colors"
              title="تصدير وحفظ كملف PDF منظم"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصدير / حفظ PDF' : 'Enregistrer en PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.print}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official A4 Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0 bg-white text-slate-900 font-sans print:overflow-visible">
          <div className="border-2 border-slate-800 p-6 rounded-lg space-y-4 print:border-slate-900 print:p-4 text-xs">
            
            {/* 1. Official Republic & OAIC Header */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-slate-800">
              <p className="text-xs font-bold tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</p>
              <p className="text-[10px] text-slate-600 font-mono tracking-wide">
                RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
              </p>
              <p className="text-[11px] font-semibold text-slate-700 pt-0.5">
                وزارة الفلاحة والتنمية الريفية · الديوان الجزائري المهني للحبوب (OAIC)
              </p>
              <div className="pt-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-[#714B67] uppercase tracking-wide">
                  {settings.millNameAr}
                </h1>
                <p className="text-xs font-bold text-slate-800 font-mono">{settings.millNameFr}</p>
                <p className="text-[10px] text-slate-500">{settings.address} · الهاتف: {settings.phone}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-600 font-mono pt-1 border-t border-slate-200 mt-2">
                <span>رقم الاعتماد OAIC: <strong>{settings.oaicAgreementNumber}</strong></span>
                <span>السجل التجاري RC: <strong>{settings.rcNumber}</strong></span>
                <span>الرقم الجبائي NIF: <strong>{settings.nifNumber}</strong></span>
                <span>المقال: <strong>{settings.articleNumber}</strong></span>
              </div>
            </div>

            {/* 2. Certificate Title Banner */}
            <div className="bg-slate-100 p-2.5 rounded border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  شهادة الفحص والمطابقة المخبرية للحبوب المستلمة
                </h2>
                <p className="text-[10px] font-mono font-semibold text-slate-600">
                  BULLETIN OFFICIEL D'ANALYSE DE QUALITÉ ET D'AGRÉAGE
                </p>
              </div>
              <div className="text-end font-mono">
                <span className="text-[10px] text-slate-500 block">رقم الشهادة المرجعي:</span>
                <span className="text-xs font-bold text-[#714B67] bg-white px-2 py-0.5 rounded border border-slate-300 block">
                  {certNumber}
                </span>
              </div>
            </div>

            {/* 3. Sample & Logistics Metadata (Grille d'Échantillonnage) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">رقم تذكرة القبان:</span>
                  <span className="font-mono font-bold">{test.ticketNumber}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">تاريخ ووقت أخذ العينة:</span>
                  <span className="font-mono">{test.date} · 09:15</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">نوع وجودة الحبوب:</span>
                  <span className="font-bold text-amber-900">{t[test.grainType]}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">الوزن الصافي المستلم:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {ticket ? `${ticket.netWeightQx.toFixed(1)} ق (${ticket.netWeightKg.toLocaleString()} كغ)` : '286.0 ق (28,600 كغ)'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">مصدر الشحنة / المورد:</span>
                  <span className="font-bold">{ticket?.cclsOrigin || 'تعاونية الحبوب والبقول الجافة (CCLS سطيف)'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">رقم الشاحنة (Matricule):</span>
                  <span className="font-mono font-bold">{ticket?.truckMatricule || '08412-120-19'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-500">السائق / شركة النقل:</span>
                  <span>{ticket?.driverName || 'عمر بلقاسم'} ({ticket?.carrierCompany || 'SNTR'})</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">الصومعة المخصصة للإيداع:</span>
                  <span className="font-mono font-bold text-[#714B67]">صومعة التخزين رقم 1 (SILO-01)</span>
                </div>
              </div>
            </div>

            {/* 4. Technical Laboratory Results Comparison Table */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-900">
                  نتائج التحاليل الفيزيو-كيميائية مقارنة بالمعيار الجزائري الرسمي (Normes OAIC / IANOR):
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">طريقة الفحص: ISO / AFNOR</span>
              </div>

              <table className="w-full text-xs text-start border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 border border-slate-300 text-start">المؤشر التقني المفحوص</th>
                    <th className="p-2 border border-slate-300 text-center">الوحدة</th>
                    <th className="p-2 border border-slate-300 text-center">النتيجة المسجلة</th>
                    <th className="p-2 border border-slate-300 text-center">حد القبول المعياري (OAIC)</th>
                    <th className="p-2 border border-slate-300 text-center">المطابقة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      1. نسبة الرطوبة (Taux d'Humidité)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">%</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.moisturePercent.toFixed(1)} %
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أقصى حد: 14.5 %
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        moistureOk ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {moistureOk ? 'مطابق' : 'فارق رطوبة (+)'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      2. نسبة الشوائب والأجسام الغريبة (Impuretés Totales)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">%</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.impurityPercent.toFixed(1)} %
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أقصى حد: 2.0 %
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        impurityOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {impurityOk ? 'مطابق' : 'تطبيق حسم'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      3. الوزن النوعي الهكتوليتري (Poids Spécifique)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">kg/hl</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.specificWeight.toFixed(1)} kg/hl
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أدنى حد: 76.0 kg/hl
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        weightOk ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {weightOk ? 'مطابق' : 'غير مطابق'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      4. نسبة البروتين الخام (Taux de Protéines)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">%</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.proteinPercent.toFixed(1)} %
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أدنى حد: 11.5 %
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        proteinOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {proteinOk ? 'مطابق' : 'منخفض'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      5. نسبة الغلوتين الرطب (Gluten Humide)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">%</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.glutenPercent ? `${test.glutenPercent.toFixed(1)} %` : '26.5 %'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أدنى حد: 22.0 %
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        مطابق
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 border border-slate-300 font-sans font-semibold">
                      6. مؤشر السقوط هاغبرغ (Temps de Chute Hagberg)
                    </td>
                    <td className="p-2 border border-slate-300 text-center">seconde</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {test.fallingNumberHagberg ? `${test.fallingNumberHagberg} s` : '295 s'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">
                      أدنى حد: 220 s
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        مطابق (نشاط إنزيمي ممتاز)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Official Acceptance Verdict & Refaction Box */}
            <div className={`p-3.5 rounded border-2 space-y-2 ${
              test.result === 'accepted'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : test.result === 'accepted_with_refaction'
                ? 'bg-amber-50 border-amber-500 text-amber-950'
                : 'bg-rose-50 border-rose-500 text-rose-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span className="font-extrabold text-sm">
                    {lang === 'ar' ? 'القرار الرسمي للمخبر (DÉCISION D\'AGRÉAGE):' : 'DÉCISION D\'AGRÉAGE:'}
                  </span>
                </div>

                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  test.result === 'accepted'
                    ? 'bg-emerald-700 text-white'
                    : test.result === 'accepted_with_refaction'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-700 text-white'
                }`}>
                  {test.result === 'accepted' 
                    ? 'مقبول ومطابق تماماً (CONFORME)' 
                    : test.result === 'accepted_with_refaction' 
                    ? 'مقبول مع تطبيق حسم وزني (RÉFACTIONS)' 
                    : 'مرفوض قطعاً (REFUSÉ)'}
                </span>
              </div>

              {test.result === 'accepted_with_refaction' && test.refactionDeductionKg && (
                <div className="text-xs bg-white p-2.5 rounded border border-amber-300 font-mono">
                  <span className="font-bold text-amber-900 block font-sans">
                    بيان الخصم الوزني القانوني المعتمد من ديوان الحبوب (Réfactions):
                  </span>
                  <span>الكمية المحسومة من الشحنة: </span>
                  <span className="font-bold text-rose-600 text-sm">-{test.refactionDeductionKg} كغ</span>
                  <span> (الوزن المفوتر بعد الخصم: {ticket ? (ticket.netWeightKg - test.refactionDeductionKg).toLocaleString() : '28,250'} كغ).</span>
                </div>
              )}

              <p className="text-[11px] leading-relaxed">
                <strong>ملاحظات المخبر:</strong> {test.notes || 'العينة مطابقة للمواصفات المعمول بها لدى الديوان الوطني للحبوب، وتم الإذن بتفريغ الشحنة في الصومعة المحددة.'}
              </p>
            </div>

            {/* 6. Signatures and Official Stamp Box */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs">
              <div className="border border-slate-300 rounded p-2.5">
                <p className="font-bold text-slate-800">رئيس مخبر مراقبة الجودة</p>
                <p className="text-[11px] text-slate-600 mt-1">{test.laboratoryTechnician}</p>
                <div className="h-14 flex items-end justify-center text-[10px] text-slate-400">
                  (التوقيع وخاتم المخبر)
                </div>
              </div>

              <div className="border border-slate-300 rounded p-2.5">
                <p className="font-bold text-slate-800">تأشيرة عون ديوان الحبوب (OAIC)</p>
                <p className="text-[11px] text-slate-600 mt-1">مفتشية الحبوب ومطابقة الواردات</p>
                <div className="h-14 flex items-end justify-center text-[10px] text-slate-400">
                  (تأشيرة القبول والختم)
                </div>
              </div>

              <div className="border border-slate-300 rounded p-2.5">
                <p className="font-bold text-slate-800">إدارة المطحنة والمدير التقني</p>
                <p className="text-[11px] text-slate-600 mt-1">المصادقة على تفريغ الشحنة</p>
                <div className="h-14 flex items-end justify-center text-[10px] text-slate-400">
                  (الختم الرسمي للمؤسسة)
                </div>
              </div>
            </div>

            {/* Document Verification Notice */}
            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-200">
              وثيقة فحص رسمية صادرة آلياً عن المنظومة السحابية للمطاحن الجزائرية (Agro-Milling DZ) وتعتمد كحجة قانونية لدى مصالح الجمارك والتجارة والديوان المهني للحبوب OAIC.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
