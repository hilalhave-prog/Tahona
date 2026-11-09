import React, { useState, useEffect } from 'react';
import { 
  Silo, 
  WeighbridgeTicket, 
  LabTest, 
  WarehouseItem, 
  BakeryClient, 
  DeliveryBon, 
  ProductionBatch, 
  MaintenanceTask, 
  MillSettings,
  OdooStage,
  AlertNotification
} from './types';
import { UserAccount, MillTenant } from './types/auth';
import { getStoredData, saveItem, resetToInitial, KEYS } from './utils/storage';
import { Language, translations, formatCurrency, formatWeightQx } from './utils/translations';
import { evaluateSmartAlerts } from './utils/alertEngine';
import { ToastNotificationStack } from './components/alerts/ToastNotificationStack';

// Odoo ERP Core Components
import { OdooTopBar } from './components/odoo/OdooTopBar';
import { OdooAppLauncher } from './components/odoo/OdooAppLauncher';
import { OdooControlPanel, OdooViewMode } from './components/odoo/OdooControlPanel';
import { OdooKanbanBoard, KanbanItem } from './components/odoo/OdooKanbanBoard';
import { OdooFormView } from './components/odoo/OdooFormView';

// Auth Portal
import { RegistrationPortal } from './components/auth/RegistrationPortal';

// Gemini AI Chatbot
import { GeminiMillingBot } from './components/chat/GeminiMillingBot';

// App Views
import { DashboardView } from './components/views/DashboardView';
import { WeighbridgeView } from './components/views/WeighbridgeView';
import { QualityLabView } from './components/views/QualityLabView';
import { SilosView } from './components/views/SilosView';
import { MillingProductionView } from './components/views/MillingProductionView';
import { WarehouseView } from './components/views/WarehouseView';
import { DistributionInvoicingView } from './components/views/DistributionInvoicingView';
import { MaterialBalanceView } from './components/views/MaterialBalanceView';
import { WeeklyMillingChart } from './components/charts/WeeklyMillingChart';

// Modals
import { NewReceptionModal } from './components/modals/NewReceptionModal';
import { WeighbridgeTicketModal } from './components/modals/WeighbridgeTicketModal';
import { NewDeliveryModal } from './components/modals/NewDeliveryModal';
import { DeliveryPrintModal } from './components/modals/DeliveryPrintModal';
import { NewProductionBatchModal } from './components/modals/NewProductionBatchModal';
import { NewBakeryModal } from './components/modals/NewBakeryModal';
import { NewMaintenanceModal } from './components/modals/NewMaintenanceModal';
import { LabCertificatePrintModal } from './components/modals/LabCertificatePrintModal';

// Icons
import { Database, Cog, Scale, Store, FlaskConical, FileText, Wrench, FileSpreadsheet, Layers, CheckCircle2 } from 'lucide-react';

const AUTH_KEYS = {
  CURRENT_USER: 'algerian_mill_current_user',
  CURRENT_MILL: 'algerian_mill_current_mill'
};

