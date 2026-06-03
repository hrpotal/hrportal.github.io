import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/image.png';

export default function TopBar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="University of Stirling" className="w-8 h-8 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#006938] leading-tight tracking-wide">UNIVERSITY of</span>
            <span className="text-sm font-bold text-[#006938] leading-tight tracking-wide">STIRLING</span>
          </div>
        </div>
        <div className="h-6 w-px bg-[#e5e7eb] mx-1" />
        <span className="text-sm font-semibold text-[#1f2937]">HRMS</span>
      </div>

      {/* Search */}
      <div className="relative w-[420px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="Search employees, records, documents..."
          className="w-full h-9 pl-9 pr-4 bg-[#f7f8fa] border border-[#e5e7eb] rounded-md text-sm text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#006938] focus:ring-[3px] focus:ring-[rgba(0,105,56,0.08)] transition-all"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-[#f7f8fa] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-[#6b7280]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-[#e5e7eb]" />

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-[#f7f8fa] rounded-lg px-2 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#006938] text-white flex items-center justify-center text-xs font-semibold">
            SM
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium text-[#1f2937] leading-tight">Dr. Sarah Mitchell</p>
            <p className="text-xs text-[#6b7280] leading-tight">HR Director</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6b7280]" />
        </button>

        {showDropdown && (
          <div className="absolute right-6 top-14 bg-white border border-[#e5e7eb] rounded-lg shadow-xl py-1 w-48 z-50">
            <a href="#/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1f2937] hover:bg-[#f0f9f4] transition-colors">
              Profile Settings
            </a>
            <a href="#/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#1f2937] hover:bg-[#f0f9f4] transition-colors">
              Preferences
            </a>
            <div className="border-t border-[#e5e7eb] my-1" />
            <a href="#/" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
