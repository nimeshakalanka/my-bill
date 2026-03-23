import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, LogOut, Loader2, Calendar, TrendingUp,
  UtensilsCrossed, Home, Users, ReceiptText, ChevronDown, ChevronUp,
  BarChart3, FileText, RefreshCw
} from 'lucide-react';
import { billService } from '../services/billService';
import { APP_NAME } from '../constants.js';

// ─── helpers ─────────────────────────────────────────────────────────────────
const toDateStr = (d) => d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
const today = () => toDateStr(new Date());

const TYPE_LABELS = {
  all: 'All',
  room: 'Room Booking',
  function: 'Function Booking',
  restaurant: 'Restaurant',
};

const TYPE_COLORS = {
  room: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  function: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  restaurant: { bg: 'bg-green-600', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
};

const fmt = (n) => `LKR ${Number(n || 0).toLocaleString()}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const billName = (b) => b.billType === 'restaurant' ? b.customerName : b.guestName;
const billPhone = (b) => b.billType === 'restaurant' ? b.customerPhone : b.guestPhone;

// ─── KPI card ────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl shadow p-5 border-l-4 ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

// ─── Expanded bill detail ─────────────────────────────────────────────────────
const BillDetail = ({ bill }) => {
  if (bill.billType === 'restaurant') {
    return (
      <div className="px-4 pb-4 text-sm bg-green-50 border-t border-green-100">
        <div className="pt-3 grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Order Items</p>
            <table className="w-full text-xs">
              <thead><tr className="bg-green-700 text-white"><th className="text-left p-1.5 rounded-tl">Item</th><th className="text-center p-1.5">Qty</th><th className="text-right p-1.5 rounded-tr">Total</th></tr></thead>
              <tbody>
                {(bill.orderItems || []).map((it, i) => (
                  <tr key={i} className="border-b border-green-100">
                    <td className="py-1 pr-2">{it.name}</td>
                    <td className="py-1 text-center">{it.qty}</td>
                    <td className="py-1 text-right">{fmt(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-1">
            {(bill.additionalCharges || []).length > 0 && <>
              <p className="font-semibold text-gray-700 mb-1">Additional Charges</p>
              {bill.additionalCharges.map((c, i) => (
                <div key={i} className="flex justify-between text-xs"><span>{c.name} × {c.quantity}</span><span>{fmt(c.total)}</span></div>
              ))}
            </>}
            {bill.specialRequests && <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2">📝 {bill.specialRequests}</p>}
          </div>
        </div>
      </div>
    );
  }
  if (bill.billType === 'room') {
    const d = bill.details || {};
    return (
      <div className="px-4 pb-4 text-sm bg-blue-50 border-t border-blue-100">
        <div className="pt-3 grid md:grid-cols-2 gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Room</span><span>{d.roomNumber}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span>{d.checkIn ? fmtDate(d.checkIn) : '-'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span>{d.checkOut ? fmtDate(d.checkOut) : '-'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Nights</span><span>{d.nights}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Room Rate</span><span>{fmt(d.roomPrice)}/night</span></div>
            <div className="flex justify-between font-semibold"><span>Room Total</span><span>{fmt(d.roomTotal)}</span></div>
          </div>
          <div className="space-y-1 text-xs">
            {d.foodTotal > 0 && <>
              {d.breakfast > 0 && <div className="flex justify-between"><span className="text-gray-500">Breakfast/day</span><span>{fmt(d.breakfast)}</span></div>}
              {d.lunch > 0 && <div className="flex justify-between"><span className="text-gray-500">Lunch/day</span><span>{fmt(d.lunch)}</span></div>}
              {d.dinner > 0 && <div className="flex justify-between"><span className="text-gray-500">Dinner/day</span><span>{fmt(d.dinner)}</span></div>}
              <div className="flex justify-between font-semibold"><span>Food Total</span><span>{fmt(d.foodTotal)}</span></div>
            </>}
            {bill.specialRequests && <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2">📝 {bill.specialRequests}</p>}
          </div>
        </div>
      </div>
    );
  }
  // function
  const d = bill.details || {};
  return (
    <div className="px-4 pb-4 text-sm bg-purple-50 border-t border-purple-100">
      <div className="pt-3 grid md:grid-cols-2 gap-4">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Package</span><span>{d.packageName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Function Date</span><span>{d.functionDate ? fmtDate(d.functionDate) : '-'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Guests</span><span>{d.numPeople}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Rate/Person</span><span>{fmt(d.pricePerPerson)}</span></div>
        </div>
        <div className="space-y-1 text-xs">
          {d.packageFeatures && d.packageFeatures.map((f, i) => (
            <div key={i} className="text-green-700">✓ {f}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Bill row ─────────────────────────────────────────────────────────────────
const BillRow = ({ bill }) => {
  const [expanded, setExpanded] = useState(false);
  const c = TYPE_COLORS[bill.billType] || TYPE_COLORS.room;
  return (
    <div className={`border ${c.border} rounded-xl overflow-hidden mb-2 shadow-sm`}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(v => !v)}
      >
        <div className={`w-2 h-10 rounded-full ${c.bg} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800 text-sm">{billName(bill)}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{TYPE_LABELS[bill.billType] || bill.billType}</span>
            <span className="text-xs text-gray-400 font-mono">{bill.billNumber}</span>
          </div>
          <div className="flex gap-4 mt-0.5 text-xs text-gray-500">
            <span>{billPhone(bill)}</span>
            <span>{fmtDate(bill.billDate)}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-black text-base ${c.text}`}>{fmt(bill.total)}</p>
          <p className="text-xs text-gray-400">subtotal {fmt(bill.subtotal)}</p>
        </div>
        <div className="ml-1 text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      {expanded && <BillDetail bill={bill} />}
    </div>
  );
};

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
const SummaryDashboard = ({ onGoHome, handleLogout }) => {
  const [allBills, setAllBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today());
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateMode, setDateMode] = useState('day'); // 'day' | 'range'
  const [rangeFrom, setRangeFrom] = useState(today());
  const [rangeTo, setRangeTo] = useState(today());

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const bills = await billService.fetchBills();
        setAllBills(bills);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, []);

  // ── Filtered bills ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allBills.filter(bill => {
      const billDay = bill.billDate?.slice(0, 10);
      const dateMatch = dateMode === 'day'
        ? billDay === selectedDate
        : billDay >= rangeFrom && billDay <= rangeTo;
      const typeMatch = typeFilter === 'all' || bill.billType === typeFilter;
      return dateMatch && typeMatch;
    }).sort((a, b) => new Date(b.billDate) - new Date(a.billDate));
  }, [allBills, selectedDate, typeFilter, dateMode, rangeFrom, rangeTo]);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const kpi = useMemo(() => {
    const all = allBills.filter(bill => {
      const billDay = bill.billDate?.slice(0, 10);
      return dateMode === 'day' ? billDay === selectedDate : billDay >= rangeFrom && billDay <= rangeTo;
    });
    const sum = (type) => all.filter(b => b.billType === type).reduce((s, b) => s + (b.total || 0), 0);
    const totalRevenue = all.reduce((s, b) => s + (b.total || 0), 0);
    return {
      total: totalRevenue,
      room: sum('room'),
      function: sum('function'),
      restaurant: sum('restaurant'),
      count: all.length,
    };
  }, [allBills, selectedDate, typeFilter, dateMode, rangeFrom, rangeTo]);

  const refresh = async () => {
    setIsLoading(true);
    try { setAllBills(await billService.fetchBills()); } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center">
      <Loader2 className="w-16 h-16 text-amber-600 animate-spin" />
      <span className="text-xl font-medium text-gray-700 ml-4">Loading Summary...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Logo" className="w-20 h-20" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{APP_NAME}</h1>
                <p className="text-amber-100 mt-1">Revenue Summary & Reports</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={refresh} className="bg-white/20 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              {onGoHome && (
                <button onClick={onGoHome} className="bg-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Home
                </button>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── Date Filters ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button onClick={() => setDateMode('day')} className={`px-4 py-2 text-sm font-medium transition ${dateMode === 'day' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Single Day</button>
              <button onClick={() => setDateMode('range')} className={`px-4 py-2 text-sm font-medium transition ${dateMode === 'range' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Date Range</button>
            </div>

            {dateMode === 'day' ? (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <input
                  type="date" value={selectedDate} max={today()}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <button onClick={() => setSelectedDate(today())} className="text-xs px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium">Today</button>
                <button
                  onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(toDateStr(d)); }}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >← Prev</button>
                <button
                  onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); if (toDateStr(d) <= today()) setSelectedDate(toDateStr(d)); }}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >Next →</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar className="w-4 h-4 text-amber-600" />
                <input type="date" value={rangeFrom} max={rangeTo} onChange={e => setRangeFrom(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 text-sm" />
                <span className="text-gray-400 text-sm">to</span>
                <input type="date" value={rangeTo} min={rangeFrom} max={today()} onChange={e => setRangeTo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 text-sm" />
                <button
                  onClick={() => { const d = toDateStr(new Date()); setRangeFrom(d); setRangeTo(d); }}
                  className="text-xs px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium"
                >Today</button>
                <button
                  onClick={() => {
                    const end = new Date(); end.setDate(end.getDate() - 1);
                    const start = new Date(end); start.setDate(start.getDate() - 6);
                    setRangeFrom(toDateStr(start)); setRangeTo(toDateStr(end));
                  }}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >Last 7 days</button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getFullYear(), end.getMonth(), 1);
                    setRangeFrom(toDateStr(start)); setRangeTo(toDateStr(end));
                  }}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >This Month</button>
              </div>
            )}

            <p className="ml-auto text-xs text-gray-400 hidden md:block">
              {dateMode === 'day'
                ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : `${fmtDate(rangeFrom)} — ${fmtDate(rangeTo)}`}
            </p>
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="col-span-2 md:col-span-1">
            <KpiCard icon={TrendingUp} label="Total Revenue" value={fmt(kpi.total)} sub={`${kpi.count} bill${kpi.count !== 1 ? 's' : ''}`} color="border-amber-500" />
          </div>
          <KpiCard icon={BarChart3} label="Bill Count" value={kpi.count} color="border-gray-400" />
          <KpiCard icon={Home} label="Room Booking" value={fmt(kpi.room)} sub={`${allBills.filter(b => { const day = b.billDate?.slice(0,10); return (dateMode==='day'?day===selectedDate:day>=rangeFrom&&day<=rangeTo) && b.billType==='room'; }).length} bills`} color="border-blue-500" />
          <KpiCard icon={Users} label="Function" value={fmt(kpi.function)} sub={`${allBills.filter(b => { const day = b.billDate?.slice(0,10); return (dateMode==='day'?day===selectedDate:day>=rangeFrom&&day<=rangeTo) && b.billType==='function'; }).length} bills`} color="border-purple-500" />
          <KpiCard icon={UtensilsCrossed} label="Restaurant" value={fmt(kpi.restaurant)} sub={`${allBills.filter(b => { const day = b.billDate?.slice(0,10); return (dateMode==='day'?day===selectedDate:day>=rangeFrom&&day<=rangeTo) && b.billType==='restaurant'; }).length} bills`} color="border-green-500" />
        </div>

        {/* ── Type filter tabs + Bill list ──────────────────────── */}
        <div className="bg-white rounded-2xl shadow p-5">
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <ReceiptText className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-gray-700 mr-2">Filter by Type:</span>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  typeFilter === key
                    ? key === 'all' ? 'bg-amber-500 text-white'
                      : key === 'room' ? 'bg-blue-600 text-white'
                      : key === 'function' ? 'bg-purple-600 text-white'
                      : 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
                <span className="ml-1.5 text-xs opacity-75">
                  ({key === 'all' ? filtered.length : filtered.filter(b => b.billType === key).length})
                </span>
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400 font-mono">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Revenue bar (mini breakdown) */}
          {kpi.total > 0 && (
            <div className="mb-5">
              <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
                {kpi.room > 0 && <div style={{ width: `${(kpi.room / kpi.total) * 100}%` }} className="bg-blue-500 transition-all" title={`Room: ${fmt(kpi.room)}`} />}
                {kpi.function > 0 && <div style={{ width: `${(kpi.function / kpi.total) * 100}%` }} className="bg-purple-500 transition-all" title={`Function: ${fmt(kpi.function)}`} />}
                {kpi.restaurant > 0 && <div style={{ width: `${(kpi.restaurant / kpi.total) * 100}%` }} className="bg-green-500 transition-all" title={`Restaurant: ${fmt(kpi.restaurant)}`} />}
              </div>
              <div className="flex gap-4 mt-1.5 text-xs text-gray-500 flex-wrap">
                {kpi.room > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Room {((kpi.room/kpi.total)*100).toFixed(1)}%</span>}
                {kpi.function > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Function {((kpi.function/kpi.total)*100).toFixed(1)}%</span>}
                {kpi.restaurant > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Restaurant {((kpi.restaurant/kpi.total)*100).toFixed(1)}%</span>}
              </div>
            </div>
          )}

          {/* Bills list */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText className="w-14 h-14 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No bills found</p>
              <p className="text-sm mt-1">No {typeFilter !== 'all' ? TYPE_LABELS[typeFilter] : ''} records for the selected period.</p>
            </div>
          ) : (
            <div>
              {filtered.map(bill => (
                <BillRow key={bill.billNumber} bill={bill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
