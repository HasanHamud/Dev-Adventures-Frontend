
function Foot(){
    return(
    <div className="w-full h-72 flex flex-row items-center  text-white text-stroke-3 font-bold mt-5 ">
    
    <div className="flex flex-col w-1/2 mb-auto mt-3 gap-10 ml-5">    
    <p className="text-xl">Contact Us</p>
    <p className="text-xl">Email:...</p>
    </div>

    <div className="flex flex-row w-1/2 justify-between p-3 mb-auto mt-3 mr-5">
    <div className="flex flex-col items-center space-y-7">
    <p className="text-xl">About us</p>
    <a>History</a>
    <a>Team Members</a>
    <a>Feedback</a>
    </div>
    <div className="flex flex-col items-center space-y-7">
    <p className="text-xl">Tutorials</p>
    <a>C++ Basics</a>
    <a>Python Basics</a>
    <a>Algorithms and Data Structures</a>
    </div>
    <div className="flex flex-col items-center space-y-7">
    <p className="text-xl">Legal</p>
    <a>Sharing</a>
    <a>Privacy</a>
    <a>Terms</a>
    </div>
  

    </div>
    
    </div>
    )
}
export default Foot;