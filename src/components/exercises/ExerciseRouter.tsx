import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

// Lazy load the exercise components with named exports
const QuickCalm = lazy(() => import('./QuickCalm').then(module => ({ default: module.QuickCalm })));
const StretchAndFocus = lazy(() => import('./StretchAndFocus'));
const MindBodySync = lazy(() => import('./MindBodySync').then(module => ({ default: module.MindBodySync })));
const ReflectionJournal = lazy(() => import('./ReflectionJournal'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-gray-600">Loading exercise...</div>
  </div>
);

export const ExerciseRouter = ({ onNavigate }: { onNavigate: () => void }) => {
  const location = useLocation();

  // Handle back navigation to the exercises screen
  const handleBack = () => {
    onNavigate();
  };

    // Wrapper components to handle the onBack prop with proper typing
  const QuickCalmWrapper = () => (
    <QuickCalm onNavigate={handleBack} />
  );

  // StretchAndFocus doesn't use onNavigate, so we don't pass it
  const StretchAndFocusWrapper = () => (
    <StretchAndFocus />
  );

  // MindBodySync doesn't use onNavigate, so we don't pass it
  const MindBodySyncWrapper = () => (
    <MindBodySync />
  );

  // ReflectionJournal doesn't use onNavigate, so we don't pass it
  const ReflectionJournalWrapper = () => (
    <ReflectionJournal />
  );

  // Get the current exercise ID from the URL
  const exerciseId = location.pathname.split('/').pop() || '';

  // Render the appropriate exercise component based on the URL
  const renderExercise = () => {
    switch(exerciseId) {
      case 'quick-calm':
        return <QuickCalmWrapper />;
      case 'stretch-focus':
        return <StretchAndFocusWrapper />;
      case 'mind-body-sync':
        return <MindBodySyncWrapper />;
      case 'reflection-journal':
        return <ReflectionJournalWrapper />;
      default:
        return <QuickCalmWrapper />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        {renderExercise()}
      </AnimatePresence>
    </Suspense>
  );
};
