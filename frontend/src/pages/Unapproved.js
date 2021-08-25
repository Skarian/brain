import React from 'react';
import firebase from '../firebase/client';
import toast from 'react-hot-toast';

const Unapproved = ({ user }) => {
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        toast.success('Successfully signed out!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <a href="/" className="inline-flex">
            <span className="sr-only">Workflow</span>
            <h1 className="text-center text-8xl">🧠</h1>
          </a>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">CSO Brain</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl pb-5">
              User not authorized
            </h1>
            <p className="mt-2 text-base text-gray-500 italic pb-5">Your account: {user.email}</p>
            <p className="mt-2 text-base text-gray-500">
              You have not been approved to use this application.
            </p>
            <p className="mt-2 text-base text-gray-500">
              Please e-mail or message Neil Skaria to be approved.
            </p>
            <div className="mt-6 mb-6">
              <a
                href="mailto:neil.skaria@dell.com"
                className="text-base font-medium text-blue-600 hover:text-blue-500"
              >
                E-mail Neil<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 flex-shrink-0 rounded-lg p-2 text-red-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Unapproved;
