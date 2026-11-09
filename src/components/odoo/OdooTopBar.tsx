import React from 'react';
import { 
  LayoutGrid, 
  Search, 
  Bell, 
  Languages, 
  Sun, 
  Moon, 
  User, 
  CheckSquare, 
  Clock, 
  ChevronDown 
} from 'lucide-react';
import { Language, translations } from '../../utils/translations';
import { MillSettings, AlertNotification } from '../../types';
import { UserAccount } from '../../types/auth';
import { NotificationDropdown } from '../alerts/NotificationDropdown';

interface OdooTopBarProps {
  activeAppId: string;
  setActiveAppId: (appId: string) => void;
  isAppLauncherOpen: boolean;
  setIsAppLauncherOpen: (open: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  settings: MillSettings;
  activeSubmenu: string;
  setActiveSubmenu: (sub: string) => void;
  currentUser?: UserAccount | null;
  onSwitchMill?: () => void;
  onLogout?: () => void;
  alerts?: AlertNotification[];
  onDismissAlert?: (id: string) => void;
  onClearAlerts?: () => void;
  onTriggerSimulatedAlert?: (type: 'bag_stock_low' | 'batch_expiring') => void;
}

export const OdooTopBar: React.FC<OdooTopBarProps> = ({
  activeAppId,
  setActiveAppId,
  isAppLauncherOpen,
  setIsAppLauncherOpen,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  settings,
  activeSubmenu,
  setActiveSubmenu,
  currentUser,
  onSwitchMill,
  onLogout,
  alerts = [],
  onDismissAlert = () => {},
  onClearAlerts = () => {},
  onTriggerSimulatedAlert = () => {}
}) => {
  const t = translations[lang];
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  // App menus depending on active Odoo App
  const getAppMenuItems = () => {
    switch (activeAppId) {
      case 'inventory':
        return [
          { id: 'overview', labelAr: 'نظرة عامة', labelFr: 'Aperçu' },
          { id: 'silos', labelAr: 'الصوامع والمستودعات', labelFr: 'Silos & Emplacements' },
          { id: 'warehouse', labelAr: 'المنتجات والأكياس', labelFr: 'Articles Conditionnés' },
          { id: 'transfers', labelAr: 'حركات الحبوب', labelFr: 'Mouvements de Stock' }
        ];
      case 'mrp':
        return [
          { id: 'orders', labelAr: 'أوامر الطحن (OF)', labelFr: 'Ordres de Mouture (OF)' },
          { id: 'bom', labelAr: 'قوائم المردودية (BoM)', labelFr: 'Nomenclatures & Taux' },
          { id: 'shifts', labelAr: 'ورديات العمل 3x8', labelFr: 'Équipes de Quart' },
          { id: 'workcenters', labelAr: 'خطوط الطحن والأسطوانات', labelFr: 'Centres de Charge' }
        ];
      case 'purchases':
        return [
          { id: 'weighbridge', labelAr: 'قبان الاستقبال (Pont-Bascule)', labelFr: 'Pont-Bascule' },
          { id: 'tickets', labelAr: 'تذاكر الوزن الرسمية', labelFr: 'Tickets de Pesée' },
          { id: 'ccls', labelAr: 'تعاونيات الحبوب OAIC', labelFr: 'Fournisseurs CCLS/OAIC' }
        ];
      case 'sales':
        return [
          { id: 'quotas', labelAr: 'حصص المخابز المدعمة', labelFr: 'Quotas Boulangeries' },
          { id: 'deliveries', labelAr: 'أذونات التسليم (BL)', labelFr: 'Bons de Livraison (BL)' },
          { id: 'clients', labelAr: 'دليل الزبائن والمخابز', labelFr: 'Clients & Grossistes' }
        ];
      case 'quality':
        return [
          { id: 'checks', labelAr: 'فحوصات القبول (Agréage)', labelFr: 'Contrôles d\'Agréage' },
          { id: 'norms', labelAr: 'المعايير الجزائرية IANOR', labelFr: 'Normes Officielles' },
          { id: 'refactions', labelAr: 'جدول الحسومات (Réfactions)', labelFr: 'Barème des Réfactions' }
        ];
      case 'invoicing':
        return [
          { id: 'invoices', labelAr: 'فواتير المبيعات', labelFr: 'Factures Clients' },
          { id: 'payments', labelAr: 'المدفوعات والمقبوضات', labelFr: 'Paiements' },
          { id: 'taxes', labelAr: 'الضرائب والرسم على القيمة المضافة', labelFr: 'Fiscalité & TVA DZ' }
        ];
      case 'maintenance':
        return [
          { id: 'requests', labelAr: 'معدات المطحنة والصيانة', labelFr: 'Équipements & Entretien' },
          { id: 'rolls', labelAr: 'أسطوانات التكسير B1-B2', labelFr: 'Cylindres Cannelés' }
        ];
      case 'reporting':
        return [
          { id: 'bilan_oaic', labelAr: 'الميزان المادي الشهري OAIC', labelFr: 'Bilan Matière OAIC' },
          { id: 'statistics', labelAr: 'الإحصائيات السنوية', labelFr: 'Statistiques Annuelles' }
        ];
      default:
        return [];
    }
  };

  const appTitleMap: Record<string, { ar: string; fr: string }> = {
    inventory: { ar: 'المخزون والصوامع', fr: 'Inventaire & Silos' },
    mrp: { ar: 'التصنيع والطحن (MRP)', fr: 'Fabrication & Mouture' },
    purchases: { ar: 'المشتريات وقبان الحبوب', fr: 'Achats & Pont-Bascule' },
    sales: { ar: 'المبيعات والمخابز', fr: 'Ventes & Boulangeries' },
    quality: { ar: 'مراقبة الجودة والمخبر', fr: 'Contrôle Qualité' },
    invoicing: { ar: 'الفوترة والمحاسبة', fr: 'Facturation & Comptabilité' },
    maintenance: { ar: 'صيانة المعدات', fr: 'Maintenance' },
    reporting: { ar: 'الميزان المادي OAIC', fr: 'Bilan Matière OAIC' }
  };

  const currentApp = appTitleMap[activeAppId] || appTitleMap.inventory;
  const menuItems = getAppMenuItems();

  return (
    <header className="sticky top-0 z-40 bg-[#714B67] dark:bg-slate-900 text-white shadow-md border-b border-[#5a3951] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-12 gap-2 sm:gap-4">
          {/* Left / Start: Odoo Waffle Icon + Active App Name + Submenus */}
          <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
            {/* Waffle Button */}
            <button
              onClick={() => setIsAppLauncherOpen(!isAppLauncherOpen)}
              className={`p-1.5 rounded hover:bg-white/15 transition-colors shrink-0 ${
                isAppLauncherOpen ? 'bg-white/20' : ''
              }`}
              title="تطبيقات أودو / Applications Odoo"
              aria-label="Toggle App Launcher"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* Current App Title */}
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded bg-white/10 font-bold text-xs sm:text-sm whitespace-nowrap">
              <span>{lang === 'ar' ? currentApp.ar : currentApp.fr}</span>
            </div>

            {/* Contextual App Submenus */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = activeSubmenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubmenu(item.id)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lang === 'ar' ? item.labelAr : item.labelFr}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right / End: Mill Name + Language + Theme + User Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Company / Mill badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-white/90 bg-white/10 px-2.5 py-1 rounded">
              <span className="font-semibold">{settings.millNameAr}</span>
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-white/15 transition-colors whitespace-nowrap font-bold"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'FR' : 'عربي'}</span>
            </button>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded hover:bg-white/15 transition-colors text-white"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Smart Alerts & Notifications Bell */}
            <NotificationDropdown
              alerts={alerts}
              onDismissAlert={onDismissAlert}
              onClearAll={onClearAlerts}
              onNavigateToApp={(appId) => setActiveAppId(appId)}
              onTriggerSimulatedAlert={onTriggerSimulatedAlert}
              lang={lang}
            />

            {/* User Profile & Mill Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 ps-2 border-s border-white/20 text-xs hover:bg-white/10 p-1 rounded transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/30">
                  {currentUser ? currentUser.fullName.slice(0, 2) : 'DZ'}
                </div>
                <span className="hidden sm:inline font-medium">
                  {currentUser ? currentUser.fullName : 'المدير الصناعي'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute end-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 text-xs text-slate-800 dark:text-slate-200">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">المطحنة المسجلة الحالية:</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{settings.millNameAr}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">{settings.wilayaAr} · {settings.dailyCapacityQx.toLocaleString()} قنطار/يوم</span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {onSwitchMill && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSwitchMill();
                        }}
                        className="w-full text-start px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-semibold text-[#714B67] dark:text-amber-400"
                      >
                        تبديل المطحنة / تسجيل الدخول بمطحنة أخرى
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-start px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md text-rose-600 dark:text-rose-400 font-semibold"
                      >
                        تسجيل الخروج (Déconnexion)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
