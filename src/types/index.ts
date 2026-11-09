export type GrainType = 'ble_dur_local' | 'ble_dur_importe' | 'ble_tendre' | 'orge';

export type OdooStage = 'draft' | 'confirmed' | 'in_progress' | 'done' | 'cancelled';

export interface ChatterMessage {
  id: string;
  author: string;
  date: string;
  time: string;
  type: 'comment' | 'system' | 'status_change';
  content: string;
}

export type ProductType = 
  | 'farine_panifiable_55' 
  | 'farine_patissiere_45'
  | 'farine_vrac'
  | 'semoule_extra_fine'
  | 'semoule_fine'
  | 'semoule_moyenne'
  | 'semoule_grosse'
  | 'semoule_courante_subv'
  | 'son_ble'
  | 'farine_basse';

export interface WeighbridgeTicket {
  id: string;
  ticketNumber: string; // e.g. TCK-2026-0842
  date: string;
  time: string;
  truckMatricule: string; // e.g. 05421-124-16
  driverName: string;
  carrierCompany: string;
  cclsOrigin: string; // e.g. CCLS Blida, CCLS Tiaret, Port d'Alger
  grainType: GrainType;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netWeightQx: number; // 1 Qx = 100 Kg
  assignedSiloId: string;
  status: 'pending_lab' | 'accepted' | 'unloaded' | 'rejected';
  labTestId?: string;
  notes?: string;
}

export interface LabTest {
  id: string;
  ticketNumber: string;
  date: string;
  grainType: GrainType;
  moisturePercent: number; // Max norm 14.5%
  impurityPercent: number; // Max norm 2.0%
  specificWeight: number; // Min norm 76 kg/hl
  proteinPercent: number; // Target >= 12%
  glutenPercent?: number; // Target >= 24%
  fallingNumberHagberg?: number; // Hagberg seconds (250-320s)
  result: 'accepted' | 'accepted_with_refaction' | 'rejected';
  refactionDeductionKg: number;
  laboratoryTechnician: string;
  isCompliant?: boolean; // وضع علامة 'مطابق' أو 'غير مطابق' تلقائياً
  signedBy?: string; // اسم المسؤول المخبري الموقع
  signedAt?: string; // تاريخ ووقت التوقيع المعتمد
  signatureHash?: string; // البصمة الرقمية للشهادة
  notes: string;
}

export interface Silo {
  id: string;
  code: string; // e.g. SILO-01
  nameAr: string;
  nameFr: string;
  grainType: GrainType;
  capacityQx: number;
  currentStockQx: number;
  temperatureC: number;
  moisturePercent: number;
  ventilationActive: boolean;
  status: 'nominal' | 'aerating' | 'low_stock' | 'high_temp';
  lastFillDate: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  date: string;
  shift: 'morning' | 'evening' | 'night';
  lineId: 'minoterie_tendre' | 'semoulerie_dur';
  grainProcessedQx: number;
  siloSourceId: string;
  outputs: {
    productType: ProductType;
    quantityQx: number;
    bagsCount: number;
    packageType: string;
  }[];
  extractionRatePercent: number; // yield %
  energyConsumedKwh: number;
  millerInCharge: string;
  expiryDate?: string; // تاريخ نهاية الصلاحية (DDM/DLC)
  notes?: string;
}

export interface AlertNotification {
  id: string;
  type: 'bag_stock_low' | 'batch_expiring' | 'silo_low' | 'maintenance_due';
  severity: 'warning' | 'critical' | 'info';
  titleAr: string;
  titleFr: string;
  messageAr: string;
  messageFr: string;
  timestamp: string;
  read: boolean;
  targetAppId?: string;
  actionLabelAr?: string;
  actionLabelFr?: string;
  details?: {
    itemCode?: string;
    itemName?: string;
    currentValue?: number;
    thresholdValue?: number;
    unit?: string;
    daysRemaining?: number;
  };
}

export interface WarehouseItem {
  id: string;
  productType: ProductType;
  nameAr: string;
  nameFr: string;
  category: 'farine' | 'semoule' | 'sous_produit';
  packaging: 'sac_50kg' | 'sac_25kg' | 'sac_10kg' | 'sac_5kg' | 'vrac_tonne';
  unitWeightKg: number;
  stockBags: number;
  totalWeightQx: number;
  pricePerUnitDZD: number;
  isSubsidized: boolean; // المدعم قانونياً
  minThresholdBags: number;
  storageBay: string;
}

export interface BakeryClient {
  id: string;
  nameAr: string;
  nameFr: string;
  ownerName: string;
  clientType: 'boulangerie' | 'grossiste' | 'industriel';
  wilaya: string;
  commune: string;
  monthlyQuotaQx: number; // حصة الفرينة المدعمة شهرياً
  consumedQuotaQx: number; // المستهلك حتى الآن
  phone: string;
  rcNumber: string; // Registre de Commerce
  nifNumber: string; // NIF
  nisNumber: string; // NIS
  articleNumber: string; // Article d'imposition
  status: 'active' | 'quota_alert' | 'suspended';
}

export interface DeliveryItem {
  productType: ProductType;
  productNameAr: string;
  packaging: string;
  quantityBags: number;
  unitWeightKg: number;
  totalWeightQx: number;
  unitPriceDZD: number;
  totalAmountDZD: number;
}

export interface DeliveryBon {
  id: string;
  bonNumber: string; // BL-2026-1184
  invoiceNumber?: string; // FC-2026-0429
  date: string;
  clientId: string;
  clientName: string;
  clientType: 'boulangerie' | 'grossiste' | 'industriel';
  items: DeliveryItem[];
  totalWeightQx: number;
  subtotalDZD: number;
  tvaDZD: number; // TVA 9% or 19% or 0% if subsidized
  totalAmountDZD: number;
  truckMatricule: string;
  driverName: string;
  paymentMethod: 'especes' | 'cheque' | 'virement' | 'a_terme';
  paymentStatus: 'paid' | 'pending';
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  machineNameAr: string;
  machineNameFr: string;
  section: 'broyage' | 'sassage' | 'tamisage' | 'ensachage' | 'silos';
  component: string;
  currentHours: number;
  maxServiceHours: number;
  lastMaintenanceDate: string;
  status: 'good' | 'due_soon' | 'critical';
  technician: string;
}

export interface QualityStandardsConfig {
  maxMoisturePercent: number; // Max norm, e.g. 14.5%
  maxImpurityPercent: number; // Max norm, e.g. 2.0%
  minSpecificWeight: number; // Min norm, e.g. 76.0 kg/hl
  minProteinPercent: number; // Min norm, e.g. 11.5%
  minGlutenPercent: number; // Min norm, e.g. 22.0%
  minFallingNumberHagberg: number; // Min norm, e.g. 220 s
}

export interface MillSettings {
  millNameAr: string;
  millNameFr: string;
  wilayaAr: string;
  wilayaFr: string;
  address: string;
  phone: string;
  email: string;
  rcNumber: string;
  nifNumber: string;
  nisNumber: string;
  articleNumber: string;
  dailyCapacityQx: number; // مثلا 4500 قنطار / 24 سا
  oaicAgreementNumber: string; // رقم الاعتماد لدى الديوان
  qualityStandards?: QualityStandardsConfig; // معايير جودة الدقيق والحبوب المحددة
}
