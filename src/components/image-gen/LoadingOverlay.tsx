interface LoadingOverlayProps {
  progress: number;
}

const LoadingOverlay = ({ progress }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-white">{Math.round(progress)}%</div>
        
        {/* Animated shimmer effect */}
        <div className="relative w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
            style={{
              width: '50%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
          <div 
            className="absolute inset-0 bg-primary/40 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
