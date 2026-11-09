import { 
  Silo, 
  WeighbridgeTicket, 
  LabTest, 
  WarehouseItem, 
  BakeryClient, 
  DeliveryBon, 
  ProductionBatch, 
  MaintenanceTask, 
  MillSettings 
} from '../types';

export const initialMillSettings: MillSettings = {
  millNameAr: 'مطاحن الهضاب الكبرى للحبوب',
  millNameFr: 'Grands Moulins des Hauts Plateaux (GMHP)',
  wilayaAr: 'سطيف - المنطقة الصناعية',
  wilayaFr: 'Sétif - Zone Industrielle',
  address: 'المنطقة الصناعية رقم 14، سطيف، الجزائر',
  phone: '+213 (0) 36 84 12 90',
  email: 'contact@moulins-hauts-plateaux.dz',
  rcNumber: '19/00-0842191 B 16',
  nifNumber: '001916084219142',
  nisNumber: '0016190100452',
  articleNumber: '19018420119',
  dailyCapacityQx: 5000,
  oaicAgreementNumber: 'AGR-OAIC/2024/094-DZ',
  qualityStandards: {
    maxMoisturePercent: 14.5,
    maxImpurityPercent: 2.0,
    minSpecificWeight: 76.0,
    minProteinPercent: 11.5,
    minGlutenPercent: 22.0,
    minFallingNumberHagberg: 220
  }
};

export const initialSilos: Silo[] = [
  {
    id: 'silo-1',
    code: 'SILO-01',
    nameAr: 'صومعة القمح اللين الوطني (CCLS)',
    nameFr: 'Silo Blé Tendre National',
    grainType: 'ble_tendre',
    capacityQx: 25000,
    currentStockQx: 18450,
    temperatureC: 19.4,
    moisturePercent: 12.8,
    ventilationActive: false,
    status: 'nominal',
    lastFillDate: '2026-11-05'
  },
  {
    id: 'silo-2',
    code: 'SILO-02',
    nameAr: 'صومعة القمح اللين المستورد (ميناء)',
    nameFr: 'Silo Blé Tendre Importé',
    grainType: 'ble_tendre',
    capacityQx: 30000,
    currentStockQx: 24200,
    temperatureC: 21.2,
    moisturePercent: 13.5,
    ventilationActive: true,
    status: 'aerating',
    lastFillDate: '2026-11-06'
  },
  {
    id: 'silo-3',
    code: 'SILO-03',
    nameAr: 'صومعة القمح الصلب الممتاز (تيارت/سيدي بلعباس)',
    nameFr: 'Silo Blé Dur Premium Local',
    grainType: 'ble_dur_local',
    capacityQx: 20000,
    currentStockQx: 14800,
    temperatureC: 18.9,
    moisturePercent: 11.9,
    ventilationActive: false,
    status: 'nominal',
    lastFillDate: '2026-11-07'
  },
  {
    id: 'silo-4',
    code: 'SILO-04',
    nameAr: 'صومعة القمح الصلب المستورد (كندا)',
    nameFr: 'Silo Blé Dur Importé Canada',
    grainType: 'ble_dur_importe',
    capacityQx: 25000,
    currentStockQx: 19300,
    temperatureC: 20.1,
    moisturePercent: 12.4,
    ventilationActive: false,
    status: 'nominal',
    lastFillDate: '2026-11-04'
  },
  {
    id: 'silo-5',
    code: 'SILO-05',
    nameAr: 'صومعة الترطيب والتكييف رقم 1',
    nameFr: 'Silo de Repos & Mouillage 1',
    grainType: 'ble_tendre',
    capacityQx: 6000,
    currentStockQx: 4800,
    temperatureC: 22.0,
    moisturePercent: 15.8,
    ventilationActive: false,
    status: 'nominal',
    lastFillDate: '2026-11-07'
  },
  {
    id: 'silo-6',
    code: 'SILO-06',
    nameAr: 'صومعة الشعير والحبوب الثانوية',
    nameFr: 'Silo Orge & Céréales Secondaires',
    grainType: 'orge',
    capacityQx: 10000,
    currentStockQx: 2150,
    temperatureC: 19.8,
    moisturePercent: 12.1,
    ventilationActive: false,
    status: 'low_stock',
    lastFillDate: '2026-10-28'
  }
];

