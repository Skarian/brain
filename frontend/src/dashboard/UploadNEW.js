// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';
// import { ErrorMessage } from '@hookform/error-message';
// import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/solid';
// import { yupResolver } from '@hookform/resolvers/yup';
// import fetch from 'isomorphic-unfetch';
// import { Disclosure } from '@headlessui/react';
// import { ChevronUpIcon } from '@heroicons/react/solid';

// const schema = Yup.object().shape({
//   pptx: Yup.mixed()
//     .required('You need to provide a file')
//     .test('name', 'File is required', (value) => {
//       return value[0] && value[0].name !== '';
//     })
//     .test('fileSize', 'The file is too large. Must be less than 100MB', (value) => {
//       return value[0] && value[0].size <= 100000000;
//     })
//     .test('fileType', 'File must be a Powerpoint file (.pptx)', (value) => {
//       return value[0] && value[0].name.substr(-4) === 'pptx';
//     }),
// });

// const UploadNEW = () => {
//   const [filesToUpload, setFilesToUpload] = useState([{ name: '', description: '' }]);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });

//   const onSubmit = async (data) => {
//     console.log(data);
//     // const formData = new FormData();
//     // formData.append('pptx', data.pptx[0]);
//     // fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:5000/upload' : '/upload', {
//     //   method: 'POST',
//     //   body: formData,
//     //   headers: {
//     //     Authorization: `${process.env.REACT_APP_HASURA}`,
//     //   },
//     // })
//     //   .then((data) => console.log(data))
//     //   .catch((err) => console.log(err));
//   };
//   return (
//     <div className="w-full flex flex-col items-center space-y-5 py-5">
//       <h1 className="font-bold text-3xl">Upload files to the CSO Brain!</h1>
//       <p className="text-sm italic">Please talk to the KM lead before proceeding!</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="w-full px-10 space-y-5">
//         <div className="w-full">
//           {filesToUpload.map((file, key) => {
//             return (
//               <Disclosure>
//                 {({ open }) => (
//                   <>
//                     <Disclosure.Button
//                       className={`flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 ${
//                         open ? 'rounded-tr-lg rounded-tl-lg' : 'rounded-lg'
//                       }`}
//                     >
//                       <span>What is your refund policy?</span>
//                       <ChevronUpIcon
//                         className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`}
//                       />
//                     </Disclosure.Button>
//                     <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 border-2 rounded-br-lg rounded-bl-lg">
//                       <div>
//                         <label className="border-2 rounded-lg flex flex-col items-center p-3">
//                           <input
//                             {...register('pptx', { required: true })}
//                             name="pptx"
//                             type="file"
//                             accept=".pptx"
//                           />
//                         </label>
//                         <ErrorMessage
//                           errors={errors}
//                           name="pptx"
//                           render={({ message }) => (
//                             <span className="inline-flex items-center text-red-500">
//                               <ExclamationCircleIcon className="h-4 w-4 mr-1" /> {message}
//                             </span>
//                           )}
//                         />
//                       </div>
//                     </Disclosure.Panel>
//                   </>
//                 )}
//               </Disclosure>
//             );
//           })}
//           <div className="w-full flex justify-center my-5">
//             <button
//               type="button"
//               className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               onClick={() => {
//                 setFilesToUpload([...filesToUpload, { name: '', description: '' }]);
//               }}
//             >
//               <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
//               Add file for upload
//             </button>
//           </div>
//         </div>
//         <button type="submit" className="border-2 bg-blue-100">
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadNEW;

import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FileInput from './components/fileinput';

const UploadNEW = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const methods = useForm();
  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    toast.success('Beginning upload now...');
    setIsUploading(true);
    console.log('FORM DATA:');
    console.log(data);
    console.log('FILE DATA');
    console.log(files);
    files.forEach((file, index) => {
      const formData = new FormData();
      formData.append('pptx', file);
      formData.append('category', data[index].category);
      formData.append('contact', data[index].contact);
      formData.append('description', data[index].description);
      formData.append('project_id', data[index].project);
      fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:5000/upload' : '/upload', {
        method: 'POST',
        body: formData,
      })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    });
  };

  return (
    <div>
      {isUploading ? (
        <div>Uploading...</div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
            <FileInput draggedFiles={files} setDraggedFiles={setFiles} />
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default UploadNEW;
