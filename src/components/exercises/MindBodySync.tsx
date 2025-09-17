import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExerciseLayout } from './ExerciseLayout';
import type { Screen } from '../../App';

interface MindBodySyncProps {
  onNavigate: (screen: Screen) => void;
}

// Mock the exercise progress functionality
const useExerciseProgress = () => {
  const completeExercise = (exerciseId: string) => {
    console.log(`Exercise ${exerciseId} completed!`);
    // Save to localStorage or your preferred state management
    const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    if (!completedExercises.includes(exerciseId)) {
      localStorage.setItem(
        'completedExercises', 
        JSON.stringify([...completedExercises, exerciseId])
      );
    }
  };

  return { completeExercise };
};

const TARGET_RHYTHM = 1000; // 1 second interval in ms
const TOTAL_ROUNDS = 10;

export const MindBodySync = ({ onNavigate }: MindBodySyncProps) => {
  const { completeExercise } = useExerciseProgress();
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [lastTap, setLastTap] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [pulse, setPulse] = useState(false);
  const pulseInterval = useRef<number | null>(null);


  // Start the pulsing animation when active
  useEffect(() => {
    if (isActive && !isComplete) {
      timer = setTimeout(() => {
        setPulse((prev) => !prev);
      }, TARGET_RHYTHM);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isActive, isComplete]);

  const calculateTimingScore = (tapTime: number, targetTime: number) => {
    const difference = Math.abs(tapTime - targetTime);
    if (difference < 100) return 2; // Perfect
    if (difference < 300) return 1; // Good
    return 0; // Miss
  };

  const handleTap = () => {
    if (!isActive || isComplete) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTap;
    
    if (lastTap > 0) {
      const timingScore = calculateTimingScore(timeSinceLastTap, TARGET_RHYTHM);
      
      // Update feedback
      if (timingScore === 2) {
        setFeedback('Perfect! 🎯');
      } else if (timingScore === 1) {
        setFeedback('Good! 👍');
      } else {
        setFeedback('Missed 😕');
      }
      
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 800);
      
      // Update score and round
      setScore((prev) => prev + timingScore);
      setRound((prev) => {
        const newRound = prev + 1;
        if (newRound >= TOTAL_ROUNDS) {
          handleComplete();
          return newRound;
        }
        return newRound;
      });
    }
    
    setLastTap(now);
  };

  const startExercise = () => {
    setIsActive(true);
    setRound(0);
    setScore(0);
    setLastTap(0);
    setIsComplete(false);
    setShowReward(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    completeExercise('mind-body-sync');
    setIsComplete(true);
    setShowReward(true);
    // Auto-navigate back after showing reward
    setTimeout(() => {
      onNavigate('meditation');
    }, 2000);
  };

  const handleBack = () => {
    onNavigate('meditation');
  };

  const resetExercise = () => {
    setIsActive(false);
    setIsComplete(false);
    setRound(0);
    setScore(0);
    setLastTap(0);
    setShowReward(false);
  };

  const getPulseSize = () => {
    return pulse ? 'scale-100' : 'scale-90';
  };

  return (
    <motion.div 
      className="relative h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ExerciseLayout
        title="Mind Body Sync"
        subtitle="Find your rhythm"
        backgroundImage="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg"
        overlayColor="bg-serenity/60"
        onBack={handleBack}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {!isActive && !isComplete ? (
            <div className="text-center">
              <p className="mb-6 text-gray-700">
                Tap the circle in sync with the pulsing rhythm to connect your mind and body.
              </p>
              <button
                onClick={startExercise}
                className="px-8 py-3 bg-serenity text-white rounded-full font-medium shadow-lg hover:bg-serenity/90 transition-colors"
              >
                Start
              </button>
            </div>
          ) : (
            <div className="text-center w-full">
              {/* Progress */}
              <div className="mb-8">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {round} / {TOTAL_ROUNDS}
                </div>
                <div className="text-sm text-gray-600">Taps</div>
                <div className="mt-2 text-lg font-semibold text-gray-800">
                  Score: {score}
                </div>
              </div>

              {/* Pulsing Circle */}
              <div 
                onClick={handleTap}
                className={`relative w-64 h-64 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-transform duration-300 mx-auto ${getPulseSize()}`}
                style={{
                  boxShadow: '0 0 40px rgba(214, 229, 250, 0.5)',
                }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-white/30" />
                
                {showFeedback ? (
                  <div className="text-2xl font-bold text-gray-800 animate-bounce">
                    {feedback}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl">👆</div>
                    <div className="mt-2 text-sm text-gray-700">Tap in rhythm</div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center text-sm text-gray-600">
                {isActive ? (
                  <p>Tap the circle in time with the pulse</p>
                ) : (
                  <p>Exercise complete! Tap below to restart</p>
                )}
              </div>

              {/* Controls */}
              <div className="mt-8 flex justify-center gap-4">
                {isComplete ? (
                  <button
                    onClick={startExercise}
                    className="px-6 py-2 bg-serenity text-white rounded-full font-medium shadow hover:bg-serenity/90 transition-colors"
                  >
                    Try Again
                  </button>
                ) : (
                  <button
                    onClick={resetExercise}
                    className="px-6 py-2 bg-white/20 text-gray-700 rounded-full font-medium hover:bg-white/30 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Reward Message */}
              {showReward && (
                <div className="mt-6 p-4 bg-white/30 backdrop-blur-sm rounded-lg text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    🎉 +10 Points Earned!
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your sync score: {score}/{TOTAL_ROUNDS * 2}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </ExerciseLayout>
    </motion.div>
  );
};

export default MindBodySync;
