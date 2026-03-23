import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, Loader2, FileText, Percent, ChevronDown, ChevronUp } from 'lucide-react';
import { restaurantMenu } from '../constants.js';

const categories = Object.keys(restaurantMenu);

const RestaurantBillingForm = ({
  formData, setFormData, errors, orderItems, setOrderItems,
  calculateBill, isProcessing
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(true);

  // ── helpers ────────────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getQty = (itemId) => {
    const found = orderItems.find(i => i.id === itemId);
    return found ? found.qty : 0;
  };

  const updateQty = (item, delta) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (!existing) {
        if (delta > 0) return [...prev, { ...item, qty: 1 }];
        return prev;
      }
      const newQty = existing.qty + delta;
      if (newQty <= 0) return prev.filter(i => i.id !== item.id);
      return prev.map(i => i.id === item.id ? { ...i, qty: newQty } : i);
    });
  };

  const removeItem = (itemId) => setOrderItems(prev => prev.filter(i => i.id !== itemId));

  // filtered items for search
  const filteredItems = searchTerm.trim()
    ? Object.values(restaurantMenu).flat().filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : restaurantMenu[activeCategory] || [];

  const orderTotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">

      {/* ── Customer Info ─────────────────────────────────── */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          Customer Information
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input
              type="text" name="customerName" value={formData.customerName}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John Doe"
            />
            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel" name="customerPhone" value={formData.customerPhone}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="+94 77 123 4567"
            />
            {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
            <input
              type="text" name="tableNumber" value={formData.tableNumber}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g. T-05 (optional)"
            />
          </div>
        </div>
      </div>

      {/* ── Menu Selection ────────────────────────────────── */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => setShowCategories(v => !v)}
        >
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Select Menu Items
          </h3>
          {showCategories ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>

        {showCategories && (
          <>
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Category Tabs */}
            {!searchTerm && (
              <div className="flex gap-2 flex-wrap mb-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      activeCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredItems.map(item => {
                const qty = getQty(item.id);
                return (
                  <div key={item.id}
                    className={`flex items-center justify-between border rounded-lg px-3 py-2 transition ${qty > 0 ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-green-700 font-semibold">LKR {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {qty > 0 ? (
                        <>
                          <button onClick={() => updateQty(item, -1)} className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-gray-800">{qty}</span>
                          <button onClick={() => updateQty(item, 1)} className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center">
                            <Plus className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => updateQty(item, 1)} className="w-7 h-7 rounded-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center shadow-sm">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredItems.length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-400 text-sm">No items found.</div>
              )}
            </div>
          </>
        )}

        {errors.orderItems && <p className="text-red-500 text-xs mt-2">{errors.orderItems}</p>}
      </div>

      {/* ── Order Summary ─────────────────────────────────── */}
      {orderItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Order Summary
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="text-left p-2.5">Item</th>
                  <th className="text-center p-2.5 w-20">Qty</th>
                  <th className="text-right p-2.5 w-28">Unit (LKR)</th>
                  <th className="text-right p-2.5 w-28">Total (LKR)</th>
                  <th className="w-8 p-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orderItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2.5 font-medium">{item.name}</td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => updateQty(item, -1)} className="w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item, 1)} className="w-5 h-5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-2.5 text-right">{item.price.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-semibold">{(item.price * item.qty).toLocaleString()}</td>
                    <td className="p-2.5 text-center">
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50">
                  <td colSpan="3" className="p-2.5 text-right font-bold text-green-800">Items Subtotal:</td>
                  <td className="p-2.5 text-right font-bold text-green-800">LKR {orderTotal.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── Special Requests ──────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests / Notes</label>
        <textarea
          name="specialRequests" value={formData.specialRequests}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="2" placeholder="Allergies, special preparations, takeaway, etc."
        />
      </div>

      {/* ── Discount ──────────────────────────────────────── */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Percent className="w-4 h-4 text-green-600" /> Discount (Optional)
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Discount Type</label>
            <select
              name="discountType" value={formData.discountType}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="none">No Discount</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (LKR)</option>
            </select>
          </div>
          {formData.discountType !== 'none' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (LKR)'}
              </label>
              <input
                type="number" name="discountValue" min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                value={formData.discountValue}
                onChange={e => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder={formData.discountType === 'percentage' ? '0-100' : '0'}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Generate bill button ───────────────────────────── */}
      <button
        onClick={calculateBill}
        disabled={isProcessing}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white transition shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
      >
        {isProcessing
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <><FileText className="w-5 h-5" /> Generate Restaurant Invoice</>
        }
      </button>
    </div>
  );
};

export default RestaurantBillingForm;
