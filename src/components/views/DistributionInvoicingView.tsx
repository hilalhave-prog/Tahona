import React, { useState } from 'react';
import { Store, Plus, Search, Printer, FileText, CheckCircle2, AlertTriangle, Building, Phone } from 'lucide-react';
import { BakeryClient, DeliveryBon } from '../../types';
import { Language, translations, formatCurrency, formatWeightQx } from '../../utils/translations';

interface DistributionInvoicingViewProps {
  bakeries: BakeryClient[];
  deliveries: DeliveryBon[];
  onOpenNewDelivery: () => void;
  onOpenNewBakery?: () => void;
  onPrintDelivery: (delivery: DeliveryBon) => void;
  lang: Language;
}

export const DistributionInvoicingView: React.FC<DistributionInvoicingViewProps> = ({
  bakeries,
  deliveries,
  onOpenNewDelivery,
  onOpenNewBakery,
  onPrintDelivery,
  lang
}) => {
  const t = translations[lang];

  const [activeSubTab, setActiveSubTab] = useState<'deliveries' | 'bakeries'>('deliveries');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeliveries = deliveries.filter((d) =>
    d.bonNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.truckMatricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBakeries = bakeries.filter((b) =>
    b.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDeliveredTodayQx = deliveries.reduce((acc, curr) => acc + curr.totalWeightQx, 0);
  const totalSalesDZD = deliveries.reduce((acc, curr) => acc + curr.totalAmountDZD, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'توزيع المخابز والفوترة (Boulangeries & Facturation)' : 'Distribution aux Boulangeries & Ventes'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'متابعة حصص المخابز المعتمدة لفرينة الخبز المدعمة، إصدار أذونات التسليم والفواتير الرسمية بأرقام RC وNIF.'
              : 'Gestion des quotas subventionnés de farine panifiable, bons de livraison et factures réglementaires.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewBakery && (
            <button
              onClick={onOpenNewBakery}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مخبزة جديدة' : 'Nouvelle Boulangerie'}</span>
            </button>
          )}

          <button
            onClick={onOpenNewDelivery}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnNewDelivery}</span>
          </button>
        </div>
      </div>

      {/* Distribution KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'إجمالي الكميات المسلمة' : 'Volume Livré'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(totalDeliveredTodayQx, lang)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            شحنات المخابز وتجار الجملة المعتمدين
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'رقم الأعمال الإجمالي (TTC)' : 'Chiffre d\'Affaires Total'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
            {formatCurrency(totalSalesDZD, lang)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            معفى من الرسم على القيمة المضافة لفرينة الخبز
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'شبكة المخابز المعتمدة المرتبطة' : 'Boulangeries Conventionnées'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {bakeries.length} مخبزة وتاجر
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            تحت إشراف مديريات التجارة الولائية (DCP)
          </p>
        </div>
      </div>

      {/* Sub-tab navigation & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSubTab('deliveries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'deliveries'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'أذونات التسليم والفواتير' : 'Bons de Livraison & Factures'}
          </button>
          <button
            onClick={() => setActiveSubTab('bakeries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'bakeries'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'دليل المخابز والحصص الشهرية' : 'Quotas Mensuels des Boulangers'}
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeSubTab === 'deliveries' ? 'بحث برقم الإذن، العميل...' : 'بحث باسم المخبزة، البلدية...'}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* View 1: Deliveries and Invoices Table */}
      {activeSubTab === 'deliveries' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-3 text-start font-semibold">رقم الإذن / الفاتورة</th>
                  <th className="p-3 text-start font-semibold">التاريخ</th>
                  <th className="p-3 text-start font-semibold">المخبزة / الزبون</th>
                  <th className="p-3 text-start font-semibold">المنتجات المسلمة</th>
                  <th className="p-3 text-end font-semibold">الوزن (ق)</th>
                  <th className="p-3 text-end font-semibold">المبلغ الإجمالي</th>
                  <th className="p-3 text-start font-semibold">الشاحنة / السائق</th>
                  <th className="p-3 text-center font-semibold">الدفع</th>
                  <th className="p-3 text-end font-semibold">طباعة ومعاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-700 dark:text-amber-400">
                        {delivery.bonNumber}
                      </div>
                      {delivery.invoiceNumber && (
                        <div className="font-mono text-[10px] text-slate-400">{delivery.invoiceNumber}</div>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {delivery.date}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{delivery.clientName}</div>
                      <div className="text-[10px] text-slate-400">
                        {delivery.clientType === 'boulangerie' ? 'مخبزة معتمدة' : 'تاجر جملة'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {delivery.items.map((it, i) => (
                          <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{it.productNameAr}:</span>{' '}
                            <span className="font-mono font-bold">{it.quantityBags} كيس</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-end font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {delivery.totalWeightQx.toFixed(1)} ق
                    </td>
                    <td className="p-3 text-end font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      {formatCurrency(delivery.totalAmountDZD, lang)}
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-slate-800 dark:text-slate-200">{delivery.truckMatricule}</div>
                      <div className="text-[10px] text-slate-400">{delivery.driverName}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {delivery.paymentMethod === 'especes' ? 'نقداً' : delivery.paymentMethod === 'cheque' ? 'شيك بنكي' : 'تحويل'}
                      </span>
                    </td>
                    <td className="p-3 text-end">
                      <button
                        onClick={() => onPrintDelivery(delivery)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t.print}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Bakeries Quotas Table */}
      {activeSubTab === 'bakeries' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-3 text-start font-semibold">اسم المخبزة / المؤسسة</th>
                  <th className="p-3 text-start font-semibold">المسؤول القانوني</th>
                  <th className="p-3 text-start font-semibold">الولاية والبلدية</th>
                  <th className="p-3 text-center font-semibold">الحصة الشهرية (ق)</th>
                  <th className="p-3 text-center font-semibold">المستهلك حتى الآن</th>
                  <th className="p-3 text-center font-semibold">معدل الاستهلاك</th>
                  <th className="p-3 text-start font-semibold">المعرفات الجبائية (RC / NIF)</th>
                  <th className="p-3 text-start font-semibold">الهاتف</th>
                  <th className="p-3 text-center font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBakeries.map((bakery) => {
                  const percent = Math.min(100, Math.round((bakery.consumedQuotaQx / bakery.monthlyQuotaQx) * 100));
                  const isHigh = percent > 85;

                  return (
                    <tr key={bakery.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {lang === 'ar' ? bakery.nameAr : bakery.nameFr}
                        </div>
                        <div className="text-[10px] text-slate-400">{bakery.clientType === 'boulangerie' ? 'مخبزة معتمدة' : 'تاجر جملة'}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                        {bakery.ownerName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {bakery.wilaya} · {bakery.commune}
                      </td>
                      <td className="p-3 text-center font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {bakery.monthlyQuotaQx} ق
                      </td>
                      <td className="p-3 text-center font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                        {bakery.consumedQuotaQx} ق
                      </td>
                      <td className="p-3 text-center">
                        <div className="w-24 mx-auto space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>{percent}%</span>
                            <span>باقي: {bakery.monthlyQuotaQx - bakery.consumedQuotaQx} ق</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isHigh ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div>RC: {bakery.rcNumber}</div>
                        <div>NIF: {bakery.nifNumber}</div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-mono">
                        {bakery.phone}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[11px] font-semibold ${isHigh ? 'text-rose-600 font-bold' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {isHigh ? 'قارب النفاذ' : 'نشط'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
