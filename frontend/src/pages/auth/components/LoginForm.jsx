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
        Access System
      </SubmitButton>

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
