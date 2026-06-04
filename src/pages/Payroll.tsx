import { useState, useEffect } from 'react';
import { Banknote, Users, Receipt, Gift, Download, Play, CheckCircle, Pencil, Check } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { useAppState, type Payslip } from '@/context/AppStateContext';
import { salaryDistribution } from '@/data/mockData';

export default function Payroll() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'runs' | 'payslips' | 'bonuses'>('runs');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  // Edit Salary State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newSalaryVal, setNewSalaryVal] = useState<number>(0);

  // Payroll Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('June 2026');

  const { state, updateSalary, processPayrollRun } = useAppState();
  const session = state.session;
  const role = session?.role || 'staff';
  const userId = session?.userId || '';

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleProcess = () => {
    setShowProcessModal(true);
    setProcessing(true);
    setProcessed(false);
    
    // Simulate process then update state
    setTimeout(() => {
      processPayrollRun(selectedMonth);
      setProcessing(false);
      setProcessed(true);
    }, 2000);
  };

  const handleSaveSalary = (empId: string) => {
    updateSalary(empId, newSalaryVal);
    setEditingUserId(null);
  };

  const startEditSalary = (empId: string, currentSalary: number) => {
    setEditingUserId(empId);
    setNewSalaryVal(currentSalary);
  };

  // Compute dynamic KPI sums
  const currentRuns = state.payroll.runs;
  const latestRun = currentRuns[0] || { totalAmount: 'AED 0', employees: 0, tax: 'AED 0', bonuses: 'AED 0' };

  const summaryCards = [
    { icon: <Banknote size={20} />, label: 'Latest Payroll Outflow', value: latestRun.totalAmount, detail: latestRun.month, color: 'bg-emerald-100 text-emerald-700' },
    { icon: <Users size={20} />, label: 'Active Payroll Roster', value: state.users.length.toString(), detail: 'employees covered', color: 'bg-blue-100 text-blue-700' },
    { icon: <Receipt size={20} />, label: 'Tax Deductions', value: latestRun.tax, detail: '7.5% UAE framework', color: 'bg-amber-100 text-amber-700' },
    { icon: <Gift size={20} />, label: 'Bonuses & Perks', value: latestRun.bonuses, detail: 'computed automatically', color: 'bg-purple-100 text-purple-700' },
  ];

  const tabs = role === 'hr' ? [
    { key: 'runs' as const, label: 'Payroll Runs' },
    { key: 'payslips' as const, label: 'Payslips' },
    { key: 'bonuses' as const, label: 'Manage Salaries' },
  ] : [
    { key: 'payslips' as const, label: 'My Payslips' }
  ];

  useEffect(() => {
    if (role === 'staff') {
      setActiveTab('payslips');
    }
  }, [role]);

  // Filtering Payslips
  const filteredPayslips = state.payroll.payslips.filter(slip => {
    const isUserMatch = role === 'hr' || slip.employeeId === userId;
    const isSearchMatch = role === 'staff' || 
      slip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      slip.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return isUserMatch && isSearchMatch;
  });

  const barColors = ['#006938', '#059669', '#34d399', '#a7f3d0', '#10b981', '#6ee7b7'];

  // Client-side HTML Payslip Downloader
  const downloadPayslipHTML = (slip: Payslip) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payslip - ${slip.employeeName} - ${slip.month}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1f2937; background: #fff; line-height: 1.5; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; border-bottom: 3px solid #006938; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #006938; margin: 0; font-size: 26px; font-weight: bold; }
          .header p { margin: 5px 0 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 35px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6; }
          .details div { font-size: 13px; }
          .details strong { color: #4b5563; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border-bottom: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; font-size: 14px; }
          .table th { background-color: #f3f4f6; color: #374151; font-weight: 600; }
          .deductions { color: #ef4444; }
          .net-row { font-weight: bold; background-color: #f0f9f4; color: #006938; }
          .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 11px; }
          .btn-print { margin-top: 20px; text-align: center; }
          .btn { background: #006938; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UNIVERSITY OF STIRLING</h1>
            <p>Institutional Payroll & Compensation Office</p>
          </div>
          <div class="details">
            <div><strong>Employee Name:</strong> ${slip.employeeName}</div>
            <div><strong>Pay Period:</strong> ${slip.month}</div>
            <div><strong>Employee ID:</strong> ${slip.employeeId}</div>
            <div><strong>Status:</strong> ${slip.status} (WPS Processed)</div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Gross Salary</td>
                <td style="text-align: right;">${slip.grossSalary}</td>
              </tr>
              <tr>
                <td class="deductions">Statutory Deductions (7.5% Tax/Pension)</td>
                <td style="text-align: right;" class="deductions">-${slip.deductions}</td>
              </tr>
              <tr class="net-row">
                <td>Net Pay Transferred</td>
                <td style="text-align: right;">${slip.netSalary}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            This is an electronically generated payslip and requires no physical signature. University of Stirling RAK.
          </div>
          <div class="btn-print">
            <button class="btn" onclick="window.print()">Print Payslip</button>
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${slip.employeeName.replace(/\s+/g, '_')}_${slip.month.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            {role === 'hr' ? 'Payroll Processing' : 'My Compensation'}
          </h1>
          <p className="text-sm text-[#6b7280]">
            {role === 'hr' ? 'Manage salaries, process runs, and export statements' : 'View your payslips and breakdown'}
          </p>
        </div>
        {role === 'hr' && (
          <div className="flex items-center gap-3">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)} 
              className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm text-[#1f2937] focus:outline-none"
            >
              <option>June 2026</option>
              <option>July 2026</option>
              <option>August 2026</option>
            </select>
            <button
              onClick={handleProcess}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#006938] text-white rounded-lg text-sm font-semibold hover:bg-[#005a30] transition-colors"
            >
              <Play size={16} /> Process Payroll
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards (HR Only) */}
      {role === 'hr' && (
        <div className="grid grid-cols-4 gap-5 mb-6">
          {summaryCards.map((card, i) => (
            <div
              key={i}
              className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm hover:shadow-md transition-all ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-xl font-bold text-[#1f2937]">{card.value}</p>
              <p className="text-xs text-[#6b7280] mt-1">{card.label}</p>
              <p className="text-[10px] text-[#9ca3af] mt-0.5">{card.detail}</p>
            </div>
          ))}
        </div>
      )}

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
          {activeTab === 'runs' && role === 'hr' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Month</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Total Outflow</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employees Covered</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Tax Deducted</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Bonuses Paid</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRuns.map((run, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-[#1f2937]">{run.month}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937] font-mono">{run.totalAmount}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{run.employees}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280] font-mono">{run.tax}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280] font-mono">{run.bonuses}</td>
                        <td className="px-4 py-3"><StatusBadge status={run.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payslips' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                {role === 'hr' && (
                  <input
                    type="text"
                    placeholder="Search employee by name/ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm w-64 focus:outline-none focus:border-[#006938]"
                  />
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Month</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Gross Salary</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Deductions (7.5%)</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Net Salary</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayslips.map((slip, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-[#1f2937]">{slip.employeeName}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{slip.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{slip.month}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937] font-mono">{slip.grossSalary}</td>
                        <td className="px-4 py-3 text-sm text-red-500 font-mono">{slip.deductions}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#006938] font-mono">{slip.netSalary}</td>
                        <td className="px-4 py-3"><StatusBadge status={slip.status} /></td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => downloadPayslipHTML(slip)}
                            className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors text-[#006938]"
                            title="Download Payslip"
                          >
                            <Download size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bonuses' && role === 'hr' && (
            <div className="animate-fade-in space-y-4">
              <h3 className="text-sm font-semibold text-[#1f2937] mb-2">Base Salary Mapping</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Current Salary (Monthly)</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.users.map((u) => {
                      const currentSal = state.payroll.salaries[u.id] || u.salary || 10000;
                      const isEditing = editingUserId === u.id;
                      return (
                        <tr key={u.id} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold text-[#1f2937]">{u.name}</td>
                          <td className="px-4 py-3 text-sm text-[#6b7280]">{u.id}</td>
                          <td className="px-4 py-3 text-sm text-[#6b7280]">{u.department || 'Support Staff'}</td>
                          <td className="px-4 py-3 text-sm font-mono text-[#1f2937]">
                            {isEditing ? (
                              <input
                                type="number"
                                value={newSalaryVal}
                                onChange={(e) => setNewSalaryVal(Number(e.target.value))}
                                className="h-8 w-32 border border-[#e5e7eb] rounded px-2 focus:outline-[#006938]"
                              />
                            ) : (
                              `AED ${currentSal.toLocaleString()}`
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveSalary(u.id)}
                                className="p-1 bg-[#006938] text-white rounded hover:bg-[#005a30]"
                              >
                                <Check size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditSalary(u.id, currentSal)}
                                className="p-1 hover:bg-[#e6f3ec] rounded text-[#006938]"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </td>
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

      {/* Salary Distribution Chart (HR Only) */}
      {role === 'hr' && (
        <div
          className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm mt-6 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.6s ease-out 0.6s' }}
        >
          <h3 className="text-md font-semibold text-[#1f2937] mb-4">Salary Distribution by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salaryDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="none" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `AED ${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Total Salary']} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={28}>
                {salaryDistribution.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[400px] animate-scale-in">
            <h3 className="text-xl font-semibold text-[#1f2937] mb-4 text-center">Process Payroll</h3>
            {processing && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#e5e7eb] border-t-[#006938] rounded-full animate-spin" />
                <p className="text-sm text-[#6b7280]">Processing {selectedMonth} payroll...</p>
                <p className="text-xs text-[#9ca3af] mt-1">Calculating deductions and generating payslips</p>
              </div>
            )}
            {processed && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-[#1f2937]">Payroll processed successfully!</p>
                <p className="text-xs text-emerald-600 mt-1">All employee payslips are generated and status updated.</p>
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="mt-4 px-6 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
