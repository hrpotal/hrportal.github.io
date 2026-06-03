import { useEffect, useState } from 'react';
import {
  Users, CheckCircle, Clock, Banknote, TrendingUp,
  Download, Plus, FileText, Gift, Briefcase, ChevronRight,
  Calendar, Heart
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import {
  weeklyAttendance, departmentDistribution, activities,
  upcomingEvents, birthdays
} from '@/data/mockData';

const COLORS = ['#006938', '#059669', '#34d399', '#a7f3d0', '#10b981', '#6ee7b7'];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { icon: <Users size={20} />, label: 'Total Employees', value: '1,248', change: '+12 this month', trend: 'up', color: 'bg-emerald-100 text-emerald-700' },
    { icon: <CheckCircle size={20} />, label: 'Present Today', value: '1,186', change: '95.0% attendance', trend: 'up', color: 'bg-blue-100 text-blue-700' },
    { icon: <Clock size={20} />, label: 'On Leave', value: '42', change: '8 pending approvals', trend: 'neutral', color: 'bg-amber-100 text-amber-700' },
    { icon: <Banknote size={20} />, label: 'Payroll Due', value: 'AED 4.2M', change: 'Due June 5', trend: 'neutral', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Dashboard</h1>
          <p className="text-sm text-[#6b7280]">Overview of HR operations — University of Stirling</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6b7280]">Today: 3 June 2026</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#1f2937] hover:bg-[#f7f8fa] transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
              {card.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
            </div>
            <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-[#1f2937]">{card.value}</p>
            <p className={`text-xs font-medium mt-1 ${card.trend === 'up' ? 'text-emerald-600' : 'text-[#6b7280]'}`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-5 mb-6">
        {/* Attendance Trend */}
        <div
          className={`col-span-3 bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.6s ease-out 0.4s' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-[#1f2937]">Weekly Attendance Trend</h3>
            <select className="text-sm border border-[#e5e7eb] rounded-md px-2 py-1 text-[#6b7280]">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyAttendance}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006938" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#006938" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="none" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                formatter={(value: number) => [`${value}%`, 'Attendance']}
              />
              <Area type="monotone" dataKey="rate" stroke="#006938" strokeWidth={2} fill="url(#attendanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div
          className={`col-span-2 bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.6s ease-out 0.5s' }}
        >
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Employees by Department</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {departmentDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {departmentDistribution.map((dept, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-[#6b7280] flex-1 truncate">{dept.name.replace('School of ', '')}</span>
                  <span className="text-xs font-semibold text-[#1f2937]">{dept.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Recent Activity */}
        <div
          className={`col-span-3 bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.5s ease-out 0.6s' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
            <h3 className="text-md font-semibold text-[#1f2937]">Recent Activity</h3>
            <a href="#" className="text-sm text-[#006938] font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </a>
          </div>
          <div>
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#f0f9f4] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#006938] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1f2937]">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.5s ease-out 0.7s' }}
        >
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="#/employees/add" className="flex items-center justify-center gap-2 w-full h-10 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors">
              <Plus size={16} /> Add New Employee
            </a>
            <a href="#/payroll" className="flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
              <FileText size={16} /> Process Payroll
            </a>
            <a href="#/attendance/leave" className="flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors relative">
              <Gift size={16} /> Approve Leave Requests
              <span className="absolute right-3 bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">8</span>
            </a>
            <a href="#/recruitment" className="flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
              <Briefcase size={16} /> Post New Job Opening
            </a>
            <button className="flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
              <Download size={16} /> Generate Monthly Report
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        className={`grid grid-cols-2 gap-5 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.5s ease-out 0.8s' }}
      >
        {/* Upcoming Events */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e6f3ec] text-[#006938] flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1f2937]">{event.title}</p>
                  <p className="text-xs text-[#6b7280]">{event.date} | {event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Birthdays */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Today's Birthdays</h3>
          <div className="space-y-3">
            {birthdays.map((person, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#006938] to-[#059669] text-white flex items-center justify-center text-xs font-semibold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f2937]">{person.name}</p>
                    <p className="text-xs text-[#6b7280]">{person.role} | {person.age} years old</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#006938] text-xs font-medium hover:bg-[#f0f9f4] rounded-lg transition-colors">
                  <Heart size={14} /> Send Wishes
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
