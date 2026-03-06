import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2, CalendarDays, List, X } from 'lucide-react';

const FUNCTION_TYPE_COLORS = {
    wedding: 'bg-pink-500',
    room: 'bg-blue-500',
    photoshoot: 'bg-amber-500',
    party: 'bg-green-500',
    birthday: 'bg-orange-500',
    corporate: 'bg-slate-500',
    anniversary: 'bg-rose-500',
    other: 'bg-gray-500',
};

const FUNCTION_TYPE_LABELS = {
    wedding: '💍 Wedding',
    room: '🛏️ Room Booking',
    photoshoot: '📷 Photoshoot',
    party: '🎉 Party',
    birthday: '🎂 Birthday',
    corporate: '💼 Corporate',
    anniversary: '💑 Anniversary',
    other: '📋 Other',
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AppointmentCalendar = ({ appointments, onDelete, isProcessing }) => {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'

    // Build a map: date-string -> appointments[]
    const apptMap = {};
    appointments.forEach(a => {
        const key = a.date; // 'YYYY-MM-DD'
        if (!apptMap[key]) apptMap[key] = [];
        apptMap[key].push(a);
    });

    // Calendar grid calculation
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
        setSelectedDate(null);
    };

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const dateStr = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const selectedAppts = selectedDate ? (apptMap[selectedDate] || []) : [];

    // All appointments sorted by date for list view
    const sortedAll = [...appointments].sort((a, b) => a.date.localeCompare(b.date));

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
    };

    return (
        <div className="space-y-6">
            {/* View toggle */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-violet-600" />
                    All Appointments
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{appointments.length} total</span>
                </h2>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <CalendarDays className="w-4 h-4" /> Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Month nav */}
                        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-5 flex items-center justify-between">
                            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition text-white">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-xl font-bold text-white">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
                            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition text-white">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {DAY_NAMES.map(d => (
                                    <div key={d} className="text-xs font-semibold text-gray-400 text-center py-2">{d}</div>
                                ))}
                            </div>

                            {/* Day grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Empty cells before first day */}
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-12" />
                                ))}
                                {/* Day cells */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const ds = dateStr(day);
                                    const hasAppts = !!apptMap[ds];
                                    const isToday = ds === todayStr;
                                    const isSelected = ds === selectedDate;

                                    return (
                                        <button
                                            key={ds}
                                            onClick={() => setSelectedDate(isSelected ? null : ds)}
                                            className={`h-12 rounded-xl flex flex-col items-center justify-center relative transition-all text-sm font-medium
                        ${isSelected ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' :
                                                    isToday ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-400' :
                                                        'hover:bg-gray-100 text-gray-700'}
                      `}
                                        >
                                            {day}
                                            {hasAppts && (
                                                <span className="flex gap-0.5 mt-0.5">
                                                    {apptMap[ds].slice(0, 3).map((a, idx) => (
                                                        <span key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : FUNCTION_TYPE_COLORS[a.functionType] || 'bg-violet-400'}`} />
                                                    ))}
                                                    {apptMap[ds].length > 3 && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : 'bg-gray-300'}`} />}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="px-4 pb-4 flex flex-wrap gap-3">
                            {Object.entries(FUNCTION_TYPE_COLORS).map(([type, color]) => (
                                <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                    {FUNCTION_TYPE_LABELS[type]?.replace(/.*? /, '') || type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {selectedDate ? (
                            <>
                                <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-200 text-xs font-medium uppercase tracking-wide">Selected</p>
                                        <p className="text-white font-bold">{formatDate(selectedDate)}</p>
                                    </div>
                                    <button onClick={() => setSelectedDate(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                    {selectedAppts.length === 0 ? (
                                        <p className="text-gray-400 text-sm text-center py-8">No appointments on this day</p>
                                    ) : selectedAppts.map(a => (
                                        <AppointmentCard key={a.id} appt={a} onDelete={onDelete} isProcessing={isProcessing} formatDate={formatDate} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 text-center">
                                <CalendarDays className="w-12 h-12 text-gray-200 mb-3" />
                                <p className="text-gray-400 text-sm">Click a date on the calendar to view appointments</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {sortedAll.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <CalendarDays className="w-16 h-16 text-gray-200 mb-4" />
                            <p className="text-gray-400 text-lg font-medium">No appointments yet</p>
                            <p className="text-gray-300 text-sm">Create your first appointment using the form above</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {sortedAll.map(a => (
                                <div key={a.id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <AppointmentCard appt={a} onDelete={onDelete} isProcessing={isProcessing} formatDate={formatDate} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AppointmentCard = ({ appt, onDelete, isProcessing, formatDate }) => (
    <div className="flex items-start gap-3 group">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${FUNCTION_TYPE_COLORS[appt.functionType] || 'bg-gray-400'}`} />
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-semibold text-gray-800 truncate">{appt.customerName}</p>
                    <p className="text-xs text-gray-500">{appt.phone}</p>
                </div>
                <button
                    onClick={() => onDelete(appt.id)}
                    disabled={isProcessing}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 disabled:opacity-40 flex-shrink-0"
                    title="Delete appointment"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {FUNCTION_TYPE_LABELS[appt.functionType] || appt.functionType}
                </span>
                <span className="text-xs text-gray-400">{formatDate(appt.date)}</span>
            </div>
            {appt.notes && (
                <p className="text-xs text-gray-400 mt-1 italic truncate">📝 {appt.notes}</p>
            )}
        </div>
    </div>
);

export default AppointmentCalendar;