export const initialWeighbridgeTickets: WeighbridgeTicket[] = [
  {
    id: 'tck-1',
    ticketNumber: 'TCK-2026-1048',
    date: '2026-11-08',
    time: '08:35',
    truckMatricule: '08412-120-19',
    driverName: 'عمر بلقاسم',
    carrierCompany: 'مؤسسة النقل البري اللوجستي (SNTR)',
    cclsOrigin: 'تعاونية الحبوب CCLS سطيف',
    grainType: 'ble_tendre',
    grossWeightKg: 42800,
    tareWeightKg: 14200,
    netWeightKg: 28600,
    netWeightQx: 286.0,
    assignedSiloId: 'silo-1',
    status: 'accepted',
    labTestId: 'lab-1',
    notes: 'شحنة مطابقة لمواصفات الديوان الوطني للحبوب OAIC'
  },
  {
    id: 'tck-2',
    ticketNumber: 'TCK-2026-1049',
    date: '2026-11-08',
    time: '09:15',
    truckMatricule: '12490-121-16',
    driverName: 'رشيد حماني',
    carrierCompany: 'الجزائرية للوجستيك الحبوب',
    cclsOrigin: 'ميناء جن جن (جيجل) - واردات OAIC',
    grainType: 'ble_dur_importe',
    grossWeightKg: 44100,
    tareWeightKg: 14600,
    netWeightKg: 29500,
    netWeightQx: 295.0,
    assignedSiloId: 'silo-4',
    status: 'unloaded',
    labTestId: 'lab-2',
    notes: 'تفريغ في الصومعة رقم 04 - قمح صلب كندي'
  },
  {
    id: 'tck-3',
    ticketNumber: 'TCK-2026-1050',
    date: '2026-11-08',
    time: '10:05',
    truckMatricule: '04128-119-25',
    driverName: 'سليم بن عيسى',
    carrierCompany: 'نقل الجنوب للحبوب',
    cclsOrigin: 'تعاونية الحبوب CCLS قسنطينة',
    grainType: 'ble_dur_local',
    grossWeightKg: 39800,
    tareWeightKg: 13900,
    netWeightKg: 25900,
    netWeightQx: 259.0,
    assignedSiloId: 'silo-3',
    status: 'pending_lab',
    notes: 'في انتظار نتيجة فحص الرطوبة والشوائب'
  },
  {
    id: 'tck-4',
    ticketNumber: 'TCK-2026-1046',
    date: '2026-11-07',
    time: '15:20',
    truckMatricule: '01894-118-14',
    driverName: 'حميد مزيان',
    carrierCompany: 'مؤسسة الشحن الوطني',
    cclsOrigin: 'تعاونية الحبوب CCLS تيارت',
    grainType: 'ble_tendre',
    grossWeightKg: 43500,
    tareWeightKg: 14100,
    netWeightKg: 29400,
    netWeightQx: 294.0,
    assignedSiloId: 'silo-1',
    status: 'unloaded',
    labTestId: 'lab-3',
    notes: 'تمت المصادقة والتفريغ'
  }
];

export const initialLabTests: LabTest[] = [
  {
    id: 'lab-1',
    ticketNumber: 'TCK-2026-1048',
    date: '2026-11-08',
    grainType: 'ble_tendre',
    moisturePercent: 12.6,
    impurityPercent: 1.4,
    specificWeight: 78.4,
    proteinPercent: 12.8,
    glutenPercent: 26.5,
    fallingNumberHagberg: 295,
    result: 'accepted',
    refactionDeductionKg: 0,
    laboratoryTechnician: 'م. فتيحة بوزيد (رئيسة المخبر)',
    notes: 'قمح لين بجودة جيدة ومعدل رطوبة مثالي للطحن المباشر'
  },
  {
    id: 'lab-2',
    ticketNumber: 'TCK-2026-1049',
    date: '2026-11-08',
    grainType: 'ble_dur_importe',
    moisturePercent: 13.8,
    impurityPercent: 1.8,
    specificWeight: 80.2,
    proteinPercent: 14.2,
    glutenPercent: 28.0,
    result: 'accepted',
    refactionDeductionKg: 0,
    laboratoryTechnician: 'م. سفيان كركار',
    notes: 'قمح صلب كندي غني بالبروتين، مثالي لخط السميد الممتاز'
  },
  {
    id: 'lab-3',
    ticketNumber: 'TCK-2026-1046',
    date: '2026-11-07',
    grainType: 'ble_tendre',
    moisturePercent: 14.8, // اعلى من 14.5% المعيارية
    impurityPercent: 2.3,
    specificWeight: 75.8,
    proteinPercent: 11.5,
    glutenPercent: 23.2,
    fallingNumberHagberg: 260,
    result: 'accepted_with_refaction',
    refactionDeductionKg: 350,
    laboratoryTechnician: 'م. فتيحة بوزيد',
    notes: 'تم قبول الشحنة مع تطبيق نسبة حسم (Réfactions) بقيمة 350 كغ وفق سلم OAIC'
  }
];

