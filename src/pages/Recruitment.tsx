import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Calendar, Star } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { jobOpenings, candidates, interviews, recruitmentFunnel } from '@/data/mockData';

export default function Recruitment() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'interviews' | 'onboarding'>('jobs');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const pipelineStages = [
    { name: 'New Applications', color: '#3b82f6', count: 38, sub: '12 this week' },
    { name: 'Screening', color: '#8b5cf6', count: 24, sub: 'Phone interviews' },
    { name: 'Interview', color: '#f59e0b', count: 18, sub: '6 scheduled today' },
    { name: 'Offer', color: '#10b981', count: 8, sub: '3 pending acceptance' },
    { name: 'Hired', color: '#006938', count: 5, sub: 'This month' },
  ];

  const tabs = [
    { key: 'jobs' as const, label: 'Job Openings' },
    { key: 'candidates' as const, label: 'Candidates' },
    { key: 'interviews' as const, label: 'Interview Schedule' },
    { key: 'onboarding' as const, label: 'Onboarding' },
  ];

  const filteredCandidates = stageFilter === 'All' ? candidates : candidates.filter(c => c.stage === stageFilter);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Recruitment</h1>
          <p className="text-sm text-[#6b7280]">42 open positions | 156 active candidates</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors">
            <Plus size={16} /> Post New Job
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            Candidate Database
          </button>
        </div>
      </div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {pipelineStages.map((stage, i) => (
          <div
            key={i}
            className={`bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: `${i * 80}ms`, borderTopWidth: '4px', borderTopColor: stage.color }}
            onClick={() => { setStageFilter(stage.name === 'New Applications' ? 'New Application' : stage.name); if (stage.name !== 'Hired') setActiveTab('candidates'); }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] mb-2">{stage.name}</p>
            <p className="text-3xl font-bold text-[#1f2937]">{stage.count}</p>
            <p className="text-xs text-[#6b7280] mt-1">{stage.sub}</p>
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
          {activeTab === 'jobs' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <select className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm">
                  <option>All Departments</option>
                  <option>Computing</option>
                  <option>Business</option>
                  <option>Science</option>
                </select>
                <select className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Job ID</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Title</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Type</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Posted</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Applications</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOpenings.map((job, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{job.id}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{job.title}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{job.department}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{job.type}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{job.postedDate}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#006938]">{job.applications}</td>
                        <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors"><Eye size={14} className="text-[#6b7280]" /></button>
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors"><Pencil size={14} className="text-[#6b7280]" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="h-9 px-3 border border-[#e5e7eb] rounded-md text-sm">
                  <option value="All">All Stages</option>
                  <option value="New Application">New Application</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Candidate</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Applied For</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Applied</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Stage</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Rating</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((cand, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{cand.name}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{cand.appliedFor}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{cand.department}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{cand.appliedDate}</td>
                        <td className="px-4 py-3"><StatusBadge status={cand.stage} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} className={s <= cand.rating ? 'text-amber-400 fill-amber-400' : 'text-[#e5e7eb]'} />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors"><Eye size={14} className="text-[#6b7280]" /></button>
                            <button className="p-1.5 hover:bg-[#e6f3ec] rounded-md transition-colors"><Calendar size={14} className="text-[#6b7280]" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Date</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Time</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Candidate</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Position</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Interviewers</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Type</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((int, i) => (
                      <tr key={i} className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{int.date}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{int.time}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">{int.candidate}</td>
                        <td className="px-4 py-3 text-sm text-[#1f2937]">{int.position}</td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">{int.interviewers}</td>
                        <td className="px-4 py-3"><StatusBadge status={int.type} /></td>
                        <td className="px-4 py-3"><StatusBadge status={int.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'onboarding' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#e5e7eb]">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Employee</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Position</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Department</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Start Date</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Current Step</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f3f4f6] hover:bg-[#f0f9f4] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-[#1f2937]">Dr. Omar Khalil</td>
                      <td className="px-4 py-3 text-sm text-[#1f2937]">Assistant Professor</td>
                      <td className="px-4 py-3 text-sm text-[#6b7280]">Business</td>
                      <td className="px-4 py-3 text-sm text-[#6b7280]">Jun 5, 2026</td>
                      <td className="px-4 py-3 text-sm text-[#006938]">Department Intro</td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                          <div className="bg-[#006938] h-2 rounded-full transition-all" style={{ width: '80%' }} />
                        </div>
                        <span className="text-xs text-[#6b7280] mt-0.5 inline-block">80%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recruitment Funnel */}
      <div
        className={`bg-white border border-[#e5e7eb] rounded-lg p-5 shadow-sm mt-6 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 0.5s ease-out 0.5s' }}
      >
        <h3 className="text-md font-semibold text-[#1f2937] mb-4">Q2 2026 Recruitment Funnel</h3>
        <div className="flex items-center justify-center gap-0">
          {recruitmentFunnel.map((stage, i) => (
            <div key={i} className="flex items-center">
              <div
                className="flex flex-col items-center justify-center text-white py-3 px-2 text-center"
                style={{
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#006938'][i],
                  minWidth: `${140 - i * 18}px`,
                  height: `${60 - i * 6}px`,
                  clipPath: i < recruitmentFunnel.length - 1
                    ? 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%)'
                    : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)',
                  marginLeft: i === 0 ? '0' : '-12px',
                }}
              >
                <span className="text-xs font-semibold">{stage.stage}</span>
                <span className="text-lg font-bold">{stage.count}</span>
              </div>
              {i < recruitmentFunnel.length - 1 && (
                <div className="text-[10px] text-[#6b7280] mx-1 w-10 text-center">
                  {((recruitmentFunnel[i + 1].count / stage.count) * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
