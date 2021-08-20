import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import firebase from 'firebase/app';
import 'firebase/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [isSignup, setIsSignUp] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onLogin = (data) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        toast.success(`You have signed in as ${data.email}!`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onSignup = (data) =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        toast.success('Account created! Please contact Neil Skaria to be approved for access!');
      })
      .catch((error) => {
        toast.error(error.message);
      });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-center text-8xl">🧠</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? 'Sign up for an account' : 'Log in to your account'}
          </h2>
          <div className="mt-2 text-sm text-gray-600 inline-flex">
            Or{' '}
            <div className="inline-flex">
              <button
                className="cursor-pointer ml-1 font-medium text-blue-600 hover:text-blue-500"
                onClick={() => {
                  setIsSignUp(!isSignup);
                }}
              >
                {isSignup ? 'log in to your account' : 'sign up for an account'}
                {/* sign up for an account */}
              </button>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(isSignup ? onSignup : onLogin)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email', { required: true })}
                id="email"
                name="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <span className="inline-flex items-center text-red-500">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" /> {message}
                  </span>
                )}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password', { required: true })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <span className="inline-flex items-center text-red-500">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" /> {message}
                  </span>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('rememberme')}
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                  aria-hidden="true"
                />
              </span>
              {isSignup ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
