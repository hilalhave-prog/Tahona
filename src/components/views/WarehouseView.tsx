import React, { useState } from 'react';
import { Package, Plus, Search, AlertCircle, CheckCircle2, TrendingUp, Layers } from 'lucide-react';
import { WarehouseItem } from '../../types';
import { Language, translations, formatCurrency, formatWeightQx } from '../../utils/translations';

interface WarehouseViewProps {
  warehouse: WarehouseItem[];
  onUpdateStock: (id: string, deltaBags: number) => void;
  lang: Language;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  warehouse,
  onUpdateStock,
  lang
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = warehouse.filter((item) => {
    const matchesSearch =
      item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storageBay.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && item.category === selectedCategory;
  });

  const totalBags = warehouse.reduce((acc, curr) => acc + curr.stockBags, 0);
  const totalWeightQx = warehouse.reduce((acc, curr) => acc + curr.totalWeightQx, 0);
  const totalFinancialValueDZD = warehouse.reduce((acc, curr) => acc + (curr.stockBags * curr.pricePerUnitDZD), 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'مخزن المنتجات الجاهزة والتعبئة (Magasin Produits Finis)' : 'Gestion des Stocks de Produits Finis'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'متابعة أكياس الفرينة والسميد والنخالة الجاهزة للشحن، رصد عنابر التخزين والتقييم المالي للمخزون بالدينار الجزائري.'
              : 'Suivi des palettes de sacs de farine panifiable, semoules et son conditionnés prêts à la livraison.'}
          </p>
        </div>
      </div>

      {/* Warehouse Visual Spotlight with Generated Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[200px] flex flex-col justify-end p-6 text-white">
          <img
            src="/src/assets/images/packaged_flour_semolina_1794130776478.jpg"
            alt="Flour Warehouse"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="relative z-10 space-y-1.5">
            <span className="text-xs font-bold text-amber-400">
              عنابر التخزين اللوجستية المهيأة
            </span>
            <h3 className="text-lg font-extrabold text-white">
              {lang === 'ar' ? 'تخزين على المنصات الخشبية (Palettisation) ومطابقة معايير النظافة' : 'Palettisation Conforme et Traçabilité des Lots'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              تضمن منظومة التخزين حفظ أكياس فرينة الخبز 50 كغ وعبوات السميد 25 كغ في بيئة جافة ومهواة بعيداً عن الرطوبة وتتبع أرقام الدفعات ومدة الصلاحية المقننة.
            </p>
          </div>
        </div>

        {/* Financial Valuation Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              {lang === 'ar' ? 'القيمة المالية الإجمالية للمخزون' : 'Valeur Financière du Stock'}
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
              {formatCurrency(totalFinancialValueDZD, lang)}
            </div>
            <div className="space-y-1 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>إجمالي الأكياس:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{totalBags.toLocaleString()} كيس</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي الوزن الصافي:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatWeightQx(totalWeightQx, lang)}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2">
            الأسعار المدعمة محددة قانونياً بالمرسوم التنفيذي لأسعار الحبوب
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث باسم المنتج أو العنبر...' : 'Rechercher un produit...'}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'جميع المنتجات' : 'Tous'}
          </button>
          <button
            onClick={() => setSelectedCategory('farine')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'farine'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'الفرينة (Farines)' : 'Farines'}
          </button>
          <button
            onClick={() => setSelectedCategory('semoule')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'semoule'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'السميد (Semoules)' : 'Semoules'}
          </button>
          <button
            onClick={() => setSelectedCategory('sous_produit')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'sous_produit'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'النخالة والأعلاف' : 'Son & Aliments'}
          </button>
        </div>
      </div>

      {/* Warehouse Items Grid & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-3 text-start font-semibold">اسم المنتج</th>
                <th className="p-3 text-center font-semibold">التعبئة</th>
                <th className="p-3 text-center font-semibold">وزن الوحدة</th>
                <th className="p-3 text-center font-semibold">النظام السعري</th>
                <th className="p-3 text-end font-semibold">سعر الوحدة</th>
                <th className="p-3 text-end font-semibold">المخزون المتوفر</th>
                <th className="p-3 text-end font-semibold">الوزن الإجمالي</th>
                <th className="p-3 text-start font-semibold">عنبر التخزين</th>
                <th className="p-3 text-center font-semibold">حالة الرصيد</th>
                <th className="p-3 text-end font-semibold">تعديل سريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const isLow = item.stockBags <= item.minThresholdBags;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? item.nameAr : item.nameFr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.productType}</div>
                    </td>
                    <td className="p-3 text-center font-mono">
                      {item.packaging}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums">
                      {item.unitWeightKg} كغ
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[11px] font-semibold ${item.isSubsidized ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {item.isSubsidized ? t.subsidized : t.nonSubsidized}
                      </span>
                    </td>
                    <td className="p-3 text-end font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(item.pricePerUnitDZD, lang)}
                    </td>
                    <td className="p-3 text-end font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {item.stockBags.toLocaleString()} كيس
                    </td>
                    <td className="p-3 text-end font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      {item.totalWeightQx.toFixed(1)} ق
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                      {item.storageBay}
                    </td>
                    <td className="p-3 text-center">
                      {isLow ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span>مخزون حرج</span>
                          </span>
                          <span className="text-[9px] text-rose-500 font-mono mt-0.5">
                            الحد: {item.minThresholdBags} كيس
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>طبيعي</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-end">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, 50)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded"
                          title="إضافة 50 كيس من خط التعبئة"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, -50)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded"
                          title="خصم 50 كيس"
                        >
                          -50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
