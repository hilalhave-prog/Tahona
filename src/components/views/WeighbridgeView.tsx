import React, { useState } from 'react';
import { Scale, Plus, Search, Filter, Printer, CheckCircle, ArrowDownCircle, AlertCircle, FileText } from 'lucide-react';
import { WeighbridgeTicket, Silo } from '../../types';
import { Language, translations, formatWeightQx } from '../../utils/translations';

interface WeighbridgeViewProps {
  tickets: WeighbridgeTicket[];
  silos: Silo[];
  onOpenNewReception: () => void;
  onViewTicket: (ticket: WeighbridgeTicket) => void;
  lang: Language;
}

export const WeighbridgeView: React.FC<WeighbridgeViewProps> = ({
  tickets,
  silos,
  onOpenNewReception,
  onViewTicket,
  lang
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filtered tickets
  const filteredTickets = tickets.filter((tk) => {
    const matchesSearch =
      tk.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.truckMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.cclsOrigin.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    return matchesSearch && tk.grainType === filterType;
  });

  const totalReceivedQx = tickets.reduce((acc, curr) => acc + curr.netWeightQx, 0);

  return (
    <div className="space-y-6">
      {/* View Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {lang === 'ar' ? 'ميزان القبان واستقبال شحنات الحبوب (Pont-Bascule)' : 'Gestion du Pont-Bascule et Réception des Grains'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'تسجيل وصول شاحنات ديوان الحبوب OAIC، وزن القبان الآلي، وتعيين صوامع التفريغ وإصدار تذاكر الوزن المعتمدة.'
              : 'Enregistrement des camions OAIC/CCLS, pesée automatique, affectation aux silos et impression des tickets de pesée.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewReception}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnNewReception}</span>
          </button>
        </div>
      </div>

      {/* Live Operational Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'إجمالي الحبوب المستلمة بالقبّان' : 'Total Céréales Réceptionnées'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatWeightQx(totalReceivedQx, lang)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {(totalReceivedQx / 10).toFixed(1)} طن متري مسجل
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'عدد الشاحنات المقيدة اليوم' : 'Nombre de Rotations Camions'}
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
            {tickets.length} شاحنة
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            معدل حمولة الشاحنة: ~285 قنطار
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-medium mb-1">
            {lang === 'ar' ? 'حالة ميزان القبان الرقمي' : 'Statut du Pont-Bascule'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {lang === 'ar' ? 'معاير وجاهز للوزن' : 'Étalonné & Opérationnel'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            معتمد من الديوان الوطني للقياسة القانونية (ONML)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث برقم الشاحنة، التذكرة، أو تعاونية CCLS...' : 'Rechercher par matricule, ticket, CCLS...'}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'جميع الحبوب' : 'Tous'}
          </button>
          <button
            onClick={() => setFilterType('ble_tendre')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterType === 'ble_tendre'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.ble_tendre}
          </button>
          <button
            onClick={() => setFilterType('ble_dur_local')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterType === 'ble_dur_local'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.ble_dur_local}
          </button>
          <button
            onClick={() => setFilterType('ble_dur_importe')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterType === 'ble_dur_importe'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.ble_dur_importe}
          </button>
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th className="p-3 text-start font-semibold">رقم التذكرة</th>
                <th className="p-3 text-start font-semibold">التاريخ والوقت</th>
                <th className="p-3 text-start font-semibold">لوحة الشاحنة</th>
                <th className="p-3 text-start font-semibold">السائق / الناقل</th>
                <th className="p-3 text-start font-semibold">مصدر الحبوب (CCLS)</th>
                <th className="p-3 text-start font-semibold">النوع</th>
                <th className="p-3 text-end font-semibold">الإجمالي (كغ)</th>
                <th className="p-3 text-end font-semibold">الفارغ Tare</th>
                <th className="p-3 text-end font-semibold">الصافي (قنطار)</th>
                <th className="p-3 text-center font-semibold">الصومعة</th>
                <th className="p-3 text-center font-semibold">الحالة</th>
                <th className="p-3 text-end font-semibold">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map((ticket) => {
                const assignedSilo = silos.find((s) => s.id === ticket.assignedSiloId);
                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {ticket.ticketNumber}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {ticket.date} <span className="text-[10px]">({ticket.time})</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {ticket.truckMatricule}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{ticket.driverName}</div>
                      <div className="text-[10px] text-slate-400">{ticket.carrierCompany}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                      {ticket.cclsOrigin}
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">
                      {t[ticket.grainType]}
                    </td>
                    <td className="p-3 text-end font-mono tabular-nums text-slate-500">
                      {ticket.grossWeightKg.toLocaleString()}
                    </td>
                    <td className="p-3 text-end font-mono tabular-nums text-slate-500">
                      {ticket.tareWeightKg.toLocaleString()}
                    </td>
                    <td className="p-3 text-end font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      {ticket.netWeightQx.toFixed(1)} ق
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        {assignedSilo ? assignedSilo.code : 'صومعة 1'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {ticket.status === 'unloaded' ? 'تم التفريغ' : 'مقبول بالصوامع'}
                      </span>
                    </td>
                    <td className="p-3 text-end">
                      <button
                        onClick={() => onViewTicket(ticket)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t.print}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
