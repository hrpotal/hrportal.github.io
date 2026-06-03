import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/image.png';

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'staff' | 'manager'>('staff');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = '#/dashboard';
  };

  const handleMicrosoftSSO = () => {
    window.location.hash = '#/dashboard';
  };

  const stats = [
    { value: '1,248', label: 'Active Employees' },
    { value: '156', label: 'Departments' },
    { value: '98.2%', label: 'Attendance Rate' },
    { value: '42', label: 'Open Positions' },
  ];

  return (
    <div className="min-h-screen bg-[#006938] relative overflow-hidden flex flex-col">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            white 20px,
            white 21px
          )`,
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="University of Stirling" className="w-9 h-9 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight tracking-wide">UNIVERSITY of</span>
            <span className="text-sm font-bold text-white leading-tight tracking-wide">STIRLING</span>
          </div>
          <div className="h-6 w-px bg-white/30 mx-2" />
          <span className="text-xs text-white/70 tracking-wider uppercase">Ras Al Khaimah Campus</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Help & Support</a>
          <div className="h-4 w-px bg-white/30" />
          <span className="text-sm text-white font-medium">EN</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="flex flex-col items-center">
          {/* Heading */}
          <h1
            className={`text-4xl md:text-5xl font-bold text-white text-center mb-3 transition-all duration-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`}
          >
            HR Portal
          </h1>
          <p
            className={`text-lg text-white/80 text-center mb-10 transition-all duration-700 delay-100 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`}
          >
            
          </p>

          {/* Login Card */}
          <div
            className={`bg-white rounded-xl p-8 w-full max-w-[420px] shadow-2xl transition-all duration-700 delay-200 ${
              loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-96'
            }`}
          >
            {/* Tabs */}
            <div className="flex border-b border-[#e5e7eb] mb-6">
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'staff'
                    ? 'text-[#006938] border-b-2 border-[#006938]'
                    : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                Staff Login
              </button>
              <button
                onClick={() => setActiveTab('manager')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'manager'
                    ? 'text-[#006938] border-b-2 border-[#006938]'
                    : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                Manager Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1">University Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'staff' ? 'abc1@stir.ac.uk' : 'manager@stir.ac.uk'}
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#006938] focus:ring-[3px] focus:ring-[rgba(0,105,56,0.08)] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 px-3 pr-10 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#006938] focus:ring-[3px] focus:ring-[rgba(0,105,56,0.08)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-[#6b7280] hover:text-[#006938] transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#006938] text-white font-semibold rounded-lg hover:bg-[#005a30] transition-colors"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#e5e7eb]" />
              <span className="text-xs text-[#9ca3af]">or</span>
              <div className="flex-1 h-px bg-[#e5e7eb]" />
            </div>

            {/* Microsoft SSO */}
            <button
              onClick={handleMicrosoftSSO}
              className="w-full h-11 flex items-center justify-center gap-2 border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#1f2937] hover:bg-[#f7f8fa] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Sign in with Microsoft
            </button>

            {/* Sign up instructions */}
            <p className="text-center text-[11px] text-[#9ca3af] mt-4">
              Staff: <span className="text-[#6b7280]">abc1@stir.ac.uk</span> | Students: <span className="text-[#6b7280]">abc00001@students.stir.ac.uk</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div
        className={`relative z-10 bg-black/15 transition-all duration-500 delay-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 py-5 px-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-white/70 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
