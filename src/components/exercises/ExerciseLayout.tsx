import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

type ExerciseLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage: string;
  overlayColor: string;
  onBack: () => void; // Make this required since we're not using react-router
};

export const ExerciseLayout = ({
  children,
  title,
  subtitle,
  backgroundImage,
  overlayColor,
  onBack,
}: ExerciseLayoutProps) => {

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-linen to-serenity relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${overlayColor} opacity-70`} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 pb-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Go back"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-white/80 text-sm -mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-24">{children}</main>
      </div>
    </div>
  );
};

// DailyProgressBar component removed - implement this separately if needed
