import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseFile } from '../lib/parser';

interface FileState {
  jobDescription: {
    file: File | null;
    content: string | null;
  };
  resume: {
    file: File | null;
    content: string | null;
  };
  apiKey: string | null;
  agencyName: string;
  logoText: string;
  showSettings: boolean;
  setJobDescription: (file: File) => Promise<void>;
  setResume: (file: File) => Promise<void>;
  setApiKey: (key: string) => void;
  setAgencyName: (name: string) => void;
  setLogoText: (text: string) => void;
  setShowSettings: (show: boolean) => void;
  reset: () => void;
}

export const useStore = create<FileState>()(
  persist(
    (set) => ({
      jobDescription: {
        file: null,
        content: null,
      },
      resume: {
        file: null,
        content: null,
      },
      apiKey: null,
      agencyName: 'Neev',
      logoText: 'NEEV',
      showSettings: false,
      setJobDescription: async (file: File) => {
        try {
          const content = await parseFile(file);
          set({
            jobDescription: {
              file,
              content,
            },
          });
        } catch (error) {
          console.error('Error parsing job description:', error);
          throw error;
        }
      },
      setResume: async (file: File) => {
        try {
          const content = await parseFile(file);
          set({
            resume: {
              file,
              content,
            },
          });
        } catch (error) {
          console.error('Error parsing resume:', error);
          throw error;
        }
      },
      setApiKey: (key: string) => set({ apiKey: key }),
      setAgencyName: (name: string) => set({ agencyName: name }),
      setLogoText: (text: string) => set({ logoText: text }),
      setShowSettings: (show: boolean) => set({ showSettings: show }),
      reset: () => {
        set({
          jobDescription: {
            file: null,
            content: null,
          },
          resume: {
            file: null,
            content: null,
          },
        });
      },
    }),
    {
      name: 'resume-assessment-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        agencyName: state.agencyName,
        logoText: state.logoText,
      }),
    }
  )
);