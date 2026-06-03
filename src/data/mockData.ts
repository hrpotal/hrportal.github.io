export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'Active' | 'On Leave' | 'Terminated' | 'New Hire';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Visiting';
  avatar?: string;
  dateOfBirth?: string;
  nationality?: string;
  emiratesId?: string;
  joinDate?: string;
  contractEnd?: string;
  salary?: number;
  manager?: string;
  emergencyContact?: { name: string; relationship: string; phone: string };
}

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Remote';
  hours: number | null;
  location: string;
}

export interface LeaveRequest {
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
  employeeName: string;
  employeeId: string;
  month: string;
  grossSalary: string;
  deductions: string;
  netSalary: string;
  status: 'Paid' | 'Pending';
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  postedDate: string;
  applications: number;
  status: 'Active' | 'Closed' | 'Draft' | 'Expired';
}

export interface Candidate {
  name: string;
  appliedFor: string;
  department: string;
  appliedDate: string;
  stage: string;
  rating: number;
}

export interface Interview {
  date: string;
  time: string;
  candidate: string;
  position: string;
  interviewers: string;
  type: string;
  status: string;
}

export interface ActivityItem {
  user: string;
  avatar: string;
  action: string;
  time: string;
}

export interface Department {
  code: string;
  name: string;
  headCount: number;
  manager: string;
}

export const employees: Employee[] = [
  { id: 'ST-1001', name: 'Dr. Sarah Mitchell', email: 's.mitchell@stir.ac.uk', phone: '+971 50 123 4567', department: 'Administration', position: 'HR Director', status: 'Active', employmentType: 'Full-time', dateOfBirth: '1981-05-15', nationality: 'British', emiratesId: '784-1981-1234567-1', joinDate: '2018-09-01', salary: 45000, manager: 'Vice Chancellor' },
  { id: 'ST-1002', name: 'Prof. James Anderson', email: 'j.anderson@stir.ac.uk', phone: '+971 50 234 5678', department: 'School of Computing', position: 'Dean', status: 'Active', employmentType: 'Full-time', dateOfBirth: '1975-03-22', nationality: 'British', emiratesId: '784-1975-2345678-2', joinDate: '2018-09-01', salary: 52000, manager: 'Vice Chancellor' },
  { id: 'ST-1003', name: 'Dr. Fatima Hassan', email: 'f.hassan@stir.ac.uk', phone: '+971 50 345 6789', department: 'School of Business', position: 'Senior Lecturer', status: 'On Leave', employmentType: 'Full-time', dateOfBirth: '1988-11-08', nationality: 'Emirati', emiratesId: '784-1988-3456789-3', joinDate: '2019-01-15', salary: 32000, manager: 'Prof. James Anderson' },
  { id: 'ST-1004', name: 'Khalid Al-Farsi', email: 'k.alfarsi@stir.ac.uk', phone: '+971 50 456 7890', department: 'School of Arts', position: 'Lecturer', status: 'Active', employmentType: 'Full-time', dateOfBirth: '1987-07-19', nationality: 'Emirati', emiratesId: '784-1987-4567890-4', joinDate: '2019-08-01', salary: 28000, manager: 'Prof. James Anderson' },
  { id: 'ST-1005', name: 'Dr. Aisha Patel', email: 'a.patel@stir.ac.uk', phone: '+971 50 567 8901', department: 'School of Science', position: 'Research Fellow', status: 'Active', employmentType: 'Contract', dateOfBirth: '1990-02-14', nationality: 'Indian', emiratesId: '784-1990-5678901-5', joinDate: '2020-03-01', salary: 25000, manager: 'Prof. James Anderson' },
  { id: 'ST-1006', name: 'Robert Chen', email: 'r.chen@stir.ac.uk', phone: '+971 50 678 9012', department: 'School of Computing', position: 'IT Support', status: 'Active', employmentType: 'Full-time', dateOfBirth: '1985-09-30', nationality: 'Chinese', emiratesId: '784-1985-6789012-6', joinDate: '2019-06-15', salary: 22000, manager: 'Prof. James Anderson' },
  { id: 'ST-1007', name: 'Mary O\'Brien', email: 'm.obrien@stir.ac.uk', phone: '+971 50 789 0123', department: 'Administration', position: 'Finance Officer', status: 'Active', employmentType: 'Full-time', dateOfBirth: '1983-12-03', nationality: 'Irish', emiratesId: '784-1983-7890123-7', joinDate: '2018-11-01', salary: 30000, manager: 'Dr. Sarah Mitchell' },
  { id: 'ST-1008', name: 'Dr. Omar Khalil', email: 'o.khalil@stir.ac.uk', phone: '+971 50 890 1234', department: 'School of Business', position: 'Assistant Professor', status: 'New Hire', employmentType: 'Full-time', dateOfBirth: '1989-04-25', nationality: 'Jordanian', emiratesId: '784-1989-8901234-8', joinDate: '2026-06-05', salary: 35000, manager: 'Prof. James Anderson' },
  { id: 'ST-1009', name: 'Lisa Wong', email: 'l.wong@stir.ac.uk', phone: '+971 50 901 2345', department: 'Support Staff', position: 'Library Manager', status: 'Active', employmentType: 'Part-time', dateOfBirth: '1979-08-17', nationality: 'Malaysian', emiratesId: '784-1979-9012345-9', joinDate: '2019-02-01', salary: 15000, manager: 'Dr. Sarah Mitchell' },
  { id: 'ST-1010', name: 'Ahmed Ibrahim', email: 'a.ibrahim@stir.ac.uk', phone: '+971 50 012 3456', department: 'School of Science', position: 'Lab Technician', status: 'Terminated', employmentType: 'Contract', dateOfBirth: '1992-01-10', nationality: 'Egyptian', emiratesId: '784-1992-0123456-0', joinDate: '2021-01-10', salary: 18000, manager: 'Dr. Aisha Patel' },
];

