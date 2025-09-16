import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock the exercise progress functionality
const useExerciseProgress = () => {
  const markExerciseComplete = () => {
    console.log('Exercise completed!');
    // Save to localStorage or your preferred state management
    const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    if (!completedExercises.includes('quick-calm')) {
      localStorage.setItem(
        'completedExercises', 
        JSON.stringify([...completedExercises, 'quick-calm'])
      );
    }
  };

  return { markExerciseComplete };
};

export const QuickCalm = ({ onNavigate }: { onNavigate: () => void }) => {
  const backgroundImage = 'https://images.pexels.com/photos/2097628/pexels-photo-2097628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const { markExerciseComplete } = useExerciseProgress();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Exercise completed
      markExerciseComplete();
    }

    // Breathing animation timing
    const breathingTimer = setInterval(() => {
      setPhase(prev => {
        switch (prev) {
          case 'inhale': return 'hold';
          case 'hold': return 'exhale';
          case 'exhale': return 'rest';
          case 'rest': return 'inhale';
          default: return 'inhale';
        }
      });
    }, 4000); // 4-second cycle (inhale, hold, exhale, rest)

    return () => {
      clearInterval(timer);
      clearInterval(breathingTimer);
    };
  }, [isActive, timeLeft, markExerciseComplete]);

  const startExercise = () => {
    setIsActive(true);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getBreathingText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return 'Rest';
      default: return '';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Calming background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Quick Calm</h1>
        
        <div className="relative w-64 h-64 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/80 to-blue-500/80 shadow-lg flex items-center justify-center"
            animate={{
              scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
              opacity: phase === 'rest' ? 0.7 : 1,
            }}
            transition={{
              duration: 2,
              ease: phase === 'inhale' 
                ? [0.4, 0, 0.2, 1] 
                : phase === 'exhale'
                ? [0.4, 0, 0.2, 1]
                : 'linear'
            }}
          >
            <span className="text-white text-2xl font-medium">
              {getBreathingText()}
            </span>
          </motion.div>
        </div>

        <div className="text-4xl font-bold text-white mb-8">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <button
              onClick={startExercise}
              className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={resetExercise}
              className="px-6 py-3 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={onNavigate}
            className="px-6 py-3 bg-white/90 text-slate-700 rounded-full font-medium hover:bg-white transition-colors"
          >
            Back
          </button>
        </div>

        <div className="mt-8 text-center text-white/90">
          <p>Follow the breathing pattern to calm your mind.</p>
          <p className="text-sm mt-2">Inhale for 4s, hold for 4s, exhale for 4s</p>
        </div>
      </div>
    </div>
  );
};

export default QuickCalm;
