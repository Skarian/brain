export function updateUploadAction(globalState, payload) {
  return {
    ...globalState,
    upload: [...payload],
  };
}
