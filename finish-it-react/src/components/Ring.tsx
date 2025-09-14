import React from 'react';

interface RingProps {
  remainingTime: number;
  initialMinutes: number;
  status: 'pending' | 'active' | 'done' | 'failed';
}

const Ring: React.FC<RingProps> = ({ remainingTime, initialMinutes, status }) => {
  const totalTime = initialMinutes * 60 * 1000;
  const progress = remainingTime / totalTime;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  let color = 'text-green-400';
  if (progress < 0.5) color = 'text-yellow-400';
  if (progress < 0.25) color = 'text-red-500';
  if (status === 'failed') color = 'text-bad';
  if (status === 'done') color = 'text-good';

  const seconds = Math.ceil(remainingTime / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${color}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute text-xl font-bold">
        {display}
      </div>
    </div>
  );
};

export default Ring;