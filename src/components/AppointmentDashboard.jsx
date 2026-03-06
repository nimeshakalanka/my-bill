import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Loader2, ArrowLeft, Bell } from 'lucide-react';
import { APP_NAME } from '../constants.js';
import { appointmentService } from '../services/appointmentService';
import AppointmentForm from './AppointmentForm';
import AppointmentCalendar from './AppointmentCalendar';

// Fire browser notifications for appointments within 2 days
const checkAndNotify = (appointments) => {
    if (!('Notification' in window)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const upcoming = appointments.filter(a => {
        const apptDate = new Date(a.date + 'T00:00:00');
        return apptDate >= today && apptDate <= twoDaysFromNow;
    });

    if (upcoming.length === 0) return;

    const sendNotifications = () => {
        upcoming.forEach(a => {
            const apptDate = new Date(a.date + 'T00:00:00');
            const diffMs = apptDate - today;
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            const whenText = diffDays === 0 ? 'TODAY' : diffDays === 1 ? 'Tomorrow' : 'in 2 days';

            new Notification(`📅 Appointment ${whenText}`, {
                body: `${a.customerName} — ${a.functionType.charAt(0).toUpperCase() + a.functionType.slice(1)} on ${a.date}`,
                icon: 'https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png',
                tag: a.id,
            });
        });
    };

    if (Notification.permission === 'granted') {
        sendNotifications();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') sendNotifications();
        });
    }
};

const AppointmentDashboard = ({ onGoHome }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [view, setView] = useState('form'); // 'form' | 'calendar'
    const [notifRequested, setNotifRequested] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await appointmentService.fetchAppointments();
                data.sort((a, b) => a.date.localeCompare(b.date));
                setAppointments(data);
                // Check notifications after loading
                checkAndNotify(data);
            } catch (err) {
                console.error('Error loading appointments:', err);
            }
            setIsLoading(false);
        };
        load();
    }, []);

    const handleSave = async (appointment) => {
        setIsProcessing(true);
        try {
            const updated = [...appointments, appointment].sort((a, b) => a.date.localeCompare(b.date));
            await appointmentService.saveAppointments(updated);
            setAppointments(updated);
            setIsProcessing(false);
            return true; // success
        } catch (err) {
            console.error('Error saving appointment:', err);
            setIsProcessing(false);
            return false; // failure
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this appointment?')) return;
        setIsProcessing(true);
        try {
            const result = await appointmentService.deleteAppointment(id);
            if (result && result.appointments) {
                setAppointments(result.appointments);
            } else {
                setAppointments(prev => prev.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Error deleting appointment:', err);
            alert('Failed to delete appointment.');
        }
        setIsProcessing(false);
    };

    const requestNotifications = () => {
        if (!('Notification' in window)) { alert('Notifications not supported in this browser.'); return; }
        Notification.requestPermission().then(p => {
            setNotifRequested(true);
            if (p === 'granted') checkAndNotify(appointments);
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-violet-600 animate-spin" />
                <span className="text-xl font-medium text-gray-700 ml-4">Loading Appointments...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Logo" className="w-16 h-16" />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{APP_NAME}</h1>
                                <p className="text-purple-200 mt-0.5">Appointment Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Notification bell */}
                            {('Notification' in window) && Notification.permission !== 'granted' && !notifRequested && (
                                <button
                                    onClick={requestNotifications}
                                    className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition flex items-center gap-2"
                                    title="Enable appointment reminders"
                                >
                                    <Bell className="w-4 h-4" /> Enable Reminders
                                </button>
                            )}
                            {/* New Appointment / Calendar toggle */}
                            <button
                                onClick={() => setView(view === 'form' ? 'calendar' : 'form')}
                                className="bg-white text-violet-700 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold hover:bg-violet-50 transition flex items-center gap-2 text-sm"
                            >
                                {view === 'form' ? <><CalendarDays className="w-4 h-4" /> View Calendar</> : <><Plus className="w-4 h-4" /> New Appointment</>}
                            </button>
                            {/* Back to Home */}
                            <button
                                onClick={onGoHome}
                                className="bg-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {view === 'form' ? (
                    <AppointmentForm onSave={handleSave} isProcessing={isProcessing} />
                ) : (
                    <AppointmentCalendar appointments={appointments} onDelete={handleDelete} isProcessing={isProcessing} />
                )}
            </div>
        </div>
    );
};

export default AppointmentDashboard;
