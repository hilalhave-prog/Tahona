import React, { useState } from 'react';
import { 
  Database, 
  Cog, 
  Scale, 
  Store, 
  FlaskConical, 
  FileText, 
  Wrench, 
  FileSpreadsheet, 
  Search, 
  X 
} from 'lucide-react';
import { Language } from '../../utils/translations';

interface OdooAppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (appId: string) => void;
  lang: Language;
}

export const OdooAppLauncher: React.FC<OdooAppLauncherProps> = ({
  isOpen,
  onClose,
  onSelectApp,
  lang
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const apps = [
    {
      id: 'inventory',
      nameAr: 'المخزون والصوامع',
      nameFr: 'Inventaire & Silos',
      descAr: 'مستويات الصوامع، الأكياس والمستودعات',
      descFr: 'Niveaux silos, sacs et emplacements',
      icon: Database,
      bgColor: 'from-amber-500 to-amber-600',
      badge: '6 صوامع'
    },
    {
      id: 'mrp',
      nameAr: 'التصنيع والطحن (MRP)',
      nameFr: 'Fabrication & Mouture (MRP)',
      descAr: 'أوامر الطحن، نسب الاستخراج والورديات',
      descFr: 'Ordres de fabrication et rendements',
      icon: Cog,
      bgColor: 'from-purple-600 to-indigo-700',
      badge: 'خطان نشطان'
    },
    {
      id: 'purchases',
      nameAr: 'المشتريات وقبان الحبوب',
      nameFr: 'Achats & Pont-Bascule',
      descAr: 'تذاكر الوزن الآلي وشحنات OAIC',
      descFr: 'Pesées automatiques et arrivages OAIC',
      icon: Scale,
      bgColor: 'from-emerald-500 to-teal-700',
      badge: 'معاير ONML'
    },
    {
      id: 'sales',
      nameAr: 'المبيعات والمخابز',
      nameFr: 'Ventes & Boulangeries',
      descAr: 'حصص المخابز المدعمة وأذونات التسليم',
      descFr: 'Quotas de farine et bons de livraison',
      icon: Store,
      bgColor: 'from-blue-500 to-blue-700',
      badge: 'حصص شهرية'
    },
    {
      id: 'quality',
      nameAr: 'مراقبة الجودة والمخبر',
      nameFr: 'Contrôle Qualité & Labo',
      descAr: 'تحاليل الرطوبة، الشوائب والوزن النوعي',
      descFr: 'Analyses d\'agréage et réfactions',
      icon: FlaskConical,
      bgColor: 'from-rose-500 to-pink-600',
      badge: 'معايير IANOR'
    },
    {
      id: 'invoicing',
      nameAr: 'الفوترة والمحاسبة',
      nameFr: 'Facturation & Comptabilité',
      descAr: 'فواتير رسمية بـ RC و NIF وضريبة TVA',
      descFr: 'Factures légales et conformité fiscale',
      icon: FileText,
      bgColor: 'from-cyan-600 to-sky-700',
      badge: 'جبائي جزائري'
    },
    {
      id: 'maintenance',
      nameAr: 'صيانة المعدات',
      nameFr: 'Maintenance Équipements',
      descAr: 'أسطوانات الطحن Bühler والمناخل الكبرى',
      descFr: 'Cylindres cannelés et plansichters',
      icon: Wrench,
      bgColor: 'from-orange-500 to-amber-700',
      badge: 'صيانة دورية'
    },
    {
      id: 'reporting',
      nameAr: 'الميزان المادي OAIC',
      nameFr: 'Bilan Matière OAIC',
      descAr: 'الكشف الإحصائي الشهري وتصدير CSV',
      descFr: 'Déclarations officielles et export CSV',
      icon: FileSpreadsheet,
      bgColor: 'from-violet-600 to-purple-800',
      badge: 'تقرير شهري'
    }
  ];

  const filteredApps = apps.filter(
    (app) =>
      app.nameAr.toLowerCase().includes(filterQuery.toLowerCase()) ||
      app.nameFr.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#714B67]/90 dark:bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-fadeIn">
      {/* Top Bar inside launcher */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-white/70 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في تطبيقات أودو...' : 'Rechercher une application...'}
            className="w-full ps-10 pe-4 py-2.5 bg-white/15 text-white placeholder-white/60 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/40 font-medium"
          />
        </div>

        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors ms-4"
          aria-label="Close Launcher"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Grid of Apps */}
      <div className="max-w-5xl mx-auto w-full flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 py-4">
          {filteredApps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => {
                  onSelectApp(app.id);
                  onClose();
                }}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${app.bgColor} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform mb-3`}
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <span className="text-white font-bold text-xs sm:text-sm tracking-wide">
                  {lang === 'ar' ? app.nameAr : app.nameFr}
                </span>

                <span className="text-[11px] text-white/70 mt-1 line-clamp-1">
                  {lang === 'ar' ? app.descAr : app.descFr}
                </span>

                <span className="mt-2 text-[10px] text-white/90 bg-white/15 px-2 py-0.5 rounded-full font-mono">
                  {app.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
