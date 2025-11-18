import React from 'react';
import { Search, Trash2 } from 'lucide-react';

const BillHistory = ({ billHistory, searchTerm, setSearchTerm, viewBill, deleteBill, isProcessing }) => {
  const filteredHistory = billHistory.filter(b => 
    b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guestPhone?.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Billing History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Guest</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredHistory.length > 0 ? filteredHistory.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{b.billNumber}</td>
                <td className="px-4 py-3 text-sm">{new Date(b.billDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{b.guestName}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${b.billType === 'room' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{b.billType === 'room' ? 'Room' : 'Function'}</span></td>
                <td className="px-4 py-3 text-right font-semibold">LKR {b.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => viewBill(b)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">View</button>
                    {/* Use b.id (Database ID) for deletion */}
                    <button onClick={() => deleteBill(b.id)} disabled={isProcessing} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillHistory;