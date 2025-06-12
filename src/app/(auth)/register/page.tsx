'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, User, Lock, Mail, AlertCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define the validation schema with Zod, including password matching
const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set the error on the confirmPassword field
});

// Infer the TypeScript type from the schema
type RegisterFormInputs = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const { register: registerUser } = useAuth(); // Renamed to avoid conflict with react-hook-form's register
  const router = useRouter();

  // 2. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(RegisterSchema),
  });

  // 3. This function is called only after successful client-side validation
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        alert('Registration successful! Please proceed to log in.');
        router.push('/login');
      } else {
        // Set a form-level error for issues like "email already exists"
        setError('root.serverError', {
          type: 'manual',
          message: result.error || 'Registration failed. Please try again.',
        });
      }
    } catch (err) {
       setError('root.serverError', {
          type: 'manual',
          message: 'An unexpected server error occurred.',
        });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-100 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <UserPlus className="w-8 h-8 text-white" />
           </div>
          <h1 className="text-3xl font-bold text-green-700">Create Account</h1>
          <p className="text-gray-600 mt-2">Join SolarSchools to make an impact.</p>
        </div>

        {errors.root?.serverError && (
           <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm flex items-center space-x-2">
             <AlertCircle size={18} />
             <span>{errors.root.serverError.message}</span>
           </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-gray-400 h-5 w-5" />
              </div>
              <input id="name" type="text" autoComplete="name" {...register('name')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400 h-5 w-5" />
              </div>
              <input id="email" type="email" autoComplete="email" {...register('email')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 h-5 w-5" />
              </div>
              <input id="password" type="password" autoComplete="new-password" {...register('password')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Minimum 8 characters"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 h-5 w-5" />
              </div>
              <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm transition-colors ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;