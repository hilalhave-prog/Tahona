import React from 'react';
import { X, Printer, CheckCircle, Scale } from 'lucide-react';
import { WeighbridgeTicket, Silo, MillSettings } from '../../types';
import { Language, translations } from '../../utils/translations';

interface WeighbridgeTicketModalProps {
  ticket: WeighbridgeTicket | null;
  silo?: Silo;
  settings: MillSettings;
  onClose: () => void;
  lang: Language;
}

export const WeighbridgeTicketModal: React.FC<WeighbridgeTicketModalProps> = ({
  ticket,
  silo,
  settings,
  onClose,
  lang
}) => {
  if (!ticket) return null;
  const t = translations[lang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? 'معاينة تذكرة الوزن الرسمية' : 'Aperçu du Ticket de Pesée Officiel'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.print}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-8 overflow-y-auto print:p-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="border-2 border-slate-900 dark:border-slate-300 p-6 rounded-lg space-y-4">
            {/* Republic Header */}
            <div className="text-center space-y-1 pb-3 border-b border-slate-300 dark:border-slate-700">
              <p className="text-xs font-semibold tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans tracking-wide">
                RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
              </p>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400 pt-1">
                {settings.millNameAr}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                {settings.millNameFr} · {settings.wilayaFr}
              </p>
              <div className="flex justify-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                <span>RC: {settings.rcNumber}</span>
                <span>NIF: {settings.nifNumber}</span>
                <span>Agrément OAIC: {settings.oaicAgreementNumber}</span>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-100 dark:bg-slate-800 py-2 px-4 rounded text-center">
              <h2 className="text-base font-extrabold tracking-wide">
                تذكرة وزن قبان معتمد / TICKET DE PESÉE PONT-BASCULE
              </h2>
              <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                N° {ticket.ticketNumber}
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 text-xs border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-slate-500">{lang === 'ar' ? 'التاريخ والوقت:' : 'Date & Heure:'} </span>
                <span className="font-semibold font-mono">{ticket.date} - {ticket.time}</span>
              </div>
              <div className="text-end">
                <span className="text-slate-500">{lang === 'ar' ? 'حالة التذكرة:' : 'Statut:'} </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {ticket.status === 'unloaded' ? 'تم التفريغ' : 'مقبول بالصوامع'}
                </span>
              </div>
            </div>

            {/* Truck and Driver details */}
            <div className="grid grid-cols-2 text-xs gap-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'رقم ترقيم الشاحنة (Matricule):' : 'Matricule Véhicule:'}</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{ticket.truckMatricule}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'اسم السائق:' : 'Nom du Chauffeur:'}</span>
                <span className="font-semibold">{ticket.driverName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'الناقل / المؤسسة:' : 'Transporteur:'}</span>
                <span className="font-medium">{ticket.carrierCompany}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'المصدر (تعاونية الحبوب):' : 'Origine CCLS / Port:'}</span>
                <span className="font-semibold text-amber-800 dark:text-amber-300">{ticket.cclsOrigin}</span>
              </div>
            </div>

            {/* Grain & Silo */}
            <div className="grid grid-cols-2 text-xs gap-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'نوع الحبوب الواردة:' : 'Nature du Produit:'}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {t[ticket.grainType]}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'الصومعة المستقبلة:' : 'Silo de Destination:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {silo ? `${silo.code} - ${lang === 'ar' ? silo.nameAr : silo.nameFr}` : 'صومعة الاستقبال العامة'}
                </span>
              </div>
            </div>

            {/* Big Weight Figures Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              <div className="p-2 border-e border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">{lang === 'ar' ? 'الوزن الإجمالي (بالمحصول)' : 'Poids Brut (1ère Pesée)'}</span>
                <span className="text-sm font-bold font-mono tabular-nums">{ticket.grossWeightKg.toLocaleString()} كغ</span>
              </div>
              <div className="p-2 border-e border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">{lang === 'ar' ? 'وزن الشاحنة فارغة (Tare)' : 'Tare (2ème Pesée)'}</span>
                <span className="text-sm font-bold font-mono tabular-nums">{ticket.tareWeightKg.toLocaleString()} كغ</span>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-950/60 rounded">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">{lang === 'ar' ? 'الوزن الصافي المستلم' : 'POIDS NET LIVRÉ'}</span>
                <span className="text-base font-extrabold font-mono tabular-nums text-amber-700 dark:text-amber-400">
                  {ticket.netWeightKg.toLocaleString()} كغ
                </span>
                <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">
                  ({ticket.netWeightQx.toFixed(1)} قنطار / {(ticket.netWeightKg / 1000).toFixed(2)} طن)
                </span>
              </div>
            </div>

            {/* Notes */}
            {ticket.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded">
                <span className="font-semibold">{t.notes}: </span>
                <span>{ticket.notes}</span>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'عون القبان والوزن' : 'L\'Agent Pont-Bascule'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(توقيع وختم القبان)</p>
              </div>
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'سائق الشاحنة' : 'Le Chauffeur'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(توقيع المستلم)</p>
              </div>
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'مسؤول الصوامع والمخزن' : 'Le Chef de Silos'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(موافقة التفريغ)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
