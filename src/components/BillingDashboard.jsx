import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { functionPackages, serviceChargeRate, taxRate } from '../constants.js';
import Header from './Header.jsx';
import BillHistory from './BillHistory.jsx';
import BillingForm from './BillingForm.jsx';
import BillPreview from './BillPreview.jsx';

const LOCAL_STORAGE_KEY = 'hotel_bills_history';

const BillingDashboard = ({ handleLogout }) => {
  const [billType, setBillType] = useState('room');
  const [formData, setFormData] = useState({
    guestName: '', guestPhone: '', guestEmail: '', roomNumber: '',
    checkIn: '', checkOut: '', roomPrice: 5000, breakfast: 0,
    lunch: 0, dinner: 0, packageType: 'silver', numPeople: 50,
    functionDate: '', specialRequests: ''
  });

  const [bill, setBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const savedBills = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedBills) {
        const parsedBills = JSON.parse(savedBills);
        parsedBills.sort((a, b) => new Date(b.billDate) - new Date(a.billDate));
        setBillHistory(parsedBills);
      }
    } catch (e) {
      console.error("Error loading bills:", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone number is required';
    
    if (billType === 'room') {
      if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
      if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
      if (formData.checkIn && formData.checkOut && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
    } else {
      if (!formData.functionDate) newErrors.functionDate = 'Function date is required';
      if (formData.numPeople < 1) newErrors.numPeople = 'At least 1 person required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBill = () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    let subtotal = 0;
    let details = {};
    let billNumber = `INV-${Date.now()}`;
    let billDate = new Date().toISOString();

    if (billType === 'room') {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
      const roomTotal = formData.roomPrice * nights;
      const foodTotal = (formData.breakfast + formData.lunch + formData.dinner) * nights;
      subtotal = roomTotal + foodTotal;
      details = { type: 'Room Booking', roomNumber: formData.roomNumber, checkIn: formData.checkIn, checkOut: formData.checkOut, nights, roomPrice: formData.roomPrice, roomTotal, breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner, foodTotal };
    } else {
      const packagePrice = functionPackages[formData.packageType].price;
      subtotal = packagePrice * formData.numPeople;
      details = { type: 'Function Booking', packageName: functionPackages[formData.packageType].name, packageFeatures: functionPackages[formData.packageType].features, functionDate: formData.functionDate, numPeople: formData.numPeople, pricePerPerson: packagePrice };
    }

    const serviceCharge = subtotal * serviceChargeRate;
    const tax = subtotal * taxRate;
    const total = subtotal + serviceCharge + tax;
    const newBill = { billType, ...formData, details, subtotal, serviceCharge, tax, total, billNumber, billDate };
    
    try {
      const updatedHistory = [newBill, ...billHistory];
      setBillHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      setBill(newBill);
    } catch (e) { console.error("Error saving:", e); }
    setIsProcessing(false);
  };

  const deleteBill = (billNum) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    setIsProcessing(true);
    try {
      const updatedHistory = billHistory.filter(b => b.billNumber !== billNum);
      setBillHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) { console.error("Error deleting:", e); }
    setIsProcessing(false);
  };

  const viewBill = (savedBill) => { setBill(savedBill); setShowHistory(false); };
  
  const resetForm = () => {
    setBill(null); setErrors({});
    setFormData({ guestName: '', guestPhone: '', guestEmail: '', roomNumber: '', checkIn: '', checkOut: '', roomPrice: 5000, breakfast: 0, lunch: 0, dinner: 0, packageType: 'silver', numPeople: 50, functionDate: '', specialRequests: '' });
  };

  if (isLoading) return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center"><Loader2 className="w-16 h-16 text-blue-600 animate-spin" /><span className="text-xl font-medium text-gray-700 ml-4">Loading Bills...</span></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header showHistory={showHistory} setShowHistory={setShowHistory} resetForm={resetForm} handleLogout={handleLogout} />
        {showHistory ? (
          <BillHistory billHistory={billHistory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} viewBill={viewBill} deleteBill={deleteBill} isProcessing={isProcessing} />
        ) : !bill ? (
          <BillingForm billType={billType} setBillType={setBillType} formData={formData} setFormData={setFormData} errors={errors} calculateBill={calculateBill} isProcessing={isProcessing} />
        ) : (
          <BillPreview bill={bill} resetForm={resetForm} />
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;