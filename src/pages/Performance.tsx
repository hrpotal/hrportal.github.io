import { useState, useEffect } from 'react';
import { Target, Bell } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { performanceDistribution } from '@/data/mockData';

export default function Performance() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'appraisals' | 'goals' | 'feedback'>('appraisals');
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    const timer = setTimeout(() => setProgressValue(78), 500);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { key: 'appraisals' as const, label: 'Appraisals' },
    { key: 'goals' as const, label: 'Goals' },
    { key: 'feedback' as const, label: '360° Feedback' },
  ];

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  const ratingColors: Record<string, string> = {
    Outstanding: '#006938',
    Exceeds: '#059669',
    Meets: '#3b82f6',
    Developing: '#f59e0b',
    Below: '#ef4444',
  };

  const appraisals = [
    { employee: 'Dr. Sarah Mitchell', id: 'ST-1001', department: 'Administration', reviewer: '—', selfRating: 4.5, managerRating: 0, status: 'Pending Self' as const },
    { employee: 'Prof. James Anderson', id: 'ST-1002', department: 'Computing', reviewer: 'Dr. Mitchell', selfRating: 4.0, managerRating: 4.5, status: 'Under Review' as const },
    { employee: 'Dr. Fatima Hassan', id: 'ST-1003', department: 'Business', reviewer: 'Prof. Anderson', selfRating: 4.0, managerRating: 4.0, status: 'Completed' as const },
    { employee: 'Khalid Al-Farsi', id: 'ST-1004', department: 'Arts', reviewer: 'Dr. Patel', selfRating: 0, managerRating: 0, status: 'Not Started' as const },
    { employee: 'Dr. Aisha Patel', id: 'ST-1005', department: 'Science', reviewer: 'Prof. Anderson', selfRating: 3.5, managerRating: 0, status: 'Pending Manager' as const },
  ];

  const goals = [
    { goal: 'Publish 3 research papers', owner: 'Prof. Anderson', department: 'Computing', target: '3 papers', progress: 67, dueDate: 'Dec 2026', status: 'On Track' as const },
    { goal: 'Student satisfaction ≥ 4.2', owner: 'Dr. Hassan', department: 'Business', target: '4.2/5', progress: 80, dueDate: 'Jun 2026', status: 'At Risk' as const },
    { goal: 'Reduce attrition to <5%', owner: 'Dr. Mitchell', department: 'HR', target: '5%', progress: 60, dueDate: 'Dec 2026', status: 'At Risk' as const },
    { goal: 'New course development', owner: 'Khalid Al-Farsi', department: 'Arts', target: '2 courses', progress: 100, dueDate: 'Jun 2026', status: 'Completed' as const },
  ];

  const feedback360 = [
    { employee: 'Prof. James Anderson', department: 'Computing', peersRequested: 8, peersResponded: 6, directReports: 5, managers: 1, completion: 75 },
    { employee: 'Dr. Sarah Mitchell', department: 'Administration', peersRequested: 6, peersResponded: 4, directReports: 3, managers: 1, completion: 67 },
    { employee: 'Dr. Fatima Hassan', department: 'Business', peersRequested: 7, peersResponded: 7, directReports: 4, managers: 1, completion: 100 },
  ];

  const renderStars = (rating: number) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full inline-block ${
            i <= Math.round(rating) ? (rating >= 4 ? 'bg-emerald-500' : rating >= 3 ? 'bg-amber-400' : 'bg-red-400') : 'bg-[#e5e7eb]'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Performance Management</h1>
          <p className="text-sm text-[#6b7280]">Q2 2026 Review Cycle — {progressValue}% completion</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors">
            <Target size={16} /> Start New Cycle
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            Review Settings
          </button>
        </div>
      </div>

      {/* Cycle Progress */}
      <div
        className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm mb-6 flex items-center gap-8 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 0.5s ease-out' }}
      >
        {/* Progress Circle */}
        <div className="relative w-[120px] h-[120px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="#006938" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#1f2937]">{progressValue}%</span>
            <span className="text-[10px] text-[#6b7280]">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 flex-1">
          <div className="text-center p-3 bg-[#f7f8fa] rounded-lg">
            <p className="text-lg font-semibold text-[#1f2937]">245/312</p>
            <p className="text-xs text-[#6b7280]">Self Reviews (78%)</p>
          </div>
          <div className="text-center p-3 bg-[#f7f8fa] rounded-lg">
            <p className="text-lg font-semibold text-[#1f2937]">198/312</p>
            <p className="text-xs text-[#6b7280]">Manager Reviews (63%)</p>
          </div>
          <div className="text-center p-3 bg-[#f7f8fa] rounded-lg">
            <p className="text-lg font-semibold text-[#1f2937]">156/312</p>
            <p className="text-xs text-[#6b7280]">360° Feedback (50%)</p>
          </div>
          <div className="text-center p-3 bg-[#f7f8fa] rounded-lg">
            <p className="text-lg font-semibold text-[#1f2937]">89/312</p>
            <p className="text-xs text-[#6b7280]">Calibration (29%)</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm text-red-500 font-medium">Cycle closes: June 30, 2026</p>
          <p className="text-xs text-[#6b7280]">27 days remaining</p>
        </div>
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
          {activeTab === 'appraisals' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Reviewer</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Self Rating</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Manager Rating</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appraisals.map((app, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{app.employee}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{app.id}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{app.department}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{app.reviewer}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {app.selfRating > 0 && renderStars(app.selfRating)}
                            {app.selfRating > 0 && <span className="text-xs text-[#6b7280] ml-1">{app.selfRating}/5</span>}
                            {app.selfRating === 0 && <span className="text-xs text-[#9ca3af]">Pending</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {app.managerRating > 0 && renderStars(app.managerRating)}
                            {app.managerRating > 0 && <span className="text-xs text-[#6b7280] ml-1">{app.managerRating}/5</span>}
                            {app.managerRating === 0 && <span className="text-xs text-[#9ca3af]">Pending</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#006938] hover:bg-[#f0f9f4] rounded-md transition-colors">
                            <Bell size={12} /> Remind
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Goal</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Owner</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Target</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Progress</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Due Date</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{goal.goal}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{goal.owner}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{goal.department}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{goal.target}</td>
                        <td className="px-4 py-3">
                          <div className="w-24 bg-[#e5e7eb] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                goal.progress >= 80 ? 'bg-emerald-500' : goal.progress >= 50 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6b7280]">{goal.progress}%</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{goal.dueDate}</td>
                        <td className="px-4 py-3"><StatusBadge status={goal.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Peers Requested</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Peers Responded</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Direct Reports</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Managers</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback360.map((fb, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{fb.employee}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{fb.department}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{fb.peersRequested}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{fb.peersResponded}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{fb.directReports}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{fb.managers}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#e5e7eb] rounded-full h-2">
                              <div className="bg-[#006938] h-2 rounded-full transition-all" style={{ width: `${fb.completion}%` }} />
                            </div>
                            <span className="text-xs text-[#6b7280]">{fb.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Distribution Chart */}
      <div
        className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm mt-6 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 0.5s ease-out 0.6s' }}
      >
        <h3 className="text-md font-semibold text-[#1f2937] mb-4">Performance Rating Distribution — Q2 2026</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={performanceDistribution}>
            <CartesianGrid strokeDasharray="none" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="rating" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              formatter={(value: number) => [`${value} employees`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
              {performanceDistribution.map((entry, i) => (
                <Cell key={i} fill={ratingColors[entry.rating] || '#006938'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
