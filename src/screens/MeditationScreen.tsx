// src/screens/MeditationScreen.tsx
import { useEffect } from 'react';
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
  // Load progress from localStorage (for future use)
  useEffect(() => {
    const savedProgress = localStorage.getItem('dailyExerciseProgress');
    if (savedProgress) {
      // Progress tracking available for future features
    }
  }, []);

  const handleExercisePress = (exerciseId: string) => {
    if (onNavigate) {
      // Map exercise IDs to screen names
      const exerciseScreenMap: Record<string, string> = {
        'quick-calm': 'exercise-quick-calm',
        'stretch-focus': 'exercise-stretch-focus',
        'mind-body-sync': 'exercise-mind-body-sync',
        'reflection-journal': 'journal'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Content */}
      <div className="relative">
        {/* Simple Header */}
        <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-4 md:pb-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="w-8 md:w-10"></div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-center">Mindful Moments</h1>
            <button
              onClick={() => onNavigate('profile')}
              className="p-1.5 md:p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              onClick={() => handleExercisePress(exercise.id)}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-xl md:rounded-2xl overflow-hidden h-36 md:h-40 lg:h-44 flex items-end p-4 md:p-6 cursor-pointer shadow-sm"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={exercise.image}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-semibold mb-0.5 md:mb-1">{exercise.title}</h3>
                    <p className="text-white/90 text-xs md:text-sm mb-1.5 md:mb-2">{exercise.description}</p>
                    <div className="flex items-center text-[10px] md:text-xs text-white/80">
                      <div className="bg-white/20 backdrop-blur px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-0.5 md:gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white md:w-3 md:h-3">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{exercise.duration} Min</span>
                      </div>
                    </div>
                  </div>
                  {/* Play Button */}
                  <div className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg">
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-purple-800 ml-0.5 md:w-4 md:h-4"
                    >
                      <path 
                        d="M8 5v14l11-7z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default MeditationScreen
