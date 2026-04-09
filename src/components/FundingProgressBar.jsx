export default function FundingProgressBar({ percent, height = 6, showLabel = false }) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: `${height}px`,
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{
            width: `${clampedPercent}%`,
            background: clampedPercent >= 100
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : clampedPercent >= 70
                ? 'linear-gradient(90deg, #6366f1, #06b6d4)'
                : 'linear-gradient(90deg, #6366f1, #818cf8)',
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1 text-right">{clampedPercent}%</p>
      )}
    </div>
  );
}
