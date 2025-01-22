export const PreviewSection = () => (
  <div className="relative bg-gray-700 h-96 rounded-lg flex items-center justify-center">
    <button className="bg-black/50 text-white px-6 py-3 rounded-lg backdrop-blur-sm flex items-center space-x-2">
      <span>▶</span>
      <span>Watch Preview</span>
    </button>
    <div className="absolute top-4 left-4">
      <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
        InProgress
      </span>
    </div>
  </div>
);
