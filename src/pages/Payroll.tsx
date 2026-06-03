import { useState, useEffect } from 'react';
import { Banknote, Users, Receipt, Gift, Download, Eye, Play, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { payrollRuns, payslips, salaryDistribution } from '@/data/mockData';

export default function Payroll() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'runs' | 'payslips' | 'bonuses'>('runs');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleProcess = () => {
    setShowProcessModal(true);
    setProcessing(true);
    setProcessed(false);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
    }, 3000);
  };

  const summaryCards = [
    { icon: <Banknote size={20} />, label: 'Total Payroll', value: 'AED 4,245,800', detail: 'June 2026', color: 'bg-emerald-100 text-emerald-700' },
    { icon: <Users size={20} />, label: 'Employees', value: '1,186', detail: '62 on leave/unpaid', color: 'bg-blue-100 text-blue-700' },
    { icon: <Receipt size={20} />, label: 'Tax Deductions', value: 'AED 318,435', detail: '7.5% average', color: 'bg-amber-100 text-amber-700' },
    { icon: <Gift size={20} />, label: 'Bonuses', value: 'AED 125,000', detail: 'Eid bonus pending', color: 'bg-purple-100 text-purple-700' },
  ];

  const tabs = [
    { key: 'runs' as const, label: 'Payroll Runs' },
    { key: 'payslips' as const, label: 'Payslips' },
    { key: 'bonuses' as const, label: 'Bonuses & Deductions' },
  ];

  const barColors = ['#006938', '#059669', '#34d399', '#a7f3d0', '#10b981', '#6ee7b7'];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Payroll</h1>
          <p className="text-sm text-[#6b7280]">Next payroll run: June 5, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleProcess}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#006938] text-white rounded-lg text-sm font-semibold hover:bg-[#005a30] transition-colors"
          >
            <Play size={16} /> Process Payroll
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            Payslip Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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
            <p className="text-2xl font-bold text-[#1f2937]">{card.value}</p>
            <p className="text-sm text-[#6b7280] mt-1">{card.detail}</p>
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
          {activeTab === 'runs' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Month</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Total Amount</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employees</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Tax</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Bonuses</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollRuns.map((run, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{run.month}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{run.totalAmount}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{run.employees.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{run.tax}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{run.bonuses}</td>
                        <td className="px-4 py-3"><StatusBadge status={run.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors" title="View">
                              <Eye size={14} className="text-[#6b7280]" />
                            </button>
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors" title="Export">
                              <Download size={14} className="text-[#6b7280]" />
                            </button>
                          </div>
                        </td>
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
                <input type="text" placeholder="Search employee..." className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm w-64 focus:outline-none focus:border-[#006938]" />
                <select className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm">
                  <option>May 2026</option>
                  <option>April 2026</option>
                  <option>March 2026</option>
                </select>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm hover:bg-[#f7f8fa]">
                  <Download size={14} /> Bulk Download
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Month</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Gross Salary</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Deductions</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Net Salary</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map((slip, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{slip.employeeName}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{slip.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{slip.month}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{slip.grossSalary}</td>
                        <td className="px-4 py-3 text-sm text-red-500">{slip.deductions}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#006938]">{slip.netSalary}</td>
                        <td className="px-4 py-3"><StatusBadge status={slip.status} /></td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors">
                            <Download size={14} className="text-[#6b7280]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bonuses' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#1f2937] mb-3">Bonuses</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Type</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Amount</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Reason</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#f3f4f6]">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">Dr. Sarah Mitchell</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">Performance Bonus</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#006938]">AED 5,000</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">Q1 Outstanding Performance</td>
                        <td className="px-4 py-3"><StatusBadge status="Approved" /></td>
                      </tr>
                      <tr className="border-b border-[#f3f4f6]">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">All Employees</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">Eid Bonus</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#006938]">AED 120,000</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">Eid Al-Adha 2026</td>
                        <td className="px-4 py-3"><StatusBadge status="Pending" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1f2937] mb-3">Deductions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Type</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Amount</th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#f3f4f6]">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">Khalid Al-Farsi</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">Late Penalty</td>
                        <td className="px-4 py-3 text-sm font-medium text-red-500">AED 50</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">3 late arrivals in May</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Salary Distribution Chart */}
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
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Total Salary']}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={28}>
              {salaryDistribution.map((_, i) => (
                <Cell key={i} fill={barColors[i % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[400px] animate-scale-in">
            <h3 className="text-xl font-semibold text-[#1f2937] mb-4 text-center">Process Payroll</h3>
            {processing && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#e5e7eb] border-t-[#006938] rounded-full animate-spin" />
                <p className="text-sm text-[#6b7280]">Processing June 2026 payroll...</p>
                <p className="text-xs text-[#9ca3af] mt-1">This may take a few moments</p>
              </div>
            )}
            {processed && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-[#1f2937]">Payroll processed successfully!</p>
                <p className="text-xs text-[#6b7280] mt-1">AED 4,245,800 paid to 1,186 employees</p>
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
