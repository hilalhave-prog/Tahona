import React, { useState } from 'react';
import { X, Store, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { BakeryClient, WarehouseItem, DeliveryBon, DeliveryItem, ProductType } from '../../types';
import { Language, translations, formatCurrency } from '../../utils/translations';

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bakeries: BakeryClient[];
  warehouseItems: WarehouseItem[];
  onAddDelivery: (delivery: DeliveryBon) => void;
  lang: Language;
}

export const NewDeliveryModal: React.FC<NewDeliveryModalProps> = ({
  isOpen,
  onClose,
  bakeries,
  warehouseItems,
  onAddDelivery,
  lang
}) => {
  const t = translations[lang];

  const [selectedClientId, setSelectedClientId] = useState<string>(bakeries[0]?.id || '');
  const [truckMatricule, setTruckMatricule] = useState('09812-119-19');
  const [driverName, setDriverName] = useState('سعيد بن دحمان');
  const [paymentMethod, setPaymentMethod] = useState<'especes' | 'cheque' | 'virement'>('especes');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [notes, setNotes] = useState('');

  // Items in the delivery
  const [items, setItems] = useState<DeliveryItem[]>([
    {
      productType: 'farine_panifiable_55',
      productNameAr: 'فرينة الخبز المدعمة نوع 55 (مخابز)',
      packaging: 'sac_50kg',
      quantityBags: 60,
      unitWeightKg: 50,
      totalWeightQx: 30,
      unitPriceDZD: 1000,
      totalAmountDZD: 60000
    }
  ]);

  if (!isOpen) return null;

  const selectedClient = bakeries.find((b) => b.id === selectedClientId) || bakeries[0];

  const handleAddItem = () => {
    const defaultProduct = warehouseItems[0];
    if (!defaultProduct) return;
    const newItem: DeliveryItem = {
      productType: defaultProduct.productType,
      productNameAr: defaultProduct.nameAr,
      packaging: defaultProduct.packaging,
      quantityBags: 20,
      unitWeightKg: defaultProduct.unitWeightKg,
      totalWeightQx: (20 * defaultProduct.unitWeightKg) / 100,
      unitPriceDZD: defaultProduct.pricePerUnitDZD,
      totalAmountDZD: 20 * defaultProduct.pricePerUnitDZD
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productType: ProductType) => {
    const whItem = warehouseItems.find((w) => w.productType === productType);
    if (!whItem) return;

    const updated = [...items];
    const qty = updated[index].quantityBags;
    updated[index] = {
      ...updated[index],
      productType: whItem.productType,
      productNameAr: whItem.nameAr,
      packaging: whItem.packaging,
      unitWeightKg: whItem.unitWeightKg,
      totalWeightQx: (qty * whItem.unitWeightKg) / 100,
      unitPriceDZD: whItem.pricePerUnitDZD,
      totalAmountDZD: qty * whItem.pricePerUnitDZD
    };
    setItems(updated);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const quantity = Math.max(1, qty);
    const updated = [...items];
    const item = updated[index];
    updated[index] = {
      ...item,
      quantityBags: quantity,
      totalWeightQx: (quantity * item.unitWeightKg) / 100,
      totalAmountDZD: quantity * item.unitPriceDZD
    };
    setItems(updated);
  };

  const totalWeightQx = items.reduce((acc, curr) => acc + curr.totalWeightQx, 0);
  const subtotalDZD = items.reduce((acc, curr) => acc + curr.totalAmountDZD, 0);
  
  // Calculate TVA: Subsidized products (farine 55, semoule courante) are 0% exempt in Algeria
  const taxableAmount = items.reduce((acc, curr) => {
    const whItem = warehouseItems.find((w) => w.productType === curr.productType);
    if (whItem && !whItem.isSubsidized) {
      return acc + curr.totalAmountDZD;
    }
    return acc;
  }, 0);
  const tvaDZD = Math.round(taxableAmount * 0.09); // 9% TVA
  const totalAmountDZD = subtotalDZD + tvaDZD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || items.length === 0) return;

    const newBon: DeliveryBon = {
      id: `bl-${Date.now()}`,
      bonNumber: `BL-2026-${Math.floor(1400 + Math.random() * 8500)}`,
      invoiceNumber: `FAC-2026-${Math.floor(800 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      clientId: selectedClient.id,
      clientName: `${lang === 'ar' ? selectedClient.nameAr : selectedClient.nameFr} (${selectedClient.commune})`,
      clientType: selectedClient.clientType,
      items,
      totalWeightQx,
      subtotalDZD,
      tvaDZD,
      totalAmountDZD,
      truckMatricule,
      driverName,
      paymentMethod,
      paymentStatus,
      notes: notes || 'تم التسليم والمطابقة بموجب الحصة المعتمدة'
    };

    onAddDelivery(newBon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'إصدار إذن تسليم وفاتورة مخبزة / زبون' : 'Nouveau Bon de Livraison / Vente'}
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
          {/* Client Selection & Quota Status */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'اختيار المخبزة أو العميل' : 'Sélectionnez le Client / Boulangerie'}
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {bakeries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {lang === 'ar' ? b.nameAr : b.nameFr} - {b.commune} ({b.clientType === 'boulangerie' ? 'مخبزة معتمدة' : 'تاجر جملة'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedClient && selectedClient.clientType === 'boulangerie' && (
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-500">{lang === 'ar' ? 'متابعة الحصة الشهرية المدعمة:' : 'Quota Mensuel:'}</span>
                    <span className="font-bold font-mono text-amber-700 dark:text-amber-400">
                      {selectedClient.consumedQuotaQx} / {selectedClient.monthlyQuotaQx} {t.quintal}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        selectedClient.consumedQuotaQx / selectedClient.monthlyQuotaQx > 0.85
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (selectedClient.consumedQuotaQx / selectedClient.monthlyQuotaQx) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar' ? 'الرصيد المتاح لهذا الشهر: ' : 'Solde restant: '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedClient.monthlyQuotaQx - selectedClient.consumedQuotaQx} {t.quintal}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {lang === 'ar' ? 'قائمة المنتجات المسلمة والأكياس' : 'Articles et Sacs à Livrer'}
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة منتج' : 'Ajouter un produit'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={item.productType}
                      onChange={(e) => handleProductChange(idx, e.target.value as ProductType)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                    >
                      {warehouseItems.map((wh) => (
                        <option key={wh.id} value={wh.productType}>
                          {lang === 'ar' ? wh.nameAr : wh.nameFr} ({wh.packaging}) - متوفر: {wh.stockBags} كيس
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantityBags}
                      onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono tabular-nums text-slate-900 dark:text-white"
                      placeholder="عدد الأكياس"
                    />
                  </div>

                  <div className="w-24 text-xs font-mono text-slate-600 dark:text-slate-400">
                    {item.totalWeightQx.toFixed(1)} {t.quintal}
                  </div>

                  <div className="w-28 text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(item.totalAmountDZD, lang)}
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'رقم شاحنة التسليم' : 'Matricule Camion'}
              </label>
              <input
                type="text"
                value={truckMatricule}
                onChange={(e) => setTruckMatricule(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'سائق التسليم' : 'Chauffeur Livreur'}
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'طريقة الدفع' : 'Mode de Paiement'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              >
                <option value="especes">نقداً (Espèces)</option>
                <option value="cheque">شيك بنكي (Chèque)</option>
                <option value="virement">تحويل بنكي (Virement)</option>
              </select>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'إجمالي الوزن الصافي:' : 'Poids Total Livré:'}</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{totalWeightQx.toFixed(1)} {t.quintal} ({(totalWeightQx / 10).toFixed(2)} {t.tonne})</span>
            </div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'المجموع بدون رسم (HT):' : 'Montant HT:'}</span>
              <span className="font-mono">{formatCurrency(subtotalDZD, lang)}</span>
            </div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'الرسم على القيمة المضافة (TVA 9%):' : 'TVA (9%):'}</span>
              <span className="font-mono text-slate-500">{tvaDZD > 0 ? formatCurrency(tvaDZD, lang) : 'معفى (منتج مدعم)'}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-amber-200 dark:border-amber-800">
              <span className="text-amber-900 dark:text-amber-200">{lang === 'ar' ? 'المبلغ الإجمالي المستحق (TTC):' : 'Total Général (TTC):'}</span>
              <span className="font-mono text-base text-amber-700 dark:text-amber-400">{formatCurrency(totalAmountDZD, lang)}</span>
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
              {lang === 'ar' ? 'تأكيد التسليم وخصم المخزون' : 'Valider & Déduire du Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
