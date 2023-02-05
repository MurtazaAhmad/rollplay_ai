const LoadingDots = () => {
  return (
    <div className="flex justify-center py-4 space-x-1">
      <div className="w-1.5 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
      <div className="w-1.5 delay-100 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
      <div className="w-1.5 delay-200 bg-gray-400 rounded-full aspect-square animate-bounce"></div>
    </div>
  );
};

export default LoadingDots;
