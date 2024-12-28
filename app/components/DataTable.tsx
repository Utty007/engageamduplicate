"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define types for props and payment data
export interface PaymentItem {
  [key: string]: string | number | React.JSX.Element
}

interface DataTableProps {
  data?: PaymentItem[];
  headers?: { key: string; label: string }[];
  itemsPerPage?: number;
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data = [], 
  headers = [
    { key: 'invoice', label: 'Invoice' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'plan', label: 'Plan' },
    { key: 'details', label: 'Details' }
  ],
  itemsPerPage = 5,
  title = 'Recent Payments'
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages, with fallback to 1
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // Get current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render cell content with special handling for amount and details
  const renderCellContent = (item: PaymentItem, key: string) => {
    const value = item[key];
    
    if (key === 'amount' && typeof value === 'number') {
      return `${value.toFixed(2)} naira`;
    }
    
    if (key === 'details') {
      return (
        <a 
          href="#" 
          className="text-primary underline hover:text-primary/80 capitalize"
        >
          {value || 'N/A'}
        </a>
      );
    }
    
    return value || 'N/A';
  };

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-dark-100 font-semibold text-xl mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">Recent payment history and transactions</p>
        </div>

        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No payment data available
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[800px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((header) => (
                    <th 
                      key={header.key} 
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {headers.map((header) => (
                      <td 
                        key={header.key} 
                        className="p-3 border-b text-sm text-grey-base whitespace-nowrap"
                      >
                        {renderCellContent(payment, header.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            {/* Previous Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2 block">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === index + 1 
                      ? 'bg-primary/80 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              <span className="mr-2 block">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;