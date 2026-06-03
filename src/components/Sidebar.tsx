import { useState } from 'react';
import {
  LayoutDashboard, UserCircle, Users, UserPlus, Building2, FileText,
  CalendarCheck, Clock, ClipboardCheck, Banknote, Receipt, Gift,
  Briefcase, UserSearch, MessageSquare, UserCheck, Target,
  Award, MessageCircle, Settings, FileBarChart, ScrollText,
  LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '#/dashboard' },
      { label: 'My Profile', icon: <UserCircle size={20} />, href: '#/profile' },
    ],
  },
  {
    label: 'EMPLOYEES',
    items: [
      { label: 'All Employees', icon: <Users size={20} />, href: '#/employees' },
      { label: 'Add Employee', icon: <UserPlus size={20} />, href: '#/employees/add' },
      { label: 'Departments', icon: <Building2 size={20} />, href: '#/employees/departments' },
      { label: 'Contracts', icon: <FileText size={20} />, href: '#/employees/contracts' },
    ],
  },
  {
    label: 'ATTENDANCE',
    items: [
      { label: 'Attendance', icon: <CalendarCheck size={20} />, href: '#/attendance' },
      { label: 'Leave Requests', icon: <Clock size={20} />, href: '#/attendance/leave' },
      { label: 'Timesheets', icon: <ClipboardCheck size={20} />, href: '#/attendance/timesheets' },
    ],
  },
  {
    label: 'PAYROLL',
    items: [
      { label: 'Payroll Processing', icon: <Banknote size={20} />, href: '#/payroll' },
      { label: 'Payslips', icon: <Receipt size={20} />, href: '#/payroll/payslips' },
      { label: 'Bonuses', icon: <Gift size={20} />, href: '#/payroll/bonuses' },
    ],
  },
  {
    label: 'RECRUITMENT',
    items: [
      { label: 'Job Openings', icon: <Briefcase size={20} />, href: '#/recruitment' },
      { label: 'Candidates', icon: <UserSearch size={20} />, href: '#/recruitment/candidates' },
      { label: 'Interviews', icon: <MessageSquare size={20} />, href: '#/recruitment/interviews' },
      { label: 'Onboarding', icon: <UserCheck size={20} />, href: '#/recruitment/onboarding' },
    ],
  },
  {
    label: 'PERFORMANCE',
    items: [
      { label: 'Appraisals', icon: <Target size={20} />, href: '#/performance' },
      { label: 'Goals', icon: <Award size={20} />, href: '#/performance/goals' },
      { label: '360° Feedback', icon: <MessageCircle size={20} />, href: '#/performance/feedback' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { label: 'System Settings', icon: <Settings size={20} />, href: '#/settings' },
      { label: 'Reports', icon: <FileBarChart size={20} />, href: '#/reports' },
      { label: 'Audit Log', icon: <ScrollText size={20} />, href: '#/settings/audit' },
    ],
  },
];

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    const path = href.replace('#', '');
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <aside
      className={`bg-white border-r border-[#e5e7eb] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-[#f0f9f4] text-[#006938] border-l-[3px] border-[#006938]'
                      : 'text-[#6b7280] hover:bg-[#f0f9f4] border-l-[3px] border-transparent'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={active ? 'text-[#006938]' : 'text-[#6b7280]'}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#e5e7eb]">
        <a
          href="#/"
          className={`flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm font-medium text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-all ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </a>
      </div>
    </aside>
  );
}
