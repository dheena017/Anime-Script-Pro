import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';
import { FormLabel } from './FormLabel';
import { ErrorMessage } from './ErrorMessage';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Assuming you have an API endpoint for forgot password
      await axios.post('/api/auth/forgot-password', { email });
      setSuccessMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'An error occurred during password reset'
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={Mail}
        />
      </div>

      <ErrorMessage error={errorMessage} />
      
      {successMessage && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs text-center font-medium">
          {successMessage}
        </div>
      )}

      <div className="pt-2">
        <SubmitButton loading={isLoading}>
          Send Reset Link
        </SubmitButton>
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-studio transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </button>
      </div>
    </form>
  );
}



