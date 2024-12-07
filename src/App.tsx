import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { AssessButton } from './components/AssessButton';
import { AssessmentResult } from './components/AssessmentResult';
import { SettingsModal } from './components/SettingsModal';
import { analyzeResume } from './lib/openai';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase/client';
import type { Assessment } from './types';

function App() {
  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { 
    jobDescription, 
    resume,
    apiKey,
    setJobDescription, 
    setResume 
  } = useStore();

  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || '',
            picture: session.user.user_metadata?.avatar_url
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  const handleAssess = async () => {
    if (!jobDescription.content || !resume.content || !apiKey) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeResume(
        resume.content,
        jobDescription.content,
        apiKey
      );
      setAssessment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed');
      console.error('Assessment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SettingsModal />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <UploadSection
          onJobDescriptionUpload={setJobDescription}
          onResumeUpload={setResume}
        />

        <div className="mt-8">
          <AssessButton
            onClick={handleAssess}
            disabled={!jobDescription.content || !resume.content || !apiKey || isLoading}
            isLoading={isLoading}
            assessment={assessment}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">
              {error}
            </p>
          )}
        </div>

        <div className="mt-8">
          <AssessmentResult assessment={assessment} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;