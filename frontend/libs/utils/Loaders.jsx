export const ImageUploadLoader = () => {
  return (
    <>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-2 text-blue-500">Uploading...</p>
    </>
  );
};

export const RecordingLoader = () => {
  return (
    <>
      <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
      <p className="ml-2 text-red-500">Recording...</p>
    </>
  );
};
