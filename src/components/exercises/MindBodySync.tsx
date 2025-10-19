import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import type { Screen } from '../../App';

interface MindBodySyncProps {
  onNavigate: (screen: Screen) => void;
}

const TARGET_RHYTHM = 1000; // 1 second interval in ms
const TOTAL_ROUNDS = 10;

const MindBodySync = ({ onNavigate }: MindBodySyncProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [lastTap, setLastTap] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Start the pulsing animation when active
  useEffect(() => {
    let pulseInterval: ReturnType<typeof setInterval>;
    
    if (isActive && !isComplete) {
      pulseInterval = setInterval(() => {
        setPulse((prev) => !prev);
      }, TARGET_RHYTHM);
    }

    return () => {
      if (pulseInterval) {
        clearInterval(pulseInterval);
      }
    };
  }, [isActive, isComplete, pulse]);

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
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    // Auto-navigate back after 2 seconds
    setTimeout(() => {
      onNavigate('meditation');
    }, 2000);
  };

  const resetExercise = () => {
    setIsActive(false);
    setIsComplete(false);
    setRound(0);
    setScore(0);
    setLastTap(0);
    setShowFeedback(false);
  };

  const renderInitialScreen = () => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('meditation')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Mind Body Sync</h1>
          <p className="text-sm text-gray-500">Find your rhythm</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20 flex flex-col">
        {/* Exercise Image */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-6 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg"
            alt="Mind Body Sync"
            className="w-full h-64 object-cover mix-blend-overlay"
          />
        </div>

        {/* Description */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">
            Tap the circle in sync with the pulsing rhythm to connect your mind and body.
          </p>
        </div>

        {/* Start Button */}
        <div className="mt-auto">
          <button
            onClick={startExercise}
            className="w-full py-4 bg-purple-500 text-white rounded-full text-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveScreen = () => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('meditation')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Mind Body Sync</h1>
          <p className="text-sm text-gray-500">Find your rhythm</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20 flex flex-col items-center justify-center">
        {/* Progress */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Tap: {round} / {TOTAL_ROUNDS}
          </div>
        </div>

        {/* Pulsing Circle */}
        <div className="mb-8">
          <div 
            onClick={handleTap}
            className={`w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center cursor-pointer transition-transform duration-300 ${
              pulse ? 'scale-105' : 'scale-100'
            } shadow-lg border-4 border-yellow-400`}
          >
            {showFeedback ? (
              <div className="text-2xl font-bold text-gray-800 animate-bounce">
                {feedback}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">👆</div>
                <div className="text-sm text-gray-700 font-medium">Tap in Rhythm</div>
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <div className="text-lg font-semibold text-gray-900">
            Score: {score}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Tap the circle in time with the pulse
          </p>
        </div>

        {/* Start Button */}
        <div className="w-full max-w-sm">
          <button
            onClick={startExercise}
            className="w-full py-4 bg-purple-500 text-white rounded-full text-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Start
          </button>
        </div>

        {/* Reset Button (when exercise is active) */}
        {(isActive || round > 0) && !isComplete && (
          <div className="w-full max-w-sm mt-4">
            <button
              onClick={resetExercise}
              className="w-full py-3 bg-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        )}

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
            <div className="text-lg font-semibold text-green-800 mb-2">
              🎉 Exercise Complete!
            </div>
            <p className="text-green-600 mb-4">
              Your sync score: {score}/{TOTAL_ROUNDS * 2}
            </p>
            <button
              onClick={resetExercise}
              className="px-6 py-2 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isActive && round === 0) {
    return renderInitialScreen();
  }

  return renderActiveScreen();
};

export default MindBodySync;