export const initialWarehouseItems: WarehouseItem[] = [
  {
    id: 'wh-1',
    productType: 'farine_panifiable_55',
    nameAr: 'فرينة الخبز المدعمة نوع 55 (مخابز)',
    nameFr: 'Farine Panifiable Type 55 (Boulangeries)',
    category: 'farine',
    packaging: 'sac_50kg',
    unitWeightKg: 50,
    stockBags: 3420,
    totalWeightQx: 1710,
    pricePerUnitDZD: 1000, // 2000 دج للقنطار (كيس 50 كغ = 1000 دج سعر مقنن)
    isSubsidized: true,
    minThresholdBags: 1200,
    storageBay: 'عنبر التخزين أ - الرصيف 1'
  },
  {
    id: 'wh-2',
    productType: 'farine_patissiere_45',
    nameAr: 'فرينة الحلويات الفاخرة نوع 45',
    nameFr: 'Farine Pâtissière Extra T45',
    category: 'farine',
    packaging: 'sac_25kg',
    unitWeightKg: 25,
    stockBags: 1850,
    totalWeightQx: 462.5,
    pricePerUnitDZD: 1150, // 4600 دج للقنطار
    isSubsidized: false,
    minThresholdBags: 500,
    storageBay: 'عنبر التخزين أ - الرصيف 3'
  },
  {
    id: 'wh-3',
    productType: 'semoule_extra_fine',
    nameAr: 'سميد ممتاز فائق النعومة (العائلة)',
    nameFr: 'Semoule Extra Fine Supérieure',
    category: 'semoule',
    packaging: 'sac_25kg',
    unitWeightKg: 25,
    stockBags: 450, // أقل من الحد الأدنى 800 كيس لإطلاق التنبيه
    totalWeightQx: 112.5,
    pricePerUnitDZD: 1200, // 4800 دج للقنطار
    isSubsidized: false,
    minThresholdBags: 800,
    storageBay: 'عنبر التخزين ب - الرصيف 1'
  },
  {
    id: 'wh-4',
    productType: 'semoule_moyenne',
    nameAr: 'سميد متوسط للكسكس والمخبوزات',
    nameFr: 'Semoule Moyenne de Qualité',
    category: 'semoule',
    packaging: 'sac_25kg',
    unitWeightKg: 25,
    stockBags: 1940,
    totalWeightQx: 485,
    pricePerUnitDZD: 1100,
    isSubsidized: false,
    minThresholdBags: 600,
    storageBay: 'عنبر التخزين ب - الرصيف 2'
  },
  {
    id: 'wh-5',
    productType: 'semoule_courante_subv',
    nameAr: 'سميد عادي مدعم (أكياس 25 كغ مقنن)',
    nameFr: 'Semoule Courante Subventionnée',
    category: 'semoule',
    packaging: 'sac_25kg',
    unitWeightKg: 25,
    stockBags: 2800,
    totalWeightQx: 700,
    pricePerUnitDZD: 1000, // 40 دج للكيلوغرام المقنن
    isSubsidized: true,
    minThresholdBags: 1500,
    storageBay: 'عنبر التخزين ب - الرصيف 4'
  },
  {
    id: 'wh-6',
    productType: 'son_ble',
    nameAr: 'نخالة القمح الصافية لمربي الماشية',
    nameFr: 'Son de Blé Propre pour Élevage',
    category: 'sous_produit',
    packaging: 'sac_25kg', // or 30/35kg standard
    unitWeightKg: 35,
    stockBags: 1680,
    totalWeightQx: 588,
    pricePerUnitDZD: 630, // 1800 دج للقنطار
    isSubsidized: true,
    minThresholdBags: 400,
    storageBay: 'حظيرة النخالة المفتوحة ج'
  }
];

