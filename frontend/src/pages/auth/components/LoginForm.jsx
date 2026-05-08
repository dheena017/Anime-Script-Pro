import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { Checkbox } from './Checkbox';
import { SubmitButton } from './SubmitButton';
import { FormLabel } from './FormLabel';
import { ErrorMessage } from './ErrorMessage';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('email@gmail.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await login(email, password, rememberMe);
      
      // If there's a redirected 'from' location, go there, otherwise go to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || err.response?.data?.message || err.message || 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <FormLabel htmlFor="email">Enter your Email Address</FormLabel>
        <InputField
          id="email"
          name="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={Mail}
        />
      </div>

      <div className="space-y-2">
        <FormLabel 
          htmlFor="password" 
          rightElement={
            <span 
              className="text-[9px] uppercase font-bold text-zinc-700 hover:text-studio cursor-pointer transition-colors"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot
            </span>
          }
        >
          Enter your Password
        </FormLabel>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="pt-2 pb-1">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          label="Remember Me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </div>

      <ErrorMessage error={errorMessage} />

      <SubmitButton loading={isLoading}>
        Establish Connection
      </SubmitButton>

      {/* System Diagnostics Footer */}
      <div className="pt-6 border-t border-zinc-900 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[8px] uppercase font-black text-zinc-600 tracking-[0.2em]">Link Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-400">ENCRYPTED_AES256</span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[8px] uppercase font-black text-zinc-600 tracking-[0.2em]">Neural Sync</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[9px] font-bold text-zinc-400">99.8% READY</span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
          New Architect?{' '}
          <span 
            className="text-studio hover:underline cursor-pointer transition-all"
            onClick={() => navigate('/register')}
          >
            Initialize Account
          </span>
        </p>
      </div>
    </form>
  );
}
