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
    <div className="min-h-screen bg-white relative pb-20">
      {/* Content */}
      <div className="relative">
        {/* Simple Header */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Mindful Moments</h1>
        </div>

        {/* Exercise Grid */}
        <div className="px-6 space-y-4">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              onClick={() => handleExercisePress(exercise.id)}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl overflow-hidden h-40 flex items-end p-6 cursor-pointer shadow-sm"
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
                    <h3 className="text-white text-xl font-semibold mb-1">{exercise.title}</h3>
                    <p className="text-white/90 text-sm mb-2">{exercise.description}</p>
                    <div className="flex items-center text-xs text-white/80">
                      <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{exercise.duration} Min</span>
                      </div>
                    </div>
                  </div>
                  {/* Play Button */}
                  <div className="bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-gray-800 ml-0.5"
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
  )
}

export default MeditationScreen