export const initialBakeries: BakeryClient[] = [
  {
    id: 'bak-1',
    nameAr: 'مخبزة النصر الحديثة',
    nameFr: 'Boulangerie Moderne En-Nasr',
    ownerName: 'محمد لمين قرفي',
    clientType: 'boulangerie',
    wilaya: 'سطيف',
    commune: 'سطيف وسط',
    monthlyQuotaQx: 350,
    consumedQuotaQx: 120,
    phone: '0550 14 28 99',
    rcNumber: '19/00-109482 A 18',
    nifNumber: '198219001094821',
    nisNumber: '00191982001',
    articleNumber: '190209418',
    status: 'active'
  },
  {
    id: 'bak-2',
    nameAr: 'مخبزة وحلويات الأصيل',
    nameFr: 'Boulangerie Pâtisserie El Acil',
    ownerName: 'عبد القادر شلابي',
    clientType: 'boulangerie',
    wilaya: 'سطيف',
    commune: 'العلمة',
    monthlyQuotaQx: 480,
    consumedQuotaQx: 390,
    phone: '0661 88 45 12',
    rcNumber: '19/00-248911 A 19',
    nifNumber: '197519002489112',
    nisNumber: '00191975002',
    articleNumber: '190348919',
    status: 'quota_alert'
  },
  {
    id: 'bak-3',
    nameAr: 'مخبزة البركة التقليدية',
    nameFr: 'Boulangerie Traditionnelle Baraka',
    ownerName: 'بلال بوجمعة',
    clientType: 'boulangerie',
    wilaya: 'برج بوعريريج',
    commune: 'رأس الوادي',
    monthlyQuotaQx: 280,
    consumedQuotaQx: 95,
    phone: '0770 33 91 04',
    rcNumber: '34/00-098412 A 20',
    nifNumber: '198634000984120',
    nisNumber: '00341986001',
    articleNumber: '340109820',
    status: 'active'
  },
  {
    id: 'bak-4',
    nameAr: 'مؤسسة الوفاق لتوزيع المواد الغذائية بالجملة',
    nameFr: 'SARL El Wifak Grossiste Agro',
    ownerName: 'حسين مراكشي (المدير العام)',
    clientType: 'grossiste',
    wilaya: 'قسنطينة',
    commune: 'الخروب',
    monthlyQuotaQx: 1200,
    consumedQuotaQx: 650,
    phone: '031 92 40 80',
    rcNumber: '25/00-584012 B 15',
    nifNumber: '001525005840124',
    nisNumber: '00251915003',
    articleNumber: '250158415',
    status: 'active'
  },
  {
    id: 'bak-5',
    nameAr: 'مخبزة الأمل الآلية',
    nameFr: 'Boulangerie Industrielle El Amal',
    ownerName: 'طارق زياني',
    clientType: 'boulangerie',
    wilaya: 'سطيف',
    commune: 'عين ولمان',
    monthlyQuotaQx: 300,
    consumedQuotaQx: 80,
    phone: '0555 67 12 30',
    rcNumber: '19/00-334190 A 21',
    nifNumber: '199019003341901',
    nisNumber: '00191990003',
    articleNumber: '190433421',
    status: 'active'
  }
];