export default function App() {
  const stored = getStoredData();

  // Multi-tenant auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentMill, setCurrentMill] = useState<MillTenant | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEYS.CURRENT_MILL);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [silos, setSilos] = useState<Silo[]>(stored.silos);
  const [tickets, setTickets] = useState<WeighbridgeTicket[]>(stored.tickets);
  const [labTests, setLabTests] = useState<LabTest[]>(stored.labTests);
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>(stored.warehouse);
  const [bakeries, setBakeries] = useState<BakeryClient[]>(stored.bakeries);
  const [deliveries, setDeliveries] = useState<DeliveryBon[]>(stored.deliveries);
  const [batches, setBatches] = useState<ProductionBatch[]>(stored.batches);
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>(stored.maintenance);
  const [settings, setSettings] = useState<MillSettings>(() => {
    if (currentMill) {
      return {
        millNameAr: currentMill.nameAr,
        millNameFr: currentMill.nameFr,
        wilayaAr: currentMill.wilaya,
        wilayaFr: currentMill.wilaya,
        address: `${currentMill.commune}، ${currentMill.wilaya}، الجزائر`,
        phone: currentMill.phone,
        email: currentMill.email,
        rcNumber: currentMill.rcNumber,
        nifNumber: currentMill.nifNumber,
        nisNumber: currentMill.nisNumber,
        articleNumber: currentMill.articleNumber,
        dailyCapacityQx: currentMill.dailyCapacityQx,
        oaicAgreementNumber: currentMill.oaicAgreementNumber
      };
    }
    return stored.settings;
  });

  // Odoo Navigation State
  const [activeAppId, setActiveAppId] = useState<string>('inventory');
  const [activeSubmenu, setActiveSubmenu] = useState<string>('overview');
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<OdooViewMode>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Selected Item for Odoo Form View
  const [selectedRecord, setSelectedRecord] = useState<{
    type: 'silo' | 'ticket' | 'batch' | 'delivery' | 'bakery';
    data: any;
    stage: OdooStage;
  } | null>(null);

  // Language & Dark Mode
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(KEYS.LANGUAGE) as Language) || 'ar';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(KEYS.THEME);
    if (saved) return saved === 'dark';
    return false;
  });

  // Action Modals
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
  const [selectedTicketForPrint, setSelectedTicketForPrint] = useState<WeighbridgeTicket | null>(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDeliveryForPrint, setSelectedDeliveryForPrint] = useState<DeliveryBon | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBakeryModalOpen, setIsBakeryModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedLabTestForPrint, setSelectedLabTestForPrint] = useState<LabTest | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Smart Alerts & Visual Toast Notifications
  const [activeAlerts, setActiveAlerts] = useState<AlertNotification[]>([]);
  const [activeToasts, setActiveToasts] = useState<AlertNotification[]>([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  // Automatic evaluation of smart alerts on inventory/batches changes
  useEffect(() => {
    const detected = evaluateSmartAlerts(warehouse, batches, silos);
    const unread = detected.filter((a) => !dismissedAlertIds.has(a.id));
    setActiveAlerts(unread);

    // Update active toasts for newly detected warnings
    setActiveToasts((prevToasts) => {
      const existingIds = new Set(prevToasts.map((t) => t.id));
      const newlyToasted = unread.filter((a) => !existingIds.has(a.id) && !dismissedAlertIds.has(a.id));
      if (newlyToasted.length === 0) return prevToasts;
      return [...prevToasts, ...newlyToasted].slice(0, 4);
    });
  }, [warehouse, batches, silos, dismissedAlertIds]);

  // Auto-dismiss the oldest toast after 8 seconds
  useEffect(() => {
    if (activeToasts.length === 0) return;
    const timer = setTimeout(() => {
      setActiveToasts((prev) => prev.slice(1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeToasts]);

  const handleDismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDismissAllToasts = () => {
    setActiveToasts([]);
  };

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => new Set([...prev, id]));
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAlerts = () => {
    const allIds = activeAlerts.map((a) => a.id);
    setDismissedAlertIds((prev) => new Set([...prev, ...allIds]));
    setActiveAlerts([]);
    setActiveToasts([]);
    showToast(lang === 'ar' ? 'تم مسح كافة التنبيهات' : 'Toutes les alertes ont été effacées');
  };

  const handleTriggerSimulatedAlert = (type: 'bag_stock_low' | 'batch_expiring') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (type === 'bag_stock_low') {
      const simAlert: AlertNotification = {
        id: `sim-bag-${Date.now()}`,
        type: 'bag_stock_low',
        severity: 'critical',
        titleAr: '⚠️ نفاد حرج لمخزون: فرينة الخبز المدعمة T55',
        titleFr: 'Alerte Critique: Farine Panifiable T55',
        messageAr: 'المخزون المتوفر في عنبر أ هو 180 كيس فقط (الحد الأدنى: 1200 كيس). المخابز المتعاقدة بانتظار الشحنات. يرجى تشغيل خط الطحن فوراً.',
        messageFr: 'Stock disponible en magasin: 180 sacs seulement (Seuil min: 1200 sacs). Risque de rupture pour les boulangeries conventionnées.',
        timestamp: timeStr,
        read: false,
        targetAppId: 'inventory',
        actionLabelAr: 'فحص عنبر الأكياس',
        actionLabelFr: 'Voir Magasin',
        details: {
          currentValue: 180,
          thresholdValue: 1200,
          unit: 'كيس'
        }
      };
      setActiveAlerts((prev) => [simAlert, ...prev]);
      setActiveToasts((prev) => [simAlert, ...prev.filter((t) => t.id !== simAlert.id)]);
      showToast(lang === 'ar' ? 'تمت محاكاة تنبيه انخفاض مخزون الأكياس' : 'Simulation alerte stock générée');
    } else {
      const simAlert: AlertNotification = {
        id: `sim-batch-${Date.now()}`,
        type: 'batch_expiring',
        severity: 'critical',
        titleAr: '⏳ اقتراب انتهاء صلاحية: دفعة الطحن PROD-2026-072',
        titleFr: 'DLC Proche: Lot de Mouture PROD-2026-072',
        messageAr: 'تبقى 12 يوماً فقط على انتهاء الصلاحية القانونية لأكياس الدفعة رقم PROD-2026-072 (تاريخ الانتهاء: 2026-11-20). يرجى توجيه المخزون للتوزيع العاجل (FIFO).',
        messageFr: 'Il reste 12 jours avant expiration légale du lot PROD-2026-072 (DLC: 20/11/2026). Priorité distribution FIFO immédiate.',
        timestamp: timeStr,
        read: false,
        targetAppId: 'mrp',
        actionLabelAr: 'فحص أوامر الطحن',
        actionLabelFr: 'Voir Lots OF',
        details: {
          currentValue: 12,
          thresholdValue: 30,
          unit: 'يوم متبقي'
        }
      };
      setActiveAlerts((prev) => [simAlert, ...prev]);
      setActiveToasts((prev) => [simAlert, ...prev.filter((t) => t.id !== simAlert.id)]);
      showToast(lang === 'ar' ? 'تمت محاكاة تنبيه اقتراب انتهاء الصلاحية' : 'Simulation alerte DLC générée');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(KEYS.THEME, 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(KEYS.LANGUAGE, lang);
  }, [lang]);

  // Login handler
  const handleLogin = (user: UserAccount, mill: MillTenant) => {
    setCurrentUser(user);
    setCurrentMill(mill);
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(AUTH_KEYS.CURRENT_MILL, JSON.stringify(mill));

    const updatedSettings: MillSettings = {
      millNameAr: mill.nameAr,
      millNameFr: mill.nameFr,
      wilayaAr: mill.wilaya,
      wilayaFr: mill.wilaya,
      address: `${mill.commune}، ${mill.wilaya}، الجزائر`,
      phone: mill.phone,
      email: mill.email,
      rcNumber: mill.rcNumber,
      nifNumber: mill.nifNumber,
      nisNumber: mill.nisNumber,
      articleNumber: mill.articleNumber,
      dailyCapacityQx: mill.dailyCapacityQx,
      oaicAgreementNumber: mill.oaicAgreementNumber
    };
    setSettings(updatedSettings);
    saveItem(KEYS.SETTINGS, updatedSettings);

    showToast(`مرحباً بك! تم تسجيل الدخول إلى ${mill.nameAr}`);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    localStorage.removeItem(AUTH_KEYS.CURRENT_MILL);
    setCurrentUser(null);
    setCurrentMill(null);
  };

  // Handlers for data updates
  const handleAddTicket = (newTicket: WeighbridgeTicket) => {
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    saveItem(KEYS.TICKETS, updatedTickets);

    const updatedSilos = silos.map((s) => {
      if (s.id === newTicket.assignedSiloId) {
        const newStock = Math.min(s.capacityQx, s.currentStockQx + newTicket.netWeightQx);
        return {
          ...s,
          currentStockQx: Math.round(newStock),
          lastFillDate: newTicket.date
        };
      }
      return s;
    });
    setSilos(updatedSilos);
    saveItem(KEYS.SILOS, updatedSilos);

    showToast(lang === 'ar' ? `[أودو] تم تأكيد تذكرة القبان ${newTicket.ticketNumber} وإيداع الحبوب` : `Ticket ${newTicket.ticketNumber} créé`);
  };

  const handleAddLabTest = (newTest: LabTest) => {
    const updated = [newTest, ...labTests];
    setLabTests(updated);
    saveItem(KEYS.LAB_TESTS, updated);
    showToast(lang === 'ar' ? '[أودو] تم تسجيل شهادة الفحص المخبري بنجاح' : 'Analyse qualité validée');
  };

  const handleToggleVentilation = (siloId: string) => {
    const updated = silos.map((s) => {
      if (s.id === siloId) {
        return { ...s, ventilationActive: !s.ventilationActive };
      }
      return s;
    });
    setSilos(updated);
    saveItem(KEYS.SILOS, updated);
  };

  const handleTransferGrain = (sourceId: string, destId: string, amountQx: number) => {
    const source = silos.find((s) => s.id === sourceId);
    const dest = silos.find((s) => s.id === destId);
    if (!source || !dest) return;

    if (source.currentStockQx < amountQx) {
      showToast(lang === 'ar' ? 'رصيد الصومعة المصدر غير كافٍ!' : 'Stock insuffisant');
      return;
    }

    const updated = silos.map((s) => {
      if (s.id === sourceId) return { ...s, currentStockQx: s.currentStockQx - amountQx };
      if (s.id === destId) return { ...s, currentStockQx: Math.min(s.capacityQx, s.currentStockQx + amountQx) };
      return s;
    });

    setSilos(updated);
    saveItem(KEYS.SILOS, updated);
    showToast(lang === 'ar' ? `[أودو] حركة تحويل مخزني: ${amountQx} قنطار` : `Transfert interne effectué: ${amountQx} Qx`);
  };

  const handleAddBatch = (newBatch: ProductionBatch) => {
    const updatedBatches = [newBatch, ...batches];
    setBatches(updatedBatches);
    saveItem(KEYS.BATCHES, updatedBatches);

    const updatedSilos = silos.map((s) => {
      if (s.id === newBatch.siloSourceId) {
        return {
          ...s,
          currentStockQx: Math.max(0, s.currentStockQx - newBatch.grainProcessedQx)
        };
      }
      return s;
    });
    setSilos(updatedSilos);
    saveItem(KEYS.SILOS, updatedSilos);

    const updatedWarehouse = warehouse.map((wh) => {
      const match = newBatch.outputs.find((out) => out.productType === wh.productType);
      if (match) {
        return {
          ...wh,
          stockBags: wh.stockBags + match.bagsCount,
          totalWeightQx: wh.totalWeightQx + match.quantityQx
        };
      }
      return wh;
    });
    setWarehouse(updatedWarehouse);
    saveItem(KEYS.WAREHOUSE, updatedWarehouse);

    showToast(lang === 'ar' ? `[أودو MRP] تم تسجيل أمر الطحن ${newBatch.batchNumber} وتحديث مخزون الأكياس` : `OF ${newBatch.batchNumber} terminé`);
  };

  const handleAddDelivery = (newDelivery: DeliveryBon) => {
    const updatedDeliveries = [newDelivery, ...deliveries];
    setDeliveries(updatedDeliveries);
    saveItem(KEYS.DELIVERIES, updatedDeliveries);

    const updatedWarehouse = warehouse.map((wh) => {
      const itemDelivered = newDelivery.items.find((it) => it.productType === wh.productType);
      if (itemDelivered) {
        return {
          ...wh,
          stockBags: Math.max(0, wh.stockBags - itemDelivered.quantityBags),
          totalWeightQx: Math.max(0, wh.totalWeightQx - itemDelivered.totalWeightQx)
        };
      }
      return wh;
    });
    setWarehouse(updatedWarehouse);
    saveItem(KEYS.WAREHOUSE, updatedWarehouse);

    const updatedBakeries = bakeries.map((b) => {
      if (b.id === newDelivery.clientId) {
        const flourWeight = newDelivery.items
          .filter((it) => it.productType.includes('farine'))
          .reduce((acc, curr) => acc + curr.totalWeightQx, 0);
        return {
          ...b,
          consumedQuotaQx: b.consumedQuotaQx + flourWeight
        };
      }
      return b;
    });
    setBakeries(updatedBakeries);
    saveItem(KEYS.BAKERIES, updatedBakeries);

    showToast(lang === 'ar' ? `[أودو Ventes] تم إصدار إذن التسليم ${newDelivery.bonNumber} وخصم الحصة` : `Bon ${newDelivery.bonNumber} validé`);
  };

  const handleUpdateStock = (itemId: string, deltaBags: number) => {
    const updated = warehouse.map((wh) => {
      if (wh.id === itemId) {
        const newBags = Math.max(0, wh.stockBags + deltaBags);
        return {
          ...wh,
          stockBags: newBags,
          totalWeightQx: (newBags * wh.unitWeightKg) / 100
        };
      }
      return wh;
    });
    setWarehouse(updated);
    saveItem(KEYS.WAREHOUSE, updated);
  };

  const handleAddBakery = (newBakery: BakeryClient) => {
    const updated = [newBakery, ...bakeries];
    setBakeries(updated);
    saveItem(KEYS.BAKERIES, updated);
    showToast(lang === 'ar' ? `[أودو Ventes] تم تسجيل المخبزة ${newBakery.nameAr} في قائمة الموزعين` : `Boulangerie ${newBakery.nameAr} enregistrée`);
  };

  const handleAddMaintenance = (newTask: MaintenanceTask) => {
    const updated = [newTask, ...maintenance];
    setMaintenance(updated);
    saveItem(KEYS.MAINTENANCE, updated);
    showToast(lang === 'ar' ? `[أودو Maintenance] تم إنشاء بطاقة صيانة لـ ${newTask.machineNameAr}` : `Tâche de maintenance ${newTask.machineNameAr} enregistrée`);
  };

  // Convert current app records to Odoo Kanban Items
  const getKanbanItems = (): KanbanItem[] => {
    switch (activeAppId) {
      case 'inventory':
        return silos.map((s) => ({
          id: s.id,
          code: s.code,
          title: lang === 'ar' ? s.nameAr : s.nameFr,
          subtitle: `${s.capacityQx.toLocaleString()} قنطار طاقة استيعابية`,
          stage: s.status === 'nominal' ? 'اسمي' : s.status === 'aerating' ? 'تهوية نشطة' : 'تنبيه',
          metricLabel: 'المخزون الحالي',
          metricValue: `${s.currentStockQx.toLocaleString()} ق`,
          tag: translations[lang][s.grainType],
          date: s.lastFillDate,
          rawItem: s
        }));
      case 'mrp':
        return batches.map((b) => ({
          id: b.id,
          code: b.batchNumber,
          title: b.lineId === 'minoterie_tendre' ? 'طحن قمح لين (فرينة)' : 'طحن قمح صلب (سميد)',
          subtitle: `المشرف: ${b.millerInCharge}`,
          stage: 'تم الإنجاز',
          metricLabel: 'الكمية المسحوقة',
          metricValue: `${b.grainProcessedQx} قنطار`,
          tag: `مردودية ${b.extractionRatePercent.toFixed(1)}%`,
          date: b.date,
          rawItem: b
        }));
      case 'purchases':
        return tickets.map((t) => ({
          id: t.id,
          code: t.ticketNumber,
          title: `${t.truckMatricule} - ${t.driverName}`,
          subtitle: t.cclsOrigin,
          stage: t.status === 'unloaded' ? 'تم التفريغ' : 'مقبول',
          metricLabel: 'الوزن الصافي المستلم',
          metricValue: `${t.netWeightQx.toFixed(1)} ق`,
          tag: translations[lang][t.grainType],
          date: t.date,
          rawItem: t
        }));
      case 'sales':
      case 'invoicing':
        return deliveries.map((d) => ({
          id: d.id,
          code: d.bonNumber,
          title: d.clientName,
          subtitle: `السائق: ${d.driverName} (${d.truckMatricule})`,
          stage: 'مسلّم ومفوتر',
          metricLabel: 'المبلغ الإجمالي (TTC)',
          metricValue: formatCurrency(d.totalAmountDZD, lang),
          tag: `${d.totalWeightQx.toFixed(1)} قنطار`,
          date: d.date,
          rawItem: d
        }));
      default:
        return [];
    }
  };

  // Determine current Primary Action per app
  const getNewAction = () => {
    switch (activeAppId) {
      case 'purchases':
        return { label: 'تسجيل شحنة قبان', onClick: () => setIsReceptionModalOpen(true) };
      case 'mrp':
        return { label: 'أمر طحن جديد (OF)', onClick: () => setIsBatchModalOpen(true) };
      case 'sales':
        return { label: 'إذن تسليم مخبزة (BL)', onClick: () => setIsDeliveryModalOpen(true) };
      case 'invoicing':
        return { label: 'إذن تسليم وفوترة (BL)', onClick: () => setIsDeliveryModalOpen(true) };
      case 'maintenance':
        return { label: 'بطاقة صيانة جديدة', onClick: () => setIsMaintenanceModalOpen(true) };
      case 'inventory':
        return { label: 'تحويل بين الصوامع', onClick: () => setActiveSubmenu('silos') };
      default:
        return { label: 'جديد', onClick: () => setIsReceptionModalOpen(true) };
    }
  };

  const newAction = getNewAction();

  const appBreadcrumbNames: Record<string, string> = {
    inventory: lang === 'ar' ? 'المخزون' : 'Inventaire',
    mrp: lang === 'ar' ? 'التصنيع (MRP)' : 'Fabrication',
    purchases: lang === 'ar' ? 'المشتريات' : 'Achats',
    sales: lang === 'ar' ? 'المبيعات' : 'Ventes',
    quality: lang === 'ar' ? 'الجودة' : 'Qualité',
    invoicing: lang === 'ar' ? 'الفوترة' : 'Facturation',
    maintenance: lang === 'ar' ? 'الصيانة' : 'Maintenance',
    reporting: lang === 'ar' ? 'التقارير' : 'Rapports'
  };

  // If not logged in: Show Registration and Cloud Mill Portal
  if (!currentUser || !currentMill) {
    return (
      <RegistrationPortal
        onLogin={handleLogin}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 1. Odoo Purple Top Bar with Mill Switcher & User Profile */}
      <OdooTopBar
        activeAppId={activeAppId}
        setActiveAppId={(id) => {
          setActiveAppId(id);
          setSelectedRecord(null);
        }}
        isAppLauncherOpen={isAppLauncherOpen}
        setIsAppLauncherOpen={setIsAppLauncherOpen}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        settings={settings}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
        currentUser={currentUser}
        onSwitchMill={() => handleLogout()}
        onLogout={() => handleLogout()}
        alerts={activeAlerts}
        onDismissAlert={handleDismissAlert}
        onClearAlerts={handleClearAlerts}
        onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
      />

      {/* Floating Smart Alert Toast Notifications */}
      <ToastNotificationStack
        toasts={activeToasts}
        onDismiss={handleDismissToast}
        onDismissAll={handleDismissAllToasts}
        onNavigateToApp={(appId) => {
          setActiveAppId(appId);
          setSelectedRecord(null);
        }}
        lang={lang}
      />

      {/* 2. Odoo Full Screen App Grid Launcher */}
      <OdooAppLauncher
        isOpen={isAppLauncherOpen}
        onClose={() => setIsAppLauncherOpen(false)}
        onSelectApp={(appId) => {
          setActiveAppId(appId);
          setSelectedRecord(null);
        }}
        lang={lang}
      />

      {/* 3. Odoo Control Panel (Breadcrumbs, Create Button, Filters, Views) */}
      {!selectedRecord && (
        <OdooControlPanel
          breadcrumbApp={appBreadcrumbNames[activeAppId] || 'أودو'}
          breadcrumbSection={
            activeAppId === 'inventory' ? 'الصوامع والمخازن' :
            activeAppId === 'mrp' ? 'أوامر الطحن والتحويل' :
            activeAppId === 'purchases' ? 'شحنات القبان OAIC' :
            activeAppId === 'sales' ? 'حصص المخابز والفواتير' :
            activeAppId === 'quality' ? 'فحوصات القبول المخبري' :
            activeAppId === 'invoicing' ? 'الفواتير والضرائب' :
            activeAppId === 'maintenance' ? 'أسطوانات الطحن' : 'الميزان المادي OAIC'
          }
          onNewClick={newAction.onClick}
          newButtonLabel={newAction.label}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onExportCSV={() => showToast('تم تجهيز وتصدير ملف البيانات')}
          onPrint={() => window.print()}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterOptions={[
            { id: 'subsidized', label: 'المنتجات المدعمة' },
            { id: 'ble_tendre', label: 'القمح اللين' },
            { id: 'ble_dur', label: 'القمح الصلب' }
          ]}
          lang={lang}
        />
      )}

      {/* 4. Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {selectedRecord ? (
          <OdooFormView
            title={selectedRecord.data.title || selectedRecord.data.nameAr || selectedRecord.data.truckMatricule || selectedRecord.data.clientName}
            subtitle={selectedRecord.data.subtitle || selectedRecord.data.notes}
            code={selectedRecord.data.code || selectedRecord.data.ticketNumber || selectedRecord.data.batchNumber || selectedRecord.data.bonNumber}
            currentStage={selectedRecord.stage}
            onStageChange={(newStage) => {
              setSelectedRecord({ ...selectedRecord, stage: newStage });
              showToast(`تم تغيير المرحلة إلى: ${newStage}`);
            }}
            onBack={() => setSelectedRecord(null)}
            onPrint={() => window.print()}
            onConfirm={() => {
              setSelectedRecord({ ...selectedRecord, stage: 'done' });
              showToast('تم تأكيد السجل بنجاح وإغلاقه');
            }}
            smartButtons={[
              {
                icon: Database,
                label: 'حركات المخزون',
                value: 'مؤكدة',
                onClick: () => showToast('عرض حركات المخزون المرتبطة')
              },
              {
                icon: FlaskConical,
                label: 'فحص الجودة',
                value: 'مطابق OAIC',
                onClick: () => showToast('عرض شهادة التحليل المخبري')
              }
            ]}
            headerFields={[
              { label: 'المرجع / الرقم', value: selectedRecord.data.code || selectedRecord.data.ticketNumber || selectedRecord.data.bonNumber },
              { label: 'التاريخ', value: selectedRecord.data.date || '2026-11-08' },
              { label: 'المسؤول / المشرف', value: selectedRecord.data.driverName || selectedRecord.data.millerInCharge || currentUser.fullName },
              { label: 'المؤسسة / المصدر', value: selectedRecord.data.cclsOrigin || selectedRecord.data.clientName || settings.millNameAr }
            ]}
            tabs={[
              {
                id: 'details',
                label: 'التفاصيل والمقادير (Lignes)',
                content: (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      هذا السجل مسجل رسمياً في نظام المطاحن ومربوط مع سجلات ديوان الحبوب OAIC ومديرية التجارة.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg font-mono">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span>الكمية المسجلة:</span>
                        <span className="font-bold">{selectedRecord.data.netWeightQx || selectedRecord.data.grainProcessedQx || selectedRecord.data.totalWeightQx || selectedRecord.data.currentStockQx} قنطار</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span>الحالة:</span>
                        <span className="text-emerald-600 font-bold">جاهز ومعتمد</span>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                id: 'logistics',
                label: 'اللوجستيك والشحن',
                content: (
                  <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                    <p>المستودع: عنابر {settings.millNameAr}</p>
                    <p>رقم الشاحنة: {selectedRecord.data.truckMatricule || '08412-120-19'}</p>
                    <p>نقطة التفريغ: الرصيف الميكانيكي رقم 1</p>
                  </div>
                )
              }
            ]}
            documentId={selectedRecord.data.id || 'rec-1'}
            documentType={selectedRecord.type}
            lang={lang}
          />
        ) : (
          <>
            {viewMode === 'kanban' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'ar' ? 'عرض بطاقات كانبان (Kanban Odoo)' : 'Vue Cartes Kanban'}
                  </h3>
                  <span className="text-xs text-slate-400">انقر على أي بطاقة لفتح النموذج الكامل</span>
                </div>
                <OdooKanbanBoard
                  items={getKanbanItems()}
                  onItemClick={(item) => {
                    setSelectedRecord({
                      type: 'ticket',
                      data: item.rawItem,
                      stage: 'confirmed'
                    });
                  }}
                  lang={lang}
                />
              </div>
            )}

            {viewMode === 'list' && (
              <>
                {activeAppId === 'inventory' && (
                  <div className="space-y-6">
                    <DashboardView
                      silos={silos}
                      tickets={tickets}
                      batches={batches}
                      warehouse={warehouse}
                      bakeries={bakeries}
                      maintenance={maintenance}
                      settings={settings}
                      lang={lang}
                      onNavigateTab={(tab) => {
                        if (tab === 'silos') setActiveAppId('inventory');
                        if (tab === 'production') setActiveAppId('mrp');
                        if (tab === 'weighbridge') setActiveAppId('purchases');
                        if (tab === 'warehouse') setActiveAppId('inventory');
                        if (tab === 'bakeries') setActiveAppId('sales');
                        if (tab === 'material_balance') setActiveAppId('reporting');
                      }}
                      onOpenNewReception={() => setIsReceptionModalOpen(true)}
                      onOpenNewDelivery={() => setIsDeliveryModalOpen(true)}
                      onOpenNewBatch={() => setIsBatchModalOpen(true)}
                      onViewTicket={(t) => setSelectedTicketForPrint(t)}
                    />
                    <SilosView
                      silos={silos}
                      onToggleVentilation={handleToggleVentilation}
                      onTransferGrain={handleTransferGrain}
                      lang={lang}
                    />
                    <WarehouseView
                      warehouse={warehouse}
                      onUpdateStock={handleUpdateStock}
                      lang={lang}
                    />
                  </div>
                )}

                {activeAppId === 'mrp' && (
                  <MillingProductionView
                    batches={batches}
                    maintenance={maintenance}
                    silos={silos}
                    onOpenNewBatch={() => setIsBatchModalOpen(true)}
                    onOpenNewMaintenance={() => setIsMaintenanceModalOpen(true)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'purchases' && (
                  <WeighbridgeView
                    tickets={tickets}
                    silos={silos}
                    onOpenNewReception={() => setIsReceptionModalOpen(true)}
                    onViewTicket={(t) => setSelectedTicketForPrint(t)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'sales' && (
                  <DistributionInvoicingView
                    bakeries={bakeries}
                    deliveries={deliveries}
                    onOpenNewDelivery={() => setIsDeliveryModalOpen(true)}
                    onOpenNewBakery={() => setIsBakeryModalOpen(true)}
                    onPrintDelivery={(del) => setSelectedDeliveryForPrint(del)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'quality' && (
                  <QualityLabView
                    labTests={labTests}
                    tickets={tickets}
                    onAddLabTest={handleAddLabTest}
                    onPrintLabTest={(test) => setSelectedLabTestForPrint(test)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'invoicing' && (
                  <DistributionInvoicingView
                    bakeries={bakeries}
                    deliveries={deliveries}
                    onOpenNewDelivery={() => setIsDeliveryModalOpen(true)}
                    onOpenNewBakery={() => setIsBakeryModalOpen(true)}
                    onPrintDelivery={(del) => setSelectedDeliveryForPrint(del)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'maintenance' && (
                  <MillingProductionView
                    batches={batches}
                    maintenance={maintenance}
                    silos={silos}
                    onOpenNewBatch={() => setIsBatchModalOpen(true)}
                    onOpenNewMaintenance={() => setIsMaintenanceModalOpen(true)}
                    lang={lang}
                  />
                )}

                {activeAppId === 'reporting' && (
                  <MaterialBalanceView
                    silos={silos}
                    tickets={tickets}
                    batches={batches}
                    settings={settings}
                    lang={lang}
                  />
                )}
              </>
            )}

            {viewMode === 'graph' && (
              <div className="space-y-6">
                <WeeklyMillingChart batches={batches} lang={lang} />

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? 'التحليل البياني والمحوري (Odoo Pivot & Graph)' : 'Analyse Graphique & Pivot'}
                      </h3>
                      <p className="text-xs text-slate-500">توزيع المخزون، الإنتاج والمبيعات</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#714B67] dark:text-amber-400">
                      معدل الأداء: 98.4%
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      مقارنة نسب شغل الصوامع (Silos Occupancy):
                    </h4>
                    <div className="space-y-3">
                      {silos.map((s) => {
                        const pct = Math.round((s.currentStockQx / s.capacityQx) * 100);
                        return (
                          <div key={s.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{s.code} - {s.nameAr}</span>
                              <span>{pct}% ({s.currentStockQx.toLocaleString()} / {s.capacityQx.toLocaleString()} ق)</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                              <div className="bg-[#714B67] dark:bg-amber-500 h-full transition-all duration-700" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 5. Floating Gemini Milling Assistant AI Chatbot */}
      <GeminiMillingBot
        settings={settings}
        silos={silos}
        warehouse={warehouse}
        bakeries={bakeries}
        batches={batches}
        lang={lang}
      />

      {/* 6. Odoo Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#714B67] dark:text-amber-400 font-mono">Odoo 18 Enterprise</span>
            <span aria-hidden="true">·</span>
            <span>{settings.millNameAr} ({settings.wilayaAr})</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold">منظومة سحابية متصلة وجاهزة للعمل اليومي</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLogout()}
              className="text-slate-400 hover:text-amber-600 transition-colors"
            >
              تبديل المطحنة
            </button>
            <button
              onClick={resetToInitial}
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              استعادة البيانات التجريبية
            </button>
            <span className="font-mono">AGRO-MILLING DZ CLOUD</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewReceptionModal
        isOpen={isReceptionModalOpen}
        onClose={() => setIsReceptionModalOpen(false)}
        silos={silos}
        onAddTicket={handleAddTicket}
        lang={lang}
      />

      <WeighbridgeTicketModal
        ticket={selectedTicketForPrint}
        silo={silos.find((s) => s.id === selectedTicketForPrint?.assignedSiloId)}
        settings={settings}
        onClose={() => setSelectedTicketForPrint(null)}
        lang={lang}
      />

      <NewDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        bakeries={bakeries}
        warehouseItems={warehouse}
        onAddDelivery={handleAddDelivery}
        lang={lang}
      />

      <DeliveryPrintModal
        delivery={selectedDeliveryForPrint}
        bakery={bakeries.find((b) => b.id === selectedDeliveryForPrint?.clientId)}
        settings={settings}
        onClose={() => setSelectedDeliveryForPrint(null)}
        lang={lang}
      />

      <NewProductionBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        silos={silos}
        onAddBatch={handleAddBatch}
        lang={lang}
      />

      <NewBakeryModal
        isOpen={isBakeryModalOpen}
        onClose={() => setIsBakeryModalOpen(false)}
        onAddBakery={handleAddBakery}
        defaultWilaya={settings.wilayaAr}
        lang={lang}
      />

      <NewMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onAddMaintenance={handleAddMaintenance}
        lang={lang}
      />

      <LabCertificatePrintModal
        test={selectedLabTestForPrint}
        ticket={tickets.find((t) => t.ticketNumber === selectedLabTestForPrint?.ticketNumber)}
        settings={settings}
        onClose={() => setSelectedLabTestForPrint(null)}
        lang={lang}
      />

      {/* Odoo Style Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-20 start-6 z-50 bg-[#714B67] text-white px-4 py-3 rounded-lg shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
