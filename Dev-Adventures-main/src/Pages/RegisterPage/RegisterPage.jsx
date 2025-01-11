import RegisterForm from '../../Components/RegisterComponents/RegisterForm';
import logos from '../../Assets/images/logo3.png';

const RegisterPage = () => {
  return (
    <div 
      className="flex items-center justify-center h-screen bg-gray-900 text-gray-200" 
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/60-lines.png')" }}
    >
      {/* Centered Container */}
      <div className="flex w-[90%] max-w-4xl rounded-lg overflow-hidden">
        
        {/* Left Section with Logo and Illustration */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-blue-600 p-8 text-center">
          <img src={logos} alt="Illustration" className="h-64 mb-4" />
          <blockquote className="font-bold text-white italic text">
              The beautiful thing about learning is that nobody can take it away from you.
              <br /> - Hasan Hammoud
            </blockquote>
        </div>

        {/* Right Section with Centered Sign Up Form */}
          <div className="w-1/2 flex justify-center items-center bg-gray-800 p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
