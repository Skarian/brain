import React from 'react';

const Unapproved = ({ user }) => {
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
            <div className="mt-6">
              <a
                href="mailto:neil.skaria@dell.com"
                className="text-base font-medium text-blue-600 hover:text-blue-500"
              >
                E-mail Neil<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Unapproved;
