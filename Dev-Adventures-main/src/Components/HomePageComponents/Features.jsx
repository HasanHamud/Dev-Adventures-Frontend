function Features() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-700 text-white text-stroke-3 font-bold shadow-lg bg-opacity-45 ">
      <h1 className="text-4xl py-12">What We Offer</h1>
      <div className="flex flex-row justify-around w-full mt-auto mb-auto">
        <div className="flex hover:bg-sky-700 transition-all hover:scale-105 hover:rotate-6 hover:border-sky-700 flex-col items-center border border-white py-10 rounded-2xl w-72 h-72 shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2980/2980218.png"
            className="w-24 h-24 "
          ></img>
          <h1 className="text-lg mt-10 mx-5">Cost Efficient Learning</h1>
          <h1 className="text-lg">Platform</h1>
        </div>

        <div className="flex flex-col hover:bg-sky-700 transition-all hover:scale-105 hover:rotate-6 hover:border-sky-700 items-center border border-white py-10 rounded-2xl w-72 h-72 shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5344/5344646.png"
            className="w-24 h-24"
          ></img>
          <h1 className="text-lg mt-10 mx-5">Connecting Talents With</h1>
          <h1 className="text-lg">Recruiters</h1>
        </div>

        <div className="flex hover:bg-sky-700 transition-all hover:scale-105 hover:rotate-6 hover:border-sky-700 flex-col items-center border border-white py-10 rounded-2xl w-72 h-72 mb-5 shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5088/5088218.png"
            className="w-24 h-24"
          ></img>
          <h1 className="text-lg mt-10 mx-5">Comprehensive Roadmaps</h1>
          <h1 className="text-lg">For All Levels</h1>
        </div>
      </div>
    </div>
  );
}

export default Features;