export const attendanceRecords: AttendanceRecord[] = [
  { employeeId: 'ST-1001', employeeName: 'Dr. Sarah Mitchell', department: 'Administration', checkIn: '08:00', checkOut: '17:00', status: 'Present', hours: 9.0, location: 'On-site' },
  { employeeId: 'ST-1002', employeeName: 'Prof. James Anderson', department: 'Computing', checkIn: '07:45', checkOut: '16:30', status: 'Present', hours: 8.5, location: 'On-site' },
  { employeeId: 'ST-1003', employeeName: 'Dr. Fatima Hassan', department: 'Business', checkIn: null, checkOut: null, status: 'On Leave', hours: null, location: '—' },
  { employeeId: 'ST-1004', employeeName: 'Khalid Al-Farsi', department: 'Arts', checkIn: '09:15', checkOut: '17:00', status: 'Late', hours: 7.75, location: 'On-site' },
  { employeeId: 'ST-1005', employeeName: 'Dr. Aisha Patel', department: 'Science', checkIn: null, checkOut: null, status: 'Absent', hours: null, location: '—' },
  { employeeId: 'ST-1006', employeeName: 'Robert Chen', department: 'Computing', checkIn: '08:30', checkOut: '17:30', status: 'Present', hours: 9.0, location: 'Remote' },
  { employeeId: 'ST-1007', employeeName: 'Mary O\'Brien', department: 'Administration', checkIn: '08:00', checkOut: '16:45', status: 'Present', hours: 8.75, location: 'On-site' },
  { employeeId: 'ST-1008', employeeName: 'Dr. Omar Khalil', department: 'Business', checkIn: '08:15', checkOut: '17:00', status: 'Present', hours: 8.75, location: 'On-site' },
  { employeeId: 'ST-1009', employeeName: 'Lisa Wong', department: 'Support Staff', checkIn: '09:00', checkOut: '13:00', status: 'Present', hours: 4.0, location: 'On-site' },
  { employeeId: 'ST-1010', employeeName: 'Ahmed Ibrahim', department: 'School of Science', checkIn: null, checkOut: null, status: 'Absent', hours: null, location: '—' },
];

export const leaveRequests: LeaveRequest[] = [
  { employeeId: 'ST-1003', employeeName: 'Dr. Fatima Hassan', leaveType: 'Annual Leave', from: '2026-06-01', to: '2026-06-10', days: 10, status: 'Approved' },
  { employeeId: 'ST-1006', employeeName: 'Robert Chen', leaveType: 'Sick Leave', from: '2026-06-02', to: '2026-06-03', days: 2, status: 'Approved' },
  { employeeId: 'ST-1007', employeeName: 'Mary O\'Brien', leaveType: 'Maternity Leave', from: '2026-07-01', to: '2026-12-31', days: 184, status: 'Pending' },
  { employeeId: 'ST-1008', employeeName: 'Dr. Omar Khalil', leaveType: 'Emergency Leave', from: '2026-06-03', to: '2026-06-05', days: 3, status: 'Pending' },
  { employeeId: 'ST-1009', employeeName: 'Lisa Wong', leaveType: 'Unpaid Leave', from: '2026-06-15', to: '2026-06-30', days: 16, status: 'Pending' },
];

