import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Check, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { useAppState } from '@/context/AppStateContext';
import { monthlyAttendance } from '@/data/mockData';

export default function Attendance() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'leave' | 'timesheets'>('daily');
  const [leaveFilter, setLeaveFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-06-03');

  const { state, updateLeaveStatus, createLeaveRequest } = useAppState();
  const session = state.session;
  const role = session?.role || 'staff';
  const userId = session?.userId || '';

  // Leave Form State (Staff)
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Compute dynamic stats for selectedDate
  let presentCount = 0;
  let leaveCount = 0;
  let lateCount = 0;
  let absentCount = 0;

  state.users.forEach(u => {
    const record = state.attendance[u.id]?.[selectedDate];
    if (record) {
      if (record.status === 'Present' || record.status === 'Remote') presentCount++;
      else if (record.status === 'Late') lateCount++;
      else if (record.status === 'On Leave') leaveCount++;
      else if (record.status === 'Half-day') presentCount++; // Half-day counts towards present
      else absentCount++;
    } else {
      absentCount++;
    }
  });

  const overviewCards = [
    { icon: <CheckCircle size={24} />, value: presentCount.toString(), sub: `${Math.round((presentCount / state.users.length) * 100) || 0}% present rate`, color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-200' },
    { icon: <Clock size={24} />, value: leaveCount.toString(), sub: 'approved leaves today', color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
    { icon: <AlertCircle size={24} />, value: (lateCount + absentCount).toString(), sub: `${lateCount} late, ${absentCount} absent`, color: 'bg-red-100 text-red-700', borderColor: 'border-red-200' },
  ];

  const tabs = role === 'hr' ? [
    { key: 'daily' as const, label: 'Daily Attendance' },
    { key: 'leave' as const, label: 'Leave Requests' },
    { key: 'timesheets' as const, label: 'Timesheets' },
  ] : [
    { key: 'daily' as const, label: 'My Attendance Logs' },
    { key: 'leave' as const, label: 'My Leave Requests' }
  ];

  // Filtering Leaves
  const filteredLeaves = state.leaves.filter(l => {
    const isUserMatch = role === 'hr' || l.employeeId === userId;
    const isTypeMatch = leaveFilter === 'All' || l.leaveType === leaveFilter;
    return isUserMatch && isTypeMatch;
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo) {
      alert('Please fill in start and end dates.');
      return;
    }
    const currentUser = state.users.find(u => u.id === userId);
    createLeaveRequest({
      employeeId: userId,
      employeeName: currentUser?.name || 'Staff Member',
      leaveType,
      from: leaveFrom,
      to: leaveTo,
      days: Number(leaveDays)
    });
    setLeaveSuccess(true);
    setTimeout(() => {
      setLeaveSuccess(false);
      setLeaveFrom('');
      setLeaveTo('');
      setLeaveDays(1);
    }, 3000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            {role === 'hr' ? 'Attendance & Leave Management' : 'My Attendance & Leaves'}
          </h1>
          <p className="text-sm text-[#6b7280]">
            {role === 'hr' 
              ? 'Track presence, manage leave requests, and review timesheets' 
              : 'Record presence, request leaves, and view your logs'}
          </p>
        </div>
        {role === 'hr' && (
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
              Export Report
            </button>
          </div>
        )}
      </div>

      {/* Overview Cards (HR Only) */}
      {role === 'hr' && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          {overviewCards.map((card, i) => (
            <div
              key={i}
              className={`bg-white border ${card.borderColor} rounded-lg p-5 shadow-sm ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transition: `all 0.4s ease-out ${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1f2937]">{card.value}</p>
              <p className="text-sm text-[#6b7280] mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-[#e5e7eb]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-[#006938] border-[#006938]'
                  : 'text-[#6b7280] border-transparent hover:text-[#1f2937]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Daily tab for HR or logs tab for Staff */}
          {activeTab === 'daily' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                        {role === 'hr' ? 'Employee' : 'Date'}
                      </th>
                      {role === 'hr' && (
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      )}
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Check-in</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Check-out</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Hours</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {role === 'hr' ? (
                      state.users.map((u, i) => {
                        const rec = state.attendance[u.id]?.[selectedDate] || {
                          checkIn: null,
                          checkOut: null,
                          status: 'Absent',
                          hours: null,
                          location: '—'
                        };
                        return (
                          <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#006938] text-white flex items-center justify-center text-[10px] font-semibold">
                                  {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <span className="text-sm text-[#1f2937]">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6b7280]">{u.id}</td>
                            <td className="px-4 py-3 text-sm text-[#6b7280]">{u.department || 'Support Staff'}</td>
                            <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkIn || '—'}</td>
                            <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkOut || '—'}</td>
                            <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                            <td className="px-4 py-3 text-sm text-[#1f2937]">{rec.hours !== null ? `${rec.hours.toFixed(2)}h` : '—'}</td>
                            <td className="px-4 py-3 text-sm text-[#6b7280]">{rec.location}</td>
                          </tr>
                        );
                      })
                    ) : (
                      // Staff logs list
                      Object.keys(state.attendance[userId] || {}).sort((a, b) => b.localeCompare(a)).map((date, i) => {
                        const rec = state.attendance[userId][date];
                        return (
                          <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                            <td className="px-4 py-3 text-sm text-[#1f2937] font-semibold">{date}</td>
                            <td className="px-4 py-3 text-sm text-[#6b7280]">{state.users.find(u => u.id === userId)?.department || '—'}</td>
                            <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkIn || '—'}</td>
                            <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkOut || '—'}</td>
                            <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                            <td className="px-4 py-3 text-sm text-[#1f2937]">{rec.hours !== null ? `${rec.hours.toFixed(2)}h` : '—'}</td>
                            <td className="px-4 py-3 text-sm text-[#6b7280]">{rec.location}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leave Requests Tab */}
          {activeTab === 'leave' && (
            <div className="animate-fade-in space-y-6">
              {role === 'staff' && (
                <div className="bg-[#f7f8fa] border border-[#e5e7eb] rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-[#1f2937] mb-3">Submit Leave Request</h3>
                  {leaveSuccess && (
                    <div className="mb-4 p-3 bg-[#f0f9f4] text-[#006938] text-xs rounded-lg border border-[#d1fae5] font-medium">
                      Leave request submitted successfully! Pending HR approval.
                    </div>
                  )}
                  <form onSubmit={handleApplyLeave} className="grid grid-cols-5 gap-4 items-end">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">Leave Type</label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      >
                        <option>Annual Leave</option>
                        <option>Sick Leave</option>
                        <option>Emergency Leave</option>
                        <option>Unpaid Leave</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">Start Date</label>
                      <input
                        type="date"
                        value={leaveFrom}
                        onChange={(e) => setLeaveFrom(e.target.value)}
                        className="w-full h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">End Date</label>
                      <input
                        type="date"
                        value={leaveTo}
                        onChange={(e) => setLeaveTo(e.target.value)}
                        className="w-full h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-[#6b7280] mb-1">Days</label>
                      <input
                        type="number"
                        min="1"
                        value={leaveDays}
                        onChange={(e) => setLeaveDays(Number(e.target.value))}
                        className="w-full h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="col-span-1 h-9 bg-[#006938] hover:bg-[#005a30] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Request Leave
                    </button>
                  </form>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <select value={leaveFilter} onChange={(e) => setLeaveFilter(e.target.value)} className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm">
                  <option value="All">All Leave Types</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Leave Type</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">From</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">To</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Days</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      {role === 'hr' && (
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((req, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#1f2937] font-semibold">{req.employeeName}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{req.leaveType}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.from}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.to}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{req.days}</td>
                        <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                        {role === 'hr' && (
                          <td className="px-4 py-3">
                            {req.status === 'Pending' ? (
                              <div className="flex items-center gap-1.5 animate-fade-in">
                                <button
                                  onClick={() => updateLeaveStatus(req.id, 'Approved')}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                                  title="Approve"
                                >
                                  <Check size={14} className="text-emerald-600" />
                                </button>
                                <button
                                  onClick={() => updateLeaveStatus(req.id, 'Rejected')}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                  title="Reject"
                                >
                                  <X size={14} className="text-red-600" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[#9ca3af]">Processed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timesheets Tab */}
          {activeTab === 'timesheets' && role === 'hr' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Mon</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Tue</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Wed</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Thu</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Fri</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Sat</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Sun</th>
                      <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.users.slice(0, 6).map((u, i) => {
                      const mon = state.attendance[u.id]?.['2026-06-01']?.hours || 8.0;
                      const tue = state.attendance[u.id]?.['2026-06-02']?.hours || 8.5;
                      const wed = state.attendance[u.id]?.['2026-06-03']?.hours || 0;
                      const total = mon + tue + wed;
                      return (
                        <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#1f2937] font-semibold">{u.name}</td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-emerald-600">{mon}h</td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-emerald-600">{tue}h</td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-emerald-600">{wed > 0 ? `${wed}h` : '—'}</td>
                          <td className="px-4 py-3 text-center text-sm text-[#9ca3af]">—</td>
                          <td className="px-4 py-3 text-center text-sm text-[#9ca3af]">—</td>
                          <td className="px-4 py-3 text-center text-sm text-[#9ca3af]">—</td>
                          <td className="px-4 py-3 text-center text-sm text-[#9ca3af]">—</td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-[#1f2937]">{total}h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Attendance Chart (HR Only) */}
      {role === 'hr' && (
        <div
          className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm mt-6 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.6s ease-out 0.5s' }}
        >
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Monthly Attendance Overview — June 2026</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyAttendance}>
              <CartesianGrid strokeDasharray="none" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="present" stackId="a" fill="#006938" radius={[0, 0, 0, 0]} name="Present" />
              <Bar dataKey="leave" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="On Leave" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardLayout>
  );
}
