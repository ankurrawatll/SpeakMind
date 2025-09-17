import { useState, useEffect } from 'react';
import { useExerciseProgress } from '../../hooks/useExerciseProgress';
import { ExerciseLayout } from './ExerciseLayout';

type JournalEntry = {
  id: string;
  date: string;
  content: string;
  mood: string;
};

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😕', label: 'Unsure' },
  { emoji: '😔', label: 'Down' },
];

const ReflectionJournal = () => {
  const { completeExercise } = useExerciseProgress();
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  // Load saved entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('journalEntries');
    if (saved) {
      setSavedEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    if (savedEntries.length > 0) {
      localStorage.setItem('journalEntries', JSON.stringify(savedEntries));
    }
  }, [savedEntries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim() || !selectedMood) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: entry,
      mood: selectedMood,
    };

    setSavedEntries((prev) => [newEntry, ...prev]);
    setEntry('');
    setSelectedMood('');
    setIsSubmitted(true);
    completeExercise('reflection-journal');
    setShowReward(true);
    setShowPrompt(false);
  };

  const startNewEntry = () => {
    setIsSubmitted(false);
    setShowReward(false);
    setShowPrompt(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ExerciseLayout
      title="Reflection Journal"
      subtitle="Express your thoughts"
      backgroundImage="https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg"
      overlayColor="bg-linen/70"
    >
      <div className="flex flex-col h-full">
        {showPrompt && !isSubmitted && (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Today I feel...
              </h2>
              
              {/* Mood Selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Select your current mood:</p>
                <div className="flex justify-between">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.emoji}
                      type="button"
                      onClick={() => setSelectedMood(mood.emoji)}
                      className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                        selectedMood === mood.emoji
                          ? 'bg-sand/50'
                          : 'hover:bg-white/20'
                      }`}
                    >
                      <span className="text-3xl mb-1">{mood.emoji}</span>
                      <span className="text-xs text-gray-600">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Entry */}
              <div className="mb-6">
                <label
                  htmlFor="journal-entry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  What's on your mind today?
                </label>
                <textarea
                  id="journal-entry"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Today I feel..."
                  className="w-full h-40 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-sand focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                disabled={!entry.trim() || !selectedMood}
                className={`w-full py-3 rounded-full font-medium shadow-lg transition-colors ${
                  entry.trim() && selectedMood
                    ? 'bg-sand text-gray-800 hover:bg-sand/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Reflection
              </button>
            </div>
          </form>
        )}

        {isSubmitted && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-md w-full">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Reflection Saved
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for taking a moment to reflect. Your thoughts are valuable.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={startNewEntry}
                  className="w-full py-3 bg-sand text-gray-800 rounded-full font-medium hover:bg-sand/90 transition-colors"
                >
                  Write Another Entry
                </button>
                
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showHistory ? 'Hide Journal History' : 'View Journal History'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journal History */}
        {showHistory && savedEntries.length > 0 && (
          <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-800 mb-3">Your Journal Entries</h4>
            <div className="space-y-4">
              {savedEntries.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white/70 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{item.mood}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for History */}
        {showHistory && savedEntries.length === 0 && (
          <div className="mt-6 text-center py-8 bg-white/50 backdrop-blur-sm rounded-2xl">
            <p className="text-gray-500">No journal entries yet</p>
          </div>
        )}

        {/* Reward Message */}
        {showReward && (
          <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg text-center">
            <div className="text-lg font-semibold text-gray-800">
              🎉 +10 Points Earned!
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You've taken a moment to reflect. Well done!
            </p>
          </div>
        )}
      </div>
    </ExerciseLayout>
  );
};

export default ReflectionJournal;
