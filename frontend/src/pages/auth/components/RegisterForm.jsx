import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, User } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { SubmitButton } from './SubmitButton';
import { FormLabel } from './FormLabel';
import { ErrorMessage } from './ErrorMessage';

export function RegisterForm() {
  const [fullName, setFullName] = useState('Dev User');
  const [email, setEmail] = useState('email@gmail.com');
  const [password, setPassword] = useState('password');
  const [confirmPassword, setConfirmPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await axios.post('/api/auth/register', { 
        name: fullName, 
        email, 
        password 
      });
      // Redirect to login or auto-login
      navigate('/login');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <FormLabel htmlFor="fullName">Full Name</FormLabel>
        <InputField
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          icon={User}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="email">Email Address</FormLabel>
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
        <FormLabel htmlFor="password">Password</FormLabel>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div className="pt-2">
        <SubmitButton isLoading={isLoading}>
          Create Account
        </SubmitButton>
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
          Already have an account?{' '}
          <span 
            className="text-studio hover:underline cursor-pointer transition-all"
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>
      </div>
    </form>
  );
}
