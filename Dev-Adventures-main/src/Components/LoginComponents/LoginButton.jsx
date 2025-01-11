import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');  
  };

  return (
    <button
      className="ml-2 px-4 py-2 bg-yellow-500 text-white border border-yellow-500 rounded hover:bg-yellow-600 hover:border-yellow-600"
      onClick={handleLoginClick}
    >
      Login
    </button>
  );
};

export default LoginButton;
