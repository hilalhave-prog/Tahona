import { WarehouseItem, ProductionBatch, Silo, AlertNotification } from '../types';

/**
 * Evaluates current mill state against regulatory and operational safety thresholds
 * Returns active Smart Alert notifications for bags stock and batch expirations.
 */
export function evaluateSmartAlerts(
  warehouse: WarehouseItem[],
  batches: ProductionBatch[],
  silos: Silo[] = []
): AlertNotification[] {
  const alerts: AlertNotification[] = [];
  const currentDate = new Date('2026-11-08'); // Reference ERP local date

  // 1. Evaluate Packaged Bags Stock vs Minimum Thresholds
  warehouse.forEach((item) => {
    if (item.stockBags <= item.minThresholdBags) {
      const isCritical = item.stockBags <= Math.round(item.minThresholdBags * 0.5);
      const deficit = item.minThresholdBags - item.stockBags;

      alerts.push({
        id: `alert-stock-${item.id}`,
        type: 'bag_stock_low',
        severity: isCritical ? 'critical' : 'warning',
        titleAr: isCritical 
          ? `⚠️ نفاد حرج لمخزون الأكياس: ${item.nameAr}`
          : `⚠️ تنبيه انخفاض مخزون: ${item.nameAr}`,
        titleFr: isCritical
          ? `Alerte Critique Stock: ${item.nameFr}`
          : `Alerte Stock Bas: ${item.nameFr}`,
        messageAr: `المخزون الحالي في العنبر هو ${item.stockBags.toLocaleString()} كيس فقط، وهو أقل من عتبة الأمان المحددة (${item.minThresholdBags.toLocaleString()} كيس). العجز المسجل: ${deficit.toLocaleString()} كيس. يرجى برمجة أمر طحن جديد لتعويض النقص.`,
        messageFr: `Stock actuel: ${item.stockBags.toLocaleString()} sacs (Seuil de sécurité: ${item.minThresholdBags.toLocaleString()} sacs). Déficit: ${deficit.toLocaleString()} sacs. Veuillez programmer un nouvel ordre de fabrication.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        targetAppId: 'inventory',
        actionLabelAr: 'فحص عنبر الأكياس',
        actionLabelFr: 'Voir le Stock',
        details: {
          itemCode: item.productType,
          itemName: item.nameAr,
          currentValue: item.stockBags,
          thresholdValue: item.minThresholdBags,
          unit: 'كيس'
        }
      });
    }
  });

  // 2. Evaluate Production Batches Shelf-Life & Expiration (DLC / DDM)
  batches.forEach((batch) => {
    // If no explicit expiryDate, estimate default 6 months from batch production date
    let expDateStr = batch.expiryDate;
    if (!expDateStr && batch.date) {
      const prodDate = new Date(batch.date);
      prodDate.setMonth(prodDate.getMonth() + 6);
      expDateStr = prodDate.toISOString().split('T')[0];
    }

    if (expDateStr) {
      const expiry = new Date(expDateStr);
      const diffTime = expiry.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 30) {
        const isCritical = daysRemaining <= 10;
        const isExpired = daysRemaining <= 0;

        alerts.push({
          id: `alert-expiry-${batch.id}`,
          type: 'batch_expiring',
          severity: isExpired || isCritical ? 'critical' : 'warning',
          titleAr: isExpired
            ? `⛔ دفعة طحن منتهية الصلاحية: ${batch.batchNumber}`
            : `⏳ اقتراب انتهاء صلاحية الدفعة: ${batch.batchNumber}`,
          titleFr: isExpired
            ? `Lot Périmé: ${batch.batchNumber}`
            : `DLC Proche pour le Lot: ${batch.batchNumber}`,
          messageAr: isExpired
            ? `تجاوزت الدفعة ${batch.batchNumber} تاريخ الصلاحية القانوني (${expDateStr}). يجب عزل الكميات المتبقية فوراً من عنبر التوزيع.`
            : `تبقى ${daysRemaining} يوماً فقط على انتهاء صلاحية الدفعة رقم ${batch.batchNumber} (تاريخ الانتهاء: ${expDateStr}). ينصح بتوجيه الأكياس للتسليم بالأولوية (نظام FIFO) للمخابز المعتمدة.`,
          messageFr: isExpired
            ? `Le lot ${batch.batchNumber} a dépassé sa date limite (${expDateStr}). Bloquer immédiatement les sorties.`
            : `Il reste ${daysRemaining} jours avant la date limite de consommation du lot ${batch.batchNumber} (DLC: ${expDateStr}). Appliquer la règle FIFO.`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          read: false,
          targetAppId: 'mrp',
          actionLabelAr: 'فحص تفاصيل الدفعة',
          actionLabelFr: 'Voir le Lot',
          details: {
            itemCode: batch.batchNumber,
            itemName: batch.lineId === 'minoterie_tendre' ? 'فرينة الخبز' : 'سميد',
            daysRemaining,
            currentValue: daysRemaining,
            thresholdValue: 30,
            unit: 'يوم'
          }
        });
      }
    }
  });

  // 3. Evaluate Silos capacity (Raw grain stock check)
  silos.forEach((silo) => {
    const occupancyPercent = (silo.currentStockQx / silo.capacityQx) * 100;
    if (occupancyPercent < 15 && silo.grainType !== 'orge') {
      alerts.push({
        id: `alert-silo-${silo.id}`,
        type: 'silo_low',
        severity: 'warning',
        titleAr: `🌾 انخفاض مخزون الصومعة: ${silo.code}`,
        titleFr: `Niveau Bas Silo: ${silo.code}`,
        messageAr: `المخزون في ${silo.nameAr} انخفض إلى ${silo.currentStockQx.toLocaleString()} ق (${occupancyPercent.toFixed(1)}%). يرجى التنسيق مع تعاونية الحبوب CCLS لشحن حبوب جديدة.`,
        messageFr: `Le niveau du ${silo.nameFr} est à ${occupancyPercent.toFixed(1)}% (${silo.currentStockQx} Qx). Prévoir réapprovisionnement CCLS.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        targetAppId: 'purchases',
        actionLabelAr: 'قبان الاستقبال',
        actionLabelFr: 'Pont-Bascule',
        details: {
          itemCode: silo.code,
          itemName: silo.nameAr,
          currentValue: silo.currentStockQx,
          thresholdValue: Math.round(silo.capacityQx * 0.15),
          unit: 'قنطار'
        }
      });
    }
  });

  return alerts;
}
