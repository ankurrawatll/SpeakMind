import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import type { Screen } from '../../App';

interface StretchAndFocusProps {
  onNavigate: (screen: Screen) => void;
}

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

const StretchAndFocus = ({ onNavigate }: StretchAndFocusProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STRETCHES[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentStretch = STRETCHES[currentStep];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
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
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    // Auto-navigate back after 2 seconds
    setTimeout(() => {
      onNavigate('meditation');
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < STRETCHES.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setTimeLeft(STRETCHES[currentStep + 1].duration);
      setIsActive(false);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimeLeft(STRETCHES[currentStep - 1].duration);
      setIsActive(false);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
          <h1 className="text-lg font-semibold text-gray-900">Stretch & Focus</h1>
          <p className="text-sm text-gray-500">Gentle stretching with mindfulness</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        {/* Exercise Image */}
        <div className="bg-gray-100 rounded-2xl mb-6 overflow-hidden">
          <img
            src={currentStretch.image}
            alt={currentStretch.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Exercise Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStretch.title}
          </h2>
          <p className="text-gray-600 mb-4">
            {currentStretch.description}
          </p>
          
          {/* Timer */}
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {isComplete ? "Complete!" : formatTime(timeLeft)}
          </div>
          
          {/* Progress indicator */}
          <div className="text-sm text-gray-500 mb-6">
            {currentStep + 1} of {STRETCHES.length}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {STRETCHES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-purple-500 w-6'
                  : index < currentStep
                  ? 'bg-purple-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="mb-6">
          {!isComplete ? (
            !isActive ? (
              <button
                onClick={startExercise}
                className="w-full py-4 bg-gray-600 text-white rounded-full text-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Start Stretching
              </button>
            ) : (
              <button
                onClick={pauseExercise}
                className="w-full py-4 bg-amber-500 text-white rounded-full text-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Pause
              </button>
            )
          ) : (
            <button
              onClick={resetExercise}
              className="w-full py-4 bg-gray-600 text-white rounded-full text-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex-1 py-3 rounded-full border text-center transition-colors ${
              currentStep === 0
                ? 'border-gray-200 text-gray-400 bg-gray-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
          >
            {currentStep === STRETCHES.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StretchAndFocus;
