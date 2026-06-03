import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Building2, Shield, Calendar, Banknote,
  Bell, ScrollText, Link2, Check
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { departments } from '@/data/mockData';

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingsTabs = [
    { key: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
    { key: 'departments', label: 'Departments', icon: <Building2 size={18} /> },
    { key: 'roles', label: 'Roles & Permissions', icon: <Shield size={18} /> },
    { key: 'leave', label: 'Leave Types', icon: <Calendar size={18} /> },
    { key: 'payroll', label: 'Payroll Config', icon: <Banknote size={18} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { key: 'audit', label: 'Audit Log', icon: <ScrollText size={18} /> },
    { key: 'integrations', label: 'Integrations', icon: <Link2 size={18} /> },
  ];

  const leaveTypes = [
    { name: 'Annual Leave', days: 30, accrual: 'monthly', carryover: 5 },
    { name: 'Sick Leave', days: 15, note: 'Certificate after 3 days' },
    { name: 'Maternity Leave', days: 60, note: 'Full pay' },
    { name: 'Paternity Leave', days: 5, note: 'Full pay' },
    { name: 'Emergency Leave', days: 3, note: 'Per year' },
    { name: 'Unpaid Leave', days: 0, note: 'Unlimited, requires approval' },
    { name: 'Hajj Leave', days: 15, note: 'Once per contract' },
  ];

  const auditLogs = [
    { timestamp: '2026-06-03 09:15:22', user: 'Dr. Mitchell', action: 'Login', module: 'Auth', details: 'Successful', ip: '192.168.1.45' },
    { timestamp: '2026-06-03 09:22:10', user: 'Dr. Mitchell', action: 'Approve Leave', module: 'Attendance', details: 'Fatima Hassan, 10 days', ip: '192.168.1.45' },
    { timestamp: '2026-06-03 08:45:33', user: 'System', action: 'Payroll Process', module: 'Payroll', details: 'June batch initiated', ip: '—' },
    { timestamp: '2026-06-02 16:30:00', user: 'Robert Chen', action: 'Add Employee', module: 'Employees', details: 'Omar Khalil, ST-1008', ip: '192.168.1.62' },
    { timestamp: '2026-06-02 14:15:00', user: 'Dr. Mitchell', action: 'Update Settings', module: 'Settings', details: 'Leave type config changed', ip: '192.168.1.45' },
    { timestamp: '2026-06-02 11:00:00', user: 'System', action: 'Backup', module: 'System', details: 'Daily backup completed', ip: '—' },
  ];

  const integrations = [
    { name: 'Microsoft 365', connected: true, description: 'SSO, Outlook calendar sync' },
    { name: 'SIF Framework', connected: true, description: 'UAE payroll integration' },
    { name: 'Mohre', connected: true, description: 'Ministry of Human Resources' },
    { name: 'Bank Integration', connected: true, description: 'WPS (Wage Protection System)' },
    { name: 'Slack', connected: false, description: 'Team notifications' },
  ];

  const roles = [
    { role: 'HR Director', users: 1, permissions: ['Full Access'] },
    { role: 'HR Manager', users: 2, permissions: ['Employees', 'Payroll', 'Recruitment'] },
    { role: 'HR Officer', users: 3, permissions: ['Employees', 'Attendance', 'Leave'] },
    { role: 'Department Head', users: 6, permissions: ['Department Staff', 'Performance'] },
    { role: 'Line Manager', users: 24, permissions: ['Team Attendance', 'Leave Approval', 'Performance'] },
    { role: 'Employee', users: 1212, permissions: ['Self Service Only'] },
  ];

  const ToggleSwitch = ({ defaultOn = true }: { defaultOn?: boolean }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <button
        onClick={() => setOn(!on)}
        className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-[#006938]' : 'bg-[#e5e7eb]'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f2937]">System Settings</h1>
        <p className="text-sm text-[#6b7280]">Configure HRMS preferences, roles, and institutional settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sub-navigation */}
        <div
          className={`w-[200px] shrink-0 bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 0.3s ease-out' }}
        >
          {settingsTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors border-l-[3px] ${
                activeTab === tab.key
                  ? 'text-[#006938] bg-[#f0f9f4] border-[#006938]'
                  : 'text-[#6b7280] border-transparent hover:bg-[#f7f8fa] hover:text-[#1f2937]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-[#e5e7eb] rounded-lg shadow-sm p-6 animate-fade-in">
          {activeTab === 'general' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">General Settings</h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">University Name</label>
                  <input type="text" defaultValue="University of Stirling — Ras Al Khaimah Campus" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Timezone</label>
                  <input type="text" defaultValue="Asia/Dubai (GMT+4)" disabled className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm bg-[#f7f8fa] text-[#6b7280]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Currency</label>
                  <input type="text" defaultValue="AED (UAE Dirham)" disabled className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm bg-[#f7f8fa] text-[#6b7280]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Date Format</label>
                  <select className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Language</label>
                  <select className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                    <option>English (UK)</option>
                    <option>Arabic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Fiscal Year Start</label>
                  <input type="text" defaultValue="01/09 (September)" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-[#1f2937]">Departments</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors">
                  + Add Department
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Code</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Name</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Head Count</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Manager</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{dept.code}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{dept.name}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{dept.headCount}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{dept.manager}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md"><SettingsIcon size={14} className="text-[#6b7280]" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Roles & Permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Role</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Users</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Permissions</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{role.role}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{role.users.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{role.permissions.join(', ')}</td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-[#006938] hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Leave Types</h3>
              <div className="space-y-3">
                {leaveTypes.map((lt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#f7f8fa] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-[#1f2937]">{lt.name}</p>
                      <p className="text-xs text-[#6b7280]">{lt.note || `Accrual: ${lt.accrual}, Carryover: ${lt.carryover} days`}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-[#006938]">{lt.days > 0 ? `${lt.days} days/yr` : 'Unlimited'}</span>
                      <button className="text-sm text-[#006938] hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Payroll Configuration</h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Pay Date</label>
                  <input type="text" defaultValue="5th of each month" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Overtime Rate</label>
                  <input type="text" defaultValue="1.5x normal rate" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Gratuity (1-5 years)</label>
                  <input type="text" defaultValue="21 days/year" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-1">Gratuity (5+ years)</label>
                  <input type="text" defaultValue="30 days/year" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  'New leave request',
                  'Leave approved/rejected',
                  'Payroll processed',
                  'New job application',
                  'Performance review due',
                  'Birthday reminders',
                  'Contract expiry (30 days warning)',
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-0">
                    <span className="text-sm text-[#1f2937]">{notif}</span>
                    <ToggleSwitch defaultOn={i < 4} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Audit Log</h3>
              <div className="flex items-center gap-3 mb-4">
                <input type="date" className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm" />
                <input type="text" placeholder="Search user..." className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm w-48" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Timestamp</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">User</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Action</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Module</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Details</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-xs text-[#6b7280] font-mono">{log.timestamp}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{log.user}</td>
                        <td className="px-4 py-3 text-sm text-[#006938]">{log.action}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{log.module}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{log.details}</td>
                        <td className="px-4 py-3 text-xs text-[#9ca3af] font-mono">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Integrations</h3>
              <div className="grid grid-cols-2 gap-4">
                {integrations.map((int, i) => (
                  <div key={i} className="p-4 border border-[#e5e7eb] rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-[#1f2937]">{int.name}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${int.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {int.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280] mb-3">{int.description}</p>
                    <button className={`text-xs font-medium ${int.connected ? 'text-red-500 hover:text-red-600' : 'text-[#006938] hover:text-[#005a30]'}`}>
                      {int.connected ? 'Disconnect' : 'Configure'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== 'audit' && activeTab !== 'integrations' && activeTab !== 'roles' && activeTab !== 'departments' && (
            <div className="mt-6 pt-5 border-t border-[#e5e7eb] flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors flex items-center gap-2"
              >
                {saved && <Check size={16} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
              <button className="px-6 py-2.5 border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
