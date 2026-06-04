import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'staff' | 'hr';
  password?: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: 'Active' | 'On Leave' | 'Terminated' | 'New Hire';
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Visiting';
  salary?: number;
  joinDate?: string;
  contractEnd?: string;
  dateOfBirth?: string;
  nationality?: string;
  emiratesId?: string;
  manager?: string;
}

export interface AttendanceRecord {
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Remote' | 'Half-day';
  hours: number | null;
  location: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayrollRun {
  month: string;
  totalAmount: string;
  employees: number;
  tax: string;
  bonuses: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface Payslip {
  id: string;
  employeeName: string;
  employeeId: string;
  month: string;
  grossSalary: string;
  deductions: string;
  netSalary: string;
  status: 'Paid' | 'Pending';
}

export interface DocumentRecord {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  fileData: string; // base64
}

export interface AppState {
  users: User[];
  session: { userId: string; role: 'staff' | 'hr' } | null;
  attendance: {
    [userId: string]: {
      [date: string]: AttendanceRecord;
    };
  };
  leaves: LeaveRequest[];
  payroll: {
    salaries: { [userId: string]: number };
    runs: PayrollRun[];
    payslips: Payslip[];
  };
  documents: {
    [userId: string]: DocumentRecord[];
  };
}

interface AppStateContextType {
  state: AppState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  markAttendance: (userId: string, date: string, status: AttendanceRecord['status'], checkIn?: string, checkOut?: string) => boolean;
  createLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected') => void;
  updateSalary: (userId: string, salary: number) => void;
  processPayrollRun: (month: string) => void;
  uploadDocument: (userId: string, name: string, fileData: string, size: string) => void;
  deleteDocument: (userId: string, docId: string) => void;
  addEmployee: (employee: Omit<User, 'role' | 'password'>) => void;
  deleteEmployee: (employeeId: string) => void;
  updateEmployee: (employee: User) => void;
}

const LOCAL_STORAGE_KEY = 'hrms_app_state';

const defaultUsers: User[] = [
  { id: "staff1", name: "Staff 1", role: "staff", password: "1234", email: "staff1@stir.ac.uk", phone: "+971 50 234 5678", department: "School of Computing", position: "Dean", status: "Active", employmentType: "Full-time", dateOfBirth: "1975-03-22", nationality: "British", emiratesId: "784-1975-2345678-2", joinDate: "2018-09-01", salary: 52000, manager: "Vice Chancellor" },
  { id: "staff2", name: "Staff 2", role: "staff", password: "1234", email: "staff2@stir.ac.uk", phone: "+971 50 345 6789", department: "School of Business", position: "Senior Lecturer", status: "Active", employmentType: "Full-time", dateOfBirth: "1988-11-08", nationality: "Emirati", emiratesId: "784-1988-3456789-3", joinDate: "2019-01-15", salary: 32000, manager: "Prof. James Anderson" },
  { id: "hr", name: "HR Admin", role: "hr", password: "1234", email: "hr@stir.ac.uk", phone: "+971 50 123 4567", department: "Administration", position: "HR Director", status: "Active", employmentType: "Full-time", dateOfBirth: "1981-05-15", nationality: "British", emiratesId: "784-1981-1234567-1", joinDate: "2018-09-01", salary: 45000, manager: "Vice Chancellor" },
  // Additional mock employees from database to populate view
  { id: "ST-1004", name: "Khalid Al-Farsi", role: "staff", password: "1234", email: "k.alfarsi@stir.ac.uk", phone: "+971 50 456 7890", department: "School of Arts", position: "Lecturer", status: "Active", employmentType: "Full-time", dateOfBirth: "1987-07-19", nationality: "Emirati", emiratesId: "784-1987-4567890-4", joinDate: "2019-08-01", salary: 28000, manager: "Prof. James Anderson" },
  { id: "ST-1005", name: "Dr. Aisha Patel", role: "staff", password: "1234", email: "a.patel@stir.ac.uk", phone: "+971 50 567 8901", department: "School of Science", position: "Research Fellow", status: "Active", employmentType: "Contract", dateOfBirth: "1990-02-14", nationality: "Indian", emiratesId: "784-1990-5678901-5", joinDate: "2020-03-01", salary: 25000, manager: "Prof. James Anderson" },
  { id: "ST-1006", name: "Robert Chen", role: "staff", password: "1234", email: "r.chen@stir.ac.uk", phone: "+971 50 678 9012", department: "School of Computing", position: "IT Support", status: "Active", employmentType: "Full-time", dateOfBirth: "1985-09-30", nationality: "Chinese", emiratesId: "784-1985-6789012-6", joinDate: "2019-06-15", salary: 22000, manager: "Prof. James Anderson" },
  { id: "ST-1007", name: "Mary O'Brien", role: "staff", password: "1234", email: "m.obrien@stir.ac.uk", phone: "+971 50 789 0123", department: "Administration", position: "Finance Officer", status: "Active", employmentType: "Full-time", dateOfBirth: "1983-12-03", nationality: "Irish", emiratesId: "784-1983-7890123-7", joinDate: "2018-11-01", salary: 30000, manager: "Dr. Sarah Mitchell" },
  { id: "ST-1008", name: "Dr. Omar Khalil", role: "staff", password: "1234", email: "o.khalil@stir.ac.uk", phone: "+971 50 890 1234", department: "School of Business", position: "Assistant Professor", status: "New Hire", employmentType: "Full-time", dateOfBirth: "1989-04-25", nationality: "Jordanian", emiratesId: "784-1989-8901234-8", joinDate: "2026-06-05", salary: 35000, manager: "Prof. James Anderson" },
  { id: "ST-1009", name: "Lisa Wong", role: "staff", password: "1234", email: "l.wong@stir.ac.uk", phone: "+971 50 901 2345", department: "Support Staff", position: "Library Manager", status: "Active", employmentType: "Part-time", dateOfBirth: "1979-08-17", nationality: "Malaysian", emiratesId: "784-1979-9012345-9", joinDate: "2019-02-01", salary: 15000, manager: "Dr. Sarah Mitchell" },
  { id: "ST-1010", name: "Ahmed Ibrahim", role: "staff", password: "1234", email: "a.ibrahim@stir.ac.uk", phone: "+971 50 012 3456", department: "School of Science", position: "Lab Technician", status: "Terminated", employmentType: "Contract", dateOfBirth: "1992-01-10", nationality: "Egyptian", emiratesId: "784-1992-0123456-0", joinDate: "2021-01-10", salary: 18000, manager: "Dr. Aisha Patel" },
];

const initialAttendance: AppState['attendance'] = {
  staff1: {
    '2026-06-03': { checkIn: '07:45', checkOut: '16:30', status: 'Present', hours: 8.5, location: 'On-site' },
    '2026-06-02': { checkIn: '08:00', checkOut: '17:00', status: 'Present', hours: 9.0, location: 'On-site' }
  },
  staff2: {
    '2026-06-03': { checkIn: null, checkOut: null, status: 'On Leave', hours: null, location: '—' }
  },
  hr: {
    '2026-06-03': { checkIn: '08:00', checkOut: '17:00', status: 'Present', hours: 9.0, location: 'On-site' }
  },
  'ST-1004': {
    '2026-06-03': { checkIn: '09:15', checkOut: '17:00', status: 'Late', hours: 7.75, location: 'On-site' }
  },
  'ST-1005': {
    '2026-06-03': { checkIn: null, checkOut: null, status: 'Absent', hours: null, location: '—' }
  },
  'ST-1006': {
    '2026-06-03': { checkIn: '08:30', checkOut: '17:30', status: 'Present', hours: 9.0, location: 'Remote' }
  },
  'ST-1007': {
    '2026-06-03': { checkIn: '08:00', checkOut: '16:45', status: 'Present', hours: 8.75, location: 'On-site' }
  },
  'ST-1008': {
    '2026-06-03': { checkIn: '08:15', checkOut: '17:00', status: 'Present', hours: 8.75, location: 'On-site' }
  },
  'ST-1009': {
    '2026-06-03': { checkIn: '09:00', checkOut: '13:00', status: 'Present', hours: 4.0, location: 'On-site' }
  },
  'ST-1010': {
    '2026-06-03': { checkIn: null, checkOut: null, status: 'Absent', hours: null, location: '—' }
  }
};

const initialLeaves: LeaveRequest[] = [
  { id: '1', employeeId: 'staff2', employeeName: 'Staff 2', leaveType: 'Annual Leave', from: '2026-06-01', to: '2026-06-10', days: 10, status: 'Approved' },
  { id: '2', employeeId: 'ST-1006', employeeName: 'Robert Chen', leaveType: 'Sick Leave', from: '2026-06-02', to: '2026-06-03', days: 2, status: 'Approved' },
  { id: '3', employeeId: 'ST-1007', employeeName: 'Mary O\'Brien', leaveType: 'Maternity Leave', from: '2026-07-01', to: '2026-12-31', days: 184, status: 'Pending' },
  { id: '4', employeeId: 'ST-1008', employeeName: 'Dr. Omar Khalil', leaveType: 'Emergency Leave', from: '2026-06-03', to: '2026-06-05', days: 3, status: 'Pending' },
  { id: '5', employeeId: 'ST-1009', employeeName: 'Lisa Wong', leaveType: 'Unpaid Leave', from: '2026-06-15', to: '2026-06-30', days: 16, status: 'Pending' },
];

const initialPayroll: AppState['payroll'] = {
  salaries: {
    staff1: 52000,
    staff2: 32000,
    hr: 45000,
    'ST-1004': 28000,
    'ST-1005': 25000,
    'ST-1006': 22000,
    'ST-1007': 30000,
    'ST-1008': 35000,
    'ST-1009': 15000,
    'ST-1010': 18000,
  },
  runs: [
    { month: 'May 2026', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 5,000', status: 'Completed' },
    { month: 'April 2026', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 0', status: 'Completed' },
    { month: 'March 2026', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 0', status: 'Completed' },
    { month: 'February 2026', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 0', status: 'Completed' },
    { month: 'January 2026', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 0', status: 'Completed' },
    { month: 'December 2025', totalAmount: 'AED 307,000', employees: 10, tax: 'AED 23,025', bonuses: 'AED 0', status: 'Completed' },
  ],
  payslips: [
    { id: '1', employeeName: 'HR Admin', employeeId: 'hr', month: 'May 2026', grossSalary: 'AED 45,000', deductions: 'AED 3,375', netSalary: 'AED 41,625', status: 'Paid' },
    { id: '2', employeeName: 'Staff 1', employeeId: 'staff1', month: 'May 2026', grossSalary: 'AED 52,000', deductions: 'AED 3,900', netSalary: 'AED 48,100', status: 'Paid' },
    { id: '3', employeeName: 'Staff 2', employeeId: 'staff2', month: 'May 2026', grossSalary: 'AED 32,000', deductions: 'AED 2,400', netSalary: 'AED 29,600', status: 'Paid' },
    { id: '4', employeeName: 'Khalid Al-Farsi', employeeId: 'ST-1004', month: 'May 2026', grossSalary: 'AED 28,000', deductions: 'AED 2,100', netSalary: 'AED 25,900', status: 'Paid' },
    { id: '5', employeeName: 'Dr. Aisha Patel', employeeId: 'ST-1005', month: 'May 2026', grossSalary: 'AED 25,000', deductions: 'AED 1,875', netSalary: 'AED 23,125', status: 'Paid' },
  ]
};

const initialAppState: AppState = {
  users: defaultUsers,
  session: null,
  attendance: initialAttendance,
  leaves: initialLeaves,
  payroll: initialPayroll,
  documents: {
    staff1: [
      { id: 'doc1', name: 'Degree_Certificate.pdf', uploadedAt: '2026-05-10', size: '1.2 MB', fileData: 'data:application/pdf;base64,JVBER...' },
      { id: 'doc2', name: 'Emirates_ID.jpg', uploadedAt: '2026-05-10', size: '420 KB', fileData: 'data:image/jpeg;base64,/9j/4AAQ...' }
    ],
    staff2: [
      { id: 'doc3', name: 'Passport_Scan.pdf', uploadedAt: '2026-05-12', size: '2.1 MB', fileData: 'data:application/pdf;base64,JVBER...' }
    ],
    hr: []
  }
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const hydrated = saved ? JSON.parse(saved) : initialAppState;
    
    // Check sessionStorage for session
    const sessionSaved = sessionStorage.getItem('session');
    if (sessionSaved) {
      hydrated.session = JSON.parse(sessionSaved);
    }
    return hydrated;
  });

  useEffect(() => {
    // Sync session to sessionStorage
    if (state.session) {
      sessionStorage.setItem('session', JSON.stringify(state.session));
    } else {
      sessionStorage.removeItem('session');
    }
    
    // Sync to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (username: string, password: string): boolean => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanId = cleanUsername.endsWith('@stir.ac.uk') 
      ? cleanUsername.split('@')[0]
      : cleanUsername;

    const matchedUser = state.users.find(u => u.id.toLowerCase() === cleanId && u.password === password);
    if (matchedUser) {
      const sessionObj = { userId: matchedUser.id, role: matchedUser.role };
      setState(prev => ({
        ...prev,
        session: sessionObj
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      session: null
    }));
  };

  const markAttendance = (
    userId: string,
    date: string,
    status: AttendanceRecord['status'],
    checkIn?: string,
    checkOut?: string
  ): boolean => {
    const userAttendance = state.attendance[userId] || {};
    if (userAttendance[date] && userAttendance[date].status !== 'Absent') {
      // Prevent duplicate marking if present or late already
      return false;
    }

    const calculatedHours = status === 'Present' || status === 'Remote' || status === 'Late'
      ? 9.0 
      : status === 'Half-day' 
      ? 4.5 
      : null;

    const record: AttendanceRecord = {
      checkIn: checkIn || (status === 'Absent' || status === 'On Leave' ? null : '08:30'),
      checkOut: checkOut || (status === 'Absent' || status === 'On Leave' ? null : '17:30'),
      status,
      hours: calculatedHours,
      location: status === 'Remote' ? 'Remote' : (status === 'Absent' || status === 'On Leave' ? '—' : 'On-site')
    };

    setState(prev => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [userId]: {
          ...prev.attendance[userId],
          [date]: record
        }
      }
    }));
    return true;
  };

  const createLeaveRequest = (leave: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...leave,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending'
    };
    setState(prev => ({
      ...prev,
      leaves: [newRequest, ...prev.leaves]
    }));
  };

  const updateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected') => {
    setState(prev => {
      const leaves = prev.leaves.map(req => {
        if (req.id === leaveId) {
          // If approved, update the attendance status on those dates automatically!
          if (status === 'Approved') {
            // Calculate date list between from and to
            const start = new Date(req.from);
            const end = new Date(req.to);
            const attendanceUpdates = { ...prev.attendance };
            const userAttendance = attendanceUpdates[req.employeeId] || {};

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              userAttendance[dateStr] = {
                checkIn: null,
                checkOut: null,
                status: 'On Leave',
                hours: null,
                location: '—'
              };
            }
            attendanceUpdates[req.employeeId] = userAttendance;
            prev.attendance = attendanceUpdates;
          }
          return { ...req, status };
        }
        return req;
      });
      return { ...prev, leaves };
    });
  };

  const updateSalary = (userId: string, salary: number) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, salary } : u),
      payroll: {
        ...prev.payroll,
        salaries: {
          ...prev.payroll.salaries,
          [userId]: salary
        }
      }
    }));
  };

  const processPayrollRun = (month: string) => {
    setState(prev => {
      // Check if already processed
      if (prev.payroll.runs.some(run => run.month === month && run.status === 'Completed')) {
        return prev;
      }

      // Compute totals
      let totalAmountNum = 0;
      let totalTaxNum = 0;
      const newPayslips: Payslip[] = [];

      prev.users.forEach(user => {
        if (user.status === 'Terminated') return;
        const gross = prev.payroll.salaries[user.id] || user.salary || 10000;
        const tax = Math.round(gross * 0.075);
        const net = gross - tax;
        totalAmountNum += gross;
        totalTaxNum += tax;

        newPayslips.push({
          id: Math.random().toString(36).substr(2, 9),
          employeeName: user.name,
          employeeId: user.id,
          month,
          grossSalary: `AED ${gross.toLocaleString()}`,
          deductions: `AED ${tax.toLocaleString()}`,
          netSalary: `AED ${net.toLocaleString()}`,
          status: 'Paid'
        });
      });

      const newRun: PayrollRun = {
        month,
        totalAmount: `AED ${totalAmountNum.toLocaleString()}`,
        employees: newPayslips.length,
        tax: `AED ${totalTaxNum.toLocaleString()}`,
        bonuses: 'AED 0',
        status: 'Completed'
      };

      // Filter out existing runs of this month to overwrite or just prepend
      const filteredRuns = prev.payroll.runs.filter(run => run.month !== month);

      return {
        ...prev,
        payroll: {
          ...prev.payroll,
          runs: [newRun, ...filteredRuns],
          payslips: [...newPayslips, ...prev.payroll.payslips]
        }
      };
    });
  };

  const uploadDocument = (userId: string, name: string, fileData: string, size: string) => {
    const newDoc: DocumentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      uploadedAt: new Date().toISOString().split('T')[0],
      size,
      fileData
    };
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [userId]: [newDoc, ...(prev.documents[userId] || [])]
      }
    }));
  };

  const deleteDocument = (userId: string, docId: string) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [userId]: (prev.documents[userId] || []).filter(doc => doc.id !== docId)
      }
    }));
  };

  const addEmployee = (employee: Omit<User, 'role' | 'password'>) => {
    const newUser: User = {
      ...employee,
      role: 'staff',
      password: '1234',
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      payroll: {
        ...prev.payroll,
        salaries: {
          ...prev.payroll.salaries,
          [newUser.id]: newUser.salary || 15000
        }
      }
    }));
  };

  const deleteEmployee = (employeeId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== employeeId)
    }));
  };

  const updateEmployee = (employee: User) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === employee.id ? employee : u),
      payroll: {
        ...prev.payroll,
        salaries: {
          ...prev.payroll.salaries,
          [employee.id]: employee.salary || 15000
        }
      }
    }));
  };

  return (
    <AppStateContext.Provider value={{
      state,
      login,
      logout,
      markAttendance,
      createLeaveRequest,
      updateLeaveStatus,
      updateSalary,
      processPayrollRun,
      uploadDocument,
      deleteDocument,
      addEmployee,
      deleteEmployee,
      updateEmployee
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
