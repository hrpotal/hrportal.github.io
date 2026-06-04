import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppState } from '@/context/AppStateContext';

export default function AddEmployee() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 4;

  const { state, addEmployee } = useAppState();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('Emirati');
  const [gender, setGender] = useState('Male');
  const [emiratesId, setEmiratesId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [dept, setDept] = useState('School of Computing');
  const [position, setPosition] = useState('');
  const [empType, setEmpType] = useState('Full-time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [probation, setProbation] = useState('3 months');
  const [manager, setManager] = useState('Dr. Sarah Mitchell');
  const [salary, setSalary] = useState(25000);
  const [workLocation, setWorkLocation] = useState('On-site');

  const generatedId = `ST-${1000 + state.users.length + 1}`;

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = () => {
    if (!name || !email || !position || !salary) {
      alert('Please fill in all required fields.');
      return;
    }

    addEmployee({
      id: generatedId,
      name,
      email,
      phone,
      dateOfBirth: dob,
      nationality,
      emiratesId,
      department: dept,
      position,
      employmentType: empType as any,
      joinDate: startDate || new Date().toISOString().split('T')[0],
      contractEnd: endDate || undefined,
      salary: Number(salary),
      manager,
      status: 'Active'
    });

    setSubmitted(true);
    setTimeout(() => {
      window.location.hash = '#/employees';
    }, 2000);
  };

  const steps = [
    { num: 1, label: 'Personal Info' },
    { num: 2, label: 'Employment Details' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Review & Submit' },
  ];

  const documentFields = [
    { label: 'Passport Copy', required: true },
    { label: 'Emirates ID Copy', required: true },
    { label: 'Degree Certificate', required: true },
    { label: 'CV/Resume', required: false },
    { label: 'Offer Letter', required: true },
    { label: 'Medical Certificate', required: false },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <a href="#/employees" className="text-sm text-[#006938] hover:underline flex items-center gap-1">
              <ChevronLeft size={14} /> Back to Employees
            </a>
          </div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Add New Employee</h1>
          <p className="text-sm text-[#6b7280]">Complete the form below to onboard a new staff member</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="#/employees" className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#1f2937] transition-colors">
            Cancel
          </a>
          <button className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors">
            Save as Draft
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-center">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className={`flex flex-col items-center gap-1 ${s.num <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  s.num < step ? 'bg-[#006938] text-white' :
                  s.num === step ? 'bg-white border-2 border-[#006938] text-[#006938]' :
                  'bg-white border-2 border-[#e5e7eb] text-[#9ca3af]'
                }`}>
                  {s.num < step ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-[11px] font-medium ${s.num <= step ? 'text-[#1f2937]' : 'text-[#9ca3af]'}`}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-2 ${s.num < step ? 'bg-[#006938]' : 'bg-[#e5e7eb]'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className={`bg-white border border-[#e5e7eb] rounded-lg shadow-sm p-6 max-w-4xl mx-auto ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transition: 'all 0.4s ease-out' }}>
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1f2937] mb-2">Employee Onboarded Successfully!</h3>
            <p className="text-sm text-[#6b7280]">{name} (ID: {generatedId}) has been added to the system. Redirecting...</p>
          </div>
        ) : (
          <>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Personal Information</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@stir.ac.uk" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 XXX XXXX" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Date of Birth</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Nationality</label>
                    <select value={nationality} onChange={e => setNationality(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>Emirati</option>
                      <option>British</option>
                      <option>Indian</option>
                      <option>Pakistani</option>
                      <option>Jordanian</option>
                      <option>Egyptian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Emirates ID</label>
                    <input type="text" value={emiratesId} onChange={e => setEmiratesId(e.target.value)} placeholder="784-XXXX-XXXXXXX-X" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Passport Number</label>
                    <input type="text" value={passportNumber} onChange={e => setPassportNumber(e.target.value)} placeholder="Enter passport number" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Marital Status</label>
                    <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Address</label>
                    <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter residential address" className="w-full px-3 py-2 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Emergency Contact Name</label>
                    <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Contact name" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Emergency Contact Phone</label>
                    <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+971 50 XXX XXXX" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Employment Details</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Employee ID (Auto-Generated)</label>
                    <input type="text" value={generatedId} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm bg-[#f7f8fa]" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Department <span className="text-red-500">*</span></label>
                    <select value={dept} onChange={e => setDept(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>School of Computing</option>
                      <option>School of Business</option>
                      <option>School of Arts</option>
                      <option>School of Science</option>
                      <option>Administration</option>
                      <option>Support Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Position <span className="text-red-500">*</span></label>
                    <input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g., Senior Lecturer" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Employment Type <span className="text-red-500">*</span></label>
                    <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Visiting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Contract Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Contract End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Probation Period</label>
                    <select value={probation} onChange={e => setProbation(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Reporting Manager</label>
                    <select value={manager} onChange={e => setManager(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>Dr. Sarah Mitchell</option>
                      <option>Prof. James Anderson</option>
                      <option>Dr. Fatima Hassan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Salary (AED) <span className="text-red-500">*</span></label>
                    <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} placeholder="e.g., 35000" className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-1">Work Location</label>
                    <select value={workLocation} onChange={e => setWorkLocation(e.target.value)} className="w-full h-10 px-3 border border-[#e5e7eb] rounded-md text-sm focus:outline-none focus:border-[#006938]">
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {documentFields.map((doc, i) => (
                    <div key={i} className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-6 text-center hover:border-[#006938] hover:bg-[#f0f9f4] transition-colors cursor-pointer">
                      <Upload size={24} className="mx-auto mb-2 text-[#9ca3af]" />
                      <p className="text-sm font-medium text-[#1f2937]">{doc.label}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">PDF/JPG, max 5MB</p>
                      {doc.required && <span className="text-[10px] text-red-500 mt-1 inline-block">Required</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-[#1f2937] mb-5">Review & Submit</h3>
                <div className="space-y-5">
                  <div className="bg-[#f7f8fa] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-[#1f2937]">Personal Information</h4>
                      <button onClick={() => setStep(1)} className="text-xs text-[#006938] hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-[#6b7280]">Name:</span> <span className="text-[#1f2937] font-semibold">{name || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Email:</span> <span className="text-[#1f2937] font-semibold">{email || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Phone:</span> <span className="text-[#1f2937]">{phone || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Nationality:</span> <span className="text-[#1f2937]">{nationality || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Emirates ID:</span> <span className="text-[#1f2937]">{emiratesId || '—'}</span></div>
                    </div>
                  </div>
                  <div className="bg-[#f7f8fa] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-[#1f2937]">Employment Details</h4>
                      <button onClick={() => setStep(2)} className="text-xs text-[#006938] hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-[#6b7280]">Department:</span> <span className="text-[#1f2937]">{dept || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Position:</span> <span className="text-[#1f2937]">{position || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Type:</span> <span className="text-[#1f2937]">{empType || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Start Date:</span> <span className="text-[#1f2937]">{startDate || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Salary:</span> <span className="text-[#1f2937] font-semibold">AED {salary?.toLocaleString() || '—'}</span></div>
                      <div><span className="text-[#6b7280]">Manager:</span> <span className="text-[#1f2937]">{manager || '—'}</span></div>
                    </div>
                  </div>
                  <div className="bg-[#f7f8fa] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-[#1f2937]">Documents</h4>
                      <button onClick={() => setStep(3)} className="text-xs text-[#006938] hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-[#6b7280]">Will upload required documents post onboarding.</p>
                  </div>

                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" required className="mt-0.5 rounded border-[#e5e7eb]" />
                    <span className="text-[#6b7280]">I confirm all information is accurate and the employee is authorized to work at the University of Stirling.</span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#e5e7eb]">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] text-[#1f2937] rounded-lg text-sm font-medium hover:bg-[#f7f8fa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-[#006938] text-white rounded-lg text-sm font-medium hover:bg-[#005a30] transition-colors"
                >
                  Complete Onboarding
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
