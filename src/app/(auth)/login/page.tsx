'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define the validation schema with Zod
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(3, { message: "Password must be at least 3 characters long." }),
});

// Infer the TypeScript type from the schema
type LoginFormInputs = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  console.log("")

  // 2. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  // 3. This function is called only after successful client-side validation
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        router.push('/'); // Redirect on successful login
        router.refresh(); // Refresh server components to reflect auth state
      } else {
        // Set a form-level error returned from the API
        setError('root.serverError', {
          type: 'manual',
          message: result.error || 'Login failed. Invalid credentials.',
        });
      }
    } catch (err) {
      setError('root.serverError', {
          type: 'manual',
          message: 'An unexpected error occurred. Please try again.',
        });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sky-700">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to SolarSchools.</p>
        </div>

        {/* Display server-side or general form errors */}
        {errors.root?.serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>{errors.root.serverError.message}</span>
          </div>
        )}

        {/* 4. Use the handleSubmit wrapper from react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400 h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                // 5. Register the input field
                {...register('email')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {/* 6. Display validation error for the email field */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {`Don't have an account? `}
          <Link href="/register" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;