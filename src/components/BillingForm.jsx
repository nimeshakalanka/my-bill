import React from 'react';
import { Home, Users, DollarSign, Utensils, FileText, Loader2 } from 'lucide-react';
import { functionPackages } from '../constants.js';

const BillingForm = ({ billType, setBillType, formData, setFormData, errors, calculateBill, isProcessing }) => {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (['roomPrice', 'breakfast', 'lunch', 'dinner', 'numPeople'].includes(name)) {
      finalValue = parseFloat(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setBillType('room')} className={`flex-1 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${billType === 'room' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          <Home className="w-5 h-5" /> Room Booking
        </button>
        <button onClick={() => setBillType('function')} className={`flex-1 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${billType === 'function' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          <Users className="w-5 h-5" /> Function Booking
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
            <input type="text" name="guestName" value={formData.guestName} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.guestName ? 'border-red-500' : 'border-gray-300'}`} placeholder="John Doe" />
            {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.guestPhone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+94 77 123 4567" />
            {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
            <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="guest@email.com" />
          </div>
        </div>

        {billType === 'room' ? (
          <>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="201" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Price (LKR) *</label>
                <input type="number" name="roomPrice" value={formData.roomPrice} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.checkIn ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.checkOut ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3"><Utensils className="inline w-4 h-4 mr-1" /> Meal Charges (per day in LKR)</label>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-xs text-gray-600 mb-1">Breakfast</label><input type="number" name="breakfast" value={formData.breakfast} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Lunch</label><input type="number" name="lunch" value={formData.lunch} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Dinner</label><input type="number" name="dinner" value={formData.dinner} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Package *</label>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(functionPackages).map(([key, pkg]) => (
                  <div key={key} onClick={() => setFormData(prev => ({ ...prev, packageType: key }))} className={`cursor-pointer border-2 rounded-lg p-4 transition ${formData.packageType === key ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-lg">{pkg.name}</h3><DollarSign className="w-5 h-5 text-green-600" /></div>
                    <p className="text-2xl font-bold text-purple-600 mb-3">LKR {pkg.price.toLocaleString()}<span className="text-sm text-gray-600 font-normal">/person</span></p>
                    <ul className="space-y-1">{pkg.features.map((f, i) => (<li key={i} className="text-sm text-gray-600">✓ {f}</li>))}</ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Function Date *</label><input type="date" name="functionDate" value={formData.functionDate} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.functionDate ? 'border-red-500' : 'border-gray-300'}`} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Number of People *</label><input type="number" min="1" name="numPeople" value={formData.numPeople} onChange={handleFormChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.numPeople ? 'border-red-500' : 'border-gray-300'}`} /></div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
          <textarea name="specialRequests" value={formData.specialRequests} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Any special requirements..." />
        </div>

        <button onClick={calculateBill} disabled={isProcessing} className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition shadow-lg flex items-center justify-center gap-2 ${billType === 'room' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} disabled:opacity-50`}>
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-5 h-5" /> Generate Invoice</>}
        </button>
      </div>
    </div>
  );
};

export default BillingForm;