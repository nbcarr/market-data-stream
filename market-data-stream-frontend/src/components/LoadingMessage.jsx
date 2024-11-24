function LoadingMessage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mb-4"></div>
        <div className="text-blue-500 text-xl">
          Waiting for data to arrive...
        </div>
      </div>
    </div>
  );
}

export default LoadingMessage;
