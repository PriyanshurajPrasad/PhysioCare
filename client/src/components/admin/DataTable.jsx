import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data available',
  className = ''
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Mobile table container with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className={`w-full min-w-full ${className}`}>
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left py-3 px-2 sm:px-4 font-semibold text-sm text-gray-700 whitespace-nowrap"
                  style={{ minWidth: column.width || '120px' }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-2 sm:px-4 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile card view for small screens */}
      <div className="lg:hidden">
        {data.map((row, index) => (
          <div key={index} className="border-b border-gray-200 p-4 space-y-3">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0">
                  {column.header}:
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 min-w-0">
                  {column.render ? column.render(row) : row[column.accessor]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
