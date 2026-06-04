import { useEffect, useState, useRef } from 'react';
import {
  Users, CheckCircle, Clock, Banknote, TrendingUp,
  Download, Plus, FileText, Gift,
  Calendar, Trash2, Upload as UploadIcon, Check
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppState } from '@/context/AppStateContext';
import { weeklyAttendance } from '@/data/mockData';

const COLORS = ['#006938', '#059669', '#34d399', '#a7f3d0', '#10b981', '#6ee7b7'];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const {
    state,
    markAttendance,
    createLeaveRequest,
    uploadDocument,
    deleteDocument
  } = useAppState();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Upload Status
  const [uploadStatus, setUploadStatus] = useState('');

  const session = state.session;
  const userId = session?.userId || '';
  const role = session?.role || 'staff';
  const currentUser = state.users.find(u => u.id === userId);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Compute stats dynamically
  const dateToday = '2026-06-03';
  
  // HR Stats
  const hrTotalEmployees = state.users.length;
  let hrPresentCount = 0;
  let hrLeaveCount = 0;
  let hrAbsentCount = 0;
  
  state.users.forEach(u => {
    const att = state.attendance[u.id]?.[dateToday];
    if (att) {
      if (att.status === 'Present' || att.status === 'Remote' || att.status === 'Late' || att.status === 'Half-day') {
        hrPresentCount++;
      } else if (att.status === 'On Leave') {
        hrLeaveCount++;
      } else {
        hrAbsentCount++;
      }
    } else {
      hrAbsentCount++;
    }
  });

  const hrPendingLeaves = state.leaves.filter(l => l.status === 'Pending').length;
  const hrPayrollDue = state.users.reduce((acc, u) => acc + (state.payroll.salaries[u.id] || u.salary || 0), 0);

  // Dynamic Department Distribution
  const deptMap: { [key: string]: number } = {};
  state.users.forEach(u => {
    const dept = u.department || 'Support Staff';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  
  const dynamicDeptDistribution = Object.keys(deptMap).map(name => ({
    name: name.replace('School of ', ''),
    value: deptMap[name],
    percentage: Math.round((deptMap[name] / state.users.length) * 100)
  }));

  // Dynamic Activities list
  const recentActivities = [
    ...state.leaves.slice(0, 3).map(l => ({
      user: l.employeeName,
      avatar: l.employeeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      action: `requested ${l.leaveType} for ${l.days} days (Status: ${l.status})`,
      time: 'Just now'
    })),
    { user: 'System', avatar: 'SY', action: `Payroll run initialized for ${dateToday.split('-')[1]}`, time: '1 hour ago' }
  ];

  // Staff Stats
  const staffAttendance = state.attendance[userId] || {};
  const staffAttendanceRecords = Object.values(staffAttendance);
  const presentRecords = staffAttendanceRecords.filter(r => r.status === 'Present' || r.status === 'Remote' || r.status === 'Late' || r.status === 'Half-day');
  const attendanceRate = staffAttendanceRecords.length > 0 
    ? Math.round((presentRecords.length / staffAttendanceRecords.length) * 100) 
    : 98;

  const staffRemainingLeave = 30 - state.leaves
    .filter(l => l.employeeId === userId && l.status === 'Approved')
    .reduce((sum, l) => sum + l.days, 0);

  const staffDocumentsCount = state.documents[userId]?.length || 0;
  const staffSalary = state.payroll.salaries[userId] || currentUser?.salary || 0;

  // Attendance Marking Check
  const markedToday = staffAttendance[dateToday];

  const handleMarkToday = (status: 'Present' | 'Leave' | 'Half-day') => {
    const success = markAttendance(userId, dateToday, status === 'Leave' ? 'On Leave' : status);
    if (!success) {
      alert('Attendance for today has already been marked.');
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo) {
      alert('Please fill in start and end dates.');
      return;
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      
      uploadDocument(userId, file.name, base64Data, sizeStr);
      setUploadStatus('Upload successful!');
      setTimeout(() => setUploadStatus(''), 2000);
    };
    reader.onerror = () => {
      setUploadStatus('Upload failed.');
      setTimeout(() => setUploadStatus(''), 2000);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      {role === 'hr' ? (
        /* ==================== HR VIEW ==================== */
        <div>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1f2937]">HR Dashboard</h1>
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
            <div className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-[#1f2937]">{hrTotalEmployees}</p>
              <p className="text-xs font-medium mt-1 text-emerald-600">Active roster</p>
            </div>

            <div className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Present Today</p>
              <p className="text-2xl font-bold text-[#1f2937]">{hrPresentCount}</p>
              <p className="text-xs font-medium mt-1 text-blue-600">{Math.round((hrPresentCount / hrTotalEmployees) * 100) || 0}% attendance rate</p>
            </div>

            <div className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Leaves / Pending</p>
              <p className="text-2xl font-bold text-[#1f2937]">{hrLeaveCount} <span className="text-sm font-normal text-[#6b7280]">/ {hrPendingLeaves} pending</span></p>
              <p className="text-xs font-medium mt-1 text-[#6b7280]">{hrPendingLeaves} approvals needed</p>
            </div>

            <div className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Banknote size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Payroll Commitment</p>
              <p className="text-2xl font-bold text-[#1f2937]">AED {(hrPayrollDue / 1000).toFixed(0)}K</p>
              <p className="text-xs font-medium mt-1 text-[#6b7280]">Monthly payroll expenses</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-5 gap-5 mb-6">
            <div className={`col-span-3 bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-[#1f2937]">Weekly Attendance Trend</h3>
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
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Attendance']} />
                  <Area type="monotone" dataKey="rate" stroke="#006938" strokeWidth={2} fill="url(#attendanceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`col-span-2 bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-md font-semibold text-[#1f2937] mb-4">Employees by Department</h3>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={dynamicDeptDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      dataKey="value"
                      stroke="none"
                    >
                      {dynamicDeptDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {dynamicDeptDistribution.slice(0, 5).map((dept, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[11px] text-[#6b7280] flex-1 truncate">{dept.name}</span>
                      <span className="text-[11px] font-semibold text-[#1f2937]">{dept.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            <div className={`col-span-3 bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
                <h3 className="text-md font-semibold text-[#1f2937]">Recent Activity</h3>
              </div>
              <div>
                {recentActivities.map((activity, i) => (
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

            <div className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm ${mounted ? 'opacity-100' : 'opacity-0'}`}>
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
                  {hrPendingLeaves > 0 && (
                    <span className="absolute right-3 bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {hrPendingLeaves}
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== STAFF VIEW ==================== */
        <div>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1f2937]">Welcome, {currentUser?.name || 'Staff Member'}</h1>
              <p className="text-sm text-[#6b7280]">Staff Employee Dashboard — Stirling HR Portal</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6b7280]">Today: 3 June 2026</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">My Attendance Rate</p>
              <p className="text-2xl font-bold text-[#1f2937]">{attendanceRate}%</p>
              <p className="text-xs text-emerald-600 mt-1">Excellent record</p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Leave Balance</p>
              <p className="text-2xl font-bold text-[#1f2937]">{staffRemainingLeave} <span className="text-xs font-normal text-[#6b7280]">days</span></p>
              <p className="text-xs text-blue-600 mt-1">Out of 30 days yearly</p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">My Documents</p>
              <p className="text-2xl font-bold text-[#1f2937]">{staffDocumentsCount} <span className="text-xs font-normal text-[#6b7280]">files</span></p>
              <p className="text-xs text-amber-600 mt-1">Uploaded in secure storage</p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Banknote size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-1">Last Net Salary</p>
              <p className="text-2xl font-bold text-[#1f2937]">AED {(staffSalary * 0.925).toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Deducted: 7.5% tax</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-5 mb-6">
            {/* Left Col: Attendance Check-In and Apply Leave */}
            <div className="col-span-3 space-y-6">
              {/* Check-In Card */}
              <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
                <h3 className="text-md font-semibold text-[#1f2937] mb-3">Mark Today's Attendance</h3>
                <p className="text-xs text-[#6b7280] mb-4">Date: {dateToday} | Status for today: {markedToday ? (
                  <span className="font-semibold text-[#006938]">{markedToday.status} ({markedToday.checkIn} - {markedToday.checkOut})</span>
                ) : 'Not marked yet'}</p>
                
                {!markedToday ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleMarkToday('Present')}
                      className="flex-1 h-10 bg-[#006938] hover:bg-[#005a30] text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Check-In (Present)
                    </button>
                    <button
                      onClick={() => handleMarkToday('Half-day')}
                      className="flex-1 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Half-Day
                    </button>
                    <button
                      onClick={() => handleMarkToday('Leave')}
                      className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      On Leave
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-[#f0f9f4] border border-[#d1fae5] rounded-lg text-sm text-[#006938] font-medium flex items-center gap-2">
                    <Check size={16} /> Attendance marked successfully for today!
                  </div>
                )}
              </div>

              {/* Leave Form */}
              <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm">
                <h3 className="text-md font-semibold text-[#1f2937] mb-4">Request Leave</h3>
                {leaveSuccess && (
                  <div className="mb-4 p-3 bg-[#f0f9f4] text-[#006938] text-xs rounded-lg border border-[#d1fae5] font-medium">
                    Leave request submitted successfully! Pending HR approval.
                  </div>
                )}
                <form onSubmit={handleApplyLeave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] uppercase mb-1">Leave Type</label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      >
                        <option>Annual Leave</option>
                        <option>Sick Leave</option>
                        <option>Emergency Leave</option>
                        <option>Unpaid Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] uppercase mb-1">Number of Days</label>
                      <input
                        type="number"
                        min="1"
                        value={leaveDays}
                        onChange={(e) => setLeaveDays(Number(e.target.value))}
                        className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] uppercase mb-1">Start Date</label>
                      <input
                        type="date"
                        value={leaveFrom}
                        onChange={(e) => setLeaveFrom(e.target.value)}
                        className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6b7280] uppercase mb-1">End Date</label>
                      <input
                        type="date"
                        value={leaveTo}
                        onChange={(e) => setLeaveTo(e.target.value)}
                        className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-[#006938]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#006938] hover:bg-[#005a30] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Documents Management */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-[#1f2937]">My Documents</h3>
                  <button
                    onClick={triggerFileSelect}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#006938] hover:underline"
                  >
                    <UploadIcon size={14} /> Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>

                {uploadStatus && (
                  <p className="text-xs font-medium text-[#006938] mb-3">{uploadStatus}</p>
                )}

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
                  {(state.documents[userId] || []).length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#e5e7eb] rounded-lg">
                      <FileText className="mx-auto text-[#9ca3af] mb-2" size={24} />
                      <p className="text-xs text-[#6b7280]">No documents uploaded.</p>
                    </div>
                  ) : (
                    (state.documents[userId] || []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-[#f7f8fa] border border-[#e5e7eb] rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={18} className="text-[#006938] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#1f2937] truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-[#6b7280]">{doc.uploadedAt} | {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={doc.fileData}
                            download={doc.name}
                            className="p-1 hover:bg-emerald-50 rounded text-[#006938]"
                            title="Download"
                          >
                            <Download size={14} />
                          </a>
                          <button
                            onClick={() => deleteDocument(userId, doc.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
