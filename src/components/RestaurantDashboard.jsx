import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { restaurantServiceChargeRate } from '../constants.js';
import { billService } from '../services/billService';

import Header from './Header';
import BillHistory from './BillHistory';
import RestaurantBillingForm from './RestaurantBillingForm';
import RestaurantBillPreview from './RestaurantBillPreview';

const RestaurantDashboard = ({ handleLogout, onGoHome }) => {
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', tableNumber: '',
    specialRequests: '', discountType: 'none', discountValue: 0
  });
  const [orderItems, setOrderItems] = useState([]);

  const [bill, setBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Load bill history ────────────────────────────────────────────────────
  useEffect(() => {
    const loadBills = async () => {
      setIsLoading(true);
      try {
        const bills = await billService.fetchBills();
        // filter only restaurant bills for history display
        const restaurantBills = bills
          .filter(b => b.billType === 'restaurant')
          .sort((a, b) => new Date(b.billDate) - new Date(a.billDate));
        setBillHistory(restaurantBills);
      } catch (error) {
        console.error('Error loading bills:', error);
      }
      setTimeout(() => setIsLoading(false), 300);
    };
    loadBills();
  }, []);

  // ── Validate ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    if (!orderItems || orderItems.length === 0) newErrors.orderItems = 'Please add at least one menu item';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Calculate & save ─────────────────────────────────────────────────────
  const calculateBill = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const serviceCharge = subtotal * restaurantServiceChargeRate;

    let discount = 0;
    if (formData.discountType === 'percentage') {
      discount = subtotal * (formData.discountValue / 100);
    } else if (formData.discountType === 'fixed') {
      discount = formData.discountValue;
    }

    const total = subtotal + serviceCharge - discount;
    const billNumber = `RES-${Date.now()}`;
    const billDate = new Date().toISOString();

    const newBill = {
      billType: 'restaurant',
      billNumber,
      billDate,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      tableNumber: formData.tableNumber,
      specialRequests: formData.specialRequests,
      orderItems,
      subtotal,
      serviceCharge,
      discount,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      total,
      details: { type: 'Restaurant Order' }
    };

    try {
      // Fetch all bills (not just restaurant), prepend new bill, save all
      const allBills = await billService.fetchBills();
      const updatedAll = [newBill, ...allBills];
      await billService.saveBills(updatedAll);

      const updatedHistory = [newBill, ...billHistory];
      setBillHistory(updatedHistory);
      setBill(newBill);
    } catch (error) {
      console.error('Error saving restaurant bill:', error);
      alert(`Failed to save bill. Error: ${error.message}\n\nPlease check the browser console for details.`);
    }
    setIsProcessing(false);
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteBill = async (billNum) => {
    if (window.confirm && !window.confirm('Are you sure you want to delete this bill?')) return;
    setIsProcessing(true);
    try {
      const result = await billService.deleteBill(billNum);
      if (result && result.bills) {
        setBillHistory(result.bills.filter(b => b.billType === 'restaurant'));
        alert('Bill deleted successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill. Please try again.');
    }
    setIsProcessing(false);
  };

  const viewBill = (savedBill) => { setBill(savedBill); setShowHistory(false); };

  const resetForm = () => {
    setBill(null);
    setErrors({});
    setOrderItems([]);
    setFormData({ customerName: '', customerPhone: '', tableNumber: '', specialRequests: '', discountType: 'none', discountValue: 0 });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-4 md:p-8 flex items-center justify-center">
      <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
      <span className="text-xl font-medium text-gray-700 ml-4">Loading Bill History...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          resetForm={resetForm}
          handleLogout={handleLogout}
          onGoHome={onGoHome}
        />
        {showHistory ? (
          <BillHistory
            billHistory={billHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewBill={viewBill}
            deleteBill={deleteBill}
            isProcessing={isProcessing}
          />
        ) : !bill ? (
          <RestaurantBillingForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            calculateBill={calculateBill}
            isProcessing={isProcessing}
          />
        ) : (
          <RestaurantBillPreview bill={bill} resetForm={resetForm} />
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
