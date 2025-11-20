interface LoadingOverlayProps {
  progress: number;
}

const LoadingOverlay = ({ progress }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md flex items-center justify-center z-10 overflow-hidden">
      {/* Sparkle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-float" style={{ top: '20%', left: '10%' }} />
        <div className="absolute w-48 h-48 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl animate-float" style={{ top: '60%', right: '15%', animationDelay: '1s' }} />
        <div className="absolute w-56 h-56 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl animate-float" style={{ bottom: '20%', left: '40%', animationDelay: '2s' }} />
      </div>

      <div className="relative text-center space-y-6 z-10">
        {/* Percentage Display */}
        <div className="relative">
          <div className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
            {Math.round(progress)}%
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-medium">
            Creating your masterpiece...
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
