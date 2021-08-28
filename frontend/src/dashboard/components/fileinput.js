import React, { useState, useEffect } from 'react';
import { FileDrop } from 'react-file-drop';
import toast from 'react-hot-toast';
import ConfirmModal from './confirmModal';
import { useStateMachine } from 'little-state-machine';

function updateUploadAction(globalState, payload) {
  return {
    ...globalState,
    upload: [...payload],
  };
}

const FileInput = () => {
  const { state } = useStateMachine();
  const { actions } = useStateMachine({
    updateUploadAction,
  });
  const [isDragged, setIsDragged] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState(state.upload);
  const [modal, setModal] = useState('');

  useEffect(() => {
    console.log('FILE STATE:');
    console.log(draggedFiles);
    console.log('GLOBAL STATE');
    console.log(state.upload);
  }, [draggedFiles, state]);

  return (
    <FileDrop
      className=" w-full h-full"
      targetClassName="w-full h-full"
      draggingOverTargetClassName=" bg-gray-200"
      draggingOverFrameClassName="bg-gray-200"
      onFrameDragEnter={() => setIsDragged(true)}
      onFrameDragLeave={() => setIsDragged(false)}
      onFrameDrop={() => {
        setIsDragged(false);
      }}
      onDrop={(files) => {
        const allowedFiles = [...files].filter((file) => {
          if (
            file.type ===
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ) {
            return file;
          }
        });
        const disallowedFiles = [...files].filter((file) => {
          if (
            file.type !==
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ) {
            return file;
          }
        });
        if (disallowedFiles.length > 0) {
          toast.error('You can only submit Powerpoint files');
        }
        setDraggedFiles(Array.from(draggedFiles).concat(Array.from(allowedFiles)));
        actions.updateUploadAction(Array.from(draggedFiles).concat(Array.from(allowedFiles)));
      }}
    >
      {isDragged ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>-------------- DROP FILES HERE TO UPLOAD --------------</p>
        </div>
      ) : (
        draggedFiles.length > 0 &&
        draggedFiles.map((file, indexMap) => {
          return (
            <div className="flex" key={indexMap}>
              <p key={file}>{file.name}</p>
              {/* <p key={file}>This is a file </p> */}
              <button
                type="button"
                onClick={() => {
                  setModal(file.name);

                  // setDraggedFiles(draggedFiles.filter((file, index) => index !== indexMap));
                }}
              >
                Delete
              </button>
              <ConfirmModal
                modalState={modal}
                setModalState={setModal}
                name={file.name}
                action={() =>
                  setDraggedFiles(draggedFiles.filter((file, index) => index !== indexMap))
                }
              />
            </div>
          );
        })
      )}
    </FileDrop>
  );
};

export default FileInput;
