import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, LogIn, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          isResumeUploaded: false
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-after-delay') {
        // Silently handle popup closed by user
        return;
      }
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://picsum.photos/seed/nebula/1920/1080')] opacity-5 mix-blend-overlay grayscale" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card border-2 border-primary/10 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5 text-center space-y-8 backdrop-blur-sm bg-card/80">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center mx-auto ring-4 ring-primary/5">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold tracking-tight">AI Campus Copilot</h1>
              <p className="text-muted-foreground">Your AI-Powered BTech Career Copilot</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Sign in to access personalized features
              </p>
              
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 rounded-full" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          <div className="pt-8 border-t border-primary/5 grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">AI</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground opacity-60">Tutoring</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">ATS</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground opacity-60">Scoring</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">Road</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground opacity-60">Maps</div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-muted-foreground opacity-50 px-8">
          By signing in, you agree to our terms of service and academic integrity policies.
        </p>
      </motion.div>
    </div>
  );
}
