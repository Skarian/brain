import React, { useState } from 'react';
import { FileDrop } from 'react-file-drop';
import toast from 'react-hot-toast';
import ConfirmModal from './confirmModal';
import { ChevronUpIcon, CloudUploadIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { gql, useQuery } from '@apollo/client';
import Loading from '../../pages/Loading';

const GET_PROJECTS = gql`
  query FindProjects {
    projects(order_by: { number: asc }) {
      number
      name
      id
      created_at
    }
  }
`;

const FileInput = ({ draggedFiles, setDraggedFiles }) => {
  const [isDragged, setIsDragged] = useState(false);
  const [modal, setModal] = useState('');
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { loading, error, data } = useQuery(GET_PROJECTS);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    console.log(error);
    toast.error(
      'Issue retrieving project data, error logged to console, click F12 to see it and tell Neil about it'
    );
    return <Loading />;
  }
  if (data) {
    return (
      <>
        <div className="w-full h-full">
          <FileDrop
            className="w-full h-full"
            targetClassName="w-full h-full"
            onFrameDragEnter={() => setIsDragged(true)}
            onFrameDragLeave={() => setIsDragged(false)}
            onFrameDrop={() => setIsDragged(false)}
            onDragLeave={() => setIsDragged(false)}
            onDragOver={() => setIsDragged(true)}
            onDrop={(files) => {
              const allowedFiles = [...files].filter((file) => {
                if (
                  file.type ===
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ) {
                  return file;
                } else {
                  return null;
                }
              });
              const disallowedFiles = [...files].filter((file) => {
                if (
                  file.type !==
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ) {
                  return file;
                } else {
                  return null;
                }
              });
              if (disallowedFiles.length > 0) {
                toast.error('You can only submit Powerpoint files');
              }
              const filesToSet = Array.from(draggedFiles).concat(Array.from(allowedFiles));
              function removeDuplicates(myArr, prop) {
                return myArr.filter((obj, pos, arr) => {
                  return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
                });
              }
              const names = filesToSet.map((file) => file.name);
              if (new Set(names).size !== names.length) {
                toast.error('You are not allowed to upload duplicate files.');
              }
              setDraggedFiles(removeDuplicates(filesToSet, 'name'));
              setIsDragged(false);
            }}
          >
            {isDragged ? (
              <div className="bg-blue-100 min-h-screen w-full flex flex-col justify-center items-center space-y-10 rounded-lg z-0 pointer-events-none select-none">
                <CloudUploadIcon className="h-20 w-20 text-blue-500" />
                <p className="text-2xl font-bold uppercase text-blue-500">
                  DROP FILES HERE TO UPLOAD
                </p>
                <p className="text-lg uppercase text-blue-500">Only PPTX files are allowed</p>
              </div>
            ) : (
              <div className="w-full h-full space-y-5">
                <div className="text-center space-y-5 flex w-full h-full items-center align-middle justify-center">
                  <div className="max-w-xl space-y-5">
                    <p className="text-2xl font-bold pt-5">
                      Welcome to the Knowledge Management Page
                    </p>
                    <p className="italic">Only authenticated users are allowed here</p>
                    <p className="text-left">
                      To upload files to the CSO Brain, go ahead and "drop" the files on this page.
                      You are required to fill out information about each document and will be
                      unable to upload without doing so
                    </p>
                    <p className="text-left">
                      If the page gets frozen during the drag and drop, try uploading a non-pptx
                      file to fix it.
                    </p>
                    <p></p>
                  </div>
                </div>
                {draggedFiles.length > 0 ? (
                  <div>
                    {draggedFiles.map((file, indexMap) => {
                      return (
                        <div className="w-full px-4" key={file.name}>
                          <div className="min-w-full max-w-md p-2 mx-auto bg-white rounded-2xl">
                            <Disclosure>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    className={`flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 rounded-t-lg`}
                                  >
                                    <span>{file.name}</span>
                                  </Disclosure.Button>
                                  <Disclosure.Panel
                                    className={`px-4 pt-4 pb-2 text-sm text-gray-500 border-2 border-gray-200 rounded-b-lg`}
                                    static
                                  >
                                    {({ close }) => (
                                      <>
                                        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                                          <div>
                                            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200">
                                                <label
                                                  htmlFor="description"
                                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                                >
                                                  Description
                                                </label>

                                                <div className="mt-1 sm:mt-0 sm:col-span-2 mb-4">
                                                  <textarea
                                                    name="description"
                                                    rows={3}
                                                    className={`max-w-lg shadow-sm block w-full  sm:text-sm border border-gray-300 rounded-md  ${
                                                      errors[indexMap]?.description &&
                                                      ' ring ring-red-600 ring-offset-4 ring-offset-red-100'
                                                    }`}
                                                    defaultValue={''}
                                                    {...register(`${indexMap}.description`, {
                                                      required:
                                                        'A description for this file is required',
                                                      minLength: {
                                                        value: 100,
                                                        message:
                                                          'The description must be atleast 100 characters long',
                                                      },
                                                    })}
                                                  />
                                                  {!errors[indexMap]?.description && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                      Required: Write a few sentences about this
                                                      file. The more the better!
                                                    </p>
                                                  )}
                                                  <ErrorMessage
                                                    errors={errors}
                                                    name={`${indexMap}.description`}
                                                    render={({ message }) => (
                                                      <p className="inline-flex items-center mt-2 text-sm text-red-500">
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />{' '}
                                                        {message}
                                                      </p>
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="space-y-6 sm:space-y-5">
                                              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                                <label
                                                  htmlFor="contact"
                                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                                >
                                                  Contact
                                                </label>
                                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                  <input
                                                    type="text"
                                                    name="contact"
                                                    className={`max-w-lg block w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                                                      errors[indexMap]?.contact &&
                                                      ' ring ring-red-600 ring-offset-4 ring-offset-red-100'
                                                    }`}
                                                    {...register(`${indexMap}.contact`, {
                                                      required:
                                                        'An email address for contacting is required',
                                                      pattern: {
                                                        value:
                                                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                        message:
                                                          'Please enter a valid email address',
                                                      },
                                                    })}
                                                  />
                                                  {!errors[indexMap]?.contact && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                      Optional: Provide a contact for further
                                                      follow-up
                                                    </p>
                                                  )}
                                                  <ErrorMessage
                                                    errors={errors}
                                                    name={`${indexMap}.contact`}
                                                    render={({ message }) => (
                                                      <p className="inline-flex items-center mt-2 text-sm text-red-500">
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />{' '}
                                                        {message}
                                                      </p>
                                                    )}
                                                  />
                                                </div>
                                              </div>

                                              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                                <label
                                                  htmlFor="project"
                                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                                >
                                                  Project
                                                </label>
                                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                  <select
                                                    id="project"
                                                    name="project"
                                                    className={`max-w-lg block w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                                                      errors[indexMap]?.project &&
                                                      ' ring ring-red-600 ring-offset-4 ring-offset-red-100'
                                                    }`}
                                                    {...register(`${indexMap}.project`, {
                                                      required: 'Select one option',
                                                      validate: {
                                                        check: (v) =>
                                                          v !== 'pre-selected' ||
                                                          'Please select an option',
                                                      },
                                                    })}
                                                    defaultValue="pre-selected"
                                                  >
                                                    <option disabled value="pre-selected">
                                                      -- select an option --
                                                    </option>
                                                    {data.projects.map((project) => {
                                                      return (
                                                        <option
                                                          key={project.id}
                                                          value={project.id}
                                                        >{`${project.number} -  ${project.name}`}</option>
                                                      );
                                                    })}
                                                  </select>
                                                  {!errors[indexMap]?.project && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                      Required: Assign this file to an existing
                                                      project
                                                    </p>
                                                  )}
                                                  <ErrorMessage
                                                    errors={errors}
                                                    name={`${indexMap}.project`}
                                                    render={({ message }) => (
                                                      <p className="inline-flex items-center mt-2 text-sm text-red-500">
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />{' '}
                                                        {message}
                                                      </p>
                                                    )}
                                                  />
                                                </div>
                                              </div>

                                              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                                <label
                                                  htmlFor="category"
                                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                                >
                                                  File Category
                                                </label>
                                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                                  <select
                                                    name="category"
                                                    className={`max-w-lg block  w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                                                      errors[indexMap]?.category &&
                                                      ' ring ring-red-600 ring-offset-4 ring-offset-red-100'
                                                    }`}
                                                    {...register(`${indexMap}.category`, {
                                                      required: 'Select one option',
                                                      validate: {
                                                        check: (v) =>
                                                          v !== 'pre-selected' ||
                                                          'Please select an option',
                                                      },
                                                    })}
                                                    defaultValue="pre-selected"
                                                  >
                                                    <option disabled value="pre-selected">
                                                      -- select an option --
                                                    </option>
                                                    <option>Executive Read-out</option>
                                                    <option>Internal Research</option>
                                                    <option>Appendix</option>
                                                  </select>
                                                  {!errors[indexMap]?.category && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                      Required: This makes the file filterable
                                                      during search
                                                    </p>
                                                  )}
                                                  <ErrorMessage
                                                    errors={errors}
                                                    name={`${indexMap}.category`}
                                                    render={({ message }) => (
                                                      <p className="inline-flex items-center mt-2 text-sm text-red-500">
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />{' '}
                                                        {message}
                                                      </p>
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="pt-5">
                                          <div className="flex justify-end">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setModal(file.name);
                                                close();
                                              }}
                                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                            <ConfirmModal
                              modalState={modal}
                              setModalState={setModal}
                              name={file.name}
                              action={() =>
                                setDraggedFiles(
                                  draggedFiles.filter((file, index) => index !== indexMap)
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-center pt-10">
                      <button
                        type="submit"
                        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 bg-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <div className="w-72 h-72 border-8 border-grey-200 border-dashed flex justify-center items-center text-center">
                      <p className="text-gray-400 font-bold">
                        TRY DROPPING <br />
                        SOMETHING HERE
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FileDrop>
        </div>
      </>
    );
  }
};

export default FileInput;
