'use client';

export function ScoreRing({ score }: { score: number }) {
  // Color calculation based on score
  let strokeColor = '#34c759'; // success green
  let glowColor = 'rgba(52, 199, 89, 0.15)';
  let textColor = 'text-success';

  if (score < 60) {
    strokeColor = '#ff3b30'; // danger red
    glowColor = 'rgba(255, 59, 48, 0.15)';
    textColor = 'text-danger';
  } else if (score < 80) {
    strokeColor = '#ff9f0a'; // warning amber
    glowColor = 'rgba(255, 159, 10, 0.15)';
    textColor = 'text-warning';
  }

  const radius = 46;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      {/* Glow background */}
      <div
        className="absolute inset-2 rounded-full animate-pulse-glow"
        style={{ boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` }}
      />

      {/* SVG Ring */}
      <svg className="absolute w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          className="text-[#f5f5f7]"
        />
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-bold tracking-tighter ${textColor}`}>{score}</span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted">Score</span>
      </div>
    </div>
  );
}
