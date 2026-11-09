import React from 'react';
import { X, Printer, Store, CheckCircle } from 'lucide-react';
import { DeliveryBon, MillSettings, BakeryClient } from '../../types';
import { Language, translations, formatCurrency } from '../../utils/translations';

interface DeliveryPrintModalProps {
  delivery: DeliveryBon | null;
  bakery?: BakeryClient;
  settings: MillSettings;
  onClose: () => void;
  lang: Language;
}

export const DeliveryPrintModal: React.FC<DeliveryPrintModalProps> = ({
  delivery,
  bakery,
  settings,
  onClose,
  lang
}) => {
  if (!delivery) return null;
  const t = translations[lang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? 'معاينة وطباعة الفاتورة وإذن التسليم الرسمي' : 'Aperçu Facture / Bon de Livraison'}
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

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto print:p-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="border border-slate-300 dark:border-slate-700 p-6 rounded-lg space-y-5">
            {/* Algerian Header */}
            <div className="flex justify-between items-start border-b border-slate-300 dark:border-slate-700 pb-4">
              <div>
                <h1 className="text-base font-extrabold text-amber-800 dark:text-amber-400">
                  {settings.millNameAr}
                </h1>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {settings.millNameFr}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{settings.address}</p>
                <p className="text-[11px] text-slate-500">{settings.phone} · {settings.email}</p>
                <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-600 dark:text-slate-400 font-mono mt-1">
                  <span>RC: {settings.rcNumber}</span>
                  <span>NIF: {settings.nifNumber}</span>
                  <span>NIS: {settings.nisNumber}</span>
                  <span>Art: {settings.articleNumber}</span>
                </div>
              </div>

              <div className="text-end">
                <div className="bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded inline-block text-end">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                    {delivery.invoiceNumber ? 'فاتورة وإذن تسليم' : 'إذن تسليم'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                    {delivery.invoiceNumber || delivery.bonNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 block">N° {delivery.bonNumber}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                  {lang === 'ar' ? 'التاريخ:' : 'Date:'} {delivery.date}
                </p>
              </div>
            </div>

            {/* Client Info Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-500 block mb-1">
                {lang === 'ar' ? 'معلومات العميل / المخبزة المستلمة:' : 'Destinataire / Boulangerie:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{delivery.clientName}</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {bakery ? `المسؤول: ${bakery.ownerName}` : ''}
                  </p>
                  <p className="text-slate-500">{bakery ? `الهاتف: ${bakery.phone}` : ''}</p>
                </div>
                {bakery && (
                  <div className="text-end font-mono text-[11px] space-y-0.5 text-slate-600 dark:text-slate-400">
                    <p>RC: {bakery.rcNumber}</p>
                    <p>NIF: {bakery.nifNumber}</p>
                    <p>NIS: {bakery.nisNumber}</p>
                    <p>Article: {bakery.articleNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-start border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-start">{lang === 'ar' ? 'التعيين والمنتج' : 'Désignation'}</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-center">{lang === 'ar' ? 'نوع العبوة' : 'Cond.'}</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-center">{lang === 'ar' ? 'عدد الأكياس' : 'Quantité'}</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-end">{lang === 'ar' ? 'الوزن (ق)' : 'Poids (Qx)'}</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-end">{lang === 'ar' ? 'سعر الوحدة' : 'Prix Unitaire'}</th>
                  <th className="p-2 border border-slate-200 dark:border-slate-700 text-end">{lang === 'ar' ? 'المبلغ الإجمالي' : 'Montant HT'}</th>
                </tr>
              </thead>
              <tbody>
                {delivery.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="p-2 border border-slate-200 dark:border-slate-700 font-semibold">{item.productNameAr}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-mono">{item.packaging}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-mono tabular-nums">{item.quantityBags}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-end font-mono tabular-nums">{item.totalWeightQx.toFixed(1)}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-end font-mono tabular-nums">{formatCurrency(item.unitPriceDZD, lang)}</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-end font-bold font-mono tabular-nums">{formatCurrency(item.totalAmountDZD, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals & Financial Box */}
            <div className="flex justify-between items-start gap-4">
              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  <span className="font-semibold">{lang === 'ar' ? 'طريقة التسديد:' : 'Mode de règlement:'} </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{delivery.paymentMethod}</span>
                </p>
                <p>
                  <span className="font-semibold">{lang === 'ar' ? 'رقم الشاحنة:' : 'Camion:'} </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{delivery.truckMatricule}</span> · السائق: {delivery.driverName}
                </p>
                {delivery.notes && <p className="italic text-slate-400">{delivery.notes}</p>}
              </div>

              <div className="w-64 text-xs space-y-1.5 bg-slate-50 dark:bg-slate-800/80 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total HT:</span>
                  <span className="font-bold tabular-nums">{formatCurrency(delivery.subtotalDZD, lang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TVA (9% / 0%):</span>
                  <span className="tabular-nums">{delivery.tvaDZD > 0 ? formatCurrency(delivery.tvaDZD, lang) : 'Exonéré'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-300 dark:border-slate-600 pt-1 text-amber-700 dark:text-amber-400">
                  <span>NET À PAYER:</span>
                  <span className="tabular-nums">{formatCurrency(delivery.totalAmountDZD, lang)}</span>
                </div>
              </div>
            </div>

            {/* Legal Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'مصلحة الفوترة والتوزيع' : 'Service Commercial'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(ختم المطحنة)</p>
              </div>
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'سائق الشاحنة' : 'Le Chauffeur'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(توقيع النقل)</p>
              </div>
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'الزبون / صاحب المخبزة' : 'Le Client'}</p>
                <p className="text-[10px] text-slate-400 mt-6">(استلمت البضاعة مطابقة)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
