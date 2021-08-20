import React, { useState } from 'react';
import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import firebase from './firebase/client';
import toast from 'react-hot-toast';
import Content from './Content';

const Approved = ({ isKM }) => {
  const navigation = isKM ? ['Search', 'Projects', 'KM'] : ['Search', 'Projects'];
  const [currentPage, setCurrentPage] = useState('Search');
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 pb-32">
        <Disclosure
          as="nav"
          className="bg-blue-600 border-b border-blue-300 border-opacity-25 lg:border-none"
        >
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-blue-400 lg:border-opacity-25">
                  <div className="px-2 flex items-center lg:px-0">
                    <div className="flex-shrink-0">
                      <div className="inline-flex align-middle justify-center">
                        <h1 className="text-center text-2xl">🧠</h1>
                        <h1 className="text-center text-2xl font-bold text-white ml-2">
                          CSO Brain
                        </h1>
                      </div>
                    </div>
                    <div className="hidden lg:block lg:ml-10">
                      <div className="flex space-x-4">
                        {navigation.map((item, itemIdx) =>
                          item === currentPage ? (
                            <Fragment key={item}>
                              <button className="bg-blue-700 text-white rounded-md py-2 px-3 text-sm font-medium">
                                {item}
                              </button>
                            </Fragment>
                          ) : (
                            <button
                              key={item}
                              onClick={() => setCurrentPage(item)}
                              className="text-white hover:bg-blue-500 hover:bg-opacity-75 rounded-md py-2 px-3 text-sm font-medium"
                            >
                              {item}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {currentPage === 'Search' ? (
                    <div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">
                      <div className="max-w-lg w-full lg:max-w-xs">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-gray-400 focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <SearchIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <input
                            id="search"
                            className="block w-full bg-white py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white focus:border-white sm:text-sm"
                            placeholder="Search"
                            type="search"
                            name="search"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-blue-600 p-2 rounded-md inline-flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:block lg:ml-4">
                    <div className="flex items-center">
                      <button
                        className="bg-red-600 hover:bg-red-700 flex-shrink-0 rounded-lg p-2 text-red-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white"
                        onClick={signOut}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                {({ close }) => (
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navigation.map((item, itemIdx) =>
                      currentPage === item ? (
                        <Fragment key={item}>
                          {/* Current: "bg-blue-700 text-white", Default: "text-white hover:bg-blue-500 hover:bg-opacity-75" */}
                          <Disclosure.Button className="text-left w-full bg-blue-700 text-white block rounded-md py-2 px-3 text-base font-medium">
                            {item}
                          </Disclosure.Button>
                        </Fragment>
                      ) : (
                        <button
                          key={item}
                          onClick={() => {
                            setCurrentPage(item);
                            close();
                          }}
                          className="w-full text-left text-white hover:bg-blue-500 hover:bg-opacity-75 block rounded-md py-2 px-3 text-base font-medium"
                        >
                          {item}
                        </button>
                      )
                    )}
                    <Fragment>
                      {/* Current: "bg-blue-700 text-white", Default: "text-white hover:bg-blue-500 hover:bg-opacity-75" */}
                      <button
                        onClick={() => {
                          signOut();
                        }}
                        className="bg-red-600 hover:bg-red-700 hover:text-white text-red-100 block rounded-md py-2 px-3 text-base font-medium w-full text-left"
                      >
                        Signout
                      </button>
                    </Fragment>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">{currentPage}</h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="h-96 border-4 border-dashed border-gray-200 rounded-lg">
              <Content page={currentPage} />
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
};

export default Approved;
