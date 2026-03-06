import React from 'react';
import { CalendarDays, Receipt, LogOut } from 'lucide-react';
import { APP_NAME } from '../constants.js';

const HomeScreen = ({ onGoToBilling, onGoToAppointments, handleLogout }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex flex-col items-center justify-center p-6">
            {/* Top logo / title */}
            <div className="flex flex-col items-center mb-12">
                <img
                    src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png"
                    alt="Logo"
                    className="w-24 h-24 mb-4 drop-shadow-2xl"
                />
                <h1 className="text-5xl font-extrabold text-white tracking-tight">{APP_NAME}</h1>
                <p className="text-indigo-300 mt-2 text-lg font-medium">Management Portal</p>
            </div>

            {/* Two big cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

                {/* Appointments Card */}
                <button
                    onClick={onGoToAppointments}
                    className="group relative overflow-hidden rounded-3xl p-8 text-left shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 focus:outline-none bg-gradient-to-br from-violet-600 to-purple-700"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    {/* Decorative circle */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-400/20 blur-xl" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 shadow-lg">
                            <CalendarDays className="w-9 h-9 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Appointments</h2>
                        <p className="text-purple-200 text-sm leading-relaxed">
                            Schedule &amp; manage wedding, photoshoot, party and other function bookings with a calendar view.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 px-4 py-2 rounded-full">
                            <CalendarDays className="w-4 h-4" /> Open Appointments
                        </div>
                    </div>
                </button>

                {/* Billing Card */}
                <button
                    onClick={onGoToBilling}
                    className="group relative overflow-hidden rounded-3xl p-8 text-left shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 focus:outline-none bg-gradient-to-br from-blue-600 to-indigo-700"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-400/20 blur-xl" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 shadow-lg">
                            <Receipt className="w-9 h-9 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Billing</h2>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            Create room &amp; function bills, view invoice history, and manage all customer payments.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 px-4 py-2 rounded-full">
                            <Receipt className="w-4 h-4" /> Open Billing
                        </div>
                    </div>
                </button>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-12 flex items-center gap-2 text-indigo-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
    );
};

export default HomeScreen;
