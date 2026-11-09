import React, { useState } from 'react';
import { X, Store, CheckCircle } from 'lucide-react';
import { BakeryClient } from '../../types';
import { Language, translations } from '../../utils/translations';

interface NewBakeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBakery: (bakery: BakeryClient) => void;
  defaultWilaya?: string;
  lang: Language;
}

export const NewBakeryModal: React.FC<NewBakeryModalProps> = ({
  isOpen,
  onClose,
  onAddBakery,
  defaultWilaya = 'سطيف',
  lang
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [clientType, setClientType] = useState<'boulangerie' | 'grossiste' | 'industriel'>('boulangerie');
  const [wilaya, setWilaya] = useState(defaultWilaya);
  const [commune, setCommune] = useState('');
  const [monthlyQuotaQx, setMonthlyQuotaQx] = useState<number>(300);
  const [phone, setPhone] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [nifNumber, setNifNumber] = useState('');
  const [articleNumber, setArticleNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !ownerName) return;

    const newBakery: BakeryClient = {
      id: `bak-${Date.now()}`,
      nameAr,
      nameFr: nameFr || nameAr,
      ownerName,
      clientType,
      wilaya: wilaya || defaultWilaya,
      commune: commune || 'وسط المدينة',
      monthlyQuotaQx: monthlyQuotaQx || 300,
      consumedQuotaQx: 0,
      phone: phone || '0550 00 00 00',
      rcNumber: rcNumber || '19/00-109482 A 26',
      nifNumber: nifNumber || '198219001094821',
      nisNumber: '00191982001',
      articleNumber: articleNumber || '190209418',
      status: 'active'
    };

    onAddBakery(newBakery);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#714B67] text-white">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold">
              {lang === 'ar' ? 'تسجيل مخبزة معتمدة جديدة (حصة الفرينة)' : 'Nouvelle Boulangerie Conventionnée'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                اسم المخبزة بالعربية *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: مخبزة السلام الحديثة"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                اسم المسؤول / صاحب المخبزة *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: كريم حيدر"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                صنف العميل
              </label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="boulangerie">مخبزة معتمدة (حصة مدعمة)</option>
                <option value="grossiste">تاجر جملة معتمد</option>
                <option value="industriel">مصنع بسكويت وعجائن</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الحصة الشهرية (قنطار) *
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={monthlyQuotaQx}
                onChange={(e) => setMonthlyQuotaQx(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                البلدية
              </label>
              <input
                type="text"
                placeholder="مثال: العلمة"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                رقم السجل التجاري (RC)
              </label>
              <input
                type="text"
                placeholder="19/00-109482 A 26"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الرقم الجبائي (NIF)
              </label>
              <input
                type="text"
                placeholder="198219001094821"
                value={nifNumber}
                onChange={(e) => setNifNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                placeholder="0555 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] rounded-lg shadow-sm"
            >
              تسجيل المخبزة وتفعيل الحصة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
