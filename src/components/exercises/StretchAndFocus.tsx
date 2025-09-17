import { useState, useEffect } from 'react';
import { useExerciseProgress } from '../../hooks/useExerciseProgress';
import { ExerciseLayout } from './ExerciseLayout';

type StretchStep = {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: number;
};

const STRETCHES: StretchStep[] = [
  {
    id: 1,
    title: 'Neck Rolls',
    description: 'Gently roll your head in a circular motion, first clockwise then counter-clockwise.',
    image: 'https://images.pexels.com/photos/8534776/pexels-photo-8534776.jpeg',
    duration: 30,
  },
  {
    id: 2,
    title: 'Shoulder Stretch',
    description: 'Bring one arm across your body and gently pull it with your other hand.',
    image: 'https://images.pexels.com/photos/4056725/pexels-photo-4056725.jpeg',
    duration: 30,
  },
  {
    id: 3,
    title: 'Seated Twist',
    description: 'Twist your torso to one side while keeping your back straight.',
    image: 'https://images.pexels.com/photos/7530003/pexels-photo-7530003.jpeg',
    duration: 30,
  },
  {
    id: 4,
    title: 'Forward Fold',
    description: 'Bend forward from your hips, keeping your back straight.',
    image: 'https://images.pexels.com/photos/6787407/pexels-photo-6787407.jpeg',
    duration: 30,
  },
];

const StretchAndFocus = () => {
  const { completeExercise } = useExerciseProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STRETCHES[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const currentStretch = STRETCHES[currentStep];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (currentStep < STRETCHES.length - 1) {
        // Move to next stretch
        setCurrentStep((prev) => prev + 1);
        setTimeLeft(STRETCHES[currentStep + 1].duration);
      } else {
        // All stretches complete
        handleComplete();
      }
    }

    return () => clearInterval(interval);
  }, [timeLeft, isActive, currentStep]);

  const startExercise = () => {
    setIsActive(true);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setTimeLeft(STRETCHES[0].duration);
    setIsActive(false);
    setIsComplete(false);
    setShowReward(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    completeExercise('stretch-focus');
    setShowReward(true);
  };

  const handleNext = () => {
    if (currentStep < STRETCHES.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setTimeLeft(STRETCHES[currentStep + 1].duration);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimeLeft(STRETCHES[currentStep - 1].duration);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Use a single background image for the entire component
  const backgroundImage = 'https://images.pexels.com/photos/4775198/pexels-photo-4775198.jpeg';
  
  return (
    <ExerciseLayout
      title="Stretch & Focus"
      subtitle="Gentle stretching with mindfulness"
      backgroundImage={backgroundImage}
      overlayColor="bg-black/60"
      onBack={() => {}}
    >
      <div className="flex flex-col h-full">
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {STRETCHES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep
                  ? 'bg-sage w-6'
                  : index < currentStep
                  ? 'bg-sage/50'
                  : 'bg-white/30'
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* Stretch Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6 border border-white/10">
          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden shadow-md">
            <img
              src={currentStretch.image}
              alt={currentStretch.title}
              className="w-full h-48 object-cover rounded-lg transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {currentStretch.title}
          </h3>
          <p className="text-white/90 mb-4">{currentStretch.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-white/80 bg-black/20 px-3 py-1 rounded-full">
              {currentStep + 1} of {STRETCHES.length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-auto flex flex-col space-y-3">
          {!isComplete ? (
            <>
              {!isActive ? (
                <button
                  onClick={startExercise}
                  className="w-full py-3 bg-sage text-white rounded-full font-medium shadow-lg hover:bg-sage/90 transition-all transform hover:scale-105 active:scale-95"
                >
                  {currentStep === 0 ? 'Start Stretching' : 'Resume'}
                </button>
              ) : (
                <button
                  onClick={pauseExercise}
                  className="w-full py-3 bg-amber-500 text-white rounded-full font-medium shadow-lg hover:bg-amber-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  Pause
                </button>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex-1 py-2 rounded-full font-medium transition-colors ${
                    currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-2 bg-white/20 text-gray-700 rounded-full font-medium hover:bg-white/30 transition-colors"
                >
                  {currentStep === STRETCHES.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                🎉 Stretching Complete!
              </div>
              <p className="text-gray-600 mb-4">
                Great job taking care of your body and mind.
              </p>
              <button
                onClick={resetExercise}
                className="w-full py-3 bg-sage text-white rounded-full font-medium shadow-lg hover:bg-sage/90 transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Reward Message */}
        {showReward && (
          <div className="mt-4 p-4 bg-white/30 backdrop-blur-sm rounded-lg text-center">
            <div className="text-lg font-semibold text-gray-800">
              🎉 +10 Points Earned!
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You've completed your stretching routine!
            </p>
          </div>
        )}
      </div>
    </ExerciseLayout>
  );
};

export default StretchAndFocus;
