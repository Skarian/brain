import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import fetch from 'isomorphic-unfetch';

const schema = Yup.object().shape({
  pptx: Yup.mixed()
    .required('You need to provide a file')
    .test('name', 'File is required', (value) => {
      return value[0] && value[0].name !== '';
    })
    .test('fileSize', 'The file is too large. Must be less than 100MB', (value) => {
      return value[0] && value[0].size <= 100000000;
    })
    .test('fileType', 'File must be a Powerpoint file (.pptx)', (value) => {
      return value[0] && value[0].name.substr(-4) === 'pptx';
    }),
});

const Upload = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('pptx', data.pptx[0]);
    // const res = await axios
    //   // .post('http://localhost:5000/upload', formData, {
    //   // .post('http://backend:5000/upload', formData, {
    //   .post('http://frontend:80/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       Authorization: `${process.env.REACT_APP_HASURA}`,
    //     },
    //   })
    //   .then((res) => res);
    // console.log(res);
    fetch('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `${process.env.REACT_APP_HASURA}`,
      },
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full flex flex-col items-center space-y-5 py-5">
      <h1 className="font-bold text-3xl">Upload files to the CSO Brain!</h1>
      <p className="text-sm italic">Please talk to the KM lead before proceeding!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="border-2 rounded-lg flex flex-col items-center p-3">
            <input
              {...register('pptx', { required: true })}
              name="pptx"
              type="file"
              accept=".pptx"
            />
          </label>
          <ErrorMessage
            errors={errors}
            name="pptx"
            render={({ message }) => (
              <span className="inline-flex items-center text-red-500">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" /> {message}
              </span>
            )}
          />
        </div>
        <button className="border-2 bg-blue-100">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
