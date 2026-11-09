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

import {
  initialSilos,
  initialWeighbridgeTickets,
  initialLabTests,
  initialWarehouseItems,
  initialBakeries,
  initialDeliveryBons,
  initialBatches,
  initialMaintenanceTasks,
  initialMillSettings
} from '../data/initialData';

const KEYS = {
  SILOS: 'algerian_mill_silos',
  TICKETS: 'algerian_mill_tickets',
  LAB_TESTS: 'algerian_mill_lab_tests',
  WAREHOUSE: 'algerian_mill_warehouse',
  BAKERIES: 'algerian_mill_bakeries',
  DELIVERIES: 'algerian_mill_deliveries',
  BATCHES: 'algerian_mill_batches',
  MAINTENANCE: 'algerian_mill_maintenance',
  SETTINGS: 'algerian_mill_settings',
  LANGUAGE: 'algerian_mill_language',
  THEME: 'algerian_mill_theme'
};

export const getStoredData = () => {
  try {
    const silos: Silo[] = JSON.parse(localStorage.getItem(KEYS.SILOS) || JSON.stringify(initialSilos));
    const tickets: WeighbridgeTicket[] = JSON.parse(localStorage.getItem(KEYS.TICKETS) || JSON.stringify(initialWeighbridgeTickets));
    const labTests: LabTest[] = JSON.parse(localStorage.getItem(KEYS.LAB_TESTS) || JSON.stringify(initialLabTests));
    const warehouse: WarehouseItem[] = JSON.parse(localStorage.getItem(KEYS.WAREHOUSE) || JSON.stringify(initialWarehouseItems));
    const bakeries: BakeryClient[] = JSON.parse(localStorage.getItem(KEYS.BAKERIES) || JSON.stringify(initialBakeries));
    const deliveries: DeliveryBon[] = JSON.parse(localStorage.getItem(KEYS.DELIVERIES) || JSON.stringify(initialDeliveryBons));
    const batches: ProductionBatch[] = JSON.parse(localStorage.getItem(KEYS.BATCHES) || JSON.stringify(initialBatches));
    const maintenance: MaintenanceTask[] = JSON.parse(localStorage.getItem(KEYS.MAINTENANCE) || JSON.stringify(initialMaintenanceTasks));
    const settings: MillSettings = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(initialMillSettings));

    return {
      silos,
      tickets,
      labTests,
      warehouse,
      bakeries,
      deliveries,
      batches,
      maintenance,
      settings
    };
  } catch {
    return {
      silos: initialSilos,
      tickets: initialWeighbridgeTickets,
      labTests: initialLabTests,
      warehouse: initialWarehouseItems,
      bakeries: initialBakeries,
      deliveries: initialDeliveryBons,
      batches: initialBatches,
      maintenance: initialMaintenanceTasks,
      settings: initialMillSettings
    };
  }
};

export const saveItem = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

export const resetToInitial = () => {
  localStorage.clear();
  window.location.reload();
};

export { KEYS };
