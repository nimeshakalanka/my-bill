import React, { useState } from 'react';
import { CalendarDays, User, Phone, FileText, Loader2, CheckCircle2 } from 'lucide-react';

const FUNCTION_TYPES = [
    { value: 'wedding', label: '💍 Wedding' },
    { value: 'room', label: '🛏️ Room Booking' },
    { value: 'photoshoot', label: '📷 Photoshoot' },
    { value: 'party', label: '🎉 Party' },
    { value: 'birthday', label: '🎂 Birthday' },
    { value: 'corporate', label: '💼 Corporate Event' },
    { value: 'anniversary', label: '💑 Anniversary' },
    { value: 'other', label: '📋 Other' },
];

const emptyForm = {
    customerName: '',
    phone: '',
    date: '',
    functionType: 'wedding',
    notes: '',
};

const AppointmentForm = ({ onSave, isProcessing }) => {
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [saveStatus, setSaveStatus] = useState(null); // null | 'success' | 'error'

    const validate = () => {
        const e = {};
        if (!formData.customerName.trim()) e.customerName = 'Customer name is required';
        if (!formData.phone.trim()) e.phone = 'Phone number is required';
        if (!formData.date) e.date = 'Date is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const appointment = {
            id: `APT-${Date.now()}`,
            ...formData,
            createdAt: new Date().toISOString(),
        };

        const success = await onSave(appointment);
        if (success) {
            setFormData(emptyForm);
            setErrors({});
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 4000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <CalendarDays className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">New Appointment</h2>
                            <p className="text-purple-200 text-sm">Fill in the details to schedule an appointment</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Status Banners */}
                    {saveStatus === 'success' && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">Appointment saved successfully! 🎉</span>
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                            <span className="font-medium">❌ Failed to save appointment. Please try again.</span>
                        </div>
                    )}

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-violet-500" /> Customer Name</span>
                        </label>
                        <input
                            type="text"
                            value={formData.customerName}
                            onChange={e => handleChange('customerName', e.target.value)}
                            placeholder="Enter customer full name"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.customerName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all`}
                        />
                        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-violet-500" /> Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            placeholder="Enter phone number"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Date & Function Type - side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-violet-500" /> Appointment Date</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => handleChange('date', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all`}
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Function Type
                            </label>
                            <select
                                value={formData.functionType}
                                onChange={e => handleChange('functionType', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
                            >
                                {FUNCTION_TYPES.map(ft => (
                                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-violet-500" /> Notes <span className="text-gray-400 font-normal">(optional)</span></span>
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={e => handleChange('notes', e.target.value)}
                            placeholder="Special requests, number of guests, preferences..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 disabled:opacity-60 transition-all shadow-lg hover:shadow-violet-300 flex items-center justify-center gap-3"
                    >
                        {isProcessing ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : (
                            <><CalendarDays className="w-5 h-5" /> Make Appointment</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;
