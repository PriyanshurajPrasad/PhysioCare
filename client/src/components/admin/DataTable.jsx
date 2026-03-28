import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Eye, EyeOff, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data available',
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Responsive items per page
  const getResponsiveItemsPerPage = () => {
    const width = window.innerWidth;
    if (width < 640) return 5;
    if (width < 1024) return 10;
    if (width < 1280) return 15;
    return 20;
  };

  // Responsive columns
  const getResponsiveColumns = () => {
    const width = window.innerWidth;
    if (width < 640) {
      // Mobile: Show essential columns only, stack vertically
      return columns.filter(col => col.essential !== false).slice(0, 2);
    }
    if (width < 1024) {
      // Tablet: Show more columns but hide some less important ones
      return columns.filter(col => col.priority !== 'low').slice(0, 4);
    }
    return columns;
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column.key, direction: newDirection });
  };

  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  }, [data, searchTerm]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const visibleColumns = getResponsiveColumns();

  return (
    <div className="space-y-4">
      {/* Mobile Search and Filters */}
      <div className="lg:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Search and Filters */}
      <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={15}>15 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            {columns.map(column => (
              <div key={column.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{column.header}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={column.priority !== 'low'}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-md peer-checked:after:border-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            {selectedRows.length === paginatedData.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-500">
            {selectedRows.length > 0 && `${selectedRows.length} selected`}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            Export
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile: Card Layout */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {paginatedData.map((row, index) => (
              <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{row.name || `Row ${index + 1}`}</p>
                      <p className="text-xs text-gray-500 truncate">{row.email || 'No email'}</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Mobile: Stacked Information */}
                <div className="space-y-2">
                  {visibleColumns.map(column => (
                    <div key={column.key} className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-700">{column.header}</span>
                      <span className="text-sm text-gray-900 truncate text-right">
                        {column.render ? column.render(row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className={`w-full ${className}`}>
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {visibleColumns.map((column, index) => (
                  <th
                    key={index}
                    className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-2">
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column)}
                          className="flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {sortConfig.key === column.key && sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <span>{column.header}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {visibleColumns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
