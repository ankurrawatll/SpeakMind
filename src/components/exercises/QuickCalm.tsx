import { useState, useEffect } from 'react';
import type { Screen } from '../../App';

interface QuickCalmProps {
  onNavigate: (screen: Screen) => void;
}

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

export const QuickCalm = ({ onNavigate }: QuickCalmProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute timer (300 seconds)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const { markExerciseComplete } = useExerciseProgress();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Exercise completed
      markExerciseComplete();
      setIsActive(false);
      // Navigate back to meditation screen after completion
      setTimeout(() => {
        onNavigate('meditation');
      }, 2000);
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
      clearTimeout(timer);
      clearInterval(breathingTimer);
    };
  }, [isActive, timeLeft, markExerciseComplete]);

  const startExercise = () => {
    setIsActive(true);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(300);
    setPhase('inhale');
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
    <div className="min-h-screen bg-white relative pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => onNavigate('meditation')}
            className="text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Quick Calm</h1>
          <p className="text-gray-500 text-sm">5 minute breathing exercise</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col items-center">
        {/* Meditation Image Card */}
        <div className="w-full max-w-sm mb-8">
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-3xl overflow-hidden aspect-[4/3] relative">
            <img 
              src="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2" 
              alt="Meditation pose" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Breathing Instruction */}
        <div className="mb-8 text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {getBreathingText()}
          </h2>
        </div>

        {/* Timer */}
        <div className="text-6xl font-light text-gray-900 mb-12">
          {timeLeft === 0 ? 'Complete!' : formatTime(timeLeft)}
        </div>

        {/* Start Button */}
        <div className="w-full max-w-sm">
          {timeLeft === 0 ? (
            <button
              onClick={() => onNavigate('meditation')}
              className="w-full py-4 bg-green-500 text-white rounded-2xl font-semibold text-lg hover:bg-green-600 transition-colors"
            >
              Done
            </button>
          ) : !isActive ? (
            <button
              onClick={startExercise}
              className="w-full py-4 bg-purple-500 text-white rounded-2xl font-semibold text-lg hover:bg-purple-600 transition-colors"
            >
              Start
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={resetExercise}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsActive(false)}
                className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-semibold hover:bg-purple-600 transition-colors"
              >
                Pause
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickCalm;
