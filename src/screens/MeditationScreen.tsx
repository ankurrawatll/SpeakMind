// src/screens/MeditationScreen.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  image: string;
  color: string;
  icon: string;
}

const exercises: Exercise[] = [
  {
    id: 'quick-calm',
    title: 'Quick Calm',
    description: '5-minute breathing exercise',
    category: 'breathing',
    duration: 5,
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    color: 'from-teal-500/90 to-emerald-600/90',
    icon: '🧘‍♂️',
  },
  {
    id: 'stretch-focus',
    title: 'Stretch & Focus',
    description: 'Gentle stretching with mindfulness',
    category: 'movement',
    duration: 10,
    image: 'https://images.pexels.com/photos/3768918/pexels-photo-3768918.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    color: 'from-amber-500/90 to-orange-600/90',
    icon: '🧘‍♀️',
  },
  {
    id: 'mind-body-sync',
    title: 'Mind Body Sync',
    description: 'Connect your mind and body',
    category: 'mindfulness',
    duration: 15,
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    color: 'from-indigo-500/90 to-violet-600/90',
    icon: '🎯',
  },
  {
    id: 'reflection-journal',
    title: 'Reflection Journal',
    description: 'Write one thought to clear your mind',
    category: 'reflection',
    duration: 3,
    image: 'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    color: 'from-rose-500/90 to-pink-600/90',
    icon: '📝',
  },
];

interface MeditationScreenProps {
  onNavigate?: (screen: any) => void;
}

const MeditationScreen = ({ onNavigate }: MeditationScreenProps = {}) => {
  const [progress, setProgress] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('dailyExerciseProgress');
    if (savedProgress) {
      const { completed } = JSON.parse(savedProgress);
      setProgress(completed.length);
    }
  }, []);

  const handleExercisePress = (exerciseId: string) => {
    if (onNavigate) {
      // Map exercise IDs to screen names
      const exerciseScreenMap: Record<string, string> = {
        'quick-calm': 'exercise-quick-calm',
        'stretch-focus': 'exercise-stretch-focus',
        'mind-body-sync': 'exercise-mind-body-sync',
        'reflection-journal': 'exercise-reflection-journal'
      };
      
      const screenName = exerciseScreenMap[exerciseId];
      if (screenName) {
        onNavigate(screenName);
      } else {
        console.log('Exercise not found:', exerciseId);
      }
    } else {
      console.log('Navigate to exercise:', exerciseId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Removed back button to save space */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2" 
          alt="Peaceful meditation background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Simple Header */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-gray-800">Mindful Moments</h1>
          <p className="text-gray-600 mt-1">Find your calm, one breath at a time</p>
        </div>

        {/* Progress Container - Dark Glassmorphism */}
        <div className="px-6 py-4">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white/90">Daily Progress</span>
              <span className="text-sm font-semibold text-white">{progress} of 4</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${(progress / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">
                Complete {4 - progress} more to complete today's goal
              </span>
              <span className="text-sm font-medium text-white">
                {Math.round((progress / 4) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="px-6 py-4 grid grid-cols-1 gap-4">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              onClick={() => handleExercisePress(exercise.id)}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl overflow-hidden h-40 flex items-end p-4 cursor-pointer transform transition-all hover:scale-[1.02]"
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={exercise.image}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${exercise.color.replace('from-', 'bg-gradient-to-t from-').replace('to-', ' to-')} opacity-80`} />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white text-lg font-semibold">{exercise.title}</h3>
                    <p className="text-white/80 text-sm">{exercise.description}</p>
                  </div>
                  {/* Play Button */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-gray-700 ml-0.5"
                    >
                      <path 
                        d="M8 5v14l11-7z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-white/80">
                  <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                    {exercise.duration} min
                  </span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{exercise.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MeditationScreen
