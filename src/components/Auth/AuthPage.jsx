import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage = ({ onSuccess }) => {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'

  return (
    <div className="w-full">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Analyzer</h1>
        <p className="text-gray-600">Sign in to save your progress</p>
      </div>

      {/* Auth Forms */}
      {mode === 'signin' ? (
        <SignIn onToggleMode={() => setMode('signup')} onSuccess={onSuccess} />
      ) : (
        <SignUp onToggleMode={() => setMode('signin')} onSuccess={onSuccess} />
      )}

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default AuthPage;

