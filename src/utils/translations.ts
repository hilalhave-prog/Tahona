export type Language = 'ar' | 'fr';

export const translations = {
  ar: {
    // Header & Navigation
    appTitle: 'مطاحن الجزائر',
    appSubtitle: 'نظام التسيير الصناعي للمطاحن والصوامع',
    navDashboard: 'لوحة القيادة',
    navWeighbridge: 'قبان الاستقبال',
    navLab: 'مخبر الجودة',
    navSilos: 'الصوامع والمخزون',
    navProduction: 'الطحن والإنتاج',
    navWarehouse: 'المخزن والتعبئة',
    navBakeries: 'المخابز والتوزيع',
    navMaterialBalance: 'الميزان المادي OAIC',
    // Odoo ERP Navigation & Controls
    odooApps: 'تطبيقات أودو',
    odooInventory: 'المخزون والصوامع',
    odooManufacturing: 'التصنيع والطحن (MRP)',
    odooPurchases: 'المشتريات وقبان الحبوب',
    odooSales: 'المبيعات والمخابز',
    odooQuality: 'مراقبة الجودة والمخبر',
    odooInvoicing: 'الفوترة والمحاسبة',
    odooMaintenance: 'صيانة المعدات',
    odooReporting: 'الميزان المادي والتقارير OAIC',
    btnNew: 'جديد',
    btnAction: 'إجراءات',
    btnFilters: 'عوامل التصفية',
    btnGroupBy: 'تجميع حسب',
    btnFavorites: 'المفضلة',
    viewList: 'قائمة',
    viewKanban: 'كانبان',
    viewGraph: 'رسم بياني',
    viewPivot: 'محور',
    stageDraft: 'مسودة',
    stageConfirmed: 'مؤكد',
    stageInProgress: 'قيد التنفيذ',
    stageDone: 'تم الإنجاز',
    stageCancelled: 'ملغى',
    chatterSendMessage: 'إرسال رسالة',
    chatterLogNote: 'تسجيل ملاحظة',
    chatterScheduleActivity: 'جدولة نشاط',
    btnNewReception: 'تسجيل شحنة حبوب',
    btnNewDelivery: 'إصدار إذن تسليم',
    btnNewBatch: 'تسجيل وردية طحن',

    // Common
    dzd: 'د.ج',
    quintal: 'قنطار',
    tonne: 'طن',
    kg: 'كغ',
    bag: 'كيس',
    date: 'التاريخ',
    time: 'الوقت',
    status: 'الحالة',
    actions: 'الإجراءات',
    save: 'حفظ',
    cancel: 'إلغاء',
    print: 'طباعة',
    search: 'بحث...',
    filter: 'تصفية',
    total: 'المجموع',
    notes: 'ملاحظات',
    close: 'إغلاق',
    refresh: 'تحديث',
    resetData: 'استعادة البيانات الافتراضية',
    subsidized: 'مدعم قانونياً',
    nonSubsidized: 'حر تجاري',

    // Grains
    ble_dur_local: 'قمح صلب محلي (CCLS)',
    ble_dur_importe: 'قمح صلب مستورد (OAIC)',
    ble_tendre: 'قمح لين طحن (فرينة)',
    orge: 'شعير وحبوب علفية',

    // Dashboard
    kpiTotalGrain: 'إجمالي الحبوب بالصوامع',
    kpiDailyCrushing: 'معدل الطحن اليومي',
    kpiExtractionYield: 'مردودية الاستخراج الفعلي',
    kpiSubsidizedDeliveries: 'توزيع المخابز المعتمدة',
    kpiWarehouseStock: 'مخزون الأكياس التامة',
    recentReceipts: 'آخر شحنات الحبوب المستلمة',
    siloOccupancy: 'نسبة إشغال الصوامع',
    millingLinesStatus: 'حالة خطوط الطحن النشطة',
    maintenanceAlerts: 'تنبيهات الصيانة الوقائية'
  },
  fr: {
    // Header & Navigation
    appTitle: 'Moulins d\'Algérie',
    appSubtitle: 'Système de Gestion Industrielle des Minoteries',
    navDashboard: 'Tableau de Bord',
    navWeighbridge: 'Pont-Bascule',
    navLab: 'Laboratoire Qualité',
    navSilos: 'Silos & Stock',
    navProduction: 'Mouture & Production',
    navWarehouse: 'Produits Finis',
    navBakeries: 'Boulangeries & Ventes',
    navMaterialBalance: 'Bilan Matière OAIC',
    // Odoo ERP Navigation & Controls
    odooApps: 'Applications Odoo',
    odooInventory: 'Inventaire & Silos',
    odooManufacturing: 'Fabrication & Mouture (MRP)',
    odooPurchases: 'Achats & Pont-Bascule',
    odooSales: 'Ventes & Boulangeries',
    odooQuality: 'Contrôle Qualité & Labo',
    odooInvoicing: 'Facturation & Comptabilité',
    odooMaintenance: 'Maintenance Équipements',
    odooReporting: 'Bilan Matière & Rapports OAIC',
    btnNew: 'Nouveau',
    btnAction: 'Actions',
    btnFilters: 'Filtres',
    btnGroupBy: 'Grouper par',
    btnFavorites: 'Favoris',
    viewList: 'Liste',
    viewKanban: 'Kanban',
    viewGraph: 'Graphique',
    viewPivot: 'Tableau croisé',
    stageDraft: 'Brouillon',
    stageConfirmed: 'Confirmé',
    stageInProgress: 'En cours',
    stageDone: 'Fait',
    stageCancelled: 'Annulé',
    chatterSendMessage: 'Envoyer un message',
    chatterLogNote: 'Consigner une note',
    chatterScheduleActivity: 'Planifier une activité',
    btnNewReception: 'Nouvelle Réception Blé',
    btnNewDelivery: 'Nouveau Bon de Livraison',
    btnNewBatch: 'Nouvelle Mouture',

    // Common
    dzd: 'DZD',
    quintal: 'Qx',
    tonne: 'T',
    kg: 'kg',
    bag: 'sac',
    date: 'Date',
    time: 'Heure',
    status: 'Statut',
    actions: 'Actions',
    save: 'Enregistrer',
    cancel: 'Annuler',
    print: 'Imprimer',
    search: 'Recherche...',
    filter: 'Filtrer',
    total: 'Total',
    notes: 'Remarques',
    close: 'Fermer',
    refresh: 'Actualiser',
    resetData: 'Données par défaut',
    subsidized: 'Subventionné',
    nonSubsidized: 'Prix Libre',

    // Grains
    ble_dur_local: 'Blé Dur Local (CCLS)',
    ble_dur_importe: 'Blé Dur Importé (OAIC)',
    ble_tendre: 'Blé Tendre Meunerie',
    orge: 'Orge & Céréales Secondaires',

    // Dashboard
    kpiTotalGrain: 'Stock Céréales en Silos',
    kpiDailyCrushing: 'Écrasement Journalier',
    kpiExtractionYield: 'Taux d\'Extraction Réel',
    kpiSubsidizedDeliveries: 'Livraisons Boulangeries',
    kpiWarehouseStock: 'Stock Produits Conditionnés',
    recentReceipts: 'Dernières Réceptions Blé',
    siloOccupancy: 'Taux d\'Occupation des Silos',
    millingLinesStatus: 'État des Lignes de Mouture',
    maintenanceAlerts: 'Alertes Maintenance Préventive'
  }
};

export const formatCurrency = (amount: number, lang: Language = 'ar'): string => {
  const formatted = amount.toLocaleString(lang === 'ar' ? 'fr-DZ' : 'fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return `${formatted} ${translations[lang].dzd}`;
};

export const formatWeightQx = (weightQx: number, lang: Language = 'ar'): string => {
  const formatted = weightQx.toLocaleString(lang === 'ar' ? 'fr-DZ' : 'fr-FR', {
    maximumFractionDigits: 1
  });
  return `${formatted} ${translations[lang].quintal}`;
};