export const payrollRuns: PayrollRun[] = [
  { month: 'June 2026', totalAmount: 'AED 4,245,800', employees: 1186, tax: 'AED 318,435', bonuses: 'AED 125,000', status: 'Processing' },
  { month: 'May 2026', totalAmount: 'AED 4,198,500', employees: 1190, tax: 'AED 314,888', bonuses: 'AED 95,000', status: 'Completed' },
  { month: 'April 2026', totalAmount: 'AED 4,156,200', employees: 1192, tax: 'AED 311,715', bonuses: 'AED 80,000', status: 'Completed' },
  { month: 'March 2026', totalAmount: 'AED 4,120,000', employees: 1195, tax: 'AED 309,000', bonuses: 'AED 45,000', status: 'Completed' },
];

export const payslips: Payslip[] = [
  { employeeName: 'Dr. Sarah Mitchell', employeeId: 'ST-1001', month: 'May 2026', grossSalary: 'AED 45,000', deductions: 'AED 3,375', netSalary: 'AED 41,625', status: 'Paid' },
  { employeeName: 'Prof. James Anderson', employeeId: 'ST-1002', month: 'May 2026', grossSalary: 'AED 52,000', deductions: 'AED 3,900', netSalary: 'AED 48,100', status: 'Paid' },
  { employeeName: 'Dr. Fatima Hassan', employeeId: 'ST-1003', month: 'May 2026', grossSalary: 'AED 32,000', deductions: 'AED 2,400', netSalary: 'AED 29,600', status: 'Paid' },
  { employeeName: 'Khalid Al-Farsi', employeeId: 'ST-1004', month: 'May 2026', grossSalary: 'AED 28,000', deductions: 'AED 2,100', netSalary: 'AED 25,900', status: 'Paid' },
  { employeeName: 'Dr. Aisha Patel', employeeId: 'ST-1005', month: 'May 2026', grossSalary: 'AED 25,000', deductions: 'AED 1,875', netSalary: 'AED 23,125', status: 'Paid' },
];

export const jobOpenings: JobOpening[] = [
  { id: 'JR-2026-045', title: 'Senior Lecturer in AI', department: 'Computing', type: 'Full-time', postedDate: '2026-05-15', applications: 28, status: 'Active' },
  { id: 'JR-2026-046', title: 'HR Coordinator', department: 'Administration', type: 'Full-time', postedDate: '2026-05-20', applications: 15, status: 'Active' },
  { id: 'JR-2026-047', title: 'Research Assistant', department: 'Science', type: 'Contract', postedDate: '2026-05-25', applications: 8, status: 'Active' },
  { id: 'JR-2026-048', title: 'Librarian', department: 'Support Staff', type: 'Part-time', postedDate: '2026-06-01', applications: 3, status: 'Active' },
  { id: 'JR-2026-040', title: 'Professor of Finance', department: 'Business', type: 'Full-time', postedDate: '2026-04-01', applications: 42, status: 'Closed' },
];

export const candidates: Candidate[] = [
  { name: 'Ali Hassan', appliedFor: 'Senior Lecturer in AI', department: 'Computing', appliedDate: '2026-05-20', stage: 'Interview', rating: 4 },
  { name: 'Maria Garcia', appliedFor: 'HR Coordinator', department: 'Administration', appliedDate: '2026-05-28', stage: 'Screening', rating: 3 },
  { name: 'Chen Wei', appliedFor: 'Research Assistant', department: 'Science', appliedDate: '2026-05-30', stage: 'New Application', rating: 0 },
  { name: 'Noor Abdullah', appliedFor: 'Librarian', department: 'Support Staff', appliedDate: '2026-06-02', stage: 'New Application', rating: 0 },
  { name: 'David Smith', appliedFor: 'Senior Lecturer in AI', department: 'Computing', appliedDate: '2026-05-18', stage: 'Offer', rating: 5 },
];