export const initialDeliveryBons: DeliveryBon[] = [
  {
    id: 'bl-1',
    bonNumber: 'BL-2026-1402',
    invoiceNumber: 'FAC-2026-0891',
    date: '2026-11-08',
    clientId: 'bak-1',
    clientName: 'مخبزة النصر الحديثة (سطيف)',
    clientType: 'boulangerie',
    items: [
      {
        productType: 'farine_panifiable_55',
        productNameAr: 'فرينة الخبز المدعمة نوع 55',
        packaging: 'sac_50kg',
        quantityBags: 60,
        unitWeightKg: 50,
        totalWeightQx: 30,
        unitPriceDZD: 1000,
        totalAmountDZD: 60000
      }
    ],
    totalWeightQx: 30,
    subtotalDZD: 60000,
    tvaDZD: 0, // منتج مدعم معفى من الرسم على القيمة المضافة
    totalAmountDZD: 60000,
    truckMatricule: '09812-119-19',
    driverName: 'سعيد بن دحمان',
    paymentMethod: 'especes',
    paymentStatus: 'paid',
    notes: 'تسليم الحصة الأسبوعية للمخبزة'
  },
  {
    id: 'bl-2',
    bonNumber: 'BL-2026-1403',
    invoiceNumber: 'FAC-2026-0892',
    date: '2026-11-08',
    clientId: 'bak-4',
    clientName: 'SARL El Wifak Grossiste Agro',
    clientType: 'grossiste',
    items: [
      {
        productType: 'semoule_extra_fine',
        productNameAr: 'سميد ممتاز فائق النعومة',
        packaging: 'sac_25kg',
        quantityBags: 200,
        unitWeightKg: 25,
        totalWeightQx: 50,
        unitPriceDZD: 1200,
        totalAmountDZD: 240000
      },
      {
        productType: 'semoule_moyenne',
        productNameAr: 'سميد متوسط للكسكس',
        packaging: 'sac_25kg',
        quantityBags: 120,
        unitWeightKg: 25,
        totalWeightQx: 30,
        unitPriceDZD: 1100,
        totalAmountDZD: 132000
      }
    ],
    totalWeightQx: 80,
    subtotalDZD: 372000,
    tvaDZD: 33480, // TVA 9%
    totalAmountDZD: 405480,
    truckMatricule: '14520-120-25',
    driverName: 'كمال بوسعادة',
    paymentMethod: 'cheque',
    paymentStatus: 'paid',
    notes: 'تسليم طلبية تاجر الجملة بشيك بنكي'
  },
  {
    id: 'bl-3',
    bonNumber: 'BL-2026-1400',
    invoiceNumber: 'FAC-2026-0889',
    date: '2026-11-07',
    clientId: 'bak-2',
    clientName: 'مخبزة وحلويات الأصيل (العلمة)',
    clientType: 'boulangerie',
    items: [
      {
        productType: 'farine_panifiable_55',
        productNameAr: 'فرينة الخبز المدعمة نوع 55',
        packaging: 'sac_50kg',
        quantityBags: 80,
        unitWeightKg: 50,
        totalWeightQx: 40,
        unitPriceDZD: 1000,
        totalAmountDZD: 80000
      },
      {
        productType: 'farine_patissiere_45',
        productNameAr: 'فرينة الحلويات الفاخرة T45',
        packaging: 'sac_25kg',
        quantityBags: 20,
        unitWeightKg: 25,
        totalWeightQx: 5,
        unitPriceDZD: 1150,
        totalAmountDZD: 23000
      }
    ],
    totalWeightQx: 45,
    subtotalDZD: 103000,
    tvaDZD: 2070, // 9% على فرينة الحلويات فقط
    totalAmountDZD: 105070,
    truckMatricule: '04128-119-19',
    driverName: 'ياسين عمروش',
    paymentMethod: 'cheque',
    paymentStatus: 'paid'
  }
];

