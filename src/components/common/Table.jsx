import React from 'react';

export const Table = ({
  columns,
  data,
  keyExtractor = (item) => item.id,
  emptyMessage = 'No records found matching current criteria.',
  onRowClick,
  hoverable = true,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200/80 bg-white ${className}`}>
      <table className="w-full text-left text-sm text-slate-600 border-collapse">
        <thead className="bg-slate-50/90 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={`py-3.5 px-4 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data && data.length > 0 ? (
            data.map((item, rowIdx) => (
              <tr
                key={keyExtractor(item, rowIdx)}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${
                  hoverable ? 'hover:bg-blue-50/40' : ''
                } ${onRowClick ? 'cursor-pointer' : ''} ${
                  rowIdx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(item, rowIdx) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm text-slate-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

