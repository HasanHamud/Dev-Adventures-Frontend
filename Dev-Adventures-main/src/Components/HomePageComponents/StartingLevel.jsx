function Level({ title, feature1, feature2, feature3 }) {
  return (
    <div className="relative text-gray-100 mt-5 flex flex-col w-1/4 min-h-[320px] rounded-xl overflow-hidden bg-black hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-center py-6 px-4 border-b border-gray-700">{title}</h1>
      
      {/* Features Section */}
      <div className="flex-grow p-6">
        <ul className="space-y-4">
          <li className="flex items-start space-x-3">
            <span className="inline-block w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
            <span className="text-lg">{feature1}</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
            <span className="text-lg">{feature2}</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="inline-block w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
            <span className="text-lg">{feature3}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Level;