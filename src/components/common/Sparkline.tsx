import React from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
  gradientId: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color, 
  height = 36, 
  width = 90,
  gradientId 
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const actualHeight = height - paddingY * 2;

  // Generate coordinates
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * actualHeight;
    return { x, y };
  });

  // Generate SVG path with smooth curve
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  // Fill path closing at bottom
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative overflow-hidden shrink-0">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Endpoint glowing dot */}
        <circle 
          cx={points[points.length - 1].x} 
          cy={points[points.length - 1].y} 
          r="2.5" 
          fill={color} 
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
