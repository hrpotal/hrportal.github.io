interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-amber-50 text-amber-700 border-amber-200',
  Terminated: 'bg-red-50 text-red-700 border-red-200',
  'New Hire': 'bg-blue-50 text-blue-700 border-blue-200',
  Pending: 'bg-gray-50 text-gray-600 border-gray-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Late: 'bg-amber-50 text-amber-700 border-amber-200',
  Absent: 'bg-red-50 text-red-700 border-red-200',
  Remote: 'bg-purple-50 text-purple-700 border-purple-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed: 'bg-gray-50 text-gray-600 border-gray-200',
  Draft: 'bg-blue-50 text-blue-700 border-blue-200',
  Expired: 'bg-red-50 text-red-700 border-red-200',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  'Not Started': 'bg-gray-50 text-gray-600 border-gray-200',
  'Pending Self': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending Manager': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium border rounded-full ${sizeClasses} ${style}`}>
      {status}
    </span>
  );
}
