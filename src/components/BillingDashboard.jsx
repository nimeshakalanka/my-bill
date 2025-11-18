import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// --- MODIFICATION: Using absolute path for constants ---
import { functionPackages, serviceChargeRate, taxRate } from '/src/constants.js';

// --- MODIFICATION: Removed .jsx extensions for component imports ---
import Header from './Header';
import BillHistory from './BillHistory';
import BillingForm from './BillingForm';
import BillPreview from './BillPreview';

// The key we will use to save our bills array in the browser's localStorage
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
  const [isLoading, setIsLoading] = useState(true); // Still useful for loading
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- LOAD BILLS from localStorage ---
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedBills = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedBills) {
        const parsedBills = JSON.parse(savedBills);
        // Sort by date descending
        parsedBills.sort((a, b) => new Date(b.billDate) - new Date(a.billDate));
        setBillHistory(parsedBills);
      }
    } catch (e) {
      console.error("Error loading bills from localStorage:", e);
      // If parsing fails, clear the corrupted data
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    // Set loading to false after a short delay
    setTimeout(() => setIsLoading(false), 300); 
  }, []); // Runs once on component mount

  // --- FORM VALIDATION (Unchanged) ---
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

  // --- CALCULATE & SAVE BILL (Updated for localStorage) ---
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
    
    // --- Save to localStorage ---
    try {
      const updatedHistory = [newBill, ...billHistory];
      setBillHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      setBill(newBill); // Show preview
    } catch (e) { 
      console.error("Error saving to localStorage: ", e); 
      // Handle potential storage quota errors
    }
    setIsProcessing(false);
  };

  // --- DELETE BILL (Updated for localStorage) ---
  const deleteBill = (billNum) => {
    // We use the 'billNumber' to find and delete
    if (window.confirm && !window.confirm("Are you sure you want to delete this bill?")) {
        return;
    }
    setIsProcessing(true);
    try {
      const updatedHistory = billHistory.filter(b => b.billNumber !== billNum);
      setBillHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) { 
      console.error("Error deleting from localStorage: ", e); 
    }
    setIsProcessing(false);
  };

  // --- (Unchanged functions) ---
  const viewBill = (savedBill) => { setBill(savedBill); setShowHistory(false); };
  
  const resetForm = () => {
    setBill(null); setErrors({});
    setFormData({ guestName: '', guestPhone: '', guestEmail: '', roomNumber: '', checkIn: '', checkOut: '', roomPrice: 5000, breakfast: 0, lunch: 0, dinner: 0, packageType: 'silver', numPeople: 50, functionDate: '', specialRequests: '' });
  };

  if (isLoading) return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center"><Loader2 className="w-16 h-16 text-blue-600 animate-spin" /><span className="text-xl font-medium text-gray-700 ml-4">Loading Bill History...</span></div>);

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