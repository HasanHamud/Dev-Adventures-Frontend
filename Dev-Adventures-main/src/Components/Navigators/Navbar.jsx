
function Navbar() {
    return (
      <div className="fixed top-0 left-0 w-full  py-3 z-50 shadow-md">
        <div className="flex flex-row justify-between items-center container mx-auto px-5">
          <div className="flex space-x-4">
            <button className="text-yellow-500 text-xl hover:text-yellow-600">About</button>
            <button className="text-yellow-500 text-xl hover:text-yellow-600">Services</button>
            <button className="text-yellow-500 text-xl hover:text-yellow-600">Contact</button>
          </div>
  
          <div className="flex space-x-4">
            
            <button className="px-4 py-2 bg-yellow-500 text-white border border-yellow-500 rounded hover:bg-yellow-600 hover:border-yellow-600">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Navbar;
  