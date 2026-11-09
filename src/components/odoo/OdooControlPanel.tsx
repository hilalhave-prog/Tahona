import React, { useState } from 'react';
import { 
  Plus, 
  List, 
  LayoutGrid, 
  BarChart3, 
  Search, 
  Filter, 
  Layers, 
  Star, 
  Download, 
  Printer, 
  ChevronDown 
} from 'lucide-react';
import { Language, translations } from '../../utils/translations';

export type OdooViewMode = 'list' | 'kanban' | 'graph';

interface OdooControlPanelProps {
  breadcrumbApp: string;
  breadcrumbSection: string;
  breadcrumbItem?: string;
  onNewClick?: () => void;
  newButtonLabel?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: OdooViewMode;
  setViewMode: (mode: OdooViewMode) => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  filterOptions?: { id: string; label: string }[];
  lang: Language;
}

export const OdooControlPanel: React.FC<OdooControlPanelProps> = ({
  breadcrumbApp,
  breadcrumbSection,
  breadcrumbItem,
  onNewClick,
  newButtonLabel,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onExportCSV,
  onPrint,
  activeFilter,
  setActiveFilter,
  filterOptions = [],
  lang
}) => {
  const t = translations[lang];
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs px-3 sm:px-6 py-2.5 space-y-2">
      {/* Top Row: Breadcrumbs on Start, Search on End */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer font-bold text-slate-800 dark:text-slate-200">
            {breadcrumbApp}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {breadcrumbSection}
          </span>
          {breadcrumbItem && (
            <>
              <span className="text-slate-400">/</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold font-mono">
                {breadcrumbItem}
              </span>
            </>
          )}
        </div>

        {/* Odoo Search Bar with Filters and Group By */}
        <div className="relative flex items-center w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث أو تصفية...' : 'Recherche ou filtre...'}
            className="w-full ps-9 pe-20 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
          />

          {/* Inline Filter Pill Dropdown trigger */}
          {filterOptions.length > 0 && setActiveFilter && (
            <div className="absolute end-1 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-[#714B67] dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <Filter className="w-3 h-3" />
                <span>{t.btnFilters}</span>
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute end-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-30 py-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      activeFilter === 'all' ? 'font-bold text-[#714B67] dark:text-amber-400' : ''
                    }`}
                  >
                    {lang === 'ar' ? 'الكل' : 'Tous'}
                  </button>
                  {filterOptions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFilter(f.id);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        activeFilter === f.id ? 'font-bold text-[#714B67] dark:text-amber-400' : ''
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Actions ("جديد", "إجراءات") & View Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {/* Odoo Purple "Nouveau" Button */}
          {onNewClick && (
            <button
              onClick={onNewClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] dark:bg-amber-600 dark:hover:bg-amber-700 rounded shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{newButtonLabel || t.btnNew}</span>
            </button>
          )}

          {/* Odoo "Actions" Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t.btnAction}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isActionsOpen && (
              <div className="absolute start-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-30 py-1 text-xs">
                {onExportCSV && (
                  <button
                    onClick={() => {
                      onExportCSV();
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>تصدير إلى Excel/CSV</span>
                  </button>
                )}
                {onPrint && (
                  <button
                    onClick={() => {
                      onPrint();
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>طباعة القائمة</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Switchers: List / Tree, Kanban, Graph */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-[#714B67] dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t.viewList}
            aria-label="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-700 text-[#714B67] dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t.viewKanban}
            aria-label="Kanban View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'graph'
                ? 'bg-white dark:bg-slate-700 text-[#714B67] dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={t.viewGraph}
            aria-label="Graph View"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