export const initialBatches: ProductionBatch[] = [
  {
    id: 'bat-0',
    batchNumber: 'PROD-2026-072',
    date: '2026-05-20',
    shift: 'morning',
    lineId: 'minoterie_tendre',
    grainProcessedQx: 1100,
    siloSourceId: 'silo-1',
    expiryDate: '2026-11-20', // يقترب من الانتهاء خلال 12 يوماً!
    outputs: [
      {
        productType: 'farine_panifiable_55',
        quantityQx: 858,
        bagsCount: 1716,
        packageType: 'أكياس 50 كغ'
      },
      {
        productType: 'son_ble',
        quantityQx: 187,
        bagsCount: 534,
        packageType: 'أكياس 35 كغ'
      }
    ],
    extractionRatePercent: 78.0,
    energyConsumedKwh: 13100,
    millerInCharge: 'الشيخ عبد الرزاق بن علي',
    notes: 'دفعة سابقة مخزنة يرجى إخراجها والتوزيع السريع للمخابز قبل تاريخ انتهاء الصلاحية'
  },
  {
    id: 'bat-1',
    batchNumber: 'PROD-2026-089',
    date: '2026-11-08',
    shift: 'morning',
    lineId: 'minoterie_tendre',
    grainProcessedQx: 1200,
    siloSourceId: 'silo-1',
    expiryDate: '2027-05-08',
    outputs: [
      {
        productType: 'farine_panifiable_55',
        quantityQx: 936, // 78% extraction
        bagsCount: 1872,
        packageType: 'أكياس 50 كغ'
      },
      {
        productType: 'farine_patissiere_45',
        quantityQx: 36,
        bagsCount: 144,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'son_ble',
        quantityQx: 204, // 17% son
        bagsCount: 582,
        packageType: 'أكياس 35 كغ'
      }
    ],
    extractionRatePercent: 81.0,
    energyConsumedKwh: 14200,
    millerInCharge: 'الشيخ عبد الرزاق بن علي (كبير الطحانين)',
    notes: 'مردودية ممتازة مع نقاوة عالية للفرينة واستقرار ضغط أسطوانات التكسير B1-B2'
  },
  {
    id: 'bat-2',
    batchNumber: 'PROD-2026-088',
    date: '2026-11-07',
    shift: 'night',
    lineId: 'semoulerie_dur',
    grainProcessedQx: 950,
    siloSourceId: 'silo-3',
    expiryDate: '2027-05-07',
    outputs: [
      {
        productType: 'semoule_extra_fine',
        quantityQx: 380,
        bagsCount: 1520,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'semoule_moyenne',
        quantityQx: 285,
        bagsCount: 1140,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'semoule_grosse',
        quantityQx: 47.5,
        bagsCount: 190,
        packageType: 'أكياس 25 كغ'
      },
      {
        productType: 'son_ble',
        quantityQx: 199.5,
        bagsCount: 570,
        packageType: 'أكياس 35 كغ'
      }
    ],
    extractionRatePercent: 75.0,
    energyConsumedKwh: 12800,
    millerInCharge: 'مهندس الإنتاج مراد حساني',
    notes: 'تشغيل أجهزة السوسوار (Sasseurs) بكفاءة كاملة لفرز السميد'
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'maint-1',
    machineNameAr: 'مجموعة أسطوانات التكسير الأولى (Broyage B1-B2)',
    machineNameFr: 'Cylindres Cannelés Broyeurs B1-B2 (Bühler)',
    section: 'broyage',
    component: 'تسنيم الأسطوانات (Cannelures) وفحص المحامل',
    currentHours: 1920,
    maxServiceHours: 2000,
    lastMaintenanceDate: '2026-08-15',
    status: 'due_soon',
    technician: 'م. لخضر بوشارب'
  },
  {
    id: 'maint-2',
    machineNameAr: 'منخل المناخل الكبرى (Plansichter 8 Compartiments)',
    machineNameFr: 'Plansichter Principal MPAG',
    section: 'tamisage',
    component: 'تغيير أقمشة الحرير النايلون وفحص المنظفات',
    currentHours: 850,
    maxServiceHours: 1500,
    lastMaintenanceDate: '2026-09-20',
    status: 'good',
    technician: 'م. نور الدين مسعودي'
  },
  {
    id: 'maint-3',
    machineNameAr: 'آلة التعبئة والتوزين الآلي 50 كغ',
    machineNameFr: 'Ensacheuse Automatique Carrousel 50kg',
    section: 'ensachage',
    component: 'معايرة خلايا الوزن الهوائية وخياطة الأكياس',
    currentHours: 1480,
    maxServiceHours: 1500,
    lastMaintenanceDate: '2026-09-02',
    status: 'critical',
    technician: 'م. مراد قاسمي'
  },
  {
    id: 'maint-4',
    machineNameAr: 'مراوح تهوية الصوامع وفلاتر الغبار (Dépoussiérage)',
    machineNameFr: 'Filtres d\'aspiration & Ventilateurs Silos',
    section: 'silos',
    component: 'تنظيف خراطيش الهواء وفحص صمامات النبض الهوائي',
    currentHours: 620,
    maxServiceHours: 1000,
    lastMaintenanceDate: '2026-10-10',
    status: 'good',
    technician: 'م. لخضر بوشارب'
  }
];
