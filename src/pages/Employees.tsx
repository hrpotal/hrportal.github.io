import { useState, useEffect } from 'react';
import { Search, Plus, Upload, Download, Eye, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { useAppState } from '@/context/AppStateContext';

export default function Employees() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const { state, deleteEmployee } = useAppState();
  const employees = state.users;

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const departments = ['All', 'School of Computing', 'School of Business', 'School of Arts', 'School of Science', 'Administration', 'Support Staff'];
  const statuses = ['All', 'Active', 'On Leave', 'Terminated', 'New Hire'];

  const filtered = employees.filter(e => {
    const matchSearch = !searchQuery || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const openDrawer = (emp: any) => {
    setSelectedEmployee(emp);
    setShowDrawer(true);
  };

  const handleDelete = (empId: string) => {
    if (confirm('Are you sure you want to remove this employee from the system?')) {
      deleteEmployee(empId);
      setShowDrawer(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">All Employees</h1>
          <p className="text-sm text-[#6b7280]">{employees.length} total staff members across all departments</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="#/employees/add" className="flex items-center gap-2 px-4 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors">
            <Plus size={16} /> Add Employee
          </a>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            <Upload size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`bg-white border border-[#e5e7eb] rounded-lg p-4 mb-5 flex items-center gap-4 flex-wrap ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 0.3s ease-out' }}
      >
        <div className="relative flex-1 min-w-[240px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-[#f7f8fa] border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938] focus:ring-[3px] focus:ring-[rgba(0,105,56,0.08)]"
          />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm text-[#1f2937] bg-white focus:outline-none focus:border-[#006938]">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm text-[#1f2937] bg-white focus:outline-none focus:border-[#006938]">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
        {(searchQuery || deptFilter !== 'All' || statusFilter !== 'All') && (
          <button onClick={() => { setSearchQuery(''); setDeptFilter('All'); setStatusFilter('All'); }} className="text-sm text-[#006938] hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Name</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Position</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Email</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Type</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr
                  key={emp.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors cursor-pointer"
                  onClick={() => openDrawer(emp)}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-5 py-3 text-sm font-medium text-[#1f2937]">{emp.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#006938] text-white flex items-center justify-center text-[10px] font-semibold">
                        {emp.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <span className="text-sm text-[#1f2937]">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#6b7280]">{emp.department || 'Support Staff'}</td>
                  <td className="px-5 py-3 text-sm text-[#1f2937]">{emp.position || '—'}</td>
                  <td className="px-5 py-3 text-sm text-[#6b7280]">{emp.email}</td>
                  <td className="px-5 py-3"><StatusBadge status={emp.status || 'Active'} /></td>
                  <td className="px-5 py-3 text-sm text-[#6b7280]">{emp.employmentType || 'Full-time'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors" title="View" onClick={() => openDrawer(emp)}>
                        <Eye size={14} className="text-[#6b7280]" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-md transition-colors" title="Delete" onClick={() => handleDelete(emp.id)}>
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e5e7eb]">
          <span className="text-sm text-[#6b7280]">Showing 1-{filtered.length} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-[#e5e7eb] rounded-md hover:bg-[#f7f8fa] disabled:opacity-50"><ChevronLeft size={14}/></button>
            <button className="px-2.5 py-1.5 bg-[#006938] text-white rounded-md text-sm font-medium">1</button>
            <button className="p-1.5 border border-[#e5e7eb] rounded-md hover:bg-[#f7f8fa]"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>

      {/* Employee Detail Drawer */}
      {showDrawer && selectedEmployee && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowDrawer(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl z-50 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#e5e7eb]">
              <h3 className="text-lg font-semibold text-[#1f2937]">Employee Profile</h3>
              <button onClick={() => setShowDrawer(false)} className="p-1.5 hover:bg-[#f7f8fa] rounded-lg transition-colors">
                <X size={18} className="text-[#6b7280]" />
              </button>
            </div>

            <div className="p-5">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#006938] text-white flex items-center justify-center text-xl font-bold">
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#1f2937]">{selectedEmployee.name}</h4>
                  <p className="text-sm text-[#6b7280]">{selectedEmployee.position}</p>
                  <StatusBadge status={selectedEmployee.status || 'Active'} />
                </div>
              </div>

              {/* Info Sections */}
              <div className="space-y-5">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af] mb-2">Personal Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Employee ID</span><span className="text-[#1f2937] font-medium">{selectedEmployee.id}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Email</span><span className="text-[#1f2937]">{selectedEmployee.email}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Phone</span><span className="text-[#1f2937]">{selectedEmployee.phone || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Date of Birth</span><span className="text-[#1f2937]">{selectedEmployee.dateOfBirth || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Nationality</span><span className="text-[#1f2937]">{selectedEmployee.nationality || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Emirates ID</span><span className="text-[#1f2937]">{selectedEmployee.emiratesId || '—'}</span></div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af] mb-2">Employment Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Department</span><span className="text-[#1f2937]">{selectedEmployee.department || 'Support Staff'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Position</span><span className="text-[#1f2937]">{selectedEmployee.position || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Employment Type</span><span className="text-[#1f2937]">{selectedEmployee.employmentType || 'Full-time'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Start Date</span><span className="text-[#1f2937]">{selectedEmployee.joinDate || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Salary</span><span className="text-[#1f2937] font-medium">AED {selectedEmployee.salary?.toLocaleString() || (state.payroll.salaries[selectedEmployee.id]?.toLocaleString())}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Manager</span><span className="text-[#1f2937]">{selectedEmployee.manager || '—'}</span></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-[#e5e7eb]">
                <button
                  onClick={() => handleDelete(selectedEmployee.id)}
                  className="w-full h-10 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Terminate Employment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
