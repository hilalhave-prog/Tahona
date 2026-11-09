import React, { useState } from 'react';
import { X, Wrench, CheckCircle } from 'lucide-react';
import { MaintenanceTask } from '../../types';
import { Language, translations } from '../../utils/translations';

interface NewMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaintenance: (task: MaintenanceTask) => void;
  lang: Language;
}

export const NewMaintenanceModal: React.FC<NewMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onAddMaintenance,
  lang
}) => {
  const [machineNameAr, setMachineNameAr] = useState('');
  const [section, setSection] = useState<'broyage' | 'sassage' | 'tamisage' | 'ensachage' | 'silos'>('broyage');
  const [component, setComponent] = useState('');
  const [currentHours, setCurrentHours] = useState<number>(100);
  const [maxServiceHours, setMaxServiceHours] = useState<number>(2000);
  const [technician, setTechnician] = useState('م. لخضر بوشارب');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineNameAr || !component) return;

    const newTask: MaintenanceTask = {
      id: `maint-${Date.now()}`,
      machineNameAr,
      machineNameFr: machineNameAr,
      section,
      component,
      currentHours,
      maxServiceHours,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      status: currentHours >= maxServiceHours ? 'critical' : currentHours >= maxServiceHours * 0.85 ? 'due_soon' : 'good',
      technician: technician || 'فريق الصيانة الميكانيكية'
    };

    onAddMaintenance(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#714B67] text-white">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold">
              {lang === 'ar' ? 'تسجيل صيانة وقائية لمعدات المطحنة' : 'Nouvelle Tâche de Maintenance'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              اسم الآلة / المعدة الصناعية *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: أسطوانات الطحن B3-B4 Bühler"
              value={machineNameAr}
              onChange={(e) => setMachineNameAr(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                قسم المطحنة (Section)
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="broyage">قسم الطحن والتكسير (Broyage)</option>
                <option value="tamisage">قسم المناخل الكبرى (Plansichters)</option>
                <option value="sassage">قسم أجهزة السوسوار (Sasseurs)</option>
                <option value="ensachage">قسم التعبئة الآلية (Ensachage)</option>
                <option value="silos">قسم الصوامع والتهوية (Silos)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                المهندس أو التقني المسؤول
              </label>
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              طبيعة التدخل أو الجزء المعني بالصيانة *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: تسنيم مجاري الأسطوانة وفحص محامل الدوران"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ساعات التشغيل الحالية (سا)
              </label>
              <input
                type="number"
                min="0"
                value={currentHours}
                onChange={(e) => setCurrentHours(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الحد الأقصى للخدمة (سا)
              </label>
              <input
                type="number"
                min="100"
                value={maxServiceHours}
                onChange={(e) => setMaxServiceHours(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
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
              تثبيت بطاقة الصيانة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
