
// src/modules/dashboard/components/DataTable.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from 'react-icons/fi';
import useDebounce from '../../../shared/hooks/useDebounce';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  itemsPerPage?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onRowClick?: (row: T) => void;
  noDataMessage?: string;
  actions?: React.ReactNode;
  rowClassName?: (row: T) => string;
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  itemsPerPage = 10,
  searchable = false,
  searchPlaceholder,
  searchKey,
  onRowClick,
  noDataMessage,
  actions,
  rowClassName,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reset page when data or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, debouncedSearchQuery]);

  // Filtered data based on search
  const filteredData = searchable && searchKey && debouncedSearchQuery
    ? data.filter(item => {
        const value = item[searchKey];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        }
        return false;
      })
    : data;

  // Sorting logic
  const sortedData = sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue === bValue) return 0;
        
        if (sortConfig.direction === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key: direction ? key : null, direction });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Table Header with search and actions */}
      {(searchable || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {searchable && (
            <div className="relative w-full sm:w-auto sm:min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <FiSearch size={16} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={searchPlaceholder || t('table.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    typeof column.accessor === 'string' && column.sortable
                      ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                      : ''
                  }`}
                  onClick={() => {
                    if (typeof column.accessor === 'string' && column.sortable) {
                      handleSort(column.accessor);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {typeof column.accessor === 'string' && column.sortable && sortConfig.key === column.accessor && (
                      <span>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              Array(itemsPerPage).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {noDataMessage || t('table.noData')}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
                  } ${rowClassName ? rowClassName(row) : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : String(row[column.accessor] || '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('table.showing')} {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, sortedData.length)} {t('table.of')}{' '}
            {sortedData.length} {t('table.items')}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={t('table.previous')}
            >
              <FiChevronLeft size={16} />
            </button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={t('table.next')}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
