import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Check, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { attendanceRecords, leaveRequests, monthlyAttendance } from '@/data/mockData';

export default function Attendance() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'leave' | 'timesheets'>('daily');
  const [leaveFilter, setLeaveFilter] = useState('All');

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const overviewCards = [
    { icon: <CheckCircle size={24} />, value: '1,186', sub: '95.0% of total staff', color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-200' },
    { icon: <Clock size={24} />, value: '42', sub: '8 pending approvals', color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
    { icon: <AlertCircle size={24} />, value: '20', sub: '12 late, 8 absent', color: 'bg-red-100 text-red-700', borderColor: 'border-red-200' },
  ];

  const tabs = [
    { key: 'daily' as const, label: 'Daily Attendance' },
    { key: 'leave' as const, label: 'Leave Requests' },
    { key: 'timesheets' as const, label: 'Timesheets' },
  ];

  const filteredLeaves = leaveFilter === 'All' ? leaveRequests : leaveRequests.filter(l => l.leaveType === leaveFilter);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Attendance & Leave</h1>
          <p className="text-sm text-[#6b7280]">Track presence, manage leave requests, and review timesheets</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            defaultValue="2026-06-03"
            className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]"
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
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

      {/* Tabs */}
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
          {activeTab === 'daily' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded border-[#e5e7eb]" /></th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Check-in</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Check-out</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Hours</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((rec, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-[#e5e7eb]" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#006938] text-white flex items-center justify-center text-[10px] font-semibold">
                              {rec.employeeName.split(' ').filter((_, i) => i === 0 || i === rec.employeeName.split(' ').length - 1).map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm text-[#1f2937]">{rec.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{rec.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{rec.department}</td>
                        <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkIn || '—'}</td>
                        <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">{rec.checkOut || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{rec.hours !== null ? `${rec.hours.toFixed(2)}h` : '—'}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{rec.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="animate-fade-in">
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
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((req, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{req.employeeName}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{req.leaveType}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.from}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{req.to}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{req.days}</td>
                        <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                        <td className="px-4 py-3">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors" title="Approve">
                                <Check size={14} className="text-emerald-600" />
                              </button>
                              <button className="p-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors" title="Reject">
                                <X size={14} className="text-red-600" />
                              </button>
                            </div>
                          ) : (
                            <button className="text-sm text-[#006938] hover:underline">View</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'timesheets' && (
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
                    {attendanceRecords.slice(0, 6).map((rec, i) => {
                      const hours = [8.5, 9.0, 7.5, 8.0, 4.0, 0, 0];
                      const total = hours.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#1f2937]">{rec.employeeName}</td>
                          {hours.map((h, j) => (
                            <td key={j} className="px-4 py-3 text-center">
                              <span className={`text-sm font-medium ${h >= 8 ? 'text-emerald-600' : h >= 4 ? 'text-amber-600' : 'text-red-400'}`}>
                                {h > 0 ? `${h}h` : '—'}
                              </span>
                            </td>
                          ))}
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

      {/* Monthly Attendance Chart */}
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
    </DashboardLayout>
  );
}