export const interviews: Interview[] = [
  { date: '2026-06-03', time: '10:00', candidate: 'Ali Hassan', position: 'AI Lecturer', interviewers: 'Prof. Anderson, Dr. Patel', type: 'Panel', status: 'Scheduled' },
  { date: '2026-06-03', time: '14:00', candidate: 'Maria Garcia', position: 'HR Coordinator', interviewers: 'Dr. Mitchell, Mary O\'Brien', type: 'One-on-one', status: 'Scheduled' },
  { date: '2026-06-04', time: '09:00', candidate: 'Chen Wei', position: 'Research Assistant', interviewers: 'Dr. Aisha Patel', type: 'Technical', status: 'Confirmed' },
];

export const activities: ActivityItem[] = [
  { user: 'Dr. Ahmed Al-Rashid', avatar: 'AA', action: 'approved leave request from Fatima Hassan', time: '2 min ago' },
  { user: 'System', avatar: 'SY', action: 'New employee onboarded: James Wilson, Lecturer in Computing', time: '15 min ago' },
  { user: 'System', avatar: 'SY', action: 'Payroll batch #2026-06 processed successfully', time: '1 hour ago' },
  { user: 'Dr. Sarah Mitchell', avatar: 'SM', action: 'Job posting expired: Senior Research Fellow (Physics)', time: '3 hours ago' },
  { user: 'System', avatar: 'SY', action: 'Performance review cycle opened for Q2 2026', time: '5 hours ago' },
];

export const departments: Department[] = [
  { code: 'COMP', name: 'School of Computing', headCount: 234, manager: 'Prof. James Anderson' },
  { code: 'BUSI', name: 'School of Business', headCount: 278, manager: 'Dr. Fatima Hassan' },
  { code: 'ARTS', name: 'School of Arts', headCount: 186, manager: 'Khalid Al-Farsi' },
  { code: 'SCIE', name: 'School of Science', headCount: 245, manager: 'Dr. Aisha Patel' },
  { code: 'ADMIN', name: 'Administration', headCount: 156, manager: 'Dr. Sarah Mitchell' },
  { code: 'SUPP', name: 'Support Staff', headCount: 149, manager: 'Lisa Wong' },
];

export const weeklyAttendance = [
  { day: 'Mon', rate: 92 },
  { day: 'Tue', rate: 94 },
  { day: 'Wed', rate: 95 },
  { day: 'Thu', rate: 93 },
  { day: 'Fri', rate: 96 },
  { day: 'Sat', rate: 88 },
  { day: 'Sun', rate: 85 },
];

export const departmentDistribution = [
  { name: 'School of Computing', value: 234, percentage: 18 },
  { name: 'School of Business', value: 278, percentage: 22 },
  { name: 'School of Arts', value: 186, percentage: 15 },
  { name: 'School of Science', value: 245, percentage: 20 },
  { name: 'Administration', value: 156, percentage: 12 },
  { name: 'Support Staff', value: 149, percentage: 13 },
];

export const monthlyAttendance = Array.from({ length: 30 }, (_, i) => ({
  date: i + 1,
  present: Math.floor(1100 + Math.random() * 100),
  leave: Math.floor(30 + Math.random() * 20),
  absent: Math.floor(10 + Math.random() * 15),
}));

export const salaryDistribution = [
  { department: 'Computing', amount: 980000 },
  { department: 'Business', amount: 1100000 },
  { department: 'Arts', amount: 680000 },
  { department: 'Science', amount: 920000 },
  { department: 'Administration', amount: 385000 },
  { department: 'Support', amount: 180000 },
];

export const recruitmentFunnel = [
  { stage: 'Applied', count: 200 },
  { stage: 'Screening', count: 85 },
  { stage: 'Interview', count: 42 },
  { stage: 'Offer', count: 18 },
  { stage: 'Hired', count: 12 },
];

export const performanceDistribution = [
  { rating: 'Outstanding', count: 62, percentage: 5 },
  { rating: 'Exceeds', count: 187, percentage: 15 },
  { rating: 'Meets', count: 687, percentage: 55 },
  { rating: 'Developing', count: 250, percentage: 20 },
  { rating: 'Below', count: 62, percentage: 5 },
];

export const upcomingEvents = [
  { title: 'Staff Town Hall', date: 'June 10, 2026', location: 'Main Auditorium' },
  { title: 'HR Policy Training', date: 'June 12, 2026', location: 'Room 302' },
  { title: 'End of Semester Review', date: 'June 18, 2026', location: 'All Departments' },
];

export const birthdays = [
  { name: 'Sarah Mitchell', role: 'HR Director', age: 45 },
  { name: 'Khalid Al-Farsi', role: 'Lecturer, Business School', age: 38 },
];
